/**
 * Cursor AI Time Tracking Extension
 * Validation utilities for IPC messages between WebView and Extension
 */

// Basic types
export type UUID = string;
export type Timestamp = number;

// Message base types
export interface MessageBase {
  type: string;
  id: UUID;
  timestamp?: Timestamp;
}

export interface ErrorResponse {
  type: 'error';
  id: UUID;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

// Core data types
export interface Session {
  id: UUID;
  startTime: Timestamp;
  endTime?: Timestamp;
  duration?: number;
  status: 'active' | 'paused' | 'completed' | 'interrupted';
  project?: string;
  file?: string;
  tags?: string[];
  complexity?: number;
  stressLevel?: number;
  interruptions?: number;
}

export interface DailyStats {
  date: string;
  totalTime: number;
  activeTime: number;
  deepWorkTime?: number;
  deepWorkPercentage?: number;
  sessionsCount: number;
  averageSessionLength?: number;
  contextSwitches?: number;
  projects?: Array<{ name: string; time: number }>;
  goalCompletion?: number;
}

export interface Settings {
  idleTimeout?: number;
  dailyGoal?: number;
  pomodoroLength?: number;
  breakLength?: number;
  longBreakLength?: number;
  pomodorosUntilLongBreak?: number;
  autoStartBreaks?: boolean;
  autoStartPomodoros?: boolean;
  notifications?: {
    sessionEnd?: boolean;
    breakEnd?: boolean;
    idleDetected?: boolean;
    dailyGoalReached?: boolean;
  };
  theme?: 'system' | 'light' | 'dark';
  dataRetention?: number;
  features?: {
    pomodoro?: boolean;
    aiAnalytics?: boolean;
    healthMonitoring?: boolean;
  };
}

// Request message types
export interface StartSessionRequest extends MessageBase {
  type: 'startSession';
  payload?: {
    project?: string;
    tags?: string[];
  };
}

export interface PauseSessionRequest extends MessageBase {
  type: 'pauseSession';
  payload: {
    sessionId: UUID;
    reason?: 'manual' | 'idle' | 'break' | 'meeting';
  };
}

export interface ResumeSessionRequest extends MessageBase {
  type: 'resumeSession';
  payload: {
    sessionId: UUID;
  };
}

export interface StopSessionRequest extends MessageBase {
  type: 'stopSession';
  payload: {
    sessionId: UUID;
    reason?: 'completed' | 'abandoned' | 'editorClosed';
  };
}

export interface GetSessionStatusRequest extends MessageBase {
  type: 'getSessionStatus';
  payload?: {
    sessionId?: UUID;
  };
}

export interface GetSessionsRequest extends MessageBase {
  type: 'getSessions';
  payload?: {
    startDate?: string;
    endDate?: string;
    project?: string;
    tags?: string[];
    status?: 'active' | 'paused' | 'completed' | 'interrupted';
    limit?: number;
    offset?: number;
  };
}

export interface GetDailyStatsRequest extends MessageBase {
  type: 'getDailyStats';
  payload?: {
    date?: string;
  };
}

export interface GetWeeklyStatsRequest extends MessageBase {
  type: 'getWeeklyStats';
  payload?: {
    startDate?: string;
    endDate?: string;
  };
}

export interface GetMonthlyStatsRequest extends MessageBase {
  type: 'getMonthlyStats';
  payload?: {
    year?: number;
    month?: number;
  };
}

export interface GetProjectStatsRequest extends MessageBase {
  type: 'getProjectStats';
  payload: {
    project: string;
    startDate?: string;
    endDate?: string;
  };
}

export interface GetSettingsRequest extends MessageBase {
  type: 'getSettings';
}

export interface UpdateSettingsRequest extends MessageBase {
  type: 'updateSettings';
  payload: Partial<Settings>;
}

export interface ResetSettingsRequest extends MessageBase {
  type: 'resetSettings';
}

export interface ExportDataRequest extends MessageBase {
  type: 'exportData';
  payload?: {
    format?: 'json' | 'csv' | 'xlsx';
    startDate?: string;
    endDate?: string;
    includeProjects?: boolean;
    includeTags?: boolean;
    encrypted?: boolean;
    password?: string;
  };
}

export interface StartPomodoroRequest extends MessageBase {
  type: 'startPomodoro';
  payload?: {
    duration?: number;
  };
}

export interface StopPomodoroRequest extends MessageBase {
  type: 'stopPomodoro';
}

export interface StartBreakRequest extends MessageBase {
  type: 'startBreak';
  payload?: {
    duration?: number;
    isLongBreak?: boolean;
  };
}

export interface StopBreakRequest extends MessageBase {
  type: 'stopBreak';
}

export interface TagSessionRequest extends MessageBase {
  type: 'tagSession';
  payload: {
    sessionId: UUID;
    tags: string[];
  };
}

export interface GetAvailableTagsRequest extends MessageBase {
  type: 'getAvailableTags';
}

export interface GetProjectsRequest extends MessageBase {
  type: 'getProjects';
}

export interface GetHealthMetricsRequest extends MessageBase {
  type: 'getHealthMetrics';
  payload?: {
    date?: string;
  };
}

// Response message types
export interface StartSessionResponse extends MessageBase {
  type: 'startSessionResponse';
  payload: {
    session: Session;
  };
}

export interface PauseSessionResponse extends MessageBase {
  type: 'pauseSessionResponse';
  payload: {
    success: boolean;
    session: Session;
  };
}

export interface ResumeSessionResponse extends MessageBase {
  type: 'resumeSessionResponse';
  payload: {
    success: boolean;
    session: Session;
  };
}

export interface StopSessionResponse extends MessageBase {
  type: 'stopSessionResponse';
  payload: {
    success: boolean;
    session: Session;
  };
}

export interface GetSessionStatusResponse extends MessageBase {
  type: 'getSessionStatusResponse';
  payload: {
    session: Session;
  };
}

export interface GetSessionsResponse extends MessageBase {
  type: 'getSessionsResponse';
  payload: {
    sessions: Session[];
    total: number;
  };
}

export interface GetDailyStatsResponse extends MessageBase {
  type: 'getDailyStatsResponse';
  payload: {
    stats: DailyStats;
  };
}

export interface GetWeeklyStatsResponse extends MessageBase {
  type: 'getWeeklyStatsResponse';
  payload: {
    stats: DailyStats[];
    summary?: {
      totalTime: number;
      activeTime: number;
      deepWorkTime?: number;
      deepWorkPercentage?: number;
      sessionsCount: number;
      averageSessionLength?: number;
      contextSwitches?: number;
      averageDailyTime?: number;
    };
  };
}

export interface GetMonthlyStatsResponse extends MessageBase {
  type: 'getMonthlyStatsResponse';
  payload: {
    stats: DailyStats[];
    summary?: {
      totalTime: number;
      activeTime: number;
      deepWorkTime?: number;
      deepWorkPercentage?: number;
      sessionsCount: number;
      averageSessionLength?: number;
      contextSwitches?: number;
      averageDailyTime?: number;
    };
  };
}

export interface GetProjectStatsResponse extends MessageBase {
  type: 'getProjectStatsResponse';
  payload: {
    project: string;
    stats: {
      totalTime: number;
      sessionsCount: number;
      averageSessionLength?: number;
      lastActive?: Timestamp;
      dailyBreakdown?: Array<{
        date: string;
        time: number;
      }>;
    };
  };
}

export interface GetSettingsResponse extends MessageBase {
  type: 'getSettingsResponse';
  payload: Settings;
}

export interface UpdateSettingsResponse extends MessageBase {
  type: 'updateSettingsResponse';
  payload: {
    success: boolean;
    settings: Settings;
  };
}

export interface ResetSettingsResponse extends MessageBase {
  type: 'resetSettingsResponse';
  payload: {
    success: boolean;
    settings: Settings;
  };
}

export interface ExportDataResponse extends MessageBase {
  type: 'exportDataResponse';
  payload: {
    success: boolean;
    filePath: string;
    format: 'json' | 'csv' | 'xlsx';
    encrypted: boolean;
  };
}

export interface StartPomodoroResponse extends MessageBase {
  type: 'startPomodoroResponse';
  payload: {
    success: boolean;
    pomodoroId: UUID;
    startTime?: Timestamp;
    endTime: Timestamp;
    duration: number;
  };
}

export interface StopPomodoroResponse extends MessageBase {
  type: 'stopPomodoroResponse';
  payload: {
    success: boolean;
  };
}

export interface StartBreakResponse extends MessageBase {
  type: 'startBreakResponse';
  payload: {
    success: boolean;
    breakId: UUID;
    startTime?: Timestamp;
    endTime: Timestamp;
    duration: number;
    isLongBreak: boolean;
  };
}

export interface StopBreakResponse extends MessageBase {
  type: 'stopBreakResponse';
  payload: {
    success: boolean;
  };
}

export interface TagSessionResponse extends MessageBase {
  type: 'tagSessionResponse';
  payload: {
    success: boolean;
    session: Session;
  };
}

export interface GetAvailableTagsResponse extends MessageBase {
  type: 'getAvailableTagsResponse';
  payload: {
    tags: Array<{
      name: string;
      usageCount: number;
    }>;
  };
}

export interface GetProjectsResponse extends MessageBase {
  type: 'getProjectsResponse';
  payload: {
    projects: Array<{
      name: string;
      totalTime: number;
      lastActive?: Timestamp;
    }>;
  };
}

export interface GetHealthMetricsResponse extends MessageBase {
  type: 'getHealthMetricsResponse';
  payload: {
    metrics: {
      stressLevel?: number;
      burnoutRisk?: number;
      focusScore?: number;
      breakCompliance?: number;
      workLifeBalance?: number;
      recommendations?: Array<{
        type: 'break' | 'posture' | 'hydration' | 'exercise' | 'focus';
        message: string;
        priority: 'low' | 'medium' | 'high';
      }>;
    };
  };
}

// Notification message types
export interface StatusUpdateNotification {
  type: 'statusUpdate';
  payload: {
    session: Session;
  };
}

export interface IdleDetectedNotification {
  type: 'idleDetected';
  payload: {
    sessionId: UUID;
    idleTime: number;
  };
}

export interface FocusTimeUpdateNotification {
  type: 'focusTimeUpdate';
  payload: {
    dailyTotal: number;
    goalPercentage: number;
    weeklyTotal?: number;
  };
}

export interface PomodoroUpdateNotification {
  type: 'pomodoroUpdate';
  payload: {
    pomodoroId: UUID;
    remainingTime: number;
    status: 'active' | 'completed' | 'interrupted';
    completedCount?: number;
    totalCount?: number;
  };
}

export interface BreakUpdateNotification {
  type: 'breakUpdate';
  payload: {
    breakId: UUID;
    remainingTime: number;
    status: 'active' | 'completed' | 'interrupted';
    isLongBreak: boolean;
  };
}

export interface GoalReachedNotification {
  type: 'goalReached';
  payload: {
    goalType: 'daily' | 'weekly' | 'project' | 'custom';
    achieved: number;
    target: number;
    percentage: number;
  };
}

export interface HealthAlertNotification {
  type: 'healthAlert';
  payload: {
    alertType: 'break' | 'posture' | 'hydration' | 'burnout' | 'eyestrain';
    message: string;
    severity: 'info' | 'warning' | 'critical';
    recommendation?: string;
  };
}

export interface ProjectDetectedNotification {
  type: 'projectDetected';
  payload: {
    project: string;
    gitBranch?: string;
    recentFiles?: string[];
  };
}

// Union types for message categories
export type RequestMessage =
  | StartSessionRequest
  | PauseSessionRequest
  | ResumeSessionRequest
  | StopSessionRequest
  | GetSessionStatusRequest
  | GetSessionsRequest
  | GetDailyStatsRequest
  | GetWeeklyStatsRequest
  | GetMonthlyStatsRequest
  | GetProjectStatsRequest
  | GetSettingsRequest
  | UpdateSettingsRequest
  | ResetSettingsRequest
  | ExportDataRequest
  | StartPomodoroRequest
  | StopPomodoroRequest
  | StartBreakRequest
  | StopBreakRequest
  | TagSessionRequest
  | GetAvailableTagsRequest
  | GetProjectsRequest
  | GetHealthMetricsRequest;

export type ResponseMessage =
  | StartSessionResponse
  | PauseSessionResponse
  | ResumeSessionResponse
  | StopSessionResponse
  | GetSessionStatusResponse
  | GetSessionsResponse
  | GetDailyStatsResponse
  | GetWeeklyStatsResponse
  | GetMonthlyStatsResponse
  | GetProjectStatsResponse
  | GetSettingsResponse
  | UpdateSettingsResponse
  | ResetSettingsResponse
  | ExportDataResponse
  | StartPomodoroResponse
  | StopPomodoroResponse
  | StartBreakResponse
  | StopBreakResponse
  | TagSessionResponse
  | GetAvailableTagsResponse
  | GetProjectsResponse
  | GetHealthMetricsResponse
  | ErrorResponse;

export type NotificationMessage =
  | StatusUpdateNotification
  | IdleDetectedNotification
  | FocusTimeUpdateNotification
  | PomodoroUpdateNotification
  | BreakUpdateNotification
  | GoalReachedNotification
  | HealthAlertNotification
  | ProjectDetectedNotification;

export type IPCMessage = RequestMessage | ResponseMessage | NotificationMessage;

// Type guards
export function isMessageBase(message: any): message is MessageBase {
  return (
    typeof message === 'object' &&
    message !== null &&
    typeof message.type === 'string' &&
    typeof message.id === 'string' &&
    (message.timestamp === undefined || typeof message.timestamp === 'number')
  );
}

export function isErrorResponse(message: any): message is ErrorResponse {
  return (
    isMessageBase(message) &&
    message.type === 'error' &&
    typeof message.error === 'object' &&
    message.error !== null &&
    typeof message.error.code === 'string' &&
    typeof message.error.message === 'string'
  );
}

export function isRequestMessage(message: any): message is RequestMessage {
  if (!isMessageBase(message)) return false;
  
  const requestTypes = [
    'startSession',
    'pauseSession',
    'resumeSession',
    'stopSession',
    'getSessionStatus',
    'getSessions',
    'getDailyStats',
    'getWeeklyStats',
    'getMonthlyStats',
    'getProjectStats',
    'getSettings',
    'updateSettings',
    'resetSettings',
    'exportData',
    'startPomodoro',
    'stopPomodoro',
    'startBreak',
    'stopBreak',
    'tagSession',
    'getAvailableTags',
    'getProjects',
    'getHealthMetrics'
  ];
  
  return requestTypes.includes(message.type);
}

export function isResponseMessage(message: any): message is ResponseMessage {
  if (!isMessageBase(message)) return false;
  
  if (isErrorResponse(message)) return true;
  
  const responseTypes = [
    'startSessionResponse',
    'pauseSessionResponse',
    'resumeSessionResponse',
    'stopSessionResponse',
    'getSessionStatusResponse',
    'getSessionsResponse',
    'getDailyStatsResponse',
    'getWeeklyStatsResponse',
    'getMonthlyStatsResponse',
    'getProjectStatsResponse',
    'getSettingsResponse',
    'updateSettingsResponse',
    'resetSettingsResponse',
    'exportDataResponse',
    'startPomodoroResponse',
    'stopPomodoroResponse',
    'startBreakResponse',
    'stopBreakResponse',
    'tagSessionResponse',
    'getAvailableTagsResponse',
    'getProjectsResponse',
    'getHealthMetricsResponse'
  ];
  
  return responseTypes.includes(message.type);
}

export function isNotificationMessage(message: any): message is NotificationMessage {
  if (typeof message !== 'object' || message === null || typeof message.type !== 'string') {
    return false;
  }
  
  const notificationTypes = [
    'statusUpdate',
    'idleDetected',
    'focusTimeUpdate',
    'pomodoroUpdate',
    'breakUpdate',
    'goalReached',
    'healthAlert',
    'projectDetected'
  ];
  
  return notificationTypes.includes(message.type);
}

// Specific message type guards
export function isMessageOfType<T extends IPCMessage>(
  message: any,
  type: T['type']
): message is T {
  return typeof message === 'object' && message !== null && message.type === type;
}

// UUID validation
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Message validation
export function validateMessage(message: any): { valid: boolean; error?: string } {
  // Basic validation
  if (typeof message !== 'object' || message === null) {
    return { valid: false, error: 'Message must be an object' };
  }
  
  if (typeof message.type !== 'string') {
    return { valid: false, error: 'Message must have a string type property' };
  }
  
  // Check if it's a notification (doesn't require ID)
  if (isNotificationMessage(message)) {
    return { valid: true };
  }
  
  // For requests and responses, validate ID
  if (!message.id) {
    return { valid: false, error: 'Message must have an id property' };
  }
  
  if (!isValidUUID(message.id)) {
    return { valid: false, error: 'Message id must be a valid UUID' };
  }
  
  // Validate timestamp if present
  if (message.timestamp !== undefined && typeof message.timestamp !== 'number') {
    return { valid: false, error: 'Message timestamp must be a number' };
  }
  
  // Validate payload if required
  if (message.type.endsWith('Response') && !message.payload) {
    return { valid: false, error: 'Response messages must have a payload' };
  }
  
  // For error responses, validate error object
  if (message.type === 'error') {
    if (!message.error || typeof message.error !== 'object') {
      return { valid: false, error: 'Error response must have an error object' };
    }
    
    if (typeof message.error.code !== 'string') {
      return { valid: false, error: 'Error response must have an error.code string' };
    }
    
    if (typeof message.error.message !== 'string') {
      return { valid: false, error: 'Error response must have an error.message string' };
    }
  }
  
  return { valid: true };
}

// Request/response matching utilities
export function createRequestId(): UUID {
  // Simple UUID v4 implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createRequest<T extends RequestMessage>(
  type: T['type'],
  payload?: Omit<T, 'type' | 'id' | 'timestamp'>['payload']
): T {
  return {
    type,
    id: createRequestId(),
    timestamp: Date.now(),
    ...(payload ? { payload } : {})
  } as T;
}

export function createErrorResponse(
  requestId: UUID,
  code: string,
  message: string,
  details?: Record<string, any>
): ErrorResponse {
  return {
    type: 'error',
    id: requestId,
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  };
}

export function getResponseType(requestType: RequestMessage['type']): ResponseMessage['type'] {
  return `${requestType}Response` as ResponseMessage['type'];
}

export function isResponseFor<T extends RequestMessage>(
  response: ResponseMessage,
  request: T
): boolean {
  if (isErrorResponse(response)) {
    return response.id === request.id;
  }
  
  const expectedResponseType = getResponseType(request.type);
  return response.type === expectedResponseType && response.id === request.id;
}

// Message handling utilities
export interface PendingRequest<T extends RequestMessage = RequestMessage> {
  request: T;
  resolve: (response: ResponseMessage) => void;
  reject: (error: Error) => void;
  timestamp: number;
  timeout: NodeJS.Timeout;
}

export class MessageHandler {
  private pendingRequests: Map<UUID, PendingRequest> = new Map();
  private requestTimeout: number;
  
  constructor(requestTimeout: number = 30000) {
    this.requestTimeout = requestTimeout;
  }
  
  public sendRequest<T extends RequestMessage>(
    request: T,
    sendFn: (message: IPCMessage) => void
  ): Promise<Exclude<ResponseMessage, ErrorResponse>> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(request.id);
        reject(new Error(`Request ${request.type} timed out after ${this.requestTimeout}ms`));
      }, this.requestTimeout);
      
      this.pendingRequests.set(request.id, {
        request,
        resolve: (response) => {
          if (isErrorResponse(response)) {
            reject(new Error(`${response.error.code}: ${response.error.message}`));
          } else {
            resolve(response as Exclude<ResponseMessage, ErrorResponse>);
          }
        },
        reject,
        timestamp: Date.now(),
        timeout
      });
      
      sendFn(request);
    });
  }
  
  public handleResponse(response: ResponseMessage): boolean {
    if (!response.id) return false;
    
    const pendingRequest = this.pendingRequests.get(response.id);
    if (!pendingRequest) return false;
    
    clearTimeout(pendingRequest.timeout);
    this.pendingRequests.delete(response.id);
    
    pendingRequest.resolve(response);
    return true;
  }
  
  public clearPendingRequests(): void {
    for (const [id, { timeout, reject }] of this.pendingRequests.entries()) {
      clearTimeout(timeout);
      reject(new Error('Request cancelled - handler cleared'));
      this.pendingRequests.delete(id);
    }
  }
}

// Utility for creating typed notification handlers
export type NotificationHandler<T extends NotificationMessage> = (notification: T) => void;

export class NotificationDispatcher {
  private handlers: Map<NotificationMessage['type'], NotificationHandler<any>[]> = new Map();
  
  public subscribe<T extends NotificationMessage>(
    type: T['type'],
    handler: NotificationHandler<T>
  ): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    
    this.handlers.get(type)!.push(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(type);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }
  
  public dispatch(notification: NotificationMessage): boolean {
    if (!isNotificationMessage(notification)) return false;
    
    const handlers = this.handlers.get(notification.type);
    if (!handlers || handlers.length === 0) return false;
    
    handlers.forEach((handler) => {
      try {
        handler(notification);
      } catch (error) {
        console.error(`Error in notification handler for ${notification.type}:`, error);
      }
    });
    
    return true;
  }
}

// IPC Bridge for WebView <-> Extension communication
export interface IPCBridge {
  send(message: IPCMessage): void;
  onMessage(callback: (message: IPCMessage) => void): () => void;
}

export class IPCManager {
  private bridge: IPCBridge;
  private messageHandler: MessageHandler;
  private notificationDispatcher: NotificationDispatcher;
  private unsubscribeFromBridge: (() => void) | null = null;
  
  constructor(bridge: IPCBridge, requestTimeout: number = 30000) {
    this.bridge = bridge;
    this.messageHandler = new MessageHandler(requestTimeout);
    this.notificationDispatcher = new NotificationDispatcher();
    
    this.unsubscribeFromBridge = this.bridge.onMessage((message) => {
      if (isResponseMessage(message)) {
        this.messageHandler.handleResponse(message);
      } else if (isNotificationMessage(message)) {
        this.notificationDispatcher.dispatch(message);
      }
    });
  }
  
  public async sendRequest<T extends RequestMessage>(
    request: T
  ): Promise<Exclude<ResponseMessage, ErrorResponse>> {
    return this.messageHandler.sendRequest(request, (msg) => this.bridge.send(msg));
  }
  
  public subscribeToNotification<T extends NotificationMessage>(
    type: T['type'],
    handler: NotificationHandler<T>
  ): () => void {
    return this.notificationDispatcher.subscribe(type, handler);
  }
  
  public dispose(): void {
    if (this.unsubscribeFromBridge) {
      this.unsubscribeFromBridge();
      this.unsubscribeFromBridge = null;
    }
    this.messageHandler.clearPendingRequests();
  }
}
