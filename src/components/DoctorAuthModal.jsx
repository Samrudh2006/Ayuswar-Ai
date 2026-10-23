import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Stethoscope, 
  Lock, 
  KeyRound, 
  Sparkles, 
  AlertCircle,
  UserPlus,
  Building2,
  Award,
  CheckCircle2
} from 'lucide-react';
import { DOCTOR_REGISTRY } from '../data/clinicalRegistry';

/**
 * DoctorAuthModal Component
 * Implements national ABDM (Ayushman Bharat Digital Mission) Healthcare Professional ID (HPR)
 * authentication & Doctor Registration simulation.
 * Ensures a single doctor login experience where the doctor receives only their assigned patients!
 */
export default function DoctorAuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Login State
  const [selectedDoctorId, setSelectedDoctorId] = useState('doc_priya');
  const [passcode, setPasscode] = useState('849201');

  // Register State
  const [regDoctorName, setRegDoctorName] = useState('Dr. Priya Sharma, MD');
  const [regSpecialty, setRegSpecialty] = useState('Pulmonology & Critical Care');
  const [regNmcNo, setRegNmcNo] = useState('NMC-TS-2016-48291');
  const [regFacility, setRegFacility] = useState('Kurnool District Hospital (ABDM PHC #1402)');
  const [regExperience, setRegExperience] = useState('14 years');

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (authMode === 'login') {
        const docObj = DOCTOR_REGISTRY[selectedDoctorId.replace('doc_', '')] ||
          (selectedDoctorId === 'doc_priya' ? DOCTOR_REGISTRY.pulmonology :
           selectedDoctorId === 'doc_rajesh' ? DOCTOR_REGISTRY.cardiology :
           selectedDoctorId === 'doc_vikram' ? DOCTOR_REGISTRY.pediatrics :
           selectedDoctorId === 'doc_meenakshi' ? DOCTOR_REGISTRY.orthopedics :
           selectedDoctorId === 'doc_arishti' ? DOCTOR_REGISTRY.neurology :
           DOCTOR_REGISTRY.general);

        onLoginSuccess(docObj);
      } else {
        // Registering new doctor
        let specialtyDomain = 'general';
        const sLower = regSpecialty.toLowerCase();
        if (sLower.includes('pulmon') || sLower.includes('resp') || sLower.includes('chest')) {
          specialtyDomain = 'respiratory';
        } else if (sLower.includes('cardio') || sLower.includes('diabet') || sLower.includes('heart')) {
          specialtyDomain = 'cardiometabolic';
        } else if (sLower.includes('pediatric') || sLower.includes('child')) {
          specialtyDomain = 'pediatrics';
        } else if (sLower.includes('ortho') || sLower.includes('joint') || sLower.includes('bone')) {
          specialtyDomain = 'orthopedics';
        } else if (sLower.includes('neuro') || sLower.includes('brain')) {
          specialtyDomain = 'neurology';
        }

        const newDocProfile = {
          id: `doc_${Date.now()}`,
          doctorName: regDoctorName,
          specialty: regSpecialty,
          department: regSpecialty,
          facility: regFacility,
          hprId: `ABHA-HPR-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          nmcRegNo: regNmcNo,
          experience: regExperience,
          avatar: '/assets/dr_ananya_avatar.jpg',
          specialtyDomain: specialtyDomain
        };

        onLoginSuccess(newDocProfile);
      }

      onClose();
    }, 650);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(10, 37, 64, 0.75)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
      }}
    >
      <div className="modal-content" style={{
        background: '#ffffff',
        width: '490px',
        maxWidth: '100%',
        maxHeight: '90vh',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(10, 37, 64, 0.35)',
        border: '1px solid #D8E7EB',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A2540 0%, #0F4C5C 100%)',
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
              <Stethoscope size={22} color="#D4AF37" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', color: '#ffffff', fontWeight: 800, margin: 0 }}>
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

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: '#FAF8F5',
          borderBottom: '1px solid #E2E8F0',
          padding: '4px 6px'
        }}>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '10px',
              background: authMode === 'login' ? '#ffffff' : 'transparent',
              color: authMode === 'login' ? '#0F4C5C' : '#64748B',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: authMode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <UserCheck size={15} />
            <span>Doctor Login</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('register')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '10px',
              background: authMode === 'register' ? '#ffffff' : 'transparent',
              color: authMode === 'register' ? '#0F4C5C' : '#64748B',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: authMode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <UserPlus size={15} />
            <span>Register New Doctor (NMC / HPR)</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '22px 24px', overflowY: 'auto' }}>
          {authMode === 'login' ? (
            /* =========================================================================
               DOCTOR LOGIN FLOW
               ========================================================================= */
            <div>
              <div style={{
                background: 'rgba(15, 76, 92, 0.06)',
                border: '1px solid rgba(15, 76, 92, 0.2)',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#065F46',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '18px'
              }}>
                <ShieldCheck size={18} color="#0F4C5C" />
                <span>Select your verified physician profile. Your dashboard will filter patients matching your specialty.</span>
              </div>

              {/* Instant 1-Tap Mobile Demo Login */}
              <button
                type="button"
                onClick={() => {
                  onLoginSuccess(DOCTOR_REGISTRY.pulmonology);
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0F4C5C 0%, #006D6D 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(15, 76, 92, 0.35)',
                  marginBottom: '16px'
                }}
              >
                <Sparkles size={16} color="#D4AF37" />
                <span>⚡ 1-Tap Instant Doctor Login (Dr. Priya Sharma, MD)</span>
              </button>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                  Select Physician Session
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={e => setSelectedDoctorId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 650,
                    color: '#081C24',
                    background: '#ffffff'
                  }}
                >
                  <option value="doc_priya">🫁 Dr. Priya Sharma, MD — Pulmonology & Critical Care</option>
                  <option value="doc_rajesh">🩸 Dr. Rajesh Verma, MD, DM — Cardiology & Diabetology</option>
                  <option value="doc_kavitha">🌡️ Dr. Kavitha Reddy, MBBS, MS — General Medicine & Primary Care</option>
                  <option value="doc_vikram">👶 Dr. Vikram Seth, MD — Pediatrics & Neonatology</option>
                  <option value="doc_meenakshi">🦴 Dr. Meenakshi Sundaram, MS — Orthopedics & Joint Replacement</option>
                  <option value="doc_arishti">🧠 Dr. Arishti Banerjee, MD, DM — Neurology & Stroke Medicine</option>
                </select>
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                  Biometric / ABDM Security Token PIN
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    autoComplete="new-password"
                    data-lpignore="true"
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
                  <KeyRound size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================================
               DOCTOR REGISTRATION FLOW
               ========================================================================= */
            <div>
              <div style={{
                background: '#F0FDFA',
                border: '1px solid #99F6E4',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#0F766E',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <CheckCircle2 size={18} color="#0D9488" />
                <span>Register a new physician. Patients will be routed to your queue based on your medical specialty.</span>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#081C24', marginBottom: '5px' }}>
                  Doctor Full Name & Degree
                </label>
                <input
                  type="text"
                  value={regDoctorName}
                  onChange={e => setRegDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Priya Sharma, MD"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#081C24', marginBottom: '5px' }}>
                  Clinical Specialty (Determines Patient Disease Routing)
                </label>
                <select
                  value={regSpecialty}
                  onChange={e => setRegSpecialty(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #0F4C5C', fontSize: '12.5px', background: '#fff', fontWeight: 650 }}
                >
                  <option value="Pulmonology & Critical Care">🫁 Pulmonology & Critical Care (Respiratory OPD)</option>
                  <option value="Cardiology & Diabetology">🩸 Cardiology & Diabetology (Cardiometabolic OPD)</option>
                  <option value="General Medicine & Family Health">🌡️ General Medicine & Family Health (Primary Care OPD)</option>
                  <option value="Pediatrics & Neonatology">👶 Pediatrics & Neonatology (Child Health OPD)</option>
                  <option value="Orthopedics & Joint Care">🦴 Orthopedics & Joint Replacement (Musculoskeletal OPD)</option>
                  <option value="Neurology & Stroke Medicine">🧠 Neurology & Brain Sciences (Neurology OPD)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#081C24', marginBottom: '5px' }}>
                    NMC / Medical Council Reg. No.
                  </label>
                  <input
                    type="text"
                    value={regNmcNo}
                    onChange={e => setRegNmcNo(e.target.value)}
                    placeholder="NMC-TS-2024-8849"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#081C24', marginBottom: '5px' }}>
                    Clinical Experience
                  </label>
                  <input
                    type="text"
                    value={regExperience}
                    onChange={e => setRegExperience(e.target.value)}
                    placeholder="12 years"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#081C24', marginBottom: '5px' }}>
                  Hospital / Facility Name
                </label>
                <input
                  type="text"
                  value={regFacility}
                  onChange={e => setRegFacility(e.target.value)}
                  placeholder="e.g. Kurnool District Hospital (ABDM PHC #1402)"
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                />
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '14px', borderRadius: '12px', cursor: 'pointer' }}
          >
            {isLoading ? (
              <span>Connecting to ABDM Healthcare Registry...</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>
                  {authMode === 'register' 
                    ? 'Register Doctor & Open Specialist Dashboard' 
                    : 'Sign In to Clinical Studio'}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
