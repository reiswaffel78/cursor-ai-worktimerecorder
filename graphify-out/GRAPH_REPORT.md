# Graph Report - cursor-ai-worktimerecorder  (2026-10-18)

## Corpus Check
- 59 files · ~61,550 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: .css 8, (none) 3)

## Summary
- 872 nodes · 1226 edges · 48 communities (38 shown, 10 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `747c9d08`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- src/types/validators.ts
- types/validators.ts
- validation-snippets.ts
- TimeTrackingService
- User_Stories_MVP.md
- src/utils/projectUtils.ts
- package.json
- core/package.json
- Cursor AI Time Tracking Extension
- Cursor AI Time Tracking Extension
- core/src/utils/projectUtils.ts
- Usage Examples
- Usage Examples
- .constructor
- webview/package.json
- Cursor AI Extension „Local Time Tracking"
- extension/package.json
- compilerOptions
- compilerOptions
- compilerOptions
- Dashboard-Panel
- Development-Start Checkliste
- Development-Start Checkliste
- Cursor AI Extension – Local Time Tracking
- compilerOptions
- App.tsx
- Dashboard.tsx
- contributes
- devDependencies
- devDependencies
- timeTrackingStore.ts
- debounce
- scripts
- isErrorResponse
- dependencies
- scripts
- main.tsx
- repository
- tech_overview.md
- createRequest
- dependencies
- engines
- README.md

## God Nodes (most connected - your core abstractions)
1. `MessageBase` - 45 edges
2. `TimeTrackingService` - 30 edges
3. `ValidationError` - 21 edges
4. `ValidationError` - 21 edges
5. `TimeTrackingWebviewProvider` - 16 edges
6. `activate()` - 14 edges
7. `Cursor AI Extension „Local Time Tracking"` - 14 edges
8. `scripts` - 11 edges
9. `EventMapper` - 11 edges
10. `compilerOptions` - 11 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `Dashboard()`  [EXTRACTED]
  packages/webview/src/App.tsx → packages/webview/src/components/Dashboard/Dashboard.tsx
- `Dashboard()` --calls--> `useTimeTrackingStore`  [EXTRACTED]
  packages/webview/src/components/Dashboard/Dashboard.tsx → packages/webview/src/store/timeTrackingStore.ts
- `activate()` --calls--> `TimeTrackingService`  [EXTRACTED]
  packages/extension/src/extension.ts → packages/extension/src/services/TimeTrackingService.ts
- `activate()` --calls--> `TimeTrackingWebviewProvider`  [EXTRACTED]
  packages/extension/src/extension.ts → packages/extension/src/webview/WebviewProvider.ts
- `TimeTrackingService` --references--> `EventMapper`  [EXTRACTED]
  packages/extension/src/services/TimeTrackingService.ts → packages/extension/src/extension/EventMapper.ts

## Import Cycles
- None detected.

## Communities (48 total, 10 thin omitted)

### Community 0 - "src/types/validators.ts"
Cohesion: 0.05
Nodes (70): AnalyticsQuery, ApiError, ApiResponse, AppSettings, Break, CreatePomodoroRequest, CreateProjectRequest, CreateSessionRequest (+62 more)

### Community 1 - "types/validators.ts"
Cohesion: 0.05
Nodes (70): AnalyticsQuery, ApiError, ApiResponse, AppSettings, Break, CreatePomodoroRequest, CreateProjectRequest, CreateSessionRequest (+62 more)

### Community 2 - "validation-snippets.ts"
Cohesion: 0.05
Nodes (65): BreakUpdateNotification, DailyStats, ErrorResponse, ExportDataRequest, ExportDataResponse, FocusTimeUpdateNotification, GetAvailableTagsRequest, GetAvailableTagsResponse (+57 more)

### Community 3 - "TimeTrackingService"
Cohesion: 0.06
Nodes (12): activate(), createEventMapper(), DEFAULT_OPTIONS, EVENT_WEIGHTS, EventMapper, EventMapperOptions, formatTime(), DailyStats (+4 more)

### Community 4 - "User_Stories_MVP.md"
Cohesion: 0.04
Nodes (47): Akzeptanzkriterien (Gherkin):, Akzeptanzkriterien (Gherkin):, Akzeptanzkriterien (Gherkin):, Akzeptanzkriterien (Gherkin):, Akzeptanzkriterien (Gherkin):, Akzeptanzkriterien (Gherkin):, Akzeptanzkriterien (Gherkin):, Akzeptanzkriterien (Gherkin): (+39 more)

### Community 5 - "src/utils/projectUtils.ts"
Cohesion: 0.07
Nodes (24): createEventMapper(), DEFAULT_OPTIONS, EVENT_WEIGHTS, EventMapper, EventMapperOptions, debounce(), clearDebounceTimeout(), executeFunc() (+16 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (37): contributes, commands, description, devDependencies, eslint, prettier, @types/node, @types/vscode (+29 more)

### Community 7 - "core/package.json"
Cohesion: 0.06
Nodes (34): dependencies, better-sqlite3, date-fns, nanoid, tslib, description, devDependencies, jest (+26 more)

### Community 8 - "Cursor AI Time Tracking Extension"
Cohesion: 0.06
Nodes (32): Analytics Queries, Analytics Tables, Best Practices, `break`, Configuration Tables, Core Tables, Cursor AI Time Tracking Extension, `daily_stats` (+24 more)

### Community 9 - "Cursor AI Time Tracking Extension"
Cohesion: 0.06
Nodes (32): Analytics Queries, Analytics Tables, Best Practices, `break`, Configuration Tables, Core Tables, Cursor AI Time Tracking Extension, `daily_stats` (+24 more)

### Community 10 - "core/src/utils/projectUtils.ts"
Cohesion: 0.11
Nodes (19): cacheTimestamps, clearExpiredCache(), determineProjectType(), extractProjectInfo(), findGitRoot(), findProjectRoot(), generateProjectName(), getGitBranch() (+11 more)

### Community 11 - "Usage Examples"
Cohesion: 0.10
Nodes (20): 1. Always Use Validation at Boundaries, 2. Use Type Guards for Runtime Checks, 3. Leverage Utility Types, 4. Consistent Error Handling, Analytics and Statistics, API Request Validation, Basic Interface Usage, Best Practices (+12 more)

### Community 12 - "Usage Examples"
Cohesion: 0.10
Nodes (20): 1. Always Use Validation at Boundaries, 2. Use Type Guards for Runtime Checks, 3. Leverage Utility Types, 4. Consistent Error Handling, Analytics and Statistics, API Request Validation, Basic Interface Usage, Best Practices (+12 more)

### Community 13 - ".constructor"
Cohesion: 0.15
Nodes (7): IPCBridge, IPCManager, isNotificationMessage(), isValidUUID(), MessageHandler, NotificationDispatcher, validateMessage()

### Community 14 - "webview/package.json"
Cohesion: 0.12
Nodes (15): description, rimraf, typescript, main, name, version, DailyStats, TimeChartProps (+7 more)

### Community 15 - "Cursor AI Extension „Local Time Tracking""
Cohesion: 0.11
Nodes (18): 10  Roadmap, 11  Risiken & Gegenmaßnahmen, 12  Monetarisierung, 13  Glossar, 1  Ziel & Vision, 2  Stakeholder, 3  Personas & Kern-User-Stories, 4.1  MVP (Version 1.0) - 12 Kernfunktionen (+10 more)

### Community 16 - "extension/package.json"
Cohesion: 0.11
Nodes (17): activationEvents, categories, description, displayName, eslint, @types/node, @types/vscode, typescript (+9 more)

### Community 17 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, composite, declaration, forceConsistentCasingInFileNames, lib, module, moduleResolution, paths (+8 more)

### Community 18 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, composite, declaration, outDir, rootDir, sourceMap, types, exclude (+4 more)

### Community 19 - "compilerOptions"
Cohesion: 0.15
Nodes (12): compilerOptions, composite, jsx, lib, noEmit, outDir, rootDir, target (+4 more)

### Community 20 - "Dashboard-Panel"
Cohesion: 0.15
Nodes (12): 1. Zweck / Ziel, 1. Zweck / Ziel, 1. Zweck / Ziel, 2. Haupt-Komponenten, 2. Haupt-Komponenten, 2. Haupt-Komponenten, 3. User-Flow, 3. User-Flow (+4 more)

### Community 21 - "Development-Start Checkliste"
Cohesion: 0.17
Nodes (11): 1 | Technische Spezifikationen, 2 | Design & UX, 3 | Setup & Tooling, 4 | Architektur & Code-Basis, 5 | Tests & Qualit�t, 6 | Deployment & Release, 7 | Projekt-Management & Kommunikation, Development-Start Checkliste (+3 more)

### Community 22 - "Development-Start Checkliste"
Cohesion: 0.17
Nodes (11): 1 | Technische Spezifikationen, 2 | Design & UX, 3 | Setup & Tooling, 4 | Architektur & Code-Basis, 5 | Tests & Qualit�t, 6 | Deployment & Release, 7 | Projekt-Management & Kommunikation, Development-Start Checkliste (+3 more)

### Community 23 - "Cursor AI Extension – Local Time Tracking"
Cohesion: 0.17
Nodes (11): 1  Systemübersicht, 2  Laufzeit-Umgebung & Dependencies, 3  IPC API-Contract, 4  Datenbank-Schema (SQLite 3), 5  State-Management-Schema (React + Zustand), 6  Fehler- & Logging-Strategie, 7  Performance-Budget & Benchmarks, 8  Security / Privacy Notes (+3 more)

### Community 24 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, composite, declaration, outDir, rootDir, sourceMap, exclude, extends (+2 more)

### Community 25 - "App.tsx"
Cohesion: 0.38
Nodes (7): App(), Export(), ExportFormat, ExportRange, Settings(), useTimeTrackingStore, react

### Community 26 - "Dashboard.tsx"
Cohesion: 0.27
Nodes (8): Session, SessionCard(), SessionCardProps, DailyStats, StatsGrid(), StatsGridProps, TimeChart(), Dashboard()

### Community 27 - "contributes"
Cohesion: 0.20
Nodes (10): contributes, commands, keybindings, menus, views, viewsContainers, commandPalette, view/title (+2 more)

### Community 28 - "devDependencies"
Cohesion: 0.25
Nodes (8): devDependencies, eslint, @types/node, @types/vscode, typescript, @typescript-eslint/eslint-plugin, @typescript-eslint/parser, vsce

### Community 29 - "devDependencies"
Cohesion: 0.25
Nodes (8): devDependencies, rimraf, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react, vitest

### Community 30 - "timeTrackingStore.ts"
Cohesion: 0.25
Nodes (7): AppSettings, DailyStats, defaultSettings, Session, TimeTrackingState, ViewName, zustand

### Community 31 - "debounce"
Cohesion: 0.38
Nodes (6): debounce(), clearDebounceTimeout(), executeFunc(), DebounceOptions, throttle(), executeFunc()

### Community 32 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, lint, lint:fix, package, watch

### Community 33 - "isErrorResponse"
Cohesion: 0.40
Nodes (6): getResponseType(), isErrorResponse(), isMessageBase(), isRequestMessage(), isResponseFor(), isResponseMessage()

### Community 34 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, chart.js, react, react-chartjs-2, react-dom, zustand

### Community 35 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, clean, dev, lint, test

### Community 36 - "main.tsx"
Cohesion: 0.40
Nodes (3): root, Window, react-dom

### Community 37 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **55 isolated node(s):** `@types/node`, `@types/vscode`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `eslint` (+50 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 488 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `@types/node`, `@types/vscode`, `@typescript-eslint/eslint-plugin` to the rest of the system?**
  _55 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src/types/validators.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05473684210526316 - nodes in this community are weakly interconnected._
- **Should `types/validators.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05473684210526316 - nodes in this community are weakly interconnected._
- **Should `validation-snippets.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.048726953467954345 - nodes in this community are weakly interconnected._
- **Should `TimeTrackingService` be split into smaller, more focused modules?**
  _Cohesion score 0.0648018648018648 - nodes in this community are weakly interconnected._
- **Should `User_Stories_MVP.md` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `src/utils/projectUtils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07073170731707316 - nodes in this community are weakly interconnected._