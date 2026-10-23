import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieConsentBanner() {
  const [hasDismissed, setHasDismissed] = useState(true);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('ayuswar_cookie_consent');
      if (!consent) {
        setHasDismissed(false);
      }
    } catch {
      setHasDismissed(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('ayuswar_cookie_consent', 'accepted_' + Date.now());
    } catch {}
    setHasDismissed(true);
  };

  if (hasDismissed) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      right: '10px',
      maxWidth: '540px',
      margin: '0 auto',
      background: 'rgba(15, 23, 42, 0.96)',
      backdropFilter: 'blur(10px)',
      color: '#F8FAFC',
      padding: '8px 14px',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.12)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
        <ShieldCheck size={18} color="#D4AF37" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '11px', lineHeight: 1.35, color: '#CBD5E1', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span>DPDP Act 2023 compliant: Local storage used for language & sessions. Zero ad tracking.</span>{' '}
          <Link to="/privacy" style={{ color: '#D4AF37', textDecoration: 'underline', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Privacy
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <button
          onClick={handleAccept}
          style={{
            padding: '5px 12px',
            borderRadius: '8px',
            background: '#0F4C5C',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(15, 76, 92, 0.3)',
            whiteSpace: 'nowrap'
          }}
        >
          Got it
        </button>

        <button
          onClick={handleAccept}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center'
          }}
          aria-label="Close banner"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
