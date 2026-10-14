import React, { useEffect, useState, useRef } from 'react';
import './AvatarAssistant.css';

export const AVATAR_LABELS = {
  idle: 'Ready',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking'
};

const SAMPLE_CAPTIONS = {
  'en-IN': {
    idle: 'How can I help you today?',
    listening: 'Listening... Please describe your symptoms or query.',
    thinking: 'Analyzing clinical guidance and reference notes...',
    speaking: 'Namaste! I am AyuSwar AI health assistant. How are you feeling today?'
  },
  'te-IN': {
    idle: 'ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?',
    listening: 'వింటున్నాను... దయచేసి మీ లక్షణాలను వివరించండి.',
    thinking: 'సమాచారాన్ని విశ్లేషిస్తున్నాను...',
    speaking: 'నమస్కారం! నేను ఆయుస్వర్ ఏఐ సహాయకురాలిని. మీకు ఎలా ఉంది?'
  },
  'hi-IN': {
    idle: 'आज मैं आपकी क्या सहायता कर सकती हूँ?',
    listening: 'सुन रही हूँ... कृपया अपने लक्षण बताएं।',
    thinking: 'जानकारी का विश्लेषण किया जा रहा है...',
    speaking: 'नमस्ते! मैं आयुस्वर एआई सहायक हूँ। आज आप कैसा महसूस कर रहे हैं?'
  }
};

/**
 * AvatarAssistant Component
 * High-fidelity 4-frame lifelike conversational assistant.
 * 
 * Features:
 * 1. 4 photorealistic frames (idle, listening, blink, speaking) from /avatar/*.png
 * 2. Natural organic eye blinking with 3 to 6 second random jitter (140ms duration)
 * 3. Audio / viseme reactive mouth opening/closing during speech
 * 4. Micro-movements, gentle breathing sway and crossfading
 * 5. Full compliance with prefers-reduced-motion
 * 6. Multilingual live captioning (English, Telugu, Hindi) and browser Web Speech TTS
 * 7. Prominent safety label: "AI assistant, not a doctor. Prototype demo."
 */
export default function AvatarAssistant({
  state: controlledState,
  caption: controlledCaption,
  assetBase = '/avatar',
  mouthOpen: controlledMouthOpen,
  showControls = false,
  language = 'en-IN',
  onStateChange,
  speakOnStateChange = false
}) {
  const [internalState, setInternalState] = useState('idle');
  const [currentLang, setCurrentLang] = useState(language);
  const [blink, setBlink] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);
  const [simulatedMouthOpen, setSimulatedMouthOpen] = useState(false);

  const activeState = controlledState !== undefined ? controlledState : internalState;
  const mode = Object.hasOwn(AVATAR_LABELS, activeState) ? activeState : 'idle';
  const base = assetBase.replace(/\/$/, '');

  // Active caption
  const langPack = SAMPLE_CAPTIONS[currentLang] || SAMPLE_CAPTIONS['en-IN'];
  const caption = controlledCaption !== undefined 
    ? controlledCaption 
    : (langPack[mode] || 'How can I help you today?');

  // Sync prop changes for language
  useEffect(() => {
    if (language) setCurrentLang(language);
  }, [language]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // Natural organic blinking (3.2s to 5.8s interval, 140ms close)
  useEffect(() => {
    setBlink(false);
    if (reduced || mode === 'speaking') return;
    let waitTimer = null;
    let closeTimer = null;
    let cancelled = false;

    const scheduleNextBlink = () => {
      // 3.2s + random 2.6s => 3.2s - 5.8s natural interval
      const delay = 3200 + Math.random() * 2600;
      waitTimer = window.setTimeout(() => {
        if (cancelled) return;
        setBlink(true);
        closeTimer = window.setTimeout(() => {
          setBlink(false);
          scheduleNextBlink();
        }, 140);
      }, delay);
    };

    scheduleNextBlink();

    return () => {
      cancelled = true;
      if (waitTimer) clearTimeout(waitTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [reduced, mode]);

  // Viseme / Mouth phoneme cadence when speaking
  useEffect(() => {
    if (mode !== 'speaking' || controlledMouthOpen !== undefined) {
      setSimulatedMouthOpen(false);
      return;
    }

    // Natural speech cadence simulation: syllable rhythm alternating mouth open & shut
    let isCancelled = false;
    let intervalId = null;

    const cycleMouth = () => {
      if (isCancelled) return;
      setSimulatedMouthOpen(prev => !prev);
      const nextDelay = 110 + Math.random() * 90; // 110ms - 200ms
      intervalId = setTimeout(cycleMouth, nextDelay);
    };

    cycleMouth();

    return () => {
      isCancelled = true;
      if (intervalId) clearTimeout(intervalId);
    };
  }, [mode, controlledMouthOpen]);

  // Determine active frame
  const effectiveMouthOpen = controlledMouthOpen !== undefined ? controlledMouthOpen : simulatedMouthOpen;

  const frame = reduced
    ? 'idle'
    : blink
    ? 'blink'
    : mode === 'listening'
    ? 'listening'
    : mode === 'speaking' && effectiveMouthOpen !== false
    ? 'speaking'
    : 'idle';

  // Handle state change from interactive buttons
  const handleSelectMode = (newMode) => {
    setInternalState(newMode);
    if (onStateChange) onStateChange(newMode);

    if (speakOnStateChange && newMode === 'speaking' && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const textToSpeak = langPack.speaking;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = currentLang;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="ayu-avatar-container">
      {/* Optional Top Interactive Toolbar (matches preview buttons) */}
      {showControls && (
        <div className="ayu-avatar__toolbar" role="toolbar" aria-label="Avatar state switcher">
          {Object.keys(AVATAR_LABELS).map((st) => (
            <button
              key={st}
              type="button"
              className={`ayu-avatar__btn ${mode === st ? 'is-selected' : ''}`}
              onClick={() => handleSelectMode(st)}
            >
              {st}
            </button>
          ))}
          <select
            className="ayu-avatar__lang-select"
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value)}
            aria-label="Caption language"
          >
            <option value="en-IN">EN</option>
            <option value="te-IN">TE (తెలుగు)</option>
            <option value="hi-IN">HI (हिन्दी)</option>
          </select>
        </div>
      )}

      {/* Core Presentation Figure */}
      <figure className="ayu-avatar" data-state={mode} data-reduced={reduced}>
        <div className="ayu-avatar__portrait" role="img" aria-label="Fictional AI assistant portrait">
          {!failed ? (
            ['idle', 'listening', 'blink', 'speaking'].map((name) => (
              <img
                key={name}
                src={`${base}/${name}.png`}
                alt=""
                aria-hidden="true"
                draggable="false"
                className={frame === name ? 'is-active' : ''}
                onError={() => setFailed(true)}
              />
            ))
          ) : (
            <span className="ayu-avatar__fallback">AI assistant</span>
          )}
        </div>
        <figcaption>
          <p className="ayu-avatar__identity">
            AyuSwar <span>AI assistant</span>
          </p>
          <p className="ayu-avatar__status" role="status">
            {AVATAR_LABELS[mode]}
          </p>
          {caption && (
            <p className="ayu-avatar__caption" dir="auto">
              {caption}
            </p>
          )}
          <p className="ayu-avatar__notice">
            AI-generated character. AI assistant, not a doctor. Prototype demo.
          </p>
        </figcaption>
      </figure>
    </div>
  );
}
