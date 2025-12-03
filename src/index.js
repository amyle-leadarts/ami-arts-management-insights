import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Mock window.storage for browser compatibility
// This provides localStorage-based persistence if window.storage isn't available
if (!window.storage) {
  window.storage = {
    get: (key) => {
      try {
        const value = localStorage.getItem(key);
        return Promise.resolve(value);
      } catch (error) {
        console.error('Error reading from storage:', error);
        return Promise.resolve(null);
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, value);
        return Promise.resolve();
      } catch (error) {
        console.error('Error writing to storage:', error);
        return Promise.reject(error);
      }
    }
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);