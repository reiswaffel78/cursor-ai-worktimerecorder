import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Import types from core package
type ViewName = 'dashboard' | 'settings' | 'export';

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

interface DailyStats {
  date: string;
  focusTime: number;
  sessions: number;
  projects: string[];
  averageSessionLength: number;
}

interface AppSettings {
  idleTimeout: number;
  dailyGoal: number;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoStart: boolean;
  showSeconds: boolean;
}

interface TimeTrackingState {
  // View Management
  activeView: ViewName;
  setActiveView: (view: ViewName) => void;

  // Session Management
  currentSession: Session | null;
  recentSessions: Session[];
  setCurrentSession: (session: Session | null) => void;
  addSession: (session: Session) => void;

  // Statistics
  dailyStats: DailyStats | null;
  weeklyStats: DailyStats[];
  setDailyStats: (stats: DailyStats) => void;
  setWeeklyStats: (stats: DailyStats[]) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Connection Status
  isConnected: boolean;
  setConnectionStatus: (connected: boolean) => void;

  // Loading States
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // IPC Communication
  sendMessage: (message: any) => void;
  lastError: string | null;
  setError: (error: string | null) => void;
}

const defaultSettings: AppSettings = {
  idleTimeout: 300, // 5 minutes
  dailyGoal: 8 * 60 * 60, // 8 hours in seconds
  theme: 'auto',
  notifications: true,
  autoStart: true,
  showSeconds: true,
};

export const useTimeTrackingStore = create<TimeTrackingState>()(
  devtools(
    (set, get) => ({
      // Initial State
      activeView: 'dashboard',
      currentSession: null,
      recentSessions: [],
      dailyStats: null,
      weeklyStats: [],
      settings: defaultSettings,
      isConnected: false,
      isLoading: false,
      lastError: null,

      // View Management
      setActiveView: (view: ViewName) => {
        set({ activeView: view }, false, 'setActiveView');
      },

      // Session Management
      setCurrentSession: (session: Session | null) => {
        set({ currentSession: session }, false, 'setCurrentSession');
      },

      addSession: (session: Session) => {
        set(
          (state) => ({
            recentSessions: [session, ...state.recentSessions].slice(0, 10)
          }),
          false,
          'addSession'
        );
      },

      // Statistics
      setDailyStats: (stats: DailyStats) => {
        set({ dailyStats: stats }, false, 'setDailyStats');
      },

      setWeeklyStats: (stats: DailyStats[]) => {
        set({ weeklyStats: stats }, false, 'setWeeklyStats');
      },

      // Settings
      updateSettings: (newSettings: Partial<AppSettings>) => {
        set(
          (state) => ({
            settings: { ...state.settings, ...newSettings }
          }),
          false,
          'updateSettings'
        );

        // Send settings update to extension
        get().sendMessage({
          type: 'updateSettings',
          payload: newSettings
        });
      },

      // Connection Management
      setConnectionStatus: (connected: boolean) => {
        set({ isConnected: connected }, false, 'setConnectionStatus');
      },

      // Loading States
      setLoading: (loading: boolean) => {
        set({ isLoading: loading }, false, 'setLoading');
      },

      // Error Handling
      setError: (error: string | null) => {
        set({ lastError: error }, false, 'setError');
      },

      // IPC Communication
      sendMessage: (message: any) => {
        try {
          if (window.vscode) {
            window.vscode.postMessage(message);
            get().setError(null);
          } else {
            throw new Error('VS Code API not available');
          }
        } catch (error) {
          get().setError(error instanceof Error ? error.message : 'Communication error');
          console.error('Failed to send message:', error);
        }
      },
    }),
    {
      name: 'timetracking-store',
      serialize: {
        options: {
          map: true,
        },
      },
    }
  )
);

// Message listener for IPC communication
window.addEventListener('message', (event) => {
  const message = event.data;
  const store = useTimeTrackingStore.getState();

  switch (message.type) {
    case 'sessionUpdate':
      store.setCurrentSession(message.payload);
      break;
    case 'dailyStatsUpdate':
      store.setDailyStats(message.payload);
      break;
    case 'weeklyStatsUpdate':
      store.setWeeklyStats(message.payload);
      break;
    case 'settingsUpdate':
      store.updateSettings(message.payload);
      break;
    case 'connectionStatus':
      store.setConnectionStatus(message.payload.connected);
      break;
    case 'error':
      store.setError(message.payload.message);
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
});
