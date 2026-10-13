import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  PhoneCall, 
  AlertTriangle, 
  Heart, 
  Mic, 
  Square, 
  CheckCircle2, 
  Activity, 
  MapPin, 
  FileText, 
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  analyzeEmergencyClinicalTriage, 
  simulateEvonDispatchPipeline 
} from '../services/sanjivaniEmergencyService';
import { speechService } from '../services/indicSpeechService';

export default function EmergencyTriageView({ onOpenFullConsole }) {
  const { selectedLanguage } = useApp();

  const [inputText, setInputText] = useState('నాకు తీవ్రమైన గుండె నొప్పిగా ఉంది, చెమటలు పడుతున్నాయి, శ్వాస ఆడటం లేదు');
  const [triageResult, setTriageResult] = useState(() => analyzeEmergencyClinicalTriage(inputText));
  const [isSimulatingDispatch, setIsSimulatingDispatch] = useState(false);
  const [dispatchSteps, setDispatchSteps] = useState([]);
  const [dispatchComplete, setDispatchComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [cprMetronomeActive, setCprMetronomeActive] = useState(false);

  const cprIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cprIntervalRef.current) clearInterval(cprIntervalRef.current);
    };
  }, []);

  const handleTriageAnalyze = (textToUse) => {
    const text = textToUse || inputText;
    const result = analyzeEmergencyClinicalTriage(text);
    setTriageResult(result);
  };

  const handleStartDispatchSimulation = () => {
    setIsSimulatingDispatch(true);
    setDispatchComplete(false);
    setDispatchSteps([]);

    simulateEvonDispatchPipeline({
      coords: { latitude: 15.8281, longitude: 78.0373, accuracy: 12 },
      landmark: 'Near District Hospital Junction, Kurnool',
      triageData: triageResult,
      onToolStep: (step) => {
        setDispatchSteps(prev => [...prev, step]);
      },
      onComplete: () => {
        setIsSimulatingDispatch(false);
        setDispatchComplete(true);
      }
    });
  };

  const handleToggleCprMetronome = () => {
    if (cprMetronomeActive) {
      if (cprIntervalRef.current) clearInterval(cprIntervalRef.current);
      cprIntervalRef.current = null;
      setCprMetronomeActive(false);
    } else {
      setCprMetronomeActive(true);
      // 110 BPM CPR pulse audio beep
      const intervalMs = Math.round(60000 / 110);
      cprIntervalRef.current = setInterval(() => {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
          }
        } catch {}
      }, intervalMs);
    }
  };

  return (
    <div style={{ padding: '36px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#008B8B', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#64748B', fontSize: '13px' }}>Emergency</span>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#0A2540', fontSize: '13px', fontWeight: 700 }}>Sanjivani-108 Simulator</span>
      </div>

      {/* Real Emergency Advisory Callout */}
      <div style={{ background: '#FEF2F2', border: '2px solid #F87171', borderRadius: '16px', padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ background: '#DC2626', color: '#FFFFFF', padding: '10px', borderRadius: '12px', flexShrink: 0 }}>
          <PhoneCall size={24} />
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 850, color: '#991B1B', marginBottom: '4px' }}>
            ACTUAL MEDICAL EMERGENCY? DIAL 112 OR 108 IMMEDIATELY
          </div>
          <p style={{ fontSize: '13px', color: '#B91C1C', lineHeight: 1.5, margin: 0 }}>
            This application is an educational prototype simulation. It cannot dispatch real emergency ambulances or reserve hospital trauma beds. If someone is experiencing severe chest pain, breathing cessation, or traumatic bleeding, call official emergency services without delay.
          </p>
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
            <Activity size={14} />
            <span>INTERACTIVE SIMULATION PROTOTYPE</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 850, color: '#0A2540', marginBottom: '10px' }}>
            Sanjivani-108 Emergency Acoustic Triage Simulator
          </h1>
          <p style={{ fontSize: '15px', color: '#5A7184', maxWidth: '850px', lineHeight: 1.6 }}>
            Demonstrates vernacular audio distress analysis, high-acuity triage categorization, and standardized first-aid instructions for bystander guidance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {onOpenFullConsole && (
            <button
              onClick={onOpenFullConsole}
              style={{
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)'
              }}
            >
              <Activity size={16} />
              <span>Launch Live Sanjivani-108 Console</span>
            </button>
          )}

          <Link
            to="/emergency/handover"
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#0A2540',
              fontSize: '13px',
              fontWeight: 750,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FileText size={15} color="#008B8B" />
            <span>View Paramedic Handover Record</span>
          </Link>
        </div>
      </div>

      {/* Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left Column: Triage Input & Scenarios */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '8px' }}>
              Simulated Caller Distress Audio / Transcript
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B' }}>
              Enter vernacular speech text or select a clinical emergency scenario:
            </p>
          </div>

          {/* Scenario Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              {
                label: '🫀 Suspected STEMI / Chest Pressure (Telugu)',
                text: 'నాకు తీవ్రమైన గుండె నొప్పిగా ఉంది, చెమటలు పడుతున్నాయి, శ్వాస ఆడటం లేదు'
              },
              {
                label: '🫁 Pediatric Airway / Stridor (Hindi)',
                text: 'बच्चे की सांस फूल रही है, पसली चल रही है और होंठ नीले पड़ रहे हैं'
              },
              {
                label: '🚗 Highway Trauma / Bleeding (Telugu)',
                text: 'రోడ్డు ప్రమాదం జరిగింది, తీవ్రమైన రక్తస్రావం అవుతోంది, వెంటనే సహాయం కావాలి'
              }
            ].map((scen, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(scen.text);
                  handleTriageAnalyze(scen.text);
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  color: '#0A2540',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                {scen.label}
              </button>
            ))}
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              fontFamily: 'inherit',
              color: '#0A2540'
            }}
          />

          <button
            onClick={() => handleTriageAnalyze()}
            style={{
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: '#0A2540',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Re-analyze Triage Protocol
          </button>

          {/* CPR Metronome Box */}
          <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540' }}>
                  110 BPM CPR Audio Metronome
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                  AHA / ERC standard compression rhythm (100–120 beats/min)
                </div>
              </div>
              <button
                onClick={handleToggleCprMetronome}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: cprMetronomeActive ? '#DC2626' : '#008B8B',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Heart size={14} style={{ animation: cprMetronomeActive ? 'pulse 0.54s infinite' : 'none' }} />
                <span>{cprMetronomeActive ? 'Stop Beat' : 'Start Beat'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Triage Protocol & First-Aid Guidance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Triage Decision Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: triageResult.triageLevel === 'RED' ? '2px solid #EF4444' : '1px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(10,37,64,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{
                background: triageResult.triageLevel === 'RED' ? '#DC2626' : '#D97706',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 850
              }}>
                CATEGORY: {triageResult.triageLevel} ({triageResult.severity})
              </span>
              <span style={{ fontSize: '11.5px', fontFamily: 'monospace', color: '#64748B' }}>
                ICD-10: {triageResult.icd10}
              </span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 850, color: '#0A2540', marginBottom: '8px' }}>
              {triageResult.suspectedCondition}
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '18px' }}>
              <strong>Standard Protocol:</strong> {triageResult.priorityProtocol}
            </p>

            {/* First-Aid Instructions */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', marginBottom: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0A2540', textTransform: 'uppercase', marginBottom: '8px' }}>
                Immediate First-Aid Protocols:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', color: '#334155', lineHeight: 1.6 }}>
                {triageResult.firstAidInstructions.map((ins, idx) => (
                  <li key={idx}>{ins}</li>
                ))}
              </ul>
            </div>

            {/* Vernacular First-Aid Callout */}
            {triageResult.firstAidVernacular && (
              <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: '10px', padding: '12px 14px', fontSize: '12.5px', color: '#115E59' }}>
                <strong>తెలుగు సూచన:</strong> {triageResult.firstAidVernacular.te}
              </div>
            )}
          </div>

          {/* Dispatch Pipeline Simulator */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2540' }}>
                Simulated 108 Telemetry & Dispatch Pipeline
              </h3>
              <button
                onClick={handleStartDispatchSimulation}
                disabled={isSimulatingDispatch}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#008B8B',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: isSimulatingDispatch ? 'not-allowed' : 'pointer'
                }}
              >
                {isSimulatingDispatch ? 'Simulating...' : 'Run Simulation'}
              </button>
            </div>

            {dispatchSteps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8', fontSize: '13px' }}>
                Click "Run Simulation" to visualize autonomous telemetry resolution steps.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dispatchSteps.map((step, idx) => (
                  <div key={idx} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px', fontSize: '12px' }}>
                    <div style={{ fontWeight: 800, color: '#0A2540', marginBottom: '2px' }}>{step.name}</div>
                    <div style={{ color: '#64748B' }}>{step.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
