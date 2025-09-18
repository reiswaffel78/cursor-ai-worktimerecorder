import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/index.css';

// Initialize VS Code API for WebView communication
declare global {
  interface Window {
    acquireVsCodeApi: () => any;
    vscode: any;
  }
}

// Get VS Code API for IPC communication
window.vscode = window.acquireVsCodeApi?.() || {
  postMessage: (message: any) => {
    console.log('Mock VS Code API:', message);
  }
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
