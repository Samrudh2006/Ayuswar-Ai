/**
 * AyuSwar AI — Conversational Assistant Service (aiBrainService.js)
 * 
 * Non-Negotiable Medical Safety Guarantees:
 * - NO autonomous diagnosis or medication prescribing.
 * - NO preset drug doses (e.g. paracetamol, pantoprazole, antibiotics).
 * - Always reminds users that AI conversational drafts are not clinician-verified advice.
 * - In emergency situations (chest pain, severe breathlessness, trauma), directs users
 *   immediately to official emergency services (112 / 108).
 */

import { queryEvonServer, EVON_MODEL_METADATA } from './gnaniEvonService';
import { retrieveGroundedClinicalKnowledge } from '../data/clinicalRagKnowledgeBase';

export const AI_PROVIDERS = [
  { 
    id: 'gnani_evon_30b', 
    name: 'Gnani Evon 30B [PLANNED ARCHITECTURE / SERVER PROXY]', 
    model: 'gnani/gnani-evon-v3.3-30B-A3B',
    badge: 'Planned / Fallback Active',
    description: 'Pre-architected server-side route (/api/evon/chat). Awaiting deployed EVON_BASE_URL host; currently operates on deterministic Rule-based FALLBACK (Not Evon).'
  },
  { id: 'local_offline', name: 'Heuristic Rule-Based Demonstrator (Local Fallback)', model: 'Rule-Based-Indic-Demo' },
  { id: 'gemini_free', name: 'Google Gemini Free Tier (gemini-1.5-flash / 2.5-flash)', model: 'gemini-1.5-flash' },
  { id: 'groq_opensource', name: 'Groq Cloud (Open Source Qwen-27B / Llama 800t/s)', model: 'qwen/qwen3.8-27b' },
  { id: 'huggingface_biomistral', name: 'Hugging Face Inference (BioMistral-7B Medical)', model: 'BioMistral/BioMistral-7B' },
  { id: 'ollama_local', name: 'Local Ollama (http://localhost:11434 / MedLlama)', model: 'llama3:8b' }
];

export function getAiConfig() {
  try {
    const provider = localStorage.getItem('ayuswar_ai_provider') || 'gnani_evon_30b';
    const apiKey = localStorage.getItem('ayuswar_api_key') || '';
    const customEndpoint = localStorage.getItem('ayuswar_custom_endpoint') || '';
    return { provider, apiKey, customEndpoint };
  } catch {
    return { provider: 'gnani_evon_30b', apiKey: '', customEndpoint: '' };
  }
}

export function saveAiConfig(provider, apiKey, customEndpoint = '') {
  try {
    localStorage.setItem('ayuswar_ai_provider', provider);
    localStorage.setItem('ayuswar_api_key', apiKey.trim());
    localStorage.setItem('ayuswar_custom_endpoint', customEndpoint.trim());
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

  const { provider, apiKey } = getAiConfig();

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

  // 2. Other configured API providers if key is supplied
  if (apiKey && provider !== 'local_offline' && provider !== 'gnani_evon_30b') {
    try {
      if (provider === 'gemini_free') {
        const response = await callGeminiApi(cleanPrompt, apiKey, role, enrichedContext);
        if (response) return response;
      } else if (provider === 'groq_opensource') {
        const response = await callGroqApi(cleanPrompt, apiKey, role, enrichedContext);
        if (response) return response;
      } else if (provider === 'huggingface_biomistral') {
        const response = await callHuggingFaceApi(cleanPrompt, apiKey, role, enrichedContext);
        if (response) return response;
      }
    } catch (err) {
      console.warn("External API call encountered issue; using local demonstration response:", err);
    }
  }

  // Safe heuristic conversational demonstration
  return generateSafeDemonstrationResponse(cleanPrompt, role, enrichedContext);
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

async function callGeminiApi(prompt, apiKey, role, context) {
  const systemPrompt = getSystemPromptForRole(role, context);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nImportant: You are an assistive prototype. Do not prescribe specific drug doses or diagnose conditions autonomously. Always recommend clinician evaluation.\n\nUser Query: ${prompt}` }]
        }
      ],
      generationConfig: { temperature: 0.3, maxOutputTokens: 350 }
    })
  });

  if (!res.ok) throw new Error(`Gemini API returned status ${res.status}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text ? text.trim() : null;
}

async function callGroqApi(prompt, apiKey, role, context) {
  const systemPrompt = getSystemPromptForRole(role, context);
  const endpoint = 'https://api.groq.com/openai/v1/chat/completions';
  const modelsToTry = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b', 'llama-3.1-8b-instant'];

  for (const model of modelsToTry) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: `${systemPrompt}\nDo not provide autonomous prescriptions or unverified diagnoses.` },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 350
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (text) return text;
      }
    } catch {
      // Continue to next model fallback
    }
  }
  return null;
}

async function callHuggingFaceApi(prompt, apiKey, role, context) {
  const systemPrompt = getSystemPromptForRole(role, context);
  const endpoint = 'https://api-inference.huggingface.co/models/BioMistral/BioMistral-7B';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      inputs: `<s>[INST] <<SYS>>\n${systemPrompt}\n<</SYS>>\n\n${prompt} [/INST]`,
      parameters: { max_new_tokens: 300, temperature: 0.3 }
    })
  });

  if (!res.ok) throw new Error(`HuggingFace API returned status ${res.status}`);
  const data = await res.json();
  if (Array.isArray(data) && data[0]?.generated_text) {
    const text = data[0].generated_text;
    const split = text.split('[/INST]');
    return (split[1] || text).trim();
  }
  return null;
}

function getSystemPromptForRole(role, context) {
  let basePrompt = "";
  if (role === 'doctor') {
    basePrompt = "You are AyuSwar Clinical Knowledge Co-Pilot. Provide structured draft clinical notes adhering strictly to established medical terminology, ICD-10 crosswalks, and hospital knowledge. All draft notes require attending clinician review and physical signature. Do not invent unverified clinical assertions.";
  } else if (role === 'patient') {
    basePrompt = "You are AyuSwar Hospital Knowledge & Wellness Guide. Provide verified healthcare knowledge, clinic navigation, PMBJP Jan Aushadhi generic medicine savings facts, and healthy lifestyle information. Strictly DO NOT prescribe drug dosages or diagnose diseases autonomously. Direct users to consult treating physicians for medical care, and direct emergency symptoms immediately to 108 / 112.";
  } else {
    basePrompt = "You are AyuSwar Hospital Front Desk Knowledge Assistant. Guide citizens with OPD clinic navigation, registration token protocols, ABHA digital health account information, and general clinic questions in Telugu, Hindi, or English based strictly on hospital guidelines.";
  }

  if (context?.ragKnowledge) {
    basePrompt += `\n\n[VERIFIED HOSPITAL RAG KNOWLEDGE BASE]:\n${context.ragKnowledge}\nAnswer user queries accurately grounded in this verified knowledge snippet.`;
  }

  return basePrompt;
}

/**
 * Safe, Non-Diagnostic Local Heuristic Fallback
 */
function generateSafeDemonstrationResponse(q, role, context) {
  // 1. High-Precision Grounded RAG Knowledge Base Retrieval
  const ragMatch = retrieveGroundedClinicalKnowledge(q, role);
  if (ragMatch?.answer) {
    return ragMatch.answer;
  }

  const query = q.toLowerCase();

  // 1. EMERGENCY TRIAGE SAFETY GUARD
  if (
    query.includes('chest pain') || query.includes('గుండె నొప్పి') || query.includes('हार्ट अटैक') ||
    query.includes('choking') || query.includes('cannot breathe') || query.includes('శ్వాస ఆడట్లేదు') ||
    query.includes('blood in vomit') || query.includes('unconscious')
  ) {
    return "🚨 EMERGENCY MEDICAL NOTICE: Severe distress symptoms detected. Please immediately dial 112 or 108 Emergency Medical Services, or visit the nearest hospital emergency room. Do not rely on virtual assistant responses in acute life-threatening situations.";
  }

  // 2. RECEPTION & CLINIC NAVIGATION
  if (query.includes('token') || query.includes('టోకెన్') || query.includes('number') || query.includes('book') || query.includes('slot')) {
    return "🎟️ OPD Appointment Assistance: You can schedule and manage appointment tokens through the Doctor and Patient workspaces. For official hospital tokens, please consult the registration desk with your ABHA ID.";
  }

  if (query.includes('doctor') || query.includes('డాక్టర్') || query.includes('schedule') || query.includes('timing')) {
    return "👨‍⚕️ Attending Specialists (Sample Schedule):\n• General Medicine & Respiratory Clinic: 09:00 AM – 02:00 PM\n• Outpatient Consultations: Monday – Saturday\nPlease verify active duty timings with the clinic reception.";
  }

  if (query.includes('abha') || query.includes('digital card') || query.includes('ఆయుష్మాన్')) {
    return "💳 ABHA (Ayushman Bharat Health Account): An ABHA ID enables digital linkage of health records across accredited facilities. In this demo, sample ABHA formats are displayed for illustration purposes only.";
  }

  // 3. RESPIRATORY SYMPTOMS
  if (query.includes('cough') || query.includes('దగ్గు') || query.includes('खांसी') || query.includes('asthma') || query.includes('ఆయాసం') || query.includes('wheez')) {
    return "🫁 General Respiratory Care Guidance:\n• For persistent cough or breathlessness, keep warm and avoid cold irritants.\n• Do not start, stop, or change prescribed inhalers without medical evaluation.\n• If breathing difficulty worsens, seek immediate evaluation at a medical clinic.";
  }

  // 4. FEVER & BODYACHE
  if (query.includes('fever') || query.includes('జ్వరం') || query.includes('बुखार') || query.includes('temperature') || query.includes('headache')) {
    return "🌡️ Febrile Illness Supportive Care:\n• Stay well-hydrated with fluids, rest adequately, and monitor temperature.\n• Avoid unprescribed combination medications.\n• If fever exceeds 101°F or persists beyond 48–72 hours, consult a physician for clinical examination and lab tests.";
  }

  // 5. CARDIOMETABOLIC / BP / SUGAR
  if (query.includes('sugar') || query.includes('diabetes') || query.includes('షుగర్') || query.includes('bp') || query.includes('blood pressure') || query.includes('బీపీ')) {
    return "🩺 Cardiometabolic Care Information:\n• Routine monitoring of blood pressure and blood glucose helps maintain chronic health stability.\n• Continue taking doctor-prescribed medications as scheduled.\n• Dosage adjustments must only be made by your treating clinician.";
  }

  // 6. GENERAL MEDICINES & SPOKEN RX
  if (query.includes('medicine') || query.includes('tablet') || query.includes('pill') || query.includes('మందులు') || query.includes('దవా')) {
    return "💊 Medication Guidance:\n• Always review your official doctor's printed prescription slip for exact timing and dosage.\n• You can use the Vernacular Audio-Rx Studio to listen to doctor-entered instructions in Telugu, Hindi, or English.";
  }

  // VERNACULAR GREETINGS
  if (query.includes('telugu') || query.includes('తెలుగు') || query.includes('నమస్తే')) {
    return "నమస్తే! ఆయుస్వర్ సహాయక డెమోకు స్వాగతం. ఓపీడీ విభాగాలు, డాక్టర్ షెడ్యూల్స్ లేదా ప్రిస్క్రిప్షన్ ఆడియో గురించిన వివరాల కోసం అడగవచ్చు. (గమనిక: ఇది సహాయక డెమో మాత్రమే; వైద్య సలహా కోసం డాక్టర్‌ను సంప్రదించండి).";
  }

  if (query.includes('hindi') || query.includes('नमस्ते') || query.includes('हिंदी')) {
    return "नमस्ते! आयुस्वर वॉइस डेमो में आपका स्वागत है। आप ओपीडी समय, अस्पताल दिशा-निर्देश या बोलती पर्ची के बारे में पूछ सकते हैं। (चिकित्सा सलाह के लिए कृपया डॉक्टर से परामर्श लें)।";
  }

  // DEFAULT INFORMATIONAL RESPONSE
  return `Thank you for your inquiry: "${q}". AyuSwar is an open-source assistive voice demonstration. For personalized medical evaluation and prescription, please consult a qualified healthcare professional.`;
}
