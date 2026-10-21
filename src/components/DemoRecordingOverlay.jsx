import React, { useState, useEffect } from 'react';

/**
 * DemoRecordingOverlay Component
 * Activates ONLY when ?demo-record=1 is provided in URL (persisted in sessionStorage)
 * Deactivates with ?demo-record=0
 * When OFF: 0 DOM nodes, zero visual or behavioral change.
 * When ON: Soft colored mouse cursor highlight ring (38px) + click ripple animations (~0.5s)
 * Dev chrome is hidden; honest badges (Sample data, DEMO-, SIMULATION, PLANNED) remain visible.
 */
export default function DemoRecordingOverlay() {
  const [isActive, setIsActive] = useState(false);
  const [coords, setCoords] = useState({ x: -100, y: -100 });
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check URL query parameters
    const params = new URLSearchParams(window.location.search);
    const paramVal = params.get('demo-record');

    if (paramVal === '1') {
      sessionStorage.setItem('demo_record_mode', '1');
      setIsActive(true);
    } else if (paramVal === '0') {
      sessionStorage.setItem('demo_record_mode', '0');
      setIsActive(false);
    } else {
      const stored = sessionStorage.getItem('demo_record_mode');
      if (stored === '1') {
        setIsActive(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      document.body.classList.remove('demo-record-mode-active');
      return;
    }

    document.body.classList.add('demo-record-mode-active');

    // Track cursor coordinates
    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    // Capture-phase click listener for ripples
    const handleClick = (e) => {
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 550);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { capture: true, passive: true });

    return () => {
      document.body.classList.remove('demo-record-mode-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick, { capture: true });
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      id="demo-recording-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999999,
        overflow: 'hidden'
      }}
    >
      {/* Soft Colored Cursor Ring (38px) */}
      <div
        style={{
          position: 'fixed',
          left: coords.x - 19,
          top: coords.y - 19,
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'rgba(212, 175, 55, 0.16)',
          border: '2px solid rgba(212, 175, 55, 0.85)',
          boxShadow: '0 0 14px rgba(212, 175, 55, 0.5), inset 0 0 8px rgba(212, 175, 55, 0.25)',
          pointerEvents: 'none',
          transform: 'translate3d(0, 0, 0)',
          transition: 'transform 0.04s ease-out',
          willChange: 'left, top'
        }}
      />

      {/* Click Ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: 'fixed',
            left: ripple.x - 22,
            top: ripple.y - 22,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '2.5px solid #D4AF37',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.35) 0%, transparent 70%)',
            pointerEvents: 'none',
            animation: 'demoClickRipple 0.5s cubic-bezier(0.1, 0.7, 0.1, 1) forwards'
          }}
        />
      ))}

      {/* Pure CSS Animation Style tag for ripple effect */}
      <style>{`
        @keyframes demoClickRipple {
          0% {
            transform: scale(0.3);
            opacity: 0.95;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        body.demo-record-mode-active vite-error-overlay,
        body.demo-record-mode-active [data-vite-dev-overlay],
        body.demo-record-mode-active #vite-dev-overlay,
        body.demo-record-mode-active .dev-badge,
        body.demo-record-mode-active .__debug {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
