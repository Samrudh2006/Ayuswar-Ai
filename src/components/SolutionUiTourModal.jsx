import React, { useState, useEffect } from 'react';
import { X, Play, Pause, ChevronRight, ChevronLeft, CheckCircle2, MousePointer, Sparkles, Volume2, ShieldCheck, FileText } from 'lucide-react';

/**
 * SolutionUiTourModal Component
 * 
 * Implements Item #30:
 * UI Walkthrough: Solutions pages, interactive cursor tour on REAL live UI workflows.
 * Shows an automated glowing cursor stepping across live clinical workflow highlights:
 * 1. Ambient Web Speech Audio Intake
 * 2. Colloquial Indic Dialect Resolver (Rayalaseema / Telangana)
 * 3. Clinical Triage & Non-Diagnostic Severity Flagging
 * 4. ABDM FHIR R4 Electronic Health Record Bundle
 * 5. Vernacular Spoken Audio-Rx Synthesis
 */
export default function SolutionUiTourModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const TOUR_STEPS = [
    {
      step: 1,
      title: 'Ambient Multi-Speaker Consultation Stream',
      tag: 'STAGE 1 • AUDIO INTAKE',
      desc: 'Doctor and patient speak naturally in rural OPD. Web Speech API captures dual-speaker dialogue with zero hands-on-keyboard typing.',
      targetZone: { top: '24%', left: '28%' },
      badgeColor: '#10B981',
      badgeBg: '#ECFDF5',
      preview: {
        speaker: 'Doctor Priya Sharma (MD)',
        text: 'నమస్కారం లక్ష్మి గారు, మీకు ఎలాంటి సమస్య ఉంది?',
        metric: 'Sample Rate: 16kHz • VAD Threshold: -42dB'
      }
    },
    {
      step: 2,
      title: 'Rayalaseema Vernacular Dialect Tokenization',
      tag: 'STAGE 2 • ONTOLOGY RESOLUTION',
      desc: 'Patient reports colloquial symptom metaphors. AyuSwar maps village phrases directly into ICD-10 concepts without LLM hallucination.',
      targetZone: { top: '42%', left: '68%' },
      badgeColor: '#0284C7',
      badgeBg: '#F0F9FF',
      preview: {
        speaker: 'Patient Lakshmi (48)',
        text: '"రెండు రోజుల నుంచి పీకల్లో పిల్లికూతలు, రాత్రి వేళ ఆయాసం వస్తుంది"',
        metric: 'Resolved: ICD-10 R06.2 (Wheezing) • SNOMED CT: 248596007'
      }
    },
    {
      step: 3,
      title: 'Non-Diagnostic Biomarker Heuristics',
      tag: 'STAGE 3 • ACOUSTIC SENTINEL',
      desc: 'AudioContext FFT calculates spectral centroid and harmonic formants, tagging sub-acute respiratory strain for attending physician review.',
      targetZone: { top: '64%', left: '32%' },
      badgeColor: '#D97706',
      badgeBg: '#FFFBEB',
      preview: {
        speaker: 'Acoustic DSP Engine',
        text: 'Spectral Rolloff: 2.85 kHz • Wheeze Formant Energy: Flagged',
        metric: 'Non-Diagnostic Heuristic Screen • Physician In-The-Loop'
      }
    },
    {
      step: 4,
      title: 'ABDM FHIR R4 Encounter Bundle Assembly',
      tag: 'STAGE 4 • SCHEMAS & COMPLIANCE',
      desc: 'Structures the verified consultation into an immutable HL7 FHIR R4 JSON bundle for Ayushman Bharat Digital Mission interoperability.',
      targetZone: { top: '78%', left: '62%' },
      badgeColor: '#8B5CF6',
      badgeBg: '#F5F3FF',
      preview: {
        speaker: 'ABDM Gateway Adapter',
        text: 'Bundle: Encounter, Condition (J45.901), Observation, MedicationRequest',
        metric: 'Tagged to Verified Sandbox ABHA: DEMO-91-4521-8932-1049'
      }
    }
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % TOUR_STEPS.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const current = TOUR_STEPS[currentStep];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(10, 37, 64, 0.78)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '880px',
        width: '100%',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        border: '1.5px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Header Bar */}
        <div style={{
          padding: '18px 24px',
          background: '#0B132B',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              background: '#008B8B',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.5px'
            }}>
              INTERACTIVE TOUR
            </span>
            <span style={{ fontSize: '15px', fontWeight: 800 }}>
              Live Clinical Workflow Cursor Tour
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause Tour' : 'Resume Tour'}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tour Canvas Body */}
        <div style={{
          position: 'relative',
          height: '420px',
          background: '#0F172A',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px'
        }}>
          {/* Simulated Real UI Dashboard Workspace in Background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.18,
            pointerEvents: 'none',
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: '16px',
            padding: '20px'
          }}>
            <div style={{ background: '#1E293B', borderRadius: '12px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ height: '80px', background: '#1E293B', borderRadius: '12px' }} />
              <div style={{ flex: 1, background: '#1E293B', borderRadius: '12px' }} />
            </div>
          </div>

          {/* Animated Floating Cursor */}
          <div style={{
            position: 'absolute',
            top: current.targetZone.top,
            left: current.targetZone.left,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 10,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}>
            {/* Glowing Cursor Circle */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(45, 212, 191, 0.25)',
              border: '2px solid #2DD4BF',
              boxShadow: '0 0 20px #2DD4BF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'cursorPing 1.8s infinite'
            }}>
              <MousePointer size={16} color="#FFFFFF" style={{ transform: 'rotate(-25deg)' }} />
            </div>
            <span style={{
              background: '#0A2540',
              border: '1px solid #2DD4BF',
              color: '#2DD4BF',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '12px',
              whiteSpace: 'nowrap'
            }}>
              Active Focus
            </span>
          </div>

          {/* Real Live Step Content Preview Card */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.88)',
            backdropFilter: 'blur(10px)',
            border: `1.5px solid ${current.badgeColor}`,
            borderRadius: '18px',
            padding: '22px',
            maxWidth: '560px',
            zIndex: 5,
            boxShadow: `0 8px 28px rgba(0, 0, 0, 0.4)`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                background: current.badgeBg,
                color: current.badgeColor,
                fontSize: '10.5px',
                fontWeight: 900,
                padding: '3px 9px',
                borderRadius: '6px'
              }}>
                {current.tag}
              </span>
              <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 600 }}>
                Step {current.step} of 4
              </span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              {current.title}
            </h3>

            <p style={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '14px' }}>
              {current.desc}
            </p>

            {/* Live Data Simulation Snippet */}
            <div style={{
              background: '#0B132B',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px 14px',
              fontFamily: 'monospace',
              fontSize: '11.5px'
            }}>
              <div style={{ color: current.badgeColor, fontWeight: 700, marginBottom: '4px' }}>
                // {current.preview.speaker}:
              </div>
              <div style={{ color: '#F8FAFC', marginBottom: '6px' }}>
                {current.preview.text}
              </div>
              <div style={{ color: '#94A3B8', fontSize: '10.5px', borderTop: '1px dashed rgba(255, 255, 255, 0.1)', paddingTop: '4px' }}>
                {current.preview.metric}
              </div>
            </div>
          </div>

          {/* Bottom Progress Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 5 }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {TOUR_STEPS.map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  style={{
                    width: idx === currentStep ? '36px' : '10px',
                    height: '8px',
                    borderRadius: '4px',
                    background: idx === currentStep ? current.badgeColor : 'rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentStep(prev => (prev - 1 + TOUR_STEPS.length) % TOUR_STEPS.length)}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentStep(prev => (prev + 1) % TOUR_STEPS.length)}
                style={{
                  background: current.badgeColor,
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Next Stage</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 24px',
          background: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Click anywhere on progress dots or next button to navigate.
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#0F172A',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 750,
              cursor: 'pointer'
            }}
          >
            Close Walkthrough
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cursorPing {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 10px #2DD4BF;
          }
          50% {
            transform: scale(1.15);
            box-shadow: 0 0 24px #2DD4BF;
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 10px #2DD4BF;
          }
        }
      `}</style>
    </div>
  );
}
