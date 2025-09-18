import React, { useState } from 'react';
import { useTimeTrackingStore } from '../../store/timeTrackingStore';
import './Settings.css';

export const Settings: React.FC = () => {
  const { settings, updateSettings, sendMessage } = useTimeTrackingStore();
  const [tempSettings, setTempSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      updateSettings(tempSettings);
      // Settings will be sent to extension via store
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setTempSettings(settings);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const hasChanges = JSON.stringify(tempSettings) !== JSON.stringify(settings);

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Customize your time tracking experience</p>
      </div>

      <div className="settings-content">
        {/* Session Settings */}
        <div className="settings-section">
          <h3>📅 Session Settings</h3>
          
          <div className="setting-item">
            <label htmlFor="idleTimeout">
              <span className="setting-label">Idle Timeout</span>
              <span className="setting-description">
                Auto-pause after inactivity
              </span>
            </label>
            <div className="setting-control">
              <input
                id="idleTimeout"
                type="range"
                min="60"
                max="1800"
                step="60"
                value={tempSettings.idleTimeout}
                onChange={(e) => setTempSettings({
                  ...tempSettings,
                  idleTimeout: parseInt(e.target.value)
                })}
              />
              <span className="range-value">
                {Math.floor(tempSettings.idleTimeout / 60)} minutes
              </span>
            </div>
          </div>

          <div className="setting-item">
            <label htmlFor="dailyGoal">
              <span className="setting-label">Daily Goal</span>
              <span className="setting-description">
                Target focus time per day
              </span>
            </label>
            <div className="setting-control">
              <input
                id="dailyGoal"
                type="range"
                min="1800"
                max="43200"
                step="1800"
                value={tempSettings.dailyGoal}
                onChange={(e) => setTempSettings({
                  ...tempSettings,
                  dailyGoal: parseInt(e.target.value)
                })}
              />
              <span className="range-value">
                {formatDuration(tempSettings.dailyGoal)}
              </span>
            </div>
          </div>

          <div className="setting-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={tempSettings.autoStart}
                onChange={(e) => setTempSettings({
                  ...tempSettings,
                  autoStart: e.target.checked
                })}
              />
              <span className="checkbox-custom"></span>
              <div>
                <span className="setting-label">Auto-start sessions</span>
                <span className="setting-description">
                  Automatically start tracking when coding begins
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* UI Settings */}
        <div className="settings-section">
          <h3>🎨 Display Settings</h3>
          
          <div className="setting-item">
            <label htmlFor="theme">
              <span className="setting-label">Theme</span>
              <span className="setting-description">
                Choose your preferred appearance
              </span>
            </label>
            <select
              id="theme"
              value={tempSettings.theme}
              onChange={(e) => setTempSettings({
                ...tempSettings,
                theme: e.target.value as 'light' | 'dark' | 'auto'
              })}
            >
              <option value="auto">🔄 Auto (System)</option>
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
            </select>
          </div>

          <div className="setting-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={tempSettings.showSeconds}
                onChange={(e) => setTempSettings({
                  ...tempSettings,
                  showSeconds: e.target.checked
                })}
              />
              <span className="checkbox-custom"></span>
              <div>
                <span className="setting-label">Show seconds</span>
                <span className="setting-description">
                  Display seconds in time counters
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="settings-section">
          <h3>🔔 Notifications</h3>
          
          <div className="setting-item">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={tempSettings.notifications}
                onChange={(e) => setTempSettings({
                  ...tempSettings,
                  notifications: e.target.checked
                })}
              />
              <span className="checkbox-custom"></span>
              <div>
                <span className="setting-label">Enable notifications</span>
                <span className="setting-description">
                  Show system notifications for milestones and breaks
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button
            className="btn secondary"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
          >
            Reset Changes
          </button>
          <button
            className="btn primary"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Data Management */}
        <div className="settings-section danger-zone">
          <h3>⚠️ Data Management</h3>
          
          <div className="setting-item">
            <div className="setting-description">
              <strong>Reset all data</strong><br/>
              This will permanently delete all sessions and statistics.
            </div>
            <button 
              className="btn danger"
              onClick={() => {
                if (confirm('Are you sure? This action cannot be undone.')) {
                  sendMessage({ type: 'resetAllData' });
                }
              }}
            >
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
