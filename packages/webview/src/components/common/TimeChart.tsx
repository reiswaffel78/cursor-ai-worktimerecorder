import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import './TimeChart.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DailyStats {
  date: string;
  focusTime: number;
  sessions: number;
  projects: string[];
  averageSessionLength: number;
}

interface TimeChartProps {
  data: DailyStats[];
  type?: 'bar' | 'line';
}

export const TimeChart: React.FC<TimeChartProps> = ({ data, type = 'bar' }) => {
  const formatHours = (seconds: number): number => {
    return Math.round((seconds / 3600) * 10) / 10; // Round to 1 decimal
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const chartData = {
    labels: data.map(d => formatDate(d.date)),
    datasets: [
      {
        label: 'Focus Time (hours)',
        data: data.map(d => formatHours(d.focusTime)),
        backgroundColor: type === 'bar' 
          ? 'rgba(54, 162, 235, 0.8)'
          : 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: type === 'line',
        tension: type === 'line' ? 0.4 : undefined,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: type === 'line' ? 4 : 0,
        pointHoverRadius: type === 'line' ? 6 : 0,
      },
      {
        label: 'Sessions',
        data: data.map(d => d.sessions),
        backgroundColor: type === 'bar'
          ? 'rgba(255, 99, 132, 0.8)'
          : 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: type === 'line',
        tension: type === 'line' ? 0.4 : undefined,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: type === 'line' ? 4 : 0,
        pointHoverRadius: type === 'line' ? 6 : 0,
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label.includes('Focus Time')) {
              return `${label}: ${value}h`;
            } else {
              return `${label}: ${value}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Focus Time (hours)',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Sessions',
          font: {
            size: 12
          }
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
    },
  };

  return (
    <div className="time-chart">
      <div className="chart-header">
        <div className="chart-controls">
          <button 
            className={`chart-btn ${type === 'bar' ? 'active' : ''}`}
            onClick={() => {}} 
            disabled
          >
            📊 Bar
          </button>
          <button 
            className={`chart-btn ${type === 'line' ? 'active' : ''}`}
            onClick={() => {}}
            disabled  
          >
            📈 Line
          </button>
        </div>
      </div>
      
      <div className="chart-container">
        {type === 'bar' ? (
          <Bar data={chartData} options={options} />
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
      
      {data.length === 0 && (
        <div className="chart-empty">
          <span className="empty-icon">📊</span>
          <p>No data available for chart</p>
        </div>
      )}
    </div>
  );
};
