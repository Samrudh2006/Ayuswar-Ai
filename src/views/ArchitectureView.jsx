import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Layers, 
  Cpu, 
  Mic, 
  Database,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import HandDrawnExplainer from '../components/HandDrawnExplainer';
import PipelineTerminal from '../components/PipelineTerminal';

/**
 * ArchitectureView Component
 * Streamlined Technical Architecture Specification for AyuSwar AI.
 * Centered around the full-width rough.js Hand-Drawn Whiteboard Explainer.
 */
export default function ArchitectureView() {
  const INTEROP_STANDARDS = [
    {
      title: 'Acoustic Signal DSP',
      tag: 'W3C AudioContext & Web Speech',
      desc: 'Local browser 16kHz PCM audio intake and spectral formant extraction without mandatory server compute.',
      icon: Mic,
      color: '#10B981'
    },
    {
      title: 'Clinical Lexicon & NLP',
      tag: 'SNOMED CT & ICD-10 Indic Map',
      desc: 'Vernacular Telugu and Indic colloquial idiom normalization into standard diagnostic taxonomy codes.',
      icon: Cpu,
      color: '#0284C7'
    },
    {
      title: 'Interoperable Records',
      tag: 'HL7 FHIR R4 Schema',
      desc: 'Open standard composition for patient encounter records, digital signature ready for ABDM exchange.',
      icon: Database,
      color: '#7C3AED'
    }
  ];

  return (
    <div style={{ padding: '36px 24px 64px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#008B8B', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#64748B', fontSize: '13px' }}>Technology</span>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#0A2540', fontSize: '13px', fontWeight: 700 }}>Architecture Pipeline</span>
      </div>

      {/* Clean, Modern Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,139,139,0.1)', color: '#008B8B', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, marginBottom: '10px' }}>
          <Layers size={14} />
          <span>SYSTEM ARCHITECTURE & PIPELINE HLD</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 850, color: '#0A2540', marginBottom: '8px', letterSpacing: '-0.4px' }}>
          Technical Architecture & Intake Pipeline
        </h1>
        <p style={{ fontSize: '15px', color: '#5A7184', maxWidth: '850px', lineHeight: 1.5, margin: 0 }}>
          Interactive architectural blueprint detailing the 4-stage data pipeline from ambient consultation audio capture to ABDM FHIR R4 interoperability.
        </p>
      </div>

      {/* Main Centerpiece: Full-Width rough.js Hand-Drawn Whiteboard Explainer */}
      <HandDrawnExplainer />

      {/* Real-Time Client Runtime Pipeline Terminal */}
      <div style={{ marginTop: '8px', marginBottom: '32px' }}>
        <PipelineTerminal />
      </div>

      {/* Compact 3-Column Interoperability Standards Grid */}
      <div style={{ marginTop: '36px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2540', margin: '0 0 4px 0' }}>
            Core Interoperability & Clinical Schema Standards
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
            Standard specifications implemented across the client runtime and clinical data exchange layer.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {INTEROP_STANDARDS.map((std, idx) => {
            const Icon = std.icon;
            return (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(10, 37, 64, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: `${std.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: std.color,
                    marginBottom: '12px'
                  }}>
                    <Icon size={20} />
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', margin: '0 0 4px 0' }}>
                    {std.title}
                  </h3>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: std.color, marginBottom: '8px' }}>
                    {std.tag}
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    {std.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
