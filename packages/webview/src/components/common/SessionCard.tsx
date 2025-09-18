import React from 'react';
import './SessionCard.css';

interface Session {
  id: string;
  projectName: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  isActive: boolean;
  interruptions: number;
  filePath?: string;
}

interface SessionCardProps {
  session: Session;
  isActive: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, isActive }) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getFileName = (filePath?: string): string => {
    if (!filePath) return 'Unknown file';
    return filePath.split(/[/\\]/).pop() || 'Unknown file';
  };

  return (
    <div className={`session-card ${isActive ? 'active' : 'inactive'}`}>
      <div className="session-header">
        <div className="session-project">
          <span className="project-icon">📁</span>
          <span className="project-name">{session.projectName}</span>
        </div>
        {isActive && (
          <div className="active-indicator">
            <div className="pulse-dot"></div>
            <span>Live</span>
          </div>
        )}
      </div>
      
      <div className="session-info">
        <div className="duration">
          <span className="label">Duration:</span>
          <span className="value">{formatDuration(session.duration)}</span>
        </div>
        
        <div className="time-range">
          <span className="label">Time:</span>
          <span className="value">
            {formatTime(session.startTime)}
            {session.endTime && ` - ${formatTime(session.endTime)}`}
          </span>
        </div>
        
        {session.filePath && (
          <div className="file-path">
            <span className="label">File:</span>
            <span className="value" title={session.filePath}>
              {getFileName(session.filePath)}
            </span>
          </div>
        )}
        
        {session.interruptions > 0 && (
          <div className="interruptions">
            <span className="label">Interruptions:</span>
            <span className="value">{session.interruptions}</span>
          </div>
        )}
      </div>
    </div>
  );
};
