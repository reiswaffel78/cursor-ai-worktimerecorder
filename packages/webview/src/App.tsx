import React from 'react';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Settings } from './components/Settings/Settings';
import { Export } from './components/Export/Export';
import { useTimeTrackingStore } from './store/timeTrackingStore';
import './styles/App.css';

export const App: React.FC = () => {
  const { activeView } = useTimeTrackingStore();

  const renderActiveView = () => {
    switch (activeView) {
      case 'settings':
        return <Settings />;
      case 'export':
        return <Export />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <h1>Cursor AI Time Tracking</h1>
          <span className="app-version">v1.0.0</span>
        </div>
        <nav className="app-nav">
          <button 
            className={`nav-btn ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => useTimeTrackingStore.getState().setActiveView('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-btn ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => useTimeTrackingStore.getState().setActiveView('settings')}
          >
            ⚙️ Settings
          </button>
          <button 
            className={`nav-btn ${activeView === 'export' ? 'active' : ''}`}
            onClick={() => useTimeTrackingStore.getState().setActiveView('export')}
          >
            📤 Export
          </button>
        </nav>
      </header>
      
      <main className="app-main">
        {renderActiveView()}
      </main>
    </div>
  );
};
