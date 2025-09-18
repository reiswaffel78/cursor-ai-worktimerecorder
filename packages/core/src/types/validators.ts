/**
 * Runtime validation utilities for TypeScript interfaces
 * 
 * Provides validation functions to ensure data conforms to expected types
 * at runtime, especially useful for API boundaries and user input.
 * 
 * @fileoverview Runtime type validators with detailed error messages
 * @version 1.0.0
 * @since 2025-07-06
 */

import {
  Session,
  Project,
  Tag,
  Pomodoro,
  Break,
  DailyStats,
  Setting,
  AppSettings,
  SessionStatus,
  PomodoroStatus,
  SettingType,
  CreateSessionRequest,
  UpdateSessionRequest,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateTagRequest,
  UpdateTagRequest,
  CreatePomodoroRequest,
  TimeRange,
  AnalyticsQuery,
  ExportRequest
} from "./index";

// ======================================================
// Validation Error Classes
// ======================================================

/**
 * Custom error class for validation failures
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public value?: any
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Result type for validation operations
 */
export type ValidationResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  errors: ValidationError[];
};

// ======================================================
// Basic Type Validators
// ======================================================

/**
 * Validates that a value is a non-empty string
 */
export function isNonEmptyString(value: any, fieldName: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (typeof value !== "string") {
    errors.push(new ValidationError(`${fieldName} must be a string`, fieldName, value));
  } else if (value.trim().length === 0) {
    errors.push(new ValidationError(`${fieldName} cannot be empty`, fieldName, value));
  }
  
  return errors;
}

/**
 * Validates that a value is a valid UUID
 */
export function isUUID(value: any, fieldName: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (typeof value !== "string") {
    errors.push(new ValidationError(`${fieldName} must be a string`, fieldName, value));
  } else if (!uuidRegex.test(value)) {
    errors.push(new ValidationError(`${fieldName} must be a valid UUID`, fieldName, value));
  }
  
  return errors;
}

/**
 * Validates that a value is a valid ISO timestamp
 */
export function isISOTimestamp(value: any, fieldName: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (typeof value !== "string") {
    errors.push(new ValidationError(`${fieldName} must be a string`, fieldName, value));
  } else {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      errors.push(new ValidationError(`${fieldName} must be a valid ISO timestamp`, fieldName, value));
    }
  }
  
  return errors;
}

/**
 * Validates that a value is a number within a specified range
 */
export function isNumberInRange(
  value: any, 
  fieldName: string, 
  min?: number, 
  max?: number
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (typeof value !== "number" || isNaN(value)) {
    errors.push(new ValidationError(`${fieldName} must be a number`, fieldName, value));
    return errors;
  }
  
  if (min !== undefined && value < min) {
    errors.push(new ValidationError(`${fieldName} must be at least ${min}`, fieldName, value));
  }
  
  if (max !== undefined && value > max) {
    errors.push(new ValidationError(`${fieldName} must be at most ${max}`, fieldName, value));
  }
  
  return errors;
}

/**
 * Validates that a value is a valid hex color code
 */
export function isHexColor(value: any, fieldName: string): ValidationError[] {
  const errors: ValidationError[] = [];
  const hexColorRegex = /^#[0-9A-F]{6}$/i;
  
  if (value !== null && value !== undefined) {
    if (typeof value !== "string") {
      errors.push(new ValidationError(`${fieldName} must be a string`, fieldName, value));
    } else if (!hexColorRegex.test(value)) {
      errors.push(new ValidationError(`${fieldName} must be a valid hex color (e.g., #FF5733)`, fieldName, value));
    }
  }
  
  return errors;
}

/**
 * Validates that a value is a valid URL
 */
export function isURL(value: any, fieldName: string): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (value !== null && value !== undefined) {
    if (typeof value !== "string") {
      errors.push(new ValidationError(`${fieldName} must be a string`, fieldName, value));
    } else {
      try {
        new URL(value);
      } catch {
        errors.push(new ValidationError(`${fieldName} must be a valid URL`, fieldName, value));
      }
    }
  }
  
  return errors;
}

// ======================================================
// Entity Validators
// ======================================================

/**
 * Validates a Session object
 */
export function validateSession(data: any): ValidationResult<Session> {
  const errors: ValidationError[] = [];
  
  // Required fields
  errors.push(...isUUID(data.id, "id"));
  errors.push(...isISOTimestamp(data.startTime, "startTime"));
  
  if (!Object.values(SessionStatus).includes(data.status)) {
    errors.push(new ValidationError("status must be a valid SessionStatus", "status", data.status));
  }
  
  errors.push(...isNumberInRange(data.interruptions, "interruptions", 0));
  errors.push(...isISOTimestamp(data.createdAt, "createdAt"));
  errors.push(...isISOTimestamp(data.updatedAt, "updatedAt"));
  
  // Optional fields
  if (data.endTime !== null) {
    errors.push(...isISOTimestamp(data.endTime, "endTime"));
  }
  
  if (data.duration !== null) {
    errors.push(...isNumberInRange(data.duration, "duration", 0));
  }
  
  if (data.projectId !== null) {
    errors.push(...isUUID(data.projectId, "projectId"));
  }
  
  if (data.complexity !== null) {
    errors.push(...isNumberInRange(data.complexity, "complexity", 0, 100));
  }
  
  if (data.stressLevel !== null) {
    errors.push(...isNumberInRange(data.stressLevel, "stressLevel", 0, 100));
  }
  
  return errors.length === 0 
    ? { success: true, data: data as Session }
    : { success: false, errors };
}

/**
 * Validates a Project object
 */
export function validateProject(data: any): ValidationResult<Project> {
  const errors: ValidationError[] = [];
  
  // Required fields
  errors.push(...isUUID(data.id, "id"));
  errors.push(...isNonEmptyString(data.name, "name"));
  
  if (typeof data.isArchived !== "boolean") {
    errors.push(new ValidationError("isArchived must be a boolean", "isArchived", data.isArchived));
  }
  
  errors.push(...isISOTimestamp(data.createdAt, "createdAt"));
  errors.push(...isISOTimestamp(data.updatedAt, "updatedAt"));
  
  // Optional fields
  if (data.gitRepository !== null) {
    errors.push(...isURL(data.gitRepository, "gitRepository"));
  }
  
  errors.push(...isHexColor(data.color, "color"));
  
  if (data.lastActive !== null) {
    errors.push(...isISOTimestamp(data.lastActive, "lastActive"));
  }
  
  return errors.length === 0 
    ? { success: true, data: data as Project }
    : { success: false, errors };
}

/**
 * Validates a Tag object
 */
export function validateTag(data: any): ValidationResult<Tag> {
  const errors: ValidationError[] = [];
  
  // Required fields
  errors.push(...isUUID(data.id, "id"));
  errors.push(...isNonEmptyString(data.name, "name"));
  errors.push(...isNumberInRange(data.usageCount, "usageCount", 0));
  errors.push(...isISOTimestamp(data.createdAt, "createdAt"));
  
  // Optional fields
  errors.push(...isHexColor(data.color, "color"));
  
  return errors.length === 0 
    ? { success: true, data: data as Tag }
    : { success: false, errors };
}

/**
 * Validates a Pomodoro object
 */
export function validatePomodoro(data: any): ValidationResult<Pomodoro> {
  const errors: ValidationError[] = [];
  
  // Required fields
  errors.push(...isUUID(data.id, "id"));
  errors.push(...isISOTimestamp(data.startTime, "startTime"));
  errors.push(...isNumberInRange(data.duration, "duration", 1));
  
  if (!Object.values(PomodoroStatus).includes(data.status)) {
    errors.push(new ValidationError("status must be a valid PomodoroStatus", "status", data.status));
  }
  
  errors.push(...isISOTimestamp(data.createdAt, "createdAt"));
  
  // Optional fields
  if (data.endTime !== null) {
    errors.push(...isISOTimestamp(data.endTime, "endTime"));
  }
  
  if (data.sessionId !== null) {
    errors.push(...isUUID(data.sessionId, "sessionId"));
  }
  
  return errors.length === 0 
    ? { success: true, data: data as Pomodoro }
    : { success: false, errors };
}

/**
 * Validates a Break object
 */
export function validateBreak(data: any): ValidationResult<Break> {
  const errors: ValidationError[] = [];
  
  // Required fields
  errors.push(...isUUID(data.id, "id"));
  errors.push(...isISOTimestamp(data.startTime, "startTime"));
  errors.push(...isNumberInRange(data.duration, "duration", 1));
  
  if (typeof data.isLongBreak !== "boolean") {
    errors.push(new ValidationError("isLongBreak must be a boolean", "isLongBreak", data.isLongBreak));
  }
  
  errors.push(...isISOTimestamp(data.createdAt, "createdAt"));
  
  // Optional fields
  if (data.endTime !== null) {
    errors.push(...isISOTimestamp(data.endTime, "endTime"));
  }
  
  if (data.pomodoroId !== null) {
    errors.push(...isUUID(data.pomodoroId, "pomodoroId"));
  }
  
  return errors.length === 0 
    ? { success: true, data: data as Break }
    : { success: false, errors };
}

/**
 * Validates a DailyStats object
 */
export function validateDailyStats(data: any): ValidationResult<DailyStats> {
  const errors: ValidationError[] = [];
  
  // Date format validation (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.date)) {
    errors.push(new ValidationError("date must be in YYYY-MM-DD format", "date", data.date));
  }
  
  // Required numeric fields
  errors.push(...isNumberInRange(data.totalTime, "totalTime", 0));
  errors.push(...isNumberInRange(data.activeTime, "activeTime", 0));
  errors.push(...isNumberInRange(data.deepWorkTime, "deepWorkTime", 0));
  errors.push(...isNumberInRange(data.deepWorkPercentage, "deepWorkPercentage", 0, 100));
  errors.push(...isNumberInRange(data.sessionsCount, "sessionsCount", 0));
  errors.push(...isNumberInRange(data.averageSessionLength, "averageSessionLength", 0));
  errors.push(...isNumberInRange(data.contextSwitches, "contextSwitches", 0));
  errors.push(...isNumberInRange(data.goalCompletion, "goalCompletion", 0, 100));
  
  errors.push(...isISOTimestamp(data.updatedAt, "updatedAt"));
  
  return errors.length === 0 
    ? { success: true, data: data as DailyStats }
    : { success: false, errors };
}

/**
 * Validates a Setting object
 */
export function validateSetting(data: any): ValidationResult<Setting> {
  const errors: ValidationError[] = [];
  
  errors.push(...isNonEmptyString(data.key, "key"));
  errors.push(...isNonEmptyString(data.value, "value"));
  
  if (!Object.values(SettingType).includes(data.type)) {
    errors.push(new ValidationError("type must be a valid SettingType", "type", data.type));
  }
  
  errors.push(...isISOTimestamp(data.updatedAt, "updatedAt"));
  
  return errors.length === 0 
    ? { success: true, data: data as Setting }
    : { success: false, errors };
}

// ======================================================
// Request DTO Validators
// ======================================================

/**
 * Validates a CreateSessionRequest
 */
export function validateCreateSessionRequest(data: any): ValidationResult<CreateSessionRequest> {
  const errors: ValidationError[] = [];
  
  // All fields are optional for CreateSessionRequest
  if (data.projectId !== undefined) {
    errors.push(...isUUID(data.projectId, "projectId"));
  }
  
  if (data.complexity !== undefined) {
    errors.push(...isNumberInRange(data.complexity, "complexity", 0, 100));
  }
  
  return errors.length === 0 
    ? { success: true, data: data as CreateSessionRequest }
    : { success: false, errors };
}

/**
 * Validates an UpdateSessionRequest
 */
export function validateUpdateSessionRequest(data: any): ValidationResult<UpdateSessionRequest> {
  const errors: ValidationError[] = [];
  
  if (data.status !== undefined) {
    if (!Object.values(SessionStatus).includes(data.status)) {
      errors.push(new ValidationError("status must be a valid SessionStatus", "status", data.status));
    }
  }
  
  if (data.complexity !== undefined) {
    errors.push(...isNumberInRange(data.complexity, "complexity", 0, 100));
  }
  
  if (data.stressLevel !== undefined) {
    errors.push(...isNumberInRange(data.stressLevel, "stressLevel", 0, 100));
  }
  
  if (data.addInterruption !== undefined) {
    if (typeof data.addInterruption !== "boolean") {
      errors.push(new ValidationError("addInterruption must be a boolean", "addInterruption", data.addInterruption));
    }
  }
  
  return errors.length === 0 
    ? { success: true, data: data as UpdateSessionRequest }
    : { success: false, errors };
}

/**
 * Validates a CreateProjectRequest
 */
export function validateCreateProjectRequest(data: any): ValidationResult<CreateProjectRequest> {
  const errors: ValidationError[] = [];
  
  // Name is required
  errors.push(...isNonEmptyString(data.name, "name"));
  
  // Optional fields
  if (data.gitRepository !== undefined) {
    errors.push(...isURL(data.gitRepository, "gitRepository"));
  }
  
  if (data.color !== undefined) {
    errors.push(...isHexColor(data.color, "color"));
  }
  
  return errors.length === 0 
    ? { success: true, data: data as CreateProjectRequest }
    : { success: false, errors };
}

/**
 * Validates an UpdateProjectRequest
 */
export function validateUpdateProjectRequest(data: any): ValidationResult<UpdateProjectRequest> {
  const errors: ValidationError[] = [];
  
  if (data.name !== undefined) {
    errors.push(...isNonEmptyString(data.name, "name"));
  }
  
  if (data.gitRepository !== undefined) {
    errors.push(...isURL(data.gitRepository, "gitRepository"));
  }
  
  if (data.color !== undefined) {
    errors.push(...isHexColor(data.color, "color"));
  }
  
  if (data.isArchived !== undefined) {
    if (typeof data.isArchived !== "boolean") {
      errors.push(new ValidationError("isArchived must be a boolean", "isArchived", data.isArchived));
    }
  }
  
  return errors.length === 0 
    ? { success: true, data: data as UpdateProjectRequest }
    : { success: false, errors };
}

/**
 * Validates a CreateTagRequest
 */
export function validateCreateTagRequest(data: any): ValidationResult<CreateTagRequest> {
  const errors: ValidationError[] = [];
  
  // Name is required
  errors.push(...isNonEmptyString(data.name, "name"));
  
  // Optional fields
  if (data.color !== undefined) {
    errors.push(...isHexColor(data.color, "color"));
  }
  
  return errors.length === 0 
    ? { success: true, data: data as CreateTagRequest }
    : { success: false, errors };
}

/**
 * Validates an UpdateTagRequest
 */
export function validateUpdateTagRequest(data: any): ValidationResult<UpdateTagRequest> {
  const errors: ValidationError[] = [];
  
  if (data.name !== undefined) {
    errors.push(...isNonEmptyString(data.name, "name"));
  }
  
  if (data.color !== undefined) {
    errors.push(...isHexColor(data.color, "color"));
  }
  
  return errors.length === 0 
    ? { success: true, data: data as UpdateTagRequest }
    : { success: false, errors };
}

/**
 * Validates a CreatePomodoroRequest
 */
export function validateCreatePomodoroRequest(data: any): ValidationResult<CreatePomodoroRequest> {
  const errors: ValidationError[] = [];
  
  if (data.duration !== undefined) {
    errors.push(...isNumberInRange(data.duration, "duration", 1));
  }
  
  if (data.sessionId !== undefined) {
    errors.push(...isUUID(data.sessionId, "sessionId"));
  }
  
  return errors.length === 0 
    ? { success: true, data: data as CreatePomodoroRequest }
    : { success: false, errors };
}

/**
 * Validates a TimeRange object
 */
export function validateTimeRange(data: any): ValidationResult<TimeRange> {
  const errors: ValidationError[] = [];
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateRegex.test(data.startDate)) {
    errors.push(new ValidationError("startDate must be in YYYY-MM-DD format", "startDate", data.startDate));
  }
  
  if (!dateRegex.test(data.endDate)) {
    errors.push(new ValidationError("endDate must be in YYYY-MM-DD format", "endDate", data.endDate));
  }
  
  // Check that start date is before end date
  if (dateRegex.test(data.startDate) && dateRegex.test(data.endDate)) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    
    if (start > end) {
      errors.push(new ValidationError("startDate must be before or equal to endDate", "startDate", data.startDate));
    }
  }
  
  return errors.length === 0 
    ? { success: true, data: data as TimeRange }
    : { success: false, errors };
}

/**
 * Validates an AnalyticsQuery object
 */
export function validateAnalyticsQuery(data: any): ValidationResult<AnalyticsQuery> {
  const errors: ValidationError[] = [];
  
  // Validate required timeRange
  const timeRangeResult = validateTimeRange(data.timeRange);
  if (!timeRangeResult.success) {
    errors.push(...timeRangeResult.errors);
  }
  
  // Validate optional arrays
  if (data.projectIds !== undefined) {
    if (!Array.isArray(data.projectIds)) {
      errors.push(new ValidationError("projectIds must be an array", "projectIds", data.projectIds));
    } else {
      data.projectIds.forEach((id: any, index: number) => {
        errors.push(...isUUID(id, `projectIds[${index}]`));
      });
    }
  }
  
  if (data.tagIds !== undefined) {
    if (!Array.isArray(data.tagIds)) {
      errors.push(new ValidationError("tagIds must be an array", "tagIds", data.tagIds));
    } else {
      data.tagIds.forEach((id: any, index: number) => {
        errors.push(...isUUID(id, `tagIds[${index}]`));
      });
    }
  }
  
  if (data.groupBy !== undefined) {
    const validGroupBy = ["day", "week", "month"];
    if (!validGroupBy.includes(data.groupBy)) {
      errors.push(new ValidationError("groupBy must be one of: day, week, month", "groupBy", data.groupBy));
    }
  }
  
  if (data.includeBreakdown !== undefined) {
    if (typeof data.includeBreakdown !== "boolean") {
      errors.push(new ValidationError("includeBreakdown must be a boolean", "includeBreakdown", data.includeBreakdown));
    }
  }
  
  return errors.length === 0 
    ? { success: true, data: data as AnalyticsQuery }
    : { success: false, errors };
}

/**
 * Validates an ExportRequest object
 */
export function validateExportRequest(data: any): ValidationResult<ExportRequest> {
  const errors: ValidationError[] = [];
  
  // Validate required timeRange
  const timeRangeResult = validateTimeRange(data.timeRange);
  if (!timeRangeResult.success) {
    errors.push(...timeRangeResult.errors);
  }
  
  // Validate format
  const validFormats = ["csv", "json", "pdf"];
  if (!validFormats.includes(data.format)) {
    errors.push(new ValidationError("format must be one of: csv, json, pdf", "format", data.format));
  }
  
  // Validate include object
  if (!data.include || typeof data.include !== "object") {
    errors.push(new ValidationError("include must be an object", "include", data.include));
  } else {
    const includeFields = ["sessions", "projects", "stats", "pomodoros"];
    Object.keys(data.include).forEach(key => {
      if (!includeFields.includes(key)) {
        errors.push(new ValidationError(`include.${key} is not a valid field`, `include.${key}`, data.include[key]));
      } else if (typeof data.include[key] !== "boolean") {
        errors.push(new ValidationError(`include.${key} must be a boolean`, `include.${key}`, data.include[key]));
      }
    });
  }
  
  if (data.includeInsights !== undefined) {
    if (typeof data.includeInsights !== "boolean") {
      errors.push(new ValidationError("includeInsights must be a boolean", "includeInsights", data.includeInsights));
    }
  }
  
  return errors.length === 0 
    ? { success: true, data: data as ExportRequest }
    : { success: false, errors };
}

// ======================================================
// Utility Functions
// ======================================================

/**
 * Validates an array of objects using a validator function
 */
export function validateArray<T>(
  data: any[], 
  validator: (item: any) => ValidationResult<T>,
  fieldName: string = "array"
): ValidationResult<T[]> {
  if (!Array.isArray(data)) {
    return {
      success: false,
      errors: [new ValidationError(`${fieldName} must be an array`, fieldName, data)]
    };
  }
  
  const errors: ValidationError[] = [];
  const validatedItems: T[] = [];
  
  data.forEach((item, index) => {
    const result = validator(item);
    if (result.success) {
      validatedItems.push(result.data);
    } else {
      result.errors.forEach(error => {
        error.field = `${fieldName}[${index}].${error.field}`;
        errors.push(error);
      });
    }
  });
  
  return errors.length === 0 
    ? { success: true, data: validatedItems }
    : { success: false, errors };
}

/**
 * Creates a validation middleware for API endpoints
 */
export function createValidator<T>(
  validator: (data: any) => ValidationResult<T>
) {
  return (data: any): T => {
    const result = validator(data);
    if (!result.success) {
      const errorMessage = result.errors
        .map(error => `${error.field}: ${error.message}`)
        .join(", ");
      throw new ValidationError(`Validation failed: ${errorMessage}`);
    }
    return result.data;
  };
}