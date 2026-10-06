import React, { useRef, useEffect, useState } from 'react';
import { playHapticTap } from '../utils/haptics';

/**
 * AyuSwar AI — iOS Fluid Segmented Control
 * Sliding glass pill physics with spring interpolation, tactile feedback, and badges.
 */
export default function IosSegmentedControl({
  segments = [],
  activeId,
  onChange,
  variant = 'light', // 'light' | 'glass' | 'dark'
  size = 'md' // 'sm' | 'md' | 'lg'
}) {
  const containerRef = useRef(null);
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const activeIndex = segments.findIndex(s => s.id === activeId);
    if (activeIndex === -1) return;

    const buttons = containerRef.current.querySelectorAll('.ios-segment-button');
    const activeButton = buttons[activeIndex];

    if (activeButton) {
      setPillStyle({
        width: activeButton.offsetWidth,
        left: activeButton.offsetLeft
      });
    }
  }, [activeId, segments]);

  const paddingVal = size === 'sm' ? '3px' : size === 'lg' ? '6px' : '4px';
  const fontSize = size === 'sm' ? '12px' : size === 'lg' ? '14.5px' : '13px';
  const itemPadding = size === 'sm' ? '5px 12px' : size === 'lg' ? '9px 18px' : '7px 14px';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        background: variant === 'dark' 
          ? 'rgba(15, 23, 42, 0.75)' 
          : variant === 'glass'
          ? 'rgba(241, 245, 249, 0.7)'
          : '#E2E8F0',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '14px',
        padding: paddingVal,
        border: variant === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(203, 213, 225, 0.6)',
        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.06)',
        userSelect: 'none'
      }}
    >
      {/* Sliding Active Pill */}
      <div
        style={{
          position: 'absolute',
          top: paddingVal,
          bottom: paddingVal,
          left: `${pillStyle.left}px`,
          width: `${pillStyle.width}px`,
          background: variant === 'dark'
            ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
            : '#FFFFFF',
          borderRadius: '11px',
          boxShadow: variant === 'dark'
            ? '0 3px 8px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            : '0 3px 8px rgba(10, 37, 64, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)',
          transition: 'all 260ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none'
        }}
      />

      {/* Segment Buttons */}
      {segments.map((seg) => {
        const isActive = seg.id === activeId;
        const Icon = seg.icon;

        return (
          <button
            key={seg.id}
            className="ios-segment-button"
            onClick={() => {
              if (!isActive) {
                playHapticTap();
                onChange(seg.id);
              }
            }}
            style={{
              position: 'relative',
              zIndex: 2,
              background: 'none',
              border: 'none',
              padding: itemPadding,
              borderRadius: '11px',
              fontFamily: 'inherit',
              fontSize: fontSize,
              fontWeight: isActive ? 750 : 550,
              color: isActive 
                ? (variant === 'dark' ? '#00E5FF' : '#0A2540')
                : (variant === 'dark' ? '#94A3B8' : '#64748B'),
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 180ms ease'
            }}
          >
            {Icon && typeof Icon === 'string' ? (
              <span style={{ fontSize: '14px' }}>{Icon}</span>
            ) : Icon ? (
              <Icon size={14} color={isActive ? (variant === 'dark' ? '#00E5FF' : '#008B8B') : '#64748B'} />
            ) : null}

            <span>{seg.label}</span>

            {seg.badge && (
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '6px',
                  background: isActive ? '#008B8B' : '#CBD5E1',
                  color: '#FFFFFF'
                }}
              >
                {seg.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
