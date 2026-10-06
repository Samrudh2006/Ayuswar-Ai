import React, { useState } from 'react';
import { Pill, ShieldCheck, Smartphone, KeyRound, Sparkles, UserCheck } from 'lucide-react';

/**
 * PatientAuthModal Component
 * Implements Ayushman Bharat Health Account (ABHA) Citizen Authentication.
 * Allows rural and urban patients or community health workers (ASHA) to login
 * and access their personalized Vernacular Audio Prescriptions.
 */
export default function PatientAuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [abhaId, setAbhaId] = useState('91-4521-8932-1049');
  const [mobileOtp, setMobileOtp] = useState('4920');
  const [preferredLang, setPreferredLang] = useState('Telugu');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        patientName: 'Narayana Rao (నారాయణ రావు)',
        abhaId: abhaId,
        gender: 'Male',
        age: 58,
        language: preferredLang,
        phc: 'Kurnool PHC, Andhra Pradesh'
      });
      onClose();
    }, 600);
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
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A2540 0%, #D97706 100%)',
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
              <Pill size={22} color="#FDE047" />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', color: '#ffffff', fontWeight: 800 }}>
                Patient Seva Portal Login
              </h3>
              <div style={{ fontSize: '11px', color: '#FEF3C7', opacity: 0.9 }}>
                ABHA Health Account & Audio-Rx Access
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{
            background: 'rgba(217, 119, 6, 0.08)',
            border: '1px solid rgba(217, 119, 6, 0.25)',
            padding: '12px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            color: '#92400E',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px'
          }}>
            <ShieldCheck size={18} color="#D97706" />
            <span>Preloaded test citizen account (Narayana Rao, Telugu).</span>
          </div>

          {/* Field 1: ABHA ID / Mobile */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0A2540', marginBottom: '6px' }}>
              Citizen ABHA ID / Registered Mobile
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
              <Smartphone size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          {/* Field 2: OTP */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0A2540', marginBottom: '6px' }}>
              Aadhaar / Mobile OTP
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={mobileOtp}
                onChange={(e) => setMobileOtp(e.target.value)}
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
              <KeyRound size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            </div>
          </div>

          {/* Field 3: Preferred Voice Language */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0A2540', marginBottom: '6px' }}>
              Preferred Voice Audio Language
            </label>
            <select
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '13px',
                color: '#0F172A',
                background: '#ffffff'
              }}
            >
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
              <option value="Marathi">Marathi (मराठी)</option>
            </select>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '14px', background: '#D97706' }}
          >
            {isLoading ? (
              <span>Verifying ABHA Registry...</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Open My Audio-Rx Health Portal</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
