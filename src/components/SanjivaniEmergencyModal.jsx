import React, { useState, useEffect, useRef } from 'react';
import { 
  Siren, 
  Mic, 
  MicOff, 
  MapPin, 
  Activity, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  Phone,
  PhoneOff,
  X, 
  Heart,
  Radio,
  Building2,
  Navigation,
  Shield,
  ChevronRight,
  AlertTriangle,
  Car,
  Check,
  Info,
  Layers,
  Search,
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Share2,
  FileText,
  Compass,
  Crosshair,
  BadgeCheck,
  Edit3,
  User,
  Sparkles,
  Send
} from 'lucide-react';
import EmergencyMap from './EmergencyMap';
import SanjivaniEmergencyAssistant from './SanjivaniEmergencyAssistant';
import SanjivaniHandoverModal from './SanjivaniHandoverModal';
import { 
  fetchNearbyHospitalsAPI, 
  fetchRoadRouteGeoJSON,
  searchMapboxGeocode
} from '../services/emergencyHospitalBackend';
import { 
  requestRealDeviceLocation, 
  reverseGeocodeGPS, 
  sanjivaniAudio,
  analyzeEmergencyClinicalTriage
} from '../services/sanjivaniEmergencyService';

/**
 * Sanjivani-108 Masterclass Operational GIS Console
 * Multi-Citizen Live Autonomous Acoustic Distress Triage & Emergency Dispatch Engine
 * Compliant with ABDM Health Facility Registry (HFR) & AP Government Health (HMFW AP / APVVP)
 */
export default function SanjivaniEmergencyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Real-Time Auto Live Call State (starts connected at 00:01, auto-incrementing every second)
  const [callStatus, setCallStatus] = useState('connected'); // 'connected' | 'ended'
  const [elapsedSec, setElapsedSec] = useState(1);
  const [lastGpsUpdateSec, setLastGpsUpdateSec] = useState(2);
  const [showCliExplainer, setShowCliExplainer] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [showCallerPicker, setShowCallerPicker] = useState(false);

  // Dedicated Emergency Copilot Floating State
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Auto-Filled Bed Handover Modal State (The WOW feature)
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);

  // Dynamic Caller Identity (Works for ANY citizen, editable by operator or test presets)
  const [callerPhone, setCallerPhone] = useState('+91 98490 22334');
  const [callerName, setCallerName] = useState('Rao G. (Live Citizen)');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [callerCoords, setCallerCoords] = useState({ lat: 17.2789, lng: 82.4012 });
  const [geoAddress, setGeoAddress] = useState('Annavaram Urban, Sankhavaram, Kakinada, Andhra Pradesh');

  // Mapbox Geocoding Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // ABDM HFR Facility Discovery & Dynamic Regional Capability Matching
  const [hospitalsList, setHospitalsList] = useState([]);
  const [recommendedHospital, setRecommendedHospital] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalFilter, setHospitalFilter] = useState('ALL');
  const [inspectedHospital, setInspectedHospital] = useState(null);

  // Road Routing Geometry
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeDistanceKm, setRouteDistanceKm] = useState(0.85);
  const [routeEtaMinutes, setRouteEtaMinutes] = useState(4);
  const [trafficStatus, setTrafficStatus] = useState('Traffic 🟢 Normal Flow');

  // Ambulance Telemetry (A-12)
  const [ambulanceData, setAmbulanceData] = useState({
    id: 'A-12',
    lat: 17.2745,
    lng: 82.3965,
    heading: 52,
    speed: 46,
    status: 'STANDBY',
    driver: 'Rajesh Meena (Senior EMT Specialist)',
    o2Ventilator: 'Active',
    defibrillator: 'Ready',
    cardiacMonitor: '12-Lead ECG Active'
  });

  // Explicit Two-State Dispatch Workflow: 1 (Before Dispatch) | 2 (After Dispatch)
  const [dispatchState, setDispatchState] = useState(1);
  const [hospitalAlertSecondsAgo, setHospitalAlertSecondsAgo] = useState(12);
  const [panToken, setPanToken] = useState(null);

  // Simulation Controls: speedMultiplier 1 | 2 | 5
  const [isSimRunning, setIsSimRunning] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);

  // Live Audio & Acoustic Distress Telemetry
  const [liveTranscript, setLiveTranscript] = useState('నాకు గుండె నొప్పిగా ఉంది... శ్వాస తీసుకోవడం కష్టంగా ఉంది...');
  const [englishTranslation, setEnglishTranslation] = useState('I am having acute chest pain and severe breathlessness...');
  
  // Acoustic Distress Metrics
  const [distressIndex, setDistressIndex] = useState(89);
  const [vocalPitchHz, setVocalPitchHz] = useState(295);
  const [respirationRate, setRespirationRate] = useState(38);
  const [confidenceScore, setConfidenceScore] = useState(94);

  // Incident Decision Trace Ledger
  const [auditLogs, setAuditLogs] = useState([
    { time: '12:04:12', event: `Emergency 108 voice call connected via Telecom SIP (${callerPhone})` },
    { time: '12:04:18', event: `Caller location anchored: ${geoAddress}` },
    { time: '12:04:31', event: 'Acoustic panic biomarkers detected (89% distress, 295 Hz vocal pitch)' },
    { time: '12:04:48', event: 'AI triage completed → CRITICAL (ALS Mobile Response Required, 94% conf)' },
    { time: '12:05:01', event: 'Ambulance A-12 matched (Closest ALS unit, ready with Defibrillator)' }
  ]);

  // In-App Toast
  const [toastNotification, setToastNotification] = useState(null);

  // =========================================================================
  // 1. AUTO RUNNING LIVE TIMER (Starts from 00:01, auto-increments every second)
  // =========================================================================
  useEffect(() => {
    let t = null;
    if (callStatus === 'connected') {
      t = setInterval(() => {
        setElapsedSec((s) => s + 1);
        setLastGpsUpdateSec((s) => (s >= 4 ? 1 : s + 1));
        if (dispatchState >= 2) {
          setHospitalAlertSecondsAgo((s) => s + 1);
        }
      }, 1000);
    }
    return () => {
      if (t) clearInterval(t);
    };
  }, [callStatus, dispatchState]);

  const formatElapsed = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // =========================================================================
  // 2. INITIAL REAL HARDWARE GPS DISCOVERY
  // =========================================================================
  useEffect(() => {
    let isMounted = true;
    async function initGPS() {
      try {
        const coords = await requestRealDeviceLocation();
        if (!isMounted) return;
        setCallerCoords({ lat: coords.latitude, lng: coords.longitude });
        setAmbulanceData((prev) => ({
          ...prev,
          lat: Number((coords.latitude - 0.005).toFixed(5)),
          lng: Number((coords.longitude - 0.004).toFixed(5))
        }));
        const addr = await reverseGeocodeGPS(coords.latitude, coords.longitude);
        if (!isMounted) return;
        if (addr.displayName) {
          setGeoAddress(addr.displayName);
        }
      } catch (e) {
        // Desktop browsers without GNSS use active coordinates smoothly
      }
    }
    initGPS();
    return () => { isMounted = false; };
  }, []);

  // =========================================================================
  // 3. FETCH REAL ABDM HFR HOSPITALS AROUND CURRENT CALLER COORDINATES
  // =========================================================================
  const loadHospitals = async (filter = hospitalFilter) => {
    try {
      const res = await fetchNearbyHospitalsAPI({
        lat: callerCoords.lat,
        lng: callerCoords.lng,
        geoAddress: geoAddress,
        filterOption: filter
      });
      if (res.success && res.hospitals.length > 0) {
        setHospitalsList(res.hospitals);
        setRecommendedHospital(res.recommendedHospital);
        if (!selectedHospital || !res.hospitals.find((h) => h.id === selectedHospital.id)) {
          setSelectedHospital(res.recommendedHospital);
        }
      }
    } catch (err) {
      console.warn('Error loading hospitals:', err);
    }
  };

  useEffect(() => {
    loadHospitals(hospitalFilter);
  }, [callerCoords.lat, callerCoords.lng, geoAddress, hospitalFilter]);

  // Helper: Calculate forward bearing between two coordinates
  const calculateBearing = (startLat, startLng, endLat, endLng) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;
    const φ1 = toRad(startLat);
    const φ2 = toRad(endLat);
    const Δλ = toRad(endLng - startLng);
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    return Math.round((toDeg(Math.atan2(y, x)) + 360) % 360);
  };

  // =========================================================================
  // 4. COMPUTE TRAFFIC-AWARE ROAD ROUTE VIA MAPBOX DIRECTIONS API
  // =========================================================================
  useEffect(() => {
    if (!selectedHospital) return;
    async function updateRoute() {
      const route = await fetchRoadRouteGeoJSON(
        ambulanceData.lng,
        ambulanceData.lat,
        selectedHospital.lng,
        selectedHospital.lat
      );
      setRouteCoordinates(route.coordinates);
      setRouteDistanceKm(route.distanceKm);
      setRouteEtaMinutes(route.durationMinutes);
      if (route.trafficStatus) setTrafficStatus(route.trafficStatus);
    }
    updateRoute();
  }, [selectedHospital?.id]);

  // =========================================================================
  // 5. LIVE MOVING AMBULANCE SIMULATION ALONG ROAD NETWORK
  // =========================================================================
  useEffect(() => {
    if (!isSimRunning || dispatchState < 2 || !routeCoordinates || routeCoordinates.length === 0) return;

    let stepIndex = 0;
    const intervalMs = Math.max(300, 1800 / simSpeed);

    const interval = setInterval(() => {
      if (stepIndex < routeCoordinates.length) {
        const [nextLng, nextLat] = routeCoordinates[stepIndex];
        let newHeading = 52;
        if (stepIndex + 1 < routeCoordinates.length) {
          const [futureLng, futureLat] = routeCoordinates[stepIndex + 1];
          newHeading = calculateBearing(nextLat, nextLng, futureLat, futureLng);
        }
        setAmbulanceData((prev) => ({
          ...prev,
          lat: nextLat,
          lng: nextLng,
          heading: newHeading,
          status: 'EN_ROUTE',
          speed: Math.round(52 + Math.random() * 14)
        }));
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isSimRunning, dispatchState, routeCoordinates, simSpeed]);

  // Mapbox Geocoding Search Input Handler
  const handleSearchInputChange = async (val) => {
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      setIsSearching(true);
      const results = await searchMapboxGeocode(val);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  // Select search result: fly map, update caller pin, reload REAL hospitals
  const handleSelectSearchResult = (result) => {
    setSearchQuery('');
    setSearchResults([]);
    const newCoords = { lat: result.lat, lng: result.lng };
    setCallerCoords(newCoords);
    setGeoAddress(result.placeName);
    setAmbulanceData((prev) => ({
      ...prev,
      lat: Number((result.lat - 0.005).toFixed(5)),
      lng: Number((result.lng - 0.004).toFixed(5)),
      status: 'STANDBY'
    }));

    const nowStr = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setAuditLogs((prev) => [
      { time: nowStr, event: `Caller location updated to: ${result.placeName}` },
      ...prev
    ]);

    setToastNotification({
      title: 'Location Anchored',
      message: `Operational map centered on ${result.text}. Discovering nearby ABDM facilities.`
    });
    setTimeout(() => setToastNotification(null), 4000);
  };

  // Explicit Live GPS Detection trigger
  const handleDetectLiveGPS = async () => {
    setIsDetectingGps(true);
    try {
      const coords = await requestRealDeviceLocation();
      const newCoords = { lat: coords.latitude, lng: coords.longitude };
      setCallerCoords(newCoords);
      setAmbulanceData((prev) => ({
        ...prev,
        lat: Number((coords.latitude - 0.005).toFixed(5)),
        lng: Number((coords.longitude - 0.004).toFixed(5)),
        status: 'STANDBY'
      }));

      const addr = await reverseGeocodeGPS(coords.latitude, coords.longitude);
      const name = addr.displayName || `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
      setGeoAddress(name);

      const nowStr = new Date().toLocaleTimeString('en-IN', { hour12: false });
      setAuditLogs((prev) => [
        { time: nowStr, event: `Hardware GPS locked: ${name} (±6m accuracy)` },
        ...prev
      ]);

      setToastNotification({
        title: 'Live GPS Locked',
        message: `Position verified at ${name}. Nearby facilities updated!`
      });
    } catch (err) {
      setToastNotification({
        title: 'GNSS Notice',
        message: 'Type any street or city in the search bar above to position instantly!'
      });
    } finally {
      setIsDetectingGps(false);
      setTimeout(() => setToastNotification(null), 4500);
    }
  };

  // Dispatch Action Trigger: Automatically Opens the Pre-Arrival Bed Handover Form (The WOW feature)
  const handleOpenDispatchWorkflow = (hospital = selectedHospital) => {
    if (!hospital) return;
    setSelectedHospital(hospital);
    setIsHandoverModalOpen(true);
  };

  // Callback when Handshake Form is confirmed & transmitted
  const handleConfirmHandshake = (generatedToken) => {
    setPanToken(generatedToken);
    setDispatchState(2);
    setHospitalAlertSecondsAgo(2);

    const nowStr = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setAuditLogs((prev) => [
      { time: nowStr, event: `Dispatcher approved dispatch ➔ Ambulance A-12 routed to ${selectedHospital.name}` },
      { time: nowStr, event: `ABDM Pre-Arrival Handshake transmitted: [${generatedToken}]` },
      { time: nowStr, event: `${selectedHospital.name} ER notified ➔ Resuscitation ${selectedHospital.resuscitationBayAssigned || 'Bay #02'} locked` },
      ...prev
    ]);

    setToastNotification({
      title: 'Ambulance Dispatched & Bed Locked',
      message: `En route to ${selectedHospital.shortName}. Pre-arrival token ${generatedToken} verified.`
    });
    setTimeout(() => setToastNotification(null), 5000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 6, 17, 0.96)',
      backdropFilter: 'blur(16px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px'
    }}>
      {/* Toast Notification */}
      {toastNotification && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          zIndex: 200,
          background: '#0F274E',
          border: '1.5px solid #38BDF8',
          borderRadius: '10px',
          padding: '12px 18px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '440px'
        }}>
          <CheckCircle2 color="#38BDF8" size={22} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
              {toastNotification.title}
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px' }}>
              {toastNotification.message}
            </div>
          </div>
        </div>
      )}

      {/* Main Console Container (Clean Edge-to-Edge Fit) */}
      <div style={{
        width: '100%',
        maxWidth: '1520px',
        height: '96vh',
        background: '#050B14',
        borderRadius: '16px',
        border: '1px solid #1E293B',
        boxShadow: '0 25px 70px rgba(0,0,0,0.95)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        color: '#F8FAFC',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>

        {/* ========================================================
            1. TOP OPERATIONAL HEADER (INCIDENT TELEMETRY & CALLER CONTROLS)
            ======================================================== */}
        <header style={{
          height: '52px',
          background: '#07101E',
          borderBottom: '1px solid #16243C',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0
        }}>
          {/* Left: Branding & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
              padding: '4px 12px 4px 6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 16px rgba(220, 38, 38, 0.45)'
            }}>
              <img 
                src="/assets/sanjivani_circular_badge.png" 
                alt="Sanjivani 108 Emblem" 
                style={{ width: '34px', height: '34px', objectFit: 'cover', borderRadius: '50%', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} 
              />
              <span style={{ fontSize: '13px', fontWeight: 900, letterSpacing: '0.5px' }}>
                SANJIVANI-108
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0B172E',
              border: '1px solid #1C2D4A',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '10px'
            }}>
              <span style={{ color: '#38BDF8', fontWeight: 800 }}>INCIDENT #108-AP-8902</span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>AMBULANCE FEED ●</span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#38BDF8', fontWeight: 700 }}>ABDM HFR INTEGRATED</span>
            </div>
          </div>

          {/* Center: Live Auto Running Timer & Dynamic Caller Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Auto Live Timer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: callStatus === 'connected' ? '#0A1C36' : '#261111',
              border: callStatus === 'connected' ? '1px solid #1E3B68' : '1px solid #5C1D1D',
              padding: '4px 9px',
              borderRadius: '8px'
            }}>
              <Clock size={13} color={callStatus === 'connected' ? '#38BDF8' : '#FCA5A5'} />
              <div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  color: callStatus === 'connected' ? '#FFFFFF' : '#FCA5A5',
                  fontFamily: 'monospace'
                }}>
                  {formatElapsed(elapsedSec)}
                </div>
                <div style={{ fontSize: '8px', color: '#94A3B8', textTransform: 'uppercase' }}>
                  {callStatus === 'connected' ? 'Golden Time' : 'Call Ended'}
                </div>
              </div>
            </div>

            {/* Dynamic Editable Caller Phone & Identity */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#0D1A30',
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid #1E2D48',
                position: 'relative'
              }}
            >
              <PhoneCall size={13} color="#38BDF8" />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isEditingPhone ? (
                    <input
                      type="text"
                      value={callerPhone}
                      onChange={(e) => setCallerPhone(e.target.value)}
                      onBlur={() => setIsEditingPhone(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingPhone(false)}
                      autoFocus
                      style={{
                        background: '#071224',
                        color: '#FFFFFF',
                        border: '1px solid #38BDF8',
                        borderRadius: '4px',
                        padding: '1px 5px',
                        fontSize: '11px',
                        fontWeight: 800,
                        width: '120px',
                        outline: 'none'
                      }}
                    />
                  ) : (
                    <span 
                      onClick={() => setIsEditingPhone(true)}
                      title="Click to edit caller phone number"
                      style={{ fontSize: '11.5px', fontWeight: 800, color: '#F1F5F9', cursor: 'pointer' }}
                    >
                      {callerPhone}
                    </span>
                  )}

                  <button
                    onClick={() => setIsEditingPhone(!isEditingPhone)}
                    title="Edit Phone"
                    style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
                  >
                    <Edit3 size={10} />
                  </button>

                  <span style={{
                    fontSize: '8.5px',
                    background: callStatus === 'connected' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: callStatus === 'connected' ? '#34D399' : '#FCA5A5',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontWeight: 800
                  }}>
                    {callStatus === 'connected' ? 'LIVE' : 'ENDED'}
                  </span>
                </div>

                <div 
                  onClick={() => setShowCallerPicker(!showCallerPicker)}
                  style={{ fontSize: '8px', color: '#38BDF8', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                >
                  <span>{callerName}</span>
                  <span>▼</span>
                </div>
              </div>

              {/* Caller Preset Dropdown */}
              {showCallerPicker && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  background: '#0B172E',
                  border: '1.5px solid #38BDF8',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.8)',
                  zIndex: 100,
                  width: '260px',
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '6px 10px', fontSize: '9px', fontWeight: 800, color: '#94A3B8', background: '#07101E', borderBottom: '1px solid #16243C' }}>
                    SWITCH CALLER CITIZEN PROFILE
                  </div>
                  {[
                    { name: 'Rao G. (Live Citizen - Kakinada)', phone: '+91 98490 22334' },
                    { name: 'Kumar V. (Highway NH-16)', phone: '+91 99887 65432' },
                    { name: 'Anita S. (Rural Community)', phone: '+91 88976 11204' },
                    { name: 'Direct Device GPS Caller', phone: '+91 94401 55678' }
                  ].map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setCallerName(c.name);
                        setCallerPhone(c.phone);
                        setShowCallerPicker(false);
                      }}
                      style={{
                        padding: '8px 10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #13223A',
                        fontSize: '10.5px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#0E2244'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontWeight: 800, color: '#FFF' }}>{c.name}</div>
                      <div style={{ fontSize: '9px', color: '#38BDF8' }}>{c.phone}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Toggle Dedicated 108 Emergency Copilot, Audit Trail & Exit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsCopilotOpen(!isCopilotOpen)}
              style={{
                background: isCopilotOpen ? '#DC2626' : '#7F1D1D',
                border: '1px solid #EF4444',
                color: '#FFF',
                padding: '5px 11px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 800,
                boxShadow: '0 0 14px rgba(220, 38, 38, 0.4)'
              }}
            >
              <Siren size={13} className="animate-pulse" />
              <span>{isCopilotOpen ? 'Close Copilot' : '🚨 108 AI Copilot'}</span>
            </button>

            <button
              onClick={() => setShowAuditTrail(!showAuditTrail)}
              style={{
                background: showAuditTrail ? '#0284C7' : '#0B172E',
                border: '1px solid #1A2F50',
                color: '#FFF',
                padding: '5px 9px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '10.5px',
                fontWeight: 700
              }}
            >
              <FileText size={13} />
              <span>Audit Log ({auditLogs.length})</span>
            </button>

            <button
              onClick={onClose}
              title="Exit Console"
              style={{
                background: '#0E1B33',
                border: '1px solid #1E293B',
                color: '#94A3B8',
                padding: '5px 9px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10.5px',
                fontWeight: 700
              }}
            >
              <span>Exit</span>
              <X size={13} />
            </button>
          </div>
        </header>

        {/* ========================================================
            GEOGRAPHIC ANCHOR & SEARCH BAR (WORKS FOR ANY LOCATION ACROSS INDIA)
            ======================================================== */}
        <div style={{
          background: '#081427',
          borderBottom: '1px solid #162640',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexShrink: 0
        }}>
          {/* Search Input with Autocomplete */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, position: 'relative' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#0C1C36',
              border: '1px solid #1E3760',
              borderRadius: '8px',
              padding: '5px 10px',
              flex: 1
            }}>
              <Search size={14} color="#38BDF8" style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                placeholder="Type your exact street, landmark or city (e.g. Kakinada, Annavaram, Hyderabad, Vizag, Vijayawada, Delhi...)"
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  width: '100%'
                }}
              />
              {isSearching && (
                <span style={{ fontSize: '9px', color: '#94A3B8' }}>Searching...</span>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#0B172E',
                border: '1.5px solid #0284C7',
                borderRadius: '8px',
                marginTop: '4px',
                zIndex: 90,
                boxShadow: '0 12px 30px rgba(0,0,0,0.9)',
                overflow: 'hidden'
              }}>
                {searchResults.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => handleSelectSearchResult(res)}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #16243C',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#0F2548'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <MapPin size={13} color="#38BDF8" />
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#FFF' }}>{res.text}</div>
                      <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>{res.placeName}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detect Live GPS Button */}
          <button
            onClick={handleDetectLiveGPS}
            disabled={isDetectingGps}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isDetectingGps ? '#0B1E3B' : 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              border: '1px solid #38BDF8',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Crosshair size={13} className={isDetectingGps ? 'animate-spin' : ''} />
            <span>{isDetectingGps ? 'Acquiring GPS...' : '📍 Detect My Live GPS'}</span>
          </button>

          {/* Active Anchor Feedback */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '10px',
            color: '#94A3B8',
            maxWidth: '420px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            <MapPin size={12} color="#10B981" style={{ flexShrink: 0 }} />
            <span>
              Anchor: <strong style={{ color: '#F1F5F9' }}>{geoAddress}</strong>
            </span>
          </div>
        </div>

        {/* ========================================================
            2. MAIN OPERATIONAL WORKSPACE (FULL HEIGHT MAP + DECISION PANEL)
            ======================================================== */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1.9fr 1.1fr',
          minHeight: 0,
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* --------------------------------------------------------
              LEFT: DOMINANT MAPBOX HIGH-CONTRAST EMS NAVIGATION MAP (63%)
              -------------------------------------------------------- */}
          <div style={{ position: 'relative', width: '100%', height: '100%', borderRight: '1px solid #16243C' }}>
            <EmergencyMap
              callerCoords={callerCoords}
              hospitals={hospitalsList}
              selectedHospital={selectedHospital}
              onSelectHospital={(hosp) => setSelectedHospital(hosp)}
              ambulanceData={ambulanceData}
              routeCoordinates={routeCoordinates}
              isDispatched={dispatchState >= 2}
            />

            {/* Simulation Speed Strip (Bottom-Right of Map) */}
            <div style={{
              position: 'absolute',
              bottom: '14px',
              right: '12px',
              zIndex: 20,
              background: 'rgba(6, 13, 26, 0.92)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #1E2D48',
              borderRadius: '8px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '10px'
            }}>
              <span style={{ color: '#94A3B8', fontWeight: 700 }}>Sim Controls:</span>
              <button
                onClick={() => setIsSimRunning(!isSimRunning)}
                style={{ background: isSimRunning ? '#DC2626' : '#059669', border: 'none', color: '#FFF', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer', fontWeight: 800 }}
              >
                {isSimRunning ? 'Pause' : 'Start'}
              </button>
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSimSpeed(s)}
                  style={{
                    background: simSpeed === s ? '#0284C7' : '#0F1E38',
                    border: '1px solid #1E3358',
                    color: '#FFF',
                    borderRadius: '4px',
                    padding: '2px 5px',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>

          {/* --------------------------------------------------------
              RIGHT: DECISION, DISPATCH & ABDM HFR PANEL (37%)
              -------------------------------------------------------- */}
          <div style={{
            background: '#060D1A',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '14px',
            gap: '12px',
            minHeight: 0
          }}>
            {/* CARD 1: ACTION WORKFLOW (TWO-STATE: BEFORE / AFTER DISPATCH) */}
            <div style={{
              background: '#09152C',
              borderRadius: '12px',
              border: '1px solid #1E2F50',
              padding: '14px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: dispatchState >= 2 ? '#10B981' : '#EF4444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {dispatchState >= 2 ? '🚑 DISPATCH ACTIVE — EN ROUTE' : '⚡ ACTION REQUIRED — DISPATCH APPROVAL'}
                </span>
                <span style={{ fontSize: '9.5px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                  ALS-12 Ready
                </span>
              </div>

              {/* State 1: Before Dispatch */}
              {dispatchState === 1 && selectedHospital && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9px', background: '#0F2547', border: '1px solid #1E3E6E', color: '#38BDF8', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700 }}>
                      HFR: {selectedHospital.hfrId}
                    </span>
                    <span style={{ fontSize: '9px', background: selectedHospital.ownership?.toLowerCase().includes('government') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.15)', color: selectedHospital.ownership?.toLowerCase().includes('government') ? '#34D399' : '#38BDF8', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {selectedHospital.ownership}
                    </span>
                  </div>

                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25, marginTop: '4px' }}>
                    {selectedHospital.name}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>
                    {selectedHospital.address}
                  </div>

                  {/* Route & Bed Numbers */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    margin: '10px 0',
                    background: '#0D1E3A',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #1C3860'
                  }}>
                    <div>
                      <div style={{ fontSize: '17px', fontWeight: 900, color: '#38BDF8' }}>
                        {selectedHospital.etaMinutes} min
                      </div>
                      <div style={{ fontSize: '8.5px', color: '#64748B' }}>ETA by Road</div>
                    </div>
                    <div style={{ width: '1px', height: '22px', background: '#1E3658' }} />
                    <div>
                      <div style={{ fontSize: '17px', fontWeight: 900, color: '#FFFFFF' }}>
                        {selectedHospital.distanceKm} km
                      </div>
                      <div style={{ fontSize: '8.5px', color: '#64748B' }}>Distance</div>
                    </div>
                    <div style={{ width: '1px', height: '22px', background: '#1E3658' }} />
                    <div>
                      <div style={{ fontSize: '17px', fontWeight: 900, color: '#10B981' }}>
                        {selectedHospital.bedsAvailable}
                      </div>
                      <div style={{ fontSize: '8.5px', color: '#64748B' }}>Beds Ready</div>
                    </div>
                  </div>

                  {/* Why A-12 & Why this Real Hospital */}
                  <div style={{ background: '#071224', padding: '8px 10px', borderRadius: '8px', fontSize: '10px', color: '#CBD5E1', marginBottom: '10px', lineHeight: 1.4 }}>
                    <div><strong>Why Ambulance A-12?</strong> Closest ALS unit ({selectedHospital.distanceKm} km) • Defibrillator, Ventilator, 12-Lead ECG ready.</div>
                    <div style={{ marginTop: '3px' }}><strong>Why {selectedHospital.shortName}?</strong> {selectedHospital.matchReason}</div>
                  </div>

                  {/* Prominent Dispatch Button (Auto-opens Pre-arrival Bed Handover Form) */}
                  <button
                    onClick={() => handleOpenDispatchWorkflow(selectedHospital)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '13px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(239, 68, 68, 0.45)'
                    }}
                  >
                    <Siren size={16} />
                    <span>Dispatch A-12 & Book Bed ➔ {selectedHospital.shortName}</span>
                  </button>
                </div>
              )}

              {/* State 2: After Dispatch */}
              {dispatchState >= 2 && selectedHospital && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: '#38BDF8' }}>
                        Ambulance A-12 En Route
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                        Speed: {ambulanceData.speed} km/h • ETA: {routeEtaMinutes} min remaining
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setDispatchState(1)}
                        style={{ background: '#0E1E38', border: '1px solid #1E3456', color: '#38BDF8', borderRadius: '6px', padding: '4px 8px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Change
                      </button>
                      <button
                        onClick={() => {
                          setDispatchState(1);
                          setToastNotification({ title: 'Dispatch Cancelled', message: 'Ambulance A-12 returned to standby.' });
                        }}
                        style={{ background: '#3F1212', border: '1px solid #7F1D1D', color: '#FCA5A5', borderRadius: '6px', padding: '4px 8px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* ABDM Pre-Arrival Notification Status */}
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: '#071628',
                    border: '1px solid #0F2D54',
                    fontSize: '10.5px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ color: '#38BDF8', fontWeight: 800 }}>
                        🏥 ABDM Pre-Arrival Handshake (PAN):
                      </span>
                      <span style={{ fontSize: '8.5px', background: '#0F2547', color: '#38BDF8', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>
                        {panToken || 'ABDM-PAN-AP-2026-99482'}
                      </span>
                    </div>
                    <div style={{ color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🟢 NOTIFIED</span>
                      <span>🟢 ACCEPTING</span>
                      <span>🟢 {selectedHospital.resuscitationBayAssigned || 'BAY #02 RESERVED'}</span>
                    </div>
                    <div style={{ fontSize: '9px', color: '#64748B', marginTop: '3px' }}>
                      Confirmed {hospitalAlertSecondsAgo}s ago with CMO {selectedHospital.cmo}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CARD 2: ABDM HFR HOSPITAL INTELLIGENCE & CAPABILITY MATCHING */}
            <div style={{
              background: '#09152C',
              borderRadius: '12px',
              border: '1px solid #1E2F50',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} color="#38BDF8" />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>ABDM Hospital Intelligence</span>
                </div>
                <span style={{ fontSize: '9px', color: '#F59E0B', fontWeight: 700 }}>
                  Advisory Only • Operator Approves
                </span>
              </div>

              {/* Top Recommended Real Local Hospital Spotlight */}
              {recommendedHospital && (
                <div 
                  onClick={() => setSelectedHospital(recommendedHospital)}
                  style={{
                    background: selectedHospital?.id === recommendedHospital.id ? 'rgba(56, 189, 248, 0.12)' : '#0C1A34',
                    border: selectedHospital?.id === recommendedHospital.id ? '1.5px solid #38BDF8' : '1px solid #1D355C',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '9.5px', fontWeight: 800, background: '#DC2626', color: '#FFF', padding: '1px 6px', borderRadius: '4px' }}>
                        ★ TOP RECOMMENDATION
                      </span>
                      <span style={{ fontSize: '8.5px', background: '#0F2547', color: '#38BDF8', padding: '1px 5px', borderRadius: '4px', fontFamily: 'monospace' }}>
                        {recommendedHospital.hfrId}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: '#38BDF8' }}>
                      {recommendedHospital.etaMinutes} min ETA • {recommendedHospital.distanceKm} km
                    </span>
                  </div>

                  <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#FFFFFF' }}>
                    {recommendedHospital.name}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9.5px', color: '#94A3B8', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>✓ {recommendedHospital.traumaTier}</span>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>✓ {recommendedHospital.icuBeds} ICU Beds</span>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>✓ {recommendedHospital.cathLab}</span>
                    <span style={{ color: '#38BDF8', fontWeight: 700 }}>✓ {recommendedHospital.resuscitationBayAssigned}</span>
                  </div>

                  <div style={{ marginTop: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#CBD5E1', marginBottom: '2px' }}>
                      <span>Bed Capacity</span>
                      <span style={{ color: '#10B981', fontWeight: 700 }}>{recommendedHospital.bedsAvailable} Available ({recommendedHospital.icuBeds} ICU)</span>
                    </div>
                    <div style={{ height: '4px', background: '#132442', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: '70%', height: '100%', background: '#10B981', borderRadius: '2px' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Pills */}
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Accredited Facilities Near Anchor ({hospitalsList.length} Found)
                </div>
                <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '3px' }}>
                  {[
                    { id: 'ALL', label: `All (${hospitalsList.length})` },
                    { id: 'FASTEST_ETA', label: 'Fastest ETA' },
                    { id: 'BEST_TRAUMA', label: 'Best Trauma' },
                    { id: 'GOVT_DME', label: 'Govt (DME/APVVP)' },
                    { id: 'CATH_LAB', label: '24x7 Cath Lab' },
                    { id: 'NEAREST', label: 'Nearest' },
                    { id: 'HIGH_AVAILABILITY', label: 'High Capacity' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setHospitalFilter(f.id)}
                      style={{
                        padding: '3px 7px',
                        borderRadius: '6px',
                        border: hospitalFilter === f.id ? '1px solid #38BDF8' : '1px solid #1E2F4C',
                        background: hospitalFilter === f.id ? '#0284C7' : '#0B172E',
                        color: hospitalFilter === f.id ? '#FFF' : '#94A3B8',
                        fontSize: '9px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complete List of Real Nearby ABDM HFR Hospitals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '220px', overflowY: 'auto' }}>
                {hospitalsList.map((hosp, idx) => {
                  const isSel = selectedHospital?.id === hosp.id;
                  const isGovt = hosp.ownership?.toLowerCase().includes('government');
                  return (
                    <div
                      key={hosp.id}
                      onClick={() => setSelectedHospital(hosp)}
                      style={{
                        background: isSel ? 'rgba(56, 189, 248, 0.12)' : '#0A162C',
                        border: isSel ? '1px solid #38BDF8' : '1px solid #16243C',
                        borderRadius: '7px',
                        padding: '6px 9px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                        <span style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 800 }}>{idx + 1}.</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#F1F5F9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {hosp.name}
                            </div>
                            {isGovt && (
                              <span style={{ fontSize: '8px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '0 4px', borderRadius: '3px', fontWeight: 700 }}>
                                GOVT
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '8.5px', color: '#94A3B8' }}>
                            {hosp.distanceKm} km • {hosp.hfrId} • {hosp.bedsAvailable} Beds
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div>
                          <div style={{ fontSize: '11.5px', fontWeight: 800, color: isSel ? '#38BDF8' : '#FFFFFF' }}>
                            {hosp.etaMinutes} min
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedHospital(hosp);
                          }}
                          style={{
                            background: '#0D1C34',
                            border: '1px solid #1C3358',
                            color: '#38BDF8',
                            fontSize: '9px',
                            cursor: 'pointer',
                            padding: '2px 5px',
                            borderRadius: '4px',
                            fontWeight: 700
                          }}
                        >
                          Details ⓘ
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. SLEEK OPERATIONAL TELEMETRY & STATUS STRIP (CLEAN FIT)
            ======================================================== */}
        <div style={{
          height: '42px',
          background: '#040813',
          borderTop: '1px solid #14223A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          fontSize: '10.5px',
          color: '#94A3B8',
          flexShrink: 0
        }}>
          {/* Ambulance Telemetry */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Car size={13} color="#38BDF8" />
            <span>
              <strong>Ambulance A-12:</strong> {ambulanceData.driver}
            </span>
            <span style={{ color: '#475569' }}>|</span>
            <span style={{ color: '#10B981', fontWeight: 700 }}>
              Mobile: +91 94401 22108
            </span>
            <span style={{ color: '#475569' }}>|</span>
            <span>Speed: <strong>{ambulanceData.speed} km/h</strong></span>
            <span style={{ color: '#475569' }}>|</span>
            <span>Status: <strong style={{ color: ambulanceData.status === 'EN_ROUTE' ? '#DC2626' : '#10B981' }}>{ambulanceData.status}</strong></span>
          </div>

          {/* Destination & Handshake */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Target: <strong style={{ color: '#FFFFFF' }}>{selectedHospital?.name || 'Local Hospital'}</strong></span>
            <span style={{ color: '#475569' }}>|</span>
            <span>Bay: <strong style={{ color: '#38BDF8' }}>{selectedHospital?.resuscitationBayAssigned || 'Bay #02'}</strong></span>
            <span style={{ color: '#475569' }}>|</span>
            <span style={{ background: '#0F2547', color: '#38BDF8', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700 }}>
              {panToken || 'PAN-READY'}
            </span>
          </div>
        </div>

        {/* ========================================================
            4. DEDICATED SANJIVANI-108 EMERGENCY AI COPILOT
            (Serious Red Theme • Live Voice • Driver Mobile • Auto Guidance)
            ======================================================== */}
        <SanjivaniEmergencyAssistant
          isOpen={isCopilotOpen}
          onToggle={() => setIsCopilotOpen(!isCopilotOpen)}
          callerPhone={callerPhone}
          geoAddress={geoAddress}
          selectedHospital={selectedHospital}
          ambulanceData={ambulanceData}
          liveTranscript={liveTranscript}
          englishTranslation={englishTranslation}
          onUpdateTranscript={(t, tr) => {
            setLiveTranscript(t);
            setEnglishTranslation(tr);
          }}
          onOpenHandoverModal={() => setIsHandoverModalOpen(true)}
          distressIndex={distressIndex}
          vocalPitchHz={vocalPitchHz}
          respirationRate={respirationRate}
          isSimRunning={isSimRunning}
          onToggleSim={() => setIsSimRunning(!isSimRunning)}
          simSpeed={simSpeed}
          onChangeSimSpeed={(s) => setSimSpeed(s)}
          dispatchState={dispatchState}
        />

        {/* ========================================================
            5. AUTO-FILLED ABDM PRE-ARRIVAL BED HANDOVER MODAL (ePCR)
            ======================================================== */}
        <SanjivaniHandoverModal
          isOpen={isHandoverModalOpen}
          onClose={() => setIsHandoverModalOpen(false)}
          hospital={selectedHospital}
          callerPhone={callerPhone}
          geoAddress={geoAddress}
          liveTranscript={liveTranscript}
          englishTranslation={englishTranslation}
          distressIndex={distressIndex}
          vocalPitchHz={vocalPitchHz}
          respirationRate={respirationRate}
          ambulanceData={ambulanceData}
          onConfirmHandshake={handleConfirmHandshake}
        />

        {/* ========================================================
            INCIDENT AUDIT TRAIL / DECISION TRACE DRAWER
            ======================================================== */}
        {showAuditTrail && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}>
            <div style={{
              background: '#09152B',
              border: '1px solid #1E3456',
              borderRadius: '14px',
              padding: '20px',
              maxWidth: '620px',
              width: '100%',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.9)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #16243C', paddingBottom: '8px' }}>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#FFF' }}>
                  Incident Decision Trace & Audit Trail (#108-AP-8902)
                </div>
                <button onClick={() => setShowAuditTrail(false)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '16px' }}>✕</button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {auditLogs.map((log, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '11px', background: '#0B172E', padding: '8px 12px', borderRadius: '6px' }}>
                    <span style={{ color: '#38BDF8', fontFamily: 'monospace', fontWeight: 800 }}>{log.time}</span>
                    <span style={{ color: '#E2E8F0' }}>{log.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            ABDM HFR FACILITY INSPECTION MODAL (TWO-TIER ARCHITECTURE)
            ======================================================== */}
        {inspectedHospital && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#09152B',
              border: '1.5px solid #1E3E6E',
              borderRadius: '16px',
              padding: '22px',
              maxWidth: '580px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.95)'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '9px', background: '#0284C7', color: '#FFF', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, fontFamily: 'monospace' }}>
                      ABDM HFR: {inspectedHospital.hfrId}
                    </span>
                    <span style={{ fontSize: '9px', background: inspectedHospital.ownership?.toLowerCase().includes('government') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)', color: inspectedHospital.ownership?.toLowerCase().includes('government') ? '#34D399' : '#38BDF8', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {inspectedHospital.ownership}
                    </span>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFF', marginTop: '4px' }}>
                    {inspectedHospital.officialName || inspectedHospital.name}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>
                    {inspectedHospital.address}
                  </div>
                </div>
                <button onClick={() => setInspectedHospital(null)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '16px' }}>✕</button>
              </div>

              {/* Transit & Bed Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', margin: '12px 0', background: '#0B172E', padding: '10px', borderRadius: '8px', border: '1px solid #162947' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>Distance</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#38BDF8' }}>{inspectedHospital.distanceKm} km</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>ETA by Road</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF' }}>{inspectedHospital.etaMinutes} min</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>Beds Available</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#10B981' }}>{inspectedHospital.bedsAvailable}</div>
                </div>
              </div>

              {/* Tier 1: Accredited Capabilities */}
              <div style={{ background: '#061020', border: '1px solid #142845', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Tier 1: Accredited Facility Capabilities (ABDM Immutable Registry)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '10px', color: '#CBD5E1' }}>
                  <div>• <strong>Trauma:</strong> {inspectedHospital.traumaTier}</div>
                  <div>• <strong>Cath Lab:</strong> {inspectedHospital.cathLab}</div>
                  <div>• <strong>ICU Beds:</strong> {inspectedHospital.icuBeds} Units Available</div>
                  <div>• <strong>Ventilators:</strong> {inspectedHospital.ventilators || 3} Active</div>
                  <div>• <strong>Blood Bank:</strong> 24x7 Licensed Hub</div>
                  <div>• <strong>108 Bay:</strong> Dedicated Direct Drive-In</div>
                </div>
              </div>

              {/* Tier 2: Dynamic Live Telemetry */}
              <div style={{ background: '#061020', border: '1px solid #142845', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Tier 2: Live Operational Status (ABDM Interoperability Bridge)
                </div>
                <div style={{ fontSize: '10px', color: '#CBD5E1', lineHeight: 1.5 }}>
                  <div>• <strong>Diversion Status:</strong> <span style={{ color: '#10B981', fontWeight: 700 }}>🟢 OPEN (Accepting Emergencies)</span></div>
                  <div>• <strong>Assigned Resuscitation Bay:</strong> <span style={{ color: '#38BDF8', fontWeight: 700 }}>{inspectedHospital.resuscitationBayAssigned}</span></div>
                  <div>• <strong>CMO On Duty:</strong> {inspectedHospital.cmo}</div>
                  <div>• <strong>Clinical Match Rationale:</strong> {inspectedHospital.matchReason}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedHospital(inspectedHospital);
                  setInspectedHospital(null);
                  handleOpenDispatchWorkflow(inspectedHospital);
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Siren size={15} />
                <span>Select Route & Open Handover Form Here</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
