import React from 'react';

/**
 * Concept #21: Deepam Heartbeat (ఆయుర్దీపం)
 * Highest rated logo concept (38/40) for AyuSwar AI
 * 
 * Symbolism:
 * - Traditional Indian terracotta/brass Diya (Lamp of Life & Ayu)
 * - Eternal golden healing flame (#D4AF37)
 * - Clinical sinuous ECG heartbeat pulse (#D64550)
 * - Concentric acoustic resonance ripples (#0F4C5C)
 * - Deep midnight petrol background disc (#081C24)
 */
export default function DeepamHeartbeatEmblem({
  size = 40,
  animated = true,
  className = '',
  style = {}
}) {
  return (
    <div
      className={`deepam-heartbeat-emblem ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        ...style
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Diya Golden Life Flame Gradient */}
          <linearGradient id="deepamFlameGradLive" x1="32" y1="12" x2="32" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="80%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Diya Silk Petrol Teal Bowl Gradient */}
          <linearGradient id="diyaBowlGradLive" x1="16" y1="36" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#176579" />
            <stop offset="50%" stopColor="#0F4C5C" />
            <stop offset="100%" stopColor="#08232C" />
          </linearGradient>

          {/* Gold Metallic Rim Gradient */}
          <linearGradient id="goldRimGradLive" x1="16" y1="36" x2="48" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>

          {/* Ruby Heartbeat Glow Filter */}
          <filter id="rubyGlowLive" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#D64550" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Circular Midnight Petrol Backdrop with Zari Gold Metallic Rim */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="#081C24"
          stroke="#D4AF37"
          strokeWidth="2"
          style={{
            filter: 'drop-shadow(0 2px 10px rgba(212, 175, 55, 0.3))'
          }}
        />

        {/* Acoustic Resonance Rings (Left) */}
        <path
          d="M 12 22 A 16 16 0 0 0 12 42"
          stroke="#0F4C5C"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 16 26 A 10 10 0 0 0 16 38"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* Acoustic Resonance Rings (Right) */}
        <path
          d="M 48 26 A 10 10 0 0 1 48 38"
          stroke="#D4AF37"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.95"
        />
        <path
          d="M 52 22 A 16 16 0 0 1 52 42"
          stroke="#0F4C5C"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Diya Sacred Flame (Lamp of Life) */}
        <path
          d="M 32 13 C 37 20 42 25 39 33 C 36 38 28 38 25 33 C 22 25 27 20 32 13 Z"
          fill="url(#deepamFlameGradLive)"
          style={{
            transformOrigin: '32px 35px',
            animation: animated ? 'flameBreath 3s ease-in-out infinite' : 'none'
          }}
        />
        <ellipse cx="32" cy="27" rx="3.5" ry="6" fill="#FFFBEB" opacity="0.85" />

        {/* Diya Base (The Vessel / Ayu) */}
        <path d="M 17 37 C 17 47 47 47 47 37 C 44 41 20 41 17 37 Z" fill="url(#diyaBowlGradLive)" />
        <ellipse cx="32" cy="37" rx="15" ry="2.2" fill="url(#goldRimGradLive)" />
        {/* Lotus Foot of the Diya */}
        <path d="M 28 45 C 30 47 34 47 36 45 Z" fill="#D4AF37" />

        {/* Living Heartbeat Pulse Line (Ruby Alert ECG) */}
        <path
          d="M 18 32 L 23 32 L 25 36 L 29 16 L 33 42 L 36 26 L 39 32 L 46 32"
          stroke="#D64550"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#rubyGlowLive)"
          style={{
            strokeDasharray: 60,
            strokeDashoffset: 0,
            animation: animated ? 'ecgPulseStroke 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite' : 'none'
          }}
        />
      </svg>
    </div>
  );
}
