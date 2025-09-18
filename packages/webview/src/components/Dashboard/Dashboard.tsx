import React, { useEffect } from 'react';
import { useTimeTrackingStore } from '../../store/timeTrackingStore';
import { TimeChart } from '../common/TimeChart';
import { SessionCard } from '../common/SessionCard';
import { StatsGrid } from '../common/StatsGrid';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const {
    currentSession,
    dailyStats,
    weeklyStats,
    recentSessions,
    settings,
    isConnected,
    isLoading,
    lastError,
    sendMessage
  } = useTimeTrackingStore();

  useEffect(() => {
    // Request initial data from extension
    sendMessage({ type: 'requestDailyStats' });
    sendMessage({ type: 'requestWeeklyStats' });
    sendMessage({ type: 'requestCurrentSession' });
  }, [sendMessage]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (settings.showSeconds) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatProgress = (current: number, goal: number): number => {
    return Math.min((current / goal) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading time tracking data...</p>
        </div>
      </div>
    );
  }

  if (lastError) {
    return (
      <div className="dashboard error">
        <div className="error-message">
          <h3>⚠️ Connection Error</h3>
          <p>{lastError}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Connection Status */}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        <div className="status-indicator">
          {isConnected ? '🟢' : '🔴'}
        </div>
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>

      {/* Current Session */}
      {currentSession && (
        <div className="current-session">
          <SessionCard session={currentSession} isActive={true} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className={`action-btn primary ${currentSession ? 'stop' : 'start'}`}
          onClick={() => {
            sendMessage({ 
              type: currentSession ? 'stopSession' : 'startSession' 
            });
          }}
        >
          {currentSession ? '⏹️ Stop Session' : '▶️ Start Session'}
        </button>
        
        <button 
          className="action-btn secondary"
          onClick={() => {
            sendMessage({ type: 'pauseSession' });
          }}
          disabled={!currentSession}
        >
          ⏸️ Pause
        </button>
      </div>

      {/* Daily Progress */}
      {dailyStats && (
        <div className="daily-progress">
          <h3>Today's Progress</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${formatProgress(dailyStats.focusTime, settings.dailyGoal)}%` 
              }}
            />
          </div>
          <div className="progress-stats">
            <span className="current-time">
              {formatDuration(dailyStats.focusTime)}
            </span>
            <span className="goal-time">
              / {formatDuration(settings.dailyGoal)}
            </span>
            <span className="percentage">
              ({Math.round(formatProgress(dailyStats.focusTime, settings.dailyGoal))}%)
            </span>
          </div>
        </div>
      )}

      {/* Statistics Grid */}
      {dailyStats && <StatsGrid dailyStats={dailyStats} />}

      {/* Time Chart */}
      {weeklyStats && weeklyStats.length > 0 && (
        <div className="time-chart-container">
          <h3>Weekly Overview</h3>
          <TimeChart data={weeklyStats} />
        </div>
      )}

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="recent-sessions">
          <h3>Recent Sessions</h3>
          <div className="sessions-list">
            {recentSessions.slice(0, 5).map((session) => (
              <SessionCard 
                key={session.id} 
                session={session} 
                isActive={false} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!currentSession && (!dailyStats || dailyStats.focusTime === 0) && (
        <div className="empty-state">
          <div className="empty-illustration">
            <span className="icon">⏰</span>
            <h3>Ready to track your coding time?</h3>
            <p>Click the start button to begin your first session.</p>
            <button 
              className="action-btn primary"
              onClick={() => sendMessage({ type: 'startSession' })}
            >
              ▶️ Start Your First Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
