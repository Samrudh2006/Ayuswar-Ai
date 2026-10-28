import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App.jsx';

// Production Console Hygiene: Suppress noisy runtime fallback warnings in production
if (import.meta.env.PROD) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const msg = args[0] ? String(args[0]) : '';
    if (
      msg.includes('SpeechRecognition') ||
      msg.includes('Speech error') ||
      msg.includes('getUserMedia') ||
      msg.includes('Audio') ||
      msg.includes('geocode') ||
      msg.includes('Location') ||
      msg.includes('fallback')
    ) {
      return;
    }
    originalWarn(...args);
  };
}

// AyuSwar Clinical Hospital-Grade Console Badge
if (typeof window !== 'undefined') {
  console.info(
    '%c AyuSwar AI (ఆయుస్వర) %c Production Clinical System Online • ABDM M3 / NABL Standardized %c',
    'background: #0F4C5C; color: #D4AF37; font-weight: 800; font-size: 12px; padding: 4px 8px; border-radius: 4px 0 0 4px;',
    'background: #081C24; color: #34D399; font-weight: 700; font-size: 11px; padding: 4px 8px; border-radius: 0 4px 4px 0;',
    'background: transparent;'
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);

// Register Progressive Web App Service Worker with instant revalidation
if ('serviceWorker' in navigator && (import.meta.env.PROD || process.env.NODE_ENV === 'production')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        registration.update();
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, prompt SW to take over immediately
                installingWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            };
          }
        };
      })
      .catch(() => {});
  });
}
