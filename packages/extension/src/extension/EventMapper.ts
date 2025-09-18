/**
 * @file EventMapper.ts
 * @description Maps VS Code API events to session activity data for time tracking
 * 
 * This module serves as the bridge between VS Code's native events and our 
 * SessionTracker. It captures editor activities, processes them through a 
 * scoring system, and sends appropriate IPC messages to track user activity.
 * 
 * @module EventMapper
 * @author Cursor AI Time Tracking Team
 * @version 1.0.0
 */

import * as vscode from 'vscode';
import { IpcBridge } from '../ipc/IpcBridge';
import { 
  ActivityType, 
  ActivityPayload, 
  EditorEventType,
  ProjectInfo,
  FileInfo,
  ActivityScore
} from '../../types';
import { debounce } from '../utils/debounce';
import { extractProjectInfo } from '../utils/projectUtils';
import { validateActivityPayload } from '../../contracts/validation-snippets';

/**
 * Configuration options for the EventMapper
 * @interface EventMapperOptions
 */
export interface EventMapperOptions {
  /** Minimum time between activity updates in ms */
  debounceTime?: number;
  /** Minimum score threshold to trigger activity update */
  activityThreshold?: number;
  /** Whether to batch events before sending */
  batchEvents?: boolean;
  /** Maximum batch size before forcing a send */
  maxBatchSize?: number;
  /** Whether to include metadata about the file/project */
  includeMetadata?: boolean;
}

/**
 * Default configuration for the EventMapper
 */
const DEFAULT_OPTIONS: EventMapperOptions = {
  debounceTime: 800, // ms
  activityThreshold: 5,
  batchEvents: true,
  maxBatchSize: 10,
  includeMetadata: true
};

/**
 * Scoring weights for different types of editor events
 * Higher values indicate more significant activity
 */
const EVENT_WEIGHTS: Record<EditorEventType, number> = {
  textChange: 10,
  textSelection: 3,
  editorFocus: 8,
  documentOpen: 5,
  documentClose: 2,
  documentSave: 7,
  cursorMove: 1,
  scrollChange: 1,
  terminalActivity: 6,
  debuggerActivity: 7,
  gitActivity: 4,
  extensionActivity: 2
};

/**
 * Class responsible for mapping VS Code events to session activities
 * @class EventMapper
 */
export class EventMapper {
  private disposables: vscode.Disposable[] = [];
  private ipcBridge: IpcBridge;
  private options: EventMapperOptions;
  private eventBatch: ActivityPayload[] = [];
  private currentScore: number = 0;
  private lastActiveDocument: string | null = null;
  private projectCache: Map<string, ProjectInfo> = new Map();
  private isDocumentSaved: boolean = true;

  /**
   * Creates a new EventMapper instance
   * @param ipcBridge - The IPC bridge for communication with the webview
   * @param options - Configuration options
   */
  constructor(ipcBridge: IpcBridge, options: EventMapperOptions = {}) {
    this.ipcBridge = ipcBridge;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // Initialize the debounced send method
    this.debouncedSendActivity = debounce(
      this.sendActivity.bind(this),
      this.options.debounceTime || DEFAULT_OPTIONS.debounceTime!
    );
  }

  /**
   * Initializes all event listeners
   * @returns {vscode.Disposable} A disposable that unregisters all event listeners
   */
  public initialize(): vscode.Disposable {
    // Text document changes
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument(this.handleTextDocumentChange.bind(this))
    );
    
    // Editor focus changes
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor(this.handleActiveEditorChange.bind(this))
    );
    
    // Document open/close
    this.disposables.push(
      vscode.workspace.onDidOpenTextDocument(this.handleDocumentOpen.bind(this))
    );
    this.disposables.push(
      vscode.workspace.onDidCloseTextDocument(this.handleDocumentClose.bind(this))
    );
    
    // Document save
    this.disposables.push(
      vscode.workspace.onDidSaveTextDocument(this.handleDocumentSave.bind(this))
    );
    
    // Selection changes
    this.disposables.push(
      vscode.window.onDidChangeTextEditorSelection(this.handleSelectionChange.bind(this))
    );

    // Return a disposable that disposes all registered event handlers
    return {
      dispose: () => {
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
      }
    };
  }

  /**
   * Records an activity and triggers processing
   * @param activity - The activity to record
   */
  private recordActivity(activity: ActivityPayload): void {
    // Validate the activity payload against our schema
    if (!validateActivityPayload(activity)) {
      console.error('Invalid activity payload:', activity);
      return;
    }

    this.currentScore += activity.score;
    
    if (this.options.batchEvents) {
      this.eventBatch.push(activity);
      
      // If we've reached the threshold or max batch size, send immediately
      if (this.currentScore >= (this.options.activityThreshold || 0) || 
          this.eventBatch.length >= (this.options.maxBatchSize || Infinity)) {
        this.sendActivity();
      } else {
        this.debouncedSendActivity();
      }
    } else if (this.currentScore >= (this.options.activityThreshold || 0)) {
      this.sendActivity();
    } else {
      this.debouncedSendActivity();
    }
  }

  /**
   * Debounced version of sendActivity
   * This is initialized in the constructor
   */
  private debouncedSendActivity: () => void;

  /**
   * Sends accumulated activity to the SessionTracker via IPC
   */
  private sendActivity(): void {
    if (this.eventBatch.length === 0 && this.currentScore === 0) {
      return;
    }

    if (this.options.batchEvents && this.eventBatch.length > 0) {
      this.ipcBridge.send('activity:batch', {
        activities: this.eventBatch,
        totalScore: this.currentScore,
        timestamp: new Date().toISOString()
      });
      
      this.eventBatch = [];
    } else {
      this.ipcBridge.send('activity:update', {
        score: this.currentScore,
        timestamp: new Date().toISOString()
      });
    }
    
    this.currentScore = 0;
  }

  /**
   * Clears all cached data
   */
  public clearCache(): void {
    this.projectCache.clear();
    this.eventBatch = [];
    this.currentScore = 0;
    this.lastActiveDocument = null;
  }

  /**
   * Forces sending any pending activities
   */
  public flushActivities(): void {
    this.sendActivity();
  }
}

/**
 * Creates and initializes an EventMapper
 * @param ipcBridge - The IPC bridge for communication
 * @param options - Configuration options
 * @returns An initialized EventMapper
 */
export function createEventMapper(
  ipcBridge: IpcBridge, 
  options?: EventMapperOptions
): { mapper: EventMapper; dispose: () => void } {
  const mapper = new EventMapper(ipcBridge, options);
  const disposable = mapper.initialize();
  
  return {
    mapper,
    dispose: () => {
      mapper.flushActivities();
      disposable.dispose();
    }
  };
}
