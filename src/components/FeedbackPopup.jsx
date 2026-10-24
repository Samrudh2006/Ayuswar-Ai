import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import './FeedbackPopup.css';

const DEFAULT_THRESHOLD_SECONDS = 240; // 4 minutes active time
const STORAGE_DONE_KEY = 'ayuswar_feedback_done';
const STORAGE_DISMISSED_KEY = 'ayuswar_feedback_dismissed';

const CHIPS_OPTIONS = [
  'Voice check',
  'Emergency triage',
  'Scan / OCR',
  'Benchmarks'
];

export default function FeedbackPopup({ customThresholdSeconds }) {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [overallStars, setOverallStars] = useState(null);
  const [voiceStars, setVoiceStars] = useState(null);
  const [easeStars, setEaseStars] = useState(null);
  const [designStars, setDesignStars] = useState(null);

  // Hover States for stars preview
  const [hoverOverall, setHoverOverall] = useState(0);
  const [hoverVoice, setHoverVoice] = useState(0);
  const [hoverEase, setHoverEase] = useState(0);
  const [hoverDesign, setHoverDesign] = useState(0);

  // Chips, textarea, name & honeypot
  const [selectedTags, setSelectedTags] = useState([]);
  const [improvement, setImprovement] = useState('');
  const [name, setName] = useState('');
  const [honeypot, setHoneypot] = useState('');

  // Active time tracking refs
  const activeSecondsRef = useRef(0);
  const isActiveRef = useRef(true);
  const hasTriggeredRef = useRef(false);
  const autoCloseTimerRef = useRef(null);

  const thresholdSeconds = customThresholdSeconds || 
    (typeof window !== 'undefined' && window.__AYUSWAR_FEEDBACK_THRESHOLD__) || 
    DEFAULT_THRESHOLD_SECONDS;

  // Track active time (pause on hidden/blur, resume on visible/focus)
  useEffect(() => {
    // If already completed or suppressed, skip timer entirely
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_DONE_KEY) || sessionStorage.getItem(STORAGE_DISMISSED_KEY)) {
      return;
    }

    const checkIsActive = () => {
      return !document.hidden && (typeof document.hasFocus === 'function' ? document.hasFocus() : true);
    };

    isActiveRef.current = checkIsActive();

    const handleVisibilityChange = () => {
      isActiveRef.current = checkIsActive();
    };

    const handleBlur = () => {
      isActiveRef.current = false;
    };

    const handleFocus = () => {
      isActiveRef.current = checkIsActive();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    const intervalId = setInterval(() => {
      if (hasTriggeredRef.current) {
        clearInterval(intervalId);
        return;
      }

      if (localStorage.getItem(STORAGE_DONE_KEY) || sessionStorage.getItem(STORAGE_DISMISSED_KEY)) {
        clearInterval(intervalId);
        return;
      }

      if (isActiveRef.current) {
        activeSecondsRef.current += 1;

        if (activeSecondsRef.current >= thresholdSeconds) {
          const currentPath = (window.location.pathname || '').toLowerCase();
          const isBlocked = currentPath.includes('/emergency') || currentPath.includes('/sanjivani');

          if (!isBlocked) {
            hasTriggeredRef.current = true;
            setIsOpen(true);
            clearInterval(intervalId);
          }
        }
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [thresholdSeconds]);

  // Check route change if activeSeconds reached threshold while on blocked route
  useEffect(() => {
    if (isOpen || hasTriggeredRef.current) return;
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_DONE_KEY) || sessionStorage.getItem(STORAGE_DISMISSED_KEY)) return;

    if (activeSecondsRef.current >= thresholdSeconds) {
      const currentPath = (location.pathname || '').toLowerCase();
      const isBlocked = currentPath.includes('/emergency') || currentPath.includes('/sanjivani');
      if (!isBlocked) {
        hasTriggeredRef.current = true;
        setIsOpen(true);
      }
    }
  }, [location.pathname, isOpen, thresholdSeconds]);

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Cleanup auto-close timer on unmount
  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_DONE_KEY, 'true');
    } catch {}

    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 220);
  };

  const handleChipToggle = (chip) => {
    setSelectedTags((prev) =>
      prev.includes(chip) ? prev.filter((t) => t !== chip) : [...prev, chip]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || overallStars === null) return;

    // Honeypot check: If filled, silently pretend success
    if (honeypot && honeypot.trim().length > 0) {
      try {
        localStorage.setItem(STORAGE_DONE_KEY, 'true');
      } catch {}
      setIsSubmitted(true);
      autoCloseTimerRef.current = setTimeout(() => {
        handleDismiss();
      }, 4000);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        overall_stars: overallStars,
        voice_stars: voiceStars,
        ease_stars: easeStars,
        design_stars: designStars,
        tags: selectedTags,
        improvement: improvement.trim() || null,
        name: name.trim() || null,
        page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
      };

      const { error } = await supabase.from('feedback').insert(payload);

      if (error) {
        throw error;
      }

      try {
        localStorage.setItem(STORAGE_DONE_KEY, 'true');
      } catch {}

      setIsSubmitted(true);
      autoCloseTimerRef.current = setTimeout(() => {
        handleDismiss();
      }, 4000);
    } catch (err) {
      console.warn('Feedback submission notice:', err?.message || err);
      setErrorMessage(err?.message || 'Unable to save feedback right now. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Star Rating Row Renderer
  const renderStarRow = (label, isRequired, currentValue, hoverValue, setValue, setHover) => {
    return (
      <div className="ayuswar-feedback-star-row">
        <span className="ayuswar-feedback-star-label">
          {label}
          {isRequired && <span className="ayuswar-feedback-required-dot" title="Required">*</span>}
        </span>
        <div 
          className="ayuswar-feedback-star-group"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((starNum) => {
            const isFilled = (hoverValue || currentValue || 0) >= starNum;
            return (
              <button
                key={starNum}
                type="button"
                className="ayuswar-feedback-star-btn"
                onClick={() => setValue(starNum)}
                onMouseEnter={() => setHover(starNum)}
                aria-label={`${label} - ${starNum} out of 5 stars`}
              >
                <svg
                  className={`ayuswar-feedback-star-svg ${isFilled ? 'filled' : 'empty'}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="ayuswar-feedback-scrim" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="ayuswar-feedback-title"
    >
      <div className={`ayuswar-feedback-card ${isClosing ? 'closing' : ''}`}>
        {/* 1. Zari-stripe accent bar across the top */}
        <div className="ayuswar-feedback-zari-bar" />

        {/* 2. Close X */}
        <button
          type="button"
          className="ayuswar-feedback-close-btn"
          onClick={handleDismiss}
          aria-label="Close feedback popup"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!isSubmitted ? (
          /* Form State */
          <div className="ayuswar-feedback-body">
            {/* 3. popup-header.png, ~90px wide, centered */}
            <img
              src="/illustrations/popup-header.png"
              alt="AyuSwar Deepam Heartbeat Emblem"
              className="ayuswar-feedback-header-img"
              width="86"
              height="58"
            />

            {/* 4. Title */}
            <h2 id="ayuswar-feedback-title" className="ayuswar-feedback-title">
              How was AyuSwar for you?
            </h2>

            {/* 5. Subtitle */}
            <p className="ayuswar-feedback-subtitle">
              30 seconds · shapes what we build next
            </p>

            <form onSubmit={handleSubmit}>
              {/* 6. Four Star Rows */}
              <div className="ayuswar-feedback-stars-container">
                {renderStarRow(
                  'Overall experience',
                  true,
                  overallStars,
                  hoverOverall,
                  setOverallStars,
                  setHoverOverall
                )}
                {renderStarRow(
                  'Voice understanding',
                  false,
                  voiceStars,
                  hoverVoice,
                  setVoiceStars,
                  setHoverVoice
                )}
                {renderStarRow(
                  'Ease of use',
                  false,
                  easeStars,
                  hoverEase,
                  setEaseStars,
                  setHoverEase
                )}
                {renderStarRow(
                  'Design & feel',
                  false,
                  designStars,
                  hoverDesign,
                  setDesignStars,
                  setHoverDesign
                )}
              </div>

              {/* 7. What did you try? Chips */}
              <div className="ayuswar-feedback-chips-section">
                <span className="ayuswar-feedback-section-label">
                  What did you try? <span style={{ fontWeight: 400, color: '#7A6F64' }}>(optional)</span>
                </span>
                <div className="ayuswar-feedback-chips-grid">
                  {CHIPS_OPTIONS.map((chip) => {
                    const isSelected = selectedTags.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        className={`ayuswar-feedback-chip ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleChipToggle(chip)}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 8. Textarea & 9. Name Input */}
              <div className="ayuswar-feedback-input-section">
                <label className="ayuswar-feedback-section-label" htmlFor="ayuswar-feedback-improvement">
                  What's the one thing we should improve or build next?
                </label>
                <div className="ayuswar-feedback-textarea-wrapper">
                  <textarea
                    id="ayuswar-feedback-improvement"
                    className="ayuswar-feedback-textarea"
                    placeholder="What worked, what felt off?"
                    maxLength={500}
                    value={improvement}
                    onChange={(e) => setImprovement(e.target.value)}
                  />
                  <span className="ayuswar-feedback-counter">
                    {improvement.length} / 500
                  </span>
                </div>

                <input
                  type="text"
                  className="ayuswar-feedback-name-input"
                  placeholder="Name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />

                {/* 10. Honeypot Input: visually hidden, off-screen */}
                <input
                  type="text"
                  name="website"
                  className="ayuswar-feedback-honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* 11. Submit Button */}
              <button
                type="submit"
                className="ayuswar-feedback-submit-btn"
                disabled={overallStars === null || isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Submit feedback'}
              </button>

              {/* Inline Error Message */}
              {errorMessage && (
                <div className="ayuswar-feedback-error-msg" role="alert">
                  {errorMessage}
                </div>
              )}

              {/* 12. Maybe Later Link */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  className="ayuswar-feedback-later-link"
                  onClick={handleDismiss}
                >
                  Maybe later
                </button>
              </div>

              {/* 13. Tiny Footer Caption */}
              <div className="ayuswar-feedback-footer-caption">
                BANARASI ZARI · AYUSWAR AI
              </div>
            </form>
          </div>
        ) : (
          /* Thank-You State */
          <div className="ayuswar-feedback-thankyou-body">
            {/* popup-thankyou.png, ~120px wide, centered */}
            <img
              src="/illustrations/popup-thankyou.png"
              alt="Thank you Diya Lotus Emblem"
              className="ayuswar-feedback-thankyou-img"
              width="118"
              height="118"
            />

            {/* Title */}
            <h2 className="ayuswar-feedback-thankyou-title">
              Thank you
            </h2>

            {/* Message */}
            <p className="ayuswar-feedback-thankyou-desc">
              Your feedback shapes the next build. Every star and note goes straight into what we fix first.
            </p>

            {/* Auto-close note */}
            <span className="ayuswar-feedback-thankyou-auto-close">
              This popup closes automatically
            </span>

            {/* Tiny Footer Caption */}
            <div className="ayuswar-feedback-footer-caption" style={{ marginTop: '16px' }}>
              BANARASI ZARI · AYUSWAR AI
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
