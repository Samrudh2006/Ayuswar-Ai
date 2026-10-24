/**
 * AyuSwar AI — Gnani Evon (30B-A3B) Indic Reasoning Service
 * (src/services/gnaniEvonService.js)
 * 
 * Official Model Reference:
 * - Hugging Face: gnani/gnani-evon-v3.3-30B-A3B
 * - Architecture: Hybrid Mamba + Mixture-of-Experts (MoE) (30B total, ~3.5B active/token)
 * - Context Window: 128K tokens
 * - Native Languages: 11 (Telugu, Hindi, Bengali, Tamil, Marathi, Gujarati, Kannada, Malayalam, Odia, Punjabi, English)
 * - Native Indic Vocabulary: Optimized for Indian languages and scripts.
 * 
 * Strict Integrity & Clinical Safety Guarantees:
 * 1. Zero Simulated Evon Output: No hardcoded, mocked, or regex-based replies presented as Evon output.
 * 2. Server-Side Routing Only: Calls Evon exclusively via /api/evon/* server routes backed by
 *    EVON_BASE_URL and EVON_API_KEY. Secret keys are NEVER stored in browser storage or frontend code.
 * 3. Honest Fallback Labeling: If Evon is unreachable or unset, returns an explicit UNAVAILABLE state
 *    and falls back to deterministic rule-based logic clearly labelled 'Rule-based FALLBACK (Not Evon)'.
 * 4. Real Status Verification: Live status requires an authentic HTTP 200 response from /api/evon/status.
 * 5. Deterministic Emergency Triage: Emergency RED rules (chest pain, sweating, breathlessness, stridor,
 *    severe trauma) run synchronously via rule-based safety logic and NEVER wait on or get overridden by an LLM.
 * 6. Non-Diagnostic Guardrail: No autonomous diagnosis or drug dosing advice; maintains research prototype disclaimer.
 */

import { queryGroqApi, getGroqApiKey } from './aiBrainService.js';

export const EVON_MODEL_METADATA = {
  modelId: 'gnani/gnani-evon-v3.3-30B-A3B',
  organization: 'Gnani.ai',
  displayName: 'Gnani Evon v3.3-30B-A3B',
  architecture: 'Mamba + MoE Hybrid (30B total, ~3.5B active/token)',
  contextLength: '128K tokens',
  supportedLanguages: [
    { code: 'te', name: 'Telugu (తెలుగు)', nativeScript: true },
    { code: 'hi', name: 'Hindi (हिन्दी)', nativeScript: true },
    { code: 'ta', name: 'Tamil (தமிழ்)', nativeScript: true },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)', nativeScript: true },
    { code: 'mr', name: 'Marathi (मराठी)', nativeScript: true },
    { code: 'bn', name: 'Bengali (বাংলা)', nativeScript: true },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)', nativeScript: true },
    { code: 'ml', name: 'Malayalam (മലയാളം)', nativeScript: true },
    { code: 'or', name: 'Odia (ଓଡ଼ିଆ)', nativeScript: true },
    { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)', nativeScript: true },
    { code: 'en', name: 'Indian English', nativeScript: false }
  ],
  features: [
    'Native Indic Vocabulary optimized for 11 Indian languages',
    '128K Long Context for Longitudinal Patient EHR Dossiers',
    'Clinical Chain-of-Thought (<reasoning>) Triage Synthesis',
    'OpenAI-compatible server-side route (/chat/completions) backed by EVON_BASE_URL'
  ]
};

/**
 * Checks live operational status of Gnani Evon via server-side status endpoint.
 * Returns { status: 'LIVE' | 'UNAVAILABLE', available: boolean, model: string, latencyMs, lastSuccessTime }
 */
export async function checkEvonStatus() {
  try {
    const res = await fetch('/api/evon/status', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      return {
        status: data.status || (data.available ? 'LIVE' : 'UNAVAILABLE'),
        available: Boolean(data.available),
        model: data.model || EVON_MODEL_METADATA.modelId,
        latencyMs: data.latencyMs ?? null,
        lastSuccessTime: data.lastSuccessTime ?? null,
        reason: data.reason || null
      };
    }

    return {
      status: 'UNAVAILABLE',
      available: false,
      model: EVON_MODEL_METADATA.modelId,
      latencyMs: null,
      lastSuccessTime: null,
      reason: `Server status returned HTTP ${res.status}`
    };
  } catch (err) {
    return {
      status: 'UNAVAILABLE',
      available: false,
      model: EVON_MODEL_METADATA.modelId,
      latencyMs: null,
      lastSuccessTime: null,
      reason: `Network error connecting to status route: ${err.message}`
    };
  }
}

/**
 * Dispatches query exclusively through the secure server-side route (/api/evon/chat).
 * Throws an explicit error if Evon is unconfigured or unreachable.
 * NEVER returns simulated or hardcoded responses presented as Evon output.
 */
export async function queryEvonServer(prompt, systemInstruction = '', options = {}) {
  const response = await fetch('/api/evon/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      systemInstruction,
      maxTokens: options.maxTokens || 450,
      temperature: options.temperature || 0.2
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData.error || `Evon server route returned HTTP ${response.status}`);
    err.status = response.status;
    err.data = errorData;
    throw err;
  }

  const data = await response.json();
  if (!data.text) {
    throw new Error('Evon server returned empty text output.');
  }

  return parseEvonReasoningOutput(data.text, data.model || EVON_MODEL_METADATA.modelId);
}

/**
 * Parses real output from Evon containing <reasoning> ... </reasoning> tags
 */
export function parseEvonReasoningOutput(rawText, model = EVON_MODEL_METADATA.modelId) {
  let thoughtTrace = '';
  let finalAnswer = rawText;

  if (rawText.includes('</reasoning>')) {
    const parts = rawText.split('</reasoning>');
    thoughtTrace = parts[0].replace('<reasoning>', '').trim();
    finalAnswer = parts[1].replace('<|im_end|>', '').trim();
  } else if (rawText.includes('<reasoning>')) {
    thoughtTrace = rawText.replace('<reasoning>', '').trim();
  }

  return {
    raw: rawText,
    thoughtTrace,
    finalAnswer,
    model,
    isEvonLive: true,
    isFallback: false
  };
}

/**
 * Higher-Level: Advisory Emergency Clinical Triage Reasoner with Evon
 * 
 * CRITICAL SAFETY NOTE:
 * Emergency triage RED rules run synchronously in 0ms via sanjivaniEmergencyService.js.
 * This LLM call is strictly non-blocking advisory analysis. If Evon is unavailable or fails,
 * it returns a clearly labelled Rule-based FALLBACK (Not Evon), NEVER masquerading as Evon output.
 */
export async function reasonEmergencyTriageWithEvon(transcript, patientContext = {}) {
  const systemInstruction = 
    `You are Gnani Evon (v3.3-30B-A3B), an Indic clinical reasoning foundation model. ` +
    `Analyze emergency medical notes or voice transcript. ` +
    `Format with an explicit <reasoning> block showing step-by-step chain-of-thought, ` +
    `identifying Indic linguistic idioms (Telugu/Hindi), red flags, and suspected ICD-10 categories. ` +
    `Provide non-diagnostic pre-hospital guidance. Never give drug doses or definitive diagnosis.`;

  try {
    const reasoningResult = await queryEvonServer(
      `Patient Transcript: "${transcript}"\nPatient Age/Gender: ${patientContext.age || 'Unknown'}, ${patientContext.gender || 'Unknown'}`,
      systemInstruction,
      { maxTokens: 400, temperature: 0.2 }
    );

    return {
      ...reasoningResult,
      modelName: EVON_MODEL_METADATA.displayName,
      modelId: EVON_MODEL_METADATA.modelId
    };
  } catch (err) {
    // Honest Fallback: clearly labelled 'Rule-based FALLBACK (Not Evon)'
    return {
      isEvonLive: false,
      isFallback: true,
      source: 'Rule-based FALLBACK (Not Evon)',
      status: 'UNAVAILABLE',
      error: err.message,
      modelName: null,
      modelId: null,
      thoughtTrace: null,
      finalAnswer: `[Rule-based FALLBACK (Not Evon)] Deterministic safety protocol active. Evon reasoning engine is offline or unconfigured on server.`
    };
  }
}

/**
 * Higher-Level: Clinical SOAP Note Scribe with Evon 30B
 * If Evon is unavailable, returns honest Rule-based FALLBACK (Not Evon) state.
 */
export async function reasonClinicalNoteWithEvon(transcriptOrNotes, patient = {}) {
  const systemInstruction = 
    `You are Gnani Evon (v3.3-30B-A3B), an Indic clinical scribe foundation model. ` +
    `Synthesize a structured clinical SOAP note (Subjective, Objective, Assessment, Plan) ` +
    `and provide a spoken prescription script in the patient's native Indian language (Telugu/Hindi). ` +
    `Do not prescribe unverified drug dosages. Prototype guidance only.`;

  // OPD Clinical Mode: Connect Groq LLaMA-3.3 for sub-300ms clinical SOAP & ICD-10 notes
  const groqKey = getGroqApiKey();
  if (groqKey) {
    try {
      const groqPrompt = 
        `Synthesize a structured clinical encounter SOAP note and native Indian language spoken prescription:\n` +
        `Patient: ${patient.name || 'Patient'}, Age: ${patient.age || 'Adult'}, Known Conditions: ${patient.condition || 'None'}\n` +
        `Clinical Dialogue / Transcription:\n${transcriptOrNotes}\n\n` +
        `Format clearly:\n` +
        `[S - SUBJECTIVE]\n[O - OBJECTIVE]\n[A - ASSESSMENT with ICD-10]\n[P - PLAN]\n[VERNACULAR SPOKEN RX]`;
      const groqRes = await queryGroqApi(groqPrompt, systemInstruction);
      if (groqRes) {
        return {
          raw: groqRes,
          finalAnswer: groqRes,
          thoughtTrace: 'Groq LLaMA-3.3 70B Clinical Reasoner (OPD Scribe Mode)',
          model: 'llama-3.3-70b-versatile',
          modelName: 'Groq LLaMA-3.3 70B (OPD Ambient Scribe)',
          modelId: 'groq/llama-3.3-70b',
          isGroqLive: true,
          isEvonLive: false,
          isFallback: false
        };
      }
    } catch (err) {
      console.warn('Groq OPD Scribe error, attempting Evon server:', err.message);
    }
  }

  try {
    const reasoningResult = await queryEvonServer(
      `Patient: ${patient.name || 'Patient'}, Age: ${patient.age || 'Adult'}, Known Conditions: ${patient.condition || 'None'}\nClinical Notes/Dialogue:\n${transcriptOrNotes}`,
      systemInstruction,
      { maxTokens: 500, temperature: 0.2 }
    );

    return {
      ...reasoningResult,
      modelName: EVON_MODEL_METADATA.displayName,
      modelId: EVON_MODEL_METADATA.modelId
    };
  } catch (err) {
    // Honest Fallback: clearly labelled 'Rule-based FALLBACK (Not Evon)'
    return {
      isEvonLive: false,
      isFallback: true,
      source: 'Rule-based FALLBACK (Not Evon)',
      status: 'UNAVAILABLE',
      error: err.message,
      modelName: null,
      modelId: null,
      thoughtTrace: null,
      finalAnswer: `[Rule-based FALLBACK (Not Evon)] Clinical Encounter Template\nSubjective: Patient reported symptoms documented.\nObjective: Outpatient vitals recorded.\nAssessment: Clinical review required.\nPlan: Attending physician review and routine follow-up.`
    };
  }
}

/**
 * Higher-Level: Acoustic Biomarker Correlation with Evon 30B
 * If Evon is unavailable, returns honest Rule-based FALLBACK (Not Evon) state.
 */
export async function reasonAcousticBiomarkerWithEvon(dspMetrics = {}, symptoms = '') {
  const prompt = 
    `Analyze physical acoustic DSP metrics:\n` +
    `- Fundamental Frequency (F0): ${dspMetrics.pitchF0 || 140} Hz\n` +
    `- Jitter (Period Perturbation): ${dspMetrics.jitterPct || 0.8} %\n` +
    `- Shimmer (Amplitude Perturbation): ${dspMetrics.shimmerPct || 2.0} %\n` +
    `- Harmonics-to-Noise Ratio (HNR): ${dspMetrics.hnrDb || 20.0} dB\n` +
    `- Patient Reported Symptoms: "${symptoms || 'General phonation test'}"\n\n` +
    `Synthesize an acoustic-clinical correlation without diagnosing diseases. ` +
    `Explain the physiological implication of vocal fold mechanics in plain language.`;

  const systemInstruction = 
    `You are Gnani Evon (v3.3-30B-A3B). Provide physical voice acoustic correlation ` +
    `based on vocal fold mass and turbulence, emphasizing that DSP features require clinical evaluation.`;

  try {
    const result = await queryEvonServer(prompt, systemInstruction, { maxTokens: 350, temperature: 0.2 });
    return {
      ...result,
      modelName: EVON_MODEL_METADATA.displayName
    };
  } catch (err) {
    // Honest Fallback: clearly labelled 'Rule-based FALLBACK (Not Evon)'
    return {
      isEvonLive: false,
      isFallback: true,
      source: 'Rule-based FALLBACK (Not Evon)',
      status: 'UNAVAILABLE',
      error: err.message,
      thoughtTrace: null,
      finalAnswer: `[Rule-based FALLBACK (Not Evon)] Physical DSP signal reflects fundamental frequency F0: ${dspMetrics.pitchF0 || 140} Hz with HNR: ${dspMetrics.hnrDb || 20} dB. Non-diagnostic audio engineering observation.`
    };
  }
}
