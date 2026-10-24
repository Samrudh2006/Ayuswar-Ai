import React, { useState, useEffect, useRef } from 'react';
import { Download, X, CheckCircle2, Loader2, Info, Smartphone, Monitor, Apple, Sparkles, ExternalLink } from 'lucide-react';

/**
 * MobilePwaInstallBanner
 * Floating install prompt for AyuSwar AI Progressive Web App.
 * Automatically appears on the landing page, offers zero-friction 1-tap installation,
 * and provides clear step-by-step guidance for iOS, Android, and Desktop browsers.
 */
export default function MobilePwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [deviceTab, setDeviceTab] = useState('desktop'); // 'desktop' | 'android' | 'ios'
  const [isIos, setIsIos] = useState(false);
  const [installState, setInstallState] = useState('idle'); // 'idle' | 'prompting' | 'pending' | 'installed'
  const [ripplePos, setRipplePos] = useState(null);

  const pendingTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  useEffect(() => {
    // Check if already running in standalone mode (PWA installed)
    const isStandalone = 
      (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) ||
      (typeof navigator !== 'undefined' && (navigator.standalone || Boolean(window.Capacitor)));

    if (isStandalone) {
      setShowBanner(false);
      return;
    }

    // Check device type
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
    const isIosDevice = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isAndroidDevice = /Android/.test(userAgent);
    setIsIos(isIosDevice);

    if (isIosDevice) {
      setDeviceTab('ios');
    } else if (isAndroidDevice) {
      setDeviceTab('android');
    } else {
      setDeviceTab('desktop');
    }

    // Check if user dismissed it in this browser session
    const isSessionDismissed = sessionStorage.getItem('ayuswar_pwa_dismissed_session') === 'true';
    if (isSessionDismissed) {
      setShowBanner(false);
    } else {
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
      hideTimerRef.current = setTimeout(() => {
        setShowBanner(false);
      }, 2800);
    };

    // External trigger to open PWA install from landing page CTAs
    const handleExternalOpen = () => {
      setShowBanner(true);
      if (deferredPrompt) {
        handleInstallClick();
      } else {
        setShowGuideModal(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('ayuswar:open-pwa-install', handleExternalOpen);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('ayuswar:open-pwa-install', handleExternalOpen);
      if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async (e) => {
    // If native prompt is available, launch it directly
    if (deferredPrompt) {
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? (rect.left + rect.width / 2);
        const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? (rect.top + rect.height / 2);
        setRipplePos({ x: clientX - rect.left, y: clientY - rect.top, key: Date.now() });
      }

      setInstallState('prompting');
      try {
        const promptEvent = deferredPrompt;
        setDeferredPrompt(null);
        await promptEvent.prompt();
        const choiceResult = await promptEvent.userChoice;

        if (choiceResult && choiceResult.outcome === 'accepted') {
          setInstallState('pending');
          pendingTimerRef.current = setTimeout(() => {
            setInstallState('installed');
            setTimeout(() => setShowBanner(false), 2500);
          }, 3000);
        } else {
          setInstallState('idle');
        }
      } catch (err) {
        console.warn('PWA prompt error:', err);
        setInstallState('idle');
        setShowGuideModal(true);
      }
    } else {
      // If browser doesn't offer native prompt event (iOS, Desktop Chrome without prompt yet, Firefox), open guide modal
      setShowGuideModal(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      sessionStorage.setItem('ayuswar_pwa_dismissed_session', 'true');
    } catch {}
  };

  // Check standalone mode on render
  const isCurrentlyStandalone = 
    (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) ||
    (typeof navigator !== 'undefined' && (navigator.standalone || Boolean(window.Capacitor)));

  if (isCurrentlyStandalone) return null;

  return (
    <>
      {/* Floating PWA Banner (Placed ergonomically at bottom with glassmorphism) */}
      {showBanner && (
        <div
          role="banner"
          aria-label="Install AyuSwar AI PWA Application"
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
              <span className="ayuswar-pwa-badge">FAST PWA</span>
            </div>
            <div className="ayuswar-pwa-subtitle">
              {isIos ? 'Tap Share ⎋ & "Add to Home Screen"' : 'Instant launch • Works offline • 0 MB space'}
            </div>
          </div>

          {/* Action Controls */}
          <div className="ayuswar-pwa-actions" aria-live="polite">
            <button
              onClick={handleInstallClick}
              disabled={installState === 'prompting' || installState === 'pending'}
              className={`ayuswar-pwa-install-btn ayuswar-pwa-btn-${installState}`}
              aria-label="Install AyuSwar AI application"
            >
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

              {installState === 'idle' && (
                <>
                  <Download size={13} strokeWidth={2.5} className="ayuswar-pwa-btn-icon" />
                  <span>Install</span>
                </>
              )}

              {installState === 'prompting' && (
                <>
                  <span className="ayuswar-pwa-pulse-dot" />
                  <span>Prompting...</span>
                </>
              )}

              {installState === 'pending' && (
                <>
                  <Loader2 size={13} className="ayuswar-pwa-spinner" />
                  <span>Installing...</span>
                </>
              )}

              {installState === 'installed' && (
                <>
                  <CheckCircle2 size={14} color="#059669" />
                  <span style={{ color: '#059669', fontWeight: 850 }}>Installed!</span>
                </>
              )}
            </button>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              aria-label="Dismiss installation banner"
              className="ayuswar-pwa-dismiss-btn"
              title="Dismiss for this session"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Interactive PWA Installation Instructions Modal */}
      {showGuideModal && (
        <div
          className="pwa-guide-overlay"
          onClick={() => setShowGuideModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 37, 64, 0.72)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 1400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div
            className="pwa-guide-card"
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FAF8F5',
              borderRadius: '22px',
              maxWidth: '480px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(10, 37, 64, 0.45)',
              border: '1.5px solid #D4AF37'
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0A2540 0%, #0F4C5C 100%)',
              padding: '22px 24px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src="/assets/ayuswar_emblem_mark.png"
                  alt="AyuSwar AI"
                  style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#FAF8F5', padding: '2px', border: '1.5px solid #D4AF37' }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>Install AyuSwar AI PWA</h3>
                  <div style={{ fontSize: '11.5px', color: '#D4AF37', fontWeight: 650, marginTop: '2px' }}>
                    ⚡ Instant 0MB Launch • Works Offline
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '20px', padding: '4px' }}
              >
                ✕
              </button>
            </div>

            {/* Device Tabs */}
            <div style={{ display: 'flex', background: '#F0ECE1', borderBottom: '1px solid #D1E1E6', padding: '4px 8px' }}>
              <button
                type="button"
                onClick={() => setDeviceTab('desktop')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 12px',
                  border: 'none',
                  borderRadius: '10px',
                  background: deviceTab === 'desktop' ? '#ffffff' : 'transparent',
                  color: deviceTab === 'desktop' ? '#0F4C5C' : '#64748B',
                  fontWeight: deviceTab === 'desktop' ? 750 : 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: deviceTab === 'desktop' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <Monitor size={14} />
                <span>Desktop (PC/Mac)</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceTab('android')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 12px',
                  border: 'none',
                  borderRadius: '10px',
                  background: deviceTab === 'android' ? '#ffffff' : 'transparent',
                  color: deviceTab === 'android' ? '#0F4C5C' : '#64748B',
                  fontWeight: deviceTab === 'android' ? 750 : 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: deviceTab === 'android' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <Smartphone size={14} />
                <span>Android</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceTab('ios')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 12px',
                  border: 'none',
                  borderRadius: '10px',
                  background: deviceTab === 'ios' ? '#ffffff' : 'transparent',
                  color: deviceTab === 'ios' ? '#0F4C5C' : '#64748B',
                  fontWeight: deviceTab === 'ios' ? 750 : 600,
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: deviceTab === 'ios' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                }}
              >
                <Apple size={14} />
                <span>iPhone / iPad</span>
              </button>
            </div>

            {/* Step-by-Step Instructions */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {deviceTab === 'desktop' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0F4C5C', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                      1
                    </div>
                    <div style={{ fontSize: '13px', color: '#081C24', lineHeight: 1.5 }}>
                      Look for the <strong>Install icon (⊕)</strong> on the right side of your Chrome/Edge address bar.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0F4C5C', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                      2
                    </div>
                    <div style={{ fontSize: '13px', color: '#081C24', lineHeight: 1.5 }}>
                      Alternatively, click the <strong>three dots menu (⋮)</strong> in your browser $\rightarrow$ <strong>Save and Share</strong> $\rightarrow$ <strong>"Install AyuSwar AI"</strong>.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0F4C5C', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                      3
                    </div>
                    <div style={{ fontSize: '13px', color: '#081C24', lineHeight: 1.5 }}>
                      Click <strong>Install</strong>. AyuSwar AI will launch as a standalone desktop application with its own window and taskbar icon!
                    </div>
                  </div>
                </div>
              )}

              {deviceTab === 'android' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0F4C5C', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                      1
                    </div>
                    <div style={{ fontSize: '13px', color: '#081C24', lineHeight: 1.5 }}>
                      Tap the <strong>three dots menu (⋮)</strong> in the top right corner of Chrome.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0F4C5C', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                      2
                    </div>
                    <div style={{ fontSize: '13px', color: '#081C24', lineHeight: 1.5 }}>
                      Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0F4C5C', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                      3
                    </div>
                    <div style={{ fontSize: '13px', color: '#081C24', lineHeight: 1.5 }}>
                      Confirm by tapping <strong>Install</strong>. An app icon will appear directly on your home screen for instantaneous 0ms access!
                    </div>
                  </div>
                </div>
              )}

              {deviceTab === 'ios' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0F4C5C', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                      1
                    </div>
                    <div style={{ fontSize: '13px', color: '#081C24', lineHeight: 1.5 }}>
                      Tap the <strong>Share button (⎋)</strong> at the bottom of Safari on your iPhone/iPad.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0F4C5C', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                      2
                    </div>
                    <div style={{ fontSize: '13px', color: '#081C24', lineHeight: 1.5 }}>
                      Scroll down the sharing menu and tap <strong>"Add to Home Screen" (+)</strong>.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#0F4C5C', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, flexShrink: 0 }}>
                      3
                    </div>
                    <div style={{ fontSize: '13px', color: '#081C24', lineHeight: 1.5 }}>
                      Tap <strong>Add</strong> in the top-right corner. AyuSwar AI will launch in full screen with zero Safari browser chrome!
                    </div>
                  </div>
                </div>
              )}

              {/* Offline Capability Status Banner */}
              <div style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '11.5px', color: '#065F46', lineHeight: 1.4 }}>
                  <strong>Service Worker & Cache Active:</strong> AyuSwar AI is fully offline-capable for rural PHC clinics and emergency 108 field operations.
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                style={{
                  background: '#0F4C5C',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '13.5px',
                  fontWeight: 750,
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '4px'
                }}
              >
                Got It, Thank You
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS for PWA Banner */}
      <style>{`
        .ayuswar-pwa-banner {
          position: fixed;
          bottom: 20px;
          left: 16px;
          right: 16px;
          max-width: 460px;
          margin: 0 auto;
          z-index: 1050;
          background: linear-gradient(135deg, rgba(10, 37, 64, 0.96) 0%, rgba(15, 76, 92, 0.96) 100%);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: 16px;
          padding: 10px 14px;
          box-shadow: 0 12px 36px rgba(10, 37, 64, 0.4);
          border: 1.5px solid rgba(212, 175, 55, 0.85);
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: slideUpPwa 0.32s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }

        .ayuswar-pwa-emblem {
          width: 38px;
          height: 38px;
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
          font-size: 13px;
          font-weight: 850;
          color: #ffffff;
          letter-spacing: -0.2px;
        }

        .ayuswar-pwa-badge {
          font-size: 8.5px;
          font-weight: 900;
          background: rgba(212, 175, 55, 0.25);
          color: #D4AF37;
          padding: 1px 6px;
          border-radius: 4px;
          border: 1px solid rgba(212, 175, 55, 0.4);
        }

        .ayuswar-pwa-subtitle {
          font-size: 11px;
          color: #D1E1E6;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ayuswar-pwa-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .ayuswar-pwa-install-btn {
          position: relative;
          overflow: hidden;
          min-height: 38px;
          padding: 6px 14px;
          border-radius: 10px;
          background: #D4AF37;
          color: #081C24;
          border: none;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: background-color 0.15s ease, transform 0.1s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        }

        .ayuswar-pwa-install-btn:hover {
          background: #E5C358;
          transform: translateY(-1px);
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

        .ayuswar-pwa-dismiss-btn {
          width: 32px;
          height: 32px;
          background: none;
          border: none;
          color: #D1E1E6;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: color 0.15s ease;
        }

        .ayuswar-pwa-dismiss-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        @keyframes slideUpPwa {
          from {
            transform: translateY(32px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes ayuswarSpin {
          to { transform: rotate(360deg); }
        }

        .ayuswar-pwa-spinner {
          animation: ayuswarSpin 1s linear infinite;
        }
      `}</style>
    </>
  );
}
