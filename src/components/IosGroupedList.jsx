import React from 'react';
import { ChevronRight } from 'lucide-react';
import { playHapticTap, playHapticSwitch } from '../utils/haptics';

/**
 * AyuSwar AI — iOS Inset-Grouped Settings & Clinical List Component
 * True iOS design with vibrant squircle icons, iOS emerald switches, chevrons, and haptics.
 */
export default function IosGroupedList({
  title,
  footer,
  items = []
}) {
  return (
    <div style={{ marginBottom: '22px' }}>
      {/* iOS Section Header */}
      {title && (
        <div 
          style={{
            fontSize: '11.5px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#64748B',
            paddingLeft: '14px',
            marginBottom: '6px'
          }}
        >
          {title}
        </div>
      )}

      {/* Inset-Grouped Card Container */}
      <div 
        style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(10, 37, 64, 0.03)',
          overflow: 'hidden'
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const hasToggle = typeof item.checked === 'boolean';

          return (
            <div
              key={item.id || index}
              onClick={() => {
                if (hasToggle && item.onToggle) {
                  playHapticSwitch(!item.checked);
                  item.onToggle(!item.checked);
                } else if (item.onClick) {
                  playHapticTap();
                  item.onClick();
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                cursor: item.onClick || hasToggle ? 'pointer' : 'default',
                borderBottom: isLast ? 'none' : '1px solid #F1F5F9',
                transition: 'background 140ms ease'
              }}
              onMouseEnter={(e) => {
                if (item.onClick) e.currentTarget.style.background = '#F8FAFC';
              }}
              onMouseLeave={(e) => {
                if (item.onClick) e.currentTarget.style.background = '#FFFFFF';
              }}
            >
              {/* Left: Squircle Icon + Title & Subtitle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                {/* iOS Vibrant Squircle Icon */}
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: item.iconBg || 'linear-gradient(135deg, #008B8B, #00A896)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {item.icon}
                </div>

                {/* Text Labels */}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 650, color: '#0A2540' }}>
                      {item.title}
                    </span>
                    {item.badge && (
                      <span 
                        style={{
                          fontSize: '10px',
                          fontWeight: 750,
                          padding: '1px 6px',
                          borderRadius: '6px',
                          background: item.badgeBg || '#E6F7F8',
                          color: item.badgeColor || '#008B8B'
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '1px' }}>
                      {item.subtitle}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Toggle Switch / Value / Chevron */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '12px' }}>
                {item.value && (
                  <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                    {item.value}
                  </span>
                )}

                {/* iOS Emerald Toggle Switch */}
                {hasToggle && (
                  <div
                    style={{
                      width: '44px',
                      height: '26px',
                      borderRadius: '14px',
                      background: item.checked ? '#34C759' : '#E2E8F0',
                      padding: '2px',
                      position: 'relative',
                      transition: 'background 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                        transform: item.checked ? 'translateX(18px)' : 'translateX(0px)',
                        transition: 'transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                    />
                  </div>
                )}

                {item.showChevron && !hasToggle && (
                  <ChevronRight size={16} color="#94A3B8" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* iOS Section Footer Note */}
      {footer && (
        <div 
          style={{
            fontSize: '11px',
            color: '#94A3B8',
            paddingLeft: '14px',
            paddingRight: '14px',
            marginTop: '6px',
            lineHeight: 1.4
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
