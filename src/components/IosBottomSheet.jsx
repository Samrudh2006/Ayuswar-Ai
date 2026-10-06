import React, { useEffect } from 'react';
import { playHapticTap } from '../utils/haptics';

/**
 * AyuSwar AI — iOS Liquid Bottom Sheet & Action Drawer
 * Sliding bottom sheet modal with drag-handle pill, frosted glass backdrop, and quick clinical actions.
 */
export default function IosBottomSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  children
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={() => {
        playHapticTap();
        onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10001,
        background: 'rgba(10, 25, 41, 0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        animation: 'fadeIn 180ms ease'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 -20px 50px -10px rgba(10, 37, 64, 0.25)',
          padding: '12px 24px 32px 24px',
          animation: 'modalSlideUp 260ms cubic-bezier(0.16, 1, 0.3, 1)',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
      >
        {/* iOS Top Drag Pill Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <div 
            style={{
              width: '38px',
              height: '5px',
              borderRadius: '3px',
              backgroundColor: '#CBD5E1',
              cursor: 'pointer'
            }}
            onClick={onClose}
          />
        </div>

        {/* Header */}
        {(title || subtitle) && (
          <div style={{ marginBottom: '18px', textAlign: 'center' }}>
            {title && (
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '3px' }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Sheet Content */}
        {children}
      </div>
    </div>
  );
}
