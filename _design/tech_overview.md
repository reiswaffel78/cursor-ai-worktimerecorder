# Cursor AI Time-Tracking Extension – System Overview

```mermaid
%%========================================================
%%  MERMAID DIAGRAM – PNG EXPORT READY
%%========================================================
%% Theme overrides
%%{init: {"theme":"base","themeVariables":{
    "primaryColor":"#3B82F6",
    "secondaryColor":"#10B981",
    "tertiaryColor":"#F59E0B",
    "primaryTextColor":"#ffffff",
    "secondaryTextColor":"#ffffff",
    "tertiaryTextColor":"#ffffff",
    "clusterBkg":"#E5E7EB",
    "clusterBorder":"#9CA3AF",
    "fontSize":"14px"
}} }%%

flowchart LR
    %% ── STYLE CLASSES ──────────────────────────────
    classDef react fill:#10B981,stroke:#076E55,color:#fff;
    classDef node  fill:#3B82F6,stroke:#1E40AF,color:#fff;
    classDef db    fill:#F59E0B,stroke:#B45309,color:#fff;
    classDef host  fill:#9CA3AF,stroke:#6B7280,color:#000;
    classDef log   fill:#EF4444,stroke:#991B1B,color:#fff;
    classDef ipc   fill:#8B5CF6,stroke:#6D28D9,color:#fff;

    %% ── NODES ──────────────────────────────────────
    subgraph Host["VS Code Host"]
        H1["VS Code API ≥ 1.90"]:::host
    end

    subgraph WebView["React WebView (UI)"]
        W1["React Components<br/>+ Zustand Stores"]:::react
    end

    subgraph IPC["Type-Safe IPC Bridge"]
        I1["postMessage<br/>Wrapper<br/>(JSON Schema)"]:::ipc
    end

    subgraph Sidecar["Node Sidecar (Extension Backend)"]
        S1["SessionTracker"]:::node
        S2["DataStore"]:::node
        S3["AnalyticsService"]:::node
        S4["AI / HealthService"]:::node
        L1["Structured Logs"]:::log
    end

    DB["SQLite DB"]:::db

    %% ── EDGES ──────────────────────────────────────
    H1 -- "editor events" --> S1
    W1 -- "postMessage" --> I1
    I1 -- "validated JSON" --> S1
    I1 -- "validated JSON" --> S2
    I1 -- "validated JSON" --> S3
    S1 -- "notifications" --> I1
    S2 -- "notifications" --> I1
    S3 -- "notifications" --> I1
    I1 -- "postMessage" --> W1

    S1 -- "CRUD" --> DB
    S2 -- "CRUD" --> DB
    S3 -- "READ" --> DB

    S1 -- "log" --> L1
    S2 -- "log" --> L1
    S3 -- "log" --> L1
    S4 -- "log" --> L1
