import React from 'react';

/**
 * BotanicalWatermark — Subtle Indian Medicinal Leaf & Tulsi Branch Line-Art
 * Provides gentle, elegant wellness identity across portals without visual clutter.
 */
export default function BotanicalWatermark({ 
  opacity = 0.08, 
  size = 180, 
  color = '#0F4C5C',
  style = {} 
}) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        opacity: opacity,
        zIndex: 0,
        ...style
      }}
      aria-hidden="true"
    >
      {/* Delicate Tulsi & Neem branch curve */}
      <path 
        d="M20 180 C50 140, 80 120, 160 40" 
        stroke={color} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
      {/* Leaf pair 1 */}
      <path 
        d="M60 135 C65 110, 95 105, 100 125 C85 135, 70 140, 60 135 Z" 
        stroke={color} 
        strokeWidth="1.8" 
        fill={color} 
        fillOpacity="0.08" 
      />
      <path 
        d="M75 140 C55 130, 50 100, 70 95 C80 110, 85 125, 75 140 Z" 
        stroke={color} 
        strokeWidth="1.8" 
        fill={color} 
        fillOpacity="0.08" 
      />
      {/* Leaf pair 2 */}
      <path 
        d="M105 100 C115 75, 145 75, 145 95 C130 105, 115 105, 105 100 Z" 
        stroke={color} 
        strokeWidth="1.8" 
        fill={color} 
        fillOpacity="0.08" 
      />
      <path 
        d="M115 105 C95 95, 95 65, 115 65 C125 80, 125 95, 115 105 Z" 
        stroke={color} 
        strokeWidth="1.8" 
        fill={color} 
        fillOpacity="0.08" 
      />
      {/* Terminal Bud & Leaf 3 */}
      <path 
        d="M145 60 C155 35, 185 40, 180 60 C165 70, 150 68, 145 60 Z" 
        stroke={color} 
        strokeWidth="1.8" 
        fill={color} 
        fillOpacity="0.08" 
      />
      <circle cx="165" cy="35" r="4" fill={color} fillOpacity="0.3" />
    </svg>
  );
}
