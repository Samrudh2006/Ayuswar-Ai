import React, { useState } from 'react';
import { 
  Volume2, 
  Play, 
  Pause, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  Download, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  Pill, 
  Sun, 
  Moon, 
  FileText, 
  User, 
  PhoneCall, 
  Smartphone 
} from 'lucide-react';
import { CLINICAL_ENCOUNTERS } from '../data/clinicalEncounters';

/**
 * PatientPortal Component
 * Citizen-facing multilingual health profile and audio prescription hub (Ayu-Seva).
 * Empowers health-illiterate and rural patients to replay spoken dosage instructions in their native
 * dialect and track daily color-coded pills.
 */
export default function PatientPortal() {
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const currentEncounter = CLINICAL_ENCOUNTERS[selectedPatientIndex];

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState(-1);
  const [pillsTakenState, setPillsTakenState] = useState({ 0: false, 1: false });

  // Play Spoken Vernacular Audio Prescription
  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      setActiveWordIdx(-1);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setIsPlayingAudio(true);
      setActiveWordIdx(0);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentEncounter.fullAudioRxTelugu);
        utterance.lang = currentEncounter.langCode;
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }

      let count = 0;
      const totalWords = currentEncounter.karaokeWordsTelugu.length;
      const timer = setInterval(() => {
        count++;
        if (count < totalWords) {
          setActiveWordIdx(count);
        } else {
          clearInterval(timer);
          setIsPlayingAudio(false);
          setActiveWordIdx(-1);
        }
      }, 900);
    }
  };

  const togglePillTaken = (idx) => {
    setPillsTakenState(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '24px 24px 80px 24px' }}>
      {/* Top Patient Selector Switcher for Evaluators */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Pill size={18} color="#008B8B" />
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540' }}>
                Ayu-Seva — Citizen Vernacular Portal
              </h2>
            </div>
            <p style={{ fontSize: '12px', color: '#5A7184' }}>
              Switch between registered patient personas to test their personalized native audio prescriptions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {CLINICAL_ENCOUNTERS.map((enc, idx) => (
              <button
                key={enc.id}
                onClick={() => {
                  setSelectedPatientIndex(idx);
                  setIsPlayingAudio(false);
                  setActiveWordIdx(-1);
                }}
                style={{
                  padding: '7px 14px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: 650,
                  border: selectedPatientIndex === idx ? '2px solid #008B8B' : '1px solid #D8E7EB',
                  background: selectedPatientIndex === idx ? 'rgba(0, 139, 139, 0.12)' : '#ffffff',
                  color: selectedPatientIndex === idx ? '#008B8B' : '#0B2545',
                  cursor: 'pointer'
                }}
              >
                {enc.patient.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Patient Digital Health Card & Audio Rx Hub */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Column 1: Official ABHA Digital Health Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* ABHA Card Container */}
          <div style={{
            background: 'linear-gradient(135deg, #0A2540 0%, #083358 50%, #008B8B 100%)',
            borderRadius: '20px',
            padding: '24px',
            color: '#ffffff',
            boxShadow: '0 16px 40px rgba(10, 37, 64, 0.25)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Subtle Watermark */}
            <div style={{
              position: 'absolute',
              right: '-20px',
              bottom: '-20px',
              opacity: 0.08,
              pointerEvents: 'none'
            }}>
              <ShieldCheck size={200} />
            </div>

            {/* Top Card Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', overflow: 'hidden' }}>
                  <img src="/assets/ayuswar_logo.jpg" alt="AyuSwar AI" style={{ width: '100%', height: '100%' }} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px' }}>AYUSHMAN BHARAT</div>
                  <div style={{ fontSize: '9px', opacity: 0.8, textTransform: 'uppercase' }}>Digital Health Account</div>
                </div>
              </div>
              <span style={{ fontSize: '10px', background: 'rgba(255, 255, 255, 0.2)', padding: '3px 8px', borderRadius: '10px', fontWeight: 700 }}>
                GOVT OF INDIA
              </span>
            </div>

            {/* Patient Name & Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: 800,
                border: '1.5px solid rgba(255, 255, 255, 0.3)'
              }}>
                {currentEncounter.patient.name.charAt(0)}
              </div>

              <div>
                <div style={{ fontSize: '20px', fontWeight: 850 }}>
                  {currentEncounter.patient.name}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>
                  {currentEncounter.patient.gender} • {currentEncounter.patient.age} Years Old
                </div>
                <div style={{ fontSize: '11px', color: '#00D2D3', marginTop: '2px', fontWeight: 650 }}>
                  Primary Language: {currentEncounter.language}
                </div>
              </div>
            </div>

            {/* ABHA Number Bar */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '12px 14px',
              borderRadius: '12px',
              marginBottom: '18px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>ABHA Address ID</div>
              <div style={{ fontSize: '16px', fontWeight: 850, fontFamily: 'monospace', letterSpacing: '1px' }}>
                {currentEncounter.patient.abhaId}
              </div>
            </div>

            {/* QR Code Check-in */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', opacity: 0.85 }}>
              <span>Registered at: {currentEncounter.patient.location}</span>
              <QrCode size={24} />
            </div>
          </div>

          {/* Quick Helpline Support */}
          <div className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540', marginBottom: '8px' }}>
              🏥 Need Help Taking Medicines?
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5, marginBottom: '12px' }}>
              If you feel dizzy or forget which tablet to swallow, call your local Primary Health Center or listen to the voice prescription below.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#008B8B', fontWeight: 700, fontSize: '12.5px' }}>
              <PhoneCall size={15} />
              <span>Toll-Free Health Helpline: 104 / 1075</span>
            </div>
          </div>
        </div>

        {/* Column 2: Interactive Spoken Vernacular Audio-Rx & Daily Pill Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Spoken Vernacular Audio-Rx Showcase Card */}
          <div className="glass-panel" style={{
            padding: '24px',
            border: '2px solid rgba(0, 139, 139, 0.35)',
            boxShadow: '0 16px 36px rgba(0, 139, 139, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Volume2 size={24} color="#008B8B" />
                <div>
                  <h3 style={{ fontSize: '17px', color: '#0A2540', fontWeight: 850 }}>
                    డాక్టర్ అనన్య వాయిస్ ప్రిస్క్రిప్షన్ (Spoken Prescription)
                  </h3>
                  <div style={{ fontSize: '11.5px', color: '#5A7184' }}>
                    Listen in {currentEncounter.language} • Generated by Gnani.ai Timbre v2.5
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '10.5px', background: '#D97706', color: '#ffffff', padding: '3px 9px', borderRadius: '12px', fontWeight: 800 }}>
                KARAOKE AUDIO
              </span>
            </div>

            {/* Glowing Karaoke Word Container */}
            <div style={{
              background: '#061626',
              borderRadius: '14px',
              padding: '18px',
              marginBottom: '18px',
              minHeight: '94px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              lineHeight: 1.9
            }}>
              {currentEncounter.karaokeWordsTelugu.map((item, idx) => (
                <span
                  key={idx}
                  className={`karaoke-pill ${activeWordIdx === idx ? 'active' : ''}`}
                >
                  {item.word}
                </span>
              ))}
            </div>

            {/* Play Button */}
            <button
              onClick={handlePlayAudio}
              className="btn-teal"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '14.5px', marginBottom: '20px' }}
            >
              {isPlayingAudio ? <Pause size={18} /> : <Play size={18} fill="#ffffff" />}
              <span>{isPlayingAudio ? 'Pause Spoken Audio' : 'Play My Voice Prescription (వాయిస్ వినండి)'}</span>
            </button>

            {/* Daily Pill Tracker Box (నేటి మాత్రల పెట్టె) */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginBottom: '12px' }}>
                💊 Today's Daily Pill Box (నేటి మాత్రల షెడ్యూల్):
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentEncounter.medications.map((med, idx) => {
                  const isTaken = pillsTakenState[idx];
                  const isMorning = med.slot === 'morning';
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        background: isTaken ? 'rgba(16, 185, 129, 0.08)' : '#ffffff',
                        border: isTaken ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                        transition: 'all 160ms ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: isMorning ? '#FEF3C7' : '#DBEAFE',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isMorning ? '#D97706' : '#2563EB'
                        }}>
                          {isMorning ? <Sun size={18} /> : <Moon size={18} />}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540' }}>
                              {med.name}
                            </span>
                            <span style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: med.color
                            }} />
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>
                            {med.colorLabel} • {med.timing}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => togglePillTaken(idx)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '20px',
                          border: isTaken ? '1.5px solid #10B981' : '1px solid #CBD5E1',
                          background: isTaken ? '#10B981' : '#ffffff',
                          color: isTaken ? '#ffffff' : '#475569',
                          fontSize: '12px',
                          fontWeight: 750,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <CheckCircle2 size={14} />
                        <span>{isTaken ? 'Taken (వేసుకున్నాను)' : 'Mark as Taken'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
