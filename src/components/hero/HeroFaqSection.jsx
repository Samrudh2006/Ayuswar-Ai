import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

export const HERO_FAQS = [
  {
    q: 'Does AyuSwar replace doctors?',
    a: 'Absolutely not. AyuSwar AI is strictly an ambient clinical co-pilot designed to eliminate documentation burnout. The attending physician maintains 100% legal, diagnostic, and clinical agency. AI-generated notes, ICD-10 codes, and prescriptions are presented as structured drafts that the clinician reviews, edits, and cryptographically signs with Class-3 DSC before anything is committed to ABDM.'
  },
  {
    q: 'How is patient data protected?',
    a: 'AyuSwar AI is fully compliant with the India Digital Personal Data Protection (DPDP) Act 2023 and ABDM DISHA privacy guidelines. Audio streams are processed ephemerally for transcription and biomarker extraction without storing raw conversational voice on external servers. All clinical FHIR R4 bundles are encrypted in transit (TLS 1.3) and at rest (AES-256) on sovereign Indian cloud infrastructure with strict role-based access control.'
  },
  {
    q: 'Does it work with code-mixed speech (e.g., Telugu + English / Tenglish)?',
    a: 'Yes. Indian clinical consultations rarely happen in pure textbook languages. AyuSwar prototype uses browser speech recognition with planned Indic voice integration, designed to decode code-mixed Telugu, Hindi, Tamil, Kannada, and "Tenglish/Hinglish" where clinical terms (like "sugar", "BP", "inhaler", "fever") blend naturally with vernacular grammar.'
  },
  {
    q: 'How does it handle noisy environments?',
    a: 'AyuSwar features an adaptive WebAudio 16 kHz AudioWorklet dual-channel DSP front-end with spectral noise subtraction. It filters out ceiling fan hums, corridor chatter, and adjacent murmur in rural OPD waiting halls to assist speech capture.'
  },
  {
    q: 'How does the clinician verify AI-generated information?',
    a: 'The doctor console provides a side-by-side interactive verification workspace. Every extracted symptom, vital sign, and diagnosis is highlighted with clickable audio time-stamps linking back to the exact second in the consultation. The physician can accept, edit, or reject any line item with a single click before issuing the official e-Prescription.'
  },
  {
    q: 'How does ABDM/FHIR integration work?',
    a: 'AyuSwar is architected natively for Ayushman Bharat Digital Mission (ABDM) M1, M2, and M3 milestones. It verifies 14-digit ABHA numbers instantly and transforms consultations into standardized HL7 FHIR R4 JSON bundles (Encounter, Observation, Condition, MedicationRequest, and Binary DSC signature) ready for instant national health exchange dispatch.'
  },
  {
    q: 'What happens when the AI is uncertain?',
    a: 'AyuSwar utilizes probabilistic uncertainty thresholding. If acoustic noise obscures a sentence or phoneme confidence drops below 85%, the system never hallucinates or guesses. Instead, it flags the phrase in amber with an explicit "Requires Doctor Clarification" tag and prompts the clinician to confirm before generating prescription orders.'
  },
  {
    q: 'Can patients receive spoken audio instructions in their own language?',
    a: 'Yes. Through the Spoken Prescription (Audio-Rx) studio, prescriptions are converted into clear spoken dosage instructions with color-coded pill reminders in Telugu, Hindi, or English. Patients and caregivers can replay instructions anytime or receive the audio summary via WhatsApp.'
  },
  {
    q: 'How does Jan Aushadhi generic substitution assist patients?',
    a: 'When an outpatient prescription or medicine strip is scanned, AyuSwar cross-references the open PMBJP Jan Aushadhi formulary. It surfaces equivalent generic salts, helping families reduce out-of-pocket medication expenses by 70–85%.'
  },
  {
    q: 'What devices and browsers are supported?',
    a: 'AyuSwar is built as a lightweight progressive web application (PWA). It runs smoothly across Chrome, Edge, Safari, and Firefox on basic Android smartphones, clinic tablets, and rural PHC desktops without requiring specialized hardware.'
  },
  {
    q: 'Can clinicians edit or override AI suggestions before signing?',
    a: 'Always. Every drafted diagnosis, vital sign, and medication order is completely editable. Under strict Human-in-the-Loop safeguards, nothing is finalized or dispatched to health records without explicit clinician review and digital confirmation.'
  }
];

/**
 * HeroFaqSection — Frequently Asked Questions Accordion
 * Extracted modular component for HeroLanding.
 */
export default function HeroFaqSection({ onSelectModule }) {
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  return (
    <section style={{ maxWidth: '1380px', margin: '0 auto', padding: '52px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F4C5C', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '8px' }}>
          FREQUENTLY ASKED QUESTIONS
        </div>
        <h2 style={{ fontSize: '34px', color: '#081C24', letterSpacing: '-0.02em' }}>
          Everything You Need to Know About AyuSwar AI
        </h2>
      </div>

      <div className="hero-faq-layout-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 420px) 1fr',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* Left Column: Doctor Avatar Featuring sec8_faq.png */}
        <div className="hero-faq-avatar-card" style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '2px solid #94A3B8',
          padding: '24px',
          boxShadow: '0 12px 36px rgba(10, 37, 64, 0.06)',
          position: 'sticky',
          top: '20px'
        }}>
          <div style={{ borderRadius: '18px', overflow: 'hidden', border: '1.5px solid #CBD5E1', marginBottom: '18px', background: '#E6FAF8' }}>
            <img
              src="/assets/sections/sec8_faq.png"
              alt="Dr. Ananya Waving Avatar with FAQ Question Bubble"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 76, 92, 0.1)', color: '#0F4C5C', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, marginBottom: '8px' }}>
            <span>24/7 VIRTUAL CLINICAL SUPPORT</span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 850, color: '#081C24', margin: '0 0 6px 0' }}>
            Have Questions? We Have Answers.
          </h3>
          <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55, marginBottom: '18px' }}>
            Explore how AyuSwar handles noisy 72 dB OPD halls, strictly adheres to DPDP Act 2023 RAM-only processing, and ensures 100% human doctor sign-off.
          </p>

          <button
            onClick={() => onSelectModule && onSelectModule('assistant')}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0F4C5C 0%, #006666 100%)',
              color: '#ffffff',
              fontSize: '13.5px',
              fontWeight: 750,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(15, 76, 92, 0.25)'
            }}
          >
            <span>Ask Dr. Ananya Virtual Assistant</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Right Column: Interactive FAQ Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
          {HERO_FAQS.map((faq, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: isExpanded ? '2px solid #0F4C5C' : '1.5px solid #94A3B8',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 200ms ease',
                  boxShadow: isExpanded ? '0 8px 24px rgba(15, 76, 92, 0.12)' : '0 2px 8px rgba(10, 37, 64, 0.04)'
                }}
              >
                <button
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: isExpanded ? '#0F4C5C' : '#0A2540'
                  }}
                >
                  <span>{faq.q}</span>
                  {isExpanded ? <ChevronUp size={17} color="#0F4C5C" /> : <ChevronDown size={17} color="#64748B" />}
                </button>
                {isExpanded && (
                  <div style={{
                    padding: '0 20px 18px 20px',
                    fontSize: '13.5px',
                    lineHeight: 1.6,
                    color: '#475569',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '12px'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
