import * as vscode from 'vscode';
import { EventMapper } from '../extension/EventMapper';
import { IdleDetector } from '../extension/IdleDetector';
import { IdleDetectorIntegration } from '../extension/IdleDetectorIntegration';
import { TimeTrackingWebviewProvider } from '../webview/WebviewProvider';

export interface TimeTrackingSession {
  id: string;
  projectName: string;
  startTime: Date;
  endTime?: Date;
  focusTime: number; // in seconds
  idleTime: number; // in seconds
  activities: Array<{
    type: string;
    timestamp: Date;
    score: number;
    metadata?: any;
  }>;
  isActive: boolean;
}

export interface DailyStats {
  date: string;
  focusTime: number;
  sessions: number;
  projects: string[];
  averageSessionLength: number;
}

export interface WeeklyStats extends DailyStats {
  // Inherits from DailyStats but represents weekly aggregation
}

export class TimeTrackingService {
  private _eventMapper: EventMapper;
  private _idleDetector: IdleDetector;
  private _idleIntegration: IdleDetectorIntegration;
  private _webviewProvider?: TimeTrackingWebviewProvider;
  
  private _currentSession: TimeTrackingSession | null = null;
  private _sessions: TimeTrackingSession[] = [];
  private _isTracking = false;
  
  private _disposables: vscode.Disposable[] = [];

  constructor(private context: vscode.ExtensionContext) {
    // Initialize EventMapper with activity detection
    this._eventMapper = new EventMapper();
    
    // Initialize IdleDetector with configuration
    this._idleDetector = new IdleDetector({
      idleThreshold: 300000, // 5 minutes
      maxIdleTime: 1800000, // 30 minutes
      smartResume: true,
      activityDecay: true
    });

    // Initialize IdleDetectorIntegration to coordinate components
    this._idleIntegration = new IdleDetectorIntegration(
      this._eventMapper,
      this._idleDetector,
      (session) => this._onSessionUpdate(session)
    );

    this._setupEventListeners();
    this._loadPersistedData();
  }

  public setWebviewProvider(provider: TimeTrackingWebviewProvider): void {
    this._webviewProvider = provider;
  }

  public async startTracking(): Promise<void> {
    if (this._isTracking) {
      console.warn('Time tracking is already active');
      return;
    }

    try {
      // Start new session
      this._currentSession = {
        id: this._generateSessionId(),
        projectName: await this._detectCurrentProject(),
        startTime: new Date(),
        focusTime: 0,
        idleTime: 0,
        activities: [],
        isActive: true
      };

      // Start all tracking components
      this._eventMapper.startTracking();
      this._idleDetector.startMonitoring();
      this._idleIntegration.start();

      this._isTracking = true;

      // Notify WebView
      this._notifyWebview({
        type: 'sessionUpdate',
        payload: this._currentSession
      });

      // Show notification
      vscode.window.showInformationMessage(
        `⏱️ Time tracking started for "${this._currentSession.projectName}"`
      );

      console.log('Time tracking started:', this._currentSession);

    } catch (error) {
      console.error('Failed to start time tracking:', error);
      vscode.window.showErrorMessage('Failed to start time tracking: ' + (error as Error).message);
    }
  }

  public async stopTracking(): Promise<void> {
    if (!this._isTracking || !this._currentSession) {
      console.warn('No active time tracking session to stop');
      return;
    }

    try {
      // Stop all tracking components
      this._eventMapper.stopTracking();
      this._idleDetector.stopMonitoring();
      this._idleIntegration.stop();

      // Finalize current session
      this._currentSession.endTime = new Date();
      this._currentSession.isActive = false;

      // Calculate total session time
      const sessionDuration = this._currentSession.endTime.getTime() - this._currentSession.startTime.getTime();
      const totalFocusTime = Math.floor(sessionDuration / 1000) - this._currentSession.idleTime;
      this._currentSession.focusTime = Math.max(0, totalFocusTime);

      // Store completed session
      this._sessions.push(this._currentSession);
      await this._persistSession(this._currentSession);

      const completedSession = this._currentSession;
      this._currentSession = null;
      this._isTracking = false;

      // Notify WebView
      this._notifyWebview({
        type: 'sessionUpdate',
        payload: null
      });

      // Show completion notification
      const focusTimeFormatted = this._formatTime(completedSession.focusTime);
      vscode.window.showInformationMessage(
        `✅ Session completed: ${focusTimeFormatted} of focus time`
      );

      console.log('Time tracking stopped:', completedSession);

    } catch (error) {
      console.error('Failed to stop time tracking:', error);
      vscode.window.showErrorMessage('Failed to stop time tracking: ' + (error as Error).message);
    }
  }

  public async pauseTracking(): Promise<void> {
    if (!this._isTracking) {
      console.warn('No active tracking session to pause');
      return;
    }

    try {
      this._idleDetector.forceIdle();
      vscode.window.showInformationMessage('⏸️ Time tracking paused');
      console.log('Time tracking paused');
    } catch (error) {
      console.error('Failed to pause tracking:', error);
    }
  }

  public getCurrentSession(): TimeTrackingSession | null {
    return this._currentSession;
  }

  public isTracking(): boolean {
    return this._isTracking;
  }

  public async getDailyStats(date?: string): Promise<DailyStats> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    // Filter sessions for the target date
    const dailySessions = this._sessions.filter(session => 
      session.startTime.toISOString().split('T')[0] === targetDate
    );

    const focusTime = dailySessions.reduce((total, session) => total + session.focusTime, 0);
    const projects = [...new Set(dailySessions.map(session => session.projectName))];
    const averageSessionLength = dailySessions.length > 0 
      ? Math.floor(focusTime / dailySessions.length)
      : 0;

    return {
      date: targetDate,
      focusTime,
      sessions: dailySessions.length,
      projects,
      averageSessionLength
    };
  }

  public async getWeeklyStats(): Promise<WeeklyStats[]> {
    const now = new Date();
    const weeklyStats: WeeklyStats[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dailyStats = await this.getDailyStats(dateString);
      weeklyStats.push(dailyStats);
    }

    return weeklyStats;
  }

  public async exportData(format: 'csv' | 'json' | 'pdf', dateRange?: { start: string; end: string }): Promise<string> {
    // Filter sessions by date range if provided
    let sessionsToExport = this._sessions;
    
    if (dateRange) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      sessionsToExport = this._sessions.filter(session => {
        const sessionDate = session.startTime;
        return sessionDate >= startDate && sessionDate <= endDate;
      });
    }

    switch (format) {
      case 'json':
        return this._exportAsJSON(sessionsToExport);
      case 'csv':
        return this._exportAsCSV(sessionsToExport);
      case 'pdf':
        return this._exportAsPDF(sessionsToExport);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  public async resetAllData(): Promise<void> {
    try {
      // Stop current tracking
      if (this._isTracking) {
        await this.stopTracking();
      }

      // Clear in-memory data
      this._sessions = [];
      this._currentSession = null;

      // Clear persisted data
      await this.context.globalState.update('timeTrackingSessions', []);
      await this.context.globalState.update('currentSession', null);

      console.log('All time tracking data has been reset');
      
    } catch (error) {
      console.error('Failed to reset data:', error);
      throw error;
    }
  }

  private _setupEventListeners(): void {
    // Listen to EventMapper events
    this._eventMapper.onActivityDetected((activity) => {
      if (this._currentSession) {
        this._currentSession.activities.push({
          type: activity.type,
          timestamp: new Date(),
          score: activity.score,
          metadata: activity.metadata
        });
      }
    });

    // Listen to IdleDetector events
    this._idleDetector.onIdleStateChange((isIdle, idleDuration) => {
      if (this._currentSession) {
        if (isIdle) {
          this._currentSession.idleTime += Math.floor(idleDuration / 1000);
        }
        
        // Notify WebView of session updates
        this._notifyWebview({
          type: 'sessionUpdate',
          payload: this._currentSession
        });
      }
    });
  }

  private async _onSessionUpdate(session: any): void {
    // Handle session updates from IdleDetectorIntegration
    if (this._currentSession) {
      // Update current session with integration data
      Object.assign(this._currentSession, session);
      
      // Notify WebView
      this._notifyWebview({
        type: 'sessionUpdate',
        payload: this._currentSession
      });
    }
  }

  private async _detectCurrentProject(): Promise<string> {
    // Try to get workspace folder name
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      return workspaceFolders[0].name;
    }

    // Fallback to active file's directory name
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const filePath = activeEditor.document.uri.fsPath;
      const pathParts = filePath.split(/[/\\]/);
      return pathParts[pathParts.length - 2] || 'Unknown Project';
    }

    return 'Default Project';
  }

  private _generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private _formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  private async _loadPersistedData(): Promise<void> {
    try {
      // Load previous sessions
      const savedSessions = this.context.globalState.get<TimeTrackingSession[]>('timeTrackingSessions', []);
      this._sessions = savedSessions;

      // Check for interrupted session
      const savedCurrentSession = this.context.globalState.get<TimeTrackingSession>('currentSession');
      if (savedCurrentSession && savedCurrentSession.isActive) {
        // Session was interrupted, offer to resume or discard
        const action = await vscode.window.showInformationMessage(
          'Previous time tracking session was interrupted. Would you like to resume it?',
          'Resume', 'Discard'
        );

        if (action === 'Resume') {
          this._currentSession = savedCurrentSession;
          await this.startTracking();
        } else {
          // Mark as completed and save
          savedCurrentSession.isActive = false;
          savedCurrentSession.endTime = new Date();
          this._sessions.push(savedCurrentSession);
          await this._persistSession(savedCurrentSession);
        }
      }
    } catch (error) {
      console.error('Failed to load persisted data:', error);
    }
  }

  private async _persistSession(session: TimeTrackingSession): Promise<void> {
    try {
      await this.context.globalState.update('timeTrackingSessions', this._sessions);
      
      // Save current session if active
      if (session.isActive) {
        await this.context.globalState.update('currentSession', session);
      } else {
        await this.context.globalState.update('currentSession', null);
      }
    } catch (error) {
      console.error('Failed to persist session:', error);
    }
  }

  private _notifyWebview(message: any): void {
    if (this._webviewProvider) {
      this._webviewProvider.sendMessageToWebview(message);
    }
  }

  private _exportAsJSON(sessions: TimeTrackingSession[]): string {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      totalSessions: sessions.length,
      sessions: sessions
    }, null, 2);
  }

  private _exportAsCSV(sessions: TimeTrackingSession[]): string {
    const headers = ['Date', 'Project', 'Start Time', 'End Time', 'Focus Time (min)', 'Idle Time (min)', 'Activities'];
    const rows = sessions.map(session => [
      session.startTime.toISOString().split('T')[0],
      session.projectName,
      session.startTime.toTimeString().split(' ')[0],
      session.endTime?.toTimeString().split(' ')[0] || '',
      Math.floor(session.focusTime / 60).toString(),
      Math.floor(session.idleTime / 60).toString(),
      session.activities.length.toString()
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private _exportAsPDF(sessions: TimeTrackingSession[]): string {
    // For now, return a simple text representation
    // TODO: Implement actual PDF generation
    const content = sessions.map(session => {
      const duration = session.endTime 
        ? Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60)
        : 0;
      
      return `${session.projectName}: ${session.startTime.toLocaleString()} - ${duration} minutes`;
    }).join('\n');

    return `Time Tracking Report\n\nGenerated: ${new Date().toLocaleString()}\nTotal Sessions: ${sessions.length}\n\n${content}`;
  }

  public dispose(): void {
    this._eventMapper.dispose();
    this._idleDetector.dispose();
    this._idleIntegration.dispose();
    
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
