import React from 'react';

/**
 * MintIvoryWaveBackground — Signature AyuSwar Mint-Ivory Vector Wave Canvas
 * Features multi-layered sweeping organic wave ribbons, acoustic sine wave pulses,
 * ambient luminous glow meshes, dot matrices, and subtle Ayurvedic botanical motifs.
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
        background: 'linear-gradient(135deg, #F3FAF7 0%, #E8F6F2 35%, #F7FCFA 70%, #E4F4EE 100%)',
        transition: 'background 0.3s ease'
      }}
      aria-hidden="true"
    >
      {/* Ambient Luminous Mesh Gradient Orbs */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          top: '-150px',
          right: '-100px',
          background: 'radial-gradient(circle, rgba(45, 212, 191, 0.28) 0%, rgba(45, 212, 191, 0.08) 45%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          top: '35%',
          left: '-120px',
          background: 'radial-gradient(circle, rgba(0, 245, 212, 0.22) 0%, rgba(13, 148, 136, 0.08) 50%, transparent 70%)',
          filter: 'blur(45px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          bottom: '-120px',
          right: '15%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(212, 175, 55, 0.10) 40%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />

      {/* Sweeping Vector Wave Ribbons & Technical Canvas */}
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
          {/* Wave Gradient 1: Vibrant Teal to Deep Silk Petrol */}
          <linearGradient id="mintGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.32" />
            <stop offset="50%" stopColor="#0D9488" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#0F4C5C" stopOpacity="0.08" />
          </linearGradient>

          {/* Wave Gradient 2: Bright Mint/Cyan to Seafoam */}
          <linearGradient id="mintGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F5D4" stopOpacity="0.38" />
            <stop offset="55%" stopColor="#14B8A6" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.10" />
          </linearGradient>

          {/* Wave Gradient 3: Soft Emerald to Translucent */}
          <linearGradient id="mintGrad3" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.30" />
            <stop offset="50%" stopColor="#A7F3D0" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>

          {/* Soundwave Pulse Gradient */}
          <linearGradient id="pulseAyuGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F4C5C" stopOpacity="0.0" />
            <stop offset="25%" stopColor="#0D9488" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#00F5D4" stopOpacity="0.55" />
            <stop offset="75%" stopColor="#10B981" stopOpacity="0.40" />
            <stop offset="100%" stopColor="#0F4C5C" stopOpacity="0.0" />
          </linearGradient>

          {/* Crisp Dot Matrix Pattern */}
          <pattern id="dotGridMint" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill="#0D9488" fillOpacity="0.25" />
          </pattern>

          {/* Isometric Cross Hatch Pattern */}
          <pattern id="isoCrossGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 0,20 L 40,20 M 20,0 L 20,40" stroke="#0F4C5C" strokeWidth="0.75" strokeOpacity="0.08" />
          </pattern>
        </defs>

        {/* ================= TOP WAVE RIBBONS ================= */}
        {/* Top-Left Wave Swoop 1 */}
        <path
          d="M -120, -60 C 260, 90 220, 280 -60, 420 C -180, 480 -60, 200 -120, -60 Z"
          fill="url(#mintGrad1)"
        />

        {/* Top-Left Wave Swoop 2 (Translucent overlay) */}
        <path
          d="M -60, -90 C 380, 50 320, 320 -20, 510 C -110, 360 110, 140 -60, -90 Z"
          fill="url(#mintGrad2)"
        />

        {/* Top-Right Graceful Arc */}
        <path
          d="M 1120, -80 C 1240, 160 1480, 120 1560, 320 L 1560, -80 Z"
          fill="url(#mintGrad3)"
        />

        {/* ================= MID-CANVAS FLOWING WAVES ================= */}
        {/* Mid-Canvas Sweeping Crest (gives depth behind widgets & cards) */}
        <path
          d="M -100, 380 C 280, 490 620, 310 960, 440 C 1220, 530 1400, 420 1550, 480 L 1550, 560 C 1380, 500 1200, 600 940, 520 C 600, 390 260, 560 -100, 450 Z"
          fill="url(#mintGrad2)"
          opacity="0.65"
        />

        {/* ================= BOTTOM SWEEPING WAVE RIBBONS ================= */}
        {/* Bottom Sweeping Wave Ribbon 1 */}
        <path
          d="M -100, 680 C 320, 840 760, 670 1180, 810 C 1340, 860 1520, 800 1600, 910 L 1600, 1050 L -100, 1050 Z"
          fill="url(#mintGrad2)"
        />

        {/* Bottom Sweeping Wave Ribbon 2 (Higher crest on left) */}
        <path
          d="M -80, 770 C 240, 630 600, 770 990, 730 C 1250, 700 1470, 800 1560, 850 L 1560, 1050 L -80, 1050 Z"
          fill="url(#mintGrad1)"
        />

        {/* Bottom Sweeping Wave Ribbon 3 (Soft Aqua Accent) */}
        <path
          d="M -120, 840 C 200, 740 460, 820 840, 800 C 1140, 780 1370, 880 1500, 920 L 1500, 1050 L -120, 1050 Z"
          fill="url(#mintGrad3)"
        />

        {/* ================= AYUSWAR ACOUSTIC SINE / SOUND PULSE ================= */}
        {/* Acoustic Soundwave Line sweeping across mid-screen */}
        <path
          d="M 60, 290 Q 180, 270 280, 290 T 480, 290 Q 540, 240 570, 340 T 630, 290 Q 720, 290 820, 280 T 1020, 290 Q 1120, 310 1240, 285 T 1420, 290"
          fill="none"
          stroke="url(#pulseAyuGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Secondary Acoustic Echo Pulse */}
        <path
          d="M 200, 610 Q 320, 590 420, 610 T 620, 610 Q 670, 570 700, 650 T 750, 610 Q 840, 610 940, 600 T 1140, 610 T 1360, 610"
          fill="none"
          stroke="url(#pulseAyuGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* ================= ACOUSTIC RADIAL RIPPLES ================= */}
        <g stroke="#0D9488" strokeWidth="1" fill="none" opacity="0.20">
          <circle cx="1280" cy="220" r="45" strokeDasharray="3 4" />
          <circle cx="1280" cy="220" r="85" strokeDasharray="4 6" />
          <circle cx="1280" cy="220" r="130" strokeDasharray="6 8" />
        </g>

        {/* ================= TECHNICAL DOT MATRICES & ISOMETRIC GRIDS ================= */}
        {/* Upper-Center Dot Matrix Grid */}
        <rect x="440" y="30" width="180" height="70" fill="url(#dotGridMint)" opacity="0.80" />

        {/* Mid-Right Tech Grid */}
        <rect x="1220" y="420" width="160" height="100" fill="url(#isoCrossGrid)" />

        {/* Bottom-Right Dot Matrix Grid */}
        <rect x="1240" y="700" width="160" height="100" fill="url(#dotGridMint)" opacity="0.85" />

        {/* Bottom-Left Dot Matrix Grid */}
        <rect x="50" y="740" width="140" height="90" fill="url(#dotGridMint)" opacity="0.75" />

        {/* Mid-Left Dot Matrix Accent */}
        <rect x="30" y="240" width="80" height="90" fill="url(#dotGridMint)" opacity="0.65" />

        {/* ================= CLINICAL CROSS & STAR MARKERS ================= */}
        <g opacity="0.32" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round">
          {/* Top-Right Crosses */}
          <line x1="1060" y1="110" x2="1060" y2="126" />
          <line x1="1052" y1="118" x2="1068" y2="118" />

          <line x1="1360" y1="280" x2="1360" y2="296" />
          <line x1="1352" y1="288" x2="1368" y2="288" />

          {/* Mid Crosses */}
          <line x1="180" y1="520" x2="180" y2="536" />
          <line x1="172" y1="528" x2="188" y2="528" />

          <line x1="780" y1="160" x2="780" y2="176" />
          <line x1="772" y1="168" x2="788" y2="168" />

          {/* Bottom Crosses */}
          <line x1="680" y1="780" x2="680" y2="796" />
          <line x1="672" y1="788" x2="688" y2="788" />
        </g>
      </svg>

      {/* Ayurvedic Botanical Motif 1: Bottom-Left Flourish */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '20px',
          opacity: 0.60,
          transform: 'rotate(-20deg)',
          pointerEvents: 'none'
        }}
      >
        <svg width="76" height="76" viewBox="0 0 100 100" fill="none">
          <path
            d="M 20,80 Q 40,40 80,20 Q 70,60 20,80 Z"
            fill="#10B981"
            fillOpacity="0.45"
            stroke="#059669"
            strokeWidth="1.6"
          />
          <path
            d="M 20,80 Q 50,50 80,20"
            stroke="#047857"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M 40,60 Q 55,55 60,45"
            stroke="#047857"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M 50,45 Q 65,40 70,32"
            stroke="#047857"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Ayurvedic Botanical Motif 2: Top-Right Flourish */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '40px',
          opacity: 0.50,
          transform: 'rotate(155deg)',
          pointerEvents: 'none'
        }}
      >
        <svg width="68" height="68" viewBox="0 0 100 100" fill="none">
          <path
            d="M 20,80 Q 40,40 80,20 Q 70,60 20,80 Z"
            fill="#2DD4BF"
            fillOpacity="0.38"
            stroke="#0D9488"
            strokeWidth="1.5"
          />
          <path
            d="M 20,80 Q 50,50 80,20"
            stroke="#0F4C5C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 40,60 Q 55,55 60,45"
            stroke="#0F4C5C"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
