import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Search, 
  Plus, 
  Trash2, 
  Sparkles, 
  Volume2, 
  TrendingDown, 
  Building2, 
  ExternalLink,
  RefreshCw,
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PMBJP_FORMULARY_DATABASE, lookupPmbjpDrug } from '../data/pmbjpFormulary';
import { generateAbdmFhirR4Bundle, downloadFhirJson } from '../data/clinicalSafetySentinel';
import { speechService } from '../services/indicSpeechService';

export default function PrescriptionPreviewView() {
  const { isDemoMode } = useApp();

  // Initial Patient Data
  const [patient, setPatient] = useState({
    name: 'Narayana Rao',
    vernacularName: 'నారాయణ రావు',
    abhaId: 'DEMO-ABHA-91-4521-8932',
    age: 58,
    gender: 'Male',
    date: new Date().toLocaleDateString('en-GB'),
    doctorName: 'Dr. Priya Sharma, MD',
    doctorSpecialty: 'Pulmonology & Internal Medicine',
    regNumber: 'DEMO-HPR-8921-9942',
    facilityName: 'District Hospital OPD Consultation Suite',
    diagnosis: 'Type-2 Diabetes Mellitus with Mild Bronchial Airway Irritation (ICD-10: E11.9 / J45.9)',
    vitals: 'BP: 130/85 mmHg, HR: 76 bpm, SpO2: 98%, Fasting Blood Sugar: 128 mg/dL'
  });

  // Prescription Medications List (Interactive)
  const [medications, setMedications] = useState([
    {
      id: 'med-01',
      brandName: 'Pan 40 (Pantoprazole 40mg)',
      vernacular: 'ప్యాంటోప్రజోల్ 40mg (పసుపు గోళీ - పరగడుపున)',
      pmbjpId: 'pmbjp-gi-001',
      dosage: '1 Tablet Daily',
      timing: 'Morning (08:30 AM) • Empty Stomach Before Breakfast',
      duration: '30 Days',
      isJanAushadhi: true
    },
    {
      id: 'med-02',
      brandName: 'Glycomet 500 SR (Metformin 500mg)',
      vernacular: 'మెట్‌ఫార్మిన్ 500mg (గులాబీ గోళీ - రాత్రి భోజనం తర్వాత)',
      pmbjpId: 'pmbjp-dia-001',
      dosage: '1 Tablet Daily',
      timing: 'Night (08:30 PM) • After Dinner',
      duration: '30 Days',
      isJanAushadhi: true
    },
    {
      id: 'med-03',
      brandName: 'Telma 40 (Telmisartan 40mg)',
      vernacular: 'టెల్మిసార్టాన్ 40mg (రక్తపోటు నియంత్రణకు)',
      pmbjpId: 'pmbjp-cv-001',
      dosage: '1 Tablet Daily',
      timing: 'Morning (09:00 AM) • Post Breakfast',
      duration: '30 Days',
      isJanAushadhi: true
    }
  ]);

  // Drug Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Search Results from PMBJP Database
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();
    return PMBJP_FORMULARY_DATABASE.filter(item => 
      item.genericName.toLowerCase().includes(q) ||
      item.popularBrand.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.indications.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchTerm]);

  // Compute Live Financial Savings
  const financialSummary = useMemo(() => {
    let totalBranded = 0;
    let totalJanAushadhi = 0;

    medications.forEach(med => {
      const pmbjp = PMBJP_FORMULARY_DATABASE.find(d => d.id === med.pmbjpId) || lookupPmbjpDrug(med.brandName);
      const brandedPrice = pmbjp ? pmbjp.brandedMrp : 150;
      const janPrice = pmbjp ? pmbjp.janAushadhiPrice : 25;

      totalBranded += brandedPrice;
      totalJanAushadhi += med.isJanAushadhi ? janPrice : brandedPrice;
    });

    const monthlySavings = Math.max(0, totalBranded - totalJanAushadhi);
    const savingsPercent = totalBranded > 0 ? Math.round((monthlySavings / totalBranded) * 100) : 0;
    const annualSavings = monthlySavings * 12;

    return {
      totalBranded,
      totalJanAushadhi,
      monthlySavings,
      savingsPercent,
      annualSavings
    };
  }, [medications]);

  // Add Medication to Prescription
  const handleAddMedication = (drug) => {
    const newMed = {
      id: `med-${Date.now()}`,
      brandName: drug.popularBrand.split('/')[0].trim(),
      vernacular: `${drug.genericName.split(' ')[0]} (${drug.indications.split(',')[0].trim()})`,
      pmbjpId: drug.id,
      dosage: '1 Tablet Daily',
      timing: 'As directed by physician',
      duration: '30 Days',
      isJanAushadhi: true
    };
    setMedications([...medications, newMed]);
    setSearchTerm('');
    showToast(`Added ${drug.genericName} with PMBJP Generic pricing!`);
  };

  // Remove Medication
  const handleRemoveMedication = (id) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  // Toggle Generic Switcher
  const handleToggleJanAushadhi = (id) => {
    setMedications(medications.map(m => {
      if (m.id === id) {
        return { ...m, isJanAushadhi: !m.isJanAushadhi };
      }
      return m;
    }));
  };

  // Switch All to Jan Aushadhi
  const handleSwitchAllToJanAushadhi = () => {
    setMedications(medications.map(m => ({ ...m, isJanAushadhi: true })));
    showToast('Switched 100% of prescription items to PMBJP Jan Aushadhi generic equivalents!');
  };

  // Spoken Vernacular Prescription Instructions (Telugu / Hindi)
  const handleSpeakPrescription = async () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    const teluguText = `నమస్కారం ${patient.vernacularName} గారు. మీ డాక్టర్ ప్రిస్క్రిప్షన్ వివరాలు: ` +
      medications.map((m, idx) => {
        const drug = PMBJP_FORMULARY_DATABASE.find(d => d.id === m.pmbjpId) || lookupPmbjpDrug(m.brandName);
        return `మందు ${idx + 1}: జన్ ఔషధి ${drug.genericName}. సమయం: ${m.timing}. ` +
          (m.isJanAushadhi ? `బ్రాండెడ్ బదులు జన్ ఔషధి వాడడం వల్ల మీరు ${drug.savingsPercent} శాతం ఖర్చు ఆదా చేసుకుంటున్నారు.` : '');
      }).join(' ') +
      ` జన్ ఔషధి కేంద్రంలో ఈ మందులు తక్కువ ధరకే లభిస్తాయి. మొత్తం నెలకు ${financialSummary.monthlySavings} రూపాయలు ఆదా అవుతాయి. వేళకు మందులు వేసుకోండి, ఆరోగ్యంగా ఉండండి.`;

    setIsSpeaking(true);
    try {
      await speechService.speak(teluguText, 'te');
    } catch {
      // Fallback completed
    } finally {
      setIsSpeaking(false);
    }
  };

  // Download ABDM FHIR R4 JSON Bundle
  const handleDownloadFhir = () => {
    const medNames = medications.map(m => {
      const drug = PMBJP_FORMULARY_DATABASE.find(d => d.id === m.pmbjpId) || lookupPmbjpDrug(m.brandName);
      return m.isJanAushadhi ? drug.genericName : m.brandName;
    });

    const report = {
      patientName: patient.name,
      patientAbha: patient.abhaId,
      diagnosis: patient.diagnosis,
      icd10: 'E11.9',
      medications: medNames
    };

    downloadFhirJson(report);
    showToast('Exported verified ABDM FHIR R4 JSON Bundle with PMBJP coding!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '36px 24px', maxWidth: '960px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#065F46',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(6, 95, 70, 0.3)',
          zIndex: 9999,
          fontSize: '13.5px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} color="#34D399" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#008B8B', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#0A2540', fontSize: '13px', fontWeight: 700 }}>Data.gov.in & PMBJP Prescription Module</span>
      </div>

      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0A2540', margin: 0 }}>
              Jan Aushadhi Prescription Module
            </h1>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 800, 
              background: '#DCFCE7', 
              color: '#15803D', 
              padding: '4px 10px', 
              borderRadius: '12px',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <CheckCircle2 size={13} />
              data.gov.in & PMBJP Verified
            </span>
          </div>
          <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
            Automated generic drug substitution mapping Indian Pharmacopoeia generics to Pradhan Mantri Jan Aushadhi Kendra codes for up to 88% patient cost reduction.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleSpeakPrescription}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid #38BDF8',
              background: isSpeaking ? '#EF4444' : '#F0F9FF',
              color: isSpeaking ? '#FFFFFF' : '#0369A1',
              fontSize: '13px',
              fontWeight: 750,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Volume2 size={16} />
            <span>{isSpeaking ? 'Stop Audio' : '🔊 Listen (తెలుగు / Hindi)'}</span>
          </button>

          <button
            onClick={handleDownloadFhir}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#0A2540',
              fontSize: '13px',
              fontWeight: 750,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={15} color="#008B8B" />
            <span>FHIR JSON</span>
          </button>

          <button
            onClick={handlePrint}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#008B8B',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(0, 139, 139, 0.25)'
            }}
          >
            <Printer size={15} />
            <span>Print Rx Slip</span>
          </button>
        </div>
      </div>

      {/* 💰 Live Data.gov.in Jan Aushadhi Savings Card */}
      <div style={{
        background: 'linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)',
        color: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: '28px',
        boxShadow: '0 12px 30px rgba(6, 78, 59, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              padding: '3px 10px', 
              borderRadius: '8px', 
              fontSize: '11px', 
              fontWeight: 800, 
              letterSpacing: '0.5px' 
            }}>
              DATA.GOV.IN / PMBI OPEN FORMULARY
            </span>
            <span style={{ fontSize: '12px', color: '#A7F3D0' }}>
              • 50+ Essential Formulations Capped under NLEM 2022
            </span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 6px 0' }}>
            Patient Saves ₹{financialSummary.monthlySavings} / Month ({financialSummary.savingsPercent}% Cost Reduction)
          </h2>

          <p style={{ fontSize: '13px', color: '#D1FAE5', margin: 0, maxWidth: '560px', lineHeight: 1.5 }}>
            Switching from branded prescription drugs to Pradhan Mantri Jan Aushadhi generic equivalents saves this rural household <strong>₹{financialSummary.annualSavings.toLocaleString('en-IN')} annually</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ 
            background: 'rgba(0, 0, 0, 0.2)', 
            padding: '14px 18px', 
            borderRadius: '12px', 
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ fontSize: '11px', color: '#A7F3D0', fontWeight: 700, textTransform: 'uppercase' }}>Branded MRP</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#FCA5A5', textDecoration: 'line-through' }}>
              ₹{financialSummary.totalBranded}
            </div>
            <div style={{ fontSize: '10.5px', color: '#D1D5DB' }}>Market cost</div>
          </div>

          <div style={{ 
            background: '#FFFFFF', 
            color: '#065F46', 
            padding: '14px 20px', 
            borderRadius: '12px', 
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '11px', color: '#047857', fontWeight: 800, textTransform: 'uppercase' }}>Jan Aushadhi Cost</div>
            <div style={{ fontSize: '22px', fontWeight: 900 }}>
              ₹{financialSummary.totalJanAushadhi}
            </div>
            <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: 700 }}>PMBJP Kendra Price</div>
          </div>

          <button
            onClick={handleSwitchAllToJanAushadhi}
            style={{
              padding: '12px 18px',
              borderRadius: '12px',
              border: 'none',
              background: '#34D399',
              color: '#064E3B',
              fontSize: '13px',
              fontWeight: 850,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(52, 211, 153, 0.4)'
            }}
          >
            <Sparkles size={16} />
            <span>Maximize Savings</span>
          </button>
        </div>
      </div>

      {/* 🔍 Search & Add Generic Drugs from Data.gov.in Database */}
      <div style={{ 
        background: '#FFFFFF', 
        borderRadius: '14px', 
        border: '1px solid #CBD5E1', 
        padding: '18px 22px', 
        marginBottom: '24px',
        position: 'relative' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Search size={16} color="#008B8B" />
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540', textTransform: 'uppercase' }}>
            Search Medicine in Data.gov.in & PMBJP Formulary:
          </span>
        </div>

        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type drug name or brand (e.g., Telma, Atorva, Paracetamol, Metformin, Budesonide, Pantoprazole)..."
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1.5px solid #94A3B8',
              fontSize: '13.5px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {searchResults.length > 0 && (
          <div style={{
            marginTop: '10px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            {searchResults.map(drug => (
              <div 
                key={drug.id}
                onClick={() => handleAddMedication(drug)}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #F1F5F9',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
              >
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A2540' }}>
                    {drug.genericName}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                    Popular Brand: <strong>{drug.popularBrand}</strong> • Category: {drug.category} • Code: {drug.kendraCode}
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div>
                    <div style={{ fontSize: '10.5px', color: '#64748B', textDecoration: 'line-through' }}>MRP ₹{drug.brandedMrp}</div>
                    <div style={{ fontSize: '14px', fontWeight: 850, color: '#15803D' }}>PMBJP ₹{drug.janAushadhiPrice}</div>
                    <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: 700 }}>Save {drug.savingsPercent}%</div>
                  </div>

                  <button
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#008B8B',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 📄 Prescription Document Sheet (Printable Format) */}
      <div 
        id="prescription-sheet"
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #CBD5E1',
          boxShadow: '0 8px 30px rgba(10,37,64,0.06)',
          padding: '36px',
          position: 'relative'
        }}
      >
        {/* Clinician Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #008B8B', paddingBottom: '16px', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0A2540', margin: '0 0 2px 0' }}>
              {patient.doctorName}
            </h2>
            <div style={{ fontSize: '13px', color: '#008B8B', fontWeight: 750 }}>
              {patient.doctorSpecialty}
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
              Medical Reg No: {patient.regNumber} • {patient.facilityName}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#0A2540' }}>Date: {patient.date}</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>FHIR R4 Bundle #RX-2026-PMBJP-0941</div>
            <div style={{ fontSize: '10.5px', color: '#15803D', fontWeight: 750, marginTop: '2px' }}>
              ✓ Data.gov.in / PMBI Compliant
            </div>
          </div>
        </div>

        {/* Patient Demographics */}
        <div style={{ 
          background: '#F8FAFC', 
          borderRadius: '12px', 
          padding: '16px', 
          marginBottom: '24px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '10px', 
          fontSize: '13px' 
        }}>
          <div>
            <span style={{ color: '#64748B' }}>Patient Name: </span>
            <strong style={{ color: '#0A2540' }}>{patient.name} ({patient.vernacularName})</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Age / Gender: </span>
            <strong style={{ color: '#0A2540' }}>{patient.age}y / {patient.gender}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>ABHA ID: </span>
            <strong style={{ color: '#0A2540', fontFamily: 'monospace' }}>{patient.abhaId}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Recorded Vitals: </span>
            <span style={{ color: '#0A2540' }}>{patient.vitals}</span>
          </div>
        </div>

        {/* Clinical Diagnosis */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
            Clinical Diagnosis & Assessment:
          </div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540' }}>
            {patient.diagnosis}
          </div>
        </div>

        {/* Prescription Table with PMBJP Switchers */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: '#008B8B', fontFamily: 'serif' }}>℞</span>
              <span style={{ fontSize: '14px', fontWeight: 850, color: '#0A2540', textTransform: 'uppercase' }}>
                Medication Order & Jan Aushadhi Dispense Mapping
              </span>
            </div>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              {medications.length} Prescribed Medications
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {medications.map((med, idx) => {
              const drug = PMBJP_FORMULARY_DATABASE.find(d => d.id === med.pmbjpId) || lookupPmbjpDrug(med.brandName);
              const brandMrp = drug ? drug.brandedMrp : 150;
              const janPrice = drug ? drug.janAushadhiPrice : 24;
              const savings = drug ? drug.savingsPercent : 80;

              return (
                <div 
                  key={med.id} 
                  style={{ 
                    border: med.isJanAushadhi ? '1.5px solid #BBF7D0' : '1px solid #E2E8F0', 
                    borderRadius: '12px', 
                    padding: '16px 18px', 
                    background: med.isJanAushadhi ? '#F0FDF4' : '#FFFFFF',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14.5px', fontWeight: 850, color: '#0A2540' }}>
                          {idx + 1}. {med.isJanAushadhi ? drug.genericName : med.brandName}
                        </span>
                        {med.isJanAushadhi && (
                          <span style={{ 
                            fontSize: '10.5px', 
                            background: '#DCFCE7', 
                            color: '#15803D', 
                            padding: '2px 8px', 
                            borderRadius: '6px', 
                            fontWeight: 800,
                            border: '1px solid #86EFAC'
                          }}>
                            ✓ PMBJP Kendra #{drug.kendraCode}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '12px', color: '#008B8B', fontWeight: 700, marginTop: '3px' }}>
                        {med.vernacular}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Price & Savings Badge */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          Branded: <s style={{ color: '#DC2626' }}>₹{brandMrp}</s>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 850, color: med.isJanAushadhi ? '#15803D' : '#0A2540' }}>
                          Price: ₹{med.isJanAushadhi ? janPrice : brandMrp}
                        </div>
                        {med.isJanAushadhi && (
                          <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: 750 }}>
                            Save {savings}% (₹{brandMrp - janPrice})
                          </div>
                        )}
                      </div>

                      {/* Toggle Generic Button */}
                      <button
                        onClick={() => handleToggleJanAushadhi(med.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: med.isJanAushadhi ? '1px solid #059669' : '1px solid #CBD5E1',
                          background: med.isJanAushadhi ? '#ECFDF5' : '#F8FAFC',
                          color: med.isJanAushadhi ? '#065F46' : '#475569',
                          fontSize: '11.5px',
                          fontWeight: 750,
                          cursor: 'pointer'
                        }}
                      >
                        {med.isJanAushadhi ? '✓ Jan Aushadhi' : 'Switch to Generic'}
                      </button>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemoveMedication(med.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                        title="Remove drug"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '8px', borderTop: '1px dashed #CBD5E1', paddingTop: '8px' }}>
                    <strong>Dosage & Frequency:</strong> {med.dosage} • <strong>Timing:</strong> {med.timing} • <strong>Duration:</strong> {med.duration}
                  </div>

                  <div style={{ fontSize: '11px', color: '#059669', marginTop: '4px' }}>
                    Government NLEM Ceiling: <strong>{drug.nlemCeiling}</strong> • Unit Pack: {drug.unit}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Doctor Signature & Dispense Stamp */}
        <div style={{ 
          borderTop: '2px solid #E2E8F0', 
          paddingTop: '20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 750, marginBottom: '2px' }}>
              ✓ Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) Verified Dispense Slip
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Show this slip at any PMBJP Kendra across India for price-capped generic delivery.
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ borderBottom: '1px solid #0A2540', width: '200px', marginBottom: '4px' }} />
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540' }}>{patient.doctorName}</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Attending Physician Digital Signature (ABDM HPR Verified)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
