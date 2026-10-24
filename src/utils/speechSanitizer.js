/**
 * speechSanitizer.js
 * High-Quality Natural Speech Synthesis Sanitizer for AyuSwar & Sanjivani-108
 * 
 * Prevents SpeechSynthesis engines from pronouncing:
 * - "asterisk asterisk" (**bold**)
 * - "bullet point" (•)
 * - "hospital emoji", "warning sign emoji"
 * - Raw URLs, markdown headers, and XML tags
 * 
 * Expands clinical abbreviations and schedules for natural human pacing.
 */

export function cleanTextForSpeech(text) {
  if (!text || typeof text !== 'string') return '';

  let cleaned = text;

  // 1. Remove reasoning / XML / HTML tags (e.g., <reasoning>...</reasoning>, <think>...</think>)
  cleaned = cleaned.replace(/<(?:reasoning|think|thought)>[\s\S]*?<\/(?:reasoning|think|thought)>/gi, '');
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // 2. Remove markdown links [Label](url) -> Label, and raw URLs
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  cleaned = cleaned.replace(/https?:\/\/\S+/g, '');

  // 3. Remove markdown headers (### Header -> Header)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

  // 4. Remove bold & italics markers (**text** -> text, *text* -> text, __text__ -> text, _text_ -> text)
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');
  cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
  cleaned = cleaned.replace(/_([^_]+)_/g, '$1');

  // 5. Replace bullet points (•, *, -, + at line start or surrounded by spaces) with natural pauses
  cleaned = cleaned.replace(/^[\s]*[•\*\-\+]\s+/gm, '. ');
  cleaned = cleaned.replace(/\s+[•\*\-\+]\s+/g, '. ');

  // 6. Natural expansions for schedule dates, hours & clinical terms
  cleaned = cleaned.replace(/–|—/g, ' to '); // en-dash / em-dash in Monday – Saturday -> Monday to Saturday
  cleaned = cleaned.replace(/\b24x7\b/gi, '24 by 7');
  cleaned = cleaned.replace(/\b24\/7\b/gi, '24 by 7');
  cleaned = cleaned.replace(/\bCardio\b/gi, 'Cardiology');
  cleaned = cleaned.replace(/\bPulmo\b/gi, 'Pulmonology');
  cleaned = cleaned.replace(/\bEndo\b/gi, 'Endocrinology');
  cleaned = cleaned.replace(/\bPHC\b/gi, 'Primary Health Centre');
  cleaned = cleaned.replace(/\bOPD\b/gi, 'O P D');
  cleaned = cleaned.replace(/\bICU\b/gi, 'I C U');
  cleaned = cleaned.replace(/\bECG\b/gi, 'E C G');
  cleaned = cleaned.replace(/\bABDM\b/gi, 'A B D M');
  cleaned = cleaned.replace(/\bHFR\b/gi, 'Health Facility Registry');
  cleaned = cleaned.replace(/\bETA\b/gi, 'estimated arrival time');
  cleaned = cleaned.replace(/&/g, ' and ');
  cleaned = cleaned.replace(/±(\d+)\s*m\b/gi, 'within $1 metres');

  // 7. Strip ALL emojis (prevents TTS engines from speaking "hospital emoji", "cross mark", etc.)
  cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{200D}\u{FE0F}]/gu, '');

  // 8. Remove stray symbols that might be read out loud (*, `, ~, ^, #, |, <, >)
  cleaned = cleaned.replace(/[\*`~^#|<>]/g, '');

  // 9. Normalize multiple periods, colons and whitespace for natural cadence
  cleaned = cleaned.replace(/\.{2,}/g, '.');
  cleaned = cleaned.replace(/:\s*/g, ': ');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // 10. Ensure clean punctuation flow
  cleaned = cleaned.replace(/\s+([.,;:])/g, '$1');

  return cleaned;
}

/**
 * Finds the highest-quality human/natural voice available in the browser
 */
export function getBestVoice(voices = [], langCode = 'en-IN') {
  if (!voices || voices.length === 0) return null;

  const targetLang = (langCode || 'en-IN').toLowerCase();
  const prefix = targetLang.split('-')[0];

  const isMatch = (v) => v.lang.toLowerCase() === targetLang || v.lang.toLowerCase().startsWith(prefix);

  const matched = voices.filter(isMatch);
  if (matched.length === 0) {
    return voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices[0];
  }

  // 1. Natural / Neural / Online premium voices
  const premium = matched.find(v => 
    /natural|neural|google|microsoft|siri|heera|neerja|geeta|veena/i.test(v.name)
  );
  if (premium) return premium;

  // 2. Exact language match
  const exact = matched.find(v => v.lang.toLowerCase() === targetLang);
  if (exact) return exact;

  return matched[0];
}

/**
 * Cleanly synthesizes text with human-grade clinical pacing
 */
export function speakHumanized(text, options = {}) {
  const {
    lang = 'en-IN',
    rate = 0.94, // Calibrated slightly relaxed pace for high medical clarity
    pitch = 1.0,
    onStart,
    onEnd,
    onError
  } = options;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onError?.('SpeechSynthesis not supported');
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const clean = cleanTextForSpeech(text);
    if (!clean) {
      onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = rate;
    utterance.pitch = pitch;

    // Detect language if Telugu or Hindi script is present
    if (/[\u0C00-\u0C7F]/.test(clean)) {
      utterance.lang = 'te-IN';
    } else if (/[\u0900-\u097F]/.test(clean)) {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = lang;
    }

    const voices = window.speechSynthesis.getVoices();
    const voice = getBestVoice(voices, utterance.lang);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = (e) => {
      if (e?.error !== 'canceled' && e?.error !== 'interrupted') {
        onError?.(e);
      } else {
        onEnd?.();
      }
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    onError?.(err);
  }
}
