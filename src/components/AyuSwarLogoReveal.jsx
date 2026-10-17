import React, { useState, useEffect } from 'react';

/**
 * AyuSwarLogoReveal
 * Clean, prominent, high-visibility Brand Mark & Typography for AyuSwar AI.
 * 
 * Fixes resolved:
 * 1. Removed double concentric circles and crossed circle artifact.
 * 2. Scaled and clipped the inner emblem to 44px circle with overflow:hidden so 
 *    the gray square canvas is completely eliminated and only the silver-teal 
 *    clinical shield fills the badge.
 * 3. Elevated typography to bold 1.35rem with crisp amber-gold AI pill badge and 
 *    emerald acoustic pulse wave, ensuring 100% legibility at standard 100% desktop scale.
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
      {/* Crisp Circular Brand Emblem Badge */}
      <div style={{
        position: 'relative',
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#071F36',
        border: '2px solid #008B8B',
        boxShadow: '0 2px 12px rgba(0, 139, 139, 0.32)',
        flexShrink: 0,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease'
      }}>
        {/* Emblem Image cleanly zoomed by 1.18x to clip out square gray background */}
        <img
          src="/assets/ayuswar_master_emblem.png"
          alt="AyuSwar AI Emblem"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.18)',
            display: 'block',
            filter: 'contrast(1.1) brightness(1.05)'
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
              color: '#0F172A',
              letterSpacing: '-0.4px',
              display: 'flex',
              alignItems: 'baseline',
              gap: '1px'
            }}>
              Ayu<span style={{ color: '#008B8B' }}>Swar</span>
            </span>

            {/* Vibrant High-Contrast AI Badge */}
            <span style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 900,
              padding: '2px 7px',
              borderRadius: '6px',
              letterSpacing: '0.5px',
              boxShadow: '0 1px 4px rgba(217, 119, 6, 0.35)'
            }}>
              AI
            </span>

            {/* Smooth Emerald Acoustic Waveform Indicator */}
            <div style={{ width: '38px', height: '16px', display: 'flex', alignItems: 'center' }}>
              <svg
                key={animationKey}
                viewBox="0 0 38 16"
                style={{ width: '100%', height: '100%', overflow: 'visible' }}
              >
                <path
                  d="M 1 8 L 6 8 L 11 2 L 16 14 L 21 4 L 26 8 L 37 8"
                  fill="none"
                  stroke="#10B981"
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
