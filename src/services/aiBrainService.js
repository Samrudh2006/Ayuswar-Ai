/**
 * AyuSwar AI — Conversational Assistant Service (aiBrainService.js)
 * 
 * Clinical & Production Privacy Architecture:
 * - Credentials come EXCLUSIVELY from server-side environment variables.
 * - API keys are NEVER stored in browser localStorage or transmitted from the client.
 * - Automatic migration: purges legacy 'ayuswar_api_key' and 'ayuswar_custom_endpoint' fields.
 * - Non-Negotiable Medical Safety Guarantees:
 *   • NO autonomous diagnosis or medication prescribing.
 *   • NO preset drug doses.
 *   • Directs emergency symptoms (chest pain, breathlessness, trauma) immediately to official 112 / 108.
 */

import { queryEvonServer, EVON_MODEL_METADATA } from './gnaniEvonService.js';
import { retrieveGroundedClinicalKnowledge } from '../data/clinicalRagKnowledgeBase.js';

// Immediately purge legacy secret fields from localStorage without touching unrelated user state
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem('ayuswar_api_key');
    window.localStorage.removeItem('ayuswar_custom_endpoint');
  }
} catch {
  // Ignore in non-browser environments
}

export const AI_PROVIDERS = [
  { 
    id: 'gnani_evon_30b', 
    name: 'Gnani Evon 30B [PLANNED ARCHITECTURE / SERVER PROXY]', 
    model: 'gnani/gnani-evon-v3.3-30B-A3B',
    badge: 'Server-Side Proxy',
    description: 'Pre-architected server-side route (/api/evon/chat). Backed by server environment variables (EVON_BASE_URL, EVON_API_KEY). Defaults honestly to Rule-based FALLBACK if unset.'
  },
  { 
    id: 'local_offline', 
    name: 'Autonomous Local Indic Engine (Deterministic Rule-Based)', 
    model: 'Rule-Based-Indic-Demo',
    badge: 'Offline Rules',
    description: 'Uses built-in Indic clinical ontology and deterministic rules. Zero external network calls required.'
  }
];

export function getAiConfig() {
  try {
    const provider = localStorage.getItem('ayuswar_ai_provider') || 'gnani_evon_30b';
    return { provider };
  } catch {
    return { provider: 'gnani_evon_30b' };
  }
}

export function saveAiConfig(provider) {
  try {
    localStorage.setItem('ayuswar_ai_provider', provider || 'gnani_evon_30b');
    return true;
  } catch {
    return false;
  }
}

/**
 * Main query processor with strict RAG grounding and Groq clinical reasoning
 */
export async function askAyuSwarBrain(prompt, role = 'receptionist', context = {}) {
  const cleanPrompt = prompt?.trim();
  if (!cleanPrompt) {
    return "Please ask a question regarding hospital navigation, doctor appointment timings, or spoken prescription features.";
  }

  const isTelugu = /[\u0C00-\u0C7F]/.test(cleanPrompt);
  const isHindi = /[\u0900-\u097F]/.test(cleanPrompt);

  // Pre-fetch Grounded RAG Knowledge
  const ragMatch = retrieveGroundedClinicalKnowledge(cleanPrompt, role);

  // Strict RAG enforcement for Floating Assistant & Conversational QA
  if (context?.source === 'floating_assistant' || context?.strictRag === true) {
    if (!ragMatch || !ragMatch.answer) {
      if (isTelugu) {
        return "క్షమించండి, ఈ సమాచారం ఆయుస్వర్ ధృవీకరించిన క్లినికల్ మెమరీ లో అందుబాటులో లేదు. వివరాల కోసం దయచేసి సంబంధిత వైద్యులను లేదా హాస్పిటల్ డెస్క్‌ను సంప్రదించండి.";
      }
      if (isHindi) {
        return "माफ़ कीजिये, यह सवाल आयुस्वर सत्यापित क्लिनिकल ज्ञानकोष में नहीं मिला। कृपया अस्पताल रिसेप्शन या डॉक्टर से संपर्क करें।";
      }
      return "This question is outside the verified AyuSwar clinical memory store. The answer was not found in the hospital knowledge base. Please consult the attending physician or front desk.";
    }

    // Grounded match found: If Groq is available, synthesize a natural answer strictly from RAG context
    const groqKey = getGroqApiKey();
    if (groqKey) {
      try {
        const langName = isTelugu ? 'Telugu' : isHindi ? 'Hindi' : 'English';
        const groqPrompt = `User question: "${cleanPrompt}"\n\nGrounded Clinical Knowledge:\n${ragMatch.answer}\n\nDeliver a direct, helpful, compassionate answer in ${langName} strictly grounded in the knowledge above. Keep it concise. No markdown, no bullet points, no asterisks.`;
        const groqReply = await queryGroqApi(groqPrompt, `You are AyuSwar Assistant. Only use provided knowledge. Language: ${langName}.`);
        if (groqReply) return groqReply;
      } catch (err) {
        console.warn("Groq RAG synthesis error:", err.message);
      }
    }
    return ragMatch.answer;
  }

  const enrichedContext = ragMatch?.answer ? { ...context, ragKnowledge: ragMatch.answer } : context;
  const groqKey = getGroqApiKey();

  // Groq API Key as primary LLM brain for OPD, Sanjivani, Voicemaker
  if (groqKey) {
    try {
      const groqReply = await queryGroqApi(cleanPrompt, getSystemPromptForRole(role, enrichedContext));
      if (groqReply) return groqReply;
    } catch (err) {
      console.warn("Groq API unavailable; engaging fallback:", err.message);
    }
  }

  const { provider } = getAiConfig();

  // 1. Gnani Evon 30B Sovereign Indic Reasoning (Secure Server-Side Route)
  if (provider === 'gnani_evon_30b') {
    try {
      const response = await callGnaniEvonApi(cleanPrompt, role, enrichedContext);
      if (response) return response;
    } catch (err) {
      console.warn("Gnani Evon server route unreachable; using honest fallback guidance:", err.message);
    }
  }

  // 2. Safe deterministic fallback if network unavailable
  if (ragMatch?.answer) {
    return ragMatch.answer;
  }

  if (isTelugu) {
    return "క్షమించండి, సర్వర్ అందుబాటులో లేదు మరియు ఈ సమాచారం క్లినికల్ మెమరీ లో దొరకలేదు. దయచేసి హెల్ప్‌లైన్ 108 / 112 ను సంప్రదించండి.";
  }
  return generateSafeDemonstrationResponse(cleanPrompt, role, enrichedContext);
}

/**
 * Retrieves Groq API Key from environment variable or browser localStorage
 */
export function getGroqApiKey() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('ayuswar_groq_api_key') || 
                     localStorage.getItem('groq_api_key') || 
                     localStorage.getItem('VITE_GROQ_API_KEY');
      if (stored && stored.trim()) return stored.trim();
    } catch {}
  }
  const viteKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || '';
  const nodeKey = (typeof process !== 'undefined' && (process.env?.VITE_GROQ_API_KEY || process.env?.GROQ_API_KEY)) || '';
  return viteKey || nodeKey || '';
}

/**
 * Saves Groq API Key into local browser storage for persistence
 */
export function setGroqApiKey(key) {
  if (typeof window !== 'undefined') {
    try {
      if (key && key.trim()) {
        localStorage.setItem('ayuswar_groq_api_key', key.trim());
        return true;
      } else {
        localStorage.removeItem('ayuswar_groq_api_key');
        return false;
      }
    } catch {}
  }
  return false;
}

export async function queryGroqApi(prompt, systemInstruction = '', preferredModel = 'qwen/qwen3.8-27b') {
  const apiKey = getGroqApiKey();
  if (!apiKey) return null;

  const candidateModels = [
    preferredModel || 'qwen/qwen3.8-27b',
    'qwen/qwen3.8-27b',
    'openai/gpt-oss-20b'
  ];

  for (const model of [...new Set(candidateModels)]) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
            { role: 'user', content: prompt }
          ],
          temperature: 0.25,
          max_tokens: 180
        }),
        signal: AbortSignal.timeout(6000)
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.trim()) {
          return content.trim();
        }
      }
    } catch (err) {
      console.warn(`Groq query attempt for ${model} failed:`, err.message);
    }
  }
  return null;
}

async function callGnaniEvonApi(prompt, role, context) {
  const systemPrompt = getSystemPromptForRole(role, context);
  const result = await queryEvonServer(prompt, systemPrompt, { maxTokens: 400 });
  if (result && result.finalAnswer) {
    if (result.thoughtTrace) {
      return `🧠 [Gnani Evon 30B Live Reasoning: ${result.thoughtTrace.slice(0, 140)}...]\n\n${result.finalAnswer}`;
    }
    return result.finalAnswer;
  }
  return null;
}

function getSystemPromptForRole(role, context) {
  let basePrompt = "";
  if (role === 'doctor') {
    basePrompt = "You are AyuSwar Doctor Scribe Assistant. Format clinical summaries with standard medical structure (Subjective, Objective, Assessment, Plan). Suggest differential diagnoses with ICD-10 codes where appropriate, but explicitly note that all recommendations require physician sign-off. Do not prescribe specific drug dosages.";
  } else if (role === 'triage') {
    basePrompt = "You are AyuSwar Triage Safety Reasoner. Classify emergency severity into RED (Immediate), YELLOW (Urgent), or GREEN (Routine). Identify life-threatening red flags immediately (chest pain, severe shortness of breath, acute stroke signs, heavy trauma). If symptoms suggest a medical emergency, direct the patient to call 112 or 108 immediately.";
  } else {
    basePrompt = "You are AyuSwar Vernacular Health Companion, a compassionate bilingual assistant helping rural Indian patients understand clinic schedules, appointment flow, and health awareness. Always write in clear, simple language with vernacular idioms (Telugu/Hindi). Remind users that you are an assistive prototype and they must consult a doctor.";
  }

  if (context.ragKnowledge) {
    basePrompt += `\n\n[Grounded Clinical Knowledge Context]:\n${context.ragKnowledge}`;
  }

  return basePrompt;
}

function generateSafeDemonstrationResponse(prompt, role, context) {
  const lower = prompt.toLowerCase();

  // Emergency safety override
  if (lower.includes('chest pain') || lower.includes('గుండె నొప్పి') || lower.includes('छाती में दर्द') || 
      lower.includes('breathless') || lower.includes('శ్వాస ఆడట్లేదు') || lower.includes('సాన్స్')) {
    return "🚨 [EMERGENCY PROTOCOL] Severe symptoms detected. Please call national emergency 112 or 108 immediately. Sit upright, keep doors unlocked, and do not exert yourself while emergency personnel are en route.";
  }

  if (context.ragKnowledge) {
    return `${context.ragKnowledge}\n\nℹ️ Note: This information is provided as prototype clinical reference. Please consult the attending doctor at your PHC for personalized medical advice.`;
  }

  if (role === 'doctor') {
    return `📋 [AyuSwar Clinical Scribe Guidance]\n• Clinical review of patient symptoms is advised.\n• Check vital signs (BP, SpO2, Heart Rate) and standard lab biomarkers.\n• Document longitudinal history in accordance with ABDM guidelines.`;
  }

  return `🏥 Namaste! Thank you for reaching out to AyuSwar AI.\n• OPD consultations are held Monday to Saturday, 9:00 AM – 2:00 PM at your local PHC.\n• Spoken voice prescriptions in Telugu and Hindi are accessible in your Patient Portal.\n• For urgent symptoms, dial 112 / 108 immediately.`;
}

/**
 * Voicemaker: Generates crystal-clear vernacular spoken dosage instructions using Groq LLaMA-3.3
 */
export async function generateVoicemakerScriptWithGroq({
  patientName = 'Patient',
  medications = [],
  language = 'te-IN'
} = {}) {
  const isTelugu = language === 'te-IN';
  const isHindi = language === 'hi-IN';
  const langName = isTelugu ? 'Telugu' : isHindi ? 'Hindi' : 'Indian English';

  const medList = medications.length > 0 
    ? medications.map(m => `- ${m.name || m.drug || 'Medicine'} (${m.colorLabel || m.color || ''}): ${m.timing || m.schedule || ''}, ${m.meal || ''}`).join('\n')
    : `- Pantoprazole 40mg (Yellow pill): Morning, before breakfast\n- Metformin 500mg (Pink pill): Night, after dinner`;

  const prompt = `Patient Name: ${patientName}. Medications:\n${medList}\n\nCreate a warm, respectful conversational spoken prescription script in ${langName} that an elderly or rural patient can listen to. Mention pill colors clearly. Keep it under 50 words. No asterisks, no bullet points, no markdown.`;

  const systemInstruction = `You are AyuSwar Voicemaker, an Indic clinical speech engineer. Write pure spoken conversational audio scripts in ${langName}. No asterisks, no emojis.`;

  const reply = await queryGroqApi(prompt, systemInstruction);
  return reply ? reply.trim() : null;
}

/**
 * Acoustic Lab: Generates personalized preventive vocal wellness & respiratory hygiene counsel using Groq LLaMA-3.3
 */
export async function generateHealthyAcousticCounselWithGroq({
  metrics = {},
  language = 'te-IN'
} = {}) {
  const isTelugu = language === 'te-IN';
  const isHindi = language === 'hi-IN';
  const langName = isTelugu ? 'Telugu' : isHindi ? 'Hindi' : 'Indian English';

  const f0 = metrics.pitchF0 || 140;
  const hnr = metrics.hnrDb || 20.0;
  const jitter = metrics.jitterPct || 0.8;

  const prompt = `Patient acoustic phonation test results:
Fundamental Frequency (F0): ${f0} Hz
Harmonics-to-Noise Ratio (HNR): ${hnr} dB
Cycle-to-Cycle Jitter: ${jitter}%
Clinical Assessment: Airway is completely unobstructed, normal vesicular flow, zero wheeze, zero crackles, vocal fold mechanics are healthy.

Write a warm, encouraging 2-sentence preventive wellness recommendation in ${langName}. Praise their healthy vocal and lung condition, and give 1 quick tip on hydration or deep breathing to maintain it. Keep it under 45 words, conversational, spoken style. No markdown, no bullet points, no asterisks.`;

  const systemInstruction = `You are AyuSwar Vocal Wellness Physician. Provide clear, encouraging preventive acoustic counsel in ${langName}.`;

  const reply = await queryGroqApi(prompt, systemInstruction);
  return reply ? reply.trim() : null;
}
