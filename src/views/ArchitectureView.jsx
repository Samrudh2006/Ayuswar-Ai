import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Mic, 
  Eye, 
  Volume2, 
  Database, 
  Lock, 
  ExternalLink 
} from 'lucide-react';

export default function ArchitectureView() {
  const ARCHITECTURE_LAYERS = [
    {
      num: 'Layer 1',
      title: 'Acoustic & Telephony Intake Layer',
      icon: Mic,
      tech: 'W3C Web Speech API • AudioContext FFT DSP • WebRTC Streams',
      desc: 'Captures ambient OPD consultation audio and emergency distress calls directly on the user device. Extracts 6-dimensional physical acoustic signal parameters (Fundamental Frequency F0, Jitter, Shimmer, HNR, Spectral Centroid) without transmitting raw audio to third parties.'
    },
    {
      num: 'Layer 2',
      title: 'Multilingual Indic NLP & Lexical Resolver',
      icon: Cpu,
      tech: 'Unicode Indic Tokenizer • Colloquial Ontology Dictionary • Zero-Cloud Heuristic Fallback',
      desc: 'Parses regional colloquial metaphors (e.g. Rayalaseema Telugu "పీకల్లో పిల్లికూతలు" -> Wheezing R06.2) into structured clinical concepts. Connects to optional local Ollama / MedLlama or cloud APIs when explicitly configured.'
    },
    {
      num: 'Layer 3',
      title: 'Computer Vision Blister Strip & Paper OCR',
      icon: Eye,
      tech: 'OpenCV Canvas Perspective Transform • Canny Edge Contours • Tesseract OCR Filtering',
      desc: 'Segments medicine blister packaging and paper scripts under harsh clinic overhead lighting. Resolves generic active chemical salts against the National Formulary of India (NFI) and maps Jan Aushadhi affordable equivalents.'
    },
    {
      num: 'Layer 4',
      title: 'Pharmacopeia Clinical Safety Sentinel',
      icon: ShieldCheck,
      tech: 'NFI Generic Formulary Graph • DDI Safety Rules • Chronotherapy Logic',
      desc: 'Validates newly spoken prescription drafts against known drug-drug interactions (e.g. Aspirin + Ibuprofen gastrointestinal conflict warnings) before e-prescription finalization.'
    },
    {
      num: 'Layer 5',
      title: 'Vernacular Spoken Audio-Rx & Delivery',
      icon: Volume2,
      tech: 'Browser speech (Web Speech API). Gnani voice integration: planned • WhatsApp wa.me Dispatch',
      desc: 'Synthesizes empathetic, spoken audio dosage instructions in the patient’s exact regional mother tongue. Synchronizes color-coded pill schedule cards with glowing karaoke text for non-reading patients.'
    },
    {
      num: 'Layer 6',
      title: 'ABDM Health Records & FHIR R4 Bundle Layer',
      icon: Database,
      tech: 'HL7 FHIR R4 Composition • ABHA Specimen Schemas • Digital Signature Drafts',
      desc: 'Structures encounter observations, clinical diagnoses, and prescribed medications into standard FHIR R4 bundles suitable for Ayushman Bharat Digital Mission (ABDM) electronic health record exchange.'
    }
  ];

  return (
    <div style={{ padding: '36px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#008B8B', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#64748B', fontSize: '13px' }}>Technology</span>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#0A2540', fontSize: '13px', fontWeight: 700 }}>Technical Architecture Blueprint</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,139,139,0.1)', color: '#008B8B', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
          <Layers size={14} />
          <span>HIGH-LEVEL DESIGN (HLD) SPECIFICATION</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 850, color: '#0A2540', marginBottom: '10px' }}>
          Technical Architecture & 6-Layer Engine Blueprint
        </h1>
        <p style={{ fontSize: '15px', color: '#5A7184', maxWidth: '850px', lineHeight: 1.6 }}>
          Comprehensive architectural blueprint detailing the client-side signal processing, Indic NLP lexical resolution, OpenCV computer vision, and ABDM FHIR R4 schema interoperability pipelines.
        </p>
      </div>

      {/* Security & Client-Side Privacy Callout */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px 22px', marginBottom: '36px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <Lock size={20} color="#008B8B" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginBottom: '4px' }}>
            Privacy-First Architecture Decision: Zero Unsolicited Cloud Audio Transmissions
          </div>
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
            Audio signals and camera images are processed on-device in the user's browser runtime. Backend credentials remain strictly on protected server endpoints and are not bundled into public client builds.
          </p>
        </div>
      </div>

      {/* 6-Layer Architecture Stack Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {ARCHITECTURE_LAYERS.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <div
              key={idx}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '20px',
                boxShadow: '0 4px 14px rgba(10,37,64,0.03)'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0,139,139,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#008B8B', flexShrink: 0 }}>
                <Icon size={24} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 850, color: '#008B8B', background: '#F0FDFA', padding: '2px 8px', borderRadius: '6px' }}>
                    {layer.num}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2540' }}>
                    {layer.title}
                  </h3>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', fontFamily: 'monospace', marginBottom: '8px' }}>
                  {layer.tech}
                </div>

                <p style={{ fontSize: '13.5px', color: '#5A7184', lineHeight: 1.6, margin: 0 }}>
                  {layer.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
