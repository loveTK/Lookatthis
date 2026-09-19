@AGENTS.md

# Look At This — Claude Code 작업 지침

## 이게 뭔가
지도 위에 자랑(사진 1장 + 글)을 올림 → 추천(▲) + 댓글 $감정가 → 동네 1등. 인벤토리 1칸 무료, 결제로 확장.
**$감정가는 의견이다. 거래·환전·출금 기능은 절대 만들지 않는다.**

## 스택 (바꾸지 말 것)
Next.js 16 App Router · TypeScript · Tailwind 4 / Supabase(Auth, Postgres+PostGIS, Storage, RLS) / Google Maps JS(`@vis.gl/react-google-maps`) / Google Vision·Geocoding·Translation **REST**(SDK 없음) / Lemon Squeezy(MoR) / Vercel.
새 의존성은 추가 전에 이유 한 줄 + 승인.

## 명령
```
npm run dev            # 개발
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm run build          # next build
npm test               # 웹훅 서명/파싱 (node:test)
PGURL=postgres://... npm run db:test   # DB 규칙 테스트 (PostGIS 필요)
```
변경 후 최소 `typecheck + lint + build`. DB 파일 건드리면 `db:test`도.

## 절대 규칙
1. 돈 오가는 기능 금지. 감정가 = 숫자 의견
2. 사용자 실시간 위치 저장 금지. 게시물 좌표만 저장, 텍스트 위치는 동네/도시까지
3. 비즈니스 규칙은 DB(트리거·제약·RLS)에 있다. 앱에 중복 검사 넣지 말 것 (아래 표)
4. 어드민 화면 없음. 신고/제재는 Supabase 대시보드
5. `supabaseAdmin()`(서비스 롤)은 Storage 업로드·번역 캐시·결제 웹훅·사이트맵에서만
6. 게시물·허브 페이지는 SSR 유지(SEO). 클라이언트 컴포넌트는 지도·폼 상호작용만
7. 마이그레이션은 새 파일 추가(`0003_*.sql`). 기존 파일 수정 금지
8. 최소 코드. 요청 없는 추상화·설정·스캐폴딩·"나중을 위한" 코드 금지

## 규칙 위치
| 규칙 | 어디서 |
|---|---|
| 인벤토리 초과 차단 | 트리거 `posts_before_insert` → 예외 `INVENTORY_FULL` |
| region_key 기본값(geohash5) | 같은 트리거 |
| 1인 1표 / 본인 추천 금지 | `votes` PK / RLS `votes_insert_own` |
| 신고 3건 자동 숨김 | 트리거 `reports_auto_hide` |
| 결제 → slots 증가, 중복 웹훅 무시 | 트리거 `payments_add_slots`, `payments.id` PK |
| 감정가 중앙값, 3건 미만 = 대기(null) | 뷰 `post_stats` |
| 동네 1등 (GPS 게시물만, 동률=선착) | 뷰 `region_leaders` |
| 셀프 slots 변경·숨김 복구 금지 | 트리거 `profiles_guard`, `content_guard` |
| 정지 계정 쓰기 차단 | 함수 `me_can_write()` in RLS |

## 구조
| 경로 | 역할 |
|---|---|
| `supabase/migrations/0001_init.sql` | 스키마·트리거·뷰·RLS |
| `supabase/migrations/0002_feed.sql` | `lat/lng/city_slug` 컬럼 + 앱이 읽는 `feed` 뷰 |
| `supabase/tests/` | SQL 테스트 3개 (`_auth_stub.sql`은 로컬 전용, Supabase에 넣지 말 것) |
| `proxy.ts` | Supabase 세션 갱신 + `x-pathname` 헤더 |
| `lib/supabase/{server,browser,admin}.ts` | 클라이언트 3종 |
| `lib/google.ts` | `safeSearch` `reverseGeocode` `translateText` — 키 없으면 안전 생략 |
| `lib/translate.ts` | 열람 언어 번역 + `translations` 캐시 |
| `lib/i18n.ts` + `messages/{en,ko}.json` | UI 문자열. 라이브러리 없음 |
| `lib/data.ts` | `feed` 뷰 쿼리 헬퍼 |
| `lib/payments.ts` | 웹훅 서명 검증·주문 파싱 (순수 함수, 테스트 있음) |
| `app/actions.ts` | 서버 액션 전부: 프로필, 업로드, 추천, 댓글, 신고, 언어 |
| `app/page.tsx` + `components/MapView.tsx` | 지도 홈. 좌표: URL → Vercel IP 헤더 → 서울 |
| `app/p/[slug]/` | 상세(SSR) + JSON-LD + OG 이미지 + 원문 토글 |
| `app/city/[city]/[region]/` | 허브 (ItemList JSON-LD) |
| `app/upload/`, `app/login/`, `app/onboarding/`, `app/pricing/`, `app/u/[handle]/` | 각 페이지 |
| `app/api/webhooks/payments/route.ts` | Lemon Squeezy 웹훅 |
| `app/sitemap.ts`, `app/robots.ts` | 얇은 페이지(추천0·감정0) 제외 |

## 업로드 파이프라인 (순서 바꾸지 말 것)
위치(GPS 폼값 → 없으면 IP 헤더) → 10MB 제한 → sharp 2000px + EXIF 제거 → SHA256 → Vision SafeSearch(adult/racy/violence ≥ LIKELY 거부) → 역지오코딩 → Storage 업로드(서비스 롤) → `posts` insert(**사용자 권한**: RLS + 인벤토리 트리거)

## 아직 검증 안 된 것 (키 없이 만들었음)
- Vision / Geocoding / Translation v2 / Lemon Squeezy `order_created` 응답 형식 → 첫 실호출 때 응답 로그로 확인, `lib/google.ts` `lib/payments.ts` 파싱 맞추기
- Vercel 외 호스팅이면 `lib/geo.ts`의 `x-vercel-ip-*` 헤더 교체
- Google Maps `colorScheme="DARK"`, Map ID(`NEXT_PUBLIC_GOOGLE_MAP_ID`) 없으면 AdvancedMarker 안 뜸

## 만들지 말 것 (백로그, 추가 시점)
영상(사진 리텐션 확인 후) · 어드민(신고 20건/일) · 원문 언어 감지(오번역 신고 시) · MapLibre(Maps 청구 $200/월) · 국내 PG(국내 매출 30%) · 팔로우·알림·DM·대댓글·부스트·구독(요청 시)

## 작업 방식
- 고치기 전에 관련 파일 전부 읽고 흐름 추적. 증상 아닌 원인 수정
- 코드 먼저, 설명은 3줄 이하. 뭘 스킵했고 언제 추가할지 한 줄

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
