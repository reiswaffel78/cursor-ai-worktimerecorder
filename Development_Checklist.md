# Development-Start Checkliste  
Cursor AI Extension � Local Time Tracking

---

## 1 | Technische Spezifikationen
- [x] Finales **API-Contract** zwischen Extension-WebView ? Node-Sidecar (Message-Typen, Payload-Schemas)
- [x] **Datenbank-DDL** (SQLite) mit Migration v0 ? v1
- [x] **Technical Specifications** (Systemübersicht, Architektur, Performance-Budget, Security-Policy)
- [ ] Definition **Idle-Detection-Algorithmus** (Timeout, Events, Debounce-Strategie)
- [ ] **Event-Mapping** Cursor-API ? SessionTracker (onDidChangeTextDocument, onDidChangeActiveTextEditor)
- [ ] **Coding-Guidelines** (TypeScript vX, Node LTS, ESLint/Prettier Config)
- [ ] **Security-Policy** (lokaler Speicherpfad, Verschl�sselung, keine externen Calls per Default)

## 2 | Design & UX
- [x] Abnahme **Figma-Mockups** (Dashboard, Detail-Tab, Settings, Pomodoro-Modal) ? **Wireframes erstellt**
- [ ] **Design Tokens** (Farben, Typografie) an Cursor-Themes anpassen
- [ ] Interaktions-Flows: Pause/Resume, Export, Tag-Editor
- [ ] Accessibility-Check (Keyboard-Navigation, Screenreader-Labels)

## 3 | Setup & Tooling
- [x] **Git-Repo** anlegen + Branch-Konvention (feat/-, fix/-, chore/-)
- [ ] **Monorepo-Struktur** (packages/extension, packages/core, packages/webview)
- [ ] Node + PNPM/Yarn Version Lockfile
- [ ] **Husky Hooks** (pre-commit lint & test)
- [ ] **VS Code Dev-Container** / .vscode-Empfehlungs-Extensions
- [ ] **Environment-Bootstrap-Script** (Windows, macOS, Linux)

## 4 | Architektur & Code-Basis
- [ ] Scaffold **React-WebView** (+ Vite) mit State-Management (Zustand/Redux)
- [ ] Implementations-Skeleton **SessionTracker**, **DataStore**, **AnalyticsService**
- [x] **IPC-Layer** (postMessage Wrapper, Type-Safe)
- [ ] **Error-Handling-Strategy** & Logging (winston/pino)
- [ ] **Feature Flags** (Pomodoro, Cloud-Sync)

## 5 | Tests & Qualit�t
- [ ] **Unit-Tests** Grundlogik (Jest/Vitest) = 80 % Coverage
- [ ] **Integration-Tests** WebView ? Node (Playwright/Electron-Spectron)
- [ ] **E2E Smoke-Test** in realer Cursor-Sandbox
- [ ] **Performance-Budget** definieren + Benchmarks
- [ ] **Static-Analysis** (tsc --noEmit, ESLint, Dep-Audits)

## 6 | Deployment & Release
- [ ] **CI-Pipeline** (GitHub Actions/GitLab CI) � lint, test, build, package
- [ ] Automatischer **Version-Bump & Changelog** (Conventional Commits, Semantic Release)
- [ ] **Signierte Extension-Package** f�r Cursor Marketplace
- [ ] **Release-Checklist** (Screenshots, Beschreibung, Lizenz-Datei)
- [ ] **Rollback-Plan** (Vorherige Versionen, Migrations-Downgrade)

## 7 | Projekt-Management & Kommunikation
- [ ] **Roadmap-Board** (Jira/GH-Projects) � Epics & Milestones spiegeln PRD
- [x] **Definition of Done** & Akzeptanzkriterien pro User-Story
- [ ] **Risiko-Register** aktualisieren (API-�nderungen, Performance, Datenschutz)
- [ ] **Feedback-Schleife** mit Pilot-Usern (Beta-Kan�le, Umfrage-Formular)
- [ ] Dokumentierte **KI-Prompts / API-Calls** f�r automatisierte Code-Generierung

---

### Hinweise f�r KI-Assistenten
- Greife auf diese Checkliste zu, um Tasks automatisch zu planen.
- Nutze Coding-Guidelines und API-Contracts als �Single Source of Truth".
- Halte dich strikt an Security-Policy, keine Netzwerkanfragen ohne Flag llowNetwork.

### Kritische Abh�ngigkeiten
1. **Cursor Extension API** Dokumentation studieren
2. **VSCode Extension API** als Fallback (�hnliche Struktur)
3. **SQLite** f�r Windows/macOS/Linux compatibility testen
4. **React DevTools** f�r WebView-Debugging

### Erste Schritte Empfehlung
1. API-Contract + DB-Schema definieren
2. Minimaler Proof-of-Concept (Hello World Extension)
3. Session-Tracking Grundlogik implementieren
4. UI-Dashboard prototype
5. Export-Funktionalit�t
6. Polish & Testing

---

**Gesch�tzte Entwicklungszeit MVP: 3-4 Wochen**  
**Team-Gr��e: 1-2 Entwickler + 1 Designer**
