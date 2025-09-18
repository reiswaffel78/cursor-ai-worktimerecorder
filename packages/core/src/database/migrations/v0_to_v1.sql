-- ======================================================
-- Migration Script: v0 → v1
-- Date: 2025-07-06
-- Description: Initial schema setup for Cursor AI TimeTracking Extension
-- ======================================================

PRAGMA foreign_keys = ON;

-- Begin transaction for atomicity
BEGIN TRANSACTION;

-- Create migrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT (datetime('now'))
);

-- Check if migration has already been applied
SELECT CASE
    WHEN EXISTS (SELECT 1 FROM migrations WHERE version = 'v1.0')
    THEN RAISE(ABORT, 'Migration v1.0 has already been applied')
END;

-- ======================================================
-- Core Tables
-- ======================================================

-- Projects table
CREATE TABLE projects (
    id TEXT PRIMARY KEY,  -- UUID
    name TEXT NOT NULL,
    description TEXT,
    git_repository TEXT,
    git_branch TEXT,
    color TEXT,           -- Hex color code
    is_archived INTEGER NOT NULL DEFAULT 0,  -- Boolean (0/1)
    created_at TIMESTAMP NOT NULL DEFAULT (datetime('now')),
    updated_at TIMESTAMP NOT NULL DEFAULT (datetime('now')),
    last_active TIMESTAMP
);

-- Create index on project name for quick lookups
CREATE INDEX idx_projects_name ON projects(name);
CREATE INDEX idx_projects_last_active ON projects(last_active);

-- Tags table
CREATE TABLE tags (
    id TEXT PRIMARY KEY,  -- UUID
    name TEXT NOT NULL UNIQUE,
    color TEXT,           -- Hex color code
    usage_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT (datetime('now'))
);

-- Create index on tag name for quick lookups
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_tags_usage_count ON tags(usage_count);

-- Sessions table - core tracking data
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,  -- UUID
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration INTEGER,     -- in milliseconds
    status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'completed', 'interrupted')),
    project_id TEXT,
    file_path TEXT,
    complexity REAL CHECK (complexity >= 0 AND complexity <= 100),
    stress_level REAL CHECK (stress_level >= 0 AND stress_level <= 100),
    interruptions INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT (datetime('now')),
    updated_at TIMESTAMP NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- Create indexes for session queries
CREATE INDEX idx_sessions_start_time ON sessions(start_time);
CREATE INDEX idx_sessions_end_time ON sessions(end_time);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_project_id ON sessions(project_id);
CREATE INDEX idx_sessions_date ON sessions(date(start_time));

-- Junction table for session-tag many-to-many relationship
CREATE TABLE session_tags (
    session_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (session_id, tag_id),
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Create index for tag lookups
CREATE INDEX idx_session_tags_tag_id ON session_tags(tag_id);

-- ======================================================
-- Analytics Tables
-- ======================================================

-- Daily statistics table for faster analytics queries
CREATE TABLE daily_stats (
    date TEXT PRIMARY KEY,  -- YYYY-MM-DD format
    total_time INTEGER NOT NULL DEFAULT 0,  -- in milliseconds
    active_time INTEGER NOT NULL DEFAULT 0, -- in milliseconds
    deep_work_time INTEGER NOT NULL DEFAULT 0, -- sessions ≥ 25 min
    deep_work_percentage REAL DEFAULT 0,
    sessions_count INTEGER NOT NULL DEFAULT 0,
    average_session_length INTEGER DEFAULT 0, -- in milliseconds
    context_switches INTEGER NOT NULL DEFAULT 0,
    goal_completion REAL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT (datetime('now'))
);

-- Project daily statistics for project-specific analytics
CREATE TABLE project_daily_stats (
    date TEXT NOT NULL,     -- YYYY-MM-DD format
    project_id TEXT NOT NULL,
    total_time INTEGER NOT NULL DEFAULT 0,  -- in milliseconds
    sessions_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (date, project_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX idx_project_daily_stats_project ON project_daily_stats(project_id);

-- ======================================================
-- Feature Tables
-- ======================================================

-- Pomodoro tracking table
CREATE TABLE pomodoro (
    id TEXT PRIMARY KEY,  -- UUID
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration INTEGER NOT NULL,  -- in minutes
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'interrupted')),
    session_id TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL
);

CREATE INDEX idx_pomodoro_session ON pomodoro(session_id);
CREATE INDEX idx_pomodoro_start_time ON pomodoro(start_time);

-- Break tracking table
CREATE TABLE break (
    id TEXT PRIMARY KEY,  -- UUID
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration INTEGER NOT NULL,  -- in minutes
    is_long_break INTEGER NOT NULL DEFAULT 0,  -- Boolean (0/1)
    pomodoro_id TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (pomodoro_id) REFERENCES pomodoro(id) ON DELETE SET NULL
);

CREATE INDEX idx_break_pomodoro ON break(pomodoro_id);

-- ======================================================
-- Configuration Tables
-- ======================================================

-- Settings table for user preferences
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    type TEXT NOT NULL,  -- 'string', 'number', 'boolean', 'json'
    updated_at TIMESTAMP NOT NULL DEFAULT (datetime('now'))
);

-- ======================================================
-- Triggers
-- ======================================================

-- Update project last_active when a session is created or updated
CREATE TRIGGER update_project_last_active
AFTER INSERT ON sessions
BEGIN
    UPDATE projects
    SET last_active = NEW.start_time
    WHERE id = NEW.project_id;
END;

-- Update tag usage count when added to a session
CREATE TRIGGER update_tag_usage_count_insert
AFTER INSERT ON session_tags
BEGIN
    UPDATE tags
    SET usage_count = usage_count + 1
    WHERE id = NEW.tag_id;
END;

-- Update tag usage count when removed from a session
CREATE TRIGGER update_tag_usage_count_delete
AFTER DELETE ON session_tags
BEGIN
    UPDATE tags
    SET usage_count = usage_count - 1
    WHERE id = OLD.tag_id;
END;

-- Auto-update session duration when end_time is set
CREATE TRIGGER update_session_duration
AFTER UPDATE OF end_time ON sessions
WHEN NEW.end_time IS NOT NULL AND NEW.start_time IS NOT NULL
BEGIN
    UPDATE sessions
    SET duration = (strftime('%s', NEW.end_time) - strftime('%s', NEW.start_time)) * 1000
    WHERE id = NEW.id;
END;

-- Auto-update updated_at timestamp
CREATE TRIGGER update_sessions_timestamp
AFTER UPDATE ON sessions
BEGIN
    UPDATE sessions
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
END;

CREATE TRIGGER update_projects_timestamp
AFTER UPDATE ON projects
BEGIN
    UPDATE projects
    SET updated_at = datetime('now')
    WHERE id = NEW.id;
END;

-- ======================================================
-- Insert default settings
-- ======================================================
INSERT INTO settings (key, value, type) VALUES 
('idleTimeout', '90', 'number'),
('dailyGoal', '240', 'number'),
('pomodoroLength', '25', 'number'),
('breakLength', '5', 'number'),
('longBreakLength', '15', 'number'),
('pomodorosUntilLongBreak', '4', 'number'),
('autoStartBreaks', 'true', 'boolean'),
('autoStartPomodoros', 'false', 'boolean'),
('theme', 'system', 'string'),
('dataRetention', '365', 'number'),
('notifications', '{"sessionEnd":true,"breakEnd":true,"idleDetected":true,"dailyGoalReached":true}', 'json'),
('features', '{"pomodoro":true,"aiAnalytics":false,"healthMonitoring":false}', 'json');

-- ======================================================
-- Verification steps
-- ======================================================

-- Verify all tables were created
SELECT CASE
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='projects') THEN RAISE(ABORT, 'Table projects not created')
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='tags') THEN RAISE(ABORT, 'Table tags not created')
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='sessions') THEN RAISE(ABORT, 'Table sessions not created')
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='session_tags') THEN RAISE(ABORT, 'Table session_tags not created')
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='daily_stats') THEN RAISE(ABORT, 'Table daily_stats not created')
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='project_daily_stats') THEN RAISE(ABORT, 'Table project_daily_stats not created')
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='pomodoro') THEN RAISE(ABORT, 'Table pomodoro not created')
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='break') THEN RAISE(ABORT, 'Table break not created')
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='settings') THEN RAISE(ABORT, 'Table settings not created')
END;

-- Verify triggers were created
SELECT CASE
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='update_project_last_active') THEN RAISE(ABORT, 'Trigger update_project_last_active not created')
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='update_tag_usage_count_insert') THEN RAISE(ABORT, 'Trigger update_tag_usage_count_insert not created')
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='update_tag_usage_count_delete') THEN RAISE(ABORT, 'Trigger update_tag_usage_count_delete not created')
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='update_session_duration') THEN RAISE(ABORT, 'Trigger update_session_duration not created')
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='update_sessions_timestamp') THEN RAISE(ABORT, 'Trigger update_sessions_timestamp not created')
    WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type='trigger' AND name='update_projects_timestamp') THEN RAISE(ABORT, 'Trigger update_projects_timestamp not created')
END;

-- Verify default settings were inserted
SELECT CASE
    WHEN (SELECT COUNT(*) FROM settings) < 12 THEN RAISE(ABORT, 'Default settings not fully inserted')
END;

-- ======================================================
-- Record migration version
-- ======================================================
INSERT INTO migrations (version) VALUES ('v1.0');

-- If we got here, everything succeeded
COMMIT;

-- ======================================================
-- Rollback function (in case of error, transaction will be rolled back automatically)
-- ======================================================
-- In case of error, SQLite will automatically rollback the transaction