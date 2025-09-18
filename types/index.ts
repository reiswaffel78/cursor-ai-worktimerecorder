/**
 * TypeScript Interface Definitions for Cursor AI Time Tracking Extension
 * 
 * This file contains all data structures used throughout the application,
 * including database entities, API DTOs, and configuration types.
 * 
 * @fileoverview Core TypeScript interfaces with comprehensive JSDoc documentation
 * @version 1.0.0
 * @author Cursor AI Time Tracking Team
 * @since 2025-07-06
 */

// ======================================================
// Base Types and Enums
// ======================================================

/**
 * Session status enumeration
 * Defines all possible states a tracking session can be in
 */
export enum SessionStatus {
  /** Session is currently active and tracking time */
  ACTIVE = "active",
  /** Session is temporarily paused by user */
  PAUSED = "paused", 
  /** Session has been completed successfully */
  COMPLETED = "completed",
  /** Session was interrupted (e.g., system shutdown, crash) */
  INTERRUPTED = "interrupted"
}

/**
 * Pomodoro session status enumeration
 * Tracks the state of pomodoro timer sessions
 */
export enum PomodoroStatus {
  /** Pomodoro timer is currently running */
  ACTIVE = "active",
  /** Pomodoro was completed successfully */
  COMPLETED = "completed",
  /** Pomodoro was interrupted before completion */
  INTERRUPTED = "interrupted"
}

/**
 * Setting value type enumeration
 * Defines the data type for configuration values
 */
export enum SettingType {
  /** String value type */
  STRING = "string",
  /** Numeric value type */
  NUMBER = "number", 
  /** Boolean value type */
  BOOLEAN = "boolean",
  /** JSON object value type */
  JSON = "json"
}

// ======================================================
// Core Entity Interfaces
// ======================================================

/**
 * Main session entity representing a time tracking session
 * 
 * Sessions are the core unit of time tracking, capturing when a user
 * is actively coding, which project they''re working on, and various
 * metrics about their work quality and focus.
 */
export interface Session {
  /** Unique identifier for the session (UUID) */
  id: string;
  
  /** ISO timestamp when the session started */
  startTime: string;
  
  /** ISO timestamp when the session ended (null if still active) */
  endTime: string | null;
  
  /** 
   * Total duration of the session in milliseconds
   * Automatically calculated when endTime is set
   */
  duration: number | null;
  
  /** Current status of the session */
  status: SessionStatus;
  
  /** 
   * ID of the project this session belongs to
   * Can be null for unassociated sessions
   */
  projectId: string | null;
  
  /** 
   * File path currently being edited
   * Relative to project root when possible
   */
  filePath: string | null;
  
  /** 
   * Complexity score of the work being done (0-100)
   * Based on factors like file size, nesting depth, etc.
   */
  complexity: number | null;
  
  /** 
   * Detected stress level of the user (0-100)
   * Based on typing patterns, frequency of corrections, etc.
   */
  stressLevel: number | null;
  
  /** 
   * Number of times the session was interrupted
   * Incremented when user switches context or gets distracted
   */
  interruptions: number;
  
  /** ISO timestamp when the record was created */
  createdAt: string;
  
  /** ISO timestamp when the record was last updated */
  updatedAt: string;
}

/**
 * Project entity representing a coding project
 * 
 * Projects group related sessions together and can be automatically
 * detected from Git repositories or manually created by users.
 */
export interface Project {
  /** Unique identifier for the project (UUID) */
  id: string;
  
  /** Human-readable name of the project */
  name: string;
  
  /** Optional description of what the project is about */
  description: string | null;
  
  /** Git repository URL if project is version controlled */
  gitRepository: string | null;
  
  /** Current Git branch being worked on */
  gitBranch: string | null;
  
  /** 
   * Hex color code for UI visualization (e.g., "#FF5733")
   * Used in charts, project lists, and session indicators
   */
  color: string | null;
  
  /** 
   * Whether the project has been archived
   * Archived projects are hidden from active lists
   */
  isArchived: boolean;
  
  /** ISO timestamp when the project was created */
  createdAt: string;
  
  /** ISO timestamp when the project was last updated */
  updatedAt: string;
  
  /** 
   * ISO timestamp when the project was last worked on
   * Updated automatically when sessions are created
   */
  lastActive: string | null;
}

/**
 * Tag entity for categorizing sessions
 * 
 * Tags provide flexible categorization of work sessions,
 * allowing users to label work as "feature", "bugfix", "refactor", etc.
 */
export interface Tag {
  /** Unique identifier for the tag (UUID) */
  id: string;
  
  /** Tag name (must be unique across all tags) */
  name: string;
  
  /** 
   * Hex color code for UI visualization
   * Used to color-code tagged sessions in lists and charts
   */
  color: string | null;
  
  /** 
   * Number of times this tag has been used
   * Updated automatically via database triggers
   */
  usageCount: number;
  
  /** ISO timestamp when the tag was created */
  createdAt: string;
}

/**
 * Junction entity linking sessions to tags (many-to-many)
 * 
 * Allows a session to have multiple tags and a tag to be used
 * across multiple sessions.
 */
export interface SessionTag {
  /** ID of the session being tagged */
  sessionId: string;
  
  /** ID of the tag being applied */
  tagId: string;
}

/**
 * Pomodoro timer session entity
 * 
 * Tracks focused work sessions using the Pomodoro Technique,
 * typically 25-minute focused work periods.
 */
export interface Pomodoro {
  /** Unique identifier for the pomodoro session (UUID) */
  id: string;
  
  /** ISO timestamp when the pomodoro started */
  startTime: string;
  
  /** ISO timestamp when the pomodoro ended */
  endTime: string | null;
  
  /** 
   * Planned duration of the pomodoro in minutes
   * Usually 25 minutes but configurable
   */
  duration: number;
  
  /** Current status of the pomodoro */
  status: PomodoroStatus;
  
  /** 
   * ID of the session this pomodoro belongs to
   * Can be null for standalone pomodoros
   */
  sessionId: string | null;
  
  /** ISO timestamp when the record was created */
  createdAt: string;
}

/**
 * Break period entity
 * 
 * Tracks break periods between pomodoro sessions,
 * including short breaks (5 min) and long breaks (15 min).
 */
export interface Break {
  /** Unique identifier for the break (UUID) */
  id: string;
  
  /** ISO timestamp when the break started */
  startTime: string;
  
  /** ISO timestamp when the break ended */
  endTime: string | null;
  
  /** Planned duration of the break in minutes */
  duration: number;
  
  /** 
   * Whether this is a long break (after multiple pomodoros)
   * vs a short break (between individual pomodoros)
   */
  isLongBreak: boolean;
  
  /** 
   * ID of the pomodoro that preceded this break
   * Can be null for manual breaks
   */
  pomodoroId: string | null;
  
  /** ISO timestamp when the record was created */
  createdAt: string;
}

// ======================================================
// Statistics and Analytics Interfaces
// ======================================================

/**
 * Daily statistics summary
 * 
 * Pre-calculated daily metrics for fast dashboard loading.
 * Updated periodically by background processes.
 */
export interface DailyStats {
  /** Date in YYYY-MM-DD format */
  date: string;
  
  /** Total time tracked on this date in milliseconds */
  totalTime: number;
  
  /** Time spent actively coding (excluding idle time) in milliseconds */
  activeTime: number;
  
  /** 
   * Time spent in deep work sessions (≥ 25 minutes) in milliseconds
   * Indicator of focused, uninterrupted work
   */
  deepWorkTime: number;
  
  /** Percentage of total time that was deep work (0-100) */
  deepWorkPercentage: number;
  
  /** Total number of sessions recorded on this date */
  sessionsCount: number;
  
  /** Average length of sessions in milliseconds */
  averageSessionLength: number;
  
  /** 
   * Number of context switches (project/file changes)
   * Higher numbers may indicate scattered focus
   */
  contextSwitches: number;
  
  /** 
   * Percentage of daily goal completed (0-100)
   * Based on user''s configured daily time goal
   */
  goalCompletion: number;
  
  /** ISO timestamp when these stats were last updated */
  updatedAt: string;
}

/**
 * Project-specific daily statistics
 * 
 * Tracks how much time was spent on each project per day.
 */
export interface ProjectDailyStats {
  /** Date in YYYY-MM-DD format */
  date: string;
  
  /** ID of the project these stats relate to */
  projectId: string;
  
  /** Total time spent on this project on this date in milliseconds */
  totalTime: number;
  
  /** Number of sessions for this project on this date */
  sessionsCount: number;
}

// ======================================================
// Configuration and Settings Interfaces
// ======================================================

/**
 * User setting entity
 * 
 * Stores user preferences and application configuration.
 * Values are stored as strings but typed according to their type field.
 */
export interface Setting {
  /** Unique key identifying the setting */
  key: string;
  
  /** String representation of the setting value */
  value: string;
  
  /** Data type of the value for proper parsing */
  type: SettingType;
  
  /** ISO timestamp when the setting was last updated */
  updatedAt: string;
}

/**
 * Strongly-typed settings configuration
 * 
 * Provides type-safe access to user settings with proper types
 * instead of the generic string storage format.
 */
export interface AppSettings {
  /** 
   * Time in seconds before considering user idle
   * When exceeded, sessions are automatically paused
   */
  idleTimeout: number;
  
  /** Daily time goal in minutes */
  dailyGoal: number;
  
  /** Default pomodoro duration in minutes */
  pomodoroLength: number;
  
  /** Short break duration in minutes */
  breakLength: number;
  
  /** Long break duration in minutes */
  longBreakLength: number;
  
  /** Number of pomodoros before a long break */
  pomodorosUntilLongBreak: number;
  
  /** Whether breaks should start automatically */
  autoStartBreaks: boolean;
  
  /** Whether pomodoros should start automatically after breaks */
  autoStartPomodoros: boolean;
  
  /** UI theme preference */
  theme: "light" | "dark" | "system";
  
  /** Data retention period in days */
  dataRetention: number;
  
  /** Notification preferences */
  notifications: {
    /** Show notification when session ends */
    sessionEnd: boolean;
    /** Show notification when break ends */
    breakEnd: boolean;
    /** Show notification when idle time detected */
    idleDetected: boolean;
    /** Show notification when daily goal is reached */
    dailyGoalReached: boolean;
  };
  
  /** Feature flags for enabling/disabling functionality */
  features: {
    /** Enable pomodoro timer functionality */
    pomodoro: boolean;
    /** Enable AI-powered analytics and insights */
    aiAnalytics: boolean;
    /** Enable health monitoring features */
    healthMonitoring: boolean;
  };
}

// ======================================================
// Data Transfer Objects (DTOs)
// ======================================================

/**
 * Comprehensive statistics DTO for dashboard display
 * 
 * Combines multiple data sources to provide a complete overview
 * of user productivity and patterns.
 */
export interface StatsDTO {
  /** Statistics for the current day */
  today: DailyStats;
  
  /** Statistics for yesterday for comparison */
  yesterday: DailyStats;
  
  /** Daily statistics for the past 7 days */
  weeklyStats: DailyStats[];
  
  /** Daily statistics for the past 30 days */
  monthlyStats: DailyStats[];
  
  /** Top projects by time spent (last 30 days) */
  topProjects: Array<{
    /** Project information */
    project: Project;
    /** Total time spent in milliseconds */
    totalTime: number;
    /** Number of sessions */
    sessionsCount: number;
    /** Percentage of total tracked time */
    percentage: number;
  }>;
  
  /** Most used tags (last 30 days) */
  topTags: Array<{
    /** Tag information */
    tag: Tag;
    /** Number of times used */
    usageCount: number;
    /** Percentage of tagged sessions */
    percentage: number;
  }>;
  
  /** Productivity insights and trends */
  insights: {
    /** Average daily coding time in minutes */
    averageDailyTime: number;
    /** Best day of the week for productivity */
    bestDayOfWeek: string;
    /** Most productive hour of the day (0-23) */
    mostProductiveHour: number;
    /** Current streak of days meeting daily goal */
    currentStreak: number;
    /** Longest streak ever achieved */
    longestStreak: number;
    /** Average session length in minutes */
    averageSessionLength: number;
    /** Deep work percentage over last 30 days */
    deepWorkPercentage: number;
  };
}

/**
 * Session creation request DTO
 * 
 * Used when creating a new tracking session.
 */
export interface CreateSessionRequest {
  /** ID of the project to associate with (optional) */
  projectId?: string;
  
  /** Initial file path being worked on (optional) */
  filePath?: string;
  
  /** Initial complexity estimate (optional) */
  complexity?: number;
}

/**
 * Session update request DTO
 * 
 * Used when updating session properties.
 */
export interface UpdateSessionRequest {
  /** New session status */
  status?: SessionStatus;
  
  /** Update the file path being worked on */
  filePath?: string;
  
  /** Update complexity score */
  complexity?: number;
  
  /** Update stress level */
  stressLevel?: number;
  
  /** Increment interruption count */
  addInterruption?: boolean;
}

/**
 * Project creation request DTO
 */
export interface CreateProjectRequest {
  /** Project name (required) */
  name: string;
  
  /** Project description (optional) */
  description?: string;
  
  /** Git repository URL (optional) */
  gitRepository?: string;
  
  /** Git branch name (optional) */
  gitBranch?: string;
  
  /** UI color (optional) */
  color?: string;
}

/**
 * Project update request DTO
 */
export interface UpdateProjectRequest {
  /** Updated project name */
  name?: string;
  
  /** Updated description */
  description?: string;
  
  /** Updated Git repository URL */
  gitRepository?: string;
  
  /** Updated Git branch */
  gitBranch?: string;
  
  /** Updated UI color */
  color?: string;
  
  /** Archive/unarchive the project */
  isArchived?: boolean;
}

/**
 * Tag creation request DTO
 */
export interface CreateTagRequest {
  /** Tag name (required, must be unique) */
  name: string;
  
  /** UI color (optional) */
  color?: string;
}

/**
 * Tag update request DTO
 */
export interface UpdateTagRequest {
  /** Updated tag name */
  name?: string;
  
  /** Updated UI color */
  color?: string;
}

/**
 * Pomodoro creation request DTO
 */
export interface CreatePomodoroRequest {
  /** Duration in minutes (default from settings) */
  duration?: number;
  
  /** Associated session ID (optional) */
  sessionId?: string;
}

/**
 * Time range filter for analytics queries
 */
export interface TimeRange {
  /** Start date in YYYY-MM-DD format */
  startDate: string;
  
  /** End date in YYYY-MM-DD format */
  endDate: string;
}

/**
 * Analytics query parameters
 */
export interface AnalyticsQuery {
  /** Time range to analyze */
  timeRange: TimeRange;
  
  /** Filter by specific project IDs */
  projectIds?: string[];
  
  /** Filter by specific tag IDs */
  tagIds?: string[];
  
  /** Group results by day/week/month */
  groupBy?: "day" | "week" | "month";
  
  /** Include detailed breakdown */
  includeBreakdown?: boolean;
}

/**
 * Export data request DTO
 */
export interface ExportRequest {
  /** Time range to export */
  timeRange: TimeRange;
  
  /** Export format */
  format: "csv" | "json" | "pdf";
  
  /** Data types to include */
  include: {
    /** Include session data */
    sessions?: boolean;
    /** Include project data */
    projects?: boolean;
    /** Include statistics */
    stats?: boolean;
    /** Include pomodoro data */
    pomodoros?: boolean;
  };
  
  /** Whether to include personal insights */
  includeInsights?: boolean;
}

// ======================================================
// Error and Response Types
// ======================================================

/**
 * Standard API error response
 */
export interface ApiError {
  /** Error code for programmatic handling */
  code: string;
  
  /** Human-readable error message */
  message: string;
  
  /** Additional error details */
  details?: Record<string, any>;
  
  /** ISO timestamp when error occurred */
  timestamp: string;
}

/**
 * Standard API success response wrapper
 */
export interface ApiResponse<T = any> {
  /** Whether the request was successful */
  success: boolean;
  
  /** Response data (null on error) */
  data: T | null;
  
  /** Error information (null on success) */
  error: ApiError | null;
  
  /** Request metadata */
  meta?: {
    /** Request processing time in milliseconds */
    processingTime: number;
    /** Request ID for debugging */
    requestId: string;
  };
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T = any> {
  /** Array of items for current page */
  items: T[];
  
  /** Pagination metadata */
  pagination: {
    /** Current page number (0-based) */
    page: number;
    /** Number of items per page */
    limit: number;
    /** Total number of items across all pages */
    total: number;
    /** Total number of pages */
    totalPages: number;
    /** Whether there are more pages */
    hasNext: boolean;
    /** Whether there are previous pages */
    hasPrev: boolean;
  };
}

// ======================================================
// Migration and Utility Types
// ======================================================

/**
 * Database migration record
 */
export interface Migration {
  /** Migration version identifier */
  version: string;
  
  /** ISO timestamp when migration was applied */
  appliedAt: string;
}

/**
 * Application health check response
 */
export interface HealthCheck {
  /** Overall application status */
  status: "healthy" | "degraded" | "unhealthy";
  
  /** Individual component health */
  components: {
    /** Database connectivity */
    database: "up" | "down";
    /** File system access */
    filesystem: "up" | "down";
    /** Background jobs */
    scheduler: "up" | "down";
  };
  
  /** Performance metrics */
  metrics: {
    /** Memory usage in MB */
    memoryUsage: number;
    /** Number of active sessions */
    activeSessions: number;
    /** Database size in MB */
    databaseSize: number;
  };
  
  /** ISO timestamp of health check */
  timestamp: string;
}

// ======================================================
// Type Guards and Utilities
// ======================================================

/**
 * Type guard to check if a value is a valid SessionStatus
 */
export function isSessionStatus(value: any): value is SessionStatus {
  return Object.values(SessionStatus).includes(value);
}

/**
 * Type guard to check if a value is a valid PomodoroStatus
 */
export function isPomodoroStatus(value: any): value is PomodoroStatus {
  return Object.values(PomodoroStatus).includes(value);
}

/**
 * Type guard to check if a value is a valid SettingType
 */
export function isSettingType(value: any): value is SettingType {
  return Object.values(SettingType).includes(value);
}

/**
 * Utility type for creating partial updates
 */
export type PartialUpdate<T> = Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;

/**
 * Utility type for database entities with timestamps
 */
export type TimestampedEntity = {
  createdAt: string;
  updatedAt: string;
};

/**
 * Utility type for entities with optional timestamps
 */
export type OptionalTimestamps<T> = Omit<T, "createdAt" | "updatedAt"> & 
  Partial<TimestampedEntity>;

// Export all types for easy importing
export type {
  Session,
  Project, 
  Tag,
  SessionTag,
  Pomodoro,
  Break,
  DailyStats,
  ProjectDailyStats,
  Setting,
  AppSettings,
  StatsDTO,
  CreateSessionRequest,
  UpdateSessionRequest,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateTagRequest,
  UpdateTagRequest,
  CreatePomodoroRequest,
  TimeRange,
  AnalyticsQuery,
  ExportRequest,
  ApiError,
  ApiResponse,
  PaginatedResponse,
  Migration,
  HealthCheck
};