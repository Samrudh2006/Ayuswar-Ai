import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Volume2, 
  Clock, 
  X,
  Stethoscope,
  TrendingDown,
  Download,
  Mic
} from 'lucide-react';
import { audioMutex } from '../services/clinicalTelemetry';
import { speechService } from '../services/indicSpeechService';

const DEMO_ENCOUNTER_SCRIPT = [
  {
    speaker: 'Doctor (డాక్టర్)',
    role: 'doctor',
    text: 'నమస్కారం నారాయణ రావు గారు, రండి కూర్చోండి. ఏం ఇబ్బందిగా ఉంది మీకు?',
    timeOffset: 0,
    extractedConcept: null
  },
  {
    speaker: 'Patient (పేషెంట్)',
    role: 'patient',
    text: 'నమస్కారం డాక్టర్ అమ్మ. రెండు రోజుల నుండి ఛాతీలో మంటగా ఉండి గుండెల్లో దడగా ఉడుకుబోస్తోంది... రాత్రి పడుకుంటే ఆయాసం ఎక్కువవుతోంది.',
    timeOffset: 4,
    extractedConcept: {
      vernacular: 'గుండెల్లో దడ & ఛాతీలో మంట',
      concept: 'Palpitations & Retrosternal Pyrosis',
      icd10: 'R00.2 / K21.9',
      snomed: '80313002',
      severity: 'Urgent'
    }
  },
  {
    speaker: 'Doctor (డాక్టర్)',
    role: 'doctor',
    text: 'అవునా... భోజనం తర్వాత తేన్పులు రావడం, నోట్లోకి పుల్లటి నీళ్లు రావడం జరుగుతుందా? నడిస్తే ఛాతీ బరువుగా ఉందా?',
    timeOffset: 12,
    extractedConcept: null
  },
  {
    speaker: 'Patient (పేషెంట్)',
    role: 'patient',
    text: 'లేదు డాక్టర్, నడిస్తే నెప్పి లేదు కానీ కారం తిన్నాక పుల్లటి తేన్పులు వస్తున్నాయి. రాత్రి నిద్ర సరిగా పట్టలేదు.',
    timeOffset: 19,
    extractedConcept: {
      vernacular: 'పుల్లటి తేన్పులు',
      concept: 'Acid Eructation & Dyspepsia',
      icd10: 'K30',
      snomed: '373674004',
      severity: 'Normal'
    }
  },
  {
    speaker: 'Doctor (డాక్టర్)',
    role: 'doctor',
    text: 'సరేనండి, బీపీ 130/84 ఉంది, ఈసీజీ సాధారణంగా ఉంది. గుండె జబ్బు కాదు, తీవ్రమైన అసిడిటీ మరియు గ్యాస్ట్రో-ఈసోఫాజియల్ రిఫ్లక్స్ వల్ల దడ వస్తోంది.',
    timeOffset: 26,
    extractedConcept: {
      vernacular: 'గ్యాస్ట్రిక్ రిఫ్లక్స్ నిర్ధారణ',
      concept: 'GERD with Secondary Sinus Tachycardia',
      icd10: 'K21.9',
      snomed: '235595009',
      severity: 'Normal'
    }
  },
  {
    speaker: 'Doctor (డాక్టర్)',
    role: 'doctor',
    text: 'ప్యాంటోప్రజోల్ 40mg + డాంపెరిడోన్ 30mg PMBJP జన ఔషధి జెనెరిక్ మాత్రలు రాస్తున్నాను. ఉదయం టిఫిన్ కంటే అరగంట ముందు వేసుకోండి. ₹170 ఖర్చు తగ్గుతుంది.',
    timeOffset: 34,
    extractedConcept: {
      vernacular: 'జన ఔషధి ప్రధాన్ మంత్రి జెనెరిక్ మార్పిడి',
      concept: 'PMBJP Pantoprazole + Domperidone SR',
      priceSavings: '₹198 ➔ ₹28 (86% Patient Savings)',
      savings: '₹170 saved'
    }
  }
];

export default function LiveOpdDemoSimulator({ isOpen, onClose, onApplyToPrescription }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef(null);
  const audioUtteranceRef = useRef(null);

  const startDemo = () => {
    audioMutex.acquire('opd-demo-sim', () => {
      setIsPlaying(false);
    });
    setIsPlaying(true);
    setCurrentLineIndex(0);
    setElapsedSeconds(0);
    setIsCompleted(false);
  };

  const pauseDemo = () => {
    setIsPlaying(false);
    try {
      speechService.stopSpeaking();
    } catch {}
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentLineIndex(-1);
    setElapsedSeconds(0);
    setIsCompleted(false);
    try {
      speechService.stopSpeaking();
    } catch {}
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    audioMutex.release('opd-demo-sim');
  };

  // Speaks dialogue line in natural Telugu with dual personality (Gnani voice or browser fallback)
  const speakDialogueLine = (line) => {
    if (!line || !line.text) return;
    const isDoctor = line.role === 'doctor';
    try {
      speechService.speak(line.text, {
        channel: 'opd-demo-sim',
        langCode: 'te-IN',
        voice: isDoctor ? 'Nalini' : 'Arya',
        pitch: isDoctor ? 1.06 : 0.88,
        rate: isDoctor ? 1.02 : 0.94
      });
    } catch {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(line.text);
          u.lang = 'te-IN';
          u.rate = isDoctor ? 1.05 : 0.94;
          u.pitch = isDoctor ? 1.06 : 0.88;
          window.speechSynthesis.speak(u);
          audioUtteranceRef.current = u;
        } catch {}
      }
    }
  };

  // Replay a single line for video recording retakes
  const replaySingleLine = (line, idx) => {
    setCurrentLineIndex(idx);
    speakDialogueLine(line);
  };

  // Export full clinical dialogue script with phonetic guide for video recording
  const handleExportAudioScript = () => {
    const lines = [
      'AYUSWAR AI — 60s RAYALASEEMA TELUGU OPD ENCOUNTER SCRIPT',
      'Location: Kurnool District Hospital OPD (Rayalaseema)',
      'Doctor: Dr. Priya Sharma, MD (Gnani Voice: Nalini / Pitch 1.06)',
      'Patient: Narayana Rao, 58M (Gnani Voice: Arya / Pitch 0.88)',
      '========================================================================\n',
      ...DEMO_ENCOUNTER_SCRIPT.map((item, i) => {
        return `[T+${item.timeOffset}s] ${item.speaker}:\n"${item.text}"\n${item.extractedConcept ? `➔ RECOGNIZED: ${item.extractedConcept.vernacular} (${item.extractedConcept.concept}) | ICD-10: ${item.extractedConcept.icd10 || 'N/A'}` : ''}\n`;
      }),
      '========================================================================',
      'SOAP NOTE SUMMARY:',
      '• Chief Complaint: Burning chest, palpitations (గుండెల్లో దడ), acid eructation.',
      '• Clinical Diagnosis: GERD with secondary palpitations (ICD-10: K21.9 / R00.2).',
      '• Formulary: PMBJP Pantoprazole 40mg + Domperidone SR (₹28 vs ₹198 brand, 86% savings).'
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AyuSwar_Rayalaseema_OPD_Demo_Video_Script.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds((sec) => {
        const nextSec = sec + 1;
        // Check if next script line matches timeOffset
        const nextLineIdx = DEMO_ENCOUNTER_SCRIPT.findIndex(item => item.timeOffset === nextSec);
        if (nextLineIdx !== -1) {
          setCurrentLineIndex(nextLineIdx);
          speakDialogueLine(DEMO_ENCOUNTER_SCRIPT[nextLineIdx]);
        }

        if (nextSec >= 42) {
          setIsPlaying(false);
          setIsCompleted(true);
          clearInterval(timerRef.current);
        }
        return nextSec;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Initial line speak on start
  useEffect(() => {
    if (isPlaying && currentLineIndex === 0) {
      speakDialogueLine(DEMO_ENCOUNTER_SCRIPT[0]);
    }
  }, [isPlaying, currentLineIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        background: 'rgba(8, 28, 36, 0.78)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        className="modal-content"
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
          border: '1.5px solid rgba(15, 76, 92, 0.2)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #0F4C5C, #0B2530)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={20} color="#5EEAD4" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                Rayalaseema Telugu OPD Consultation Simulation
              </h3>
              <div style={{ fontSize: '11px', color: '#99F6E4' }}>
                Kurnool District Hospital OPD • Ambient Voice Scribe + Live ICD-10 & Jan Aushadhi
              </div>
            </div>
          </div>
          <button 
            onClick={() => { resetDemo(); onClose(); }}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Controls & Metrics Banner */}
        <div style={{
          padding: '12px 20px',
          background: '#FAF8F5',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!isPlaying ? (
              <button 
                onClick={startDemo}
                style={{
                  background: '#0F4C5C',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontSize: '12.5px',
                  fontWeight: 750,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Play size={14} fill="#ffffff" />
                <span>{currentLineIndex === -1 ? 'Start Live Scribe (ప్రారంభించు)' : 'Resume'}</span>
              </button>
            ) : (
              <button 
                onClick={pauseDemo}
                style={{
                  background: '#F59E0B',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontSize: '12.5px',
                  fontWeight: 750,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Pause size={14} />
                <span>Pause</span>
              </button>
            )}

            <button 
              onClick={resetDemo}
              style={{
                background: '#E2E8F0',
                color: '#475569',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 650, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} />
              <span>{elapsedSeconds}s / 42s</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', background: isPlaying ? '#DCFCE7' : '#F1F5F9', color: isPlaying ? '#15803D' : '#64748B', padding: '3px 9px', borderRadius: '8px', fontWeight: 750 }}>
              {isPlaying ? '🔴 LIVE ASR STREAMING' : (isCompleted ? '✓ CONSULTATION COMPLETED' : 'READY')}
            </span>

            <button
              onClick={handleExportAudioScript}
              title="Download Full Encounter Audio Script for Video Recording"
              style={{
                background: '#FAF8F5',
                color: '#0F4C5C',
                border: '1px solid rgba(15, 76, 92, 0.4)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Download size={13} />
              <span>Export Script (.txt)</span>
            </button>
          </div>
        </div>

        {/* Live Conversation Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          background: '#ffffff'
        }}>
          {currentLineIndex === -1 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
              <Volume2 size={40} color="#0F4C5C" style={{ opacity: 0.5, marginBottom: '10px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: 750, color: '#081C24', margin: '0 0 6px 0' }}>
                One-Click Rayalaseema Telugu OPD Simulation
              </h4>
              <p style={{ fontSize: '13px', maxWidth: '440px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
                Click <strong>"Start Live Scribe"</strong> to simulate a live 42-second patient encounter in Kurnool OPD with streaming diarization, automatic ICD-10 extraction, and PMBJP Jan Aushadhi generic substitution.
              </p>
            </div>
          )}

          {DEMO_ENCOUNTER_SCRIPT.slice(0, currentLineIndex + 1).map((line, idx) => {
            const isDoctor = line.role === 'doctor';
            const isLatest = idx === currentLineIndex;

            return (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isDoctor ? 'flex-start' : 'flex-end',
                  animation: 'fadeIn 0.25s ease'
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  background: isDoctor ? '#F0FDF4' : '#F8FAFC',
                  border: isLatest ? '1.5px solid #0F4C5C' : (isDoctor ? '1px solid #BBF7D0' : '1px solid #E2E8F0'),
                  borderRadius: isDoctor ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                  padding: '12px 16px',
                  boxShadow: isLatest ? '0 4px 14px rgba(15, 76, 92, 0.12)' : 'none'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: isDoctor ? '#15803D' : '#0F4C5C',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{line.speaker}</span>
                      {isLatest && isPlaying && (
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444', animation: 'pulse 1s infinite' }} />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => replaySingleLine(line, idx)}
                      title="Play this line (for video recording retake)"
                      style={{
                        background: isDoctor ? 'rgba(21, 128, 61, 0.1)' : 'rgba(15, 76, 92, 0.1)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10.5px',
                        fontWeight: 750,
                        color: isDoctor ? '#15803D' : '#0F4C5C',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Volume2 size={12} />
                      <span>Replay Voice</span>
                    </button>
                  </div>

                  <div style={{ fontSize: '14px', color: '#081C24', lineHeight: 1.5, fontWeight: isDoctor ? 600 : 500 }}>
                    {line.text}
                  </div>

                  {/* Real-time Extracted Medical Concept Pill */}
                  {line.extractedConcept && (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: line.extractedConcept.priceSavings ? '#ECFDF5' : '#FEF3C7',
                      border: line.extractedConcept.priceSavings ? '1px solid #6EE7B7' : '1px solid #FCD34D',
                      fontSize: '11px',
                      color: '#081C24',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 800, color: line.extractedConcept.priceSavings ? '#047857' : '#B45309' }}>
                          ⚡ RECOGNIZED CLINICAL ENTITY
                        </span>
                        {line.extractedConcept.icd10 && (
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, background: '#0F4C5C', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', fontSize: '10px' }}>
                            ICD-10: {line.extractedConcept.icd10}
                          </span>
                        )}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '12px' }}>
                        {line.extractedConcept.vernacular} ➔ {line.extractedConcept.concept}
                      </div>
                      {line.extractedConcept.priceSavings && (
                        <div style={{ color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <TrendingDown size={14} />
                          <span>Jan Aushadhi: {line.extractedConcept.priceSavings}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Consultation Summary on Completion */}
          {isCompleted && (
            <div style={{
              marginTop: '10px',
              padding: '16px',
              borderRadius: '14px',
              background: '#F0FDF4',
              border: '1.5px solid #10B981',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065F46', fontWeight: 800, fontSize: '14px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Live Encounter Complete: Structured ABDM FHIR SOAP Note Drafted!</span>
              </div>
              <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>
                • <strong>Chief Complaint:</strong> Retrosternal burning sensation, palpitations (గుండెల్లో దడ), acid eructation (2 days).<br />
                • <strong>Clinical Diagnosis:</strong> GERD with secondary sinus tachycardia (ICD-10: K21.9 / R00.2).<br />
                • <strong>Formulary Optimization:</strong> Brand Pantoprazole 40mg + Domperidone (₹198) substituted to PMBJP Jan Aushadhi generic (₹28). <strong>Patient saves ₹170!</strong>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  onClick={() => {
                    if (onApplyToPrescription) onApplyToPrescription();
                    onClose();
                  }}
                  style={{
                    background: '#0F4C5C',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  Apply to Active OPD Prescription & Sign
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

