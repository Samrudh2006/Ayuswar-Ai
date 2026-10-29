import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Layers, 
  Cpu, 
  Mic, 
  Database,
  ShieldCheck,
  Download,
  Printer,
  CheckCircle2
} from 'lucide-react';
import HandDrawnExplainer from '../components/HandDrawnExplainer';
import PipelineTerminal from '../components/PipelineTerminal';
import { downloadAbdmWhitepaper, printAbdmDossier } from '../utils/abdmWhitepaperExport';

/**
 * ArchitectureView Component
 * Streamlined Technical Architecture Specification for AyuSwar AI.
 * Centered around the full-width rough.js Hand-Drawn Whiteboard Explainer.
 */
export default function ArchitectureView() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

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
    },
    {
      title: 'National Data Repository',
      tag: 'IndiaAI AIKosh (MeitY)',
      desc: 'Sovereign Indic speech benchmarks and PMBJP Janaushadhi open dataset schemas (aikosh.indiaai.gov.in).',
      icon: ShieldCheck,
      color: '#D97706'
    }
  ];

  return (
    <div className="architecture-view-container" style={{ padding: '36px 24px 64px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F4C5C', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#64748B', fontSize: '13px' }}>Technology</span>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#081C24', fontSize: '13px', fontWeight: 700 }}>Architecture Pipeline</span>
      </div>

      {/* Clean, Modern Header */}
      <div className="architecture-header" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 76, 92, 0.1)', color: '#0F4C5C', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, marginBottom: '10px' }}>
          <Layers size={14} />
          <span>SYSTEM ARCHITECTURE & PIPELINE HLD</span>
        </div>
        <h1 className="page-main-heading" style={{ fontSize: '32px', fontWeight: 850, color: '#081C24', marginBottom: '8px', letterSpacing: '-0.4px' }}>
          Technical Architecture & Intake Pipeline
        </h1>
        <p className="page-main-subtext" style={{ fontSize: '15px', color: '#5A7184', maxWidth: '850px', lineHeight: 1.5, margin: 0 }}>
          Interactive architectural blueprint detailing the 4-stage data pipeline from ambient consultation audio capture to ABDM FHIR R4 interoperability.
        </p>
      </div>

      {/* Main Centerpiece: Full-Width rough.js Hand-Drawn Whiteboard Explainer */}
      <HandDrawnExplainer />

      {/* Real-Time Client Runtime Pipeline Terminal */}
      <div style={{ marginTop: '8px', marginBottom: '32px' }}>
        <PipelineTerminal />
      </div>

      {/* ABDM Milestone 1, 2, 3 Certification & Executive Whitepaper Dossier */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #081C24 0%, #0F4C5C 100%)',
          borderRadius: '20px',
          padding: '28px 24px',
          color: '#FFFFFF',
          marginBottom: '36px',
          boxShadow: '0 12px 32px rgba(15, 76, 92, 0.18)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(52, 211, 153, 0.15)', color: '#6EE7B7', padding: '4px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 800, marginBottom: '12px' }}>
              <ShieldCheck size={14} />
              <span>NATIONAL HEALTH AUTHORITY (NHA) ABDM SANDBOX VERIFIED</span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 850, margin: '0 0 8px 0', letterSpacing: '-0.3px', color: '#FFFFFF' }}>
              ABDM Milestone 1, 2, 3 Architecture Certification & Technical Dossier
            </h2>
            <p style={{ fontSize: '13.5px', color: '#CBD5E1', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              Complete engineering audit whitepaper documenting compliance with Ayushman Bharat Digital Mission (ABDM) standards — including ABHA/HPR verification, HL7 FHIR R4 document bundling, and rural offline-first IndexedDB resilience.
            </p>

            {/* Milestone Status Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.08)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <CheckCircle2 size={14} color="#34D399" />
                <span>M1: ABHA & HPR Identity</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.08)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <CheckCircle2 size={14} color="#34D399" />
                <span>M2: HIP FHIR R4 Bundle & DSC</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.08)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <CheckCircle2 size={14} color="#34D399" />
                <span>M3: HIU Longitudinal Health Records</span>
              </div>
            </div>
          </div>

          {/* Action Download Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
            <button
              onClick={downloadAbdmWhitepaper}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#0284C7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 18px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#0369A1'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0284C7'}
            >
              <Download size={16} />
              <span>Download Whitepaper (.txt)</span>
            </button>

            <button
              onClick={printAbdmDossier}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '12px',
                padding: '12px 18px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
            >
              <Printer size={16} />
              <span>Print Executive Dossier (A4)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compact 3-Column Interoperability Standards Grid */}
      <div style={{ marginTop: '36px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#081C24', margin: '0 0 4px 0' }}>
            Core Interoperability & Clinical Schema Standards
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
            Standard specifications implemented across the client runtime and clinical data exchange layer.
          </p>
        </div>

        <div className="architecture-standards-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
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

                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: '0 0 4px 0' }}>
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
