import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Sparkles, Volume2 } from 'lucide-react';
import AvatarAssistant, { AVATAR_LABELS } from '../components/AvatarAssistant';

export default function AvatarAssistantGalleryView() {
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [activeInteractiveState, setActiveInteractiveState] = useState('idle');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px', minHeight: '85vh' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Link 
          to="/" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#008B8B', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#0A2540', fontSize: '13px', fontWeight: 700 }}>Avatar Assistant Engine</span>
      </div>

      {/* Header Banner */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(20, 184, 166, 0.1)', color: '#0f766e', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
          <Sparkles size={14} />
          <span>High-Fidelity 4-Frame Conversational Avatar</span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
          AyuSwar AI Voice Assistant Avatar
        </h1>
        <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '780px', margin: 0, lineHeight: 1.6 }}>
          Photorealistic doctor avatar look (white coat + stethoscope) with 4 synchronized states: 
          <strong> Idle</strong>, <strong>Listening</strong>, <strong>Thinking</strong>, and <strong>Speaking</strong>, 
          powered by natural eye blinking (3-6s jitter), audio viseme cadence, and multi-dialect captions (EN / TE / HI).
        </p>
      </div>

      {/* Prominent Mandatory Safety Label */}
      <div style={{
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '12px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '28px'
      }}>
        <ShieldAlert size={20} color="#d97706" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '13px', color: '#92400e' }}>
          <strong>Clinical Prototype Notice:</strong> "AI assistant, not a doctor. Prototype demo." 
          This assistant provides informational health guidance and triage navigation only, never definitive diagnoses or autonomous prescriptions.
        </div>
      </div>

      {/* Language Switcher for all preview tiles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Demo Language:</span>
        {[
          { code: 'en-IN', label: 'English (Indian)' },
          { code: 'te-IN', label: 'Telugu (తెలుగు)' },
          { code: 'hi-IN', label: 'Hindi (हिन्दी)' }
        ].map(l => (
          <button
            key={l.code}
            onClick={() => setSelectedLang(l.code)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: selectedLang === l.code ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
              background: selectedLang === l.code ? '#0f172a' : '#ffffff',
              color: selectedLang === l.code ? '#ffffff' : '#334155',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 120ms ease'
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* 2x2 Grid of 4 States (Matches design specifications & user reference) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '28px',
        marginBottom: '40px'
      }}>
        {['idle', 'listening', 'thinking', 'speaking'].map((stateName) => (
          <div 
            key={stateName}
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <AvatarAssistant
              state={stateName}
              language={selectedLang}
              showControls={true}
              speakOnStateChange={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
