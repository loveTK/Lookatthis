# Graph Report - Lookatthis  (2026-09-19)

## Corpus Check
- 55 files · ~11,133 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 231 nodes · 507 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `85a014b9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- [slug]/page.tsx
- getLang
- compilerOptions
- createPost
- postPath
- actions.ts
- admin.ts
- login/page.tsx
- Look At This — Claude Code 작업 지침
- Look At This
- scripts
- AGENTS.md
- postcss.config.mjs
- db-test.sh

## God Nodes (most connected - your core abstractions)
1. `getLang()` - 31 edges
2. `t()` - 28 edges
3. `createClient()` - 28 edges
4. `next` - 22 edges
5. `compilerOptions` - 17 edges
6. `postPath()` - 15 edges
7. `PostPage()` - 12 edges
8. `Look At This — Claude Code 작업 지침` - 12 edges
9. `createPost()` - 11 edges
10. `feedWhere()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `절대 규칙` --references--> `supabaseAdmin()`  [INFERRED]
  CLAUDE.md → lib/supabase/admin.ts
- `구조` --references--> `safeSearch()`  [INFERRED]
  CLAUDE.md → lib/google.ts
- `구조` --references--> `reverseGeocode()`  [INFERRED]
  CLAUDE.md → lib/google.ts
- `구조` --references--> `translateText()`  [INFERRED]
  CLAUDE.md → lib/google.ts
- `signOut()` --calls--> `createClient()`  [EXTRACTED]
  app/actions.ts → lib/supabase/server.ts

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (31): eslintConfig, dependencies, next, react, react-dom, sharp, @supabase/ssr, @supabase/supabase-js (+23 more)

### Community 1 - "[slug]/page.tsx"
Cohesion: 0.14
Nodes (24): addComment(), report(), toggleVote(), GET(), contentType, OgImage(), size, generateMetadata() (+16 more)

### Community 2 - "getLang"
Cohesion: 0.14
Nodes (24): CityPage(), generateMetadata(), Props, generateMetadata(), Props, RegionPage(), Header(), PostCard() (+16 more)

### Community 3 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 4 - "createPost"
Cohesion: 0.18
Nodes (14): createPost(), UploadPage(), Loc, UploadForm(), 구조, KEY(), Place, reverseGeocode() (+6 more)

### Community 5 - "postPath"
Cohesion: 0.18
Nodes (13): HubJsonLd(), MapView(), Props, dynamic, sitemap(), postPath(), slugify(), CommentRow (+5 more)

### Community 6 - "actions.ts"
Cohesion: 0.19
Nodes (8): ActionState, createProfile(), setLang(), signOut(), HandleForm(), Onboarding(), nextConfig, next

### Community 7 - "admin.ts"
Cohesion: 0.25
Nodes (11): POST(), Order, parseOrder(), variantSlotsFromEnv(), verifySignature(), supabaseAdmin(), ref_node_assert, ref_node_crypto (+3 more)

### Community 8 - "login/page.tsx"
Cohesion: 0.24
Nodes (7): LoginForm(), google(), magic(), LoginPage(), supabaseBrowser(), config, @supabase/ssr

### Community 9 - "Look At This — Claude Code 작업 지침"
Cohesion: 0.17
Nodes (11): graphify, Look At This — Claude Code 작업 지침, 규칙 위치, 만들지 말 것 (백로그, 추가 시점), 명령, 스택 (바꾸지 말 것), 아직 검증 안 된 것 (키 없이 만들었음), 업로드 파이프라인 (순서 바꾸지 말 것) (+3 more)

### Community 10 - "Look At This"
Cohesion: 0.22
Nodes (8): Look At This, 구조, 규칙 위치, 스킵한 것 → 추가 시점, 실행, 외부 설정 (사람이 할 일), 운영, 테스트

### Community 11 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, db:test, dev, lint, start, test, typecheck

## Knowledge Gaps
- **92 isolated node(s):** `Props`, `Props`, `dynamic`, `Text`, `size` (+87 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 106 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `actions.ts` to `package.json`, `[slug]/page.tsx`, `getLang`, `createPost`, `postPath`, `login/page.tsx`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **Why does `Look At This — Claude Code 작업 지침` connect `Look At This — Claude Code 작업 지침` to `createPost`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `supabaseAdmin()` connect `admin.ts` to `Look At This — Claude Code 작업 지침`, `createPost`, `postPath`, `actions.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `Props`, `Props`, `dynamic` to the rest of the system?**
  _92 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1431451612903226 - nodes in this community are weakly interconnected._
- **Should `getLang` be split into smaller, more focused modules?**
  _Cohesion score 0.14112903225806453 - nodes in this community are weakly interconnected._