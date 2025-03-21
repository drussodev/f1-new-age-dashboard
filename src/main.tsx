
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add a version timestamp to force cache refresh
const appVersion = Date.now();
console.log(`App Version: ${appVersion}`);

// Attach version to window for debugging
window.__APP_VERSION = appVersion;

// Check if cached version exists and is different
const cachedVersion = localStorage.getItem('app_version');
if (cachedVersion && cachedVersion !== appVersion.toString()) {
  console.log('New version detected, clearing cache...');
  // Clear application cache
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
      });
    });
  }
}

// Store current version
localStorage.setItem('app_version', appVersion.toString());

// Always set to false to disable maintenance mode
window.MAINTENANCE_MODE = false;
console.log("Local storage mode enabled - no database connections required");

// Standard DOM initialization without development-specific code
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found");
}
