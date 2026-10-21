import React, { useState, useEffect, useMemo, useRef } from 'react';
import { RotateCcw, Volume2, Key, AlertTriangle, Send, Info, CheckCircle2 } from 'lucide-react';

/**
 * HandDrawnExplainer Component
 * 
 * World-Class Hand-Drawn Whiteboard Explainer:
 * 1. Real-time progressive draw-on:
 *    - Each box outer border draws stroke-by-stroke in real-time when its stage becomes active!
 *    - Connecting sketchy arrows draw between boxes in real-time.
 * 2. Perfect auto-fit: Content sits safely inside comfortable bounds with ZERO lines cutting across text.
 * 3. Step-by-step active narration:
 *    - Step 1 (Listen, LIVE): Ambient audio capture
 *    - Step 2 (Keywords, DEMO): Colloquial Indic dialect parser
 *    - Step 3 (Risk, DEMO): Non-diagnostic vocal biomarker screening
 *    - Step 4 (Guidance, PLANNED): ABDM FHIR R4 & Spoken Rx
 * 4. Transparent privacy & vendor notice:
 *    'Browser speech recognition may send audio to the browser vendor (e.g. Google in Chrome)'.
 * 5. Replay button & prefers-reduced-motion support.
 */
export default function HandDrawnExplainer() {
  const [activeStep, setActiveStep] = useState(0); // 0, 1, 2, 3
  const [drawnSteps, setDrawnSteps] = useState([0]); // which steps have been drawn
  const [animKey, setAnimKey] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const STEPS = [
    {
      id: 'listen',
      stepNum: '01',
      title: 'Listen',
      subtitle: 'Ambient Audio Intake',
      chip: 'LIVE',
      chipColor: '#10B981',
      chipBg: '#ECFDF5',
      chipBorder: '#A7F3D0',
      icon: Volume2,
      summary: 'Captures ambient doctor-patient dialogue via browser Web Speech API and local AudioContext FFT.',
      caption: 'Stage 1 [LIVE]: Live ambient consultation audio intake via Web Speech API & local AudioContext DSP.'
    },
    {
      id: 'keywords',
      stepNum: '02',
      title: 'Keywords',
      subtitle: 'Indic Dialect NLP',
      chip: 'DEMO',
      chipColor: '#0284C7',
      chipBg: '#F0F9FF',
      chipBorder: '#BAE6FD',
      icon: Key,
      summary: 'Maps colloquial vernacular idioms (e.g., Telugu "పీకల్లో పిల్లికూతలు") to clinical ICD-10 & SNOMED CT concepts.',
      caption: 'Stage 2 [DEMO]: Translating regional colloquial symptoms into standardized clinical concepts.'
    },
    {
      id: 'risk',
      stepNum: '03',
      title: 'Risk',
      subtitle: 'Biomarker Heuristics',
      chip: 'DEMO',
      chipColor: '#D97706',
      chipBg: '#FFFBEB',
      chipBorder: '#FDE68A',
      icon: AlertTriangle,
      summary: 'Evaluates non-diagnostic acoustic biomarkers (wheeze/stridor formants) and priority triage urgency flags.',
      caption: 'Stage 3 [DEMO]: Screening acoustic wheeze formants and flagging clinical risk tiers for doctor sign-off.'
    },
    {
      id: 'guidance',
      stepNum: '04',
      title: 'Guidance',
      subtitle: 'ABDM FHIR & Spoken Rx',
      chip: 'PLANNED',
      chipColor: '#7C3AED',
      chipBg: '#F5F3FF',
      chipBorder: '#DDD6FE',
      icon: Send,
      summary: 'Structures FHIR R4 JSON bundles, regional Gnani voice instructions, and patient WhatsApp delivery.',
      caption: 'Stage 4 [PLANNED]: Future interoperability with ABDM FHIR R4 schema bundles, Gnani TTS, and WhatsApp wa.me.'
    }
  ];

  // Authentic sketchy SVG box path with hand-drawn organic wobbles
  // viewBox: 0 0 240 280, giving 280px generous height so no text ever gets intersected!
  const sketchyBoxPaths = [
    // Box 1 path
    "M 12 14 C 70 11, 175 16, 226 12 C 230 75, 227 195, 230 266 C 172 269, 70 264, 11 268 C 8 200, 13 80, 12 14 Z",
    // Box 2 path
    "M 10 16 C 68 13, 178 12, 228 15 C 226 80, 230 190, 228 267 C 170 265, 68 268, 12 266 C 14 198, 9 78, 10 16 Z",
    // Box 3 path
    "M 13 13 C 75 15, 172 12, 227 14 C 229 78, 227 198, 229 268 C 174 266, 72 267, 10 265 C 12 195, 11 82, 13 13 Z",
    // Box 4 path
    "M 11 15 C 72 12, 174 14, 226 13 C 228 82, 229 192, 227 266 C 175 268, 70 265, 12 267 C 10 196, 12 79, 11 15 Z"
  ];

  // Connecting Hand-Drawn Arrow Paths
  const sketchyArrowPaths = [
    // Arrow 1 -> 2
    "M 2 14 C 12 11, 20 17, 30 14",
    // Arrow 2 -> 3
    "M 2 14 C 10 16, 22 12, 30 14",
    // Arrow 3 -> 4
    "M 2 14 C 11 13, 19 15, 30 14"
  ];

  // Progressive real-time timer
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setActiveStep(prev => {
        const next = (prev + 1) % STEPS.length;
        setDrawnSteps(d => d.includes(next) ? d : [...d, next]);
        return next;
      });
    }, 3200);

    return () => clearInterval(timer);
  }, [isAutoPlaying, animKey]);

  const handleReplay = () => {
    setActiveStep(0);
    setDrawnSteps([0]);
    setIsAutoPlaying(true);
    setAnimKey(prev => prev + 1);
  };

  const handleSelectStep = (index) => {
    setActiveStep(index);
    setDrawnSteps(d => d.includes(index) ? d : [...d, index]);
    setIsAutoPlaying(false);
  };

  return (
    <div 
      className="triage-sketch-explainer"
      style={{
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto 32px auto',
        background: '#FAF7F2',
        border: '2px solid #E2D9CD',
        borderRadius: '24px',
        padding: '28px clamp(16px, 3vw, 32px)',
        boxShadow: '0 8px 30px rgba(68, 64, 60, 0.06), inset 0 0 100px rgba(245, 240, 230, 0.5)',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      {/* Blueprint Grid Paper Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(214, 205, 194, 0.35) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(214, 205, 194, 0.35) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
        pointerEvents: 'none',
        borderRadius: '24px'
      }} />

      {/* Header Bar */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '28px',
        paddingBottom: '16px',
        borderBottom: '1.5px dashed #D6CEC1'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 850, background: '#FEF3C7', color: '#B45309', padding: '3px 10px', borderRadius: '12px', border: '1px solid #FDE68A', letterSpacing: '0.4px' }}>
              ✏️ REAL-TIME DRAWN PIPELINE
            </span>
            <span style={{ fontSize: '12.5px', color: '#78716C', fontWeight: 700 }}>
              Live Clinical Data-Bus
            </span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 850, color: '#1C1917', margin: 0, letterSpacing: '-0.3px' }}>
            AyuSwar Ambient Consultation Pipeline
          </h2>
        </div>

        {/* Replay Story Button */}
        <button
          onClick={handleReplay}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '12px',
            border: '2px solid #0F4C5C',
            background: '#0F4C5C',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(15, 76, 92, 0.28)',
            transition: 'all 0.2s ease'
          }}
          title="Replay real-time stroke-by-stroke animation"
        >
          <RotateCcw size={15} />
          <span>Replay Story</span>
        </button>
      </div>

      {/* 4 Big Boxes in One Row with Real-Time Connecting Arrows */}
      <div 
        key={animKey}
        className="pipeline-four-boxes-container"
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '26px'
        }}
      >
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          const isDrawn = drawnSteps.includes(idx);

          return (
            <React.Fragment key={step.id}>
              {/* Individual Hand-Drawn Box */}
              <div
                onClick={() => handleSelectStep(idx)}
                className={`pipeline-sketch-card ${isActive ? 'active-card' : ''}`}
                style={{
                  position: 'relative',
                  flex: '1 1 0',
                  minWidth: 0,
                  minHeight: '270px',
                  borderRadius: '18px',
                  cursor: 'pointer',
                  background: isActive ? '#FFFFFF' : '#FAF6F0',
                  padding: '22px 18px 20px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isActive ? `0 10px 28px rgba(0, 0, 0, 0.08), 0 0 0 3px ${step.chipColor}25` : '0 2px 8px rgba(0, 0, 0, 0.03)',
                  transition: 'background 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease',
                  boxSizing: 'border-box'
                }}
              >
                {/* SVG Real-Time Hand-Drawn Outer Border */}
                <svg
                  viewBox="0 0 240 280"
                  preserveAspectRatio="none"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    overflow: 'visible',
                    borderRadius: '18px'
                  }}
                >
                  <defs>
                    <filter id={`roughShadow-${idx}`} x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={step.chipColor} floodOpacity={isActive ? "0.2" : "0.05"} />
                    </filter>
                  </defs>

                  {/* Base Sketchy Border */}
                  <path
                    d={sketchyBoxPaths[idx]}
                    fill="none"
                    stroke={isActive ? step.chipColor : (isDrawn ? '#8E8883' : '#D1C7BD')}
                    strokeWidth={isActive ? '3' : '2'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={`url(#roughShadow-${idx})`}
                    style={{
                      strokeDasharray: 1100,
                      strokeDashoffset: isDrawn ? 0 : 1100,
                      animation: isDrawn 
                        ? `realtimeDraw 1.4s cubic-bezier(0.2, 0.8, 0.2, 1) ${idx * 0.25}s forwards`
                        : 'none'
                    }}
                  />

                  {/* Second faint hand-drawn pass for authentic sketch texture */}
                  <path
                    d={sketchyBoxPaths[idx]}
                    fill="none"
                    stroke={isActive ? step.chipColor : '#A8A29E'}
                    strokeWidth="1.2"
                    strokeDasharray="4 3"
                    strokeOpacity={isActive ? "0.6" : "0.35"}
                    style={{
                      transform: 'scale(0.985) translate(1.5px, 1.5px)'
                    }}
                  />
                </svg>

                {/* Card Inner Content - safely inside bounds */}
                <div style={{ position: 'relative', zIndex: 1, padding: '2px 4px' }}>
                  {/* Top Bar: Icon + Chip */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '11px',
                      background: `${step.chipColor}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: step.chipColor
                    }}>
                      <Icon size={22} />
                    </div>

                    {/* Status Chip */}
                    <span style={{
                      fontSize: '11.5px',
                      fontWeight: 850,
                      color: step.chipColor,
                      background: step.chipBg,
                      border: `1.5px solid ${step.chipBorder}`,
                      padding: '3px 10px',
                      borderRadius: '8px',
                      letterSpacing: '0.4px'
                    }}>
                      {step.chip}
                    </span>
                  </div>

                  {/* Title & Step */}
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#A8A29E', marginBottom: '3px' }}>
                    STEP {step.stepNum}
                  </div>
                  <h3 style={{ fontSize: '19px', fontWeight: 850, color: '#1C1917', margin: '0 0 4px 0' }}>
                    {step.title}
                  </h3>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: step.chipColor, marginBottom: '10px' }}>
                    {step.subtitle}
                  </div>

                  {/* Summary Text */}
                  <p style={{ fontSize: '13px', color: '#44403C', lineHeight: 1.5, margin: 0 }}>
                    {step.summary}
                  </p>
                </div>

                {/* Footer Active Indicator */}
                <div style={{
                  position: 'relative',
                  zIndex: 1,
                  marginTop: '16px',
                  paddingTop: '10px',
                  borderTop: '1px dashed #E5DED4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ 
                    fontSize: '11.5px', 
                    fontWeight: 800, 
                    color: isActive ? step.chipColor : '#78716C',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    {isActive ? (
                      <>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: step.chipColor, display: 'inline-block', boxShadow: `0 0 6px ${step.chipColor}` }} />
                        ACTIVE STAGE
                      </>
                    ) : (
                      '○ Standby'
                    )}
                  </span>
                  {isActive && (
                    <CheckCircle2 size={15} color={step.chipColor} />
                  )}
                </div>
              </div>

              {/* Connecting Hand-Drawn Arrow Between Boxes (Desktop) */}
              {idx < STEPS.length - 1 && (
                <div 
                  className="pipeline-arrow-divider"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    flexShrink: 0
                  }}
                >
                  <svg 
                    viewBox="0 0 32 28" 
                    style={{ width: '32px', height: '28px', overflow: 'visible' }}
                  >
                    <defs>
                      <marker id={`arrowHead-${idx}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 8 5 L 0 9 z" fill={drawnSteps.includes(idx + 1) ? "#0F4C5C" : "#A8A29E"} />
                      </marker>
                    </defs>
                    <path
                      d={sketchyArrowPaths[idx]}
                      fill="none"
                      stroke={drawnSteps.includes(idx + 1) ? "#0F4C5C" : "#C4BBB0"}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      markerEnd={`url(#arrowHead-${idx})`}
                      style={{
                        strokeDasharray: 50,
                        strokeDashoffset: drawnSteps.includes(idx + 1) ? 0 : 50,
                        transition: 'stroke-dashoffset 0.8s ease'
                      }}
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Active Step 1-Line Caption */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        background: '#FFFFFF',
        border: '1.5px solid #D6CEC1',
        borderRadius: '14px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
      }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 900,
          background: STEPS[activeStep].chipColor,
          color: '#FFFFFF',
          padding: '3px 10px',
          borderRadius: '6px',
          flexShrink: 0
        }}>
          {STEPS[activeStep].chip}
        </span>
        <span style={{ fontSize: '14px', fontWeight: 650, color: '#1C1917', lineHeight: 1.45 }}>
          {STEPS[activeStep].caption}
        </span>
      </div>

      {/* Honest Privacy & Vendor Note */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        background: '#F5F5F4',
        border: '1px solid #E7E5E4',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <Info size={17} color="#0F4C5C" style={{ marginTop: '2px', flexShrink: 0 }} />
        <span style={{ fontSize: '12.5px', color: '#57534E', lineHeight: 1.5 }}>
          <strong style={{ color: '#292524' }}>Privacy & Vendor Notice: </strong>
          Browser speech recognition may send audio to the browser vendor (e.g. Google in Chrome). Backend credentials remain strictly on protected server endpoints and are not bundled into public client builds.
        </span>
      </div>

      {/* CSS Real-Time Draw Keyframes & Mobile Layout */}
      <style>{`
        @keyframes realtimeDraw {
          0% {
            stroke-dashoffset: 1100;
            opacity: 0.2;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }

        .pipeline-sketch-card:hover {
          transform: translateY(-3px);
        }

        .active-card {
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .pipeline-four-boxes-container {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .pipeline-arrow-divider {
            transform: rotate(90deg);
            margin: -4px auto !important;
            width: 24px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pipeline-sketch-card path {
            animation: none !important;
            stroke-dashoffset: 0 !important;
          }
          .pipeline-sketch-card {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
