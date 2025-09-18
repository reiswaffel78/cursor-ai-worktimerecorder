import React from 'react';
import './StatsGrid.css';

interface DailyStats {
  date: string;
  focusTime: number;
  sessions: number;
  projects: string[];
  averageSessionLength: number;
}

interface StatsGridProps {
  dailyStats: DailyStats;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ dailyStats }) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const stats = [
    {
      icon: '⏱️',
      label: 'Focus Time',
      value: formatDuration(dailyStats.focusTime),
      color: 'primary'
    },
    {
      icon: '🎯',
      label: 'Sessions',
      value: dailyStats.sessions.toString(),
      color: 'secondary'
    },
    {
      icon: '📁',
      label: 'Projects',
      value: dailyStats.projects.length.toString(),
      color: 'tertiary'
    },
    {
      icon: '📊',
      label: 'Avg. Session',
      value: formatDuration(dailyStats.averageSessionLength),
      color: 'quaternary'
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card ${stat.color}`}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
