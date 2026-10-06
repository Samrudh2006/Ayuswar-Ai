import React from 'react';
import { Cpu, ShieldCheck, Activity, Layers, Server, Database, Sparkles, BookOpen, CheckCircle } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(6, 26, 45, 0.78)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px'
    }}>
      <div style={{
        background: '#ffffff',
        width: '920px',
        maxHeight: '90vh',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 28px',
          background: 'linear-gradient(135deg, #0A2540 0%, #008B8B 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Cpu size={24} color="#00D2D3" />
            <div>
              <h2 style={{ fontSize: '18px', color: '#ffffff', fontWeight: 800 }}>
                AyuSwar AI — System Architecture & Research Foundation (HLD/LLD)
              </h2>
              <div style={{ fontSize: '11px', color: '#E0F2FE', opacity: 0.9 }}>
                Production Voice Pipeline for Gnani.ai Internship Challenge 2026
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '20px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Research Backing Card */}
          <div style={{
            background: 'rgba(0, 139, 139, 0.05)',
            border: '1.5px solid rgba(0, 139, 139, 0.2)',
            padding: '18px',
            borderRadius: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <BookOpen size={18} color="#008B8B" />
              <h3 style={{ fontSize: '15px', fontWeight: 750, color: '#0A2540' }}>
                Open Scientific Research & Curated Datasets (No Mock Data)
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '12px' }}>
              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#008B8B' }}>1. IISc Coswara & ICBHI:</strong>
                <p style={{ color: '#64748B', marginTop: '4px' }}>Acoustic cough, stridor & respiratory strain spectral biomarkers from IISc Bangalore dataset.</p>
              </div>
              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#008B8B' }}>2. AIIMS Clinical Dialogues:</strong>
                <p style={{ color: '#64748B', marginTop: '4px' }}>Code-mixed doctor-patient conversations across Telugu, Hindi and Hinglish dialects.</p>
              </div>
              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <strong style={{ color: '#008B8B' }}>3. WHO ICD-10 & NFI:</strong>
                <p style={{ color: '#64748B', marginTop: '4px' }}>Colloquial vernacular metaphors mapped directly to official ICD-10 codes & National Formulary of India.</p>
              </div>
            </div>
          </div>

          {/* 6-Layer Architecture Flow */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 750, color: '#0A2540', marginBottom: '14px' }}>
              High-Level Multi-Tier System Pipeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { layer: 'Layer 1: Ambient Ingestion', desc: 'Captures dual-stream audio in chaotic OPD rooms using WebAudio API 16 kHz PCM buffers.' },
                { layer: 'Layer 2: Gnani Prisma v2.5 STT', desc: 'Converts code-mixed Indic regional speech (Telugu, Hindi, Tenglish) into phonetic normalized text.' },
                { layer: 'Layer 3: DSP Biomarker Extractor', desc: 'Extracts 13-dim MFCCs, Spectral Rolloff & Jitter to detect respiratory strain and wet vs dry cough.' },
                { layer: 'Layer 4: Vernacular Semantic Ontology', desc: 'Maps local slang ("గుండెల్లో దడ", "ఉడుకుబోస్తోంది") into WHO ICD-10 (R00.2) and SNOMED-CT clinical codes.' },
                { layer: 'Layer 5: Clinical Safety Guard (CDSS)', desc: 'Validates Drug-Drug Interactions (DDI) and age-adjusted dosing against National Formulary of India.' },
                { layer: 'Layer 6: Gnani Timbre v2.5 Vernacular Audio-Rx', desc: 'Synthesizes native spoken instructions with real-time word-by-word karaoke highlighting for illiterate patients.' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  fontSize: '12.5px'
                }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#008B8B',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '11px',
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </span>
                  <div>
                    <strong style={{ color: '#0A2540' }}>{item.layer}: </strong>
                    <span style={{ color: '#475569' }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rate Limiting & Credit Protection */}
          <div style={{
            background: '#F1F5F9',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #CBD5E1',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={18} color="#10B981" />
              <strong style={{ color: '#0A2540' }}>Gnani 5,000 API Credits Protection & High-Availability SLA:</strong>
            </div>
            <p style={{ color: '#475569', lineHeight: 1.5 }}>
              Includes client-side Voice Activity Detection (VAD) to suppress ambient background noise so credits are only spent when meaningful speech occurs. Employs token-bucket rate limiting and in-memory caching for repeated clinical phrases.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', background: '#F8FAFC' }}>
          <button onClick={onClose} className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
            Close Architecture
          </button>
        </div>
      </div>
    </div>
  );
}
