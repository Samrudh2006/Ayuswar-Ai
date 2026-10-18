import React, { useState } from 'react';
import { 
  Pill, 
  ShieldCheck, 
  Smartphone, 
  KeyRound, 
  Sparkles, 
  UserCheck, 
  Users, 
  Plus, 
  Trash2, 
  UserPlus, 
  Stethoscope, 
  Heart,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { triagePatientCondition, generateClinicalProfile, DOCTOR_REGISTRY } from '../data/clinicalRegistry';

/**
 * PatientAuthModal Component
 * Implements Ayushman Bharat Health Account (ABHA) Citizen Authentication &
 * Family Health Locker Registration.
 * Allows citizens to register themselves and add family members with diseases,
 * automatically mapping each family member to their specialized doctor!
 */
export default function PatientAuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('register'); // 'login' | 'register'
  
  // Login State
  const [abhaId, setAbhaId] = useState('91-4521-8932-1049');
  const [mobileOtp, setMobileOtp] = useState('4920');
  const [loginPatientSelect, setLoginPatientSelect] = useState('narayana');

  // Registration State: Primary Citizen
  const [regName, setRegName] = useState('Ramesh Reddy (రమేష్ రెడ్డి)');
  const [regAge, setRegAge] = useState(36);
  const [regGender, setRegGender] = useState('Male');
  const [regMobile, setRegMobile] = useState('9849201948');
  const [regLanguage, setRegLanguage] = useState('Telugu');
  const [regCondition, setRegCondition] = useState('Asthma & Seasonal Airway Wheezing');

  // Registration State: Family Members
  const [includeFamily, setIncludeFamily] = useState(true);
  const [familyList, setFamilyList] = useState([
    {
      id: 1,
      name: 'Saraswathi Devi (తల్లి)',
      relation: 'Mother',
      age: 62,
      gender: 'Female',
      condition: 'Type-2 Diabetes & Hypertension',
      language: 'Telugu'
    },
    {
      id: 2,
      name: 'Master Chinna (కుమారుడు)',
      relation: 'Son',
      age: 6,
      gender: 'Male',
      condition: 'Pediatric Cough & High Fever',
      language: 'Telugu'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Add Family Member
  const handleAddFamilyMember = () => {
    const newMember = {
      id: Date.now(),
      name: '',
      relation: 'Father',
      age: 50,
      gender: 'Male',
      condition: 'Type-2 Diabetes & Hypertension',
      language: regLanguage
    };
    setFamilyList([...familyList, newMember]);
  };

  const handleUpdateFamilyMember = (id, field, value) => {
    setFamilyList(familyList.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleRemoveFamilyMember = (id) => {
    setFamilyList(familyList.filter(m => m.id !== id));
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (authMode === 'login') {
        // Pre-configured citizen login
        let selectedProfile;
        if (loginPatientSelect === 'ananya') {
          const clin = generateClinicalProfile('Ananya Rao', 'Asthma & Seasonal Allergy', 'Telugu');
          selectedProfile = {
            patientName: 'Ananya Rao',
            age: 28,
            gender: 'Female',
            language: 'Telugu',
            abhaId: '91-4521-8932-1049',
            condition: 'Asthma & Seasonal Allergy',
            relation: 'Self',
            facility: 'Kurnool District Hospital',
            ...clin,
            familyMembers: []
          };
        } else if (loginPatientSelect === 'sunita') {
          const clin = generateClinicalProfile('Sunita Devi', 'Seasonal Viral Pyrexia', 'Hindi');
          selectedProfile = {
            patientName: 'Sunita Devi (सुनीता देवी)',
            age: 42,
            gender: 'Female',
            language: 'Hindi',
            abhaId: '91-3310-9082-4123',
            condition: 'Post-Viral Bronchial Sensitivity',
            relation: 'Self',
            facility: 'Warangal Rural PHC #09',
            ...clin,
            familyMembers: []
          };
        } else if (loginPatientSelect === 'aarav') {
          const clin = generateClinicalProfile('Aarav Kumar', 'Pediatric Wheeze & Bronchospasm', 'Hindi');
          selectedProfile = {
            patientName: 'Aarav Kumar (आरव कुमार)',
            age: 4,
            gender: 'Male',
            language: 'Hindi',
            abhaId: '91-8821-4432-9012',
            condition: 'Pediatric Wheeze & Bronchospasm',
            relation: 'Self',
            facility: 'Niloufer Children Hospital',
            ...clin,
            familyMembers: []
          };
        } else if (loginPatientSelect === 'suresh') {
          const clin = generateClinicalProfile('Suresh Babu', 'Type-2 Diabetes & Dyslipidemia', 'Telugu');
          selectedProfile = {
            patientName: 'Suresh Babu (సురేష్ బాబు)',
            age: 56,
            gender: 'Male',
            language: 'Telugu',
            abhaId: '91-5542-8812-3301',
            condition: 'Type-2 Diabetes & Dyslipidemia',
            relation: 'Self',
            facility: 'Nizam Heart & Metabolism Center',
            ...clin,
            familyMembers: []
          };
        } else if (loginPatientSelect === 'meera') {
          const clin = generateClinicalProfile('Meera Nair', 'Post-viral productive cough & wheezing', 'English');
          selectedProfile = {
            patientName: 'Meera Nair (മീര നായർ)',
            age: 34,
            gender: 'Female',
            language: 'English',
            abhaId: '91-6632-1923-4411',
            condition: 'Post-viral productive cough & wheezing',
            relation: 'Self',
            facility: 'Kurnool District Hospital',
            ...clin,
            familyMembers: []
          };
        } else {
          const clin = generateClinicalProfile('Narayana Rao', 'Type-2 Diabetes & Hypertension', 'Telugu');
          selectedProfile = {
            patientName: 'Narayana Rao (నారాయణ రావు)',
            age: 58,
            gender: 'Male',
            language: 'Telugu',
            abhaId: '91-8842-1920-5511',
            condition: 'Type-2 Diabetes & Hypertension',
            relation: 'Self',
            facility: 'Anantapur Community Health Centre',
            ...clin,
            familyMembers: []
          };
        }

        onLoginSuccess(selectedProfile);
        onClose();
        return;
      }

      // Registration Mode: Build Primary and Family Profiles
      const primaryClin = generateClinicalProfile(regName, regCondition, regLanguage);
      const primaryProfile = {
        patientName: regName,
        age: Number(regAge),
        gender: regGender,
        language: regLanguage,
        abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        condition: regCondition,
        relation: 'Primary Citizen (Self)',
        facility: primaryClin.assignedDoctor.facility,
        ...primaryClin
      };

      let finalFamilyMembers = [];
      if (includeFamily && familyList.length > 0) {
        const mappedMembers = familyList
          .filter(m => m.name.trim().length > 0)
          .map((m, idx) => {
            const memberClin = generateClinicalProfile(m.name, m.condition, m.language || regLanguage);
            return {
              patientName: m.name,
              age: Number(m.age),
              gender: m.gender,
              language: m.language || regLanguage,
              abhaId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${idx + 10}`,
              condition: m.condition,
              relation: m.relation,
              facility: memberClin.assignedDoctor.facility,
              ...memberClin
            };
          });

        // Family locker contains Primary citizen + family members
        finalFamilyMembers = [primaryProfile, ...mappedMembers];
      } else {
        // Single user only — no family switching
        finalFamilyMembers = [primaryProfile];
      }

      const finalizedPatientSession = {
        ...primaryProfile,
        familyMembers: finalFamilyMembers
      };

      onLoginSuccess(finalizedPatientSession);
      onClose();
    }, 700);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(10, 37, 64, 0.75)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)'
      }}
    >
      <div className="modal-content" style={{
        background: '#ffffff',
        width: '540px',
        maxWidth: '100%',
        maxHeight: '92vh',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(10, 37, 64, 0.35)',
        border: '1px solid #D8E7EB',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A2540 0%, #D97706 100%)',
          padding: '20px 24px',
          color: '#ffffff',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Pill size={22} color="#FDE047" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', color: '#ffffff', fontWeight: 800, margin: 0 }}>
                Patient Seva Portal & Family Locker
              </h3>
              <div style={{ fontSize: '11.5px', color: '#FEF3C7', opacity: 0.9 }}>
                ABHA Citizen Health Account • Auto-Doctor Clinical Triage
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div style={{
          display: 'flex',
          background: '#F1F5F9',
          borderBottom: '1px solid #E2E8F0',
          padding: '4px 6px'
        }}>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '10px',
              background: authMode === 'register' ? '#ffffff' : 'transparent',
              color: authMode === 'register' ? '#D97706' : '#64748B',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: authMode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <UserPlus size={15} />
            <span>Register Citizen & Family Locker</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('login')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '10px',
              background: authMode === 'login' ? '#ffffff' : 'transparent',
              color: authMode === 'login' ? '#0A2540' : '#64748B',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: authMode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <KeyRound size={15} />
            <span>Quick ABHA Citizen Login</span>
          </button>
        </div>

        {/* Form Body with Scroll */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {authMode === 'login' ? (
            /* =========================================================================
               LOGIN FLOW (Pre-existing single citizen ABHA access)
               ========================================================================= */
            <div>
              <div style={{
                background: 'rgba(217, 119, 6, 0.08)',
                border: '1px solid rgba(217, 119, 6, 0.25)',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#92400E',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <ShieldCheck size={18} color="#D97706" />
                <span>Select a preloaded demo citizen profile to login immediately.</span>
              </div>

              {/* Instant 1-Tap Mobile Demo Login */}
              <button
                type="button"
                onClick={() => {
                  const clin = generateClinicalProfile('Ananya Rao', 'Asthma & Seasonal Allergy', 'Telugu');
                  const selectedProfile = {
                    patientName: 'Ananya Rao (అనన్య రావు)',
                    age: 28,
                    gender: 'Female',
                    language: 'Telugu',
                    abhaId: '91-4521-8932-1049',
                    condition: 'Asthma & Seasonal Allergy',
                    relation: 'Self',
                    facility: 'Kurnool District Hospital',
                    ...clin,
                    familyMembers: []
                  };
                  onLoginSuccess(selectedProfile);
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                  marginBottom: '16px'
                }}
              >
                <Sparkles size={16} color="#FDE68A" />
                <span>⚡ 1-Tap Quick Patient Login (Ananya Rao - ABHA)</span>
              </button>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#0A2540', marginBottom: '6px' }}>
                  Select Citizen Account
                </label>
                <select
                  value={loginPatientSelect}
                  onChange={e => setLoginPatientSelect(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0A2540',
                    background: '#ffffff'
                  }}
                >
                  <option value="narayana">👴 Narayana Rao (58y, Male, Telugu) — Type-2 Diabetes & HTN (Dr. Rajesh)</option>
                  <option value="ananya">👩 Ananya Rao (28y, Female, Telugu) — Asthma & Allergic Wheeze (Dr. Priya)</option>
                  <option value="sunita">🧕 Sunita Devi (42y, Female, Hindi) — Post-Viral Bronchial Sensitivity (Dr. Priya)</option>
                  <option value="aarav">👦 Aarav Kumar (4y, Male, Hindi) — Pediatric Wheeze (Dr. Vikram Seth)</option>
                  <option value="suresh">👨 Suresh Babu (56y, Male, Telugu) — Type-2 Diabetes & Dyslipidemia (Dr. Rajesh)</option>
                  <option value="meera">👩 Meera Nair (34y, Female, English) — Productive Cough & Wheeze (Dr. Priya)</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#0A2540', marginBottom: '6px' }}>
                  Citizen ABHA ID / Registered Mobile
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={abhaId}
                    onChange={(e) => setAbhaId(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      color: '#0F172A'
                    }}
                  />
                  <Smartphone size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#0A2540', marginBottom: '6px' }}>
                  Aadhaar / Mobile OTP
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    value={mobileOtp}
                    onChange={(e) => setMobileOtp(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      color: '#0F172A',
                      letterSpacing: '2px'
                    }}
                  />
                  <KeyRound size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================================
               SIGNUP / REGISTRATION FLOW (CITIZEN + OPTIONAL FAMILY MEMBERS)
               ========================================================================= */
            <div>
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <CheckCircle2 size={18} color="#16A34A" />
                <span>
                  <strong>AyuSwar Clinical Triage:</strong> Doctors are assigned automatically based on clinical conditions!
                </span>
              </div>

              {/* SECTION 1: PRIMARY CITIZEN DETAILS */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '14px 16px',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>👤</span>
                  <span>Primary Citizen Information (మీ వివరాలు)</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="e.g. Ramesh Reddy"
                      required
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Age & Gender
                    </label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <input
                        type="number"
                        value={regAge}
                        onChange={e => setRegAge(e.target.value)}
                        style={{ width: '52px', padding: '8px 6px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      />
                      <select
                        value={regGender}
                        onChange={e => setRegGender(e.target.value)}
                        style={{ flex: 1, padding: '8px 4px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '11.5px', background: '#fff' }}
                      >
                        <option value="Male">M</option>
                        <option value="Female">F</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      value={regMobile}
                      onChange={e => setRegMobile(e.target.value)}
                      placeholder="98XXXXXXXX"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Spoken Dialect / Language
                    </label>
                    <select
                      value={regLanguage}
                      onChange={e => setRegLanguage(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', background: '#fff' }}
                    >
                      <option value="Telugu">తెలుగు (Telugu)</option>
                      <option value="Hindi">हिन्दी (Hindi)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Primary Medical Condition / Disease
                  </label>
                  <select
                    value={regCondition}
                    onChange={e => setRegCondition(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #008B8B', fontSize: '12px', background: '#fff', fontWeight: 650 }}
                  >
                    <option value="Asthma & Seasonal Airway Wheezing">🫁 Asthma & Seasonal Wheezing (Pulmonology)</option>
                    <option value="Type-2 Diabetes & Hypertension">🩸 Type-2 Diabetes & Hypertension (Cardiology/Diabetology)</option>
                    <option value="Seasonal Pyrexia & Throat Infection">🌡️ Seasonal Fever & Sore Throat (General Medicine)</option>
                  </select>
                  {/* Doctor assignment pill preview */}
                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#065F46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Stethoscope size={13} color="#008B8B" />
                    <span>
                      Assigned Doctor: <strong>{triagePatientCondition(regCondition).doctor.doctorName}</strong> ({triagePatientCondition(regCondition).doctor.specialty})
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: FAMILY MEMBERS TOGGLE & CARDS */}
              <div style={{
                border: '1.5px dashed #CBD5E1',
                borderRadius: '14px',
                padding: '14px 16px',
                marginBottom: '16px',
                background: includeFamily ? '#FFFBEB' : '#F8FAFC'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 800, color: '#0A2540' }}>
                    <input
                      type="checkbox"
                      checked={includeFamily}
                      onChange={e => setIncludeFamily(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#D97706' }}
                    />
                    <span>Add Family Members to Shared Health Locker (కుటుంబ ఖాతా)</span>
                  </label>
                </div>

                <p style={{ fontSize: '11px', color: '#64748B', margin: '0 0 10px 0' }}>
                  {includeFamily 
                    ? 'Register your parents, spouse, or children. Each will get an assigned doctor according to their disease and can be switched in your portal!'
                    : 'Unchecked: You will have a single citizen profile with no profile switching.'}
                </p>

                {includeFamily && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {familyList.map((member, index) => {
                      const docTriage = triagePatientCondition(member.condition);
                      return (
                        <div
                          key={member.id}
                          style={{
                            background: '#ffffff',
                            borderRadius: '10px',
                            padding: '12px',
                            border: '1px solid #FDE68A',
                            boxShadow: '0 2px 6px rgba(217, 119, 6, 0.05)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 800, color: '#B45309' }}>
                              Family Member #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFamilyMember(member.id)}
                              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Trash2 size={13} />
                              <span>Remove</span>
                            </button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '8px', marginBottom: '8px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Name</label>
                              <input
                                type="text"
                                value={member.name}
                                onChange={e => handleUpdateFamilyMember(member.id, 'name', e.target.value)}
                                placeholder="e.g. Saraswathi Devi"
                                style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>Relation & Age</label>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <select
                                  value={member.relation}
                                  onChange={e => handleUpdateFamilyMember(member.id, 'relation', e.target.value)}
                                  style={{ flex: 1, padding: '6px 4px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11px', background: '#fff' }}
                                >
                                  <option value="Mother">Mother</option>
                                  <option value="Father">Father</option>
                                  <option value="Spouse">Spouse</option>
                                  <option value="Son">Son</option>
                                  <option value="Daughter">Daughter</option>
                                  <option value="Grandmother">Grandmother</option>
                                  <option value="Grandfather">Grandfather</option>
                                </select>
                                <input
                                  type="number"
                                  value={member.age}
                                  onChange={e => handleUpdateFamilyMember(member.id, 'age', e.target.value)}
                                  style={{ width: '42px', padding: '6px 4px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11px' }}
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                              Disease / Condition
                            </label>
                            <select
                              value={member.condition}
                              onChange={e => handleUpdateFamilyMember(member.id, 'condition', e.target.value)}
                              style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '11.5px', background: '#fff' }}
                            >
                              <option value="Type-2 Diabetes & Hypertension">🩸 Type-2 Diabetes & Hypertension (Cardiologist)</option>
                              <option value="Asthma & Seasonal Airway Wheezing">🫁 Asthma & Wheeze (Pulmonologist)</option>
                              <option value="Pediatric Cough & High Fever">🌡️ Pediatric Cough & Fever (Pediatrician / General)</option>
                              <option value="Osteoarthritis & Chronic Joint Pain">🦴 Joint Pain & General Fatigue (General Physician)</option>
                            </select>
                          </div>

                          <div style={{ marginTop: '5px', fontSize: '10.5px', color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Stethoscope size={11} color="#047857" />
                            <span>Assigned: <strong>{docTriage.doctor.doctorName}</strong> ({docTriage.doctor.specialty})</span>
                          </div>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleAddFamilyMember}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #D97706',
                        color: '#D97706',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '12px',
                        fontWeight: 750,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Plus size={14} />
                      <span>+ Add Another Family Member</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '13px',
              fontSize: '14px',
              background: '#D97706',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            {isLoading ? (
              <span>Verifying & Setting Up Clinical Locker...</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>
                  {authMode === 'register' 
                    ? (includeFamily ? 'Complete Registration & Open Family Locker' : 'Complete Registration & Open My Portal')
                    : 'Login to My Patient Seva Portal'}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
