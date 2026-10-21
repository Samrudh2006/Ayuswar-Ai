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
      bottom: '16px',
      left: '16px',
      right: '16px',
      maxWidth: '620px',
      margin: '0 auto',
      background: '#0F172A',
      color: '#F8FAFC',
      padding: '14px 20px',
      borderRadius: '16px',
      boxShadow: '0 12px 35px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 300px' }}>
        <ShieldCheck size={22} color="#D4AF37" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: '#CBD5E1' }}>
          <span>AyuSwar AI uses local storage strictly for language preferences and ephemeral clinical sessions in compliance with India's <strong>DPDP Act 2023</strong>. Zero third-party ad tracking.</span>{' '}
          <Link to="/privacy" style={{ color: '#D4AF37', textDecoration: 'underline', fontWeight: 600 }}>
            Privacy Policy
          </Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={handleAccept}
          style={{
            padding: '7px 16px',
            borderRadius: '10px',
            background: '#0F4C5C',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(15, 76, 92, 0.4)'
          }}
        >
          Got It
        </button>

        <button
          onClick={handleAccept}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Close banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
