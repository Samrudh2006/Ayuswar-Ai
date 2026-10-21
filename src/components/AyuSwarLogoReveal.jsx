import React, { useState, useEffect } from 'react';
import DeepamHeartbeatEmblem from './DeepamHeartbeatEmblem';

/**
 * AyuSwarLogoReveal
 * Clean, prominent, high-visibility Brand Mark & Typography for AyuSwar AI.
 * Powered by Concept #21 "Deepam Heartbeat" (Score 38/40 — Highest Overall in Logo Evaluation):
 * "A diya flame becomes a coral heartbeat pulse line, ringed by sound —
 * the lamp of life on the pulse of life."
 */
export default function AyuSwarLogoReveal({
  variant = 'navbar', // 'navbar' | 'hero' | 'standalone'
  showText = true,
  onComplete
}) {
  const [animationKey, setAnimationKey] = useState(0);
  const [isDrawn, setIsDrawn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDrawn(true);
      if (onComplete) onComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, [animationKey]);

  const handleReplay = () => {
    setIsDrawn(false);
    setAnimationKey(prev => prev + 1);
  };

  // If invoked with variant='hero', return null (hero has been cleaned up as requested)
  if (variant === 'hero') {
    return null;
  }

  return (
    <div
      onMouseEnter={handleReplay}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        userSelect: 'none'
      }}
      title="AyuSwar AI — Ambient Clinical Voice OS"
    >
      {/* Official Concept #21: Deepam Heartbeat Master Emblem */}
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(15, 76, 92, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAF8F5',
        border: '1.5px solid #D4AF37',
        flexShrink: 0
      }}>
        <img
          src="/assets/ayuswar_master_emblem.png"
          alt="AyuSwar AI Official Emblem"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 14%',
            transform: 'scale(1.42)'
          }}
        />
      </div>

      {/* Brand Typography & Pulse Line */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#091E26',
              letterSpacing: '-0.4px',
              display: 'flex',
              alignItems: 'baseline',
              gap: '1px'
            }}>
              Ayu<span style={{ color: '#0F4C5C' }}>Swar</span>
            </span>

            {/* Zari Gold High-Contrast AI Badge */}
            <span style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #BA9425 100%)',
              color: '#08232C',
              fontSize: '0.78rem',
              fontWeight: 900,
              padding: '2px 7px',
              borderRadius: '6px',
              letterSpacing: '0.5px',
              border: '1px solid #E8D595',
              boxShadow: '0 1px 4px rgba(212, 175, 55, 0.35)'
            }}>
              AI
            </span>

            {/* Zari Gold Frequency Waveform Indicator */}
            <div style={{ width: '38px', height: '16px', display: 'flex', alignItems: 'center' }}>
              <svg
                key={animationKey}
                viewBox="0 0 38 16"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
              >
                <path
                  d="M 1 8 L 6 8 L 11 2 L 16 14 L 21 4 L 26 8 L 37 8"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 50,
                    strokeDashoffset: isDrawn ? 0 : 50,
                    animation: 'ayuswarPulseDraw 1s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                  }}
                />
              </svg>
            </div>
          </div>

          <div style={{
            fontSize: '0.68rem',
            fontWeight: 700,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginTop: '2px'
          }}>
            Clinical Voice OS
          </div>
        </div>
      )}

      {/* Component Styles */}
      <style>{`
        @keyframes ayuswarPulseDraw {
          0% { stroke-dashoffset: 50; opacity: 0.2; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
