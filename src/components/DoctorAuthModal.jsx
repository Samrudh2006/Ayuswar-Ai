import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Stethoscope, Lock, KeyRound, Sparkles, AlertCircle } from 'lucide-react';

/**
 * DoctorAuthModal Component
 * Implements national ABDM (Ayushman Bharat Digital Mission) Healthcare Professional ID (HPR)
 * authentication simulation. Allows evaluators and physicians to test role-based access.
 */
export default function DoctorAuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [abhaId, setAbhaId] = useState('ABHA-HPR-8921-9942');
  const [passcode, setPasscode] = useState('849201');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    // Simulate cryptographic token exchange with ABDM gateway
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        doctorName: 'Dr. Ananya Sharma, MD',
        hprId: abhaId,
        facility: 'Kurnool District Hospital (ABDM PHC #1402)',
        specialty: 'Internal Medicine & Ambient Clinical AI Investigator'
      });
      onClose();
    }, 700);
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="modal-content" style={{
        background: '#ffffff',
        width: '460px',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(10, 37, 64, 0.35)',
        border: '1px solid #D8E7EB'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A2540 0%, #008B8B 100%)',
          padding: '22px 24px',
          color: '#ffffff',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Stethoscope size={22} color="#00D2D3" />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', color: '#ffffff', fontWeight: 800 }}>
                Doctor Portal Authentication
              </h3>
              <div style={{ fontSize: '11px', color: '#E0F2FE', opacity: 0.9 }}>
                National ABDM Healthcare Professional Registry (HPR)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{
            background: 'rgba(0, 139, 139, 0.06)',
            border: '1px solid rgba(0, 139, 139, 0.2)',
            padding: '12px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            color: '#065F46',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px'
          }}>
            <ShieldCheck size={18} color="#008B8B" />
            <span>Judge / Evaluator Sandbox credentials preloaded below.</span>
          </div>

          {/* Field 1: ABHA ID */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0A2540', marginBottom: '6px' }}>
              Healthcare Professional ID (ABHA HPR)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 36px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  color: '#0F172A'
                }}
              />
              <UserCheck size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          {/* Field 2: Passcode */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0A2540', marginBottom: '6px' }}>
              Biometric / Token Passcode (OTP)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 36px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '14px',
                  color: '#0F172A',
                  letterSpacing: '2px'
                }}
              />
              <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '14px' }}
          >
            {isLoading ? (
              <span>Authenticating with NHA ABDM Gateway...</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Sign In to Clinical Studio</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
