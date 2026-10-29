import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useDoctorVoiceNavigation — Ambient Hands-Free Voice Command Navigation for Clinicians
 * 
 * Supports bilingual clinical navigation commands in Telugu and Indian English.
 * Enables hands-free workflow in busy OPDs and sterile examination rooms.
 */
export function useDoctorVoiceNavigation({ onNavigateTab, onSelectNextPatient }) {
  const [isVoiceNavActive, setIsVoiceNavActive] = useState(false);
  const [lastCommandHeard, setLastCommandHeard] = useState('');
  const [commandFeedbackToast, setCommandFeedbackToast] = useState(null);
  const recognitionRef = useRef(null);

  const speakConfirmation = useCallback((text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  }, []);

  const handleCommandMatch = useCallback((transcript) => {
    const text = transcript.toLowerCase().trim();
    setLastCommandHeard(text);

    // 1. Dashboard Commands
    if (/dashboard|డాష్‌బోర్డ్|హోమ్|home|main/i.test(text)) {
      onNavigateTab('dashboard');
      setCommandFeedbackToast('✓ Navigated to Dashboard (డాష్‌బోర్డ్)');
      speakConfirmation('Opening Dashboard');
      return true;
    }

    // 2. OPD Queue / Next Patient Commands
    if (/next patient|తదుపరి రోగి|queue|క్యూ|ఓపీడీ|opd|రోగులు/i.test(text)) {
      onNavigateTab('opd_queue');
      if (/next patient|తదుపరి రోగి/i.test(text) && onSelectNextPatient) {
        onSelectNextPatient();
        setCommandFeedbackToast('✓ Token Advanced: Next Patient in OPD Queue (తదుపరి రోగి)');
        speakConfirmation('Next patient selected in OPD queue');
      } else {
        setCommandFeedbackToast('✓ Navigated to OPD Queue (ఓపీడీ క్యూ)');
        speakConfirmation('Opening OPD Queue');
      }
      return true;
    }

    // 3. Prescriptions / Meds Commands
    if (/prescription|prescriptions|మందులు|మందుల చీటీ|rx|meds|medication/i.test(text)) {
      onNavigateTab('prescriptions');
      setCommandFeedbackToast('✓ Navigated to Prescriptions (మందుల చీటీ)');
      speakConfirmation('Opening Prescriptions and Jan Aushadhi Formulary');
      return true;
    }

    // 4. Lab Reports Commands
    if (/report|reports|రిపోర్ట్|రిపోర్టులు|ల్యాబ్|lab|test|పరీక్షలు/i.test(text)) {
      onNavigateTab('reports');
      setCommandFeedbackToast('✓ Navigated to Diagnostic Reports (ల్యాబ్ రిపోర్టులు)');
      speakConfirmation('Opening Diagnostic Reports');
      return true;
    }

    // 5. Clinical Library / SNOMED Ontology Commands
    if (/library|clinical library|లైబ్రరీ|snomed|icd|ఆంటాలజీ|ontology/i.test(text)) {
      onNavigateTab('clinical_library');
      setCommandFeedbackToast('✓ Navigated to Clinical Vernacular Library (వైద్య లైబ్రరీ)');
      speakConfirmation('Opening Clinical Library');
      return true;
    }

    // 6. Settings Commands
    if (/settings|సెట్టింగ్స్|preferences|configure/i.test(text)) {
      onNavigateTab('settings');
      setCommandFeedbackToast('✓ Navigated to Settings (సెట్టింగ్స్)');
      speakConfirmation('Opening Settings');
      return true;
    }

    return false;
  }, [onNavigateTab, onSelectNextPatient, speakConfirmation]);

  useEffect(() => {
    if (!isVoiceNavActive) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      return;
    }

    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (!SpeechRecognition) {
      setCommandFeedbackToast('⚠️ Voice Commands unsupported in this browser.');
      setIsVoiceNavActive(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'te-IN'; // Multi-lingual recognition works for Telugu and mixed English

      recognition.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript;
        handleCommandMatch(transcript);
      };

      recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          console.warn('[VoiceNav] Recognition error:', event.error);
        }
      };

      recognition.onend = () => {
        // Auto-restart if active
        if (isVoiceNavActive) {
          try {
            recognition.start();
          } catch {}
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('[VoiceNav] Recognition start failed:', e);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [isVoiceNavActive, handleCommandMatch]);

  // Clear feedback toast after 4s
  useEffect(() => {
    if (commandFeedbackToast) {
      const timer = setTimeout(() => setCommandFeedbackToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [commandFeedbackToast]);

  const toggleVoiceNav = () => {
    setIsVoiceNavActive(prev => {
      const next = !prev;
      if (next) {
        speakConfirmation('Doctor voice navigation active. Say Next Patient, Prescriptions, or Queue.');
        setCommandFeedbackToast('🎙️ Hands-Free Doctor Voice Mode Active (Say: Next Patient / మందుల చీటీ / ఓపీడీ క్యూ)');
      } else {
        speakConfirmation('Voice navigation paused.');
      }
      return next;
    });
  };

  return {
    isVoiceNavActive,
    toggleVoiceNav,
    lastCommandHeard,
    commandFeedbackToast
  };
}

