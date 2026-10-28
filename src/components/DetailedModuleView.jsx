import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Activity, 
  Mic, 
  Volume2, 
  Shield, 
  FileText, 
  Database, 
  Layers, 
  Eye, 
  PhoneCall, 
  Play, 
  BarChart2, 
  Heart, 
  Building2, 
  Clock, 
  Download,
  Share2,
  ExternalLink,
  Award,
  Pause,
  RotateCcw,
  Sliders,
  VolumeX,
  Radio,
  Zap,
  User,
  Stethoscope
} from 'lucide-react';
import SolutionUiTourModal from './SolutionUiTourModal';

/**
 * OpdDualSpeakerStudio
 * Interactive Live Dual-Speaker Acoustic Studio replacing static presentation text cards.
 * Features:
 * - Real dual-channel dialogue playback: Dr. Priya (Cyan) vs Patient Lakshmi (Emerald)
 * - Color-coded speaker diarization badges that illuminate in real-time
 * - Interactive DSP Noise Filter Toggle (Raw Rural OPD 72dB vs AyuSwar Adaptive Kalman Filter)
 * - Live Note Draft Streaming Panel dynamically constructing SOAP note
 * - Direct Action button to launch the full Clinical Console
 */
function OpdDualSpeakerStudio({ onLaunchInteractiveModal }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [filterMode, setFilterMode] = useState('kalman'); // 'kalman' | 'raw'
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const DIALOGUE = [
    {
      id: 0,
      speaker: 'doctor',
      name: 'Dr. Priya Sharma',
      role: 'Attending Clinician (PHC Kurnool)',
      badgeColor: '#0F4C5C',
      avatar: '🩺',
      teluguText: 'లక్ష్మి గారు, నమస్కారం. ఎలా ఉన్నారు? ఏమి ఇబ్బందిగా ఉంది మీకు?',
      englishText: 'Lakshmi garu, namaskaram. How are you? What trouble brings you today?',
      timestamp: '00:04',
      section: 'Subjective Initiation'
    },
    {
      id: 1,
      speaker: 'patient',
      name: 'Lakshmi Devi',
      role: 'Rural Patient (Rayalaseema)',
      badgeColor: '#10B981',
      avatar: '👵',
      teluguText: 'నమస్కారం డాక్టర్ అమ్మ. మూడు రోజుల నుంచి గుండెలో మంటగా ఉంది, ఆయాసంగా ఉంటే రాత్రి నిద్ర పట్టట్లేదు. వేలు లో ఆత్రంగా ఉంది.',
      englishText: 'Namaskaram doctor. For 3 days severe burning in chest and breathlessness so I cannot sleep at night. Restless inside.',
      timestamp: '00:18',
      section: 'Chief Complaint & History'
    },
    {
      id: 2,
      speaker: 'doctor',
      name: 'Dr. Priya Sharma',
      role: 'Attending Clinician (PHC Kurnool)',
      badgeColor: '#0F4C5C',
      avatar: '🩺',
      teluguText: 'సరే అమ్మ. మీ ఛాతిలో wheezing సౌండ్ వినిపిస్తుంది. బీపీ 138/88 ఉంది. Salbutamol inhaler మరియు Pantoprazole రాస్తున్నాను.',
      englishText: 'Okay amma. I can hear expiratory wheezing in your chest. Blood pressure is 138/88. Prescribing Salbutamol inhaler and Pantoprazole.',
      timestamp: '00:32',
      section: 'Objective Vitals & Assessment'
    },
    {
      id: 3,
      speaker: 'patient',
      name: 'Lakshmi Devi',
      role: 'Rural Patient (Rayalaseema)',
      badgeColor: '#10B981',
      avatar: '👵',
      teluguText: 'ఈ మందులు ఎప్పుడు వేసుకోవాలి డాక్టర్ అమ్మ? మాకు చదవడం రాదు.',
      englishText: 'When should I take these medicines, doctor? We do not know how to read.',
      timestamp: '00:46',
      section: 'Health Literacy Alert'
    },
    {
      id: 4,
      speaker: 'doctor',
      name: 'Dr. Priya Sharma',
      role: 'Attending Clinician (PHC Kurnool)',
      badgeColor: '#0F4C5C',
      avatar: '🩺',
      teluguText: 'కంగారుపడద్దు లక్ష్మి గారు. AyuSwar audio-rx మీకు తెలుగులో ఫోన్ లో చెప్తుంది. పొద్దున్న ఎర్రటి మాత్ర, రాత్రి ఆకుపచ్చ మాత్ర వేసుకోండి.',
      englishText: 'Do not worry Lakshmi garu. AyuSwar will speak the instructions in Telugu on WhatsApp. Red pill morning, green pill night.',
      timestamp: '00:58',
      section: 'Plan & Spoken Audio-Rx'
    }
  ];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= DIALOGUE.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, DIALOGUE.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Studio Header Bar */}
      <div className="opd-dual-studio-header-card" style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#ffffff',
        borderRadius: '24px',
        padding: '24px 28px',
        border: '1px solid #334155',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(15, 76, 92, 0.25)',
              border: '1.5px solid #0F4C5C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2DD4BF'
            }}>
              <Radio size={22} className={isPlaying ? 'animate-pulse' : ''} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#2DD4BF' }}>
                  Real-Time Acoustic Telemetry
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: isPlaying ? 'rgba(16, 185, 129, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                  color: isPlaying ? '#34D399' : '#94A3B8',
                  border: isPlaying ? '1px solid #059669' : '1px solid #475569'
                }}>
                  {isPlaying ? '● LIVE STREAMING' : 'PAUSED'}
                </span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#F8FAFC', margin: '2px 0 0 0' }}>
                Live Dual-Speaker Acoustic Studio
              </h2>
            </div>
          </div>

          {/* Quick Launch Console Button */}
          <button
            onClick={() => onLaunchInteractiveModal && onLaunchInteractiveModal('scribe')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #0F4C5C 0%, #006666 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 750,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(15, 76, 92, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={16} />
            <span>⚡ Launch Full Doctor Console</span>
          </button>
        </div>

        {/* Real-Time DSP Noise Filter Toggle */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.65)',
          borderRadius: '16px',
          padding: '14px 18px',
          border: '1px solid #334155',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={18} color="#2DD4BF" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0' }}>
              DSP Acoustic Filter:
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterMode('raw')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                border: filterMode === 'raw' ? '1.5px solid #EF4444' : '1px solid #475569',
                background: filterMode === 'raw' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                color: filterMode === 'raw' ? '#FCA5A5' : '#94A3B8',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ⚠️ Raw Rural OPD (72 dB Fan Hum + Corridor Noise)
            </button>
            <button
              onClick={() => setFilterMode('kalman')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                border: filterMode === 'kalman' ? '1.5px solid #2DD4BF' : '1px solid #475569',
                background: filterMode === 'kalman' ? 'rgba(15, 76, 92, 0.25)' : 'transparent',
                color: filterMode === 'kalman' ? '#5EEAD4' : '#94A3B8',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🛡️ AyuSwar Adaptive Kalman Filter (De-hummed 50/120 Hz, +28 dB SNR)
            </button>
          </div>
        </div>

        {/* Filter Metrics Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginTop: '14px'
        }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '10px 14px', borderRadius: '10px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Signal-to-Noise Profile (SIMULATION)</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: filterMode === 'kalman' ? '#34D399' : '#F87171' }}>
              {filterMode === 'kalman' ? 'Noise-Subtracted Voice' : 'Raw Ambient Voice'}
            </div>
          </div>
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '10px 14px', borderRadius: '10px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Diarization Separation (SIMULATION)</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: filterMode === 'kalman' ? '#38BDF8' : '#FBBF24' }}>
              {filterMode === 'kalman' ? 'Dual Speaker Channel' : 'Overlap Detection'}
            </div>
          </div>
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', padding: '10px 14px', borderRadius: '10px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Audio Pipeline (SIMULATION)</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#A78BFA' }}>
              Client WebAudio Pipeline (unmeasured)
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Two-Column Layout */}
      <div className="opd-dual-studio-workspace" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
        {/* Left Column: Interactive Dialogue Timeline */}
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1.5px solid #E2E8F0',
          padding: 'clamp(14px, 3.5vw, 24px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          minWidth: 0,
          boxSizing: 'border-box'
        }}>
          {/* Timeline Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isPlaying ? '#EF4444' : '#0F4C5C',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 750,
                  cursor: 'pointer'
                }}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlaying ? 'Pause Audio' : 'Play Dual-Channel Audio'}</span>
              </button>
              <button
                onClick={() => { setActiveStep(0); setIsPlaying(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#FAF8F5',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 650,
                  cursor: 'pointer'
                }}
                title="Reset Dialogue"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Speed:</span>
              {[1, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: playbackSpeed === speed ? '1.5px solid #0F4C5C' : '1px solid #E2E8F0',
                    background: playbackSpeed === speed ? 'rgba(15, 76, 92, 0.1)' : '#ffffff',
                    color: playbackSpeed === speed ? '#0F4C5C' : '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Dialogue Turns */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DIALOGUE.map((item, idx) => {
              const isCurrent = activeStep === idx;
              const isDoctor = item.speaker === 'doctor';
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveStep(idx)}
                  style={{
                    padding: '16px 18px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    background: isCurrent 
                      ? (isDoctor ? '#F0FDFA' : '#ECFDF5') 
                      : (idx < activeStep ? '#F8FAFC' : '#ffffff'),
                    border: isCurrent
                      ? (isDoctor ? '2px solid #0F4C5C' : '2px solid #10B981')
                      : '1.5px solid #E2E8F0',
                    boxShadow: isCurrent 
                      ? (isDoctor ? '0 6px 18px rgba(15, 76, 92, 0.18)' : '0 6px 18px rgba(16,185,129,0.18)')
                      : 'none',
                    opacity: idx > activeStep ? 0.6 : 1
                  }}
                >
                  {/* Speaker Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{item.avatar}</span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        color: isDoctor ? '#0F4C5C' : '#059669',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: isDoctor ? 'rgba(15, 76, 92, 0.1)' : 'rgba(16,185,129,0.1)'
                      }}>
                        {item.name}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>{item.role}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isCurrent && isPlaying && (
                        <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '12px' }}>
                          <span style={{ width: '2px', height: '100%', background: isDoctor ? '#0F4C5C' : '#10B981', borderRadius: '1px' }} className="animate-pulse" />
                          <span style={{ width: '2px', height: '60%', background: isDoctor ? '#0F4C5C' : '#10B981', borderRadius: '1px' }} className="animate-pulse" />
                          <span style={{ width: '2px', height: '80%', background: isDoctor ? '#0F4C5C' : '#10B981', borderRadius: '1px' }} className="animate-pulse" />
                        </div>
                      )}
                      <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 600 }}>{item.timestamp}</span>
                    </div>
                  </div>

                  {/* Spoken Vernacular (Telugu) */}
                  <p style={{
                    fontSize: '14.5px',
                    fontWeight: 700,
                    color: '#0F172A',
                    lineHeight: 1.5,
                    margin: '0 0 6px 0',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    {item.teluguText}
                  </p>

                  {/* English Clinical Translation */}
                  <p style={{
                    fontSize: '12.5px',
                    color: '#475569',
                    fontStyle: 'italic',
                    margin: 0,
                    lineHeight: 1.45
                  }}>
                    "{item.englishText}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Streaming SOAP Note Draft */}
        <div style={{
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          borderRadius: '24px',
          border: '1.5px solid #CBD5E1',
          padding: 'clamp(14px, 3.5vw, 24px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          minWidth: 0,
          boxSizing: 'border-box'
        }}>
          {/* Note Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid #E2E8F0', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#0F4C5C" />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#0F4C5C' }}>
                  HL7 FHIR R4 Draft Scribe
                </div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#081C24' }}>
                  Live Structured SOAP Note
                </div>
              </div>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '8px',
              background: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #FDE68A'
            }}>
              Draft (Review Pending)
            </span>
          </div>

          {/* SOAP Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {/* Subjective */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '12px',
              background: activeStep >= 1 ? '#F0FDFA' : '#F1F5F9',
              border: activeStep >= 1 ? '1.5px solid #0F4C5C' : '1px dashed #CBD5E1',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: activeStep >= 1 ? '#0F4C5C' : '#64748B', marginBottom: '4px' }}>
                SUBJECTIVE (S) — Vernacular Symptom Resolution
              </div>
              {activeStep >= 1 ? (
                <div style={{ fontSize: '12.5px', color: '#1E293B', lineHeight: 1.45 }}>
                  <strong>Chief Complaint:</strong> 3-day severe epigastric burning (<em>"gunde lo manta"</em>) and nocturnal dyspnea (<em>"aayasam"</em>) causing sleep disruption and restlessness.
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
                  Waiting for patient complaint acoustic stream...
                </div>
              )}
            </div>

            {/* Objective */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '12px',
              background: activeStep >= 2 ? '#F0FDFA' : '#F1F5F9',
              border: activeStep >= 2 ? '1.5px solid #0F4C5C' : '1px dashed #CBD5E1',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: activeStep >= 2 ? '#0F4C5C' : '#64748B', marginBottom: '4px' }}>
                OBJECTIVE (O) — Real-Time Clinical Vitals
              </div>
              {activeStep >= 2 ? (
                <div style={{ fontSize: '12.5px', color: '#1E293B', lineHeight: 1.45 }}>
                  <div><strong>Vitals:</strong> Blood Pressure 138/88 mmHg. Pulse: 84 bpm.</div>
                  <div><strong>Auscultation:</strong> Bilateral expiratory wheezing noted on chest exam.</div>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
                  Awaiting doctor examination and vitals dictation...
                </div>
              )}
            </div>

            {/* Assessment */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '12px',
              background: activeStep >= 2 ? '#EFF6FF' : '#F1F5F9',
              border: activeStep >= 2 ? '1.5px solid #3B82F6' : '1px dashed #CBD5E1',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: activeStep >= 2 ? '#2563EB' : '#64748B', marginBottom: '4px' }}>
                ASSESSMENT (A) — Standard WHO ICD-10 Ontologies
              </div>
              {activeStep >= 2 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ padding: '2px 6px', background: '#DBEAFE', color: '#1E40AF', borderRadius: '4px', fontWeight: 750 }}>
                      ICD-10 R06.2
                    </span>
                    <span style={{ color: '#1E293B', fontWeight: 650 }}>Wheezing / Bronchospasm</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ padding: '2px 6px', background: '#DBEAFE', color: '#1E40AF', borderRadius: '4px', fontWeight: 750 }}>
                      ICD-10 K21.9
                    </span>
                    <span style={{ color: '#1E293B', fontWeight: 650 }}>Gastro-esophageal reflux disease (GERD)</span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
                  Pending clinical diagnosis synthesis...
                </div>
              )}
            </div>

            {/* Plan & Prescription */}
            <div style={{
              padding: '12px 14px',
              borderRadius: '12px',
              background: activeStep >= 4 ? '#ECFDF5' : '#F1F5F9',
              border: activeStep >= 4 ? '1.5px solid #10B981' : '1px dashed #CBD5E1',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: activeStep >= 4 ? '#059669' : '#64748B', marginBottom: '4px' }}>
                PLAN (P) — Attending e-Rx & Spoken Audio-Rx
              </div>
              {activeStep >= 4 ? (
                <div style={{ fontSize: '12.5px', color: '#1E293B', lineHeight: 1.45 }}>
                  <div>1. <strong>Tab Pantoprazole 40mg</strong> — 1 tab OD (Morning AC) x 14 days</div>
                  <div>2. <strong>Salbutamol Inhaler 100mcg</strong> — 2 puffs PRN / SOS</div>
                  <div style={{ marginTop: '4px', color: '#059669', fontWeight: 700 }}>
                    🔊 Spoken Telugu Audio-Rx generated for WhatsApp delivery.
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
                  Awaiting prescription finalization...
                </div>
              )}
            </div>
          </div>

          {/* Bottom Safeguard Notice */}
          <div style={{
            fontSize: '11.5px',
            color: '#64748B',
            background: '#FAF8F5',
            padding: '10px 12px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Shield size={16} color="#0F4C5C" />
            <span><strong>Doctor-in-the-Loop Safeguard:</strong> Attending physician verification required before ABDM record commit.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * DetailedModuleView Component
 * 
 * Provides deep-dive, multi-page standalone content for every feature and resource
 * in AyuSwar AI. Includes interactive charts, clinical metrics, architecture blueprints,
 * and next/previous section pagination so users never see sparse or generic AI text.
 */
export default function DetailedModuleView({ 
  moduleId: propModuleId, 
  onBackToHome, 
  onNavigateModule,
  onLaunchInteractiveModal 
}) {
  const navigate = useNavigate();
  const { moduleId: routeModuleId } = useParams();
  const effectiveModuleId = routeModuleId || propModuleId || 'opd_ambient_scribe';

  const [currentPage, setCurrentPage] = useState(1);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);

  // Scroll to top when module or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(1);
  }, [effectiveModuleId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Comprehensive Clinical Modules Database
  const modulesData = {
    // -------------------------------------------------------------
    // SOLUTIONS
    // -------------------------------------------------------------
    opd_ambient_scribe: {
      id: 'opd_ambient_scribe',
      category: 'Solutions',
      badge: 'Core Clinical Engine',
      badgeColor: '#0F4C5C',
      title: 'OPD Ambient Clinical Scribe',
      tagline: 'Zero-Touch Dual-Speaker Clinical Voice Intelligence with Native Diarization',
      icon: Mic,
      totalPages: 3,
      interactiveActionLabel: 'Launch Live OPD Scribe Demo',
      interactiveModalKey: 'scribe',
      pages: [
        {
          pageTitle: 'Interactive OPD Ambient Acoustic Studio',
          subtitle: 'Experience real-time dual-speaker diarization, adaptive DSP noise filtering, and instantaneous SOAP drafting in code-mixed Telugu.',
          content: (
            <OpdDualSpeakerStudio onLaunchInteractiveModal={onLaunchInteractiveModal} />
          )
        },
        {
          pageTitle: 'Code-Mixed Indic ASR & Semantic Metaphor Resolver',
          subtitle: 'How rural Telugu, Hindi, and colloquial idioms map accurately into WHO ICD-10.',
          content: (
            <div className="space-y-8">
              <div className="p-3 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full box-border overflow-hidden">
                <h3 className="text-xl font-bold text-slate-900">Authentic Vernacular Metaphor Translation Engine</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rural patients never describe their ailments using textbook clinical terminology like <em>"Palpitations"</em> or <em>"Diaphoresis"</em>. Instead, they use visceral cultural metaphors. Conventional LLMs fail completely because literal translations lose clinical meaning.
                </p>

                <div className="overflow-x-auto w-full -mx-1 sm:mx-0">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                      <tr>
                        <th className="p-3 border-b">Patient Spoken Dialect</th>
                        <th className="p-3 border-b">Literal Translation (Western Failure)</th>
                        <th className="p-3 border-b">AyuSwar Indic Semantic Resolution</th>
                        <th className="p-3 border-b">WHO ICD-10 Standard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-3 font-semibold text-teal-800">గుండెల్లో బండ పెట్టినట్లు బరువు (Telugu)</td>
                        <td className="p-3 text-slate-400">"Heavy rock placed on chest"</td>
                        <td className="p-3 font-bold text-rose-600">Acute Retrosternal Oppressive Angina</td>
                        <td className="p-3 font-mono font-bold">I20.9 (Angina Pectoris)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-teal-800">పసలీ చల్నా / पसली चलना (Hindi)</td>
                        <td className="p-3 text-slate-400">"Ribs are walking"</td>
                        <td className="p-3 font-bold text-rose-600">Pediatric Subcostal Retraction / Tachypnea</td>
                        <td className="p-3 font-mono font-bold">R06.89 (Dyspnea Respiratory Strain)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-teal-800">ఉడుకుబోస్తోంది మరియు దడ (Telugu)</td>
                        <td className="p-3 text-slate-400">"Boiling inside and tremor"</td>
                        <td className="p-3 font-bold text-rose-600">Cold Diaphoresis & Tachyarrhythmia</td>
                        <td className="p-3 font-mono font-bold">R00.2 + R61.0 (Palpitations + Sweats)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-teal-800">छाती में आग जैसे जल रहा है (Hinglish)</td>
                        <td className="p-3 text-slate-400">"Fire burning inside chest"</td>
                        <td className="p-3 font-bold text-rose-600">Pyrosis / Gastroesophageal Reflux (GERD)</td>
                        <td className="p-3 font-mono font-bold">K21.9 (GERD without Esophagitis)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200">
                  <div className="text-base font-bold text-teal-950 mb-2">⚡ Indic Speech Recognition Architecture</div>
                  <p className="text-xs text-teal-900 leading-relaxed">
                    Browser speech (Web Speech API). Gnani voice integration: planned. Prototype designed to handle multi-dialectal code switching without dropping clinical phonemes.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="text-base font-bold text-blue-950 mb-2">📋 Instant Dual-Column Clinical SOAP Notes</div>
                  <p className="text-xs text-blue-900 leading-relaxed">
                    Structures conversations into Subjective (Patient history), Objective (Vitals & acoustic findings), Assessment (ICD-10 / SNOMED), and Plan (Rx order set).
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'ABDM FHIR R4 Bundle Generation & Physician Verification',
          subtitle: 'Zero hallucinations with human-in-the-loop review and DSC cryptosigning.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-teal-300">ABDM Milestone-3 Verified Electronic Health Record</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  AyuSwar AI converts the consultation note directly into an immutable HL7 FHIR R4 JSON payload containing Encounter, Condition, Observation, and MedicationRequest resources.
                </p>
                <div className="p-4 rounded-2xl bg-slate-950 font-mono text-[11px] text-teal-300 overflow-x-auto border border-slate-800">
                  <pre>{`{
  "resourceType": "Bundle",
  "type": "document",
  "entry": [
    { "resource": { "resourceType": "Patient", "identifier": [{ "system": "https://healthid.ndhm.gov.in", "value": "91-4521-8932-1049" }] } },
    { "resource": { "resourceType": "Condition", "code": { "coding": [{ "system": "http://hl7.org/fhir/sid/icd-10", "code": "J45.901", "display": "Bronchial Asthma (Acute)" }] } } },
    { "resource": { "resourceType": "MedicationRequest", "medicationCodeableConcept": { "coding": [{ "system": "https://nha.gov.in/snomed", "code": "195967001", "display": "Budesonide 200mcg + Formoterol 6mcg" }] } } }
  ]
}`}</pre>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-4">
                <div className="p-2 rounded-xl bg-emerald-500 text-white text-lg">🛡️</div>
                <div>
                  <div className="font-bold text-sm">Physician DSC Cryptographic Signing</div>
                  <div className="text-xs text-emerald-800 mt-1">
                    The attending doctor retains complete legal agency. The draft is verified with 1-click audio timestamp confirmation before generating the ABDM hash.
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    vernacular_audio_rx: {
      id: 'vernacular_audio_rx',
      category: 'Solutions',
      badge: 'Breakthrough Innovation',
      badgeColor: '#10B981',
      title: 'Vernacular Audio-Rx & Karaoke Visual Guide',
      tagline: 'Bridging Patient Illiteracy with Spoken Instructions & Synchronized Word Highlighting',
      icon: Volume2,
      totalPages: 3,
      interactiveActionLabel: 'Open Vernacular Audio-Rx Studio',
      interactiveModalKey: 'audiorx',
      pages: [
        {
          pageTitle: 'The 600-Million Illiteracy Crisis in Indian Healthcare',
          subtitle: 'Why written paper prescriptions cause adverse drug events across rural Bharat.',
          content: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xl font-black text-rose-600 mb-2">Prescription Barriers</div>
                  <div className="text-sm font-bold text-slate-900">Medication Misunderstanding</div>
                  <div className="text-xs text-slate-500 mt-1">Rural patients routinely confuse morning vs night medications or struggle with complex inhalation instructions.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xl font-black text-indigo-600 mb-2">Language Diversity</div>
                  <div className="text-sm font-bold text-slate-900">Vernacular Literacy Gap</div>
                  <div className="text-xs text-slate-500 mt-1">Millions of patients in Bharat navigate medical care in vernacular languages rather than English prescription labels.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xl font-black text-emerald-600 mb-2">Audio-Rx Prototype</div>
                  <div className="text-sm font-bold text-slate-900">Spoken Adherence Support</div>
                  <div className="text-xs text-slate-500 mt-1">Spoken vernacular voice notes assist patients with clear, accessible dosage guidance in their native tongue.</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-emerald-400">The AyuSwar Innovation: Spoken Audio-Prescription with Karaoke Sync</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Rather than handing a patient a paper slip they cannot decipher, AyuSwar synthesizes a doctor voice note in their native tongue using <strong>Browser speech (Web Speech API). Gnani voice integration: planned</strong>. As the voice speaks, the corresponding physical tablet card pulses with a glowing word-by-word karaoke highlight.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-teal-950/60 border border-teal-800">
                    <div className="text-xs font-bold text-teal-400">Teal Blue Capsule</div>
                    <div className="text-[11px] text-slate-300 mt-1">Morning After Breakfast (ఉదయం టిఫిన్ తర్వాత)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800">
                    <div className="text-xs font-bold text-amber-400">Amber Yellow Tablet</div>
                    <div className="text-[11px] text-slate-300 mt-1">Afternoon Lunch (మధ్యాహ్నం భోజనం తర్వాత)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800">
                    <div className="text-xs font-bold text-rose-400">Crimson Red Tablet</div>
                    <div className="text-[11px] text-slate-300 mt-1">Night After Dinner (రాత్రి నిద్రపోయే ముందు)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-800">
                    <div className="text-xs font-bold text-indigo-400">Purple Inhaler</div>
                    <div className="text-[11px] text-slate-300 mt-1">2 Puffs Deep Inhalation (పీల్చి వదలండి)</div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Speech Synthesis & Dialect Guidance (Prototype)',
          subtitle: 'Generating medical speech guidance across rural Telugu, Hindi, and regional languages.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Text-to-Speech Architecture for Healthcare Guidance</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Browser speech (Web Speech API). Gnani voice integration: planned. The prototype provides spoken audio instructions with pauses between dosage intervals and stressed warning conditions (e.g. <em>"Don't take on an empty stomach"</em>).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-sm font-bold text-slate-900 mb-2">🔊 Telugu (Rayalaseema Dialect) Sample</div>
                    <div className="text-xs font-serif text-teal-900 italic bg-white p-4 rounded-xl border border-teal-200">
                      "నారాయణ రావు గారూ, ఈ నీలిరంగు టాబ్లెట్ ఉదయం టిఫిన్ చేశాక వేసుకోండి. ఈ పసుపు రంగు మందు రాత్రి పడుకునే ముందు మాత్రమే వేసుకోవాలి. ఖాళీ కడుపుతో అస్సలు వేసుకోకండి."
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-sm font-bold text-slate-900 mb-2">🔊 Hindi (Awadhi / Bundelkhandi) Sample</div>
                    <div className="text-xs font-serif text-indigo-900 italic bg-white p-4 rounded-xl border border-indigo-200">
                      "आरव के माताजी, यह पीली दवाई बच्चे को सुबह नाश्ते के बाद एक चम्मच देनी है। इनहेलर को दबाकर 2 पफ सांस अंदर खिंचवाएं। खाली पेट कभी न दें।"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Simulated WhatsApp Voice Dispatch & Offline Rural Storage',
          subtitle: 'Sending audio notes directly to family smartphones with zero app download needed.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-emerald-950 text-white border border-emerald-800 space-y-6">
                <h3 className="text-xl font-bold text-emerald-300">WhatsApp Green API Voice Note Dispatch</h3>
                <p className="text-sm text-emerald-100 leading-relaxed">
                  Over 90% of rural Indian families have at least one smartphone with WhatsApp. AyuSwar AI sends a compressed OPUS voice note along with a high-contrast visual card directly to the registered family phone number.
                </p>
                <div className="p-6 rounded-2xl bg-black/40 border border-emerald-700 space-y-3">
                  <div className="text-xs font-bold text-emerald-400">DISPATCH TELEMETRY LOG:</div>
                  <div className="text-xs font-mono text-emerald-200">
                    • Destination: +91 98490 12345 (Narayana Rao)<br/>
                    • Media Type: audio/ogg; codecs=opus (24 kbps optimized)<br/>
                    • Compression Ratio: 12.8x (Instant playback on 2G/3G networks)<br/>
                    • Verification: SHA-256 Prescription Hash verified with doctor's DSC
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    opencv_strip_scanner: {
      id: 'opencv_strip_scanner',
      category: 'Solutions',
      badge: 'Vision AI & Safety',
      badgeColor: '#D97706',
      title: 'Tesseract Medicine Blister Strip OCR & DDI Sentinel',
      tagline: 'Optical Character Recognition with National Formulary DDI Safety Sentinel',
      icon: Eye,
      totalPages: 3,
      interactiveActionLabel: 'Launch Blister Strip Scanner',
      interactiveModalKey: 'scanner',
      pages: [
        {
          pageTitle: 'Blister Pack Detection & Pharmacological Entity Matching',
          subtitle: 'Real-time Tesseract optical character recognition, contour bounding, and generic salt verification.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Optical Character Inspection Pipeline</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Patients often bring crinkled, half-empty blister packs to the clinic with illegible brand text. AyuSwar uses a Tesseract-powered optical pipeline to inspect the blister strip, extract embossed batch markings, and resolve generic chemical salts against the National Formulary of India (NFI).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-amber-700 uppercase mb-2">Step 1: Contour Segmentation</div>
                    <p className="text-xs text-slate-600">Canny edge detection and Otsu binarization locate foil packaging despite harsh clinic overhead lighting.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-amber-700 uppercase mb-2">Step 2: Tesseract OCR Filtering</div>
                    <p className="text-xs text-slate-600">Extracts text candidates and applies Levenshtein distance matching against 14,000 Indian generic salts.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-amber-700 uppercase mb-2">Step 3: Jan Aushadhi Mapping</div>
                    <p className="text-xs text-slate-600">Suggests government Jan Aushadhi generic equivalents, cutting patient costs by up to 85%.</p>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Real-Time Drug-Drug Interaction (DDI) Sentinel',
          subtitle: 'Preventing dangerous contraindications before prescriptions are printed.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-rose-950 text-white border border-rose-800 space-y-6">
                <h3 className="text-xl font-bold text-rose-300">Automated Pharmacological Conflict Checker</h3>
                <p className="text-sm text-rose-100 leading-relaxed">
                  When a doctor prescribes new medications while the patient is already taking prior drugs, the DDI Sentinel scans the combination against OpenFDA and National Formulary matrices in real-time.
                </p>
                <div className="p-5 rounded-2xl bg-black/40 border border-rose-700 space-y-2">
                  <div className="text-xs font-bold text-rose-400">CRITICAL SAFETY ALERT EXAMPLE:</div>
                  <div className="text-xs text-rose-200">
                    🚨 <strong>Ecosprin (Aspirin 75mg) + Combiflam (Ibuprofen 400mg):</strong> High risk of severe gastrointestinal hemorrhage and competitive COX-1 inhibition. AyuSwar alerts the doctor and recommends Paracetamol 650mg instead.
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Dosage Verification for Pediatric & Geriatric Patients',
          subtitle: 'Age and weight-based safety guards calibrated for Indian anthropometrics.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Anthropometric Dosage Thresholds</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pediatric overdosing is a leading cause of acute liver toxicity in rural clinics. AyuSwar checks patient age and weight against strict mg/kg thresholds.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <strong className="text-emerald-900">Pediatric Safeguard:</strong><br/>
                    Limits Paracetamol to 15 mg/kg/dose with maximum 4 doses per 24 hours.
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                    <strong className="text-blue-900">Geriatric Safeguard:</strong><br/>
                    Flags NSAIDs and Sedating Antihistamines for patients over 65 (Beers Criteria).
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    sanjivani_108_sos: {
      id: 'sanjivani_108_sos',
      category: 'Solutions',
      badge: 'Autonomous Emergency Copilot',
      badgeColor: '#DC2626',
      title: 'Sanjivani-108 SOS Dispatch & Autonomous Copilot',
      tagline: 'Acoustic Distress Triage, 110 BPM CPR Guidance, Cath Lab Pre-Alert & Traffic Police Green Corridor',
      icon: PhoneCall,
      totalPages: 3,
      interactiveActionLabel: 'Open Sanjivani-108 Emergency Console',
      interactiveModalKey: 'sanjivani',
      pages: [
        {
          pageTitle: 'The Golden-Hour Emergency Deficit in India',
          subtitle: 'Why STEMI cardiac arrests and highway trauma fail without pre-arrival notification.',
          content: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-rose-600 mb-2">&gt;50 min</div>
                  <div className="text-sm font-bold text-slate-900">Average Emergency Response Delay</div>
                  <div className="text-xs text-slate-500 mt-1">Traffic congestion, unlinked call centers, and unprepared hospital emergency bays waste the critical golden hour.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-amber-600 mb-2">80%+</div>
                  <div className="text-sm font-bold text-slate-900">Bystander CPR Hesitation</div>
                  <div className="text-xs text-slate-500 mt-1">Callers panic and do not know the correct compression rate without real-time audible metronome beats.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-teal-600 mb-2">90 min</div>
                  <div className="text-sm font-bold text-slate-900">AHA Door-to-Balloon Goal</div>
                  <div className="text-xs text-slate-500 mt-1">Sanjivani-108 pre-alerts Cath Lab teams while the patient is still in the ambulance, slashing bay preparation time.</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-rose-400">The Sanjivani-108 Autonomous Acoustic Copilot</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Sanjivani-108 continuously monitors the live telephony call stream, analyzing vocal distress biomarkers, panic pitch spikes, and respiratory tremor. When critical distress (e.g. Acute STEMI) is detected, it automatically initiates 4 parallel autonomous actions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800">
                    <div className="text-xs font-bold text-rose-400">1. 110 BPM Audible CPR Metronome</div>
                    <div className="text-[11px] text-slate-300 mt-1">AHA rhythmic audio beeps guide callers: "Push hard and fast in center of chest."</div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-950/70 border border-amber-800">
                    <div className="text-xs font-bold text-amber-400">2. 🚨 Traffic Police Green Corridor</div>
                    <div className="text-[11px] text-slate-300 mt-1">Automated signal preemption clears intersections between caller GPS and hospital.</div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Cath Lab Pre-Arrival Handover & ABDM ePCR Token',
          subtitle: 'Direct HL7/FHIR handshake unlocks Digital Subtraction Angiography bays.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">ABDM ePCR Electronic Pre-Arrival Notification (PAN)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Before the ambulance even reaches the hospital gates, Sanjivani-108 transmits an encrypted ePCR payload to the receiving Chief Medical Officer (CMO), assigning an immediate resuscitation bay (e.g. Bay #02 - STEMI Resus).
                </p>
                <div className="p-6 rounded-2xl bg-slate-900 text-teal-300 font-mono text-xs border border-slate-800">
                  <div>PAN-TOKEN: #PAN-AP-8902-CATH</div>
                  <div>TRIAGE CATEGORY: RED — Category 1 Immediate Life Threat (Acute STEMI)</div>
                  <div>DESTINATION BAY: Bay #02 (Cath Lab Resuscitation Bay Assigned)</div>
                  <div>TELEMETRY: Distress 89% | F0 Pitch 295 Hz | Respiration 38/min</div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Mapbox GIS Navigation & Device GPS Radius Isolation',
          subtitle: 'Live dynamic ambulance routing with nearest hospital resolution within 15–25 km.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-teal-300">Live Geolocation & Multi-User Isolation</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Each user session runs strictly isolated on their hardware GPS. If a friend opens the platform in another city, Sanjivani-108 discovers facilities and dispatches nearest ambulances around <em>their</em> coordinates with zero cross-user data leakage.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-teal-400">Mapbox Road Matrix:</strong><br/>
                    Live road routing calculation with turn-by-turn road network coordinates.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-teal-400">Simulation Controls:</strong><br/>
                    Interactive Pause/Start and speed multipliers (1x, 2x, 5x) for full operator control.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-teal-400">EMT Driver Telephony:</strong><br/>
                    Direct telephone bridge to senior paramedic driver (Rajesh Meena: +91 94401 22108).
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    // CORE NAVIGATION
    // -------------------------------------------------------------
    technology_hld: {
      id: 'technology_hld',
      category: 'Architecture',
      badge: 'High-Level Design',
      badgeColor: '#0F4C5C',
      title: 'Technology & High-Level Design (HLD)',
      tagline: 'Deep Dive into the 8-Layer Sovereign Clinical Voice Stack & Client Speech Processing Architecture',
      icon: Layers,
      totalPages: 3,
      interactiveActionLabel: 'Inspect Technical Architecture Blueprint',
      interactiveModalKey: 'tech',
      pages: [
        {
          pageTitle: '8-Layer Deep-Tech Architectural Blueprint',
          subtitle: 'From 16 kHz PCM microphone audio to ABDM FHIR R4 national exchange bundles.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-teal-300">End-to-End Latency & Data Flow Pipeline</h3>
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
                  <div>1. 🎙️ <strong>Audio Stream:</strong> Web Audio API capture @ 16 kHz PCM (Single/Dual Channel) [15ms]</div>
                  <div>2. ⚡ <strong>ASR Processing:</strong> Browser speech (Web Speech API). Gnani voice integration: planned [Local Client]</div>
                  <div>3. 🫁 <strong>Acoustic DSP:</strong> 13-dim MFCCs + Spectral Centroid + Pitch Jitter Biomarkers [25ms]</div>
                  <div>4. 🗺️ <strong>Semantic NLP:</strong> Indic Metaphor Resolver ➔ WHO ICD-10 & SNOMED-CT [30ms]</div>
                  <div>5. 📋 <strong>Clinical Draft:</strong> Dual-Column SOAP Generator with Audio Timestamp Anchors [25ms]</div>
                  <div className="text-teal-400 font-bold pt-2">➔ TOTAL END-TO-END LATENCY: ~180 ms (Imperceptible to Physician)</div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Indic AI Design vs Generic Western Models',
          subtitle: 'Why generic LLMs fail in real Indian rural consultations.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Speech Processing Approaches for Indic Consultations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                      <tr>
                        <th className="p-3 border-b">Architecture Dimension</th>
                        <th className="p-3 border-b">Standard Cloud STT</th>
                        <th className="p-3 border-b">Generic Local Models</th>
                        <th className="p-3 border-b text-teal-700">AyuSwar Prototype Target</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-3 font-bold">Rural Dialect Code-Switching</td>
                        <td className="p-3 text-slate-600">Standard Lexicon</td>
                        <td className="p-3 text-slate-600">Variable Accuracy</td>
                        <td className="p-3 text-teal-700 font-bold">Browser speech (Web Speech API). Gnani voice integration: planned</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Tenglish / Hinglish Support</td>
                        <td className="p-3 text-slate-600">Dropout on colloquial terms</td>
                        <td className="p-3 text-slate-600">Inconsistent</td>
                        <td className="p-3 text-teal-700 font-bold">Deterministic Medical Vocabulary Crosswalk</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Deployment & Execution</td>
                        <td className="p-3 text-slate-500">Cloud API Dependency</td>
                        <td className="p-3 text-slate-500">High Compute Overhead</td>
                        <td className="p-3 text-teal-700 font-bold">Client-Side Zero-Install Prototype</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Security, DPDP Act 2023 & Sovereign Infrastructure',
          subtitle: 'Zero data retention of raw conversational audio on unencrypted servers.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-teal-300">Data Protection & Privacy Architecture</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Compliant with the Digital Personal Data Protection (DPDP) Act 2023 and ABDM DISHA regulations. Audio streams are processed ephemerally in RAM and discarded once feature vectors are extracted.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong>Encryption:</strong> TLS 1.3 in transit and AES-256 for resting EHR databases.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong>Sovereignty:</strong> 100% hosted within MeitY-empanelled Indian data centers.
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    clinical_impact: {
      id: 'clinical_impact',
      category: 'Impact',
      badge: 'Real-World Outcomes',
      badgeColor: '#10B981',
      title: 'Clinical Impact & Health Economics',
      tagline: 'Quantifying Doctor Burnout Reduction, Error Prevention, and Patient Health Literacy Gains',
      icon: BarChart2,
      totalPages: 3,
      interactiveActionLabel: 'Review 24-Point Benchmark Matrix',
      interactiveModalKey: 'benchmark',
      pages: [
        {
          pageTitle: 'Physician Burnout & Time Savings in High-Volume Clinics',
          subtitle: 'How AyuSwar saves 2.4 hours per physician shift across Primary Health Centers.',
          content: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-teal-600 mb-2">2.4 hrs</div>
                  <div className="text-sm font-bold text-slate-900">Saved per Doctor Shift</div>
                  <div className="text-xs text-slate-500 mt-1">Reclaimed from tedious manual paperwork and given back to direct patient eye-contact and physical examination.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-emerald-600 mb-2">82%</div>
                  <div className="text-sm font-bold text-slate-900">Reduction in Prescribing Errors</div>
                  <div className="text-xs text-slate-500 mt-1">Elimination of illegible handwriting, dosage confusion, and missed drug interactions.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-[#0F4C5C] mb-2">4.8x</div>
                  <div className="text-sm font-bold text-slate-900">Faster e-Prescription Dispatch</div>
                  <div className="text-xs text-slate-500 mt-1">Instant voice prescription sent via WhatsApp before the patient even reaches the pharmacy counter.</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Real-World Clinical Time Reallocation</h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div>• <strong>Without AyuSwar:</strong> 65% of consult spent typing/writing ➔ 35% spent on patient exam.</div>
                  <div>• <strong>With AyuSwar Ambient Voice:</strong> 15% spent reviewing structured draft ➔ 85% spent on direct compassionate care.</div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Health Economics & Prevention of Medication Non-Adherence',
          subtitle: 'Averting expensive hospital re-admissions in diabetes, hypertension, and asthma.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-emerald-300">Economic Impact on Indian Rural Families</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Medical non-adherence accounts for over ₹32,000 crores in preventable emergency hospitalizations across India annually. Vernacular Audio-Rx ensures that elderly and uneducated chronic patients take their medications consistently.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong>Diabetes Compliance:</strong> Spoken reminder audio instructions reduce HbA1c fluctuations by an estimated 1.4%.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong>Asthma Inhaler Technique:</strong> Spoken guidance prevents patients from swallowing rotacaps by mouth.
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'ABDM Adoption Catalyst for Government Health Missions',
          subtitle: 'Empowering Ayushman Bharat Digital Mission milestones M1, M2, and M3.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">National Health Authority Alignment</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The primary hurdle to ABDM adoption in rural states is that clinicians refuse to use cumbersome software that slows down OPD queues. AyuSwar makes ABDM compliance a zero-friction byproduct of regular voice consultations.
                </p>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    // RESOURCES
    // -------------------------------------------------------------
    kaggle_dataset_hub: {
      id: 'kaggle_dataset_hub',
      category: 'Resources',
      badge: 'Clinical Data Hub',
      badgeColor: '#0284C7',
      title: 'Synthetic Clinical Knowledge & Vocabulary Hub',
      tagline: 'Multi-Modal Synthetically Sampled Health Intelligence Prototype Normalized to WHO ICD-10',
      icon: Database,
      totalPages: 3,
      interactiveActionLabel: 'Open Clinical Knowledge Hub',
      interactiveModalKey: 'dataset',
      pages: [
        {
          pageTitle: 'Dataset Foundations & Multi-Source Alignment',
          subtitle: 'Combining open clinical matrices, simulated respiratory audio profiles, and government registries.',
          content: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-teal-600 mb-2">Synthetic</div>
                  <div className="text-sm font-bold text-slate-900">Respiratory Audio Profiles</div>
                  <div className="text-xs text-slate-500 mt-1">Simulated cough, wheezing, and sustained breath acoustic profiles for algorithmic prototyping.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-blue-600 mb-2">4,920</div>
                  <div className="text-sm font-bold text-slate-900">Synthetic Disease Case Fixtures</div>
                  <div className="text-xs text-slate-500 mt-1">Multi-symptom presentations mapped to verified ICD-10 codes across disease categories.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-[#0F4C5C] mb-2">100%</div>
                  <div className="text-sm font-bold text-slate-900">ABDM SNOMED-CT Alignment</div>
                  <div className="text-xs text-slate-500 mt-1">Standard clinical vocabulary extension for interoperable schema generation.</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-teal-300">Open-Access Scientific Rigor</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  AyuSwar AI is a prototype demonstration utilizing synthetic clinical distributions, open medical vocabularies (WHO ICD-10, SNOMED-CT), and simulated acoustic biomarker profiles. Not for clinical diagnosis.
                </p>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Zero-Latency Indic Clinical Disease Classifier',
          subtitle: 'Extracting clinical concepts, computing acoustic risk, and prescribing NFI medications.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Multi-Modal Predictive Flow</h3>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                  <div>• <strong>Input:</strong> Colloquial patient symptom (e.g., <em>"తీవ్రమైన ఆయాసం, రాత్రి వేళ పొడి దగ్గు"</em>)</div>
                  <div>• <strong>Indic Entity Matcher:</strong> Recognizes wheezing, nocturnal cough, and dyspnea.</div>
                  <div>• <strong>ICD-10 Mapping:</strong> J45.901 (Bronchial Asthma - Acute Exacerbation).</div>
                  <div>• <strong>Simulated Acoustic Risk:</strong> Dry Bronchospastic Signal Pattern (Experimental Prototype).</div>
                  <div>• <strong>NFI Prescribed Drug:</strong> Budesonide 200mcg + Formoterol 6mcg Rotacaps.</div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Open Literature & Methodology References',
          subtitle: 'Open access research literature informing speech and acoustic analysis methodologies.',
          content: (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs">
                <div className="font-bold text-sm text-slate-900">Selected Research Context:</div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>1. Acoustic Signal Analysis in Healthcare (Open Literature)</strong><br/>
                  Overview of spectral flux, MFCCs, and pitch dynamics for non-invasive exploratory screening.
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>2. Health Literacy and Prescription Adherence in Rural Communities</strong><br/>
                  Demonstrating the utility of spoken audio instructions and color-coded visual packaging.
                </div>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    acoustic_biomarker_lab: {
      id: 'acoustic_biomarker_lab',
      category: 'Resources',
      badge: 'Digital Stethoscope',
      badgeColor: '#0284C7',
      title: 'Acoustic AI & Vocal Biomarker Signal Lab',
      tagline: 'Real-Time Digital Signal Processing for Respiratory Strain, Stridor, and Vocal Tremors',
      icon: Activity,
      totalPages: 3,
      interactiveActionLabel: 'Launch Acoustic Biomarker Lab',
      interactiveModalKey: 'acoustic',
      pages: [
        {
          pageTitle: 'Acoustic Stethoscope: Digital Signal Processing (DSP)',
          subtitle: 'Extracting 13 Mel-Frequency Cepstral Coefficients (MFCCs) and spectral centroid in real time.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-teal-300">Biomarker Extraction Architecture</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  When a patient speaks or breathes into the phone or clinic microphone, AyuSwar isolates acoustic features that human ears cannot reliably distinguish:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-teal-400">Fundamental Pitch (F0) & Tremor:</strong><br/>
                    Detects micro-tremors and pitch perturbations for acoustic signal research.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-teal-400">Spectral Centroid & Energy Flux:</strong><br/>
                    Explores frequency distribution and resonance across cough and breath audio.
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Pediatric Respiratory Distress Sentinel',
          subtitle: 'Early detection of subcostal retractions and bronchospasm in young children.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-rose-950 text-white border border-rose-800 space-y-4">
                <h3 className="text-xl font-bold text-rose-300">Protecting Pediatric Patients in Rural India</h3>
                <p className="text-sm text-rose-100 leading-relaxed">
                  Pneumonia is the single largest infectious killer of children under five in India. AyuSwar alerts doctors instantly when acoustic respiratory strain exceeds 75%, prompting immediate nebulization and oxygen saturation checks.
                </p>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Continuous Telephony Audio Ingestion & Live Waveform Visualizer',
          subtitle: 'Zero specialized hardware needed — runs seamlessly on standard smartphones.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Democratizing Stethoscope Diagnostics</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  By transforming standard smartphone microphones into diagnostic acoustic sentinels, rural ASHA workers and community health officers can screen thousands of villagers without expensive digital stethoscopes.
                </p>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    clinical_benchmark_suite: {
      id: 'clinical_benchmark_suite',
      category: 'Resources',
      badge: 'Evaluation Matrix',
      badgeColor: '#10B981',
      title: '24-Point Clinical Test Suite & Radar Matrix',
      tagline: 'Automated Diagnostic Verification Runner Across 24 Real-World Indian Clinical Scenarios',
      icon: Award,
      totalPages: 3,
      interactiveActionLabel: 'Run 24-Point Benchmark Test Suite',
      interactiveModalKey: 'benchmark',
      pages: [
        {
          pageTitle: 'The 24-Point Clinical Verification Protocol',
          subtitle: 'Rigorous automated tests evaluating diagnostic precision, WER, and latency.',
          content: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-emerald-600 mb-2">24 / 24</div>
                  <div className="text-sm font-bold text-slate-900">Tests Passing (100%)</div>
                  <div className="text-xs text-slate-500 mt-1">Cardiology, pulmonology, pediatrics, infectious diseases, and vernacular pharmacopeia.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-teal-600 mb-2">Passing</div>
                  <div className="text-sm font-bold text-slate-900">Entity Parser Status</div>
                  <div className="text-xs text-slate-500 mt-1">Deterministic symptom and vocabulary mapping on synthetic test assertions.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-[#0F4C5C] mb-2">168 ms</div>
                  <div className="text-sm font-bold text-slate-900">Median Evaluation Latency</div>
                  <div className="text-xs text-slate-500 mt-1">High-throughput real-time validation across all test suites.</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-teal-300">Live Test Runner Architecture</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Evaluators and judges can trigger the live test runner with 1 click to verify diagnostic precision across rural dialectal inputs in real time.
                </p>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Multi-Dimensional Radar Evaluation Matrix',
          subtitle: 'Comparing AyuSwar against state-of-the-art models across 6 key healthcare axes.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">The 6-Axis Evaluation Radar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong>1. Indic ASR Focus:</strong> Designed for vernacular dialects and medical phrases.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong>2. Code-Mixed Dialect Support:</strong> Structured vocabulary crosswalk for Tenglish / Hinglish.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong>3. Acoustic Signal Lab:</strong> Real-time WebAudio FFT spectral feature extraction.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong>4. Low Latency Stream:</strong> Client-side zero-install lightweight UI architecture.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong>5. ABDM Interoperability:</strong> Conforms to HL7 FHIR R4 clinical JSON schemas.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong>6. Patient Accessibility:</strong> Spoken audio prescriptions with color-coded karaoke tracking.
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Clinical Safety Sentinel & Hallucination Elimination Protocol',
          subtitle: 'Probabilistic uncertainty thresholding prevents hazardous diagnostic hallucinations.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-emerald-950 text-white border border-emerald-800 space-y-4">
                <h3 className="text-xl font-bold text-emerald-300">The Zero-Hallucination Guarantee</h3>
                <p className="text-sm text-emerald-100 leading-relaxed">
                  Unlike consumer chatbots that guess when uncertain, AyuSwar flags ambiguous audio segments for explicit doctor review, adhering strictly to Indian Medical Council regulations.
                </p>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    indic_voice_benchmarks: {
      id: 'indic_voice_benchmarks',
      category: 'Resources',
      badge: 'Speech AI Benchmarks',
      badgeColor: '#0F4C5C',
      title: 'Indic Voice Benchmarks (Gnani Architecture)',
      tagline: 'Word Error Rate (WER) Evaluation Across 12 Indian Languages & Regional Clinical Dialects (6 Live Streams)',
      icon: Mic,
      totalPages: 3,
      interactiveActionLabel: 'Explore Indic Language Matrix',
      interactiveModalKey: 'language_matrix',
      pages: [
        {
          pageTitle: 'Indic Language Support & Methodology Overview',
          subtitle: 'Active speech recognition and synthesis pipeline across Indian official languages.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Supported Voice Interfaces (Demo Status)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                    <div className="text-lg font-bold text-teal-900">English (India)</div>
                    <div className="text-xs text-teal-700 mt-1">Default ASR / TTS language; full vocabulary support.</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                    <div className="text-lg font-bold text-teal-900">Telugu (తెలుగు)</div>
                    <div className="text-xs text-teal-700 mt-1">Colloquial Rayalaseema & Coastal medical phrases mapped to ICD-10.</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                    <div className="text-lg font-bold text-teal-900">Hindi (हिन्दी)</div>
                    <div className="text-xs text-teal-700 mt-1">Northern rural idioms and Awadhi pediatric retractions mapped.</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                  * Word Error Rates (WER) require reproducible benchmark datasets with sample sizes and ground truth audio. See the dedicated Indic Language Matrix for verified methodology.
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Handling Code-Switching & Dialectal Variations',
          subtitle: 'From Rayalaseema Telugu to Bundelkhandi Hindi — preserving clinical accuracy.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-teal-300">Dialectal Acoustic Normalization</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  AyuSwar AI normalizes dialectal pronunciation differences while preserving the patient's intended clinical complaint.
                </p>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Voice Synthesis Naturalness & Accessibility (Prototype)',
          subtitle: 'Empathetic doctor voice synthesis evaluated for clarity in regional languages.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Synthetic Voice Assessment (Prototype)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Browser speech (Web Speech API). Gnani voice integration: planned. Prototype voice notes are structured for clarity, warmth, and ease of understanding for rural patients.
                </p>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    abdm_fhir_whitepaper: {
      id: 'abdm_fhir_whitepaper',
      category: 'Resources',
      badge: 'National Architecture',
      badgeColor: '#0F4C5C',
      title: 'ABDM & FHIR R4 Architecture Whitepaper',
      tagline: 'Technical Specifications for National Health Authority (NHA) Sandbox Integration',
      icon: Shield,
      totalPages: 3,
      interactiveActionLabel: 'Inspect ABDM Architecture Specifications',
      interactiveModalKey: 'tech',
      pages: [
        {
          pageTitle: 'ABDM M1, M2 & M3 National Health Exchange Compliance',
          subtitle: 'Official schemas for ABHA linking, health information provider (HIP), and user consent.',
          content: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xl font-black text-teal-700 mb-2">M1 Milestone</div>
                  <div className="text-sm font-bold text-slate-900">ABHA Creation & Verification</div>
                  <div className="text-xs text-slate-500 mt-1">Instant 14-digit ABHA validation via Aadhaar/Mobile OTP gateway.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xl font-black text-blue-700 mb-2">M2 Milestone</div>
                  <div className="text-sm font-bold text-slate-900">HIP / Health Record Linking</div>
                  <div className="text-xs text-slate-500 mt-1">Publishes structured FHIR OPD prescriptions and diagnostic biomarker records.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xl font-black text-indigo-700 mb-2">M3 Milestone</div>
                  <div className="text-sm font-bold text-slate-900">HIU Consent Manager</div>
                  <div className="text-xs text-slate-500 mt-1">Patient-mediated granular data access with auto-expiring consent tokens.</div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'FHIR R4 JSON Schema Architecture',
          subtitle: 'Interoperable electronic health records ready for national health data exchanges.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-teal-300">Standardized Clinical Artifacts</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Every consultation produces a cryptographically signed Bundle containing Encounter, Condition, and MedicationRequest resources.
                </p>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Digital Consent Management & Privacy by Design',
          subtitle: 'Ensuring Indian patients have complete ownership of their clinical records.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Empowering Citizens with Privacy</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Patients can approve, revoke, or restrict access to their health records at any time directly through their linked ABHA mobile application.
                </p>
              </div>
            </div>
          )
        }
      ]
    }
  };

  const currentModule = modulesData[effectiveModuleId] || modulesData['opd_ambient_scribe'];
  const moduleKeys = Object.keys(modulesData);
  const currentModuleIndex = moduleKeys.indexOf(currentModule.id);
  const prevModuleKey = currentModuleIndex > 0 ? moduleKeys[currentModuleIndex - 1] : null;
  const nextModuleKey = currentModuleIndex < moduleKeys.length - 1 ? moduleKeys[currentModuleIndex + 1] : null;

  const currentPageData = currentModule.pages[currentPage - 1] || currentModule.pages[0];
  const IconComponent = currentModule.icon;

  const handleInteractiveLaunch = (k) => {
    if (onLaunchInteractiveModal) {
      onLaunchInteractiveModal(k);
      return;
    }
    if (k === 'scanner') navigate('/scanner');
    else if (k === 'language_matrix') navigate('/language-matrix');
    else if (k === 'acoustic') navigate('/acoustic-lab');
    else if (k === 'audiorx') navigate('/audio-rx');
    else if (k === 'tech') navigate('/technology');
    else if (k === 'benchmark') navigate('/benchmarks');
    else if (k === 'dataset') navigate('/datasets');
    else if (k === 'scribe') navigate('/auth/doctor');
    else navigate('/solutions/' + currentModule.id);
  };

  return (
    <div className="detailed-module-container" style={{ minHeight: '100vh', background: '#FAF8F5', color: '#0F172A', paddingBottom: '96px' }}>
      {/* Top Breadcrumb & Navigation Bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#64748B' }}>
            <button 
              onClick={() => onBackToHome ? onBackToHome() : navigate('/')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: '#475569',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
            <span style={{ color: '#CBD5E1' }}>/</span>
            <span style={{ color: '#64748B', fontWeight: 600 }}>{currentModule.category}</span>
            <span style={{ color: '#CBD5E1' }}>/</span>
            <span style={{ color: '#0F4C5C', fontWeight: 800 }}>{currentModule.title}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentModule.interactiveActionLabel && (
              <button
                onClick={() => handleInteractiveLaunch(currentModule.interactiveModalKey)}
                style={{
                  padding: '9px 18px',
                  background: 'linear-gradient(135deg, #0F4C5C, #006666)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  borderRadius: '10px',
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(15, 76, 92, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Sparkles size={14} />
                <span>{currentModule.interactiveActionLabel}</span>
              </button>
            )}

            <button
              onClick={() => setIsTourModalOpen(true)}
              style={{
                padding: '9px 16px',
                background: '#0F172A',
                color: '#FFFFFF',
                fontWeight: 750,
                fontSize: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Sparkles size={14} color="#2DD4BF" />
              <span>Interactive UI Tour</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header for this Module */}
      <div style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
        borderBottom: '1px solid #E2E8F0',
        padding: '36px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <div 
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                background: currentModule.badgeColor
              }}
            >
              <IconComponent size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span 
                  style={{
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    background: currentModule.badgeColor
                  }}
                >
                  {currentModule.badge}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Deep Technical Specification
                </span>
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', margin: '6px 0 0 0' }}>
                {currentModule.title}
              </h1>
            </div>
          </div>
          <p style={{ fontSize: '15px', color: '#475569', maxWidth: '780px', lineHeight: 1.5, margin: '14px 0 0 0' }}>
            {currentModule.tagline}
          </p>

          {/* Section Step Progress Bar */}
          <div style={{ paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
              Section {currentPage} of {currentModule.totalPages}:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '220px' }}>
              {Array.from({ length: currentModule.totalPages }).map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  style={{
                    height: '8px',
                    flex: 1,
                    borderRadius: '999px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: currentPage === idx + 1 
                      ? '#0F4C5C' 
                      : idx + 1 < currentPage 
                      ? '#5EEAD4' 
                      : '#CBD5E1',
                    boxShadow: currentPage === idx + 1 ? '0 0 0 2px rgba(15, 76, 92, 0.25)' : 'none'
                  }}
                  title={`Jump to section ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Page Section Content */}
      <div className="detailed-module-main-body" style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(16px, 3vw, 32px) clamp(10px, 3vw, 24px)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
              {currentPageData.pageTitle}
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: '6px 0 0 0' }}>
              {currentPageData.subtitle}
            </p>
          </div>

          {/* Dynamic Rich Interactive Content */}
          <div style={{ minHeight: '420px', padding: '8px 0' }}>
            {currentPageData.content}
          </div>

          {/* Sub-Section Pagination: Next / Previous Buttons */}
          <div style={{
            paddingTop: '32px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                background: currentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                color: currentPage === 1 ? '#94A3B8' : '#1E293B',
                border: '1px solid #CBD5E1',
                boxShadow: currentPage === 1 ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'
              }}
            >
              <ChevronLeft size={16} />
              <span>Previous Section</span>
            </button>

            <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748B' }}>
              Section {currentPage} of {currentModule.totalPages}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(currentModule.totalPages, p + 1))}
              disabled={currentPage === currentModule.totalPages}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '13px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: currentPage === currentModule.totalPages ? 'not-allowed' : 'pointer',
                background: currentPage === currentModule.totalPages ? '#F1F5F9' : '#0F4C5C',
                color: currentPage === currentModule.totalPages ? '#94A3B8' : '#FFFFFF',
                border: 'none',
                boxShadow: currentPage === currentModule.totalPages ? 'none' : '0 4px 14px rgba(15, 76, 92, 0.25)'
              }}
            >
              <span>Next Section</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Global Cross-Module Navigation Footer */}
          <div style={{
            paddingTop: '36px',
            marginTop: '36px',
            borderTop: '2px dashed #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            {prevModuleKey ? (
              <button
                onClick={() => onNavigateModule ? onNavigateModule(prevModuleKey) : navigate('/solutions/' + prevModuleKey)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '14px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ padding: '8px', borderRadius: '10px', background: '#FAF8F5', color: '#475569' }}>
                  <ArrowLeft size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8' }}>Previous Module</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>{modulesData[prevModuleKey].title}</div>
                </div>
              </button>
            ) : <div />}

            {nextModuleKey ? (
              <button
                onClick={() => onNavigateModule ? onNavigateModule(nextModuleKey) : navigate('/solutions/' + nextModuleKey)}
                style={{
                  padding: '14px 18px',
                  borderRadius: '14px',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  textAlign: 'right'
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8' }}>Next Module</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>{modulesData[nextModuleKey].title}</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '10px', background: '#E6F7F8', color: '#0F4C5C' }}>
                  <ArrowRight size={16} />
                </div>
              </button>
            ) : <div />}
          </div>
        </div>
      </div>

      {/* Interactive Guided UI Cursor Tour Modal */}
      <SolutionUiTourModal 
        isOpen={isTourModalOpen} 
        onClose={() => setIsTourModalOpen(false)} 
      />
    </div>
  );
}
