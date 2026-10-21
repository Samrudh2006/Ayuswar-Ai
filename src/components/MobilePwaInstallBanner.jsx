import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * MobilePwaInstallBanner
 * Floating dismissible install prompt for mobile browsers.
 * Supports native Android beforeinstallprompt & iOS Add-to-Home-Screen instructions.
 */
export default function MobilePwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (PWA or Capacitor)
    const isStandalone = 
      (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) ||
      (typeof navigator !== 'undefined' && (navigator.standalone || Boolean(window.Capacitor)));

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed
    const isDismissed = localStorage.getItem('ayuswar_pwa_dismissed') === 'true';
    const dismissedAt = localStorage.getItem('ayuswar_pwa_dismissed_at');
    if (isDismissed || (dismissedAt && Date.now() - Number(dismissedAt) < 7 * 24 * 60 * 60 * 1000)) {
      return;
    }

    // Detect iOS
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
    const isIosDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setIsIos(isIosDevice);

    // Listen for native Android/Chromium install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show banner if install prompt is genuine and available
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If on mobile iOS Safari, show banner with instructions after 4 seconds
    if (isIosDevice && typeof window !== 'undefined' && window.innerWidth <= 768) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 4000);
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        clearTimeout(timer);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      localStorage.setItem('ayuswar_pwa_dismissed', 'true');
      localStorage.setItem('ayuswar_pwa_dismissed_at', String(Date.now()));
    } catch {}
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div
      role="banner"
      aria-label="Install mobile application"
      style={{
        position: 'fixed',
        top: '12px',
        left: '12px',
        right: '12px',
        maxWidth: '460px',
        margin: '0 auto',
        zIndex: 1050,
        background: 'linear-gradient(135deg, #0A2540 0%, #004D40 100%)',
        borderRadius: '16px',
        padding: '12px 14px',
        boxShadow: '0 12px 32px rgba(10, 37, 64, 0.4), 0 2px 6px rgba(0,0,0,0.2)',
        border: '1.5px solid rgba(0, 210, 211, 0.3)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'slideDownBanner 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* App Icon */}
      <img
        src="/assets/ayuswar_master_emblem.png"
        alt="AyuSwar AI App"
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          background: '#ffffff',
          padding: '2px',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
        }}
      />

      {/* Text Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.2px' }}>
            Install AyuSwar AI
          </span>
          <span style={{
            fontSize: '9px',
            fontWeight: 800,
            background: 'rgba(0, 210, 211, 0.25)',
            color: '#00D2D3',
            padding: '1px 5px',
            borderRadius: '4px'
          }}>
            FAST APP
          </span>
        </div>
        <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {isIos ? 'Tap Share ⎋ & "Add to Home Screen"' : 'Offline Rx • 1-Tap 108 SOS • Fast OPD'}
        </div>
      </div>

      {/* Action CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {!isIos && deferredPrompt && (
          <button
            type="button"
            onClick={handleInstallClick}
            style={{
              background: '#00D2D3',
              color: '#0A2540',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(0, 210, 211, 0.4)'
            }}
          >
            <Download size={14} strokeWidth={2.5} />
            <span>Install</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss install banner"
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: 'none',
            borderRadius: '50%',
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
            cursor: 'pointer'
          }}
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
