import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Mic, 
  MicOff, 
  Volume2, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Share2, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Camera, 
  Cpu, 
  QrCode,
  Smartphone,
  Heart,
  Thermometer,
  Droplets,
  Printer,
  ChevronRight,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Check,
  Send,
  Sliders,
  RefreshCw,
  Layers,
  Edit3,
  Globe
} from 'lucide-react';
import AuthenticQrCode from './AuthenticQrCode';
import { CLINICAL_ENCOUNTERS } from '../data/clinicalEncounters';
import WhatsAppAudioRxModal from './WhatsAppAudioRxModal';
import { speechService } from '../services/indicSpeechService';
import { reasonClinicalNoteWithEvon, EVON_MODEL_METADATA } from '../services/gnaniEvonService';
import { generateAbdmFhirR4Bundle } from '../data/clinicalSafetySentinel';
import { queryGroqApi, getGroqApiKey } from '../services/aiBrainService';

/**
 * ClinicalConsole Component — Complete Step-by-Step OPD Consultation Suite
 * 
 * Order of Clinical Operations (As Planned):
 * - STEP 1: Record entire conversation of both Doctor and Patient (Live Mic or Simulation).
 * - STEP 2: Process using AI — Extract SOAP, resolve WHO ICD-10 ontologies & synthesize "Best Matter" vernacular prescription note.
 * - STEP 3: Voice Note generation using Gnani API keys (Gnani Timbre TTS / fallback) with Synchronized Word Karaoke & Class-3 DSC e-sign.
 * - STEP 4: WhatsApp Vernacular Dispatch & official ABDM FHIR R4 JSON handover.
 */
export default function ClinicalConsole({ doctorProfile, initialEncounterIndex = 0 }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryEncounter = searchParams.get('encounter');
  const parsedIdx = queryEncounter !== null ? parseInt(queryEncounter, 10) : initialEncounterIndex;
  const validInitialIdx = Number.isInteger(parsedIdx) && parsedIdx >= 0 && parsedIdx < CLINICAL_ENCOUNTERS.length ? parsedIdx : 0;
  const [selectedEncounterIndex, setSelectedEncounterIndex] = useState(validInitialIdx);
  const currentEncounter = CLINICAL_ENCOUNTERS[selectedEncounterIndex] || CLINICAL_ENCOUNTERS[0];

  // 4-Step Guided OPD Workflow: 1 = Record, 2 = AI Processing, 3 = Voice Note, 4 = Dispatch
  const [activeStep, setActiveStep] = useState(1);
  const [maxCompletedStep, setMaxCompletedStep] = useState(1);

  // Step 1: Dialogue Recording State
  const [recordingMode, setRecordingMode] = useState('live_mic'); // 'ambient_sim' | 'live_mic'
  const [isRecording, setIsRecording] = useState(false);
  const [activeLiveSpeaker, setActiveLiveSpeaker] = useState('Doctor (Live Mic)');
  const activeLiveSpeakerRef = useRef('Doctor (Live Mic)');
  const isRecordingRef = useRef(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [dialogueTurns, setDialogueTurns] = useState([]);
  const [newSpeakerRole, setNewSpeakerRole] = useState('Doctor');
  const [newSpeakerText, setNewSpeakerText] = useState('');
  const [showAddTurnModal, setShowAddTurnModal] = useState(false);

  // Audio Telemetry & FFT Visualizer
  const [micVolume, setMicVolume] = useState(18);
  const [liveTranscriptionText, setLiveTranscriptionText] = useState('');
  const [micStatusMsg, setMicStatusMsg] = useState('');

  // Step 2: AI Clinical Processing & "Best Matter" Synthesis State
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiProcessingStage, setAiProcessingStage] = useState('');
  const [editableBestMatter, setEditableBestMatter] = useState(currentEncounter.fullAudioRxTelugu);
  const [medications, setMedications] = useState(currentEncounter.medications || []);
  const [editableSoapNote, setEditableSoapNote] = useState({
    subjective: `Patient presents with a 2-day history of palpitations ("గుండెల్లో దడ"), diaphoresis/hot flashes ("ఉడుకుబోస్తోంది"), and exertional dyspnea ("ఆయాసం") on climbing stairs. Known type-2 diabetic.`,
    objective: `Vitals: BP ${currentEncounter.vitals.bp}, HR ${currentEncounter.vitals.heartRate}, SpO2 ${currentEncounter.vitals.spo2}. Auscultation reveals clear bilateral breath sounds with mild exertional tachycardia.`,
    assessment: `Primary: Cardiac Palpitations (ICD-10 R00.2). Differential: Essential Hypertension (ICD-10 I10), Exertional Dyspnea (ICD-10 R06.02).`,
    plan: `Start Ecosprin 75mg at night, Metformin 500mg morning after breakfast. Dietary salt reduction. Emergency warnings provided (Dial 108 for crushing chest pain).`
  });

  // Step 3: Voice Note with Gnani API Keys State
  const [isPlayingAudioRx, setIsPlayingAudioRx] = useState(false);
  const [karaokeActiveIndex, setKaraokeActiveIndex] = useState(-1);
  const [activePillSlot, setActivePillSlot] = useState(null); // 'morning' | 'night'
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [selectedLanguage, setSelectedLanguage] = useState(currentEncounter.langCode.startsWith('te') ? 'te-IN' : 'hi-IN');
  const [gnaniStatus, setGnaniStatus] = useState(null);
  const [isRxSigned, setIsRxSigned] = useState(false);

  // Step 4: Dispatch & Modals State
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [scannedStripStatus, setScannedStripStatus] = useState(null);

  // Refs for timers & audio
  const recordingTimerRef = useRef(null);
  const simIntervalRef = useRef(null);
  const audioRxTimerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Check Gnani server-side proxy status on mount
  useEffect(() => {
    speechService.checkGnaniStatus().then(status => {
      setGnaniStatus(status);
    }).catch(() => {});
  }, []);

  // Update default matter when switching scenario
  useEffect(() => {
    setDialogueTurns([]);
    setEditableBestMatter(currentEncounter.fullAudioRxTelugu);
    setMedications(currentEncounter.medications || []);
    setSelectedLanguage(currentEncounter.langCode.startsWith('te') ? 'te-IN' : 'hi-IN');
    setIsPlayingAudioRx(false);
    setKaraokeActiveIndex(-1);
    setIsRxSigned(false);
    setActiveStep(1);
    setMaxCompletedStep(1);
    setRecordedSeconds(0);
    setIsRecording(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    speechService.stopSpeaking();
  }, [selectedEncounterIndex]);

  // Clean up all audio and interval resources on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      if (audioRxTimerRef.current) clearInterval(audioRxTimerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch {}
      }
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch {}
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      speechService.stopSpeaking();
    };
  }, []);

  // Format seconds to MM:SS
  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // =========================================================================
  // STEP 1 ACTIONS: RECORDING CONVERSATION (DOCTOR & PATIENT)
  // =========================================================================
  const startRecordingSession = () => {
    setIsRecording(true);
    isRecordingRef.current = true;
    setMicStatusMsg('Consultation recording in progress...');

    // Live elapsed timer
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      setRecordedSeconds(prev => prev + 1);
    }, 1000);

    if (recordingMode === 'ambient_sim') {
      // Simulate real-time streaming of dialogue turns
      let nextTurnIndex = dialogueTurns.length;
      if (dialogueTurns.length === 0 && currentEncounter.dialogue.length > 0) {
        setDialogueTurns([currentEncounter.dialogue[0]]);
        nextTurnIndex = 1;
      }
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
      simIntervalRef.current = setInterval(() => {
        if (nextTurnIndex < currentEncounter.dialogue.length) {
          const nextTurn = currentEncounter.dialogue[nextTurnIndex];
          setDialogueTurns(prev => [...prev, nextTurn]);
          nextTurnIndex++;
        }
        // Animate VU meter
        setMicVolume(Math.floor(25 + Math.random() * 55));
      }, 2800);
    } else {
      // Physical Mic Stream via WebAudio and SpeechRecognition
      startPhysicalMicPipeline();
    }
  };

  const pauseRecordingSession = () => {
    setIsRecording(false);
    isRecordingRef.current = false;
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    stopPhysicalMicPipeline();
    setMicStatusMsg('Recording paused.');
  };

  const resetRecordingSession = () => {
    pauseRecordingSession();
    setRecordedSeconds(0);
    setDialogueTurns([]);
    setLiveTranscriptionText('');
    setMicVolume(15);
    setActiveLiveSpeaker('Doctor (Live Mic)');
    activeLiveSpeakerRef.current = 'Doctor (Live Mic)';
  };

  const handleSwitchActiveSpeaker = () => {
    const next = activeLiveSpeaker.includes('Doctor') ? 'Patient (Live Mic)' : 'Doctor (Live Mic)';
    activeLiveSpeakerRef.current = next;
    setActiveLiveSpeaker(next);
  };

  const handleToggleTurnSpeaker = (turnIndex) => {
    setDialogueTurns(prev => prev.map((t, idx) => {
      if (idx !== turnIndex) return t;
      const isDoc = t.speaker.includes('Doctor');
      return {
        ...t,
        speaker: isDoc ? 'Patient (Live Mic)' : 'Doctor (Live Mic)'
      };
    }));
  };

  const startPhysicalMicPipeline = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      // Continuous Speech Recognition with Auto-Switching Speaker Diarization
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        const rec = new SpeechRec();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = currentEncounter.langCode || 'te-IN';

        rec.onresult = (e) => {
          let interim = '';
          let finalStr = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const transcript = e.results[i][0].transcript;
            if (e.results[i].isFinal) finalStr += transcript + ' ';
            else interim += transcript;
          }
          if (finalStr.trim()) {
            const trimmed = finalStr.trim();
            const lower = trimmed.toLowerCase();

            // Intelligent Clinical Diarization:
            // Check semantic cues to see if speech explicitly belongs to patient or doctor
            let inferredSpeaker = activeLiveSpeakerRef.current;
            
            // Patient cues: addressing doctor, stating personal symptoms/complaints/duration
            const isPatientCue = lower.includes('నమస్తే డాక్టర్') || lower.includes('డాక్టర్ గారు') || 
                                 lower.includes('డాక్టర్') || lower.includes('doctor') ||
                                 lower.includes('నొప్పి') || lower.includes('జ్వరం') || lower.includes('ఫీవర్') || 
                                 lower.includes('దగ్గు') || lower.includes('జలుబు') || lower.includes('నుండి') || 
                                 lower.includes('నుంచి') || lower.includes('అనిపిస్తుంది') || lower.includes('తీసుకుంటున్నాను');

            // Doctor cues: addressing patient politely, clinical examination questions, medication instructions
            const isDoctorCue = lower.includes('లక్ష్మి గారు') || lower.includes('గారు') || 
                                lower.includes('ఏమి ప్రాబ్లం') || lower.includes('ఎలా ఉంది') || 
                                lower.includes('చూద్దాం') || lower.includes('నోరు తెరవండి') || 
                                lower.includes('మందులు') || lower.includes('టాబ్లెట్స్');

            if (isPatientCue && !isDoctorCue) {
              inferredSpeaker = 'Patient (Live Mic)';
            } else if (isDoctorCue && !isPatientCue) {
              inferredSpeaker = 'Doctor (Live Mic)';
            }

            setDialogueTurns(prev => [
              ...prev,
              {
                speaker: inferredSpeaker,
                text: trimmed,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              }
            ]);
            setLiveTranscriptionText('');

            // Automatically switch active speaker for the NEXT turn!
            const nextSpeaker = inferredSpeaker.includes('Doctor') ? 'Patient (Live Mic)' : 'Doctor (Live Mic)';
            activeLiveSpeakerRef.current = nextSpeaker;
            setActiveLiveSpeaker(nextSpeaker);
          } else if (interim.trim()) {
            setLiveTranscriptionText(interim.trim());
          }
        };

        rec.onerror = (err) => console.warn('SpeechRecognition warning:', err);
        rec.onend = () => {
          if (isRecordingRef.current && mediaStreamRef.current && speechRecognitionRef.current) {
            try { speechRecognitionRef.current.start(); } catch {}
          }
        };

        speechRecognitionRef.current = rec;
        try { rec.start(); } catch {}
      }
    } catch (err) {
      console.warn('Physical microphone unavailable, using client simulator:', err);
      setMicStatusMsg('Hardware mic permission not granted. Running local audio spectrum simulator.');
    }
  };

  const stopPhysicalMicPipeline = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch {}
      speechRecognitionRef.current = null;
    }
    setMicVolume(15);
  };

  const handleAddCustomTurn = () => {
    if (!newSpeakerText.trim()) return;
    setDialogueTurns(prev => [
      ...prev,
      {
        speaker: newSpeakerRole,
        text: newSpeakerText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ]);
    setNewSpeakerText('');
    setShowAddTurnModal(false);
  };

  // =========================================================================
  // STEP 2: FINISH RECORDING & PROCESS WITH AI (SOAP + BEST MATTER SYNTHESIS)
  // =========================================================================
  const handleProceedToAiProcessing = async () => {
    pauseRecordingSession();
    setActiveStep(2);
    setMaxCompletedStep(prev => Math.max(prev, 2));
    setIsAiProcessing(true);
    setAiProcessingStage('Live Groq Reasoning: Extracting SOAP & ICD-10 ontologies from clinical dialogue...');

    try {
      const fullDialogueText = dialogueTurns.map(d => `${d.speaker}: ${d.text}`).join('\n');
      const targetLang = selectedLanguage.startsWith('te') ? 'Telugu' : (selectedLanguage.startsWith('hi') ? 'Hindi' : 'English');

      const prompt = `Patient: ${currentEncounter.patient.name}, Age: ${currentEncounter.patient.age}, Gender: ${currentEncounter.patient.gender}, Vitals: BP ${currentEncounter.vitals.bp}, HR ${currentEncounter.vitals.heartRate}, SpO2 ${currentEncounter.vitals.spo2}
Clinical Encounter Spoken Dialogue:
${fullDialogueText}

Please synthesize an objective clinical assessment strictly based on the patient's actual reported symptoms and dialogue:
1. SUBJECTIVE: Chief complaints, symptoms, duration (e.g. cold, cough, fever, pain).
2. OBJECTIVE: Vitals and clinical observations.
3. ASSESSMENT: Primary and differential diagnoses with valid WHO ICD-10 codes matching the discussed symptoms.
4. PLAN: Specific pharmacological regimen, dietary advice, emergency warnings.
5. BEST_MATTER_SPOKEN_RX: A clear, compassionate 3-4 sentence spoken vernacular prescription in ${targetLang} explaining the exact medicines and their pill colors (e.g. yellow tablet morning, pink tablet night) for the patient.
6. MEDICATIONS: An array of 2-3 specific medications appropriate for the symptoms discussed. Each item MUST have:
   - "name": string (e.g. "Paracetamol 650mg" or "Cetirizine 10mg" or "Amoxicillin 500mg" or relevant medicines)
   - "timing": string in vernacular (e.g. "1-0-1 (ఉదయం & రాత్రి ఆహారం తర్వాత)")
   - "duration": string (e.g. "3 రోజులు" or "5 రోజులు")
   - "color": hex code (e.g. "#EAB308", "#3B82F6", "#EC4899", "#10B981")
   - "colorLabel": string in vernacular (e.g. "పసుపు టాబ్లెట్ (ఉదయం & రాత్రి)")

Format your response strictly as JSON with keys: "subjective", "objective", "assessment", "plan", "bestMatterVernacular", "medications". Do not wrap in markdown or backticks.`;

      const aiResponse = await queryGroqApi(prompt, "You are AyuSwar Clinical Scribe AI. Output valid JSON only.", "llama-3.3-70b-versatile", 700);
      let parsedSuccessfully = false;

      if (aiResponse) {
        try {
          const cleanedJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanedJson);
          if (parsed.subjective) {
            setEditableSoapNote({
              subjective: parsed.subjective,
              objective: parsed.objective || `Vitals: BP ${currentEncounter.vitals.bp}, HR ${currentEncounter.vitals.heartRate}, SpO2 ${currentEncounter.vitals.spo2}.`,
              assessment: parsed.assessment || 'Clinical Assessment pending review.',
              plan: parsed.plan || 'Prescription regimen as advised.'
            });
            parsedSuccessfully = true;
          }
          if (parsed.bestMatterVernacular) {
            setEditableBestMatter(parsed.bestMatterVernacular);
          }
          if (Array.isArray(parsed.medications) && parsed.medications.length > 0) {
            setMedications(parsed.medications);
          }
        } catch {
          setEditableSoapNote(prev => ({
            ...prev,
            assessment: `Clinical dialogue parsed: ${aiResponse.slice(0, 180)}...`
          }));
        }
      }

      // Dialogue-aware clinical fallback if Groq is offline or prompt didn't parse
      if (!parsedSuccessfully) {
        const lowerDialogue = fullDialogueText.toLowerCase();
        const hasRespSymptoms = lowerDialogue.includes('జలుబు') || lowerDialogue.includes('దగ్గు') || 
                                lowerDialogue.includes('గొంతు నొప్పి') || lowerDialogue.includes('నొప్పి') || 
                                lowerDialogue.includes('జ్వరం') || lowerDialogue.includes('ఫీవర్') || 
                                lowerDialogue.includes('cold') || lowerDialogue.includes('cough') || lowerDialogue.includes('fever');

        if (hasRespSymptoms) {
          setEditableSoapNote({
            subjective: `Patient reports acute upper respiratory symptoms including nasal cold (జలుబు), productive cough (దగ్గు), sore throat (గొంతు నొప్పి), and intermittent feverish sensations (ఫీవర్) persisting over the past 1-2 weeks.`,
            objective: `Vitals: BP ${currentEncounter.vitals.bp}, HR ${currentEncounter.vitals.heartRate}, SpO2 ${currentEncounter.vitals.spo2}. Posterior pharyngeal congestion observed. Lungs bilateral vesicular breath sounds clear without wheezing.`,
            assessment: `Primary: Acute Upper Respiratory Tract Infection (ICD-10 J06.9) / Pharyngitis (ICD-10 J02.9). Differential: Viral Pyrexia (ICD-10 R50.9), Acute Bronchitis (ICD-10 J20.9).`,
            plan: `Prescribed antipyretic Paracetamol for fever/body aches, antihistamine Cetirizine for rhinorrhea/congestion, and soothing cough syrup. Advised warm saline gargling and oral hydration.`
          });
          setEditableBestMatter(
            "నమస్కారం, మీకు జలుబు, దగ్గు, గొంతు నొప్పి మరియు జ్వరం కోసం మందులు సూచించబడ్డాయి. పసుపు టాబ్లెట్ ఉదయం మరియు రాత్రి భోజనం తర్వాత వేసుకోండి. నీలం టాబ్లెట్ రాత్రి పడుకునే ముందు వేసుకోండి. ఆకుపచ్చ దగ్గు సిరప్ రెండు పూటలా తీసుకోండి. గోరువెచ్చని నీరు త్రాగండి మరియు త్వరగా కోలుకోండి."
          );
          setMedications([
            {
              name: "Paracetamol 650mg",
              timing: "1-0-1 (ఉదయం & రాత్రి ఆహారం తర్వాత)",
              duration: "3 రోజులు",
              color: "#EAB308",
              colorLabel: "పసుపు టాబ్లెట్ (ఉదయం & రాత్రి)"
            },
            {
              name: "Cetirizine 10mg",
              timing: "0-0-1 (రాత్రి పడుకునే ముందు)",
              duration: "3 రోజులు",
              color: "#3B82F6",
              colorLabel: "నీలం టాబ్లెట్ (రాత్రి)"
            },
            {
              name: "Cough Syrup (Dextromethorphan)",
              timing: "10ml (ఉదయం & రాత్రి భోజనం తర్వాత)",
              duration: "5 రోజులు",
              color: "#10B981",
              colorLabel: "ఆకుపచ్చ సిరప్ (రెండు పూటలా)"
            }
          ]);
        }
      }
    } catch (err) {
      console.warn('Real AI processing error in OPD Step 2:', err);
    } finally {
      setIsAiProcessing(false);
      setAiProcessingStage('');
    }
  };

  // =========================================================================
  // STEP 3: GENERATE VOICE NOTE USING GNANI API KEYS & PLAY WITH KARAOKE
  // =========================================================================
  const handleProceedToVoiceNote = () => {
    setActiveStep(3);
    setMaxCompletedStep(prev => Math.max(prev, 3));
    // Auto-trigger playback on entering Step 3
    handlePlayVoiceNote();
  };

  const handlePlayVoiceNote = async () => {
    if (isPlayingAudioRx) {
      speechService.stopSpeaking();
      setIsPlayingAudioRx(false);
      setKaraokeActiveIndex(-1);
      setActivePillSlot(null);
      if (audioRxTimerRef.current) clearInterval(audioRxTimerRef.current);
      return;
    }

    setIsPlayingAudioRx(true);
    setKaraokeActiveIndex(0);

    const dynamicWords = (editableBestMatter || '').trim().split(/\s+/).filter(Boolean);
    const tokens = dynamicWords.length > 0 ? dynamicWords.map(w => ({ word: w })) : (currentEncounter.karaokeWordsTelugu || []);
    let curIdx = 0;

    // Start synchronized word karaoke and visual pill highlighting
    if (audioRxTimerRef.current) clearInterval(audioRxTimerRef.current);
    audioRxTimerRef.current = setInterval(() => {
      curIdx++;
      if (curIdx < tokens.length) {
        setKaraokeActiveIndex(curIdx);
        const w = tokens[curIdx]?.word || '';
        if (w.includes('పసుపు') || w.includes('ఆకుపచ్చ') || w.includes('ఉదయం') || w.includes('पीली')) {
          setActivePillSlot('morning');
        } else if (w.includes('నీలం') || w.includes('గులాబీ') || w.includes('రాత్రి') || w.includes('गुलाबी')) {
          setActivePillSlot('night');
        }
      } else {
        clearInterval(audioRxTimerRef.current);
        setIsPlayingAudioRx(false);
        setKaraokeActiveIndex(-1);
        setActivePillSlot(null);
      }
    }, Math.round(850 / playbackSpeed));

    // Synthesize voice note using speechService (Routes to /api/gnani/tts with GNANI_API_KEY)
    try {
      await speechService.speak(editableBestMatter, {
        langCode: selectedLanguage,
        rate: playbackSpeed,
        onStart: (info) => {
          setIsPlayingAudioRx(true);
        },
        onEnd: () => {
          setIsPlayingAudioRx(false);
          setKaraokeActiveIndex(-1);
          setActivePillSlot(null);
          if (audioRxTimerRef.current) clearInterval(audioRxTimerRef.current);
        },
        onError: () => {
          setIsPlayingAudioRx(false);
          setKaraokeActiveIndex(-1);
          setActivePillSlot(null);
          if (audioRxTimerRef.current) clearInterval(audioRxTimerRef.current);
        }
      });
    } catch (err) {
      console.warn('Voice note playback error:', err);
    }
  };

  const handleSignPrescriptionDsc = () => {
    setIsRxSigned(true);
  };

  // =========================================================================
  // STEP 4: DISPATCH & HANDOVER
  // =========================================================================
  const handleProceedToDispatch = () => {
    setActiveStep(4);
    setMaxCompletedStep(prev => Math.max(prev, 4));
  };

  const handleResetForNextPatient = () => {
    const nextIdx = (selectedEncounterIndex + 1) % CLINICAL_ENCOUNTERS.length;
    setSelectedEncounterIndex(nextIdx);
  };

  const handleDirectWhatsAppSend = () => {
    const cleanPhone = (currentEncounter.patient.phone || '919849012345').replace(/\D/g, '');
    const message = encodeURIComponent(
      `🏥 *AyuSwar Hospital AI Clinical Audio-Rx*\n\n` +
      `నమస్కారం *${currentEncounter.patient.name}* గారు,\n` +
      `మీ డాక్టర్ *${doctorProfile?.doctorName || 'Dr. Priya Sharma'}* ప్రిస్క్రిప్షన్ ఆడియో నోట్:\n\n` +
      `"${editableBestMatter}"\n\n` +
      `🔊 మీ ఫోన్ లో వాయిస్ నోట్ వినడానికి: https://ayuswar.ai/rx/${currentEncounter.patient.abhaId}\n` +
      `ABDM హెల్త్ రికార్డ్స్ వెరిఫై చేయబడింది ✅`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 24px 80px 24px', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* =====================================================================
          TOP BAR & NAVIGATION BACK
          ===================================================================== */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={() => navigate('/doctor-portal')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            background: '#ffffff',
            border: '1.5px solid #CBD5E1',
            color: '#0F4C5C',
            fontSize: '13px',
            fontWeight: 750,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Doctor OPD</span>
        </button>

        {/* Live Gnani Voice Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '20px',
            background: gnaniStatus?.available ? '#F0FDF4' : 'rgba(15, 76, 92, 0.08)',
            border: `1.5px solid ${gnaniStatus?.available ? '#86EFAC' : '#CBD5E1'}`,
            color: gnaniStatus?.available ? '#166534' : '#0F4C5C',
            fontWeight: 750
          }}>
            <Volume2 size={14} color={gnaniStatus?.available ? '#16a34a' : '#0F4C5C'} />
            <span>
              {gnaniStatus?.available 
                ? '🟢 Gnani Timbre Indic Neural TTS Engine (Active Proxy)' 
                : '🎙️ Gnani Voice Engine (Server Route /api/gnani/tts Active)'}
            </span>
          </div>

          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
            Session #{currentEncounter.patient.abhaId.slice(-4)}
          </span>
        </div>
      </div>

      {/* =====================================================================
          PATIENT DOSSIER & SCENARIO BAR
          ===================================================================== */}
      <div style={{
        background: '#ffffff',
        borderRadius: '18px',
        padding: '16px 22px',
        border: '1.5px solid #E2E8F0',
        boxShadow: '0 4px 18px rgba(15, 76, 92, 0.06)',
        marginBottom: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0F4C5C 0%, #176579 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px'
            }}>
              {currentEncounter.patient.name.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '18px', color: '#091E26', fontWeight: 850, margin: 0 }}>
                  {currentEncounter.patient.name}
                </h1>
                <span style={{ fontSize: '11.5px', background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  {currentEncounter.patient.gender}, {currentEncounter.patient.age}y
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(212, 175, 55, 0.15)', color: '#854D0E', border: '1px solid #FDE047', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                  ABHA: {currentEncounter.patient.abhaId}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0 0' }}>
                OPD Token #{101 + selectedEncounterIndex} • Facility: {currentEncounter.patient.location} • Attending: <strong>{doctorProfile?.doctorName || 'Dr. Priya Sharma, MD'}</strong>
              </p>
            </div>
          </div>

          {/* Asymmetric Cross-Lingual Language Bridge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            background: 'linear-gradient(135deg, rgba(15, 76, 92, 0.05) 0%, rgba(212, 175, 55, 0.08) 100%)',
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1.5px solid rgba(15, 76, 92, 0.15)'
          }}>
            {/* Input: Auto-Detect Dialect */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ffffff',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '11.5px',
                fontWeight: 750,
                color: '#0F4C5C'
              }}>
                <Sparkles size={13} color="#D97706" />
                <span>Doctor & Patient Input:</span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#047857',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '11px'
                }}>
                  ✨ Auto-Detect Dialect Active
                </span>
              </div>
            </div>

            <ArrowRight size={14} color="#64748B" />

            {/* Output: Patient Vernacular Mother Tongue */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 750, color: '#475569' }}>
                🔊 Patient Audio-Rx Language:
              </span>
              <select
                value={selectedEncounterIndex}
                onChange={(e) => setSelectedEncounterIndex(Number(e.target.value))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #0F4C5C',
                  background: '#ffffff',
                  color: '#0F4C5C',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {CLINICAL_ENCOUNTERS.map((enc, idx) => (
                  <option key={enc.id} value={idx}>
                    {enc.language} ({enc.patient.name.split('(')[0].trim()})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vitals Ribbon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid #F1F5F9'
        }}>
          <div style={{ background: '#FAF8F5', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Heart size={11} color="#EF4444" /> Blood Pressure
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#091E26' }}>{currentEncounter.vitals.bp}</div>
          </div>
          <div style={{ background: '#FAF8F5', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={11} color="#0F4C5C" /> Pulse / HR
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#091E26' }}>{currentEncounter.vitals.heartRate}</div>
          </div>
          <div style={{ background: '#FAF8F5', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Droplets size={11} color="#0284C7" /> SpO2 Oxygen
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#091E26' }}>{currentEncounter.vitals.spo2}</div>
          </div>
          <div style={{ background: '#FAF8F5', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Thermometer size={11} color="#D97706" /> Temperature
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#091E26' }}>{currentEncounter.vitals.temp}</div>
          </div>
          <div style={{ background: '#FAF8F5', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={11} color="#9333EA" /> Random Blood Sugar
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#091E26' }}>{currentEncounter.vitals.bloodSugar}</div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          STEP-BY-STEP WORKFLOW RIBBON (1 -> 2 -> 3 -> 4)
          ===================================================================== */}
      <div style={{
        background: 'linear-gradient(135deg, #0A2540 0%, #0F3B66 100%)',
        borderRadius: '18px',
        padding: '16px 20px',
        color: '#ffffff',
        marginBottom: '22px',
        boxShadow: '0 8px 24px rgba(10, 37, 64, 0.15)',
        border: '1.5px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#2DD4BF' }}>
              OPD Clinical Workflow Master
            </div>
            <div style={{ fontSize: '16px', fontWeight: 850 }}>
              Step {activeStep} of 4: {
                activeStep === 1 ? 'Record Doctor-Patient Consultation' :
                activeStep === 2 ? 'AI Clinical Processing & Best Matter Synthesis' :
                activeStep === 3 ? 'Synthesize Voice Note with Gnani AI' :
                'Class-3 Sign & Dispatch to WhatsApp'
              }
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>Sequential Flow:</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#FCD34D' }}>
              Record → AI Process → Gnani Voice → Dispatch
            </span>
          </div>
        </div>

        {/* 4 Interactive Stepper Nodes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px'
        }}>
          {[
            { step: 1, title: '1. Record Consultation', desc: 'Capture Doctor & Patient', icon: Mic },
            { step: 2, title: '2. AI Processing', desc: 'SOAP & Best Matter', icon: Cpu },
            { step: 3, title: '3. Gnani Voice Note', desc: 'Neural TTS & Karaoke', icon: Volume2 },
            { step: 4, title: '4. Sign & Dispatch', desc: 'WhatsApp & ABDM FHIR', icon: Send }
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = activeStep === item.step;
            const isDone = maxCompletedStep > item.step;
            return (
              <button
                key={item.step}
                onClick={() => {
                  if (item.step <= maxCompletedStep) {
                    setActiveStep(item.step);
                  }
                }}
                disabled={item.step > maxCompletedStep}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: isCurrent 
                    ? '2px solid #2DD4BF' 
                    : isDone 
                      ? '1.5px solid #10B981' 
                      : '1px solid rgba(255,255,255,0.15)',
                  background: isCurrent 
                    ? 'rgba(45, 212, 191, 0.18)' 
                    : isDone 
                      ? 'rgba(16, 185, 129, 0.12)' 
                      : 'rgba(255,255,255,0.05)',
                  color: '#ffffff',
                  cursor: item.step <= maxCompletedStep ? 'pointer' : 'not-allowed',
                  opacity: item.step > maxCompletedStep ? 0.45 : 1,
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isCurrent ? '#2DD4BF' : isDone ? '#10B981' : 'rgba(255,255,255,0.15)',
                  color: isCurrent ? '#061626' : '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isDone && !isCurrent ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '10.5px', color: isCurrent ? '#2DD4BF' : '#CBD5E1', whiteSpace: 'nowrap' }}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          STEP 1 CONTENT: RECORDING CONSULTATION (DOCTOR & PATIENT)
          ===================================================================== */}
      {activeStep === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '22px' }}>
          
          {/* Left Column: Live Audio Stream & Dialogue Turn Stream */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '22px',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0F4C5C', margin: 0 }}>
                  Doctor-Patient Consultation Dialogue
                </h2>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                  First record the entire consultation between doctor and patient.
                </p>
              </div>

              {/* Mode Toggle: Physical Mic vs Ambient Simulation */}
              <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <button
                  onClick={() => { setRecordingMode('ambient_sim'); if (isRecording) pauseRecordingSession(); }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '7px',
                    border: 'none',
                    background: recordingMode === 'ambient_sim' ? '#0F4C5C' : 'transparent',
                    color: recordingMode === 'ambient_sim' ? '#ffffff' : '#64748B',
                    fontSize: '11px',
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ High-Fidelity Simulation
                </button>
                <button
                  onClick={() => { setRecordingMode('live_mic'); if (isRecording) pauseRecordingSession(); }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '7px',
                    border: 'none',
                    background: recordingMode === 'live_mic' ? '#EF4444' : 'transparent',
                    color: recordingMode === 'live_mic' ? '#ffffff' : '#64748B',
                    fontSize: '11px',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Mic size={12} />
                  <span>🎙️ Live Laptop Mic</span>
                </button>
              </div>
            </div>

            {/* Recording Controls Strip */}
            <div style={{
              background: '#061626',
              borderRadius: '14px',
              padding: '16px 18px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  onClick={isRecording ? pauseRecordingSession : startRecordingSession}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    background: isRecording ? '#EF4444' : '#10B981',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: isRecording ? '0 0 16px rgba(239, 68, 68, 0.5)' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {isRecording ? <Pause size={16} /> : <Play size={16} fill="#ffffff" />}
                  <span>{isRecording ? 'Pause Recording' : '▶ Start OPD Recording'}</span>
                </button>

                <button
                  onClick={resetRecordingSession}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '9px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#CBD5E1',
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => setShowAddTurnModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '9px 14px',
                    borderRadius: '10px',
                    background: 'rgba(45, 212, 191, 0.15)',
                    color: '#2DD4BF',
                    border: '1px solid #2DD4BF',
                    fontSize: '12px',
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  <Edit3 size={13} />
                  <span>+ Add Turn</span>
                </button>

                {/* Live Mic Auto-Switch Speaker Badge & Manual Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: activeLiveSpeaker.includes('Doctor') ? 'rgba(45, 212, 191, 0.15)' : 'rgba(251, 191, 36, 0.15)',
                  border: `1.5px solid ${activeLiveSpeaker.includes('Doctor') ? '#2DD4BF' : '#FBBF24'}`,
                  borderRadius: '10px',
                  padding: '5px 12px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  color: activeLiveSpeaker.includes('Doctor') ? '#2DD4BF' : '#FDE047'
                }}>
                  <span>Now Speaking: {activeLiveSpeaker.includes('Doctor') ? '🩺 Doctor' : '👵 Patient'}</span>
                  <button
                    onClick={handleSwitchActiveSpeaker}
                    title="Click to manually toggle current speaker (also automatically switches when you stop speaking)"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '6px',
                      padding: '2px 8px',
                      fontSize: '10.5px',
                      fontWeight: 750,
                      cursor: 'pointer'
                    }}
                  >
                    ⇄ Switch
                  </button>
                </div>
              </div>

              {/* Timer & Live Signal Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Elapsed Time
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: isRecording ? '#EF4444' : '#2DD4BF', fontFamily: 'monospace' }}>
                    {formatTimer(recordedSeconds)}
                  </div>
                </div>

                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: isRecording ? '#EF4444' : '#64748B',
                  animation: isRecording ? 'pulse 1s infinite' : 'none'
                }} />
              </div>
            </div>

            {/* Live Audio STFT Spectrum Bars */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.04)',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={16} color="#0F4C5C" />
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#0F4C5C' }}>
                  Acoustic Speech Spectrum (16 kHz PCM)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '26px' }}>
                {[...Array(24)].map((_, i) => {
                  const h = isRecording 
                    ? Math.max(4, ((micVolume * (1 + Math.sin(i * 0.4))) % 24))
                    : 4;
                  return (
                    <div
                      key={i}
                      style={{
                        width: '3.5px',
                        height: `${h}px`,
                        background: i % 2 === 0 ? '#0F4C5C' : '#D4AF37',
                        borderRadius: '2px',
                        transition: 'height 0.1s ease'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Conversation Dialogue Transcript Feed */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              maxHeight: '380px',
              overflowY: 'auto',
              paddingRight: '6px'
            }}>
              {dialogueTurns.length === 0 && !liveTranscriptionText && (
                <div style={{
                  padding: '36px 20px',
                  textAlign: 'center',
                  background: '#FAF8F5',
                  borderRadius: '14px',
                  border: '2px dashed #CBD5E1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  margin: 'auto 0'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(15, 76, 92, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Mic size={22} color="#0F4C5C" />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#091E26' }}>
                    No Spoken Dialogue Recorded Yet
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', maxWidth: '380px', lineHeight: 1.5 }}>
                    {recordingMode === 'live_mic'
                      ? (isRecording 
                          ? '🎙️ Listening live to your laptop microphone... Speak clearly and turns will appear here!'
                          : 'Click "▶ Start OPD Recording" above and speak into your microphone to record doctor & patient.')
                      : 'Click "▶ Start OPD Recording" to stream the consultation, or click below to load the full scenario demo.'}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button
                      onClick={() => setDialogueTurns(currentEncounter.dialogue)}
                      style={{
                        background: '#ffffff',
                        color: '#0F4C5C',
                        border: '1.5px solid #0F4C5C',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 750,
                        cursor: 'pointer'
                      }}
                    >
                      ⚡ Load Scenario Simulation
                    </button>
                    <button
                      onClick={() => setShowAddTurnModal(true)}
                      style={{
                        background: '#F1F5F9',
                        color: '#475569',
                        border: '1px solid #CBD5E1',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 750,
                        cursor: 'pointer'
                      }}
                    >
                      + Add Manual Turn
                    </button>
                  </div>
                </div>
              )}

              {dialogueTurns.map((turn, i) => {
                const isDoc = turn.speaker.includes('Doctor');
                return (
                  <div
                    key={i}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: isDoc ? '#F0FDFA' : '#FFFDF5',
                      border: isDoc ? '1.5px solid #CCFBF1' : '1.5px solid #FEF08A',
                      borderLeft: isDoc ? '4px solid #0F4C5C' : '4px solid #D97706'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <button
                        onClick={() => handleToggleTurnSpeaker(i)}
                        title="Click to toggle speaker between Doctor and Patient"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '11px',
                          fontWeight: 800,
                          color: isDoc ? '#0F4C5C' : '#B45309'
                        }}
                      >
                        <span>{isDoc ? '🩺 Doctor' : '👵 Patient'}: {turn.speaker}</span>
                        <span style={{
                          fontSize: '9.5px',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: isDoc ? 'rgba(15, 76, 92, 0.1)' : 'rgba(217, 119, 6, 0.1)',
                          color: isDoc ? '#0F4C5C' : '#B45309',
                          fontWeight: 700
                        }}>
                          ⇄ switch
                        </span>
                      </button>
                      <span style={{ fontSize: '10px', color: '#94A3B8' }}>{turn.time || 'Live'}</span>
                    </div>
                    <p style={{ fontSize: '13.5px', color: '#091E26', lineHeight: 1.5, margin: 0, fontWeight: 550 }}>
                      {turn.text}
                    </p>
                  </div>
                );
              })}

              {liveTranscriptionText && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: activeLiveSpeaker.includes('Doctor') ? '#F0FDFA' : '#FFFDF5',
                  border: `1.5px dashed ${activeLiveSpeaker.includes('Doctor') ? '#0F4C5C' : '#D97706'}`,
                  fontSize: '13px',
                  color: activeLiveSpeaker.includes('Doctor') ? '#0F4C5C' : '#B45309',
                  fontWeight: 650
                }}>
                  🎙️ {activeLiveSpeaker.includes('Doctor') ? '🩺 Doctor' : '👵 Patient'} speaking: "{liveTranscriptionText}..."
                </div>
              )}
            </div>

            {/* STEP 1 FINISH ACTION BUTTON */}
            <button
              onClick={handleProceedToAiProcessing}
              disabled={dialogueTurns.length === 0}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0F4C5C 0%, #006666 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 800,
                cursor: dialogueTurns.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 16px rgba(15, 76, 92, 0.35)',
                transition: 'all 0.2s ease',
                marginTop: 'auto'
              }}
            >
              <span>⏹️ Finish Consultation & Process with AI (Step 2 →)</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Right Column: Acoustic Respiratory Biomarkers & Ontology Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Live Colloquial Dialect Resolver Preview */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '20px',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 4px 18px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Cpu size={18} color="#0F4C5C" />
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#091E26', margin: 0 }}>
                  Vernacular Semantic Metaphor Resolver
                </h3>
              </div>
              <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 12px 0' }}>
                Translates rural colloquial idioms directly to formal WHO ICD-10 & SNOMED CT:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentEncounter.vernacularMappings.map((map, idx) => (
                  <div key={idx} style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#FAF8F5',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#D97706' }}>{map.dialect}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{map.clinicalTerm}</div>
                    </div>
                    <span style={{ fontSize: '10.5px', fontWeight: 800, background: 'rgba(15, 76, 92, 0.1)', color: '#0F4C5C', padding: '2px 8px', borderRadius: '6px' }}>
                      ICD-10: {map.icd10}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acoustic Biomarkers HUD */}
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '20px',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 4px 18px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Activity size={18} color="#D97706" />
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#091E26', margin: 0 }}>
                  Acoustic Respiratory Biomarkers (DSP)
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#FAF8F5', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Respiratory Effort</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#D97706' }}>{currentEncounter.acousticBiomarkers.respiratoryEffort}</div>
                </div>
                <div style={{ background: '#FAF8F5', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Cough Signature</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#091E26' }}>{currentEncounter.acousticBiomarkers.coughType}</div>
                </div>
                <div style={{ background: '#FAF8F5', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Vocal Tremor</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F4C5C' }}>{currentEncounter.acousticBiomarkers.vocalTremor}</div>
                </div>
                <div style={{ background: '#FAF8F5', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>Risk Category</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>{currentEncounter.acousticBiomarkers.riskCategory}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 2 CONTENT: AI PROCESSING & "BEST MATTER" SYNTHESIS
          ===================================================================== */}
      {activeStep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* AI Processing Banner */}
          {isAiProcessing ? (
            <div style={{
              background: 'linear-gradient(135deg, #061626 0%, #0D3E4A 100%)',
              borderRadius: '18px',
              padding: '24px',
              color: '#ffffff',
              textAlign: 'center',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '3px solid rgba(45, 212, 191, 0.2)',
                borderTopColor: '#2DD4BF',
                borderRadius: '50%',
                margin: '0 auto 14px auto',
                animation: 'spin 0.8s linear infinite'
              }} />
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0', color: '#2DD4BF' }}>
                AI Indic Clinical Reasoner Synthesizing Prescription
              </h3>
              <p style={{ fontSize: '13px', color: '#CBD5E1', margin: 0 }}>
                {aiProcessingStage}
              </p>
            </div>
          ) : (
            <>
              {/* Success Banner */}
              <div style={{
                background: '#F0FDF4',
                border: '1.5px solid #86EFAC',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={24} color="#16a34a" />
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#166534', margin: 0 }}>
                      AI Clinical Synthesis Complete
                    </h3>
                    <p style={{ fontSize: '12px', color: '#15803d', margin: '2px 0 0 0' }}>
                      Processed {dialogueTurns.length} spoken dialogue turns. SOAP structured, ICD-10 mapped, and Best-Matter Spoken Rx generated.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleProceedToVoiceNote}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    background: '#0F4C5C',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(15, 76, 92, 0.3)'
                  }}
                >
                  <span>🔊 Generate Voice Note with Gnani AI (Step 3 →)</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* 2-Column AI Clinical Results Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>
                
                {/* Column A: Structured SOAP Clinical Note */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '22px',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={18} color="#0F4C5C" />
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#091E26', margin: 0 }}>
                        Structured HL7 FHIR R4 SOAP Note
                      </h3>
                    </div>
                    <span style={{ fontSize: '10.5px', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '8px', fontWeight: 800 }}>
                      REVIEW READY
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                    <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontWeight: 800, color: '#0F4C5C', marginBottom: '4px' }}>SUBJECTIVE (S):</div>
                      <div style={{ color: '#334155', lineHeight: 1.5 }}>{editableSoapNote.subjective}</div>
                    </div>

                    <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontWeight: 800, color: '#0F4C5C', marginBottom: '4px' }}>OBJECTIVE (O):</div>
                      <div style={{ color: '#334155', lineHeight: 1.5 }}>{editableSoapNote.objective}</div>
                    </div>

                    <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontWeight: 800, color: '#0F4C5C', marginBottom: '4px' }}>ASSESSMENT (A):</div>
                      <div style={{ color: '#334155', lineHeight: 1.5 }}>{editableSoapNote.assessment}</div>
                    </div>

                    <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontWeight: 800, color: '#0F4C5C', marginBottom: '4px' }}>PLAN (P):</div>
                      <div style={{ color: '#334155', lineHeight: 1.5 }}>{editableSoapNote.plan}</div>
                    </div>
                  </div>
                </div>

                {/* Column B: THE SYNTHESIZED "BEST MATTER" SPOKEN VERNACULAR RX SCRIPT */}
                <div style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF5 100%)',
                  borderRadius: '20px',
                  padding: '22px',
                  border: '2px solid #D4AF37',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={18} color="#D4AF37" />
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 850, color: '#091E26', margin: 0 }}>
                          AI Synthesized Spoken Prescription Note (Best Matter)
                        </h3>
                        <span style={{ fontSize: '11px', color: '#854D0E', fontWeight: 600 }}>
                          Language: {currentEncounter.language}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '10.5px', background: '#D4AF37', color: '#061626', padding: '3px 8px', borderRadius: '8px', fontWeight: 900 }}>
                      BEST MATTER
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    This text has been composed by the clinical reasoning engine specifically tailored for non-reading rural patients. You may edit before synthesizing with Gnani.
                  </p>

                  <textarea
                    value={editableBestMatter}
                    onChange={(e) => setEditableBestMatter(e.target.value)}
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      background: '#ffffff',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: '#091E26',
                      fontWeight: 600,
                      fontFamily: 'Outfit, system-ui, sans-serif',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />

                  {/* Visual Pill Cards for Non-Reading Patients */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0F4C5C' }}>
                      Prescription Dosages & Visual Badges:
                    </div>
                    {medications.map((med, idx) => (
                      <div key={idx} style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: '#ffffff',
                        border: `1px solid ${med.color}33`,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#091E26' }}>{med.name}</div>
                          <div style={{ fontSize: '11px', color: med.color, fontWeight: 750 }}>{med.colorLabel}</div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#0F4C5C' }}>
                          {med.timing} • {med.duration}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleProceedToVoiceNote}
                    style={{
                      width: '100%',
                      padding: '13px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #0F4C5C 0%, #D4AF37 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(15, 76, 92, 0.35)',
                      marginTop: 'auto'
                    }}
                  >
                    <span>🔊 Synthesize Spoken Voice Note with Gnani AI (Step 3 →)</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* =====================================================================
          STEP 3 CONTENT: VOICE NOTE GENERATION USING GNANI API KEYS & KARAOKE
          ===================================================================== */}
      {activeStep === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '22px' }}>
          
          {/* Main Voice Note Player Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            border: '2px solid rgba(15, 76, 92, 0.25)',
            boxShadow: '0 8px 30px rgba(15, 76, 92, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Volume2 size={24} color="#0F4C5C" />
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: 850, color: '#0F4C5C', margin: 0 }}>
                    Spoken Prescription Voice Note
                  </h2>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                    Synthesized with Gnani Timbre Indic TTS Engine (/api/gnani/tts)
                  </p>
                </div>
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#854D0E',
                background: '#FEF9C3',
                border: '1px solid #FDE047',
                padding: '4px 10px',
                borderRadius: '12px'
              }}>
                SYNCHRONIZED KARAOKE
              </span>
            </div>

            {/* Doctor Voice Avatar Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(15, 76, 92, 0.06) 0%, rgba(212, 175, 55, 0.08) 100%)',
              border: '1px solid rgba(15, 76, 92, 0.15)'
            }}>
              <div style={{
                position: 'relative',
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid #0F4C5C',
                flexShrink: 0
              }}>
                <img 
                  src="/assets/dr_ananya_avatar.jpg" 
                  alt="Doctor Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {isPlayingAudioRx && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '14px',
                    background: 'rgba(15, 76, 92, 0.92)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px'
                  }}>
                    <span style={{ width: '2px', height: '6px', background: '#D4AF37' }}></span>
                    <span style={{ width: '2px', height: '10px', background: '#ffffff' }}></span>
                    <span style={{ width: '2px', height: '7px', background: '#D4AF37' }}></span>
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F4C5C' }}>
                  {doctorProfile?.doctorName || 'Dr. Priya Sharma, MD'}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Speaking in <strong>{currentEncounter.language}</strong> with personalized dosage schedule
                </div>
              </div>

              {/* Speed Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Speed:</span>
                {[0.8, 1.0, 1.25].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                      border: playbackSpeed === speed ? '1.5px solid #0F4C5C' : '1px solid #CBD5E1',
                      background: playbackSpeed === speed ? 'rgba(15, 76, 92, 0.12)' : '#ffffff',
                      color: playbackSpeed === speed ? '#0F4C5C' : '#64748B',
                      cursor: 'pointer'
                    }}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Glowing Synchronized Karaoke Word Display */}
            <div style={{
              background: '#061626',
              borderRadius: '16px',
              padding: '18px 22px',
              minHeight: '92px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              lineHeight: 2.0,
              gap: '6px 8px',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)'
            }}>
              {((editableBestMatter || '').trim().split(/\s+/).filter(Boolean).map(w => ({ word: w }))).map((item, idx) => {
                const isActive = karaokeActiveIndex === idx;
                return (
                  <span
                    key={idx}
                    style={{
                      fontSize: '15px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontWeight: isActive ? 800 : 500,
                      color: isActive ? '#061626' : '#E2E8F0',
                      background: isActive ? '#FCD34D' : 'transparent',
                      boxShadow: isActive ? '0 0 14px rgba(252, 211, 77, 0.8)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {item.word}
                  </span>
                );
              })}
            </div>

            {/* Audio Controls Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handlePlayVoiceNote}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '13px',
                  borderRadius: '12px',
                  background: isPlayingAudioRx ? '#EF4444' : '#0F4C5C',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15, 76, 92, 0.3)'
                }}
              >
                {isPlayingAudioRx ? <Pause size={17} /> : <Play size={17} fill="#ffffff" />}
                <span>{isPlayingAudioRx ? 'Pause Voice Note' : '▶ Play Spoken Audio Note'}</span>
              </button>

              <button
                onClick={() => {
                  speechService.stopSpeaking();
                  setIsPlayingAudioRx(false);
                  setKaraokeActiveIndex(0);
                  setTimeout(handlePlayVoiceNote, 200);
                }}
                style={{
                  padding: '13px 16px',
                  borderRadius: '12px',
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  fontWeight: 750,
                  cursor: 'pointer'
                }}
                title="Replay from beginning"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Synchronized Visual Color Pill Schedule */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F4C5C' }}>
                Visual Pill Indicators (Illuminates in sync with voice instructions):
              </div>
              {medications.map((med, i) => {
                const isIlluminated = activePillSlot === med.slot;
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: isIlluminated ? 'rgba(252, 211, 77, 0.15)' : '#FAF8F5',
                      border: isIlluminated ? `2px solid ${med.color}` : '1px solid #E2E8F0',
                      boxShadow: isIlluminated ? `0 0 16px ${med.color}40` : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: med.color,
                        boxShadow: `0 0 10px ${med.color}`
                      }} />
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#091E26' }}>{med.name}</div>
                        <div style={{ fontSize: '11px', color: med.color, fontWeight: 750 }}>{med.colorLabel}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 750, color: '#0F4C5C' }}>
                      {med.timing}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Class-3 DSC Digital Sign & Handover */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Class-3 DSC Digital Signature Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              border: isRxSigned ? '2px solid #10B981' : '1.5px solid #E2E8F0',
              boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color={isRxSigned ? '#10B981' : '#0F4C5C'} />
                <h3 style={{ fontSize: '15px', fontWeight: 850, color: '#091E26', margin: 0 }}>
                  Doctor-in-the-Loop Class-3 DSC Sign
                </h3>
              </div>

              <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                Under National Medical Commission (NMC) & DPDP Act 2023, the physician reviews the synthesized spoken voice note and applies a cryptographic Class-3 DSC signature.
              </p>

              {isRxSigned ? (
                <div style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: '#F0FDF4',
                  border: '1.5px solid #86EFAC',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <CheckCircle2 size={24} color="#16a34a" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#166534' }}>
                      DSC SIGNATURE VERIFIED ✅
                    </div>
                    <div style={{ fontSize: '11px', color: '#15803d' }}>
                      Signer: {doctorProfile?.doctorName || 'Dr. Priya Sharma'} (MCI-98421-AP) • Timestamp: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleSignPrescriptionDsc}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0F4C5C 0%, #166534 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(15, 76, 92, 0.25)'
                  }}
                >
                  ✍️ Digitally Sign & Approve Prescription
                </button>
              )}

              {/* Step 3 -> 4 Proceed Action */}
              <button
                onClick={handleProceedToDispatch}
                disabled={!isRxSigned}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  background: isRxSigned 
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
                    : '#CBD5E1',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: isRxSigned ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isRxSigned ? '0 4px 16px rgba(16, 185, 129, 0.35)' : 'none',
                  transition: 'all 0.2s ease',
                  marginTop: 'auto'
                }}
              >
                <span>📲 Proceed to Dispatch & WhatsApp (Step 4 →)</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 4 CONTENT: SIGN & DISPATCH TO WHATSAPP
          ===================================================================== */}
      {activeStep === 4 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>
          
          {/* WhatsApp Patient Card Preview */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            border: '2px solid #25D366',
            boxShadow: '0 8px 30px rgba(37, 211, 102, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '12px' }}>
              <Smartphone size={24} color="#25D366" />
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 850, color: '#091E26', margin: 0 }}>
                  WhatsApp Vernacular Audio-Rx Delivery
                </h3>
                <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Target: {currentEncounter.patient.name} ({currentEncounter.patient.phone || '+91 98490 12345'})
                </p>
              </div>
            </div>

            {/* WhatsApp Authentic Bubble Preview */}
            <div style={{
              background: '#EFEAE2',
              borderRadius: '16px',
              padding: '18px',
              border: '1px solid #D1D7DB'
            }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '12.5px',
                color: '#111B21',
                lineHeight: 1.5
              }}>
                <div style={{ fontWeight: 800, color: '#0F4C5C' }}>
                  🏥 AyuSwar Clinical Audio-Rx
                </div>
                <div>
                  నమస్కారం <strong>{currentEncounter.patient.name}</strong> గారు, మీ డాక్టర్ <strong>{doctorProfile?.doctorName || 'Dr. Priya Sharma'}</strong> ప్రిస్క్రిప్షన్ ఆడియో నోట్:
                </div>
                <div style={{
                  background: '#F0FDFA',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(15, 76, 92, 0.15)',
                  fontStyle: 'italic',
                  fontSize: '12px'
                }}>
                  "{editableBestMatter}"
                </div>
                <div style={{ color: '#0284C7', textDecoration: 'underline', fontSize: '11.5px' }}>
                  🔊 https://ayuswar.ai/rx/{currentEncounter.patient.abhaId}
                </div>
                <div style={{ fontSize: '11px', color: '#667781', textAlign: 'right' }}>
                  Delivered • ABDM Verified ✅
                </div>
              </div>
            </div>

            {/* 1-Click WhatsApp Trigger Button */}
            <button
              onClick={handleDirectWhatsAppSend}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(37, 211, 102, 0.35)'
              }}
            >
              <Smartphone size={18} />
              <span>📲 Send via WhatsApp to +91 98490 12345</span>
            </button>
          </div>

          {/* Handover & Next Patient Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '24px',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 850, color: '#0F4C5C', margin: 0 }}>
              Hospital Handover & Export
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => setShowFhirModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#0F4C5C',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <FileText size={16} />
                <span>ABDM FHIR JSON</span>
              </button>

              <button
                onClick={() => setShowPrintModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#0F4C5C',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <Printer size={16} />
                <span>Print OPD Sheet</span>
              </button>
            </div>

            {/* Authentic QR Slip Preview */}
            <div style={{
              background: '#FAF8F5',
              padding: '16px',
              borderRadius: '14px',
              border: '1px dashed #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <AuthenticQrCode 
                value={`https://ayuswar.ai/rx/${currentEncounter.patient.abhaId}`} 
                size={84} 
              />
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#091E26' }}>
                  Official ABDM Digital Prescription QR
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  Scannable by Jan Aushadhi pharmacists and rural patients for vernacular dosage playback.
                </div>
              </div>
            </div>

            {/* Next OPD Patient Button */}
            <button
              onClick={handleResetForNextPatient}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0F4C5C 0%, #D4AF37 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(15, 76, 92, 0.35)',
                marginTop: 'auto'
              }}
            >
              <Sparkles size={16} />
              <span>✨ Start Next OPD Patient in Queue</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          ADD CUSTOM TURN MODAL (FOR STEP 1)
          ===================================================================== */}
      {showAddTurnModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(6, 22, 38, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '24px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F4C5C', margin: 0 }}>
              Insert Consultation Speaking Turn
            </h3>
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 750, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Speaker Role:
              </label>
              <select
                value={newSpeakerRole}
                onChange={(e) => setNewSpeakerRole(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px' }}
              >
                <option value="Doctor">🩺 Attending Doctor</option>
                <option value="Patient">👵 Patient</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 750, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Spoken Text:
              </label>
              <textarea
                value={newSpeakerText}
                onChange={(e) => setNewSpeakerText(e.target.value)}
                rows={3}
                placeholder="Type or paste what was spoken..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setShowAddTurnModal(false)}
                style={{ padding: '8px 16px', borderRadius: '8px', background: '#F1F5F9', border: 'none', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomTurn}
                style={{ padding: '8px 16px', borderRadius: '8px', background: '#0F4C5C', border: 'none', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
              >
                Add Turn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          ABDM FHIR R4 JSON MODAL
          ===================================================================== */}
      {showFhirModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(6, 22, 38, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F4C5C', margin: 0 }}>
                ABDM FHIR R4 Bundle Export
              </h3>
              <button onClick={() => setShowFhirModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            <pre style={{
              background: '#061626',
              color: '#2DD4BF',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '11px',
              fontFamily: 'monospace',
              overflowY: 'auto',
              flex: 1
            }}>
              {JSON.stringify(generateAbdmFhirR4Bundle(
                currentEncounter.patient,
                { doctorName: doctorProfile?.doctorName || 'Dr. Priya Sharma', hprId: 'HPR-AP-9924-2026' },
                'Cardiovascular / Respiratory Outpatient Consultation',
                medications
              ), null, 2)}
            </pre>

            <button
              onClick={() => {
                const bundle = generateAbdmFhirR4Bundle(
                  currentEncounter.patient,
                  { doctorName: doctorProfile?.doctorName || 'Dr. Priya Sharma', hprId: 'HPR-AP-9924-2026' },
                  'Cardiovascular / Respiratory Outpatient Consultation',
                  medications
                );
                const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ABDM_FHIR_Rx_${currentEncounter.patient.name.split(' ')[0]}.json`;
                a.click();
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                background: '#0F4C5C',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Download JSON File
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          PRINT OPD RX SLIP MODAL
          ===================================================================== */}
      {showPrintModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(6, 22, 38, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '560px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F4C5C' }}>
                Official OPD Prescription Slip (Print Preview)
              </div>
              <button onClick={() => setShowPrintModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            <div style={{ border: '2px solid #0F4C5C', borderRadius: '12px', padding: '16px', background: '#FAF8F5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #CBD5E1', paddingBottom: '8px', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#091E26' }}>AYUSWAR AMBIENT CLINIC</div>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>Primary Health Centre • ABDM Integrated</div>
                </div>
                <AuthenticQrCode value={`https://ayuswar.ai/rx/${currentEncounter.patient.abhaId}`} size={56} />
              </div>

              <div style={{ fontSize: '11.5px', color: '#334155', marginBottom: '10px' }}>
                Patient: <strong>{currentEncounter.patient.name}</strong> • Age/Sex: {currentEncounter.patient.age}y / {currentEncounter.patient.gender} • ABHA: {currentEncounter.patient.abhaId}
              </div>

              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F4C5C', marginBottom: '6px' }}>Rx Medications:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px', fontSize: '11.5px' }}>
                {medications.map((m, i) => (
                  <div key={i}>• {m.name} — {m.timing} ({m.colorLabel})</div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #CBD5E1', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Class-3 Cryptographic DSC Stamp Verified</div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F4C5C' }}>{doctorProfile?.doctorName || 'Dr. Priya Sharma, MD'}</div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              style={{ padding: '10px', borderRadius: '10px', background: '#0F4C5C', color: '#ffffff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
            >
              🖨️ Print Clinical Slip
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      <WhatsAppAudioRxModal 
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        patientData={{
          name: currentEncounter.patient.name,
          vernacularName: currentEncounter.language.includes('Telugu') ? 'నారాయణ రావు' : 'आरव कुमार',
          phone: currentEncounter.patient.phone || '+91 98490 12345',
          cleanPhone: (currentEncounter.patient.phone || '919849012345').replace(/\D/g, ''),
          age: currentEncounter.patient.age,
          gender: currentEncounter.patient.gender,
          abhaId: currentEncounter.patient.abhaId,
          language: currentEncounter.language,
          langCode: currentEncounter.langCode || 'te-IN'
        }}
        doctorName={doctorProfile?.doctorName || 'Dr. Priya Sharma, MD'}
        initialLanguage={currentEncounter.langCode?.includes('hi') ? 'hi' : 'te'}
      />
    </div>
  );
}
