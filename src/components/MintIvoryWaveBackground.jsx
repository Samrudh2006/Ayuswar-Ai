import React from 'react';

/**
 * MintIvoryWaveBackground — Pristine Mint-Cream Canvas with Sweeping Vector Wave Ribbons
 * Features organic translucent teal/cyan waves, dotted matrix grids, and soft botanical accents.
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
        background: 'linear-gradient(145deg, #F9FBFA 0%, #F0F8F6 45%, #E6F5F2 100%)',
        transition: 'background 0.3s ease'
      }}
      aria-hidden="true"
    >
      {/* Sweeping Vector Wave Ribbons SVG */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          overflow: 'visible'
        }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#0D9488" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0F4C5C" stopOpacity="0.04" />
          </linearGradient>

          <linearGradient id="waveGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#14B8A6" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#A7F3D0" stopOpacity="0.06" />
          </linearGradient>

          <linearGradient id="waveGrad3" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.24" />
            <stop offset="50%" stopColor="#99F6E4" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>

          {/* Dot Matrix Pattern */}
          <pattern id="dotGridMint" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#0D9488" fillOpacity="0.18" />
          </pattern>
        </defs>

        {/* Top-Left Wave Swoop 1 */}
        <path
          d="M -100, -50 C 200, 80 180, 240 -80, 360 C -180, 420 -60, 180 -100, -50 Z"
          fill="url(#waveGrad1)"
        />

        {/* Top-Left Wave Swoop 2 (Translucent overlay) */}
        <path
          d="M -50, -80 C 320, 40 260, 280 -40, 440 C -120, 320 80, 120 -50, -80 Z"
          fill="url(#waveGrad2)"
        />

        {/* Bottom Sweeping Wave Ribbon 1 */}
        <path
          d="M -100, 720 C 300, 880 750, 720 1200, 860 C 1350, 910 1550, 840 1600, 950 L 1600, 1050 L -100, 1050 Z"
          fill="url(#waveGrad2)"
        />

        {/* Bottom Sweeping Wave Ribbon 2 (Higher crest on left) */}
        <path
          d="M -80, 820 C 220, 680 580, 820 980, 780 C 1240, 750 1480, 850 1560, 890 L 1560, 1050 L -80, 1050 Z"
          fill="url(#waveGrad1)"
        />

        {/* Bottom Sweeping Wave Ribbon 3 (Soft Aqua Accent) */}
        <path
          d="M -120, 890 C 180, 780 440, 860 820, 840 C 1120, 820 1380, 920 1500, 960 L 1500, 1050 L -120, 1050 Z"
          fill="url(#waveGrad3)"
        />

        {/* Upper-Middle Dot Matrix Grid */}
        <rect x="420" y="40" width="160" height="64" fill="url(#dotGridMint)" opacity="0.65" />

        {/* Bottom-Right Dot Matrix Grid */}
        <rect x="1260" y="740" width="144" height="96" fill="url(#dotGridMint)" opacity="0.75" />

        {/* Bottom-Left Dot Matrix Grid */}
        <rect x="40" y="780" width="128" height="80" fill="url(#dotGridMint)" opacity="0.6" />

        {/* Subtle Decorative Clinical Crosses (+) */}
        <g opacity="0.22" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round">
          <line x1="1050" y1="120" x2="1050" y2="134" />
          <line x1="1043" y1="127" x2="1057" y2="127" />

          <line x1="1340" y1="320" x2="1340" y2="334" />
          <line x1="1333" y1="327" x2="1347" y2="327" />

          <line x1="160" y1="620" x2="160" y2="634" />
          <line x1="153" y1="627" x2="167" y2="627" />
        </g>
      </svg>

      {/* Subtle Botanical Leaf Accent in Bottom-Left */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '20px',
          opacity: 0.45,
          transform: 'rotate(-20deg)',
          pointerEvents: 'none'
        }}
      >
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
          <path
            d="M 20,80 Q 40,40 80,20 Q 70,60 20,80 Z"
            fill="#10B981"
            fillOpacity="0.4"
            stroke="#059669"
            strokeWidth="1.5"
          />
          <path
            d="M 20,80 Q 50,50 80,20"
            stroke="#047857"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 40,60 Q 55,55 60,45"
            stroke="#047857"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
