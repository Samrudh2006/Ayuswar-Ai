import React, { useState, useEffect, useRef } from 'react';
import { Download, X, CheckCircle2, Loader2, Info } from 'lucide-react';

/**
 * MobilePwaInstallBanner
 * Floating dismissible install prompt for mobile browsers.
 * Features an original circular press-point ripple tailored for AyuSwar,
 * strict state management (idle, prompting, pending, installed, unconfirmed),
 * accessible aria-live status, and 44px touch targets.
 */
export default function MobilePwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [installState, setInstallState] = useState('idle'); // 'idle' | 'prompting' | 'pending' | 'installed' | 'unconfirmed'
  const [ripplePos, setRipplePos] = useState(null);

  const pendingTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    // Check if already running in standalone mode (PWA or Capacitor)
    // Standalone context hides the banner; it does not claim a new installation occurred.
    const isStandalone = 
      (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) ||
      (typeof navigator !== 'undefined' && (navigator.standalone || Boolean(window.Capacitor)));

    if (isStandalone) {
      return;
    }

    // Check if dismissed via 30-day close action (X button)
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
    if (isIosDevice) {
      setShowBanner(true);
    }

    // Listen for native Android/Chromium install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
      setInstallState('idle');
    };

    // Listen for native appinstalled confirmation
    const handleAppInstalled = () => {
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      setInstallState('installed');
      setDeferredPrompt(null);
      // Success check + "Installed", then hide after ~2.5s. Do not persist permanent installed flag in localStorage.
      hideTimerRef.current = setTimeout(() => {
        setShowBanner(false);
      }, 2500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const handleInstallClick = async (e) => {
    if (installState !== 'idle' || !deferredPrompt) return;

    // Capture circular press-point coordinates relative to the button
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? (rect.left + rect.width / 2);
    const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? (rect.top + rect.height / 2);
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setRipplePos({ x, y, key: Date.now() });

    // Transition to prompting state
    setInstallState('prompting');

    try {
      const promptEvent = deferredPrompt;
      // Consume the saved beforeinstallprompt event once
      setDeferredPrompt(null);
      await promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;

      if (choiceResult && choiceResult.outcome === 'accepted') {
        // Show indeterminate "Installing" — acceptance is NOT completion
        setInstallState('pending');

        // After 20s without confirmation, stop motion and show neutral status
        pendingTimerRef.current = setTimeout(() => {
          setInstallState((current) => (current === 'pending' ? 'unconfirmed' : current));
        }, 20000);
      } else {
        // Dismissed by user: clear consumed event and wait for fresh event before offering install again.
        // Dismissal of the native prompt is NOT the banner's 30-day close action.
        setInstallState('idle');
      }
    } catch (err) {
      console.warn('PWA install prompt error:', err);
      setInstallState('idle');
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

  // Check standalone mode on render
  const isCurrentlyStandalone = 
    (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) ||
    (typeof navigator !== 'undefined' && (navigator.standalone || Boolean(window.Capacitor)));

  if (!showBanner || isCurrentlyStandalone) return null;

  return (
    <>
      <div
        role="banner"
        aria-label="Install mobile application"
        className="ayuswar-pwa-banner"
      >
        {/* App Emblem */}
        <img
          src="/assets/ayuswar_emblem_mark.png"
          alt="AyuSwar AI App"
          className="ayuswar-pwa-emblem"
        />

        {/* Text Info */}
        <div className="ayuswar-pwa-info">
          <div className="ayuswar-pwa-title-row">
            <span className="ayuswar-pwa-title">Install AyuSwar AI</span>
            <span className="ayuswar-pwa-badge">FAST APP</span>
          </div>
          <div className="ayuswar-pwa-subtitle">
            {isIos ? 'Tap Share ⎋ & "Add to Home Screen"' : 'Add AyuSwar to your home screen'}
          </div>
        </div>

        {/* Action Controls */}
        <div className="ayuswar-pwa-actions" aria-live="polite">
          {!isIos && (deferredPrompt || installState !== 'idle') && (
            <button
              onClick={handleInstallClick}
              disabled={installState !== 'idle'}
              className={`ayuswar-pwa-install-btn ayuswar-pwa-btn-${installState}`}
              aria-label={
                installState === 'idle'
                  ? 'Install application'
                  : installState === 'prompting'
                  ? 'Waiting for your choice'
                  : installState === 'pending'
                  ? 'Installing application'
                  : installState === 'installed'
                  ? 'Installed successfully'
                  : 'Check your home screen or app list'
              }
            >
              {/* Circular press-point ripple */}
              {ripplePos && (
                <span
                  key={ripplePos.key}
                  className="ayuswar-press-ripple"
                  style={{
                    left: `${ripplePos.x}px`,
                    top: `${ripplePos.y}px`
                  }}
                />
              )}

              {/* Dynamic State Feedback */}
              {installState === 'idle' && (
                <>
                  <Download size={13} strokeWidth={2.5} className="ayuswar-pwa-btn-icon" />
                  <span>Install</span>
                </>
              )}

              {installState === 'prompting' && (
                <>
                  <span className="ayuswar-pwa-pulse-dot" />
                  <span>Waiting for your choice</span>
                </>
              )}

              {installState === 'pending' && (
                <>
                  <Loader2 size={13} className="ayuswar-pwa-spinner" />
                  <span>Installing</span>
                </>
              )}

              {installState === 'installed' && (
                <>
                  <CheckCircle2 size={14} color="#059669" />
                  <span style={{ color: '#059669', fontWeight: 850 }}>Installed</span>
                </>
              )}

              {installState === 'unconfirmed' && (
                <>
                  <Info size={13} />
                  <span style={{ fontSize: '10px' }}>Check your home screen or app list</span>
                </>
              )}
            </button>
          )}

          {/* Dismiss button (30-day close action) */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss installation banner"
            className="ayuswar-pwa-dismiss-btn"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Scoped CSS for Install Button Ripple & PWA Banner */}
      <style>{`
        .ayuswar-pwa-banner {
          position: fixed;
          top: 8px;
          left: 10px;
          right: 10px;
          max-width: 440px;
          margin: 0 auto;
          z-index: 1050;
          background: linear-gradient(135deg, rgba(10, 37, 64, 0.97) 0%, rgba(15, 76, 92, 0.97) 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 14px;
          padding: 8px 12px;
          box-shadow: 0 8px 26px rgba(10, 37, 64, 0.35);
          border: 1px solid rgba(212, 175, 55, 0.75);
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slideDownPwa 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }

        .ayuswar-pwa-emblem {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #FAF8F5;
          border: 1.5px solid #D4AF37;
          padding: 2px;
          flex-shrink: 0;
        }

        .ayuswar-pwa-info {
          flex: 1;
          min-width: 0;
        }

        .ayuswar-pwa-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ayuswar-pwa-title {
          font-size: 12px;
          font-weight: 850;
          color: #ffffff;
          letter-spacing: -0.2px;
        }

        .ayuswar-pwa-badge {
          font-size: 8px;
          font-weight: 900;
          background: rgba(212, 175, 55, 0.25);
          color: #D4AF37;
          padding: 1px 5px;
          border-radius: 4px;
          border: 1px solid rgba(212, 175, 55, 0.4);
        }

        .ayuswar-pwa-subtitle {
          font-size: 10.5px;
          color: #D1E1E6;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ayuswar-pwa-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        /* 44px minimum tap target button with circular press-point ripple */
        .ayuswar-pwa-install-btn {
          position: relative;
          overflow: hidden;
          min-height: 44px;
          min-width: 44px;
          padding: 6px 14px;
          border-radius: 8px;
          background: #D4AF37;
          color: #081C24;
          border: none;
          font-size: 11.5px;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background-color 0.15s ease, transform 0.1s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .ayuswar-pwa-install-btn:focus-visible {
          outline: 2px solid #FFFFFF;
          outline-offset: 2px;
        }

        .ayuswar-pwa-btn-prompting,
        .ayuswar-pwa-btn-pending {
          background: #FAF8F5;
          color: #0F4C5C;
          cursor: wait;
        }

        .ayuswar-pwa-btn-installed {
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #10B981;
          cursor: default;
        }

        .ayuswar-pwa-btn-unconfirmed {
          background: #FAF8F5;
          color: #475569;
          font-size: 10px;
          padding: 4px 8px;
          cursor: default;
        }

        /* Custom circular ripple radiating from exact touch coordinate */
        .ayuswar-press-ripple {
          position: absolute;
          width: 8px;
          height: 8px;
          margin-left: -4px;
          margin-top: -4px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(15, 76, 92, 0.45) 0%, rgba(212, 175, 55, 0.2) 70%, transparent 100%);
          pointer-events: none;
          animation: ayuswarRippleExpand 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .ayuswar-pwa-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0F4C5C;
          animation: pulseDot 1s ease-in-out infinite;
        }

        .ayuswar-pwa-spinner {
          animation: ayuswarSpin 1s linear infinite;
        }

        .ayuswar-pwa-dismiss-btn {
          min-height: 44px;
          min-width: 44px;
          background: none;
          border: none;
          color: #D1E1E6;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .ayuswar-pwa-dismiss-btn:focus-visible {
          outline: 2px solid #D4AF37;
          outline-offset: 2px;
        }

        @keyframes ayuswarRippleExpand {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          100% {
            transform: scale(28);
            opacity: 0;
          }
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes ayuswarSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes slideDownPwa {
          from {
            transform: translateY(-24px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* prefers-reduced-motion: static status, no waves/ripples/spinners */
        @media (prefers-reduced-motion: reduce) {
          .ayuswar-pwa-banner,
          .ayuswar-pwa-spinner,
          .ayuswar-pwa-pulse-dot,
          .ayuswar-press-ripple {
            animation: none !important;
            transition: none !important;
          }
          .ayuswar-press-ripple {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
