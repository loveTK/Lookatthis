# Graph Report - Lookatthis  (2026-09-24)

## Corpus Check
- 65 files · ~34,821 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 355 nodes · 641 edges · 27 communities (23 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7d99366f`
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
- login/page.tsx
- Look At This — Claude Code 작업 지침
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
- 1. THE THREE DIALS (Core Configuration)
- 7. DIAL DEFINITIONS (Technical Reference)
- actions.ts

## God Nodes (most connected - your core abstractions)
1. `getLang()` - 33 edges
2. `t()` - 30 edges
3. `createClient()` - 28 edges
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
- `createPost()` --calls--> `reverseGeocode()`  [EXTRACTED]
  app/actions.ts → lib/google.ts

## Import Cycles
- None detected.

## Communities (27 total, 4 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (40): eslintConfig, dependencies, next, react, react-dom, sharp, @supabase/ssr, @supabase/supabase-js (+32 more)

### Community 1 - "[slug]/page.tsx"
Cohesion: 0.19
Nodes (17): contentType, OgImage(), size, generateMetadata(), isThin(), PostPage(), Props, Text (+9 more)

### Community 2 - "getLang"
Cohesion: 0.09
Nodes (39): ActionState, addComment(), createProfile(), report(), setLang(), signOut(), toggleVote(), GET() (+31 more)

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

### Community 8 - "login/page.tsx"
Cohesion: 0.24
Nodes (7): LoginForm(), google(), magic(), LoginPage(), supabaseBrowser(), config, @supabase/ssr

### Community 9 - "Look At This — Claude Code 작업 지침"
Cohesion: 0.11
Nodes (20): graphify, Look At This — Claude Code 작업 지침, 구조, 규칙 위치, 만들지 말 것 (백로그, 추가 시점), 명령, 스택 (바꾸지 말 것), 아직 검증 안 된 것 (키 없이 만들었음) (+12 more)

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
Cohesion: 0.33
Nodes (6): 13. OUT OF SCOPE, 14. FINAL PRE-FLIGHT CHECK, 2.A When to reach for a real design system (use official packages), 2.B When the brief is an aesthetic, not a system, 2. BRIEF → DESIGN SYSTEM MAP, tasteskill: Anti-Slop Frontend Skill

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

### Community 23 - "1. THE THREE DIALS (Core Configuration)"
Cohesion: 0.50
Nodes (4): 1.A Dial Inference (design read → dial values), 1.B Use-Case Presets, 1.C How the Dials Drive Output, 1. THE THREE DIALS (Core Configuration)

### Community 24 - "7. DIAL DEFINITIONS (Technical Reference)"
Cohesion: 0.50
Nodes (4): 7. DIAL DEFINITIONS (Technical Reference), DESIGN_VARIANCE (Level 1-10), MOTION_INTENSITY (Level 1-10), VISUAL_DENSITY (Level 1-10)

### Community 25 - "actions.ts"
Cohesion: 0.09
Nodes (25): createPost(), Props, Props, HubJsonLd(), MapView(), Props, PostCard(), Home() (+17 more)

## Knowledge Gaps
- **185 isolated node(s):** `Props`, `Props`, `dynamic`, `geist`, `viewport` (+180 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 203 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `actions.ts` to `package.json`, `[slug]/page.tsx`, `getLang`, `login/page.tsx`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `tasteskill: Anti-Slop Frontend Skill` connect `tasteskill: Anti-Slop Frontend Skill` to `Appendix B - Canonical Sources (read these before reinventing)`, `4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)`, `10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)`, `9. AI TELLS (Forbidden Patterns)`, `11. REDESIGN PROTOCOL`, `3. DEFAULT ARCHITECTURE & CONVENTIONS`, `6. PERFORMANCE & ACCESSIBILITY GUARDRAILS`, `0. BRIEF INFERENCE (Read the Room Before Anything Else)`, `12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)`, `5. CONTEXT-AWARE PROACTIVITY`, `8. DARK MODE PROTOCOL`, `1. THE THREE DIALS (Core Configuration)`, `7. DIAL DEFINITIONS (Technical Reference)`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `Props`, `Props`, `dynamic` to the rest of the system?**
  _185 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._
- **Should `getLang` be split into smaller, more focused modules?**
  _Cohesion score 0.08925979680696662 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Appendix B - Canonical Sources (read these before reinventing)` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._