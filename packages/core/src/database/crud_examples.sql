-- ======================================================
-- CRUD Query Examples for Cursor AI TimeTracking Extension
-- Version: 1.0  
-- Date: 2025-07-06
-- Description: Comprehensive SQL examples for all CRUD operations
-- ======================================================

-- This file contains practical SQL examples for:
-- 1. CREATE operations (INSERT statements)
-- 2. READ operations (SELECT queries with various filters)
-- 3. UPDATE operations (session state changes, data updates)
-- 4. DELETE operations (cleanup and data retention)
-- 5. Advanced analytics and reporting queries
-- 6. Data maintenance and optimization
-- 7. Data validation and consistency checks
-- 8. Export and backup operations
-- 9. Business intelligence and dashboard queries

-- ======================================================
-- 1. CREATE Examples - INSERT Operations
-- ======================================================

-- Create a new project
INSERT INTO projects (id, name, description, git_repository, git_branch, color)
VALUES (
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'Cursor Time Tracker',
    'Time tracking extension for Cursor IDE',
    'https://github.com/user/cursor-time-tracker',
    'main',
    '#3B82F6'
);

-- Create additional projects for testing
INSERT INTO projects (id, name, description, git_repository, git_branch, color) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'React Dashboard', 'Analytics dashboard project', 'https://github.com/user/react-dashboard', 'develop', '#10B981'),
('550e8400-e29b-41d4-a716-446655440011', 'Node API Server', 'Backend API for mobile app', 'https://github.com/user/node-api', 'feature/auth', '#EF4444'),
('550e8400-e29b-41d4-a716-446655440012', 'Documentation Site', 'Technical documentation', NULL, NULL, '#8B5CF6');

-- Create tags for categorization
INSERT INTO tags (id, name, color) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'feature', '#10B981'),
('550e8400-e29b-41d4-a716-446655440002', 'bugfix', '#EF4444'),
('550e8400-e29b-41d4-a716-446655440003', 'refactor', '#8B5CF6'),
('550e8400-e29b-41d4-a716-446655440004', 'documentation', '#F59E0B'),
('550e8400-e29b-41d4-a716-446655440005', 'testing', '#06B6D4'),
('550e8400-e29b-41d4-a716-446655440006', 'deployment', '#EC4899'),
('550e8400-e29b-41d4-a716-446655440007', 'research', '#84CC16'),
('550e8400-e29b-41d4-a716-446655440008', 'meeting', '#F97316'),
('550e8400-e29b-41d4-a716-446655440009', 'review', '#6366F1');

-- Start a new session
INSERT INTO sessions (id, start_time, status, project_id, file_path, complexity)
VALUES (
    '123e4567-e89b-12d3-a456-426614174000',
    datetime('now'),
    'active',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'src/extension.ts',
    75.5
);

-- Create a completed session with full data
INSERT INTO sessions (id, start_time, end_time, duration, status, project_id, file_path, complexity, stress_level, interruptions)
VALUES (
    '123e4567-e89b-12d3-a456-426614174001',
    datetime('now', '-2 hours'),
    datetime('now', '-1 hour'),
    3600000, -- 1 hour in milliseconds
    'completed',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'src/services/session-tracker.ts',
    85.2,
    42.8,
    2
);

-- Add tags to sessions (many-to-many relationship)
INSERT INTO session_tags (session_id, tag_id) VALUES
('123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440001'),
('123e4567-e89b-12d3-a456-426614174000', '550e8400-e29b-41d4-a716-446655440003'),
('123e4567-e89b-12d3-a456-426614174001', '550e8400-e29b-41d4-a716-446655440001'),
('123e4567-e89b-12d3-a456-426614174001', '550e8400-e29b-41d4-a716-446655440005');

-- Create pomodoro sessions
INSERT INTO pomodoro (id, start_time, end_time, duration, status, session_id) VALUES
('987fcdeb-51a2-43d7-8f9e-12345678abcd', datetime('now', '-90 minutes'), datetime('now', '-65 minutes'), 25, 'completed', '123e4567-e89b-12d3-a456-426614174001'),
('987fcdeb-51a2-43d7-8f9e-12345678abce', datetime('now', '-60 minutes'), datetime('now', '-35 minutes'), 25, 'completed', '123e4567-e89b-12d3-a456-426614174001'),
('987fcdeb-51a2-43d7-8f9e-12345678abcf', datetime('now', '-30 minutes'), NULL, 25, 'active', '123e4567-e89b-12d3-a456-426614174000');

-- Create break records
INSERT INTO break (id, start_time, end_time, duration, is_long_break, pomodoro_id) VALUES
('555e8400-e29b-41d4-a716-446655440020', datetime('now', '-65 minutes'), datetime('now', '-60 minutes'), 5, 0, '987fcdeb-51a2-43d7-8f9e-12345678abcd'),
('555e8400-e29b-41d4-a716-446655440021', datetime('now', '-35 minutes'), datetime('now', '-30 minutes'), 5, 0, '987fcdeb-51a2-43d7-8f9e-12345678abce');

-- Insert comprehensive settings
INSERT INTO settings (key, value, type) VALUES
('idleTimeout', '90', 'number'),
('dailyGoal', '240', 'number'),
('pomodoroLength', '25', 'number'),
('breakLength', '5', 'number'),
('longBreakLength', '15', 'number'),
('pomodorosUntilLongBreak', '4', 'number'),
('autoStartBreaks', 'true', 'boolean'),
('autoStartPomodoros', 'false', 'boolean'),
('theme', 'dark', 'string'),
('dataRetention', '365', 'number'),
('notifications', '{"sessionEnd":true,"breakEnd":true,"idleDetected":true,"dailyGoalReached":true}', 'json'),
('features', '{"pomodoro":true,"aiAnalytics":false,"healthMonitoring":false}', 'json');

-- Create sample daily statistics
INSERT INTO daily_stats (date, total_time, active_time, deep_work_time, deep_work_percentage, sessions_count, average_session_length, context_switches, goal_completion) VALUES
('2025-07-05', 14400000, 12960000, 9000000, 69.4, 6, 2400000, 3, 90.0),
('2025-07-04', 16200000, 14580000, 10800000, 74.1, 8, 2025000, 2, 101.3),
('2025-07-03', 10800000, 9720000, 5400000, 55.6, 4, 2700000, 1, 67.5);

-- ======================================================
-- 2. READ Examples - SELECT Queries
-- ======================================================

-- Get all active sessions with project information
SELECT 
    s.id,
    s.start_time,
    s.file_path,
    s.complexity,
    s.stress_level,
    p.name as project_name,
    p.color as project_color,
    p.git_branch
FROM sessions s
LEFT JOIN projects p ON s.project_id = p.id
WHERE s.status = 'active'
ORDER BY s.start_time DESC;

-- Get session details with all associated tags
SELECT 
    s.id,
    s.start_time,
    s.end_time,
    s.duration / 1000.0 / 60 as duration_minutes,
    s.status,
    s.complexity,
    s.stress_level,
    s.interruptions,
    p.name as project_name,
    p.color as project_color,
    GROUP_CONCAT(t.name, ', ') as tags
FROM sessions s
LEFT JOIN projects p ON s.project_id = p.id
LEFT JOIN session_tags st ON s.id = st.session_id
LEFT JOIN tags t ON st.tag_id = t.id
WHERE s.id = '123e4567-e89b-12d3-a456-426614174001'
GROUP BY s.id, s.start_time, s.end_time, s.duration, s.status, s.complexity, s.stress_level, s.interruptions, p.name, p.color;

-- Get daily statistics for the current week
SELECT 
    date(start_time) as date,
    COUNT(*) as sessions_count,
    SUM(duration) / 1000.0 / 60 / 60 as total_hours,
    AVG(duration) / 1000.0 / 60 as avg_session_minutes,
    COUNT(CASE WHEN duration >= 1500000 THEN 1 END) as deep_work_sessions,
    ROUND(AVG(complexity), 1) as avg_complexity,
    ROUND(AVG(stress_level), 1) as avg_stress_level,
    SUM(interruptions) as total_interruptions
FROM sessions
WHERE status = 'completed'
    AND start_time >= datetime('now', '-7 days')
    AND start_time < datetime('now', 'start of day', '+1 day')
GROUP BY date(start_time)
ORDER BY date DESC;

-- Get project breakdown for the current month
SELECT 
    p.name as project_name,
    p.color,
    p.git_repository,
    p.git_branch,
    COUNT(s.id) as sessions_count,
    ROUND(SUM(s.duration) / 1000.0 / 60 / 60, 2) as total_hours,
    ROUND(AVG(s.duration) / 1000.0 / 60, 1) as avg_session_minutes,
    MAX(s.start_time) as last_session,
    COUNT(CASE WHEN s.duration >= 1500000 THEN 1 END) as deep_work_sessions
FROM projects p
LEFT JOIN sessions s ON p.id = s.project_id 
    AND s.status = 'completed'
    AND s.start_time >= datetime('now', 'start of month')
WHERE NOT p.is_archived
GROUP BY p.id, p.name, p.color, p.git_repository, p.git_branch
HAVING COUNT(s.id) > 0
ORDER BY total_hours DESC;

-- Get most used tags with usage statistics
SELECT 
    t.name,
    t.color,
    t.usage_count,
    COUNT(st.session_id) as recent_usage,
    ROUND(AVG(s.duration) / 1000.0 / 60, 1) as avg_session_minutes,
    COUNT(CASE WHEN s.duration >= 1500000 THEN 1 END) as deep_work_sessions
FROM tags t
LEFT JOIN session_tags st ON t.id = st.tag_id
LEFT JOIN sessions s ON st.session_id = s.id 
    AND s.start_time >= datetime('now', '-30 days')
    AND s.status = 'completed'
GROUP BY t.id, t.name, t.color, t.usage_count
ORDER BY t.usage_count DESC, recent_usage DESC;

-- Get current user settings as typed values
SELECT 
    key,
    value,
    CASE 
        WHEN type = 'number' THEN CAST(value AS INTEGER)
        WHEN type = 'boolean' THEN CASE WHEN value = 'true' THEN 1 ELSE 0 END
        ELSE value
    END as typed_value,
    type,
    updated_at
FROM settings
ORDER BY key;

-- Get productivity insights for dashboard
SELECT 
    'today' as period,
    COUNT(*) as sessions,
    COALESCE(SUM(duration), 0) / 1000.0 / 60 / 60 as hours,
    COUNT(CASE WHEN duration >= 1500000 THEN 1 END) as deep_work_sessions,
    COALESCE(AVG(complexity), 0) as avg_complexity,
    COALESCE(AVG(stress_level), 0) as avg_stress_level
FROM sessions 
WHERE status = 'completed' 
    AND date(start_time) = date('now')

UNION ALL

SELECT 
    'yesterday' as period,
    COUNT(*) as sessions,
    COALESCE(SUM(duration), 0) / 1000.0 / 60 / 60 as hours,
    COUNT(CASE WHEN duration >= 1500000 THEN 1 END) as deep_work_sessions,
    COALESCE(AVG(complexity), 0) as avg_complexity,
    COALESCE(AVG(stress_level), 0) as avg_stress_level
FROM sessions 
WHERE status = 'completed' 
    AND date(start_time) = date('now', '-1 day')

UNION ALL

SELECT 
    'this_week' as period,
    COUNT(*) as sessions,
    COALESCE(SUM(duration), 0) / 1000.0 / 60 / 60 as hours,
    COUNT(CASE WHEN duration >= 1500000 THEN 1 END) as deep_work_sessions,
    COALESCE(AVG(complexity), 0) as avg_complexity,
    COALESCE(AVG(stress_level), 0) as avg_stress_level
FROM sessions 
WHERE status = 'completed' 
    AND start_time >= datetime('now', 'weekday 0', '-6 days');

-- Get pomodoro statistics
SELECT 
    date(start_time) as date,
    COUNT(*) as total_pomodoros,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_pomodoros,
    COUNT(CASE WHEN status = 'interrupted' THEN 1 END) as interrupted_pomodoros,
    ROUND(COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*), 1) as completion_rate,
    AVG(duration) as avg_duration_minutes
FROM pomodoro
WHERE start_time >= datetime('now', '-7 days')
GROUP BY date(start_time)
ORDER BY date DESC;

-- Get break patterns analysis
SELECT 
    strftime('%H', start_time) as hour,
    COUNT(*) as break_count,
    AVG(duration) as avg_break_minutes,
    COUNT(CASE WHEN is_long_break = 1 THEN 1 END) as long_breaks,
    COUNT(CASE WHEN is_long_break = 0 THEN 1 END) as short_breaks
FROM break
WHERE start_time >= datetime('now', '-30 days')
GROUP BY strftime('%H', start_time)
ORDER BY hour;

-- ======================================================
-- 3. UPDATE Examples - Modify Existing Data
-- ======================================================

-- Complete an active session
UPDATE sessions 
SET 
    status = 'completed',
    end_time = datetime('now'),
    updated_at = datetime('now')
WHERE id = '123e4567-e89b-12d3-a456-426614174000'
    AND status = 'active';

-- Update session complexity and stress level during coding
UPDATE sessions 
SET 
    complexity = 85.2,
    stress_level = 45.8,
    file_path = 'src/services/session-tracker.ts',
    updated_at = datetime('now')
WHERE id = '123e4567-e89b-12d3-a456-426614174000';

-- Increment interruption count when context switch detected
UPDATE sessions 
SET 
    interruptions = interruptions + 1,
    updated_at = datetime('now')
WHERE id = '123e4567-e89b-12d3-a456-426614174000';

-- Pause an active session
UPDATE sessions 
SET 
    status = 'paused',
    updated_at = datetime('now')
WHERE id = '123e4567-e89b-12d3-a456-426614174000'
    AND status = 'active';

-- Resume a paused session
UPDATE sessions 
SET 
    status = 'active',
    updated_at = datetime('now')
WHERE id = '123e4567-e89b-12d3-a456-426614174000'
    AND status = 'paused';

-- Mark session as interrupted
UPDATE sessions 
SET 
    status = 'interrupted',
    end_time = datetime('now'),
    updated_at = datetime('now')
WHERE id = '123e4567-e89b-12d3-a456-426614174000'
    AND status IN ('active', 'paused');

-- Update project Git branch when branch changes
UPDATE projects 
SET 
    git_branch = 'feature/session-analytics',
    updated_at = datetime('now')
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- Update project description and repository
UPDATE projects 
SET 
    description = 'Advanced time tracking extension with AI analytics',
    git_repository = 'https://github.com/newuser/cursor-time-tracker-pro',
    updated_at = datetime('now')
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- Archive old projects
UPDATE projects 
SET 
    is_archived = 1,
    updated_at = datetime('now')
WHERE last_active < datetime('now', '-6 months')
    AND is_archived = 0;

-- Unarchive a project
UPDATE projects 
SET 
    is_archived = 0,
    updated_at = datetime('now')
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- Update tag color
UPDATE tags 
SET 
    color = '#FF6B6B',
    updated_at = datetime('now')
WHERE name = 'bugfix';

-- Complete a pomodoro session
UPDATE pomodoro 
SET 
    status = 'completed',
    end_time = datetime('now')
WHERE id = '987fcdeb-51a2-43d7-8f9e-12345678abcf'
    AND status = 'active';

-- Interrupt a pomodoro session
UPDATE pomodoro 
SET 
    status = 'interrupted',
    end_time = datetime('now')
WHERE id = '987fcdeb-51a2-43d7-8f9e-12345678abcf'
    AND status = 'active';

-- End a break
UPDATE break 
SET 
    end_time = datetime('now')
WHERE id = '555e8400-e29b-41d4-a716-446655440021'
    AND end_time IS NULL;

-- Update user settings
UPDATE settings 
SET 
    value = '300',
    updated_at = datetime('now')
WHERE key = 'dailyGoal';

-- Update notification preferences
UPDATE settings 
SET 
    value = '{"sessionEnd":true,"breakEnd":false,"idleDetected":true,"dailyGoalReached":true}',
    updated_at = datetime('now')
WHERE key = 'notifications';

-- Enable AI analytics feature
UPDATE settings 
SET 
    value = '{"pomodoro":true,"aiAnalytics":true,"healthMonitoring":false}',
    updated_at = datetime('now')
WHERE key = 'features';

-- Bulk update session file paths (e.g., after file moves)
UPDATE sessions 
SET 
    file_path = REPLACE(file_path, 'src/old/', 'src/new/'),
    updated_at = datetime('now')
WHERE file_path LIKE 'src/old/%';

-- Update stress levels for sessions without stress data
UPDATE sessions 
SET 
    stress_level = 50.0,
    updated_at = datetime('now')
WHERE stress_level IS NULL 
    AND status = 'completed'
    AND start_time >= datetime('now', '-7 days');

-- ======================================================
-- 4. DELETE Examples - Data Cleanup
-- ======================================================

-- Remove very old completed sessions (data retention)
DELETE FROM sessions 
WHERE status = 'completed'
    AND start_time < datetime('now', '-1 year');

-- Clean up orphaned session tags (defensive programming)
DELETE FROM session_tags 
WHERE session_id NOT IN (SELECT id FROM sessions);

-- Remove unused tags (zero usage count)
DELETE FROM tags 
WHERE usage_count = 0
    AND id NOT IN (SELECT DISTINCT tag_id FROM session_tags WHERE tag_id IS NOT NULL);

-- Delete interrupted sessions older than 24 hours
DELETE FROM sessions 
WHERE status = 'interrupted'
    AND start_time < datetime('now', '-1 day');

-- Remove old pomodoro records
DELETE FROM pomodoro 
WHERE start_time < datetime('now', '-6 months');

-- Remove old break records
DELETE FROM break 
WHERE start_time < datetime('now', '-6 months');

-- Clean up old daily statistics
DELETE FROM daily_stats 
WHERE date < date('now', '-1 year');

-- Remove old project daily statistics
DELETE FROM project_daily_stats 
WHERE date < date('now', '-1 year');

-- Delete archived projects (be careful with this!)
-- DELETE FROM projects 
-- WHERE is_archived = 1
--     AND last_active < datetime('now', '-2 years');

-- Clean up settings that are no longer used
DELETE FROM settings 
WHERE key NOT IN (
    'idleTimeout', 'dailyGoal', 'pomodoroLength', 'breakLength',
    'longBreakLength', 'pomodorosUntilLongBreak', 'autoStartBreaks',
    'autoStartPomodoros', 'theme', 'dataRetention', 'notifications', 'features'
);

-- Remove sessions without projects that are older than 30 days
DELETE FROM sessions 
WHERE project_id IS NULL
    AND start_time < datetime('now', '-30 days')
    AND status IN ('completed', 'interrupted');

-- ======================================================
-- 5. Advanced Analytics Queries
-- ======================================================

-- Weekly productivity trend analysis
WITH weekly_stats AS (
    SELECT 
        strftime('%Y-W%W', start_time) as week,
        COUNT(*) as sessions_count,
        SUM(duration) / 1000.0 / 60 / 60 as total_hours,
        AVG(duration) / 1000.0 / 60 as avg_session_minutes,
        COUNT(CASE WHEN duration >= 1500000 THEN 1 END) as deep_work_sessions,
        AVG(complexity) as avg_complexity,
        AVG(stress_level) as avg_stress_level,
        SUM(interruptions) as total_interruptions
    FROM sessions
    WHERE status = 'completed'
        AND start_time >= datetime('now', '-12 weeks')
    GROUP BY strftime('%Y-W%W', start_time)
)
SELECT 
    week,
    sessions_count,
    ROUND(total_hours, 2) as total_hours,
    ROUND(avg_session_minutes, 1) as avg_session_minutes,
    deep_work_sessions,
    ROUND(deep_work_sessions * 100.0 / sessions_count, 1) as deep_work_percentage,
    ROUND(avg_complexity, 1) as avg_complexity,
    ROUND(avg_stress_level, 1) as avg_stress_level,
    total_interruptions
FROM weekly_stats
ORDER BY week;

-- Best productivity hours analysis
SELECT 
    strftime('%H', start_time) as hour,
    COUNT(*) as sessions_count,
    ROUND(AVG(duration) / 1000.0 / 60, 1) as avg_session_minutes,
    COUNT(CASE WHEN duration >= 1500000 THEN 1 END) as deep_work_sessions,
    ROUND(AVG(complexity), 1) as avg_complexity,
    ROUND(AVG(stress_level), 1) as avg_stress_level,
    ROUND(AVG(interruptions), 1) as avg_interruptions
FROM sessions
WHERE status = 'completed'
    AND start_time >= datetime('now', '-30 days')
GROUP BY strftime('%H', start_time)
HAVING sessions_count >= 3
ORDER BY avg_session_minutes DESC, deep_work_sessions DESC;

-- Project switching patterns (context switching analysis)
WITH session_sequences AS (
    SELECT 
        id,
        start_time,
        project_id,
        LAG(project_id) OVER (ORDER BY start_time) as previous_project,
        file_path,
        duration
    FROM sessions
    WHERE status = 'completed'
        AND start_time >= datetime('now', '-30 days')
)
SELECT 
    date(start_time) as date,
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN project_id != previous_project AND previous_project IS NOT NULL THEN 1 END) as context_switches,
    ROUND(COUNT(CASE WHEN project_id != previous_project AND previous_project IS NOT NULL THEN 1 END) * 100.0 / COUNT(*), 1) as context_switch_percentage
FROM session_sequences
WHERE previous_project IS NOT NULL
GROUP BY date(start_time)
ORDER BY date DESC;

-- Tag correlation analysis
SELECT 
    t1.name as tag1,
    t2.name as tag2,
    COUNT(*) as co_occurrence_count,
    ROUND(AVG(s.duration) / 1000.0 / 60, 1) as avg_session_minutes,
    ROUND(AVG(s.complexity), 1) as avg_complexity
FROM session_tags st1
JOIN session_tags st2 ON st1.session_id = st2.session_id AND st1.tag_id < st2.tag_id
JOIN tags t1 ON st1.tag_id = t1.id
JOIN tags t2 ON st2.tag_id = t2.id
JOIN sessions s ON st1.session_id = s.id
WHERE s.status = 'completed'
    AND s.start_time >= datetime('now', '-30 days')
GROUP BY t1.id, t2.id, t1.name, t2.name
HAVING co_occurrence_count >= 3
ORDER BY co_occurrence_count DESC, avg_session_minutes DESC;

-- Daily goal achievement tracking
WITH daily_goals AS (
    SELECT 
        date(start_time) as date,
        SUM(duration) / 1000.0 / 60 as daily_minutes,
        (SELECT CAST(value AS INTEGER) FROM settings WHERE key = 'dailyGoal') as goal_minutes
    FROM sessions
    WHERE status = 'completed'
        AND start_time >= datetime('now', '-30 days')
    GROUP BY date(start_time)
)
SELECT 
    date,
    ROUND(daily_minutes, 1) as daily_minutes,
    goal_minutes,
    ROUND(daily_minutes / goal_minutes * 100.0, 1) as goal_completion_percentage,
    CASE 
        WHEN daily_minutes >= goal_minutes THEN 'achieved'
        WHEN daily_minutes >= goal_minutes * 0.8 THEN 'close'
        ELSE 'missed'
    END as goal_status
FROM daily_goals
ORDER BY date DESC;

-- Productivity streaks calculation
WITH daily_productivity AS (
    SELECT 
        date(start_time) as date,
        SUM(duration) / 1000.0 / 60 as daily_minutes,
        (SELECT CAST(value AS INTEGER) FROM settings WHERE key = 'dailyGoal') as goal_minutes
    FROM sessions
    WHERE status = 'completed'
    GROUP BY date(start_time)
),
streak_data AS (
    SELECT 
        date,
        daily_minutes >= goal_minutes as goal_met,
        ROW_NUMBER() OVER (ORDER BY date) - 
        ROW_NUMBER() OVER (PARTITION BY daily_minutes >= goal_minutes ORDER BY date) as streak_group
    FROM daily_productivity
    WHERE date >= date('now', '-90 days')
)
SELECT 
    MIN(date) as streak_start,
    MAX(date) as streak_end,
    COUNT(*) as streak_length,
    goal_met
FROM streak_data
GROUP BY streak_group, goal_met
HAVING goal_met = 1
ORDER BY streak_length DESC
LIMIT 10;

-- Complex session analytics with percentiles
SELECT 
    'session_duration' as metric,
    ROUND(AVG(duration) / 1000.0 / 60, 1) as average,
    ROUND(MIN(duration) / 1000.0 / 60, 1) as minimum,
    ROUND(MAX(duration) / 1000.0 / 60, 1) as maximum,
    COUNT(*) as sample_size
FROM sessions
WHERE status = 'completed'
    AND start_time >= datetime('now', '-30 days')

UNION ALL

SELECT 
    'complexity' as metric,
    ROUND(AVG(complexity), 1) as average,
    ROUND(MIN(complexity), 1) as minimum,
    ROUND(MAX(complexity), 1) as maximum,
    COUNT(*) as sample_size
FROM sessions
WHERE status = 'completed'
    AND complexity IS NOT NULL
    AND start_time >= datetime('now', '-30 days')

UNION ALL

SELECT 
    'stress_level' as metric,
    ROUND(AVG(stress_level), 1) as average,
    ROUND(MIN(stress_level), 1) as minimum,
    ROUND(MAX(stress_level), 1) as maximum,
    COUNT(*) as sample_size
FROM sessions
WHERE status = 'completed'
    AND stress_level IS NOT NULL
    AND start_time >= datetime('now', '-30 days');

-- Pomodoro effectiveness analysis
WITH pomodoro_stats AS (
    SELECT 
        date(p.start_time) as date,
        COUNT(*) as total_pomodoros,
        COUNT(CASE WHEN p.status = 'completed' THEN 1 END) as completed_pomodoros,
        AVG(s.complexity) as avg_complexity,
        AVG(s.stress_level) as avg_stress_level
    FROM pomodoro p
    LEFT JOIN sessions s ON p.session_id = s.id
    WHERE p.start_time >= datetime('now', '-30 days')
    GROUP BY date(p.start_time)
)
SELECT 
    date,
    total_pomodoros,
    completed_pomodoros,
    ROUND(completed_pomodoros * 100.0 / total_pomodoros, 1) as completion_rate,
    ROUND(avg_complexity, 1) as avg_complexity,
    ROUND(avg_stress_level, 1) as avg_stress_level
FROM pomodoro_stats
ORDER BY date DESC;

-- File-level productivity analysis
SELECT 
    file_path,
    COUNT(*) as sessions_count,
    ROUND(SUM(duration) / 1000.0 / 60 / 60, 2) as total_hours,
    ROUND(AVG(duration) / 1000.0 / 60, 1) as avg_session_minutes,
    ROUND(AVG(complexity), 1) as avg_complexity,
    ROUND(AVG(stress_level), 1) as avg_stress_level,
    SUM(interruptions) as total_interruptions
FROM sessions
WHERE status = 'completed'
    AND file_path IS NOT NULL
    AND start_time >= datetime('now', '-30 days')
GROUP BY file_path
HAVING sessions_count >= 3
ORDER BY total_hours DESC;

-- ======================================================
-- 6. Data Maintenance and Optimization Queries
-- ======================================================

-- Update daily statistics (scheduled job)
INSERT OR REPLACE INTO daily_stats (
    date,
    total_time,
    active_time,
    deep_work_time,
    deep_work_percentage,
    sessions_count,
    average_session_length,
    context_switches,
    goal_completion
)
SELECT 
    date(start_time) as date,
    COALESCE(SUM(duration), 0) as total_time,
    COALESCE(SUM(CASE WHEN status = 'completed' THEN duration ELSE 0 END), 0) as active_time,
    COALESCE(SUM(CASE WHEN duration >= 1500000 THEN duration ELSE 0 END), 0) as deep_work_time,
    CASE 
        WHEN SUM(duration) > 0 THEN 
            ROUND(SUM(CASE WHEN duration >= 1500000 THEN duration ELSE 0 END) * 100.0 / SUM(duration), 2)
        ELSE 0
    END as deep_work_percentage,
    COUNT(*) as sessions_count,
    COALESCE(AVG(duration), 0) as average_session_length,
    COUNT(CASE WHEN LAG(project_id) OVER (ORDER BY start_time) != project_id THEN 1 END) as context_switches,
    CASE 
        WHEN SUM(duration) >= (SELECT CAST(value AS INTEGER) * 60 * 1000 FROM settings WHERE key = 'dailyGoal') 
        THEN 100.0
        ELSE ROUND(SUM(duration) * 100.0 / (SELECT CAST(value AS INTEGER) * 60 * 1000 FROM settings WHERE key = 'dailyGoal'), 1)
    END as goal_completion
FROM sessions
WHERE date(start_time) = date('now', '-1 day')
GROUP BY date(start_time);

-- Update project daily statistics
INSERT OR REPLACE INTO project_daily_stats (
    date,
    project_id,
    total_time,
    sessions_count
)
SELECT 
    date(start_time) as date,
    project_id,
    COALESCE(SUM(duration), 0) as total_time,
    COUNT(*) as sessions_count
FROM sessions
WHERE status = 'completed'
    AND project_id IS NOT NULL
    AND date(start_time) = date('now', '-1 day')
GROUP BY date(start_time), project_id;

-- Recompute tag usage counts
UPDATE tags 
SET usage_count = (
    SELECT COUNT(*) 
    FROM session_tags 
    WHERE tag_id = tags.id
);

-- Update project last_active timestamps
UPDATE projects 
SET last_active = (
    SELECT MAX(start_time) 
    FROM sessions 
    WHERE project_id = projects.id
)
WHERE id IN (
    SELECT DISTINCT project_id 
    FROM sessions 
    WHERE project_id IS NOT NULL
);

-- Vacuum and optimize database (should be run periodically)
-- Note: These should be run separately, not in a transaction
-- VACUUM;
-- ANALYZE;
-- PRAGMA optimize;

-- ======================================================
-- 7. Data Validation and Consistency Checks
-- ======================================================

-- Check for data inconsistencies
SELECT 'Orphaned session tags' as issue, COUNT(*) as count
FROM session_tags st
LEFT JOIN sessions s ON st.session_id = s.id
WHERE s.id IS NULL

UNION ALL

SELECT 'Sessions without duration but with end_time' as issue, COUNT(*) as count
FROM sessions
WHERE end_time IS NOT NULL AND duration IS NULL

UNION ALL

SELECT 'Completed sessions without end_time' as issue, COUNT(*) as count
FROM sessions
WHERE status = 'completed' AND end_time IS NULL

UNION ALL

SELECT 'Sessions with negative duration' as issue, COUNT(*) as count
FROM sessions
WHERE duration < 0

UNION ALL

SELECT 'Projects with invalid last_active' as issue, COUNT(*) as count
FROM projects p
LEFT JOIN sessions s ON p.id = s.project_id
WHERE p.last_active IS NOT NULL 
    AND p.last_active > datetime('now')

UNION ALL

SELECT 'Tags with incorrect usage_count' as issue, COUNT(*) as count
FROM tags t
WHERE t.usage_count != (
    SELECT COUNT(*) 
    FROM session_tags st 
    WHERE st.tag_id = t.id
)

UNION ALL

SELECT 'Pomodoros without sessions' as issue, COUNT(*) as count
FROM pomodoro p
LEFT JOIN sessions s ON p.session_id = s.id
WHERE p.session_id IS NOT NULL AND s.id IS NULL

UNION ALL

SELECT 'Breaks without pomodoros' as issue, COUNT(*) as count
FROM break b
LEFT JOIN pomodoro p ON b.pomodoro_id = p.id
WHERE b.pomodoro_id IS NOT NULL AND p.id IS NULL;

-- Validate data ranges
SELECT 'Sessions with invalid complexity' as issue, COUNT(*) as count
FROM sessions
WHERE complexity IS NOT NULL AND (complexity < 0 OR complexity > 100)

UNION ALL

SELECT 'Sessions with invalid stress_level' as issue, COUNT(*) as count
FROM sessions
WHERE stress_level IS NOT NULL AND (stress_level < 0 OR stress_level > 100)

UNION ALL

SELECT 'Sessions with future start_time' as issue, COUNT(*) as count
FROM sessions
WHERE start_time > datetime('now')

UNION ALL

SELECT 'Sessions with end_time before start_time' as issue, COUNT(*) as count
FROM sessions
WHERE end_time IS NOT NULL AND end_time < start_time;

-- ======================================================
-- 8. Export and Reporting Queries
-- ======================================================

-- Export all session data for backup/analysis
SELECT 
    s.id,
    s.start_time,
    s.end_time,
    s.duration,
    s.status,
    s.file_path,
    s.complexity,
    s.stress_level,
    s.interruptions,
    p.name as project_name,
    p.git_repository,
    p.git_branch,
    GROUP_CONCAT(t.name, '|') as tags,
    s.created_at,
    s.updated_at
FROM sessions s
LEFT JOIN projects p ON s.project_id = p.id
LEFT JOIN session_tags st ON s.id = st.session_id
LEFT JOIN tags t ON st.tag_id = t.id
GROUP BY s.id, s.start_time, s.end_time, s.duration, s.status, s.file_path, s.complexity, s.stress_level, s.interruptions, p.name, p.git_repository, p.git_branch, s.created_at, s.updated_at
ORDER BY s.start_time;

-- Generate weekly report
SELECT 
    strftime('%Y-W%W', start_time) as week,
    p.name as project,
    COUNT(*) as sessions,
    ROUND(SUM(duration) / 1000.0 / 60 / 60, 2) as hours,
    ROUND(AVG(duration) / 1000.0 / 60, 1) as avg_minutes,
    COUNT(CASE WHEN duration >= 1500000 THEN 1 END) as deep_work_sessions,
    GROUP_CONCAT(DISTINCT t.name, ', ') as tags_used,
    ROUND(AVG(complexity), 1) as avg_complexity,
    ROUND(AVG(stress_level), 1) as avg_stress_level
FROM sessions s
LEFT JOIN projects p ON s.project_id = p.id
LEFT JOIN session_tags st ON s.id = st.session_id
LEFT JOIN tags t ON st.tag_id = t.id
WHERE s.status = 'completed'
    AND s.start_time >= datetime('now', '-4 weeks')
GROUP BY strftime('%Y-W%W', start_time), p.id, p.name
ORDER BY week DESC, hours DESC;

-- Generate monthly productivity report
SELECT 
    strftime('%Y-%m', start_time) as month,
    COUNT(*) as total_sessions,
    ROUND(SUM(duration) / 1000.0 / 60 / 60, 1) as total_hours,
    ROUND(AVG(duration) / 1000.0 / 60, 1) as avg_session_minutes,
    COUNT(CASE WHEN duration >= 1500000 THEN 1 END) as deep_work_sessions,
    ROUND(COUNT(CASE WHEN duration >= 1500000 THEN 1 END) * 100.0 / COUNT(*), 1) as deep_work_percentage,
    COUNT(DISTINCT project_id) as projects_worked_on,
    SUM(interruptions) as total_interruptions,
    ROUND(AVG(complexity), 1) as avg_complexity,
    ROUND(AVG(stress_level), 1) as avg_stress_level
FROM sessions
WHERE status = 'completed'
    AND start_time >= datetime('now', '-12 months')
GROUP BY strftime('%Y-%m', start_time)
ORDER BY month DESC;

-- Export project summary
SELECT 
    p.id,
    p.name,
    p.description,
    p.git_repository,
    p.git_branch,
    p.color,
    p.is_archived,
    COUNT(s.id) as total_sessions,
    ROUND(SUM(s.duration) / 1000.0 / 60 / 60, 2) as total_hours,
    ROUND(AVG(s.duration) / 1000.0 / 60, 1) as avg_session_minutes,
    MIN(s.start_time) as first_session,
    MAX(s.start_time) as last_session,
    p.created_at,
    p.updated_at
FROM projects p
LEFT JOIN sessions s ON p.id = s.project_id AND s.status = 'completed'
GROUP BY p.id, p.name, p.description, p.git_repository, p.git_branch, p.color, p.is_archived, p.created_at, p.updated_at
ORDER BY total_hours DESC NULLS LAST;

-- Export tags with statistics
SELECT 
    t.id,
    t.name,
    t.color,
    t.usage_count,
    COUNT(s.id) as recent_sessions,
    ROUND(SUM(s.duration) / 1000.0 / 60 / 60, 2) as recent_hours,
    t.created_at
FROM tags t
LEFT JOIN session_tags st ON t.id = st.tag_id
LEFT JOIN sessions s ON st.session_id = s.id 
    AND s.status = 'completed'
    AND s.start_time >= datetime('now', '-30 days')
GROUP BY t.id, t.name, t.color, t.usage_count, t.created_at
ORDER BY t.usage_count DESC;

-- Export settings for backup
SELECT 
    key,
    value,
    type,
    updated_at
FROM settings
ORDER BY key;

-- ======================================================
-- 9. Advanced Reporting and Business Intelligence
-- ======================================================

-- Comprehensive dashboard query
WITH daily_summary AS (
    SELECT 
        date(start_time) as date,
        COUNT(*) as sessions,
        SUM(duration) / 1000.0 / 60 / 60 as hours,
        COUNT(CASE WHEN duration >= 1500000 THEN 1 END) as deep_work_sessions,
        AVG(complexity) as avg_complexity,
        AVG(stress_level) as avg_stress_level
    FROM sessions
    WHERE status = 'completed'
        AND start_time >= datetime('now', '-7 days')
    GROUP BY date(start_time)
),
project_summary AS (
    SELECT 
        p.name,
        COUNT(s.id) as sessions,
        SUM(s.duration) / 1000.0 / 60 / 60 as hours
    FROM projects p
    JOIN sessions s ON p.id = s.project_id
    WHERE s.status = 'completed'
        AND s.start_time >= datetime('now', '-7 days')
    GROUP BY p.id, p.name
    ORDER BY hours DESC
    LIMIT 5
),
tag_summary AS (
    SELECT 
        t.name,
        COUNT(s.id) as usage
    FROM tags t
    JOIN session_tags st ON t.id = st.tag_id
    JOIN sessions s ON st.session_id = s.id
    WHERE s.status = 'completed'
        AND s.start_time >= datetime('now', '-7 days')
    GROUP BY t.id, t.name
    ORDER BY usage DESC
    LIMIT 5
)
SELECT 
    'daily_summary' as report_type,
    json_object(
        'dates', json_group_array(date),
        'sessions', json_group_array(sessions),
        'hours', json_group_array(hours),
        'deep_work_sessions', json_group_array(deep_work_sessions)
    ) as data
FROM daily_summary

UNION ALL

SELECT 
    'top_projects' as report_type,
    json_object(
        'projects', json_group_array(json_object('name', name, 'hours', hours))
    ) as data
FROM project_summary

UNION ALL

SELECT 
    'top_tags' as report_type,
    json_object(
        'tags', json_group_array(json_object('name', name, 'usage', usage))
    ) as data
FROM tag_summary;

-- Productivity patterns heatmap data
SELECT 
    strftime('%w', start_time) as day_of_week, -- 0=Sunday
    strftime('%H', start_time) as hour,
    COUNT(*) as session_count,
    AVG(duration) / 1000.0 / 60 as avg_duration_minutes,
    COUNT(CASE WHEN duration >= 1500000 THEN 1 END) as deep_work_count
FROM sessions
WHERE status = 'completed'
    AND start_time >= datetime('now', '-30 days')
GROUP BY strftime('%w', start_time), strftime('%H', start_time)
ORDER BY day_of_week, hour;

-- ======================================================
-- End of CRUD Examples
-- ======================================================

-- This file provides comprehensive examples for all database operations
-- needed by the Cursor AI Time Tracking Extension.
-- 
-- Usage Tips:
-- 1. Always use transactions for multi-table operations
-- 2. Use prepared statements in application code to prevent SQL injection
-- 3. Index optimization: Most queries are already optimized for existing indexes
-- 4. Regular maintenance: Run daily_stats updates and database optimization
-- 5. Data validation: Periodically run consistency checks
-- 6. Backup: Use export queries for regular data backups
-- 
-- Performance Notes:
-- - Queries are optimized for the defined database indexes
-- - Complex analytics queries may benefit from materialized views in large datasets
-- - Consider partitioning by date for very large historical data
-- - Use EXPLAIN QUERY PLAN to analyze query performance
-- 
-- Security Notes:
-- - All queries assume trusted input - use parameterized queries in application
-- - Be careful with DELETE operations - consider using soft deletes for important data
-- - Regular backups are essential before running maintenance operations
-- 
-- Maintenance Schedule Recommendations:
-- - Daily: Update daily_stats and project_daily_stats
-- - Weekly: Recompute tag usage counts, update project last_active
-- - Monthly: Run data validation checks, clean up old data
-- - Quarterly: VACUUM and ANALYZE database, review data retention policies
