# SQLite Database Schema Documentation
# Cursor AI Time Tracking Extension

## Overview

This database schema is designed for the Cursor AI Time Tracking Extension, providing a robust foundation for tracking coding sessions, projects, and productivity metrics. The schema supports core time tracking functionality as well as advanced features like pomodoro timing, analytics, and health monitoring.

## Table Structure

### Core Tables

#### `sessions`
The primary table for tracking coding activity.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| `id` | TEXT | Unique identifier (UUID) | PRIMARY KEY |
| `start_time` | TIMESTAMP | When the session started | NOT NULL |
| `end_time` | TIMESTAMP | When the session ended | |
| `duration` | INTEGER | Session duration in milliseconds | |
| `status` | TEXT | Session status | NOT NULL, CHECK (status IN (''active'', ''paused'', ''completed'', ''interrupted'')) |
| `project_id` | TEXT | Associated project | FOREIGN KEY → projects(id) |
| `file_path` | TEXT | Current file being edited | |
| `complexity` | REAL | Session complexity score (0-100) | CHECK (complexity >= 0 AND complexity <= 100) |
| `stress_level` | REAL | Detected stress level (0-100) | CHECK (stress_level >= 0 AND stress_level <= 100) |
| `interruptions` | INTEGER | Count of interruptions | DEFAULT 0 |
| `created_at` | TIMESTAMP | Record creation timestamp | NOT NULL, DEFAULT (datetime(''now'')) |
| `updated_at` | TIMESTAMP | Record update timestamp | NOT NULL, DEFAULT (datetime(''now'')) |

#### `projects`
Tracks different coding projects.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| `id` | TEXT | Unique identifier (UUID) | PRIMARY KEY |
| `name` | TEXT | Project name | NOT NULL |
| `description` | TEXT | Project description | |
| `git_repository` | TEXT | Git repository URL | |
| `git_branch` | TEXT | Git branch name | |
| `color` | TEXT | Hex color code for UI | |
| `is_archived` | INTEGER | Whether project is archived | NOT NULL, DEFAULT 0 |
| `created_at` | TIMESTAMP | Record creation timestamp | NOT NULL, DEFAULT (datetime(''now'')) |
| `updated_at` | TIMESTAMP | Record update timestamp | NOT NULL, DEFAULT (datetime(''now'')) |
| `last_active` | TIMESTAMP | When project was last active | |

#### `tags`
Categorization labels for sessions.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| `id` | TEXT | Unique identifier (UUID) | PRIMARY KEY |
| `name` | TEXT | Tag name | NOT NULL, UNIQUE |
| `color` | TEXT | Hex color code for UI | |
| `usage_count` | INTEGER | How many times tag is used | NOT NULL, DEFAULT 0 |
| `created_at` | TIMESTAMP | Record creation timestamp | NOT NULL, DEFAULT (datetime(''now'')) |

#### `session_tags`
Junction table for many-to-many relationship between sessions and tags.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| `session_id` | TEXT | Session reference | NOT NULL, FOREIGN KEY → sessions(id) |
| `tag_id` | TEXT | Tag reference | NOT NULL, FOREIGN KEY → tags(id) |
| | | | PRIMARY KEY (session_id, tag_id) |

### Analytics Tables

#### `daily_stats`
Pre-calculated daily statistics for faster dashboard loading.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| `date` | TEXT | Date in YYYY-MM-DD format | PRIMARY KEY |
| `total_time` | INTEGER | Total tracked time in ms | NOT NULL, DEFAULT 0 |
| `active_time` | INTEGER | Active coding time in ms | NOT NULL, DEFAULT 0 |
| `deep_work_time` | INTEGER | Time in sessions ≥ 25 min | NOT NULL, DEFAULT 0 |
| `deep_work_percentage` | REAL | Percentage of deep work | DEFAULT 0 |
| `sessions_count` | INTEGER | Number of sessions | NOT NULL, DEFAULT 0 |
| `average_session_length` | INTEGER | Average session length in ms | DEFAULT 0 |
| `context_switches` | INTEGER | Number of context switches | NOT NULL, DEFAULT 0 |
| `goal_completion` | REAL | Daily goal completion percentage | DEFAULT 0 |
| `updated_at` | TIMESTAMP | Record update timestamp | NOT NULL, DEFAULT (datetime(''now'')) |

#### `project_daily_stats`
Project-specific daily statistics.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| `date` | TEXT | Date in YYYY-MM-DD format | NOT NULL |
| `project_id` | TEXT | Project reference | NOT NULL, FOREIGN KEY → projects(id) |
| `total_time` | INTEGER | Total time spent on project in ms | NOT NULL, DEFAULT 0 |
| `sessions_count` | INTEGER | Number of sessions | NOT NULL, DEFAULT 0 |
| | | | PRIMARY KEY (date, project_id) |

### Feature Tables

#### `pomodoro`
Tracks pomodoro sessions.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| `id` | TEXT | Unique identifier (UUID) | PRIMARY KEY |
| `start_time` | TIMESTAMP | When pomodoro started | NOT NULL |
| `end_time` | TIMESTAMP | When pomodoro ended | |
| `duration` | INTEGER | Duration in minutes | NOT NULL |
| `status` | TEXT | Pomodoro status | NOT NULL, CHECK (status IN (''active'', ''completed'', ''interrupted'')) |
| `session_id` | TEXT | Associated session | FOREIGN KEY → sessions(id) |
| `created_at` | TIMESTAMP | Record creation timestamp | NOT NULL, DEFAULT (datetime(''now'')) |

#### `break`
Tracks break periods between pomodoros.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| `id` | TEXT | Unique identifier (UUID) | PRIMARY KEY |
| `start_time` | TIMESTAMP | When break started | NOT NULL |
| `end_time` | TIMESTAMP | When break ended | |
| `duration` | INTEGER | Duration in minutes | NOT NULL |
| `is_long_break` | INTEGER | Whether it''s a long break | NOT NULL, DEFAULT 0 |
| `pomodoro_id` | TEXT | Associated pomodoro | FOREIGN KEY → pomodoro(id) |
| `created_at` | TIMESTAMP | Record creation timestamp | NOT NULL, DEFAULT (datetime(''now'')) |

### Configuration Tables

#### `settings`
User preferences and application settings.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| `key` | TEXT | Setting identifier | PRIMARY KEY |
| `value` | TEXT | Setting value | NOT NULL |
| `type` | TEXT | Value type (string, number, boolean, json) | NOT NULL |
| `updated_at` | TIMESTAMP | Record update timestamp | NOT NULL, DEFAULT (datetime(''now'')) |

#### `migrations`
Tracks applied database migrations.

| Column | Type | Description | Constraints |
|--------|------|-------------|------------|
| `version` | TEXT | Migration version | PRIMARY KEY |
| `applied_at` | TIMESTAMP | When migration was applied | NOT NULL, DEFAULT (datetime(''now'')) |

## Relationships and Foreign Keys

The schema uses the following relationships:

1. **One-to-Many**:
   - A project can have many sessions (`sessions.project_id → projects.id`)
   - A session can have many pomodoros (`pomodoro.session_id → sessions.id`)
   - A pomodoro can have many breaks (`break.pomodoro_id → pomodoro.id`)

2. **Many-to-Many**:
   - Sessions and tags are linked through the `session_tags` junction table

3. **Cascading Deletes**:
   - When a session is deleted, all related session_tags are deleted
   - When a project is deleted, related project_daily_stats are deleted
   - Sessions are not deleted when a project is deleted (set to NULL)

## Indexes and Performance Considerations

### Indexes
The schema includes strategic indexes to optimize common query patterns:

1. **Sessions Table**:
   - `idx_sessions_start_time`: Optimizes queries filtering by time range
   - `idx_sessions_end_time`: Helps with duration calculations
   - `idx_sessions_status`: Improves filtering by session status
   - `idx_sessions_project_id`: Speeds up project-based filtering
   - `idx_sessions_date`: Optimizes daily aggregation queries

2. **Projects Table**:
   - `idx_projects_name`: Speeds up name-based lookups
   - `idx_projects_last_active`: Helps with sorting by recent activity

3. **Tags Table**:
   - `idx_tags_name`: Optimizes tag name searches
   - `idx_tags_usage_count`: Helps with sorting by popularity

4. **Junction Tables**:
   - `idx_session_tags_tag_id`: Speeds up finding sessions by tag
   - `idx_pomodoro_session`: Optimizes finding pomodoros by session
   - `idx_break_pomodoro`: Helps with finding breaks by pomodoro

## Migrations

### Initial Migration (v0 → v1)

The initial migration creates all tables, indexes, triggers, and default settings. To apply:

```bash
sqlite3 time_tracking.db < database/migrations/v0_to_v1.sql
```

### Migration Best Practices

1. **Always use transactions**:
   ```sql
   BEGIN TRANSACTION;
   -- migration steps
   COMMIT;
   ```

2. **Version checking**:
   ```sql
   SELECT CASE
       WHEN EXISTS (SELECT 1 FROM migrations WHERE version = ''vX.Y'')
       THEN RAISE(ABORT, ''Migration vX.Y has already been applied'')
   END;
   ```

3. **Verification steps**:
   ```sql
   SELECT CASE
       WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type=''table'' AND name=''new_table'')
       THEN RAISE(ABORT, ''Table new_table not created'')
   END;
   ```

## Usage Examples

### Session Tracking

```sql
-- Start a new session
INSERT INTO sessions (id, start_time, status, project_id, file_path)
VALUES (
    ''f47ac10b-58cc-4372-a567-0e02b2c3d479'',
    datetime(''now''),
    ''active'',
    ''550e8400-e29b-41d4-a716-446655440000'',
    ''src/extension.ts''
);

-- Complete a session
UPDATE sessions
SET 
    status = ''completed'',
    end_time = datetime(''now''),
    updated_at = datetime(''now'')
WHERE id = ''f47ac10b-58cc-4372-a567-0e02b2c3d479'';
```

### Analytics Queries

```sql
-- Daily productivity overview
SELECT 
    date(s.start_time) as date,
    COUNT(*) as sessions_count,
    SUM(s.duration) / 1000.0 / 60 / 60 as total_hours,
    COUNT(CASE WHEN s.duration >= 1500000 THEN 1 END) as deep_work_sessions
FROM sessions s
WHERE s.start_time >= datetime(''now'', ''-7 days'')
    AND s.status = ''completed''
GROUP BY date(s.start_time)
ORDER BY date;
```

See `database/crud_examples.sql` for more comprehensive examples.

## Best Practices

### Data Integrity

1. **Always use transactions** for operations that modify multiple tables
2. **Use prepared statements** to prevent SQL injection
3. **Validate data** before insertion, especially for fields with CHECK constraints

### Performance

1. **Batch inserts** when adding multiple records
2. **Use indexes wisely** - too many indexes can slow down writes
3. **Consider periodic maintenance**:
   ```sql
   PRAGMA analysis_limit=1000;
   PRAGMA optimize;
   ```

### Maintenance

1. **Regular backups**:
   ```bash
   sqlite3 time_tracking.db ".backup ''backup-$(date +%Y%m%d).db''"
   ```

2. **Data retention**:
   ```sql
   DELETE FROM sessions
   WHERE status = ''completed''
       AND start_time < datetime(''now'', ''-365 days'');
   ```

## License

This schema is part of the Cursor AI Time Tracking Extension, licensed under MIT.