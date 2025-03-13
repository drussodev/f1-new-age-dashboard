
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

createRoot(document.getElementById("root")!).render(<App />);
