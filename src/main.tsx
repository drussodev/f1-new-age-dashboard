
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Anti-scraping protection - Additional layer of detection
const runAntiScrapingChecks = () => {
  // Check if running in HTTrack environment
  const isHTTrack = navigator.userAgent.toLowerCase().indexOf('httrack') !== -1;
  
  // Check if devtools is open (often used by scrapers)
  const devtoolsCheck = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    return widthThreshold || heightThreshold;
  };

  if (isHTTrack || devtoolsCheck()) {
    document.body.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100vh; background-color: black; color: white; font-size: 28px; font-weight: bold; text-align: center;">Nice Tried Baby, this is Russo coding not Wix</div>';
    return false;
  }
  
  return true;
};

// Only render if not detected as a scraper
if (runAntiScrapingChecks()) {
  createRoot(document.getElementById("root")!).render(<App />);
}
