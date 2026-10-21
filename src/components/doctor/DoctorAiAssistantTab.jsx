import React from 'react';
import { Sparkles, Send } from 'lucide-react';

/**
 * DoctorAiAssistantTab — Dedicated Clinical AI Co-Pilot & Decision Support View
 * Extracted modular component for DoctorPortal.
 */
export default function DoctorAiAssistantTab({
  aiCategory,
  setAiCategory,
  aiResponses,
  aiPrompt,
  setAiPrompt,
  handleAskAi
}) {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={22} color="#0F4C5C" />
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
            AI Clinical Co-Pilot & Decision Support
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: '#64748B' }}>
          Evidence-based clinical assistance calibrated for Indian healthcare guidelines (ICMR, GINA, WHO ICD-10, NFI).
        </p>
      </div>

      {/* Modes Pill Selector */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'guidelines', label: 'Clinical Guidelines (GINA / ICMR)' },
          { id: 'ddi', label: 'Drug Contraindications & CYP450' },
          { id: 'ddx', label: 'Differential Diagnosis (DDx)' },
          { id: 'vernacular', label: 'Indic Semantic Translation' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setAiCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: aiCategory === cat.id ? '1.5px solid #0F4C5C' : '1px solid #E2E8F0',
              background: aiCategory === cat.id ? 'rgba(15, 76, 92, 0.08)' : '#ffffff',
              color: aiCategory === cat.id ? '#0F4C5C' : '#64748B',
              fontSize: '12.5px',
              fontWeight: 750,
              cursor: 'pointer'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Chat Thread */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '24px',
        minHeight: '440px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', overflowY: 'auto' }}>
          {aiResponses.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                alignSelf: 'flex-end',
                background: '#0A2540',
                color: '#ffffff',
                padding: '10px 16px',
                borderRadius: '14px 14px 2px 14px',
                fontSize: '13px',
                fontWeight: 650,
                maxWidth: '80%'
              }}>
                {item.q}
              </div>

              <div style={{
                alignSelf: 'flex-start',
                background: '#FAF8F5',
                border: '1px solid #E2E8F0',
                padding: '16px 20px',
                borderRadius: '14px 14px 14px 2px',
                fontSize: '13.5px',
                color: '#1E293B',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                maxWidth: '90%'
              }}>
                {item.a}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleAskAi} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input 
            type="text"
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            placeholder="Enter clinical symptoms, medication names, or dosage queries..."
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              fontSize: '13.5px',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#0F4C5C',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '0 24px',
              fontSize: '13.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Send size={16} />
            <span>Query AI</span>
          </button>
        </form>
      </div>
    </div>
  );
}
