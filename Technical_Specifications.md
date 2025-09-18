# Technical Specifications  
## Cursor AI Extension – Local Time Tracking  

---

### 1  Systemübersicht  

```mermaid
graph TD
    subgraph VS Code Host
        H1[VS Code API≥1.90] -- editor events --> N1
    end

    subgraph React WebView (Renderer)
        W1[React UI<br>+ Zustand Stores] -- postMessage --> N1
        N1 -- notifications --> W1
    end

    subgraph Extension Backend (Node 18 Sidecar)
        N1[IPC Bridge<br>(type-safe)]:::ipc
        S1(SessionTracker):::srv
        S2(DataStore):::srv
        S3(AnalyticsService):::srv
        S4(AI/Health Service):::srv
        L1[[Structured Logs]]:::log
        DB[(SQLite DB)]:::db
        S1 -- CRUD --> DB
        S2 -- CRUD --> DB
        S3 -- READ --> DB
        S1 -- logs --> L1
        S2 -- logs --> L1
        S3 -- logs --> L1
        S4 -- logs --> L1
    end

    classDef db  fill:#F59E0B,color:#fff,stroke:#d97706;
    classDef srv fill:#6366F1,color:#fff,stroke:#4f46e5;
    classDef ipc fill:#10B981,color:#fff,stroke:#0e9f6e;
    classDef log fill:#EF4444,color:#fff,stroke:#b91c1c;
```

**Kern-Komponenten**  
1. **React WebView** – Dashboard, Detail-Tab, Settings, Pomodoro  
2. **IPC Bridge** – type-safe Wrapper, JSON-Schema Validierung  
3. **Node Sidecar** – `SessionTracker`, `DataStore`, `AnalyticsService`, `AI/HealthService`  
4. **SQLite DB** – lokale Datei `~/.cursor/time-tracking.db`  
5. **VS Code API** – liefert Aktivitäts-Events  

---

### 2  Laufzeit-Umgebung & Dependencies  

| Schicht | Library / Tool | Version | Zweck |
|---------|----------------|---------|-------|
| Backend | Node.js        | 18 LTS  | Runtime |
| Backend | better-sqlite3 | 9.x     | Hochperformante SQLite-Bindings |
| Backend | pino           | 8.x     | Structured Logging |
| Frontend| React          | 18.x    | UI |
| Frontend| Zustand        | 4.x     | State Management |
| Tooling | TypeScript     | 5.x     | Typ-Sicherheit |
| Tooling | zx             | 7.x     | Automationskripte |
| Testing | jest/vitest    | ≥29     | Unit-Tests |
| Testing | playwright     | ≥1.40   | Integration-Tests |
| ML      | TensorFlow.js  | ≤10 MB  | Lokale KI-Features (V3.0) |
| Host    | VS Code API    | ≥1.90   | Integration in Cursor IDE |

---

### 3  IPC API-Contract  

* **Datei:** `contracts/api_contract.json`  
* **Umfang:** 45 Requests, 25 Responses, 8 Notifications  
* **Struktur:**  
  ```jsonc
  { id, type, channel, payload, error? }
  ```  
* **Validierung:** Runtime via `contracts/validation-snippets.ts` (Ajv)  
* **Type-Generierung:** `types/index.ts` – automatische TS-Interfaces  
* **Konsistenz:** Contract deckt alle MVP-Endpoints (Sessions, Stats, Settings, Export) + V2.0 Tags/Pomodoro bereits ab.  

---

### 4  Datenbank-Schema (SQLite 3)  

| Tabelle | Zweck (Kurz) | Kernauswahl Spalten |
|---------|--------------|---------------------|
| `projects` | Projekt-Stammdaten | id (PK), name, git_branch, last_active |
| `sessions` | Zeitblöcke | id, start_time, end_time, duration, status, project_id (FK), file_path, complexity, stress_level, interruptions |
| `tags` | Label-System | id, name, color, usage_count |
| `session_tags` | n:m Bridge | session_id (FK), tag_id (FK) |
| `pomodoro` | 25-Min-Timer | id, start_time, end_time, duration, status, session_id (FK) |
| `break` | Pause-Blöcke | id, start_time, end_time, duration, is_long_break, pomodoro_id (FK) |
| `daily_stats` | Tages-Aggregationen | date, total_time, deep_work_time, goal_completion |
| `project_daily_stats` | Projekt-Aggregationen | date, project_id, total_time |
| `settings` | Key/Value Store | key (PK), value, type |

* **DDL:** `database/schema.sql`  
* **Migrations:** `database/migrations/v0_to_v1.sql`  
* **Beispiele:** `database/crud_examples.sql` (> 100 Queries)  

---

### 5  State-Management-Schema (React + Zustand)  

| Store | Properties | Persistenz | Quelle |
|-------|------------|-----------|--------|
| `SessionStore` | `current`, `status`, `idle`, `interruptions` | volatil | IPC Notifications |
| `StatsStore` | `daily`, `weekly`, `topProjects` | volatil | IPC Request → Response |
| `SettingsStore` | `idleTimeout`, `dailyGoal`, `theme`, `features` | localStorage | IPC Request/Save |
| `UIStore` | `activeTab`, `modals`, `toastQueue` | volatil | WebView |

* **Pattern:** Action → IPC Request → optimistic Update → Response/Notification → Store Patch  
* **Type-Safety:** generierte TS-Interfaces aus Contract  

---

### 6  Fehler- & Logging-Strategie  

| Layer | Technik | Handling |
|-------|---------|----------|
| Node Sidecar | `process.on('uncaughtException')`, `pino` | JSON Logs → `~/.cursor/time-tracking/logs/*.log` |
| WebView | `window.onerror`, React-ErrorBoundary | IPC `logError` → Backend |
| IPC | Contract Validation | Bei Schema-Fehler: `ApiError` → Frontend-Toast |
| DB | try/catch wrapper | Fehlercode + SQL Dump in Log |
| Monitoring | Crash-Counter in `daily_stats` | Crash-Free KPI ≥ 99 % |

---

### 7  Performance-Budget & Benchmarks  

| Metrik | Zielwert | Prüfmethode |
|--------|----------|-------------|
| Idle-CPU | < 1 % | VS Code Performance Pane |
| Peak-RAM | < 50 MB | `process.memoryUsage()` |
| DB Wachstum | < 5 MB/Monat | `pragma page_count` |
| Chart FPS | > 55 FPS | React Profiler |
| JSON-IPC RTT | < 5 ms | Bench Suite |
| ML-Inference | < 100 ms | TF.js Benchmark |

* **Optimierungen:** Lazy-Import WebView, batched DB-writes, prepared statements, index `idx_sessions_date`, debounced IPC.  

---

### 8  Security / Privacy Notes  

* **Datenlokation:** `~/.cursor/time-tracking.db`, keine Cloud by default.  
* **Encryption:** AES-256 bei Export (`export --encrypted`).  
* **Permissions:** Nur `filesystem`, `clipboard`; kein Netzwerk ohne Flag `allowNetwork`.  
* **DSGVO-Konform:** Keine personenbezogenen Daten außer lokalem Username.  
* **Input Validation:** IPC JSON-Schema + SQLite prepared statements → SQL-Injection-safe.  
* **OWASP Compliance:** HTTP-requests blockiert, CSP strict für WebView.  

---

### 9  Offene Risiken & Next Steps  

| Risiko | Status | Gegenmaßnahme |
|--------|--------|---------------|
| Idle-Detection noch undefiniert | 🔴 | Algorithmus spezifizieren & testen |
| Event-Mapping Cursor-API | 🟠 | Prototype & Unit-Tests |
| Logging-Infra fehlt im WebView | 🟠 | ErrorBoundary + IPC logError |
| DB Growth bei Langzeit-Nutzung | 🟡 | Archival Jobs, partitioned exports |
| Datenschutz-Bedenken | 🟡 | Transparente Docs, Opt-In Features |

**Roadmap (Q3 2025)**  
1. **Idle-Algorithmus** finalisieren → US-002  
2. **Event-Mapping** (onDidChangeTextDocument, onDidChangeActiveTextEditor)  
3. **Coding-Guidelines** (ESLint, Prettier, tsconfig strict)  
4. **Error & Logging Implementation** (pino transport, React boundary)  
5. **Feature-Flags** (Pomodoro, Cloud-Sync)  
6. **CI Pipeline** (lint/test/build/package)  
7. **80 % Test-Coverage** (jest + playwright)  

---

> Dieses Dokument ist die **Single Source of Truth** für alle technischen Entscheidungen der Cursor AI Time Tracking Extension (45 Features, 12 MVP-Funktionen). Änderungen bedürfen PR-Review und Versions-Bump gemäß Semantic Versioning.
