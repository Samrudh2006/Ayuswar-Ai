/**
 * AyuSwar AI — Server Triage Boundary API
 * POST /api/triage
 * 
 * Clinical Safety Guardrail Invariants:
 * 1. Rule-Based Urgency Floor: Evaluates conservative prototype rules synchronously.
 * 2. Asymmetric Escalation Only: Optional model advisory may ONLY RAISE urgency above
 *    the rules, NEVER LOWER it (e.g. Model cannot downgrade a rule-based RED to YELLOW/GREEN).
 * 3. Bounded Inputs & Strict Timeouts: Validates transcripts (max 2000 chars) and enforces
 *    a 4000ms timeout on model calls, instantly falling back to rules on timeout or error.
 * 4. Configurable Provider: Defaults to RULES_ONLY when server credentials are unset.
 * 5. Honest Status Reporting: Reports actual execution source (RULES_ONLY | RULES_PLUS_MODEL_ADVISORY | RULES_FALLBACK_ON_ERROR).
 * 6. Non-Diagnostic: No autonomous diagnosis or medication dosing. Not a certified medical device.
 */

import { validateUpstreamUrl, checkRateLimit, logSafeApiAccess, sanitizeClientError } from './_lib/security.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50kb'
    }
  }
};

const URGENCY_LEVELS = {
  GREEN: 1,
  YELLOW: 2,
  RED: 3
};

const LEVEL_NAMES = {
  1: 'GREEN',
  2: 'YELLOW',
  3: 'RED'
};

/**
 * Deterministic Prototype Safeguard Rules (Urgency Floor)
 */
export function evaluateRuleBasedTriage(transcript = '', acousticPanicIndex = 70) {
  const text = String(transcript).toLowerCase();

  const hasChestPain = /chest\s*pain|chest\s*discomfort|heart\s*pain|angina|pressure\s*in\s*chest|chhati\s*noppi|gundello\s*noppi|ఛాతీ\s*నొప్పి|గుండెల్లో\s*నొప్పి|ఛాతీలో\s*నొప్పి|గుండె\s*నొప్పి|గుండెలో\s*నొప్పి|ఛాతీ|గుండె|seena|chhati|heart/i.test(text);
  const hasSweating = /sweat|sweating|perspir|cold\s*sweat|diaphoresis|paseena|చెమట|చమట|చెమటలు|చమటలు|చల్లని\s*చెమటలు/i.test(text);
  const hasBreathless = /breath|breathless|breathlessness|shortness\s*of\s*breath|dyspnea|gasping|cant\s*breathe|can't\s*breathe|saans|oopiri|ఆయాసం|శ్వాస|ఊపిరి|దమ్ము|ఊపిరి\s*ఆడటం\s*లేదు/i.test(text);

  const isRedFlagCardiacOverride = (hasChestPain && (hasSweating || hasBreathless)) || (hasChestPain && hasSweating && hasBreathless);
  const isCardiac = isRedFlagCardiacOverride || /chhati|chest|seena|heart|gir pade|behosh|unconscious|dhadkan|palpitations|stemi|gundello|గుండె|ఛాతీ/i.test(text);
  const isPediatricRespiratory = /babu|bachha|child|baby|oopiri|saans|wheez|stridor|chhati lopalki|retraction|pasli chalna|blue lips|neela|ఆయాసం|శ్వాస|పిల్ల/i.test(text);
  const isTrauma = /accident|crash|lorry|car|bike|vandi|blood|khoon|raktham|fracture|haddi|trapped|sir phat|రక్తం|గాయం/i.test(text);
  const isAnaphylaxisOrStroke = /paralysis|bol nahi pa|face drop|slur|lakwa|soojan|throat choke|allerg|పక్షవాతం/i.test(text);

  // Severe Emergency RED Triggers
  if (isCardiac || isPediatricRespiratory || isTrauma || isAnaphylaxisOrStroke) {
    let suspectedCondition = 'Acute Emergency / Immediate Attention Needed';
    let icd10 = 'R68.89';
    let priorityProtocol = 'High-Acuity Priority ALS Protocol';

    if (isCardiac) {
      suspectedCondition = 'Acute Coronary Syndrome / Suspected STEMI & Cardiac Arrest';
      icd10 = 'I21.9 / I46.9';
      priorityProtocol = 'Adult Resuscitation & High-Acuity ALS Dispatch';
    } else if (isPediatricRespiratory) {
      suspectedCondition = 'Status Asthmaticus / Pediatric Stridor with Retraction';
      icd10 = 'J45.901 / J38.5';
      priorityProtocol = 'Pediatric ALS Ambulance with Nebulizer & High-Flow O2';
    } else if (isTrauma) {
      suspectedCondition = 'Highway Crash / Massive Arterial Bleeding / Suspected Spinal Injury';
      icd10 = 'T07 / R57.1';
      priorityProtocol = 'ALS Trauma Rescue with Cervical Collar & Tourniquet Kit';
    } else if (isAnaphylaxisOrStroke) {
      suspectedCondition = 'Acute Anaphylaxis / Cerebrovascular Event (Stroke)';
      icd10 = 'T78.2 / I63.9';
      priorityProtocol = 'Stroke / Allergic Airway Emergency Dispatch';
    }

    return {
      triageLevel: 'RED',
      urgencyRank: URGENCY_LEVELS.RED,
      severity: 'Immediate Life Threat (Category 1)',
      targetResponseSec: 8,
      suspectedCondition,
      icd10,
      priorityProtocol,
      triageMethod: 'DETERMINISTIC_SAFETY_RULE',
      isEmergencyOverride: true
    };
  }

  // Moderate / Yellow Triage
  const panicVal = Number(acousticPanicIndex) || 0;
  if (panicVal > 75) {
    return {
      triageLevel: 'RED',
      urgencyRank: URGENCY_LEVELS.RED,
      severity: 'Urgent High-Acoustic Distress',
      targetResponseSec: 15,
      suspectedCondition: 'Acute Physiological Distress (High Acoustic Panic Metric)',
      icd10: 'R68.89',
      priorityProtocol: 'Immediate Clinical On-Site Assessment',
      triageMethod: 'ACOUSTIC_DISTRESS_RULE',
      isEmergencyOverride: true
    };
  }

  // General Urgent / Yellow
  const isUrgent = /fever|temperature|pain|vomit|headache|weakness|dizzy|nausea|bukhar|dard|बुखार|दर्द|उल्टी|चक्कर|कमजोरी|सिरदर्द|बदन|జ్వరం|నొప్పి|వాంతులు|తలతిరుగు|నీరసం/i.test(text);
  if (isUrgent || panicVal > 45) {
    return {
      triageLevel: 'YELLOW',
      urgencyRank: URGENCY_LEVELS.YELLOW,
      severity: 'Moderate Priority Urgent Care',
      targetResponseSec: 25,
      suspectedCondition: 'Acute Medical Condition / Needs Prompt Clinical Review',
      icd10: 'R68.89',
      priorityProtocol: '108 Basic Life Support (BLS) Ambulance / Clinic OPD',
      triageMethod: 'DETERMINISTIC_SAFETY_RULE',
      isEmergencyOverride: false
    };
  }

  // Routine Green
  return {
    triageLevel: 'GREEN',
    urgencyRank: URGENCY_LEVELS.GREEN,
    severity: 'Routine / Non-Urgent Consultation',
    targetResponseSec: 60,
    suspectedCondition: 'Routine Outpatient Query / General Follow-up',
    icd10: 'Z00.0',
    priorityProtocol: 'Standard Outpatient Primary Health Center (PHC) Consultation',
    triageMethod: 'DETERMINISTIC_SAFETY_RULE',
    isEmergencyOverride: false
  };
}

/**
 * Optional Model Advisory Reasoner
 * Timeout strictly bounded to 4000ms.
 */
async function queryOptionalModelAdvisory(transcript, ruleBaseline) {
  const baseUrl = process.env.EVON_BASE_URL;
  const apiKey = process.env.EVON_API_KEY;
  const modelName = process.env.EVON_MODEL_NAME || 'gnani/gnani-evon-v3.3-30B-A3B';

  if (!apiKey || apiKey.includes('placeholder') || !baseUrl) {
    return { executed: false, reason: 'Model credentials unconfigured' };
  }

  const urlValidation = validateUpstreamUrl(baseUrl);
  if (!urlValidation.valid) {
    return { executed: false, reason: 'Invalid upstream URL' };
  }

  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const endpoint = `${cleanBaseUrl}/chat/completions`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  const prompt = `Patient Statement: "${transcript}"\nRule Urgency Floor: ${ruleBaseline.triageLevel}\nProvide non-diagnostic advisory triage analysis. Only recommend severity escalation if high risk is identified. Output format: URGENCY: [RED|YELLOW|GREEN] with brief explanation.`;

  try {
    const upstreamRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: 'You are an advisory clinical triage assistant. You cannot diagnose or prescribe doses. Never downgrade severity below rule floor.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.1
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!upstreamRes.ok) {
      return { executed: false, reason: `Upstream HTTP ${upstreamRes.status}` };
    }

    const data = await upstreamRes.json();
    const reply = data?.choices?.[0]?.message?.content || '';

    let suggestedRank = ruleBaseline.urgencyRank;
    if (/URGENCY:\s*RED/i.test(reply)) {
      suggestedRank = URGENCY_LEVELS.RED;
    } else if (/URGENCY:\s*YELLOW/i.test(reply)) {
      suggestedRank = URGENCY_LEVELS.YELLOW;
    } else if (/URGENCY:\s*GREEN/i.test(reply)) {
      suggestedRank = URGENCY_LEVELS.GREEN;
    }

    return {
      executed: true,
      suggestedRank,
      replyText: reply.slice(0, 300),
      modelName
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return { executed: false, reason: err.name === 'AbortError' ? 'Model timeout (>4s)' : 'Fetch error' };
  }
}

export default async function handler(req, res) {
  const startTime = Date.now();
  const route = '/api/triage';

  // 1. Method check
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    logSafeApiAccess({ route, method: req.method, status: 405, durationMs: Date.now() - startTime });
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Content-Type check
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('application/json')) {
    logSafeApiAccess({ route, method: req.method, status: 415, durationMs: Date.now() - startTime });
    return res.status(415).json({ error: 'Unsupported Media Type: application/json required' });
  }

  // 3. Rate limiting (30 triage assessments per minute)
  const rateLimitResult = checkRateLimit(req, 30);
  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', String(rateLimitResult.retryAfterSec));
    logSafeApiAccess({ route, method: req.method, status: 429, durationMs: Date.now() - startTime, clientNote: 'Triage rate limit' });
    return res.status(429).json({
      error: 'Triage assessment rate limit reached. For immediate emergencies dial 112 / 108.',
      retryAfterSec: rateLimitResult.retryAfterSec
    });
  }

  // 4. Input validation
  const { transcript, acousticPanicIndex = 70 } = req.body || {};
  if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
    logSafeApiAccess({ route, method: req.method, status: 400, durationMs: Date.now() - startTime });
    return res.status(400).json({ error: 'Invalid input: Non-empty transcript string is required.' });
  }

  const cleanTranscript = transcript.slice(0, 2000).trim();
  const cleanPanic = Math.min(Math.max(0, parseInt(acousticPanicIndex, 10) || 70), 100);

  // 5. Evaluate Rule-Based Baseline (Urgency Floor)
  const ruleResult = evaluateRuleBasedTriage(cleanTranscript, cleanPanic);

  // 6. Optional Model Advisory
  const modelAdvisory = await queryOptionalModelAdvisory(cleanTranscript, ruleResult);

  let finalRank = ruleResult.urgencyRank;
  let executionSource = 'RULES_ONLY';
  let modelEscalationApplied = false;

  if (modelAdvisory.executed) {
    // CRITICAL INVARIANT: Model output may ONLY raise urgency, NEVER lower it
    if (modelAdvisory.suggestedRank > ruleResult.urgencyRank) {
      finalRank = modelAdvisory.suggestedRank;
      modelEscalationApplied = true;
    }
    executionSource = 'RULES_PLUS_MODEL_ADVISORY';
  } else if (modelAdvisory.reason && modelAdvisory.reason !== 'Model credentials unconfigured') {
    executionSource = 'RULES_FALLBACK_ON_ERROR';
  }

  const finalLevel = LEVEL_NAMES[finalRank] || ruleResult.triageLevel;

  const responsePayload = {
    triageLevel: finalLevel,
    severity: finalLevel === 'RED' ? 'Immediate Life Threat (Category 1)' : (finalLevel === 'YELLOW' ? 'Moderate Priority Urgent Care' : 'Routine / Non-Urgent Consultation'),
    ruleBaselineLevel: ruleResult.triageLevel,
    modelEscalationApplied,
    suspectedCondition: ruleResult.suspectedCondition,
    icd10: ruleResult.icd10,
    priorityProtocol: ruleResult.priorityProtocol,
    executionSource,
    timestamp: new Date().toISOString(),
    prototypeDisclaimer: 'Prototype safety rules. Not a certified medical device. In life-threatening emergencies dial 112 / 108 immediately.'
  };

  logSafeApiAccess({ route, method: req.method, status: 200, durationMs: Date.now() - startTime });
  return res.status(200).json(responsePayload);
}
