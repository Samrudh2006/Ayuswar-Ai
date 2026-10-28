import React, { useState } from 'react';
import { Search, Sparkles, Volume2, BookOpen, X } from 'lucide-react';
import { INDIC_VERNACULAR_ONTOLOGY, resolveIndicVernacular } from '../../data/indicVernacularOntology';
import { fetchLiveIcd10Codes } from '../../services/liveMedicalDataService';

/**
 * DoctorClinicalLibraryTab — WHO ICD-10 & Indic Vernacular Clinical Ontology Explorer
 * Extracted modular component for DoctorPortal.
 */
export default function DoctorClinicalLibraryTab({ onShowToast }) {
  const [ontologySearchTerm, setOntologySearchTerm] = useState('');
  const [ontologyLangFilter, setOntologyLangFilter] = useState('all');
  const [ontologySystemFilter, setOntologySystemFilter] = useState('all');
  const [liveResolverInput, setLiveResolverInput] = useState('');
  const [selectedOntologyTerm, setSelectedOntologyTerm] = useState(null);
  const [nlmLiveResults, setNlmLiveResults] = useState(null);
  const [nlmLoading, setNlmLoading] = useState(false);

  React.useEffect(() => {
    if (!ontologySearchTerm || ontologySearchTerm.trim().length < 2) {
      setNlmLiveResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setNlmLoading(true);
      try {
        const res = await fetchLiveIcd10Codes(ontologySearchTerm, 3);
        setNlmLiveResults(res);
      } catch (_) {}
      setNlmLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [ontologySearchTerm]);

  const filteredOntology = INDIC_VERNACULAR_ONTOLOGY.filter(item => {
    const matchesLang = ontologyLangFilter === 'all' || item.language.toLowerCase() === ontologyLangFilter.toLowerCase();
    const matchesSystem = ontologySystemFilter === 'all' || item.system.toLowerCase() === ontologySystemFilter.toLowerCase();
    
    const q = ontologySearchTerm.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      item.vernacular.toLowerCase().includes(q) ||
      item.transliteration.toLowerCase().includes(q) ||
      item.clinicalTerm.toLowerCase().includes(q) ||
      item.icd10.toLowerCase().includes(q) ||
      item.snomed.toLowerCase().includes(q) ||
      item.clinicalContext.toLowerCase().includes(q);

    return matchesLang && matchesSystem && matchesSearch;
  });

  const liveResolvedEntities = resolveIndicVernacular(liveResolverInput);

  const playPronunciation = (text, lang) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === 'Telugu' ? 'te-IN' : (lang === 'Hindi' ? 'hi-IN' : (lang === 'Tamil' ? 'ta-IN' : (lang === 'Malayalam' ? 'ml-IN' : 'en-IN')));
      utter.rate = 0.88;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div>
      {/* Header & Meta */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
              Clinical Library & Indic Vernacular Ontology
            </h2>
            <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(15, 76, 92, 0.12)', color: '#0F4C5C', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(15, 76, 92, 0.3)' }}>
              28 Mapped Indic Metaphors • 7 Indic Languages
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748B' }}>
            Direct semantic translation matrix resolving regional colloquial expressions into WHO ICD-10 and SNOMED-CT clinical codes.
          </p>
        </div>

        {/* Quick Search */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search idiom, dialect, ICD-10, or clinical term..."
            value={ontologySearchTerm}
            onChange={e => setOntologySearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              background: '#ffffff',
              color: '#081C24',
              outline: 'none'
            }}
          />
          {ontologySearchTerm && (
            <button
              onClick={() => { setOntologySearchTerm(''); setNlmLiveResults(null); }}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '13px' }}
            >
              ✕
            </button>
          )}
          {nlmLiveResults && nlmLiveResults.results && nlmLiveResults.results.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '42px',
              left: 0,
              right: 0,
              background: '#ffffff',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: '1px solid #93C5FD',
              padding: '8px 12px',
              zIndex: 100,
              fontSize: '11px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px', color: '#1E40AF', fontWeight: 800 }}>
                <span>🌐 NLM NLM ICD-10 Server ({nlmLiveResults.latencyMs}ms):</span>
                <span style={{ fontSize: '10px', color: '#16A34A' }}>✓ Live Stream</span>
              </div>
              {nlmLiveResults.results.map((item, i) => (
                <div 
                  key={i}
                  onClick={() => { setOntologySearchTerm(item.code); setNlmLiveResults(null); }}
                  style={{ padding: '3px 4px', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', gap: '6px' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <strong style={{ color: '#0F4C5C' }}>{item.code}</strong>
                  <span style={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Live Vernacular Token Resolver Sandbox */}
      <div style={{
        background: 'linear-gradient(135deg, #0A2540 0%, #1E3A8A 100%)',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '22px',
        border: '1px solid #1E293B',
        boxShadow: '0 10px 25px rgba(10, 37, 64, 0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#38BDF8" />
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8' }}>
              Live Indic Semantic NLP Entity Extraction Sandbox
            </span>
          </div>
          <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
            Browser speech (Web Speech API). Gnani voice integration: planned
          </span>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <textarea
            rows={2}
            value={liveResolverInput}
            onChange={e => setLiveResolverInput(e.target.value)}
            placeholder="Type or paste any spoken colloquial Indic patient symptom phrase here..."
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#ffffff',
              fontSize: '13px',
              fontFamily: 'inherit',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Quick Utterance Presets */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>Try Preset Utterances:</span>
          {[
            { label: 'గుండెల్లో దడ (Palpitations)', text: 'రెండు రోజుల నుండి గుండెల్లో దడగా ఉండి ఉడుకుబోస్తోంది.' },
            { label: 'पसली चलना (Retraction)', text: 'बच्चे की दो दिन से पसली चल रही है और सांस फूलती है।' },
            { label: 'తల దిమ్ము (Vertigo)', text: 'పడుకుని లేవగానే తల దిమ్ముగా ఉండి గిర్రున తిరుగుతోంది.' },
            { label: 'छाती में जकड़न (Chest Tightness)', text: 'मौसम बदलने पर छाती में बहुत जकड़न और सीटी जैसी आवाज आती है।' },
            { label: 'हड्डी तोड़ बुखार (Dengue)', text: 'हड्डी तोड़ बुखार और आँखों के पीछे बहुत तेज दर्द है।' }
          ].map((preset, pIdx) => (
            <button
              key={pIdx}
              onClick={() => setLiveResolverInput(preset.text)}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#E2E8F0',
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 650
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Resolved Semantic Entities Output */}
        <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '10px', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '11.5px', color: '#94A3B8', marginBottom: '8px', fontWeight: 700 }}>
            Mapped Clinical Concepts ({liveResolvedEntities.length} Entities Recognized):
          </div>
          {liveResolvedEntities.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#CBD5E1', fontStyle: 'italic' }}>
              No exact ontology match found in current buffer. Try selecting a preset above.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {liveResolvedEntities.map((ent, eIdx) => (
                <div key={eIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#34D399' }}>{ent.vernacular}</span>
                    <span style={{ fontSize: '11.5px', color: '#93C5FD' }}>({ent.transliteration})</span>
                    <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: 700 }}>➔ {ent.clinicalTerm}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10.5px', background: '#0F4C5C', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontFamily: 'monospace' }}>
                      ICD-10: {ent.icd10}
                    </span>
                    <span style={{ fontSize: '10.5px', background: '#3B82F6', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontFamily: 'monospace' }}>
                      SNOMED: {ent.snomed}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '6px',
                      background: ent.severity === 'Critical' ? '#EF4444' : (ent.severity === 'Urgent' ? '#F59E0B' : '#10B981'),
                      color: '#ffffff'
                    }}>
                      {ent.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Language & Organ System Filter Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {/* Language Filter */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { key: 'all', label: 'All Indic Languages', count: INDIC_VERNACULAR_ONTOLOGY.length },
            { key: 'Telugu', label: 'తెలుగు Telugu', count: INDIC_VERNACULAR_ONTOLOGY.filter(o => o.language === 'Telugu').length },
            { key: 'Hindi', label: 'हिन्दी Hindi', count: INDIC_VERNACULAR_ONTOLOGY.filter(o => o.language === 'Hindi').length },
            { key: 'Tamil', label: 'தமிழ் Tamil', count: INDIC_VERNACULAR_ONTOLOGY.filter(o => o.language === 'Tamil').length },
            { key: 'Malayalam', label: 'മലയാളം Malayalam', count: INDIC_VERNACULAR_ONTOLOGY.filter(o => o.language === 'Malayalam').length },
            { key: 'Kannada', label: 'ಕನ್ನಡ Kannada', count: INDIC_VERNACULAR_ONTOLOGY.filter(o => o.language === 'Kannada').length },
            { key: 'Bengali', label: 'বাংলা Bengali', count: INDIC_VERNACULAR_ONTOLOGY.filter(o => o.language === 'Bengali').length },
            { key: 'Marathi', label: 'मराठी Marathi', count: INDIC_VERNACULAR_ONTOLOGY.filter(o => o.language === 'Marathi').length }
          ].map(lang => (
            <button
              key={lang.key}
              onClick={() => setOntologyLangFilter(lang.key)}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                border: ontologyLangFilter === lang.key ? '1.5px solid #0F4C5C' : '1px solid #CBD5E1',
                background: ontologyLangFilter === lang.key ? '#0F4C5C' : '#ffffff',
                color: ontologyLangFilter === lang.key ? '#ffffff' : '#475569',
                whiteSpace: 'nowrap',
                boxShadow: ontologyLangFilter === lang.key ? '0 2px 6px rgba(15, 76, 92, 0.2)' : 'none'
              }}
            >
              {lang.label} <span style={{ opacity: 0.8, fontSize: '10.5px' }}>({lang.count})</span>
            </button>
          ))}
        </div>

        {/* Organ System Filter */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { key: 'all', label: 'All Organ Systems' },
            { key: 'Cardiovascular', label: '🫀 Cardiovascular' },
            { key: 'Respiratory', label: '🫁 Respiratory' },
            { key: 'Neurology', label: '🧠 Neurology & Cranial' },
            { key: 'Gastroenterology', label: '🥣 Gastroenterology' },
            { key: 'Musculoskeletal', label: '🦴 Musculoskeletal' },
            { key: 'Infectious', label: '🦠 Infectious & Febrile' }
          ].map(sys => (
            <button
              key={sys.key}
              onClick={() => setOntologySystemFilter(sys.key)}
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11.5px',
                fontWeight: 650,
                cursor: 'pointer',
                border: ontologySystemFilter === sys.key ? '1px solid #1E3A8A' : '1px solid #E2E8F0',
                background: ontologySystemFilter === sys.key ? '#1E3A8A' : '#F8FAFC',
                color: ontologySystemFilter === sys.key ? '#ffffff' : '#64748B',
                whiteSpace: 'nowrap'
              }}
            >
              {sys.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ontology Cards Grid */}
      {filteredOntology.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
          <p style={{ fontSize: '15px', color: '#64748B', fontWeight: 600 }}>No vernacular expressions matching "{ontologySearchTerm}".</p>
          <button onClick={() => { setOntologySearchTerm(''); setOntologyLangFilter('all'); setOntologySystemFilter('all'); }} className="btn-outline" style={{ marginTop: '12px', padding: '6px 16px', fontSize: '12px' }}>
            Reset Ontology Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {filteredOntology.map(item => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                padding: '18px 20px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'box-shadow 0.15s ease'
              }}
            >
              <div>
                {/* Header: Vernacular & Region */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F4C5C', margin: 0 }}>
                        {item.vernacular}
                      </h3>
                      <button
                        onClick={() => playPronunciation(item.vernacular, item.language)}
                        title="Listen to Native Pronunciation"
                        style={{
                          background: 'rgba(15, 76, 92, 0.1)',
                          border: 'none',
                          color: '#0F4C5C',
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Volume2 size={13} />
                      </button>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      <em>{item.transliteration}</em> • <span style={{ fontWeight: 650, color: '#334155' }}>{item.language} ({item.dialect})</span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '8px',
                    background: item.severity === 'Critical' ? '#FEE2E2' : (item.severity === 'Urgent' ? '#FEF3C7' : (item.severity === 'Moderate' ? '#DBEAFE' : '#DCFCE7')),
                    color: item.severity === 'Critical' ? '#B91C1C' : (item.severity === 'Urgent' ? '#B45309' : (item.severity === 'Moderate' ? '#1D4ED8' : '#15803D'))
                  }}>
                    {item.severity}
                  </span>
                </div>

                {/* Standardized Medical Concept */}
                <div style={{ background: '#FAF8F5', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 750 }}>
                    Standard Clinical Concept:
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>
                    {item.clinicalTerm}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <code style={{ fontSize: '11px', background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      ICD-10: {item.icd10}
                    </code>
                    <code style={{ fontSize: '11px', background: '#FAF8F5', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      SNOMED: {item.snomed}
                    </code>
                    <span style={{ fontSize: '11px', background: '#F3E8FF', color: '#7E22CE', padding: '2px 6px', borderRadius: '4px', fontWeight: 650 }}>
                      {item.system}
                    </span>
                  </div>
                </div>

                {/* Clinical Context */}
                <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.45, marginBottom: '8px' }}>
                  <strong>Pathophysiology:</strong> {item.clinicalContext}
                </div>

                {/* Guideline Recommendation */}
                <div style={{ fontSize: '11.5px', color: '#065F46', background: 'rgba(16, 185, 129, 0.08)', padding: '8px 10px', borderRadius: '6px', marginBottom: '10px', lineHeight: 1.4 }}>
                  <strong>STG / ICMR Guideline:</strong> {item.guideline}
                </div>

                {/* Patient Utterance Example */}
                <div style={{ fontSize: '11.5px', color: '#64748B', fontStyle: 'italic', marginBottom: '12px' }}>
                  "{item.sampleUtterance}"
                </div>
              </div>

              {/* Card Action */}
              <button
                onClick={() => setSelectedOntologyTerm(item)}
                style={{
                  width: '100%',
                  padding: '7px',
                  borderRadius: '8px',
                  border: '1.5px solid #0F4C5C',
                  background: 'transparent',
                  color: '#0F4C5C',
                  fontSize: '12px',
                  fontWeight: 750,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <BookOpen size={13} />
                <span>Inspect SNOMED & ICD-10 Hierarchy</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Indic Vernacular Semantic Hierarchy Modal */}
      {selectedOntologyTerm && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(10, 37, 64, 0.7)',
          backdropFilter: 'blur(4px)',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            width: '640px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            borderRadius: '18px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #CBD5E1'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0A2540 0%, #1E3A8A 100%)',
              color: '#ffffff',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '3px solid #0F4C5C'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                    {selectedOntologyTerm.vernacular}
                  </h3>
                  <button
                    onClick={() => playPronunciation(selectedOntologyTerm.vernacular, selectedOntologyTerm.language)}
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: 'none',
                      color: '#ffffff',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
                <div style={{ fontSize: '12px', color: '#93C5FD', marginTop: '2px' }}>
                  <em>{selectedOntologyTerm.transliteration}</em> • {selectedOntologyTerm.language} ({selectedOntologyTerm.dialect})
                </div>
              </div>

              <button
                onClick={() => setSelectedOntologyTerm(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Standardized Concept Banner */}
              <div style={{ background: '#FAF8F5', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 16px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 750 }}>
                  Standardized Clinical Concept & Classification
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>
                  {selectedOntologyTerm.clinicalTerm}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '12px' }}>
                  <div style={{ background: '#EFF6FF', padding: '10px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                    <div style={{ fontSize: '10.5px', color: '#1E40AF', fontWeight: 750 }}>WHO ICD-10 Taxonomy</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E3A8A', fontFamily: 'monospace', marginTop: '2px' }}>
                      {selectedOntologyTerm.icd10}
                    </div>
                    <div style={{ fontSize: '11px', color: '#3B82F6', marginTop: '2px' }}>{selectedOntologyTerm.icd10Desc}</div>
                  </div>

                  <div style={{ background: '#F0FDF4', padding: '10px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                    <div style={{ fontSize: '10.5px', color: '#15803D', fontWeight: 750 }}>SNOMED-CT International</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#166534', fontFamily: 'monospace', marginTop: '2px' }}>
                      Concept: {selectedOntologyTerm.snomed}
                    </div>
                    <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '2px' }}>{selectedOntologyTerm.snomedDesc}</div>
                  </div>
                </div>
              </div>

              {/* Pathophysiology & Context */}
              <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 16px' }}>
                <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Clinical Context & Differential Diagnosis
                </div>
                <div style={{ fontSize: '13px', color: '#1E293B', lineHeight: 1.5 }}>
                  {selectedOntologyTerm.clinicalContext}
                </div>
              </div>

              {/* Standard Treatment Guideline */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '14px 16px' }}>
                <div style={{ fontSize: '11.5px', color: '#065F46', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  National STG / ICMR Practice Guideline
                </div>
                <div style={{ fontSize: '13px', color: '#065F46', fontWeight: 650, lineHeight: 1.5 }}>
                  {selectedOntologyTerm.guideline}
                </div>
              </div>

              {/* Sample Native Patient Utterance */}
              <div style={{ background: '#FAF8F5', borderRadius: '10px', padding: '12px 14px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 750, textTransform: 'uppercase', marginBottom: '2px' }}>
                  Recorded Patient Vernacular Utterance:
                </div>
                <div style={{ fontSize: '13px', color: '#334155', fontStyle: 'italic', fontWeight: 600 }}>
                  "{selectedOntologyTerm.sampleUtterance}"
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              background: '#FAF8F5',
              borderTop: '1px solid #E2E8F0',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                ABDM Semantic Interoperability Layer v2.5
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(`${selectedOntologyTerm.clinicalTerm} (ICD-10: ${selectedOntologyTerm.icd10}, SNOMED: ${selectedOntologyTerm.snomed})`);
                    }
                    if (onShowToast) onShowToast(`Copied ${selectedOntologyTerm.clinicalTerm} codes to clipboard!`);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#ffffff',
                    color: '#334155',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Copy Clinical Code
                </button>

                <button
                  onClick={() => setSelectedOntologyTerm(null)}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '12.5px' }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
