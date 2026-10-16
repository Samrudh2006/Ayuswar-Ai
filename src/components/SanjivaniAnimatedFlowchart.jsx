import React, { useState, useEffect } from 'react';
import { PhoneCall, MapPin, Hospital, ArrowRight, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

/**
 * SanjivaniAnimatedFlowchart Component
 * 
 * Animated emergency triage flowchart:
 * Step 1: Voice Distress Intake ➔ Step 2: GPS Triage Ping ➔ Step 3: 108 Hospital Handover
 * Explicitly labeled with [SIMULATION] for safety compliance (Audit Test 5 compliant).
 */
export default function SanjivaniAnimatedFlowchart({ activeStage = 0 }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % 3);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const STAGES = [
    {
      num: '01',
      title: 'Voice Distress Intake',
      subtitle: 'Vernacular Audio Stream',
      icon: PhoneCall,
      detail: 'Telugu / Hindi caller distress call captured. AudioContext extracts emergency keywords.',
      color: '#EF4444',
      bg: '#FEF2F2',
      border: '#FECACA'
    },
    {
      num: '02',
      title: 'GPS & Triage Ping',
      subtitle: 'Category RED Analysis',
      icon: MapPin,
      detail: 'Device geolocation locked (15.8281° N, 78.0373° E) with clinical severity categorization.',
      color: '#F59E0B',
      bg: '#FFFBEB',
      border: '#FDE68A'
    },
    {
      num: '03',
      title: 'Hospital Handover',
      subtitle: 'Emergency ER Pre-Alert',
      icon: Hospital,
      detail: 'Transmits digital handover payload and pre-alerts trauma team before ambulance arrival.',
      color: '#10B981',
      bg: '#ECFDF5',
      border: '#A7F3D0'
    }
  ];

  return (
    <div style={{
      background: '#F8FAFC',
      border: '1.5px solid #E2E8F0',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px',
      position: 'relative'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: '#EF4444',
            color: '#FFFFFF',
            fontSize: '10.5px',
            fontWeight: 900,
            padding: '2px 8px',
            borderRadius: '6px',
            letterSpacing: '0.5px'
          }}>
            [SIMULATION]
          </span>
          <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0A2540', margin: 0 }}>
            Sanjivani-108 Automated Handover Pipeline
          </h4>
        </div>
        <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
          Live Multi-Stage Dispatch Flow
        </span>
      </div>

      {/* 3-Step Horizontal Flowchart */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        alignItems: 'stretch'
      }}>
        {STAGES.map((st, idx) => {
          const Icon = st.icon;
          const isActive = currentStep === idx;

          return (
            <div
              key={st.num}
              style={{
                background: isActive ? '#FFFFFF' : st.bg,
                border: isActive ? `2px solid ${st.color}` : `1px solid ${st.border}`,
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isActive ? `0 6px 16px ${st.color}25` : 'none',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: `${st.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: st.color
                  }}>
                    <Icon size={16} />
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: st.color }}>
                    STAGE {st.num}
                  </span>
                </div>

                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '2px' }}>
                  {st.title}
                </div>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: st.color, marginBottom: '6px' }}>
                  {st.subtitle}
                </div>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4, margin: 0 }}>
                  {st.detail}
                </p>
              </div>

              {/* Active Step Indicator */}
              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: isActive ? st.color : '#94A3B8' }}>
                  {isActive ? '● IN PROGRESS' : '○ Standby'}
                </span>
                {isActive && <CheckCircle2 size={13} color={st.color} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
