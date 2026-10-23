import React from 'react';

/**
 * MintIvoryWaveBackground — Signature AyuSwar Pure Ambient Medical Canvas
 * 
 * Provides an ultra-clean, serene, clinical-grade ambient background.
 * Uses a warm-ivory (#FAF9F6) base with soft, diffused pastel mint, warm ivory,
 * and gentle sage ambient lighting.
 * 
 * Completely glare-free, zero harsh borders or color bands, and 100% readable.
 */
export default function MintIvoryWaveBackground() {
  return (
    <div
      className="mint-ivory-wave-background"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#FAF9F6',
        backgroundImage: `
          radial-gradient(ellipse at 85% 10%, rgba(204, 251, 241, 0.4) 0%, transparent 55%),
          radial-gradient(ellipse at 15% 15%, rgba(254, 249, 231, 0.45) 0%, transparent 45%),
          radial-gradient(ellipse at 10% 85%, rgba(236, 253, 245, 0.4) 0%, transparent 50%),
          radial-gradient(ellipse at 90% 90%, rgba(240, 253, 250, 0.35) 0%, transparent 50%)
        `,
        backgroundAttachment: 'fixed',
        transition: 'background 0.3s ease'
      }}
      aria-hidden="true"
    />
  );
}
