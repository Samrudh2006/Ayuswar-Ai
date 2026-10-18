import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  PhoneCall, 
  AlertTriangle, 
  Heart, 
  Mic, 
  Square, 
  CheckCircle2, 
  Activity, 
  MapPin, 
  FileText, 
  ExternalLink,
  Cpu,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Navigation,
  Building2,
  Search,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  analyzeEmergencyClinicalTriage, 
  simulateEvonDispatchPipeline,
  requestRealDeviceLocation,
  reverseGeocodeGPS
} from '../services/sanjivaniEmergencyService';
import { 
  fetchNearbyHospitalsAPI, 
  searchLocationUniversal 
} from '../services/emergencyHospitalBackend.js';
import { reasonEmergencyTriageWithEvon } from '../services/gnaniEvonService';
import { speechService } from '../services/indicSpeechService';
import SanjivaniAnimatedFlowchart from '../components/SanjivaniAnimatedFlowchart';
import EvonStatusChip from '../components/EvonStatusChip';

export default function EmergencyTriageView({ onOpenFullConsole }) {
  const { selectedLanguage } = useApp();

  const [inputText, setInputText] = useState('నాకు తీవ్రమైన గుండె నొప్పిగా ఉంది, చెమటలు పడుతున్నాయి, శ్వాస ఆడటం లేదు');
  const [triageResult, setTriageResult] = useState(() => analyzeEmergencyClinicalTriage(inputText));
  const [evonAdvisory, setEvonAdvisory] = useState(null);
  const [isLoadingEvon, setIsLoadingEvon] = useState(false);
  const [isSimulatingDispatch, setIsSimulatingDispatch] = useState(false);
  const [dispatchSteps, setDispatchSteps] = useState([]);
  const [dispatchComplete, setDispatchComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [cprMetronomeActive, setCprMetronomeActive] = useState(false);
  const [showEvonTrace, setShowEvonTrace] = useState(true);

  // Live Geo-Locational Telemetry & Dynamic Hospital Discovery
  const [userCoords, setUserCoords] = useState({ latitude: 17.6913, longitude: 83.0040, accuracy: 15 });
  const [detectedLocationName, setDetectedLocationName] = useState('Resolving device GPS / IP location...');
  const [isLocating, setIsLocating] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [recommendedHospital, setRecommendedHospital] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);
  const [hospitalFilter, setHospitalFilter] = useState('ALL');
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  const cprIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cprIntervalRef.current) clearInterval(cprIntervalRef.current);
    };
  }, []);

  const detectLiveLocation = async () => {
    setIsLocating(true);
    try {
      const loc = await requestRealDeviceLocation();
      setUserCoords({ latitude: loc.latitude, longitude: loc.longitude, accuracy: loc.accuracy || 15 });
      const addr = await reverseGeocodeGPS(loc.latitude, loc.longitude);
      const locName = addr.displayName || (loc.city ? `${loc.city}, ${loc.region}` : `${loc.latitude.toFixed(4)}°N, ${loc.longitude.toFixed(4)}°E`);
      setDetectedLocationName(locName);
      loadHospitalsForCoords(loc.latitude, loc.longitude, locName, hospitalFilter);
    } catch (err) {
      console.warn('Geolocation detection error:', err);
    } finally {
      setIsLocating(false);
    }
  };

  const loadHospitalsForCoords = async (lat, lng, locName, filter = hospitalFilter) => {
    setIsLoadingHospitals(true);
    try {
      const res = await fetchNearbyHospitalsAPI({
        lat,
        lng,
        geoAddress: locName,
        filterOption: filter
      });
      if (res.success && res.hospitals.length > 0) {
        setNearbyHospitals(res.hospitals);
        setRecommendedHospital(res.recommendedHospital);
        if (!selectedHospital || !res.hospitals.find(h => h.id === selectedHospital.id)) {
          setSelectedHospital(res.recommendedHospital || res.hospitals[0]);
        }
      }
    } catch (err) {
      console.warn('Error fetching nearby hospitals:', err);
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  useEffect(() => {
    detectLiveLocation();
  }, []);

  const handleFilterChange = (filter) => {
    setHospitalFilter(filter);
    loadHospitalsForCoords(userCoords.latitude, userCoords.longitude, detectedLocationName, filter);
  };

  const handleLocationSearch = async (query) => {
    setSearchLocationQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearchingLocation(true);
    try {
      const results = await searchLocationUniversal(query);
      setSearchResults(results || []);
    } catch (err) {
      console.warn('Location search error:', err);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleSelectSearchResult = (item) => {
    setUserCoords({ latitude: item.lat, longitude: item.lng, accuracy: 25 });
    setDetectedLocationName(item.placeName);
    setSearchLocationQuery('');
    setSearchResults([]);
    loadHospitalsForCoords(item.lat, item.lng, item.placeName, hospitalFilter);
  };

  const handleTriageAnalyze = async (textToUse) => {
    const text = textToUse || inputText;
    // Step 1: Immediate, non-blocking 100% deterministic rule-based triage (0ms delay)
    const result = analyzeEmergencyClinicalTriage(text);
    setTriageResult(result);

    // Step 2: Asynchronous advisory Evon reasoning query (server-side route only)
    setIsLoadingEvon(true);
    try {
      const adv = await reasonEmergencyTriageWithEvon(text, { language: 'te' });
      setEvonAdvisory(adv);
    } catch (err) {
      setEvonAdvisory({
        isEvonLive: false,
        isFallback: true,
        source: 'FALLBACK: DETERMINISTIC RULE-BASED SAFETY PROTOCOL',
        error: err.message
      });
    } finally {
      setIsLoadingEvon(false);
    }
  };

  const handleToggleVoiceRecording = () => {
    if (isRecording) {
      speechService.stopLiveRecognition();
      setIsRecording(false);
      handleTriageAnalyze(inputText);
    } else {
      setIsRecording(true);
      const targetLang = selectedLanguage === 'te' ? 'te-IN' : (selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN');
      speechService.startLiveRecognition({
        langCode: targetLang,
        onResult: ({ transcript, isFinal }) => {
          if (transcript) {
            setInputText(transcript);
            if (isFinal) {
              handleTriageAnalyze(transcript);
            }
          }
        },
        onError: (err) => {
          console.warn('Live voice recognition notice:', err);
          setIsRecording(false);
        },
        onStatusChange: ({ isListening }) => {
          setIsRecording(isListening);
        }
      });
    }
  };

  const handleStartDispatchSimulation = () => {
    setIsSimulatingDispatch(true);
    setDispatchComplete(false);
    setDispatchSteps([]);

    const assignedHosp = selectedHospital || recommendedHospital;
    simulateEvonDispatchPipeline({
      coords: { latitude: userCoords.latitude, longitude: userCoords.longitude, accuracy: userCoords.accuracy || 15 },
      landmark: detectedLocationName,
      hospitalName: assignedHosp ? `${assignedHosp.name} (${assignedHosp.resuscitationBayAssigned || 'Emergency Bay'})` : undefined,
      triageData: triageResult,
      onToolStep: (step) => {
        setDispatchSteps(prev => [...prev, step]);
      },
      onComplete: () => {
        setIsSimulatingDispatch(false);
        setDispatchComplete(true);
      }
    });
  };

  const handleToggleCprMetronome = () => {
    if (cprMetronomeActive) {
      if (cprIntervalRef.current) clearInterval(cprIntervalRef.current);
      cprIntervalRef.current = null;
      setCprMetronomeActive(false);
    } else {
      setCprMetronomeActive(true);
      // 110 BPM CPR pulse audio beep
      const intervalMs = Math.round(60000 / 110);
      cprIntervalRef.current = setInterval(() => {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
          }
        } catch {}
      }, intervalMs);
    }
  };

  return (
    <div style={{ padding: '36px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#008B8B', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#64748B', fontSize: '13px' }}>Emergency</span>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#0A2540', fontSize: '13px', fontWeight: 700 }}>Sanjivani-108 Simulator</span>
      </div>

      {/* Real Emergency Advisory Callout */}
      <div style={{ background: '#FEF2F2', border: '2px solid #F87171', borderRadius: '16px', padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ background: '#DC2626', color: '#FFFFFF', padding: '10px', borderRadius: '12px', flexShrink: 0 }}>
          <PhoneCall size={24} />
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 850, color: '#991B1B', marginBottom: '4px' }}>
            ACTUAL MEDICAL EMERGENCY? DIAL 112 OR 108 IMMEDIATELY
          </div>
          <p style={{ fontSize: '13px', color: '#B91C1C', lineHeight: 1.5, margin: 0 }}>
            This application is an educational prototype simulation. It cannot dispatch real emergency ambulances or reserve hospital trauma beds. If someone is experiencing severe chest pain, breathing cessation, or traumatic bleeding, call official emergency services without delay.
          </p>
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(220, 38, 38, 0.1)', color: '#DC2626', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
            <Activity size={14} />
            <span>INTERACTIVE SIMULATION PROTOTYPE</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 850, color: '#0A2540', marginBottom: '10px' }}>
            Sanjivani-108 Emergency Acoustic Triage Simulator
          </h1>
          <p style={{ fontSize: '15px', color: '#5A7184', maxWidth: '850px', lineHeight: 1.6 }}>
            Demonstrates vernacular audio distress analysis, high-acuity triage categorization, and standardized first-aid instructions for bystander guidance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {onOpenFullConsole && (
            <button
              onClick={onOpenFullConsole}
              style={{
                padding: '12px 20px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)'
              }}
            >
              <Activity size={16} />
              <span>Launch Live Sanjivani-108 Console</span>
            </button>
          )}

          <Link
            to="/emergency/handover"
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#0A2540',
              fontSize: '13px',
              fontWeight: 750,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FileText size={15} color="#008B8B" />
            <span>View Paramedic Handover Record</span>
          </Link>
        </div>
      </div>

      {/* Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left Column: Triage Input & Scenarios */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '8px' }}>
              Simulated Caller Distress Audio / Transcript
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B' }}>
              Enter vernacular speech text or select a clinical emergency scenario:
            </p>
          </div>

          {/* Scenario Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              {
                label: '🫀 Suspected STEMI / Chest Pressure (Telugu)',
                text: 'నాకు తీవ్రమైన గుండె నొప్పిగా ఉంది, చెమటలు పడుతున్నాయి, శ్వాస ఆడటం లేదు'
              },
              {
                label: '🫁 Pediatric Airway / Stridor (Hindi)',
                text: 'बच्चे की सांस फूल रही है, पसली चल रही है और होंठ नीले पड़ रहे हैं'
              },
              {
                label: '🚗 Highway Trauma / Bleeding (Telugu)',
                text: 'రోడ్డు ప్రమాదం జరిగింది, తీవ్రమైన రక్తస్రావం అవుతోంది, వెంటనే సహాయం కావాలి'
              }
            ].map((scen, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(scen.text);
                  handleTriageAnalyze(scen.text);
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  color: '#0A2540',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                {scen.label}
              </button>
            ))}
          </div>

          {/* Live Microphone Voice Recognition */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
              Vernacular Speech Input:
            </span>
            <button
              onClick={handleToggleVoiceRecording}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                background: isRecording ? '#DC2626' : 'rgba(0, 139, 139, 0.1)',
                color: isRecording ? '#FFFFFF' : '#008B8B',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Mic size={14} style={{ animation: isRecording ? 'pulse 0.6s infinite' : 'none' }} />
              <span>{isRecording ? 'Listening (Speak Now)...' : '🎙️ Speak Live (Mic Active)'}</span>
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              fontSize: '13px',
              fontFamily: 'inherit',
              color: '#0A2540'
            }}
          />

          <button
            onClick={() => handleTriageAnalyze()}
            style={{
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: '#0A2540',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Re-analyze Triage Protocol
          </button>

          {/* CPR Metronome Box */}
          <div style={{ background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540' }}>
                  110 BPM CPR Audio Metronome
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                  AHA / ERC standard compression rhythm (100–120 beats/min)
                </div>
              </div>
              <button
                onClick={handleToggleCprMetronome}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: cprMetronomeActive ? '#DC2626' : '#008B8B',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Heart size={14} style={{ animation: cprMetronomeActive ? 'pulse 0.54s infinite' : 'none' }} />
                <span>{cprMetronomeActive ? 'Stop Beat' : 'Start Beat'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Triage Protocol & First-Aid Guidance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Triage Decision Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: triageResult.triageLevel === 'RED' ? '2px solid #EF4444' : '1px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(10,37,64,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{
                background: triageResult.triageLevel === 'RED' ? '#DC2626' : '#D97706',
                color: '#FFFFFF',
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 850
              }}>
                CATEGORY: {triageResult.triageLevel} ({triageResult.severity})
              </span>
              <span style={{ fontSize: '11.5px', fontFamily: 'monospace', color: '#64748B' }}>
                ICD-10: {triageResult.icd10}
              </span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 850, color: '#0A2540', marginBottom: '8px' }}>
              {triageResult.suspectedCondition}
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '18px' }}>
              <strong>Standard Protocol:</strong> {triageResult.priorityProtocol}
            </p>

            {/* First-Aid Instructions */}
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', marginBottom: '18px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0A2540', textTransform: 'uppercase', marginBottom: '8px' }}>
                Immediate First-Aid Protocols:
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', color: '#334155', lineHeight: 1.6 }}>
                {triageResult.firstAidInstructions.map((ins, idx) => (
                  <li key={idx}>{ins}</li>
                ))}
              </ul>
            </div>

            {/* Vernacular First-Aid Callout */}
            {triageResult.firstAidVernacular && (
              <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: '10px', padding: '12px 14px', fontSize: '12.5px', color: '#115E59', marginBottom: '14px' }}>
                <strong>తెలుగు సూచన:</strong> {triageResult.firstAidVernacular.te}
              </div>
            )}

            {/* Evon 30B Live Status Verification & Sovereign Reasoning */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <EvonStatusChip showDetails={true} />

              {/* Asynchronous Evon Advisory CoT or Honest Fallback */}
              {isLoadingEvon && (
                <div style={{ padding: '10px 14px', background: '#F1F5F9', borderRadius: '8px', fontSize: '11px', color: '#475569' }}>
                  ⏳ Querying server-side Evon reasoning route (/api/evon/chat)...
                </div>
              )}

              {evonAdvisory && evonAdvisory.isEvonLive && (
                <div style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  borderRadius: '12px',
                  border: '1px solid #10B981',
                  padding: '16px',
                  color: '#F8FAFC'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} />
                      <span>LIVE GNANI EVON 30B ADVISORY REASONING</span>
                    </div>
                    <button
                      onClick={() => setShowEvonTrace(!showEvonTrace)}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        color: '#E2E8F0',
                        padding: '4px 8px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>{showEvonTrace ? 'Hide CoT' : 'View CoT'}</span>
                      {showEvonTrace ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  </div>
                  {showEvonTrace && evonAdvisory.thoughtTrace && (
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      color: '#CBD5E1',
                      lineHeight: '1.55',
                      whiteSpace: 'pre-line'
                    }}>
                      <div style={{ color: '#38BDF8', fontWeight: 700, marginBottom: '4px', fontSize: '10px' }}>
                        LIVE EVON CHAIN-OF-THOUGHT (&lt;reasoning&gt;):
                      </div>
                      {evonAdvisory.thoughtTrace}
                    </div>
                  )}
                  {evonAdvisory.finalAnswer && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#E2E8F0', lineHeight: 1.5 }}>
                      {evonAdvisory.finalAnswer}
                    </div>
                  )}
                </div>
              )}

              {evonAdvisory && evonAdvisory.isFallback && (
                <div style={{
                  background: '#FFFBEB',
                  border: '1px solid #FCD34D',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '11.5px',
                  color: '#92400E'
                }}>
                  <div style={{ fontWeight: 800, marginBottom: '2px', color: '#B45309' }}>
                    🛡️ [Rule-based FALLBACK (Not Evon)]
                  </div>
                  <div>
                    Evon server route unavailable ({evonAdvisory.error || 'EVON_BASE_URL / EVON_API_KEY unset'}). 
                    Immediate life-safety triage remains active via deterministic clinical rules with 0ms delay.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Multi-Stage Animated Flowchart with [SIMULATION] badge */}
          <SanjivaniAnimatedFlowchart />

          {/* Dispatch Pipeline Simulator */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2540' }}>
                Simulated 108 Telemetry & Dispatch Pipeline
              </h3>
              <button
                onClick={handleStartDispatchSimulation}
                disabled={isSimulatingDispatch}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#008B8B',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: isSimulatingDispatch ? 'not-allowed' : 'pointer'
                }}
              >
                {isSimulatingDispatch ? 'Simulating...' : 'Run Simulation'}
              </button>
            </div>

            {dispatchSteps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#94A3B8', fontSize: '13px' }}>
                Click "Run Simulation" to visualize autonomous telemetry resolution steps.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dispatchSteps.map((step, idx) => (
                  <div key={idx} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px', fontSize: '12px' }}>
                    <div style={{ fontWeight: 800, color: '#0A2540', marginBottom: '2px' }}>{step.name}</div>
                    <div style={{ color: '#64748B' }}>{step.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🏥 Real-Time Geographically-Verified Nearby Hospitals & Trauma Bays */}
      <div style={{ marginTop: '36px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '28px', boxShadow: '0 4px 20px rgba(10,37,64,0.04)' }}>
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#008B8B', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
              <Building2 size={15} />
              <span>ABDM Health Facility Registry (HFR) & GIS Health Bridge</span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 850, color: '#0A2540', margin: '0 0 6px 0' }}>
              Verified Nearby Emergency Facilities & Trauma Bays
            </h2>
            <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0 }}>
              Dynamically retrieved and clinical-capability matched to caller location with real-time road ETA & resuscitation bed availability.
            </p>
          </div>

          <button
            onClick={detectLiveLocation}
            disabled={isLocating}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              color: '#0A2540',
              fontSize: '12.5px',
              fontWeight: 750,
              cursor: isLocating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={14} className={isLocating ? 'spin' : ''} />
            <span>{isLocating ? 'Detecting Live GPS...' : 'Refresh My GPS Location'}</span>
          </button>
        </div>

        {/* Location & Search Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 320px' }}>
            <MapPin size={18} color="#DC2626" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '13px', color: '#0A2540', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#64748B', fontWeight: 600 }}>Active Location: </span>
              {detectedLocationName}
              <span style={{ marginLeft: '8px', fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
                ({userCoords.latitude.toFixed(4)}°N, {userCoords.longitude.toFixed(4)}°E)
              </span>
            </div>
          </div>

          {/* Autocomplete / Search input */}
          <div style={{ position: 'relative', flex: '1 1 280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '0 10px' }}>
              <Search size={14} color="#94A3B8" />
              <input
                type="text"
                placeholder="Search town, village, or pincode..."
                value={searchLocationQuery}
                onChange={(e) => handleLocationSearch(e.target.value)}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  padding: '8px 10px',
                  fontSize: '12.5px',
                  color: '#0A2540'
                }}
              />
            </div>

            {/* Dropdown search results */}
            {searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                marginTop: '4px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                zIndex: 40,
                maxHeight: '220px',
                overflowY: 'auto'
              }}>
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSearchResult(item)}
                    style={{
                      padding: '10px 14px',
                      fontSize: '12.5px',
                      color: '#0A2540',
                      cursor: 'pointer',
                      borderBottom: '1px solid #F1F5F9'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
                  >
                    <div style={{ fontWeight: 700 }}>{item.text}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{item.placeName}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {[
            { id: 'ALL', label: 'All Emergency Hubs' },
            { id: 'FASTEST_ETA', label: '⚡ Fastest Road ETA' },
            { id: 'BEST_TRAUMA', label: '🩸 Level-1 & 2 Trauma' },
            { id: 'CATH_LAB', label: '🫀 24x7 Cath Lab (PCI)' },
            { id: 'GOVT_DME', label: '🏛️ Government Apex (DME / APVVP)' },
            { id: 'HIGH_AVAILABILITY', label: '🛏️ High Bed Availability' }
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => handleFilterChange(flt.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: hospitalFilter === flt.id ? '#008B8B' : '#E2E8F0',
                background: hospitalFilter === flt.id ? 'rgba(0, 139, 139, 0.08)' : '#FFFFFF',
                color: hospitalFilter === flt.id ? '#008B8B' : '#64748B',
                fontSize: '12px',
                fontWeight: 750,
                cursor: 'pointer'
              }}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* Hospital Cards List */}
        {isLoadingHospitals ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '13px' }}>
            <Activity size={24} style={{ margin: '0 auto 10px', animation: 'pulse 1s infinite' }} />
            <div>Querying ABDM Health Registry & live road network geometry...</div>
          </div>
        ) : nearbyHospitals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: '#94A3B8', fontSize: '13px' }}>
            No facilities found matching filter. Try selecting "All Emergency Hubs" or searching another location.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {nearbyHospitals.map((hosp, idx) => {
              const isSelected = selectedHospital?.id === hosp.id;
              const isRecommended = recommendedHospital?.id === hosp.id;
              return (
                <div
                  key={hosp.id || idx}
                  style={{
                    background: isSelected ? '#F0FDFA' : '#FFFFFF',
                    border: isSelected ? '2px solid #008B8B' : '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    {/* Top Row: Badges */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {isRecommended && (
                          <span style={{ background: '#008B8B', color: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', fontSize: '10.5px', fontWeight: 800 }}>
                            ★ OPTIMAL CLINICAL MATCH
                          </span>
                        )}
                        <span style={{
                          background: hosp.ownership?.toLowerCase().includes('government') ? '#EFF6FF' : '#F8FAFC',
                          color: hosp.ownership?.toLowerCase().includes('government') ? '#1D4ED8' : '#475569',
                          border: '1px solid #E2E8F0',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '10.5px',
                          fontWeight: 750
                        }}>
                          {hosp.ownership}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '14px', fontWeight: 850, color: '#DC2626' }}>
                          ~{hosp.etaMinutes} min
                        </span>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          {hosp.distanceKm} km drive
                        </div>
                      </div>
                    </div>

                    {/* Facility Name & Address */}
                    <h3 style={{ fontSize: '15px', fontWeight: 850, color: '#0A2540', margin: '0 0 6px 0', lineHeight: 1.35 }}>
                      {hosp.name}
                    </h3>
                    <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                      {hosp.address}
                    </p>

                    {/* Clinical Capabilities Tags */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span style={{ background: '#FEF2F2', color: '#991B1B', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                        {hosp.traumaTier}
                      </span>
                      {hosp.cathLab && (
                        <span style={{ background: '#F0FDF4', color: '#166534', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                          {hosp.cathLab}
                        </span>
                      )}
                    </div>

                    {/* Live Bed & Bay Assignment */}
                    <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '8px 12px', fontSize: '11.5px', color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
                      <span>🛏️ {hosp.bedAvailability || `${hosp.bedsAvailable} Beds`}</span>
                      <span style={{ fontWeight: 750, color: '#008B8B' }}>{hosp.resuscitationBayAssigned}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => setSelectedHospital(hosp)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isSelected ? '#008B8B' : '#0A2540',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {isSelected ? <Check size={14} /> : null}
                      <span>{isSelected ? 'Pre-Alert Destination Selected' : 'Select for Pre-Alert'}</span>
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.lat},${hosp.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        color: '#0A2540',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Open Route Navigation"
                    >
                      <Navigation size={13} color="#008B8B" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
