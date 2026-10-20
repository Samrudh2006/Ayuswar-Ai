import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  Heart, 
  Activity, 
  Pill, 
  FileText, 
  PhoneCall, 
  Calendar, 
  Download, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles, 
  Stethoscope, 
  User, 
  Clock, 
  Share2, 
  AlertTriangle,
  X
} from 'lucide-react';

import AuthenticQrCode from './AuthenticQrCode';

/**
 * High-Density Realistic ABDM 2D Matrix QR Code Generator (SVG)
 * Powered by ISO 18004 compliant Reed-Solomon engine. Scannable by any mobile camera.
 */
export function RealisticAbdmQrCode({ value = "abdm://abha/91-8842-1920-5511", size = 110, isDoctor = false }) {
  return (
    <AuthenticQrCode
      value={value}
      size={size}
      level="M"
      fgColor="#0A2540"
      bgColor="#FFFFFF"
      isDoctor={isDoctor}
      showCenterBadge={true}
    />
  );
}

/**
 * AbhaDigitalCard Component
 * Faithfully replicates the authentic Ayushman Bharat Digital Health Card (Left) 
 * + Interactive Mobile Deep Dossier Profile (Right) matching the user reference screenshot!
 */
export default function AbhaDigitalCard({
  patient = null,
  doctor = null,
  isDoctorMode = false,
  showDetailedModalByDefault = false,
  onClose = null
}) {
  const [showDossierModal, setShowDossierModal] = useState(showDetailedModalByDefault);

  // Default Fallbacks for Patient
  const pName = patient?.patientName || 'Narayana Rao';
  const pTelugu = patient?.vernacular || (pName === 'Narayana Rao' ? 'నారాయణ రావు' : (pName === 'Ananya Rao' ? 'అనన్య రావు' : pName));
  const pAbhaAddress = patient?.abhaAddress || (pName.toLowerCase().includes('narayana') ? 'narayana@abdm' : 'ananya@abdm');
  const pAbhaId = patient?.abhaId || '91-8842-1920-5511';
  const pDob = patient?.dob || '14-08-1996';
  const pGender = patient?.gender || 'Female';
  const pBlood = patient?.bloodGroup || 'O+ve';
  const pAvatar = patient?.avatar || '/assets/dr_ananya_avatar.jpg';

  // Default Fallbacks for Doctor
  const dName = doctor?.doctorName || 'Dr. Priya Sharma, MD';
  const dTelugu = doctor?.vernacular || 'డాక్టర్ ప్రియా శర్మ';
  const dHprId = doctor?.hprId || 'dr.priya@hpr.abdm';
  const dAbhaNum = doctor?.abhaNumber || '91-6742-8921-9942';
  const dNmcReg = doctor?.nmcRegNo || 'NMC-TS-2016-48291';
  const dSpecialty = doctor?.specialty || 'Pulmonology & Critical Care';
  const dFacility = doctor?.facility || 'Kurnool District Hospital (HFR #1402)';
  const dAvatar = doctor?.avatar || '/assets/dr_ananya_avatar.jpg';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      
      {/* =========================================================================
          AUTHENTIC PHYSICAL SMART CARD (LEFT CARD IN SCREENSHOT)
          ========================================================================= */}
      <div 
        style={{
          width: '100%',
          maxWidth: '560px',
          background: isDoctorMode 
            ? 'linear-gradient(135deg, #0A2540 0%, #061B30 45%, #004D4D 100%)' 
            : 'linear-gradient(135deg, #062D30 0%, #0A4347 50%, #032426 100%)',
          borderRadius: '22px',
          padding: '24px 28px',
          boxShadow: '0 20px 50px rgba(6, 45, 48, 0.35), 0 0 0 1.5px rgba(0, 210, 211, 0.35)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Outfit, sans-serif'
        }}
      >
        {/* Sacred Foliage & Acoustic Watermark Background Pattern */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 210, 211, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>

        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '10%',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 139, 139, 0.15) 0%, transparent 65%)',
          pointerEvents: 'none'
        }}></div>

        {/* Card Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Glowing Lotus Cross Emblem */}
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00D2D3 0%, #008B8B 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(0, 210, 211, 0.5)'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20" />
                <path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24" opacity="0.6"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '15.5px', fontWeight: 850, letterSpacing: '-0.2px', color: '#ffffff' }}>
                {isDoctorMode ? 'Physician Health ID (Demo)' : 'Health ID (Demo)'}
              </div>
              <div style={{ fontSize: '11px', color: '#A5F3FC', fontWeight: 600 }}>
                {isDoctorMode ? 'AyuSwar AI Clinician Demonstration Record' : 'AyuSwar AI Health Demonstration Record'}
              </div>
              <div style={{ fontSize: '9px', color: '#94A3B8' }}>
                Sample data • Non-production prototype
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(0, 210, 211, 0.18)',
            border: '1px solid #00D2D3',
            borderRadius: '20px',
            padding: '4px 10px',
            fontSize: '10px',
            fontWeight: 800,
            color: '#A5F3FC',
            letterSpacing: '0.6px',
            textTransform: 'uppercase'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5EEAD4', boxShadow: '0 0 6px #5EEAD4' }}></span>
            <span>{isDoctorMode ? 'DEMO • CLINICIAN RECORD' : 'DEMO • PATIENT RECORD'}</span>
          </div>
        </div>

        {/* Card Main Body: Avatar + Details + QR Code */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', position: 'relative', zIndex: 2, marginBottom: '22px' }}>
          
          {/* Avatar with Halo */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              padding: '3px',
              background: 'linear-gradient(135deg, #00D2D3 0%, #008B8B 100%)',
              boxShadow: '0 0 16px rgba(0, 210, 211, 0.4)'
            }}>
              <img 
                src={isDoctorMode ? dAvatar : pAvatar} 
                alt="Citizen" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
              />
            </div>
            {/* Gender / Role Badge */}
            <div style={{
              position: 'absolute',
              bottom: '0px',
              right: '-2px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#EF4444',
              color: '#ffffff',
              border: '2px solid #062D30',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 900
            }}>
              {isDoctorMode ? '👨‍⚕️' : (pGender.toLowerCase().includes('fem') ? '♀' : '♂')}
            </div>
          </div>

          {/* Name & Identity */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              {isDoctorMode ? dName : pName}
            </div>
            <div style={{ fontSize: '14px', color: '#67E8F9', fontWeight: 700, marginBottom: '4px' }}>
              ({isDoctorMode ? dTelugu : pTelugu})
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1' }}>
              {isDoctorMode ? 'HPR Address:' : 'ABHA Address:'} <strong style={{ color: '#ffffff' }}>{isDoctorMode ? dHprId : pAbhaAddress}</strong>
            </div>
            <div style={{
              fontSize: '17px',
              fontWeight: 900,
              color: '#ffffff',
              fontFamily: 'monospace',
              letterSpacing: '0.8px',
              margin: '4px 0'
            }}>
              {isDoctorMode ? dAbhaNum : pAbhaId}
            </div>
            <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>
              {isDoctorMode 
                ? `NMC Reg: ${dNmcReg} • ${dSpecialty}` 
                : `DOB: ${pDob} • ${pGender} • Blood: ${pBlood}`}
            </div>
          </div>

          {/* High-Density 2D Matrix QR Code */}
          <div 
            onClick={() => setShowDossierModal(true)}
            style={{ textAlign: 'center', cursor: 'pointer', flexShrink: 0 }}
            title="Click to expand detailed digital health dossier"
          >
            <RealisticAbdmQrCode 
              value={isDoctorMode ? `abdm://hpr/${dAbhaNum}` : `abdm://abha/${pAbhaId}`} 
              size={94} 
              isDoctor={isDoctorMode} 
            />
            <div style={{ fontSize: '9px', color: '#A5F3FC', fontWeight: 750, marginTop: '4px' }}>
              Scan for Health Profile
            </div>
          </div>
        </div>

        {/* Card Bottom Links Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          paddingTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#E2E8F0',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => setShowDossierModal(true)}>
            <Heart size={13} color="#00D2D3" />
            <span>Health Records</span>
          </div>
          <span style={{ opacity: 0.3 }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => setShowDossierModal(true)}>
            <Pill size={13} color="#00D2D3" />
            <span>Prescriptions</span>
          </div>
          <span style={{ opacity: 0.3 }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => setShowDossierModal(true)}>
            <FileText size={13} color="#00D2D3" />
            <span>Lab Reports</span>
          </div>
          <span style={{ opacity: 0.3 }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => setShowDossierModal(true)}>
            <User size={13} color="#00D2D3" />
            <span>Emergency Info</span>
          </div>
        </div>
      </div>

      {/* "Scan QR to view detailed health profile" CTA */}
      <button
        onClick={() => setShowDossierModal(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#ffffff',
          border: '1.5px solid #008B8B',
          borderRadius: '24px',
          padding: '10px 22px',
          color: '#0A2540',
          fontSize: '13.5px',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0, 139, 139, 0.12)',
          transition: 'all 160ms ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 139, 139, 0.22)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 139, 139, 0.12)';
        }}
      >
        <QrCode size={18} color="#008B8B" />
        <span>Scan QR to view detailed health profile ↗</span>
      </button>

      {/* =========================================================================
          RIGHT MODAL / DOSSIER: COMPLETE MOBILE DIGITAL HEALTH PROFILE
          ========================================================================= */}
      {showDossierModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 37, 64, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 1500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          {/* Mobile Phone Mockup Container */}
          <div style={{
            width: '420px',
            maxWidth: '95vw',
            maxHeight: '92vh',
            background: '#ffffff',
            borderRadius: '32px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
            border: '3px solid #062D30',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Outfit, sans-serif'
          }}>
            {/* Phone Header Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #062D30 0%, #0A4347 60%, #032426 100%)',
              color: '#ffffff',
              padding: '18px 20px 14px 20px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <button
                  onClick={() => {
                    setShowDossierModal(false);
                    if (onClose) onClose();
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ArrowLeft size={16} />
                </button>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                    Health Profile (Demo)
                  </div>
                  <div style={{ fontSize: '10px', color: '#67E8F9' }}>
                    Fictional Sample Record
                  </div>
                </div>

                <div style={{ fontSize: '12px', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '10px', color: '#E0F2FE', fontWeight: 700 }}>
                  DEMO
                </div>
              </div>

              {/* Citizen Hero Profile inside Phone */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  padding: '2px',
                  background: 'linear-gradient(135deg, #00D2D3 0%, #008B8B 100%)',
                  flexShrink: 0
                }}>
                  <img 
                    src={isDoctorMode ? dAvatar : pAvatar} 
                    alt="Citizen" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: 900, color: '#ffffff' }}>
                    {isDoctorMode ? dName : pName}
                  </div>
                  <div style={{ fontSize: '13px', color: '#67E8F9', fontWeight: 700 }}>
                    ({isDoctorMode ? dTelugu : pTelugu})
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#CBD5E1' }}>
                    ABHA Address: <strong style={{ color: '#ffffff' }}>{isDoctorMode ? dHprId : pAbhaAddress}</strong>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 850, fontFamily: 'monospace', color: '#ffffff' }}>
                    {isDoctorMode ? dAbhaNum : pAbhaId}
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '10px', color: '#A5F3FC', lineHeight: 1.3 }}>
                  Healthy<br />Today<br />Stronger<br />Tomorrow
                </div>
              </div>

              {/* Demographics Pill Strip */}
              <div style={{
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#E2E8F0'
              }}>
                <span>📅 DOB: {pDob}</span>
                <span>•</span>
                <span>👤 {pGender}</span>
                <span>•</span>
                <span>🩸 Blood: {pBlood}</span>
              </div>
            </div>

            {/* Scrollable Dossier Content */}
            <div style={{ padding: '16px 18px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* 1. Medical Summary Banner */}
              <div style={{
                background: '#F0FDFA',
                border: '1.5px solid #99F6E4',
                borderRadius: '14px',
                padding: '12px 14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: '#0F766E' }}>
                    <Activity size={16} color="#0D9488" />
                    <span>Medical Summary</span>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 800, background: '#CCFBF1', color: '#0F766E', padding: '2px 6px', borderRadius: '6px' }}>
                    Chronic Condition(s)
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#134E4A', fontWeight: 650 }}>
                  Hypertension (Stage 1) • Type 2 Diabetes • Mild Asthma
                </div>
              </div>

              {/* 2. 3-Column Bento Grid: Vitals | Medications | Lab Reports */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                
                {/* Vitals */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: 800, color: '#0284C7', marginBottom: '6px' }}>
                    <Heart size={12} />
                    <span>Vitals (Latest)</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#475569', lineHeight: 1.6 }}>
                    <div>BP: <strong>128/82</strong></div>
                    <div>HR: <strong>76 bpm</strong></div>
                    <div>SpO2: <strong>98%</strong></div>
                    <div>Temp: <strong>36.6°C</strong></div>
                  </div>
                </div>

                {/* Current Medications */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: 800, color: '#7C3AED', marginBottom: '6px' }}>
                    <Pill size={12} />
                    <span>Medications</span>
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#475569', lineHeight: 1.5 }}>
                    <div>1. Metformin 500</div>
                    <div>2. Amlodipine 5</div>
                    <div>3. Budesonide</div>
                  </div>
                  <div style={{ fontSize: '9px', color: '#7C3AED', fontWeight: 800, marginTop: '4px' }}>
                    View All →
                  </div>
                </div>

                {/* Recent Lab Reports */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: 800, color: '#059669', marginBottom: '6px' }}>
                    <FileText size={12} />
                    <span>Lab Reports</span>
                  </div>
                  <div style={{ fontSize: '9.5px', color: '#475569', lineHeight: 1.5 }}>
                    <div>HbA1c: <strong>6.8%</strong> (↑)</div>
                    <div>Chol: <strong>182</strong></div>
                    <div>Vit D: <strong>18</strong></div>
                  </div>
                  <div style={{ fontSize: '9px', color: '#059669', fontWeight: 800, marginTop: '4px' }}>
                    View All →
                  </div>
                </div>
              </div>

              {/* 3. 2-Column Info: Allergies & Past Surgeries */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#B91C1C', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={12} />
                    <span>Allergies</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#991B1B', lineHeight: 1.4 }}>
                    • Penicillin (Medication)<br />
                    • Dust (Environmental)
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F766E', marginBottom: '4px' }}>
                    Past Surgeries
                  </div>
                  <div style={{ fontSize: '10px', color: '#475569', lineHeight: 1.4 }}>
                    • Appendectomy (2015)<br />
                    • Tonsillectomy (2008)
                  </div>
                </div>
              </div>

              {/* 4. Doctor & Hospital + Emergency Contacts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '8px' }}>
                <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '12px', padding: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0369A1', marginBottom: '3px' }}>
                    Doctor & Hospital
                  </div>
                  <div style={{ fontSize: '10px', color: '#0C4A6E', lineHeight: 1.4 }}>
                    <strong>{dName}</strong><br />
                    {dFacility}
                  </div>
                </div>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0A2540', marginBottom: '3px' }}>
                    Emergency
                  </div>
                  <div style={{ fontSize: '10px', color: '#475569', lineHeight: 1.4 }}>
                    Father: 98490-xxxxx<br />
                    Mother: 97012-xxxxx
                  </div>
                </div>
              </div>

              {/* 5. 4 Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '4px' }}>
                {[
                  { label: 'Prescriptions', icon: Pill, color: '#008B8B', bg: '#F0FDFA' },
                  { label: 'Lab Reports', icon: FileText, color: '#0284C7', bg: '#F0F9FF' },
                  { label: 'Documents', icon: ShieldCheck, color: '#7C3AED', bg: '#F5F3FF' },
                  { label: 'Timeline', icon: Clock, color: '#D97706', bg: '#FFFBEB' }
                ].map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <div
                      key={i}
                      style={{
                        background: act.bg,
                        borderRadius: '10px',
                        padding: '8px 4px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ color: act.color, display: 'flex', justifyContent: 'center', marginBottom: '3px' }}>
                        <Icon size={16} />
                      </div>
                      <div style={{ fontSize: '9.5px', fontWeight: 750, color: '#0A2540' }}>
                        {act.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Footer */}
            <div style={{
              background: '#062D30',
              color: '#A5F3FC',
              padding: '10px 16px',
              fontSize: '10.5px',
              fontWeight: 700,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}>
              <span>🛡️ Ayushman Bharat Digital Health Mission | Govt. of India</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
