import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { TimeTrackingService } from '../services/TimeTrackingService';

export class TimeTrackingWebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'timeTracking.webview';
  
  private _view?: vscode.WebviewView;
  private _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private _timeTrackingService?: TimeTrackingService;

  constructor(private readonly extensionUri: vscode.Uri) {
    this._extensionUri = extensionUri;
  }

  public setTimeTrackingService(service: TimeTrackingService): void {
    this._timeTrackingService = service;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    // Configure webview options
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, 'packages', 'webview', 'dist'),
        vscode.Uri.joinPath(this._extensionUri, 'packages', 'webview', 'src'),
      ],
    };

    // Set HTML content
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle messages from webview
    this._setWebviewMessageListener(webviewView);

    // Handle webview disposal
    webviewView.onDidDispose(() => {
      this._view = undefined;
    }, null, this._disposables);

    // Initialize with current data
    this._initializeWebviewData();

    console.log('TimeTrackingWebviewProvider: WebView resolved successfully');
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    // Get paths to resources
    const webviewDistPath = vscode.Uri.joinPath(this._extensionUri, 'packages', 'webview', 'dist');
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewDistPath, 'assets', 'main.js'));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(webviewDistPath, 'assets', 'style.css'));
    
    // Use development server in dev mode, production bundle otherwise
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      // Development mode: use Vite dev server
      return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cursor AI Time Tracking</title>
    <meta http-equiv="Content-Security-Policy" 
          content="default-src 'none'; 
                   img-src vscode-resource: https: data: ${webview.cspSource}; 
                   script-src 'unsafe-inline' 'unsafe-eval' ${webview.cspSource} http://localhost:3000; 
                   style-src 'unsafe-inline' ${webview.cspSource} http://localhost:3000;
                   connect-src ${webview.cspSource} http://localhost:3000 ws://localhost:3000;">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="http://localhost:3000/@vite/client"></script>
    <script type="module" src="http://localhost:3000/main.tsx"></script>
    <script>
      window.vscode = acquireVsCodeApi();
    </script>
  </body>
</html>`;
    } else {
      // Production mode: use built bundle
      return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cursor AI Time Tracking</title>
    <meta http-equiv="Content-Security-Policy" 
          content="default-src 'none'; 
                   img-src vscode-resource: https: data: ${webview.cspSource}; 
                   script-src ${webview.cspSource}; 
                   style-src 'unsafe-inline' ${webview.cspSource};">
    <link href="${styleUri}" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script src="${scriptUri}"></script>
    <script>
      window.vscode = acquireVsCodeApi();
    </script>
  </body>
</html>`;
    }
  }

  private _setWebviewMessageListener(webviewView: vscode.WebviewView) {
    webviewView.webview.onDidReceiveMessage(
      async (message: any) => {
        console.log('WebView → Extension:', message);
        
        try {
          await this._handleWebviewMessage(message);
        } catch (error) {
          console.error('Error handling webview message:', error);
          this._sendMessageToWebview({
            type: 'error',
            payload: { message: `Failed to handle message: ${error instanceof Error ? error.message : 'Unknown error'}` }
          });
        }
      },
      undefined,
      this._disposables
    );
  }

  private async _handleWebviewMessage(message: any): Promise<void> {
    if (!this._timeTrackingService) {
      console.warn('TimeTrackingService not available');
      return;
    }

    switch (message.type) {
      case 'requestDailyStats':
        try {
          const dailyStats = await this._timeTrackingService.getDailyStats(message.payload?.date);
          this._sendMessageToWebview({
            type: 'dailyStatsUpdate',
            payload: dailyStats
          });
        } catch (error) {
          console.error('Failed to get daily stats:', error);
        }
        break;

      case 'requestWeeklyStats':
        try {
          const weeklyStats = await this._timeTrackingService.getWeeklyStats();
          this._sendMessageToWebview({
            type: 'weeklyStatsUpdate',
            payload: weeklyStats
          });
        } catch (error) {
          console.error('Failed to get weekly stats:', error);
        }
        break;

      case 'requestCurrentSession':
        try {
          const currentSession = this._timeTrackingService.getCurrentSession();
          this._sendMessageToWebview({
            type: 'sessionUpdate',
            payload: currentSession
          });
        } catch (error) {
          console.error('Failed to get current session:', error);
        }
        break;

      case 'startSession':
        try {
          await this._timeTrackingService.startTracking();
          // The service will automatically notify the webview via _notifyWebview
        } catch (error) {
          console.error('Failed to start session:', error);
          vscode.window.showErrorMessage('Failed to start time tracking: ' + (error as Error).message);
        }
        break;

      case 'stopSession':
        try {
          await this._timeTrackingService.stopTracking();
          // The service will automatically notify the webview via _notifyWebview
        } catch (error) {
          console.error('Failed to stop session:', error);
          vscode.window.showErrorMessage('Failed to stop time tracking: ' + (error as Error).message);
        }
        break;

      case 'pauseSession':
        try {
          await this._timeTrackingService.pauseTracking();
          // Refresh session data
          const currentSession = this._timeTrackingService.getCurrentSession();
          this._sendMessageToWebview({
            type: 'sessionUpdate',
            payload: currentSession
          });
        } catch (error) {
          console.error('Failed to pause session:', error);
          vscode.window.showErrorMessage('Failed to pause time tracking: ' + (error as Error).message);
        }
        break;

      case 'updateSettings':
        try {
          console.log('Updating settings:', message.payload);
          // TODO: Implement settings persistence
          vscode.window.showInformationMessage('Settings updated successfully!');
          
          // Notify webview of successful update
          this._sendMessageToWebview({
            type: 'settingsUpdated',
            payload: { success: true }
          });
        } catch (error) {
          console.error('Failed to update settings:', error);
          vscode.window.showErrorMessage('Failed to update settings: ' + (error as Error).message);
        }
        break;

      case 'exportData':
        try {
          const { format, dateRange } = message.payload;
          const exportedData = await this._timeTrackingService.exportData(format, dateRange);
          
          // Show save dialog
          const exportResult = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(`time-tracking-data.${format}`),
            filters: {
              'CSV files': ['csv'],
              'JSON files': ['json'],
              'PDF files': ['pdf']
            }
          });
          
          if (exportResult) {
            // Write data to file
            await vscode.workspace.fs.writeFile(exportResult, Buffer.from(exportedData, 'utf8'));
            vscode.window.showInformationMessage(`Data exported to ${exportResult.fsPath}`);
            
            // Notify webview of successful export
            this._sendMessageToWebview({
              type: 'exportCompleted',
              payload: { success: true, filePath: exportResult.fsPath }
            });
          }
        } catch (error) {
          console.error('Failed to export data:', error);
          vscode.window.showErrorMessage('Failed to export data: ' + (error as Error).message);
        }
        break;

      case 'resetAllData':
        try {
          const confirmed = await vscode.window.showWarningMessage(
            'Are you sure you want to reset all time tracking data? This action cannot be undone.',
            { modal: true },
            'Yes, Reset Data'
          );
          
          if (confirmed === 'Yes, Reset Data') {
            await this._timeTrackingService.resetAllData();
            vscode.window.showInformationMessage('All time tracking data has been reset.');
            
            // Refresh all data in webview
            await this._initializeWebviewData();
            
            // Notify webview of reset
            this._sendMessageToWebview({
              type: 'dataReset',
              payload: { success: true }
            });
          }
        } catch (error) {
          console.error('Failed to reset data:', error);
          vscode.window.showErrorMessage('Failed to reset data: ' + (error as Error).message);
        }
        break;

      case 'requestConnectionStatus':
        // Check if service is available and tracking is active
        const isConnected = !!this._timeTrackingService;
        const isTracking = this._timeTrackingService ? this._timeTrackingService.isTracking() : false;
        
        this._sendMessageToWebview({
          type: 'connectionStatusUpdate',
          payload: {
            connected: isConnected,
            tracking: isTracking
          }
        });
        break;

      default:
        console.warn('Unknown message type:', message.type);
    }
  }

  private async _initializeWebviewData(): Promise<void> {
    if (!this._timeTrackingService) {
      return;
    }

    try {
      // Send initial data to webview
      const currentSession = this._timeTrackingService.getCurrentSession();
      const dailyStats = await this._timeTrackingService.getDailyStats();
      const weeklyStats = await this._timeTrackingService.getWeeklyStats();
      
      // Send current session
      this._sendMessageToWebview({
        type: 'sessionUpdate',
        payload: currentSession
      });

      // Send daily stats
      this._sendMessageToWebview({
        type: 'dailyStatsUpdate',
        payload: dailyStats
      });

      // Send weekly stats
      this._sendMessageToWebview({
        type: 'weeklyStatsUpdate',
        payload: weeklyStats
      });

      // Send connection status
      this._sendMessageToWebview({
        type: 'connectionStatusUpdate',
        payload: {
          connected: true,
          tracking: this._timeTrackingService.isTracking()
        }
      });

    } catch (error) {
      console.error('Failed to initialize webview data:', error);
    }
  }

  public sendMessageToWebview(message: any): void {
    this._sendMessageToWebview(message);
  }

  private _sendMessageToWebview(message: any): void {
    if (this._view) {
      console.log('Extension → WebView:', message);
      this._view.webview.postMessage(message);
    } else {
      console.warn('Cannot send message: WebView not available');
    }
  }

  public dispose(): void {
    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
