import React, { useState } from 'react';
import { useTimeTrackingStore } from '../../store/timeTrackingStore';
import './Export.css';

type ExportFormat = 'csv' | 'json' | 'pdf';
type ExportRange = 'today' | 'week' | 'month' | 'all';

export const Export: React.FC = () => {
  const { sendMessage, dailyStats, weeklyStats } = useTimeTrackingStore();
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [range, setRange] = useState<ExportRange>('week');
  const [isExporting, setIsExporting] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        format,
        range,
        customStartDate: customStartDate || undefined,
        customEndDate: customEndDate || undefined
      };

      sendMessage({ 
        type: 'exportData', 
        payload: exportData 
      });

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getPreviewData = () => {
    if (range === 'today' && dailyStats) {
      return [dailyStats];
    }
    if (range === 'week' && weeklyStats) {
      return weeklyStats.slice(-7);
    }
    return weeklyStats || [];
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const previewData = getPreviewData();
  const totalFocusTime = previewData.reduce((sum, day) => sum + day.focusTime, 0);
  const totalSessions = previewData.reduce((sum, day) => sum + day.sessions, 0);

  return (
    <div className="export">
      <div className="export-header">
        <h2>Export Data</h2>
        <p>Download your time tracking data for external analysis</p>
      </div>

      <div className="export-content">
        {/* Format Selection */}
        <div className="export-section">
          <h3>📄 Export Format</h3>
          <div className="format-options">
            <label className="format-option">
              <input
                type="radio"
                name="format"
                value="csv"
                checked={format === 'csv'}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
              />
              <div className="format-card">
                <div className="format-icon">📊</div>
                <div className="format-info">
                  <h4>CSV</h4>
                  <p>Spreadsheet compatible format</p>
                </div>
              </div>
            </label>

            <label className="format-option">
              <input
                type="radio"
                name="format"
                value="json"
                checked={format === 'json'}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
              />
              <div className="format-card">
                <div className="format-icon">⚙️</div>
                <div className="format-info">
                  <h4>JSON</h4>
                  <p>Structured data for developers</p>
                </div>
              </div>
            </label>

            <label className="format-option">
              <input
                type="radio"
                name="format"
                value="pdf"
                checked={format === 'pdf'}
                onChange={(e) => setFormat(e.target.value as ExportFormat)}
              />
              <div className="format-card">
                <div className="format-icon">📋</div>
                <div className="format-info">
                  <h4>PDF Report</h4>
                  <p>Formatted report with charts</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Date Range Selection */}
        <div className="export-section">
          <h3>📅 Date Range</h3>
          <div className="range-options">
            <label className="range-option">
              <input
                type="radio"
                name="range"
                value="today"
                checked={range === 'today'}
                onChange={(e) => setRange(e.target.value as ExportRange)}
              />
              <span>Today</span>
            </label>

            <label className="range-option">
              <input
                type="radio"
                name="range"
                value="week"
                checked={range === 'week'}
                onChange={(e) => setRange(e.target.value as ExportRange)}
              />
              <span>This Week</span>
            </label>

            <label className="range-option">
              <input
                type="radio"
                name="range"
                value="month"
                checked={range === 'month'}
                onChange={(e) => setRange(e.target.value as ExportRange)}
              />
              <span>This Month</span>
            </label>

            <label className="range-option">
              <input
                type="radio"
                name="range"
                value="all"
                checked={range === 'all'}
                onChange={(e) => setRange(e.target.value as ExportRange)}
              />
              <span>All Time</span>
            </label>
          </div>

          {/* Custom Date Range */}
          <div className="custom-range">
            <h4>Custom Range (Optional)</h4>
            <div className="date-inputs">
              <div className="date-input">
                <label htmlFor="startDate">Start Date</label>
                <input
                  id="startDate"
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                />
              </div>
              <div className="date-input">
                <label htmlFor="endDate">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Preview */}
        <div className="export-section">
          <h3>📊 Data Preview</h3>
          {previewData.length > 0 ? (
            <div className="preview-container">
              <div className="preview-summary">
                <div className="summary-item">
                  <span className="summary-label">Total Focus Time:</span>
                  <span className="summary-value">{formatDuration(totalFocusTime)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Sessions:</span>
                  <span className="summary-value">{totalSessions}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Days with Data:</span>
                  <span className="summary-value">{previewData.length}</span>
                </div>
              </div>

              <div className="preview-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Focus Time</th>
                      <th>Sessions</th>
                      <th>Projects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 5).map((day, index) => (
                      <tr key={index}>
                        <td>{new Date(day.date).toLocaleDateString()}</td>
                        <td>{formatDuration(day.focusTime)}</td>
                        <td>{day.sessions}</td>
                        <td>{day.projects.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 5 && (
                  <p className="preview-note">
                    ...and {previewData.length - 5} more days
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="preview-empty">
              <span className="empty-icon">📊</span>
              <p>No data available for the selected range</p>
            </div>
          )}
        </div>

        {/* Export Actions */}
        <div className="export-actions">
          <button
            className="btn primary"
            onClick={handleExport}
            disabled={isExporting || previewData.length === 0}
          >
            {isExporting ? (
              <>
                <div className="spinner small"></div>
                Exporting...
              </>
            ) : (
              <>
                📤 Export {format.toUpperCase()}
              </>
            )}
          </button>
        </div>

        {/* Export Notes */}
        <div className="export-notes">
          <h4>📝 Export Notes</h4>
          <ul>
            <li><strong>CSV:</strong> Compatible with Excel, Google Sheets, and other spreadsheet applications</li>
            <li><strong>JSON:</strong> Machine-readable format perfect for custom analysis or import into other tools</li>
            <li><strong>PDF:</strong> Human-readable report with charts and summaries</li>
            <li>All exports include session details, project information, and time statistics</li>
            <li>Your data never leaves your local machine</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
