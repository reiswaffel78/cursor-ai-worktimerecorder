import * as vscode from 'vscode';
import { TimeTrackingWebviewProvider } from './webview/WebviewProvider';
import { TimeTrackingService } from './services/TimeTrackingService';

export function activate(context: vscode.ExtensionContext) {
  console.log('🚀 Cursor AI Time Tracking Extension is now active!');

  try {
    // Initialize TimeTrackingService with all backend integration
    const timeTrackingService = new TimeTrackingService(context);
    
    // Initialize WebView Provider
    const webviewProvider = new TimeTrackingWebviewProvider(context.extensionUri);
    
    // Connect WebView Provider with TimeTrackingService
    webviewProvider.setTimeTrackingService(timeTrackingService);
    timeTrackingService.setWebviewProvider(webviewProvider);

    // Register WebView Provider
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        TimeTrackingWebviewProvider.viewType,
        webviewProvider,
        {
          webviewOptions: {
            retainContextWhenHidden: true
          }
        }
      )
    );

    // Register extension commands
    context.subscriptions.push(
      vscode.commands.registerCommand('timeTracking.start', async () => {
        try {
          await timeTrackingService.startTracking();
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to start time tracking: ${error}`);
        }
      })
    );

    context.subscriptions.push(
      vscode.commands.registerCommand('timeTracking.stop', async () => {
        try {
          await timeTrackingService.stopTracking();
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to stop time tracking: ${error}`);
        }
      })
    );

    context.subscriptions.push(
      vscode.commands.registerCommand('timeTracking.pause', async () => {
        try {
          await timeTrackingService.pauseTracking();
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to pause time tracking: ${error}`);
        }
      })
    );

    context.subscriptions.push(
      vscode.commands.registerCommand('timeTracking.showStats', async () => {
        try {
          const dailyStats = await timeTrackingService.getDailyStats();
          const focusTimeFormatted = formatTime(dailyStats.focusTime);
          
          vscode.window.showInformationMessage(
            `📊 Today's Stats: ${focusTimeFormatted} focus time in ${dailyStats.sessions} session(s)`
          );
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to get stats: ${error}`);
        }
      })
    );

    context.subscriptions.push(
      vscode.commands.registerCommand('timeTracking.openWebview', () => {
        vscode.commands.executeCommand('workbench.view.extension.timeTracking');
      })
    );

    // Register status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = 'timeTracking.openWebview';
    
    // Update status bar periodically
    const updateStatusBar = () => {
      if (timeTrackingService.isTracking()) {
        const currentSession = timeTrackingService.getCurrentSession();
        if (currentSession) {
          const elapsed = Math.floor((Date.now() - currentSession.startTime.getTime()) / 1000);
          const timeString = formatTime(elapsed);
          statusBarItem.text = `⏱️ ${timeString}`;
          statusBarItem.tooltip = `Time Tracking: ${currentSession.projectName}`;
        } else {
          statusBarItem.text = '⏱️ Active';
          statusBarItem.tooltip = 'Time Tracking Active';
        }
      } else {
        statusBarItem.text = '⏱️ Idle';
        statusBarItem.tooltip = 'Click to open Time Tracking';
      }
      statusBarItem.show();
    };

    // Update status bar every 5 seconds
    const statusBarInterval = setInterval(updateStatusBar, 5000);
    updateStatusBar(); // Initial update

    context.subscriptions.push({
      dispose: () => {
        statusBarItem.dispose();
        clearInterval(statusBarInterval);
      }
    });

    // Cleanup on extension deactivation
    context.subscriptions.push({
      dispose: () => {
        timeTrackingService.dispose();
        webviewProvider.dispose();
      }
    });

    console.log('✅ Time Tracking Extension fully initialized with WebView integration!');

  } catch (error) {
    console.error('❌ Failed to activate Time Tracking Extension:', error);
    vscode.window.showErrorMessage(`Failed to activate Time Tracking Extension: ${error}`);
  }
}

export function deactivate() {
  console.log('🛑 Cursor AI Time Tracking Extension is now deactivated.');
}

// Helper function to format seconds into human-readable time
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}
