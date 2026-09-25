# Graph Report - Lookatthis  (2026-09-25)

## Corpus Check
- 66 files · ~35,543 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 364 nodes · 658 edges · 28 communities (23 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3020720e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- [slug]/page.tsx
- getLang
- compilerOptions
- Appendix B - Canonical Sources (read these before reinventing)
- 4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)
- 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)
- payments.test.ts
- LoginForm.tsx
- [city]/page.tsx
- Look At This
- 9. AI TELLS (Forbidden Patterns)
- AGENTS.md
- postcss.config.mjs
- db-test.sh
- 11. REDESIGN PROTOCOL
- 3. DEFAULT ARCHITECTURE & CONVENTIONS
- 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS
- tasteskill: Anti-Slop Frontend Skill
- 0. BRIEF INFERENCE (Read the Room Before Anything Else)
- 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)
- 5. CONTEXT-AWARE PROACTIVITY
- 8. DARK MODE PROTOCOL
- 7. DIAL DEFINITIONS (Technical Reference)
- privacy/page.tsx
- app/page.tsx
- Look At This — Claude Code 작업 지침

## God Nodes (most connected - your core abstractions)
1. `getLang()` - 33 edges
2. `t()` - 30 edges
3. `createClient()` - 29 edges
4. `next` - 28 edges
5. `compilerOptions` - 17 edges
6. `tasteskill: Anti-Slop Frontend Skill` - 16 edges
7. `postPath()` - 15 edges
8. `Appendix B - Canonical Sources (read these before reinventing)` - 15 edges
9. `PostPage()` - 12 edges
10. `4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)` - 12 edges

## Surprising Connections (you probably didn't know these)
- `절대 규칙` --references--> `supabaseAdmin()`  [INFERRED]
  CLAUDE.md → lib/supabase/admin.ts
- `구조` --references--> `safeSearch()`  [INFERRED]
  CLAUDE.md → lib/google.ts
- `구조` --references--> `reverseGeocode()`  [INFERRED]
  CLAUDE.md → lib/google.ts
- `구조` --references--> `translateText()`  [INFERRED]
  CLAUDE.md → lib/google.ts
- `createPost()` --calls--> `ipLocation()`  [EXTRACTED]
  app/actions.ts → lib/geo.ts

## Import Cycles
- None detected.

## Communities (28 total, 5 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (39): eslintConfig, dependencies, next, react, react-dom, sharp, @supabase/ssr, @supabase/supabase-js (+31 more)

### Community 1 - "[slug]/page.tsx"
Cohesion: 0.09
Nodes (38): bubbleSize(), Cluster, ClusterMarkers(), clusterPosts(), gridSizeDeg(), MapView(), Props, PostCard() (+30 more)

### Community 2 - "getLang"
Cohesion: 0.09
Nodes (38): ActionState, addComment(), createProfile(), report(), setLang(), signOut(), toggleVote(), GET() (+30 more)

### Community 3 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 4 - "Appendix B - Canonical Sources (read these before reinventing)"
Cohesion: 0.09
Nodes (21): APPENDICES - Real Source-Backed Reference Material, Appendix A - Install Commands per Design System, Appendix B - Canonical Sources (read these before reinventing), Appendix C - Apple Liquid Glass: Honest Web Approximation, Apple Liquid Glass (Apple platforms only), Atlassian, Bootstrap, Carbon (+13 more)

### Community 5 - "4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)"
Cohesion: 0.17
Nodes (12): 4.10 Quotes & Testimonials, 4.11 Page Theme Lock (Light / Dark Mode Consistency), 4.1 Typography, 4.2 Color Calibration, 4.3 Layout Diversification, 4.4 Materiality, Shadows, Cards, 4.5 Interactive UI States, 4.6 Data & Form Patterns (+4 more)

### Community 6 - "10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)"
Cohesion: 0.20
Nodes (10): 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know), Animation Library Choice, Cards & Containers, Galleries & Media, Hero Paradigms, Layout & Grids, Micro-Interactions & Effects, Navigation & Menus (+2 more)

### Community 7 - "payments.test.ts"
Cohesion: 0.28
Nodes (10): POST(), Order, parseOrder(), variantSlotsFromEnv(), verifySignature(), ref_node_assert, ref_node_crypto, ref_node_test (+2 more)

### Community 8 - "LoginForm.tsx"
Cohesion: 0.29
Nodes (6): LoginForm(), google(), magic(), supabaseBrowser(), config, @supabase/ssr

### Community 9 - "[city]/page.tsx"
Cohesion: 0.29
Nodes (8): CityPage(), generateMetadata(), Props, generateMetadata(), Props, HubJsonLd(), generateMetadata(), feedWhere()

### Community 10 - "Look At This"
Cohesion: 0.22
Nodes (8): Look At This, 구조, 규칙 위치, 스킵한 것 → 추가 시점, 실행, 외부 설정 (사람이 할 일), 운영, 테스트

### Community 11 - "9. AI TELLS (Forbidden Patterns)"
Cohesion: 0.25
Nodes (8): 9.A Visual & CSS, 9. AI TELLS (Forbidden Patterns), 9.B Typography, 9.C Layout & Spacing, 9.D Content & Data ("Jane Doe" Effect), 9.E External Resources & Components, 9.F Production-Test Tells (banned outright), 9.G EM-DASH BAN (the single most-violated Tell)

### Community 15 - "11. REDESIGN PROTOCOL"
Cohesion: 0.29
Nodes (7): 11.A Detect the Mode (first action), 11.B Audit Before Touching, 11.C Preservation Rules, 11.D Modernisation Levers (priority order), 11.E Decision Tree: Targeted Evolution vs Full Redesign, 11.F What Never Changes Silently, 11. REDESIGN PROTOCOL

### Community 16 - "3. DEFAULT ARCHITECTURE & CONVENTIONS"
Cohesion: 0.29
Nodes (7): 3.A Stack, 3.B State, 3.C Icons, 3.D Emoji Policy, 3. DEFAULT ARCHITECTURE & CONVENTIONS, 3.E Responsiveness & Layout Mechanics, 3.F Dependency Verification (mandatory)

### Community 17 - "6. PERFORMANCE & ACCESSIBILITY GUARDRAILS"
Cohesion: 0.29
Nodes (7): 6.A Hardware Acceleration, 6.B Reduced Motion (mandatory), 6.C Dark Mode (mandatory for any consumer-facing page), 6.D Core Web Vitals Targets, 6.E DOM Cost, 6.F Z-Index Restraint, 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS

### Community 18 - "tasteskill: Anti-Slop Frontend Skill"
Cohesion: 0.20
Nodes (10): 13. OUT OF SCOPE, 14. FINAL PRE-FLIGHT CHECK, 1.A Dial Inference (design read → dial values), 1.B Use-Case Presets, 1.C How the Dials Drive Output, 1. THE THREE DIALS (Core Configuration), 2.A When to reach for a real design system (use official packages), 2.B When the brief is an aesthetic, not a system (+2 more)

### Community 19 - "0. BRIEF INFERENCE (Read the Room Before Anything Else)"
Cohesion: 0.40
Nodes (5): 0.A Read these signals first, 0.B Output a one-line "Design Read" before generating, 0. BRIEF INFERENCE (Read the Room Before Anything Else), 0.C If the brief is ambiguous, ask one question, do not guess, 0.D Anti-Default Discipline

### Community 20 - "12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)"
Cohesion: 0.40
Nodes (5): 12.A File Location, 12.B Required Frontmatter, 12.C Required Body Sections, 12.D Block-Library Discipline, 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)

### Community 21 - "5. CONTEXT-AWARE PROACTIVITY"
Cohesion: 0.40
Nodes (5): 5.A Sticky-Stack - Canonical Skeleton, 5.B Horizontal-Pan - Canonical Skeleton, 5.C Scroll-Reveal Stagger - Canonical Skeleton (lighter alternative), 5. CONTEXT-AWARE PROACTIVITY, 5.D Forbidden Animation Patterns

### Community 22 - "8. DARK MODE PROTOCOL"
Cohesion: 0.40
Nodes (5): 8.A Token Strategy (pick one, stick to it), 8.B Do Not Prescribe Specific Colors Here, 8.C Default Mode, 8.D Test in Both Modes Before Finishing, 8. DARK MODE PROTOCOL

### Community 24 - "7. DIAL DEFINITIONS (Technical Reference)"
Cohesion: 0.50
Nodes (4): 7. DIAL DEFINITIONS (Technical Reference), DESIGN_VARIANCE (Level 1-10), MOTION_INTENSITY (Level 1-10), VISUAL_DENSITY (Level 1-10)

### Community 27 - "app/page.tsx"
Cohesion: 0.52
Nodes (5): Home(), feedAll(), feedInBox(), ipLocation(), SEOUL

### Community 28 - "Look At This — Claude Code 작업 지침"
Cohesion: 0.11
Nodes (21): createPost(), Gps, Pin, UploadForm(), graphify, Look At This — Claude Code 작업 지침, 구조, 규칙 위치 (+13 more)

## Knowledge Gaps
- **188 isolated node(s):** `Props`, `Props`, `Cluster`, `dynamic`, `geist` (+183 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 206 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `getLang` to `package.json`, `[slug]/page.tsx`, `LoginForm.tsx`, `[city]/page.tsx`, `privacy/page.tsx`, `app/page.tsx`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `tasteskill: Anti-Slop Frontend Skill` connect `tasteskill: Anti-Slop Frontend Skill` to `Appendix B - Canonical Sources (read these before reinventing)`, `4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)`, `10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)`, `9. AI TELLS (Forbidden Patterns)`, `11. REDESIGN PROTOCOL`, `3. DEFAULT ARCHITECTURE & CONVENTIONS`, `6. PERFORMANCE & ACCESSIBILITY GUARDRAILS`, `0. BRIEF INFERENCE (Read the Room Before Anything Else)`, `12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)`, `5. CONTEXT-AWARE PROACTIVITY`, `8. DARK MODE PROTOCOL`, `7. DIAL DEFINITIONS (Technical Reference)`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Why does `Look At This — Claude Code 작업 지침` connect `Look At This — Claude Code 작업 지침` to `[slug]/page.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `Props`, `Props`, `Cluster` to the rest of the system?**
  _188 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09306122448979592 - nodes in this community are weakly interconnected._
- **Should `getLang` be split into smaller, more focused modules?**
  _Cohesion score 0.08953418027828192 - nodes in this community are weakly interconnected._