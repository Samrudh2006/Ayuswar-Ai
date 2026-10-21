import React from 'react';

/**
 * Concept #21: Deepam Heartbeat (ఆయుర్దీపం)
 * Official Emblem for AyuSwar AI
 * 
 * Features the official high-resolution artwork:
 * - Terracotta & Brass Diya Bowl with Golden Lotus motif
 * - Sacred Living Healing Flame
 * - Direct ECG Sinus Heartbeat Pulse Wave with terminal node
 * - Concentric Golden Acoustic Soundwave Resonance Rings
 */
export default function DeepamHeartbeatEmblem({
  size = 54,
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
        borderRadius: '50%',
        background: '#FAF8F5',
        border: '2px solid #D4AF37',
        boxShadow: '0 4px 14px rgba(15, 76, 92, 0.22)',
        overflow: 'hidden',
        padding: '3px',
        ...style
      }}
      title="AyuSwar AI — Concept #21 Deepam Heartbeat"
    >
      <img
        src="/assets/ayuswar_emblem_mark.png"
        alt="AyuSwar AI Official Emblem"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
}
