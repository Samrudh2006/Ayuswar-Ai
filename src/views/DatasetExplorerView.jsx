import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Search, 
  BookOpen, 
  Languages, 
  ChevronLeft, 
  Volume2, 
  Info,
  CheckCircle2,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { 
  CLINICAL_DISEASE_DATASET, 
  REGIONAL_COLLOQUIAL_DICTIONARY,
  predictClinicalDiagnosis 
} from '../data/kaggleClinicalDataset';
import { TOP_RESEARCH_DOMAINS } from '../data/researchPapersRepository';
import { useApp } from '../context/AppContext';

export default function DatasetExplorerView() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState('dictionary'); // 'dictionary' | 'diseases' | 'matcher' | 'papers'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Self-contained browser speech synthesis
  const playSpeech = (text, lang = 'te-IN') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.88;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };
  
  // Matcher state
  const [symptomInput, setSymptomInput] = useState('తీవ్రమైన ఆయాసం, రాత్రి వేళ పొడి దగ్గు మరియు పీకల్లో పిల్లికూతలు');
  const [matchResult, setMatchResult] = useState(() => predictClinicalDiagnosis('తీవ్రమైన ఆయాసం, రాత్రి వేళ పొడి దగ్గు మరియు పీకల్లో పిల్లికూతలు'));

  const categories = ['All', 'Pulmonology', 'Cardiology', 'Infectious', 'Gastroenterology', 'Neurology', 'Orthopedics', 'Dermatology'];

  // Normalize REGIONAL_COLLOQUIAL_DICTIONARY object into an array of clinical terms
  const colloquialDictionaryList = React.useMemo(() => {
    if (!REGIONAL_COLLOQUIAL_DICTIONARY || typeof REGIONAL_COLLOQUIAL_DICTIONARY !== 'object') {
      return [];
    }
    return Object.entries(REGIONAL_COLLOQUIAL_DICTIONARY).map(([term, data]) => {
      const isTelugu = /[\u0C00-\u0C7F]/.test(term);
      return {
        term,
        standardClinicalTerm: data.concept || 'Clinical Symptom',
        code: data.code || 'R69',
        category: data.category || 'General',
        meaning: `${data.concept || term} (ICD-10: ${data.code || 'Unspecified'})`,
        language: isTelugu ? 'Telugu' : 'Hindi',
        region: isTelugu ? 'Rayalaseema / Coastal AP' : 'North India / Rural Belt'
      };
    });
  }, []);

  const filteredDiseases = CLINICAL_DISEASE_DATASET.filter(d => {
    const matchesCategory = selectedCategory === 'All' || d.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = !searchQuery || 
      d.diseaseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.icd10.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.teluguName && d.teluguName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (d.hindiName && d.hindiName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredDictionary = colloquialDictionaryList.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.term.toLowerCase().includes(q) ||
      item.standardClinicalTerm.toLowerCase().includes(q) ||
      (item.meaning && item.meaning.toLowerCase().includes(q)) ||
      (item.region && item.region.toLowerCase().includes(q));
  });

  const handleTestMatch = () => {
    const res = predictClinicalDiagnosis(symptomInput);
    setMatchResult(res);
  };

  return (
    <div className="dataset-explorer-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-navy-700)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
          <ChevronLeft size={16} /> Return to Home
        </Link>
      </div>

      <div style={{ background: '#FAF8F5', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#0e7490', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <Database size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 className="page-main-heading" style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Clinical Knowledge & Lexicon Reference</h1>
              <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: 999, fontWeight: 600 }}>
                Reference Schema
              </span>
              <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: 999, fontWeight: 600, border: '1px solid #fde68a' }}>
                IndiaAI AIKosh Repository (aikosh.indiaai.gov.in)
              </span>
            </div>
            <p className="page-main-subtext" style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '0.925rem', lineHeight: 1.5 }}>
              Curated from IndiaAI AIKosh (National Data & AI Repository, MeitY), PMBJP Janaushadhi, WHO ICD-10, and ABDM SNOMED-CT clinical ontologies. Note: This dictionary provides ontology mapping for voice transcripts and does not constitute autonomous diagnostic software.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dataset-tabs-row" style={{ display: 'flex', gap: 8, borderBottom: '2px solid #e2e8f0', marginBottom: 20, overflowX: 'auto', paddingBottom: 2 }}>
        <button
          onClick={() => setActiveTab('dictionary')}
          style={{
            padding: '10px 18px',
            border: 'none',
            borderBottom: activeTab === 'dictionary' ? '2px solid #0e7490' : '2px solid transparent',
            marginBottom: -2,
            background: 'none',
            color: activeTab === 'dictionary' ? '#0e7490' : '#64748b',
            fontWeight: activeTab === 'dictionary' ? 700 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.9rem'
          }}
        >
          <Languages size={16} />
          <span>Vernacular Lexicon ({colloquialDictionaryList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('diseases')}
          style={{
            padding: '10px 18px',
            border: 'none',
            borderBottom: activeTab === 'diseases' ? '2px solid #0e7490' : '2px solid transparent',
            marginBottom: -2,
            background: 'none',
            color: activeTab === 'diseases' ? '#0e7490' : '#64748b',
            fontWeight: activeTab === 'diseases' ? 700 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.9rem'
          }}
        >
          <BookOpen size={16} />
          <span>ICD-10 Disease Reference ({CLINICAL_DISEASE_DATASET.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('matcher')}
          style={{
            padding: '10px 18px',
            border: 'none',
            borderBottom: activeTab === 'matcher' ? '2px solid #0e7490' : '2px solid transparent',
            marginBottom: -2,
            background: 'none',
            color: activeTab === 'matcher' ? '#0e7490' : '#64748b',
            fontWeight: activeTab === 'matcher' ? 700 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.9rem'
          }}
        >
          <Search size={16} />
          <span>Symptom Term Matcher (Non-Diagnostic)</span>
        </button>

        <button
          onClick={() => setActiveTab('papers')}
          style={{
            padding: '10px 18px',
            border: 'none',
            borderBottom: activeTab === 'papers' ? '2px solid #0e7490' : '2px solid transparent',
            marginBottom: -2,
            background: 'none',
            color: activeTab === 'papers' ? '#0e7490' : '#64748b',
            fontWeight: activeTab === 'papers' ? 700 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.9rem'
          }}
        >
          <FileText size={16} />
          <span>Literature References</span>
        </button>
      </div>

      {/* Tab 1: Colloquial Dictionary */}
      {activeTab === 'dictionary' && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Search colloquial terms (e.g. పిల్లికూతలు, छाती में भारीपन, wheeze, Rayalaseema)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div className="dataset-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 14 }}>
            {filteredDictionary.map((item, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, minWidth: 0, boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a', minWidth: 0, overflowWrap: 'break-word' }}>
                    {item.term}
                  </div>
                  <span style={{ fontSize: '0.725rem', background: '#FAF8F5', color: '#475569', padding: '2px 8px', borderRadius: 4, fontWeight: 600, flexShrink: 0 }}>
                    {item.language} • {item.region}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#0e7490', fontWeight: 600, marginBottom: 6, overflowWrap: 'break-word' }}>
                  → Standard Clinical: {item.standardClinicalTerm}
                </div>

                <div style={{ fontSize: '0.825rem', color: '#64748b', lineHeight: 1.4, marginBottom: 10, overflowWrap: 'break-word' }}>
                  Meaning: {item.meaning}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Category: {item.category}
                  </span>
                  <button
                    onClick={() => playSpeech(item.term, item.language === 'Telugu' ? 'te-IN' : 'hi-IN')}
                    style={{
                      border: '1px solid #cbd5e1',
                      background: '#FAF8F5',
                      borderRadius: 6,
                      padding: '4px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.75rem',
                      color: '#334155',
                      flexShrink: 0
                    }}
                  >
                    <Volume2 size={12} />
                    <span>Pronounce</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Disease Reference */}
      {activeTab === 'diseases' && (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search diseases or ICD-10 codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: '1 1 200px',
                minWidth: 0,
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                fontSize: '0.9rem'
              }}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                flex: '0 1 160px',
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                fontSize: '0.9rem',
                background: '#fff'
              }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="dataset-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 14 }}>
            {filteredDiseases.map((d, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 16, minWidth: 0, boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', minWidth: 0, overflowWrap: 'break-word' }}>
                    {d.diseaseName}
                  </div>
                  <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: 4, fontWeight: 700, flexShrink: 0 }}>
                    {d.icd10}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 8 }}>
                  Category: {d.category}
                </div>

                <div style={{ fontSize: '0.825rem', color: '#334155', marginBottom: 6, overflowWrap: 'break-word' }}>
                  <strong>Telugu:</strong> {d.teluguName || 'N/A'} • <strong>Hindi:</strong> {d.hindiName || 'N/A'}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#475569', background: '#FAF8F5', padding: 8, borderRadius: 6, overflowWrap: 'break-word' }}>
                  <strong>Key Symptoms:</strong> {Array.isArray(d.symptoms) ? d.symptoms.slice(0, 4).join(', ') : d.symptoms}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Matcher */}
      {activeTab === 'matcher' && (
        <div style={{ maxWidth: 800 }}>
          <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 10, marginBottom: 20 }}>
            <AlertTriangle size={18} color="#b45309" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: '0.825rem', color: '#92400e', lineHeight: 1.45 }}>
              <strong>Engineering Demonstration Notice:</strong> This keyword-matching utility cross-references input phrases against the reference colloquial dictionary. It is NOT an autonomous machine learning inference engine and does NOT provide diagnostic decisions or clinical care plans.
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
              Enter Telugu, Hindi, or English symptom phrase:
            </label>
            <textarea
              rows={3}
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #cbd5e1',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
            <button
              onClick={handleTestMatch}
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                background: '#0e7490',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Test Term Extraction
            </button>
            <button
              onClick={() => {
                setSymptomInput('గుండెల్లో మంట, పుల్లటి తేన్పులు, కడుపుబ్బరం');
              }}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: '#FAF8F5',
                color: '#334155',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Sample: Acidity / GERD
            </button>
            <button
              onClick={() => {
                setSymptomInput('हड्डी तोड़ बदन दर्द, तेज बुखार');
              }}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                background: '#FAF8F5',
                color: '#334155',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Sample: Viral Fever
            </button>
          </div>

          {matchResult && (
            <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: 10, padding: 20 }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#0f172a' }}>Keyword Extraction Results</h3>
              {matchResult.matchedTerms && matchResult.matchedTerms.length > 0 ? (
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    {matchResult.matchedTerms.map((m, i) => (
                      <span key={i} style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '4px 10px', borderRadius: 6, fontSize: '0.825rem' }}>
                        "{m.vernacular}" → <strong>{m.standard}</strong>
                      </span>
                    ))}
                  </div>
                  {matchResult.matchedDiseases && matchResult.matchedDiseases.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: 8 }}>
                        Referenced Conditions with Matched Keywords:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {matchResult.matchedDiseases.map((d, i) => (
                          <div key={i} style={{ padding: 10, background: '#FAF8F5', borderRadius: 6, fontSize: '0.825rem', color: '#1e293b' }}>
                            <strong>{d.name}</strong> ({d.icd10}) — Keyword overlap score: {d.score}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  No colloquial dictionary terms matched the provided input.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Papers */}
      {activeTab === 'papers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {TOP_RESEARCH_DOMAINS.map((domain, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 18 }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#0f172a' }}>{domain.domain || domain.title}</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.85rem', color: '#0F4C5C', fontWeight: 600 }}>Top Venues: {domain.topVenues || domain.description}</p>
              {domain.papers && domain.papers.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                  {domain.papers.map((p, idx) => (
                    <div key={idx} style={{ padding: 12, background: '#FAF8F5', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.825rem', minWidth: 0, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', overflowWrap: 'break-word' }}>{p.title}</div>
                      <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 3, overflowWrap: 'break-word' }}>
                        {p.authors} • <em>{p.journal}</em> {p.doi && `• DOI: ${p.doi}`}
                      </div>
                      {p.coreInsight && (
                        <div style={{ color: '#334155', marginTop: 6, lineHeight: 1.45, overflowWrap: 'break-word' }}>
                          <strong>Core Insight:</strong> {p.coreInsight}
                        </div>
                      )}
                      {p.recommendationForAyuSwar && (
                        <div style={{ color: '#0F4C5C', marginTop: 4, fontWeight: 600, overflowWrap: 'break-word' }}>
                          💡 <strong>Clinical Recommendation:</strong> {p.recommendationForAyuSwar}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
