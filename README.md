# Look At This

지도 위에 자랑을 올리고, 추천과 $감정가(의견)로 동네 1등을 가리는 사이트. Next.js 16 + Supabase(PostGIS) + Google Maps.

## 실행
```
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

## 테스트
```
npm test                      # 결제 웹훅 서명/파싱 (node:test)
PGURL=postgres://postgres@localhost:5432 npm run db:test   # DB 규칙 (PostGIS 필요)
```

## 외부 설정 (사람이 할 일)
1. **Supabase**: 새 프로젝트 → SQL Editor에 `supabase/migrations/0001_init.sql`, `0002_feed.sql` 순서대로 실행 (`_auth_stub.sql`은 로컬 전용, 넣지 말 것). Authentication → Providers → Google 켜기, URL Configuration에 사이트 URL + `https://<도메인>/auth/callback` 등록.
2. **Google Cloud**: Maps JavaScript API(브라우저 키, referrer 제한), Geocoding·Cloud Vision·Cloud Translation API(서버 키) 활성화. Map ID 하나 생성(AdvancedMarker용).
3. **Lemon Squeezy**: 슬롯 1/5/10 상품 3개 → 체크아웃 링크와 variant id를 env에. Webhooks → URL `https://<도메인>/api/webhooks/payments`, 이벤트 `order_created`, 시크릿을 env에.
4. **Vercel**: env 전부 등록 후 배포. IP 위치 폴백은 Vercel 헤더(`x-vercel-ip-*`) 사용 → 다른 호스팅이면 `lib/geo.ts` 수정.
5. 배포 후 Search Console에 `/sitemap.xml` 제출.

## 구조
| 경로 | 역할 |
|---|---|
| `supabase/migrations/` | 스키마·트리거·뷰·RLS (규칙은 전부 DB) |
| `proxy.ts` | Supabase 세션 갱신 + 현재 경로 헤더 |
| `app/actions.ts` | 서버 액션: 프로필 생성, 업로드(리사이즈→SafeSearch→역지오코딩→Storage→insert), 추천, 댓글, 신고, 언어 |
| `lib/google.ts` | Vision / Geocoding / Translation REST 래퍼 (키 없으면 안전하게 생략) |
| `lib/translate.ts` | 열람 언어 번역 + `translations` 캐시 |
| `app/page.tsx` + `components/MapView.tsx` | 지도 홈 (URL 좌표 → IP 헤더 → 서울 순) |
| `app/p/[slug]/` | 게시물 상세(SSR), 감정가 분포, 댓글, JSON-LD, OG 이미지 |
| `app/city/[city]/[region]` | 허브 페이지 (ItemList JSON-LD) |
| `app/pricing`, `app/api/webhooks/payments` | 슬롯 구매, 웹훅 → `payments` insert → 트리거가 slots 증가 |
| `app/sitemap.ts`, `app/robots.ts` | 얇은 페이지(추천 0·감정 0) 제외 |

## 규칙 위치
| 규칙 | 어디서 |
|---|---|
| 인벤토리 초과 차단 | 트리거 `posts_before_insert` → `INVENTORY_FULL` |
| 1인 1표 / 본인 추천 금지 | `votes` PK / RLS `votes_insert_own` |
| 신고 3건 자동 숨김 | 트리거 `reports_auto_hide` |
| 결제 → 슬롯 증가, 중복 웹훅 무시 | 트리거 `payments_add_slots`, `payments.id` PK |
| 감정가 중앙값 / 3건 미만 대기 | 뷰 `post_stats` |
| 동네 1등 (GPS만) | 뷰 `region_leaders` |
| 셀프 slots 변경·숨김 복구 금지 | 트리거 `profiles_guard`, `content_guard` |

## 운영
- 신고/제재/숨김 해제: Supabase 대시보드 Table Editor에서 `posts.status`, `profiles.banned_until` 직접 수정
- 사용자 실시간 위치는 어디에도 저장하지 않음 (게시물 좌표만)

## 스킵한 것 → 추가 시점
- 영상: 사진 리텐션 확인 후
- 어드민 화면: 신고 하루 20건 넘으면
- 원문 언어 감지: 지금은 작성자 UI 언어를 원문 언어로 저장. 오번역 신고 생기면 Translation `detect` 추가
- MapLibre 전환: Google Maps 월 청구 $200 넘으면
- 국내 PG(토스): 국내 매출 30% 넘으면 `app/api/webhooks/` 에 핸들러 추가
