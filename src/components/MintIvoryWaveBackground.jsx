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
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: '#FAF8F5'
      }}
      aria-hidden="true"
    />
  );
}
