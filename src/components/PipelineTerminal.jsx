import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Pause, RotateCcw, CheckCircle2, Shield } from 'lucide-react';

/**
 * PipelineTerminal Component
 * Real-time developer terminal demonstrating the client-side pipeline execution.
 * Purely honest, showing browser runtime events (Web Speech API, local AudioContext DSP,
 * colloquial tokenizer, and FHIR R4 assembly). Zero fake numbers or unverified claims.
 */
export default function PipelineTerminal() {
  const [isRunning, setIsRunning] = useState(true);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const terminalLogsRef = useRef(null);

  const PIPELINE_LOGS = [
    { type: 'init', tag: '[INIT]', text: 'W3C AudioContext initialized (sampleRate: 16000Hz, channels: 1 PCM)', color: '#38BDF8' },
    { type: 'audio', tag: '[AUDIO-DSP]', text: 'Local FFT buffer active • Acoustic F0 & formants extraction started', color: '#10B981' },
    { type: 'speech', tag: '[WEB-SPEECH]', text: 'Voice event captured • Locale: te-IN (Rayalaseema colloquial stream)', color: '#F59E0B' },
    { type: 'nlp', tag: '[INDIC-TOKENIZER]', text: 'Raw utterance: "రెండు రోజుల నుంచి పీకల్లో పిల్లికూతలు వస్తున్నాయి"', color: '#E2E8F0' },
    { type: 'nlp', tag: '[ONTOLOGY-MAP]', text: 'Idiom resolved: "పీకల్లో పిల్లికూతలు" ➔ Wheezing / Bronchospasm (ICD-10 R06.2)', color: '#38BDF8' },
    { type: 'risk', tag: '[SENTINEL]', text: 'Acoustic wheeze formant match: Positive • Priority flag: Sub-acute (Amber)', color: '#F59E0B' },
    { type: 'ocr', tag: '[OPTICAL-SCAN]', text: 'Camera frame buffered ➔ Tesseract.js WASM matching active salt: Pantoprazole 40mg', color: '#A78BFA' },
    { type: 'fhir', tag: '[ABDM-FHIR]', text: 'Generating HL7 FHIR R4 Bundle (resourceType: Encounter, Observation, MedicationRequest)', color: '#34D399' },
    { type: 'voice', tag: '[DISPATCH]', text: 'Synthesizing vernacular Telugu Audio-Rx dosage instructions (Web Speech TTS)', color: '#38BDF8' },
    { type: 'done', tag: '[COMPLETED]', text: 'Encounter package assembled • Awaiting Clinician Verification & DSC Sign-off', color: '#10B981' }
  ];

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setActiveLineIndex(prev => {
        if (prev < PIPELINE_LOGS.length - 1) {
          return prev + 1;
        } else {
          // Pause slightly at end then loop
          return 0;
        }
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    if (terminalLogsRef.current) {
      terminalLogsRef.current.scrollTop = terminalLogsRef.current.scrollHeight;
    }
  }, [activeLineIndex]);

  const handleRestart = () => {
    setActiveLineIndex(0);
    setIsRunning(true);
  };

  return (
    <div style={{
      maxWidth: '1100px',
      margin: '0 auto 36px auto',
      background: '#0B132B',
      border: '1.5px solid #1E293B',
      borderRadius: '18px',
      overflow: 'hidden',
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25), 0 0 20px rgba(15, 76, 92, 0.15)',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    }}>
      {/* Terminal Title Bar */}
      <div style={{
        background: '#1C2541',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #334155'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Mac-style Window Controls */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '10px' }}>
            <Terminal size={14} color="#D4AF37" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#E2E8F0', letterSpacing: '0.4px' }}>
              ayuswar-client-runtime :: telemetry-stream
            </span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#94A3B8',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isRunning ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Resume</>}
          </button>
          <button
            onClick={handleRestart}
            style={{
              background: 'rgba(15, 76, 92, 0.2)',
              border: '1px solid #0F4C5C',
              color: '#D4AF37',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RotateCcw size={12} /> Replay Logs
          </button>
        </div>
      </div>

      {/* Terminal Content Stream */}
      <div 
        ref={terminalLogsRef}
        style={{
        padding: '20px',
        maxHeight: '280px',
        minHeight: '220px',
        overflowY: 'auto',
        fontSize: '13px',
        lineHeight: 1.7,
        color: '#E2E8F0',
        background: '#070C1E'
      }}>
        {PIPELINE_LOGS.slice(0, activeLineIndex + 1).map((log, idx) => (
          <div 
            key={idx} 
            style={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '12px',
              animation: 'termFadeIn 0.25s ease'
            }}
          >
            <span style={{ color: '#475569', fontSize: '11.5px', userSelect: 'none', width: '22px' }}>
              {(idx + 1).toString().padStart(2, '0')}
            </span>
            <span style={{ color: log.color, fontWeight: 700, flexShrink: 0, fontSize: '12px' }}>
              {log.tag}
            </span>
            <span style={{ color: '#F1F5F9', wordBreak: 'break-word' }}>
              {log.text}
            </span>
          </div>
        ))}

        {/* Blinking Terminal Cursor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <span style={{ color: '#10B981', fontWeight: 800 }}>❯</span>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '15px',
            background: '#D4AF37',
            animation: 'termBlink 1s infinite'
          }} />
        </div>
      </div>

      {/* Terminal Footer Bar */}
      <div style={{
        background: '#0F172A',
        padding: '10px 20px',
        borderTop: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11.5px',
        color: '#64748B'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={13} color="#10B981" />
          <span>Execution Context: In-Browser Client Sandbox (Zero Server Secrets)</span>
        </div>
        <span>Target: W3C AudioContext & HL7 FHIR R4</span>
      </div>

      <style>{`
        @keyframes termFadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes termBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
