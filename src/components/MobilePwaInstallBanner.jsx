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
    const isDismissed = localStorage.getItem('ayuswar_pwa_dismissed') === 'true' || 
                        sessionStorage.getItem('ayuswar_pwa_dismissed_session') === 'true';
    const dismissedAt = localStorage.getItem('ayuswar_pwa_dismissed_at');
    if (isDismissed || (dismissedAt && Date.now() - Number(dismissedAt) < 30 * 24 * 60 * 60 * 1000)) {
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
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

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
      sessionStorage.setItem('ayuswar_pwa_dismissed_session', 'true');
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
        top: '8px',
        left: '10px',
        right: '10px',
        maxWidth: '430px',
        margin: '0 auto',
        zIndex: 1050,
        background: 'linear-gradient(135deg, rgba(10, 37, 64, 0.96) 0%, rgba(0, 77, 64, 0.96) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        padding: '6px 10px',
        boxShadow: '0 8px 24px rgba(15, 76, 92, 0.35)',
        border: '1px solid rgba(212, 175, 55, 0.8)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        animation: 'slideDownBanner 0.3s ease'
      }}
    >
      {/* App Icon */}
      <img
        src="/assets/ayuswar_emblem_mark.png"
        alt="AyuSwar AI App"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#FAF8F5',
          border: '1px solid #D4AF37',
          padding: '1px',
          flexShrink: 0
        }}
      />

      {/* Text Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.2px' }}>
            Install AyuSwar AI
          </span>
          <span style={{
            fontSize: '8px',
            fontWeight: 800,
            background: 'rgba(212, 175, 55, 0.25)',
            color: '#D4AF37',
            padding: '1px 4px',
            borderRadius: '3px'
          }}>
            FAST APP
          </span>
        </div>
        <div style={{ fontSize: '10px', color: '#CBD5E1', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {isIos ? 'Tap Share ⎋ & "Add to Home Screen"' : 'Offline Rx • 1-Tap 108 SOS • Fast OPD'}
        </div>
      </div>

      {/* Action CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {!isIos && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: '#D4AF37',
              color: '#081C24',
              border: 'none',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Download size={11} strokeWidth={2.5} />
            Install
          </button>
        )}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss installation banner"
          style={{
            background: 'none',
            border: 'none',
            color: '#CBD5E1',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
