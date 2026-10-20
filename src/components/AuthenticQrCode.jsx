import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/**
 * AuthenticQrCode — ISO 18004 Compliant Real Scannable 2D QR Matrix Component
 * 
 * Automatically generates a genuine, scannable QR code using Reed-Solomon error correction.
 * Can be scanned by any smartphone camera (iOS Camera app, Google Lens, QR scanner apps).
 * 
 * Features:
 * - Real vector SVG rendering for razor-sharp display at any DPI.
 * - Optional central micro-emblem with safe quiet zone margin.
 * - Automatic payload generation if value is empty.
 * - Zero external API dependencies (runs 100% client-side in microseconds).
 */
export default function AuthenticQrCode({
  value = 'https://ayuswar-ai.vercel.app',
  size = 110,
  level = 'M', // 'L' (7%), 'M' (15%), 'Q' (25%), 'H' (30%)
  fgColor = '#0A2540',
  bgColor = '#FFFFFF',
  isDoctor = false,
  showCenterBadge = true,
  className = '',
  style = {}
}) {
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Ensure valid string payload
    const safePayload = String(value || '').trim() || 'https://ayuswar-ai.vercel.app';

    QRCode.toString(safePayload, {
      type: 'svg',
      errorCorrectionLevel: level,
      margin: 1,
      color: {
        dark: fgColor,
        light: bgColor
      }
    })
      .then(svg => {
        if (isMounted) {
          // Clean the raw SVG wrapper to be embeddable cleanly
          setSvgContent(svg);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('[AuthenticQrCode] Failed to generate QR SVG:', err);
          setError(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [value, level, fgColor, bgColor]);

  const badgeSize = Math.max(16, Math.floor(size * 0.22));

  return (
    <div 
      className={`authentic-qr-container ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: bgColor,
        padding: '4px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        userSelect: 'none',
        ...style
      }}
      title={`Scannable QR: ${value}`}
    >
      {svgContent ? (
        <div
          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: `${size - 16}px`,
            height: `${size - 16}px`,
            borderRadius: '6px',
            background: '#F1F5F9',
            animation: 'pulse 1.5s infinite'
          }} />
        </div>
      )}

      {/* Optional Central Emblem Anchor (Shield / Cross) */}
      {showCenterBadge && svgContent && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${badgeSize}px`,
            height: `${badgeSize}px`,
            borderRadius: '50%',
            background: isDoctor ? '#0A2540' : '#008B8B',
            color: '#ffffff',
            border: '2px solid #ffffff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${Math.max(8, Math.floor(badgeSize * 0.45))}px`,
            fontWeight: 800,
            pointerEvents: 'none'
          }}
        >
          {isDoctor ? '🩺' : '🇮🇳'}
        </div>
      )}
    </div>
  );
}
