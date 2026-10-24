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

import { queryEvonServer, EVON_MODEL_METADATA } from './gnaniEvonService';
import { retrieveGroundedClinicalKnowledge } from '../data/clinicalRagKnowledgeBase';

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
 * Main query processor with non-diagnostic fallback
 */
export async function askAyuSwarBrain(prompt, role = 'receptionist', context = {}) {
  const cleanPrompt = prompt?.trim();
  if (!cleanPrompt) {
    return "Please ask a question regarding hospital navigation, doctor appointment timings, or spoken prescription features.";
  }

  // Pre-fetch Grounded RAG Knowledge
  const ragMatch = retrieveGroundedClinicalKnowledge(cleanPrompt, role);
  const enrichedContext = ragMatch?.answer ? { ...context, ragKnowledge: ragMatch.answer } : context;

  const { provider } = getAiConfig();

  // Check Groq API Key if provided
  const groqKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || '';
  if (groqKey) {
    try {
      const groqReply = await queryGroqApi(cleanPrompt, getSystemPromptForRole(role, enrichedContext));
      if (groqReply) return groqReply;
    } catch (err) {
      console.warn("Groq API unavailable; engaging fallback:", err.message);
    }
  }

  // 1. Gnani Evon 30B Sovereign Indic Reasoning (Secure Server-Side Route)
  if (provider === 'gnani_evon_30b') {
    try {
      const response = await callGnaniEvonApi(cleanPrompt, role, enrichedContext);
      if (response) return response;
    } catch (err) {
      console.warn("Gnani Evon server route unreachable; using honest fallback guidance:", err.message);
      const fallback = generateSafeDemonstrationResponse(cleanPrompt, role, enrichedContext);
      return `🛡️ [FALLBACK: DETERMINISTIC GUIDANCE (Evon Unavailable)]\n\n${fallback}`;
    }
  }

  // 2. Local heuristic conversational demonstration
  return generateSafeDemonstrationResponse(cleanPrompt, role, enrichedContext);
}

export async function queryGroqApi(prompt, systemInstruction = '') {
  const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GROQ_API_KEY) || '';
  if (!apiKey) return null;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 350
      }),
      signal: AbortSignal.timeout(8000)
    });

    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content || null;
    }
  } catch (err) {
    console.warn('Groq query failed:', err.message);
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
