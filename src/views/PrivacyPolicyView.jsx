import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Server, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyView() {
  return (
    <div style={{ padding: '40px 24px', maxWidth: '860px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#008B8B', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#0A2540', fontSize: '13px', fontWeight: 700 }}>Privacy Policy</span>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0A2540', margin: 0 }}>
            Privacy & Ephemeral Audio Policy
          </h1>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            background: '#DCFCE7',
            color: '#15803D',
            padding: '4px 10px',
            borderRadius: '12px',
            border: '1px solid #BBF7D0'
          }}>
            DPDP Act 2023 Compliant
          </span>
        </div>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Last updated: October 2026 • AyuSwar AI Engineering & Open Clinical Research Consortium
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: '#334155', lineHeight: 1.7, fontSize: '14.5px' }}>
        {/* Core Principles */}
        <div style={{ background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2540', marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#008B8B" />
            1. Executive Privacy Principles for Bharat
          </h2>
          <p style={{ margin: 0 }}>
            AyuSwar AI is an experimental open-source clinical voice operating system built specifically for primary health centers (PHCs). We strictly enforce **Ephemeral In-Memory Voice Telemetry** under India's Digital Personal Data Protection (DPDP) Act 2023, the Ayushman Bharat Digital Mission (ABDM) standards, and the Draft Digital Information Security in Healthcare Act (DISHA).
          </p>
        </div>

        {/* Real-time Web Audio */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2540', marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EyeOff size={20} color="#008B8B" />
            2. Real-Time Client-Side Audio Signal Processing
          </h2>
          <p>
            When utilizing the **Acoustic Biomarker Lab** or microphone input:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
            <li><strong>Zero Server Upload of Raw Sound:</strong> Digital Signal Processing (DSP) algorithms (Autocorrelation $F_0$ pitch tracking, Harmonics-to-Noise Ratio, and FFT spectrum analysis) execute 100% inside your device's browser memory via the W3C Web Audio API.</li>
            <li><strong>RAM-Only Buffering:</strong> Audio buffers are discarded immediately once acoustic frames are analyzed. No raw audio files (.wav, .mp3) are written to persistent disk storage or uploaded to unencrypted databases.</li>
          </ul>
        </div>

        {/* Serverless Speech Inference */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2540', marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={20} color="#008B8B" />
            3. Serverless Speech Transcription & Secret Isolation
          </h2>
          <p>
            When speech-to-text (STT) or text-to-speech (TTS) services are called:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
            <li><strong>Server-Side Only Credentials:</strong> All third-party enterprise tokens (Gnani Prisma / Timbre) are strictly isolated within Vercel serverless proxy endpoints (<code>/api/gnani/*</code>). Zero API secrets or tokens are ever bundled or transmitted to client browser inspectors.</li>
            <li><strong>Payload Scrubbing:</strong> Transcripts are scrubbed of unneeded metadata and processed strictly for generating ABDM FHIR R4 clinical JSON schemas.</li>
          </ul>
        </div>

        {/* Synthetic Safe Data */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2540', marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={20} color="#008B8B" />
            4. Synthetic Demo Data & Non-Diagnostic Status
          </h2>
          <p>
            The public demo hosted at <code>https://ayuswar-ai.vercel.app</code> operates entirely with synthetic patient profiles, simulated vitals, and open government formulary datasets (data.gov.in / PMBJP). It contains zero real-world Protected Health Information (PHI). AyuSwar AI is an engineering research prototype and does not function as an autonomous medical diagnostic device.
          </p>
        </div>

        {/* Contact Information */}
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px', fontSize: '13px', color: '#64748B' }}>
          For inquiries regarding DPDP compliance or data security research, visit our open repository at{' '}
          <a href="https://github.com/Samrudh2006/Ayuswar-Ai" target="_blank" rel="noopener noreferrer" style={{ color: '#008B8B', fontWeight: 700 }}>
            github.com/Samrudh2006/Ayuswar-Ai
          </a>.
        </div>
      </div>
    </div>
  );
}
