import React from 'react';

/**
 * Global Safety-Critical ErrorBoundary for AyuSwar AI
 * Prevents any white screens and displays an immediate Emergency Fallback Banner
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AyuSwar Runtime Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#061626',
          color: '#ffffff',
          padding: '24px',
          fontFamily: 'Outfit, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
            background: 'rgba(255,255,255,0.06)',
            padding: '36px 28px',
            borderRadius: '20px',
            border: '1.5px solid rgba(239, 68, 68, 0.4)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>🚨</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 12px 0', color: '#FCA5A5' }}>
              Something failed.
            </h2>
            <div style={{
              background: 'rgba(239, 68, 68, 0.25)',
              border: '1.5px solid #EF4444',
              borderRadius: '12px',
              padding: '14px 20px',
              marginBottom: '20px',
              fontSize: '18px',
              fontWeight: 850,
              color: '#FEE2E2',
              letterSpacing: '0.3px'
            }}>
              Emergency? Dial 112 / 108
            </div>
            <p style={{ fontSize: '13.5px', color: '#CBD5E1', marginBottom: '24px', lineHeight: 1.5 }}>
              A client runtime component encountered an issue. Emergency healthcare services operate fail-safe offline protocols.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: '#008B8B',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '11px 22px',
                  fontSize: '13px',
                  fontWeight: 750,
                  cursor: 'pointer',
                  minHeight: '44px'
                }}
              >
                Reload Application
              </button>
              <button
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    window.location.href = '/';
                  }
                }}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '10px',
                  padding: '11px 22px',
                  fontSize: '13px',
                  fontWeight: 750,
                  cursor: 'pointer',
                  minHeight: '44px'
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
