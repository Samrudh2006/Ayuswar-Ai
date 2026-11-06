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
  CheckCircle2,
  Activity,
  Server,
  BarChart3,
  GitBranch,
  Radio
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
      color: '#0F4C5C'
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
        <span style={{ color: '#698892', fontSize: '13px' }}>Technology</span>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#081C24', fontSize: '13px', fontWeight: 700 }}>Architecture Pipeline</span>
      </div>

      {/* Clean, Modern Header */}
      <div className="architecture-header" style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 0, 0, 0.07)', color: '#0F4C5C', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, marginBottom: '10px' }}>
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
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.13)',
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
            <p style={{ fontSize: '13.5px', color: '#D0DFE2', lineHeight: 1.6, margin: '0 0 16px 0' }}>
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

      {/* Sovereign Cloud-Native DevOps & Observability Architecture (100% Free & Open Source) */}
      <div style={{ marginTop: '36px', marginBottom: '40px' }}>
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', padding: '4px 10px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 800, marginBottom: '8px' }}>
            <Activity size={14} />
            <span>100% FREE & OPEN-SOURCE CNCF CLOUD-NATIVE STACK (₹0 SPEND)</span>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 850, color: '#081C24', margin: '0 0 6px 0', letterSpacing: '-0.3px' }}>
            Sovereign DevOps, Observability & GitOps Infrastructure
          </h2>
          <p style={{ fontSize: '13.5px', color: '#5A7184', maxWidth: '850px', lineHeight: 1.5, margin: 0 }}>
            Enterprise-grade healthcare deployment topology configured via declarative code in <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '12.5px', color: '#0F4C5C' }}>deploy/</code> — zero proprietary cloud subscriptions, zero external API keys, and 100% sovereign patient data privacy.
          </p>
        </div>

        {/* 4-Pillar Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}>
          {/* 1. K3s / Kubernetes */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #D0DFE2', padding: '20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(15, 76, 92, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F4C5C' }}>
                <Server size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(52, 211, 153, 0.15)', color: '#059669', padding: '3px 8px', borderRadius: '10px' }}>
                ✓ 3-30 Pods HPA
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: '0 0 4px 0' }}>
              Kubernetes / K3s Microservices
            </h3>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F4C5C', marginBottom: '8px' }}>
              deploy/k8s/ayuswar-deployment.yaml
            </div>
            <p style={{ fontSize: '13px', color: '#486770', lineHeight: 1.5, margin: 0 }}>
              Horizontal Pod Autoscaler (70% CPU threshold), non-root container security context, rolling updates, and automated health probes.
            </p>
          </div>

          {/* 2. Prometheus & Grafana */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #D0DFE2', padding: '20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(234, 88, 12, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EA580C' }}>
                <BarChart3 size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(52, 211, 153, 0.15)', color: '#059669', padding: '3px 8px', borderRadius: '10px' }}>
                ✓ Active (/metrics)
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: '0 0 4px 0' }}>
              Prometheus & Grafana APM
            </h3>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#EA580C', marginBottom: '8px' }}>
              deploy/monitoring/grafana-dashboard-ayuswar.json
            </div>
            <p style={{ fontSize: '13px', color: '#486770', lineHeight: 1.5, margin: 0 }}>
              Real-time Audio RTF (0.18x target), 400-800Hz wheeze acoustic harmonics, p99 teleconsultation latency, and Sanjivani-108 dispatch queue depth.
            </p>
          </div>

          {/* 3. ArgoCD GitOps */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #D0DFE2', padding: '20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
                <GitBranch size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(52, 211, 153, 0.15)', color: '#059669', padding: '3px 8px', borderRadius: '10px' }}>
                ✓ Self-Healing
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: '0 0 4px 0' }}>
              ArgoCD Declarative GitOps
            </h3>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0284C7', marginBottom: '8px' }}>
              deploy/argocd/ayuswar-gitops-app.yaml
            </div>
            <p style={{ fontSize: '13px', color: '#486770', lineHeight: 1.5, margin: 0 }}>
              Continuous Delivery syncing directly from GitHub main branch with automated drift detection, pruning, and self-healing rollbacks.
            </p>
          </div>

          {/* 4. Traefik & Sovereign Mesh */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #D0DFE2', padding: '20px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                <Radio size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(52, 211, 153, 0.15)', color: '#059669', padding: '3px 8px', borderRadius: '10px' }}>
                ✓ Mesh Online
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: '0 0 4px 0' }}>
              Traefik Cloud-Native Ingress
            </h3>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', marginBottom: '8px' }}>
              deploy/docker-compose.enterprise.yml
            </div>
            <p style={{ fontSize: '13px', color: '#486770', lineHeight: 1.5, margin: 0 }}>
              Zero-cost reverse proxy & automated TLS termination. Routes FHIR R4 bundles and real-time audio streams with strict ABDM zero-leak isolation.
            </p>
          </div>
        </div>

        {/* 1-Command Startup Box */}
        <div style={{
          background: '#091E26',
          borderRadius: '14px',
          padding: '16px 20px',
          color: '#E2E8F0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', color: '#6EE7B7', fontWeight: 800, marginBottom: '4px' }}>
              Local Production Cluster Command (Zero Setup)
            </div>
            <code style={{ fontSize: '13px', color: '#FFFFFF', fontFamily: 'monospace', fontWeight: 700 }}>
              docker compose -f deploy/docker-compose.enterprise.yml up -d
            </code>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Infrastructure Cost:</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#34D399', background: 'rgba(52, 211, 153, 0.12)', padding: '4px 10px', borderRadius: '8px' }}>
              ₹0.00 / 100% Free Open-Source
            </span>
          </div>
        </div>
      </div>

      {/* Compact 3-Column Interoperability Standards Grid */}
      <div style={{ marginTop: '36px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#081C24', margin: '0 0 4px 0' }}>
            Core Interoperability & Clinical Schema Standards
          </h2>
          <p style={{ fontSize: '13.5px', color: '#698892', margin: 0 }}>
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
                  border: '1px solid #D0DFE2',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
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
                  <p style={{ fontSize: '13px', color: '#486770', lineHeight: 1.5, margin: 0 }}>
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
