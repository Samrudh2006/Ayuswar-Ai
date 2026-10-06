import React, { useState } from 'react';

/**
 * AyuSwar AI — Apple macOS Floating Glass Dock
 * Bottom dock with fluid icon magnification, tactile spring physics,
 * and quick access to clinical operating system features.
 */
export default function MacDock({
  activeView,
  onNavigate,
  onOpenDoctorPortal,
  onOpenPatientPortal,
  onOpenSpotlight,
  onOpenTechModal,
  onOpenNotifications,
  unreadCount = 2
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const dockItems = [
    {
      id: 'doctor',
      label: 'Doctor Portal (HPR)',
      icon: '🩺',
      color: '#008B8B',
      badge: null,
      action: onOpenDoctorPortal
    },
    {
      id: 'patient',
      label: 'Patient ABHA Locker',
      icon: '👤',
      color: '#0A2540',
      badge: null,
      action: onOpenPatientPortal
    },
    {
      id: 'console',
      label: 'Live Voice Console',
      icon: '🎙️',
      color: '#EF4444',
      badge: 'LIVE',
      action: () => onNavigate('console')
    },
    {
      id: 'spotlight',
      label: 'Spotlight Search (⌘K)',
      icon: '🔍',
      color: '#3B82F6',
      badge: '⌘K',
      action: onOpenSpotlight
    },
    {
      id: 'pillbox',
      label: 'Chronotherapy Rx',
      icon: '💊',
      color: '#D97706',
      badge: null,
      action: onOpenPatientPortal
    },
    {
      id: 'tech',
      label: 'ABDM Architecture Specs',
      icon: '⚡',
      color: '#8B5CF6',
      badge: null,
      action: onOpenTechModal
    },
    {
      id: 'notifications',
      label: 'Clinical Alerts',
      icon: '🔔',
      color: '#F59E0B',
      badge: unreadCount > 0 ? `${unreadCount}` : null,
      action: onOpenNotifications
    }
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto'
      }}
    >
      <div 
        className="mac-dock-container"
        onMouseLeave={() => setHoveredIndex(null)}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          padding: '8px 12px',
          height: '64px',
          boxSizing: 'border-box'
        }}
      >
        {dockItems.map((item, index) => {
          const isHovered = hoveredIndex === index;
          const isNeighbor = hoveredIndex !== null && Math.abs(hoveredIndex - index) === 1;

          // Apple spring magnification scale calculations
          let scale = 1;
          let translateY = 0;
          if (isHovered) {
            scale = 1.28;
            translateY = -12;
          } else if (isNeighbor) {
            scale = 1.12;
            translateY = -5;
          }

          const isActive = 
            (item.id === 'doctor' && activeView === 'doctor_portal') ||
            (item.id === 'patient' && activeView === 'patient_portal') ||
            (item.id === 'console' && activeView === 'console');

          return (
            <div 
              key={item.id}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {/* Tooltip on Hover */}
              {isHovered && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '-34px',
                    background: 'rgba(10, 25, 41, 0.92)',
                    backdropFilter: 'blur(12px)',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 650,
                    padding: '3px 9px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                    pointerEvents: 'none',
                    animation: 'fadeIn 120ms ease',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}
                >
                  {item.label}
                </div>
              )}

              {/* Dock App Button */}
              <button
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={item.action}
                className="dock-item-btn"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 244, 248, 0.9) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  boxShadow: isHovered 
                    ? '0 12px 24px -4px rgba(10, 37, 64, 0.25), 0 0 0 1px rgba(0, 139, 139, 0.3)' 
                    : '0 4px 10px rgba(10, 37, 64, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  cursor: 'pointer',
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  transformOrigin: 'bottom center',
                  position: 'relative'
                }}
              >
                {item.icon}

                {/* Badge Tag */}
                {item.badge && (
                  <span 
                    style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px',
                      background: item.id === 'console' ? '#EF4444' : '#008B8B',
                      color: '#FFFFFF',
                      fontSize: '8.5px',
                      fontWeight: 800,
                      padding: '1px 4px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                      border: '1px solid #FFFFFF'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Active Indicator Dot */}
              {isActive && (
                <div 
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: '#008B8B',
                    marginTop: '3px',
                    boxShadow: '0 0 6px #008B8B'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
