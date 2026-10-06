import React, { useState } from 'react';
import { QrCode, ShieldCheck, Heart, Phone, AlertTriangle, Download, RefreshCw } from 'lucide-react';
import { playHapticFlip } from '../utils/haptics';

/**
 * AyuSwar AI — Apple Wallet Style 3D Flip ABHA Digital Health Pass
 * True Apple Wallet PKPass design with 3D card tilt, holographic shimmer, and two-sided flipping.
 */
export default function AppleWalletPass({
  patientProfile,
  assignedDoctor
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const patientName = patientProfile?.patientName || 'Ananya Rao';
  const abhaId = patientProfile?.abhaId || '91-4521-8932-1049';
  const age = patientProfile?.age || 28;
  const gender = patientProfile?.gender || 'Female';
  const language = patientProfile?.language || 'Telugu';
  const condition = patientProfile?.condition || 'Asthma & Seasonal Allergy';
  const doctorName = assignedDoctor?.doctorName || 'Dr. Priya Sharma, MD';
  const facility = assignedDoctor?.facility || 'Kurnool District Hospital';

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  };

  const handleFlip = () => {
    playHapticFlip();
    setIsFlipped(!isFlipped);
  };

  // 3D Perspective Rotations
  const rotateY = (isFlipped ? 180 : 0) + (isHovered && !isFlipped ? mousePos.x * 10 : 0);
  const rotateX = isHovered && !isFlipped ? -mousePos.y * 10 : 0;

  return (
    <div 
      style={{
        perspective: '1200px',
        width: '100%',
        maxWidth: '380px',
        margin: '0 auto',
        userSelect: 'none'
      }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 0, y: 0 });
        }}
        onMouseMove={handleMouseMove}
        onClick={handleFlip}
        style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
          transition: isHovered && !isFlipped ? 'transform 80ms ease-out' : 'transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          cursor: 'pointer'
        }}
      >
        {/* =========================================================================
            FRONT OF PASS (OFFICIAL ABHA DIGITAL HEALTH CARD)
            ========================================================================= */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #0A2540 0%, #004D4D 50%, #008B8B 100%)',
            borderRadius: '22px',
            padding: '18px 20px',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 24px 45px -12px rgba(10, 37, 64, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden'
          }}
        >
          {/* Holographic Sheen Layer */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)`,
              pointerEvents: 'none'
            }}
          />

          {/* Top Bar with ABDM & Emblem */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                🇮🇳
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#D0F0F3' }}>
                  ABDM Digital Health Pass
                </div>
                <div style={{ fontSize: '9px', color: '#94A3B8' }}>
                  National Health Authority • Ayushman Bharat
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 229, 255, 0.15)', border: '1px solid rgba(0, 229, 255, 0.4)', padding: '2px 8px', borderRadius: '12px' }}>
              <ShieldCheck size={12} color="#00E5FF" />
              <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#00E5FF' }}>VERIFIED</span>
            </div>
          </div>

          {/* Middle Body */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 2, margin: '8px 0' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 850, letterSpacing: '-0.01em', color: '#FFFFFF', fontFamily: 'Outfit, sans-serif' }}>
                {patientName}
              </div>
              <div style={{ fontSize: '12.5px', fontFamily: 'monospace', color: '#FDE047', fontWeight: 700, marginTop: '2px' }}>
                {abhaId}
              </div>
              <div style={{ fontSize: '11px', color: '#E2E8F0', marginTop: '4px' }}>
                {age} Yrs • {gender} • Language: <strong>{language}</strong>
              </div>
            </div>

            {/* Apple QR Pass Code Simulation */}
            <div 
              style={{
                background: '#FFFFFF',
                padding: '6px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <QrCode size={48} color="#0A2540" />
              <span style={{ fontSize: '7.5px', fontWeight: 800, color: '#0A2540', marginTop: '2px' }}>SCAN ABHA</span>
            </div>
          </div>

          {/* Bottom Card Strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '8px', position: 'relative', zIndex: 2 }}>
            <div>
              <div style={{ fontSize: '8.5px', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 700 }}>Attending Physician</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#FFFFFF' }}>{doctorName}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#D0F0F3' }}>
              <span>Tap to flip</span>
              <RefreshCw size={10} />
            </div>
          </div>
        </div>

        {/* =========================================================================
            BACK OF PASS (EMERGENCY CLINICAL DETAILS & ALLERGIES)
            ========================================================================= */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            borderRadius: '22px',
            padding: '16px 20px',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 24px 45px -12px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} color="#F59E0B" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#FDE047', textTransform: 'uppercase' }}>
                Emergency Medical Specs
              </span>
            </div>
            <span style={{ fontSize: '10px', color: '#94A3B8' }}>Blood Group: <strong style={{ color: '#EF4444' }}>O+ Positive</strong></span>
          </div>

          {/* Emergency Info Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '4px 0' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '6px 10px' }}>
              <div style={{ fontSize: '9.5px', color: '#FCA5A5', fontWeight: 700 }}>KNOWN DRUG ALLERGIES:</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#FFFFFF' }}>Penicillin • NSAIDs (Aspirin sensitivity)</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '6px 10px' }}>
              <div style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: 700 }}>EMERGENCY CAREGIVER:</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#FFFFFF' }}>K. Rajesh (Son) • +91 98480 22334</div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#10B981' }}>
              <Heart size={11} />
              <span>Organ Donor: YES</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#94A3B8' }}>
              <span>Tap to flip front</span>
              <RefreshCw size={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
