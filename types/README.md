# TypeScript Types and Interfaces

This directory contains all TypeScript type definitions for the Cursor AI Time Tracking Extension.

## Files

### `index.ts`
Main interface definitions including:
- **Core Entities**: Session, Project, Tag, Pomodoro, Break, DailyStats
- **Configuration**: Setting, AppSettings  
- **DTOs**: StatsDTO, various Request/Response types
- **Enums**: SessionStatus, PomodoroStatus, SettingType
- **Utility Types**: ApiResponse, PaginatedResponse, ValidationResult

### `validators.ts`
Runtime validation utilities including:
- **Entity Validators**: Functions to validate all core entities at runtime
- **Request Validators**: Validation for API request DTOs
- **Basic Validators**: UUID, timestamp, URL, hex color validation
- **Utility Functions**: Array validation, middleware creation

## Usage Examples

### Basic Interface Usage

```typescript
import { Session, SessionStatus, Project } from "./types";

const session: Session = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  startTime: "2025-07-06T10:00:00.000Z",
  endTime: null,
  duration: null,
  status: SessionStatus.ACTIVE,
  projectId: "project-123",
  filePath: "src/extension.ts",
  complexity: 75.5,
  stressLevel: 30.2,
  interruptions: 0,
  createdAt: "2025-07-06T10:00:00.000Z",
  updatedAt: "2025-07-06T10:00:00.000Z"
};
```

### Runtime Validation

```typescript
import { validateSession, ValidationError } from "./types/validators";

function processSessionData(data: any) {
  const result = validateSession(data);
  
  if (!result.success) {
    result.errors.forEach(error => {
      console.error(`Validation error in ${error.field}: ${error.message}`);
    });
    throw new ValidationError("Invalid session data");
  }
  
  // data is now typed as Session
  const session = result.data;
  console.log(`Processing session ${session.id}`);
}
```

### API Request Validation

```typescript
import { validateCreateProjectRequest, CreateProjectRequest } from "./types/validators";

function createProject(requestData: any): Project {
  const validation = validateCreateProjectRequest(requestData);
  
  if (!validation.success) {
    throw new Error(`Invalid request: ${validation.errors.map(e => e.message).join(", ")}`);
  }
  
  const request: CreateProjectRequest = validation.data;
  
  // Create project with validated data
  return {
    id: generateUUID(),
    name: request.name,
    description: request.description || null,
    gitRepository: request.gitRepository || null,
    gitBranch: request.gitBranch || null,
    color: request.color || null,
    isArchived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastActive: null
  };
}
```

### Type Guards

```typescript
import { SessionStatus, isSessionStatus } from "./types";

function handleStatusUpdate(status: any) {
  if (isSessionStatus(status)) {
    // status is now typed as SessionStatus
    console.log(`Updating to status: ${status}`);
  } else {
    throw new Error(`Invalid status: ${status}`);
  }
}
```

### Settings Management

```typescript
import { AppSettings, Setting, SettingType } from "./types";

function parseSettings(rawSettings: Setting[]): AppSettings {
  const settingsMap = new Map(rawSettings.map(s => [s.key, s]));
  
  return {
    idleTimeout: parseInt(settingsMap.get("idleTimeout")?.value || "90"),
    dailyGoal: parseInt(settingsMap.get("dailyGoal")?.value || "240"),
    pomodoroLength: parseInt(settingsMap.get("pomodoroLength")?.value || "25"),
    breakLength: parseInt(settingsMap.get("breakLength")?.value || "5"),
    longBreakLength: parseInt(settingsMap.get("longBreakLength")?.value || "15"),
    pomodorosUntilLongBreak: parseInt(settingsMap.get("pomodorosUntilLongBreak")?.value || "4"),
    autoStartBreaks: settingsMap.get("autoStartBreaks")?.value === "true",
    autoStartPomodoros: settingsMap.get("autoStartPomodoros")?.value === "true",
    theme: (settingsMap.get("theme")?.value as "light" | "dark" | "system") || "system",
    dataRetention: parseInt(settingsMap.get("dataRetention")?.value || "365"),
    notifications: JSON.parse(settingsMap.get("notifications")?.value || "{}"),
    features: JSON.parse(settingsMap.get("features")?.value || "{}")
  };
}
```

### Analytics and Statistics

```typescript
import { StatsDTO, DailyStats, TimeRange } from "./types";

function generateDashboardData(timeRange: TimeRange): StatsDTO {
  // Implementation would fetch and calculate stats
  return {
    today: {
      date: "2025-07-06",
      totalTime: 14400000, // 4 hours in milliseconds
      activeTime: 12600000, // 3.5 hours
      deepWorkTime: 9000000, // 2.5 hours  
      deepWorkPercentage: 71.4,
      sessionsCount: 5,
      averageSessionLength: 2880000, // 48 minutes
      contextSwitches: 3,
      goalCompletion: 100, // Met 4-hour daily goal
      updatedAt: "2025-07-06T16:00:00.000Z"
    },
    yesterday: {
      // Previous day stats...
    },
    weeklyStats: [
      // Last 7 days...
    ],
    monthlyStats: [
      // Last 30 days...
    ],
    topProjects: [
      {
        project: {
          id: "proj-1",
          name: "Time Tracker",
          // ...other project fields
        },
        totalTime: 10800000, // 3 hours
        sessionsCount: 3,
        percentage: 75
      }
    ],
    topTags: [
      {
        tag: {
          id: "tag-1", 
          name: "feature",
          // ...other tag fields
        },
        usageCount: 8,
        percentage: 40
      }
    ],
    insights: {
      averageDailyTime: 240, // 4 hours
      bestDayOfWeek: "Tuesday",
      mostProductiveHour: 10, // 10 AM
      currentStreak: 5,
      longestStreak: 12,
      averageSessionLength: 48,
      deepWorkPercentage: 65
    }
  };
}
```

### Error Handling

```typescript
import { ApiResponse, ApiError } from "./types";

function createApiResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
    meta: {
      processingTime: Date.now() - startTime,
      requestId: generateRequestId()
    }
  };
}

function createErrorResponse(error: Error): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error: {
      code: "INTERNAL_ERROR",
      message: error.message,
      timestamp: new Date().toISOString()
    }
  };
}
```

## Best Practices

### 1. Always Use Validation at Boundaries
```typescript
// ✅ Good - validate external data
function handleIncomingData(data: any) {
  const result = validateSession(data);
  if (!result.success) {
    throw new ValidationError("Invalid data");
  }
  return processSession(result.data);
}

// ❌ Bad - trust external data  
function handleIncomingData(data: Session) {
  return processSession(data); // data might not actually be valid
}
```

### 2. Use Type Guards for Runtime Checks
```typescript
// ✅ Good - runtime type checking
if (isSessionStatus(userInput)) {
  updateSessionStatus(userInput);
}

// ❌ Bad - unsafe casting
updateSessionStatus(userInput as SessionStatus);
```

### 3. Leverage Utility Types
```typescript
// ✅ Good - use utility types for partial updates
function updateProject(id: string, updates: PartialUpdate<Project>) {
  // Only allow updating specific fields, exclude id/timestamps
}

// ❌ Bad - allow updating any field
function updateProject(id: string, updates: Partial<Project>) {
  // Could accidentally update id or timestamps
}
```

### 4. Consistent Error Handling
```typescript
// ✅ Good - standardized error responses
try {
  const result = await processData(input);
  return createApiResponse(result);
} catch (error) {
  return createErrorResponse(error);
}
```

## Type Safety Benefits

1. **Compile-time Validation**: Catch errors before runtime
2. **IntelliSense Support**: Better developer experience with autocompletion
3. **Refactoring Safety**: Changes propagate through type system
4. **API Contract Enforcement**: Ensures consistency between frontend and backend
5. **Documentation**: Types serve as living documentation

## Performance Considerations

1. **Validation Overhead**: Runtime validation has performance cost - use judiciously
2. **Type Erasure**: TypeScript types are erased at runtime - no runtime cost for types themselves
3. **Bundle Size**: Import only needed validators to minimize bundle size
4. **Caching**: Cache validation results for frequently validated data

## Future Enhancements

- **JSON Schema Generation**: Auto-generate JSON schemas from TypeScript types
- **OpenAPI Integration**: Generate OpenAPI specs from types
- **Code Generation**: Generate database models and API clients from types
- **Migration Helpers**: Type-safe database migration utilities