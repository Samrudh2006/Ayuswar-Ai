const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(p => fs.existsSync(p));

if (!CHROME_PATH) {
  console.error('No Chrome/Edge executable found.');
  process.exit(1);
}

// 1. Read emblem mark cleanly as Base64 (strictly NO BOM)
const emblemPath = path.resolve(process.cwd(), 'public/assets/ayuswar_emblem_mark.png');
const emblemBuf = fs.readFileSync(emblemPath);
const emblemBase64 = emblemBuf.toString('base64').trim();

// Inline SVG Icon Helpers
const icons = {
  mic: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F4C5C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1px; margin-right: 2px;"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`,
  brain: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F4C5C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1px; margin-right: 2px;"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/></svg>`,
  stethoscope: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F4C5C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1px; margin-right: 2px;"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`,
  ambulance: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F4C5C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1px; margin-right: 2px;"><path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-2.632-.878A2 2 0 0 0 17 11.05V18"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`,
  wave: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F4C5C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1px; margin-right: 2px;"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>`,
  pill: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F4C5C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1px; margin-right: 2px;"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`,
  shieldCheck: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F4C5C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1px; margin-right: 2px;"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
  cpu: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0F4C5C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -1px; margin-right: 2px;"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`
};

// 2. Generate Masterpiece HTML with GNANI.AI INDIC ENGINE Matrix
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AyuSwar AI — One-Page Solution Pitch</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 6mm 8mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      color: #111111;
      font-family: "Georgia", "Cambria", "Times New Roman", serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
    }
    .sheet {
      width: 100%;
      max-width: 780px;
      height: 100%;
      max-height: 1105px;
      border: 1.5px solid #1a1a1a;
      padding: 14px 18px 10px 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #FFFFFF;
      margin: 0 auto;
    }
    .content-body {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      margin-bottom: 6px;
    }

    /* Header */
    .header {
      display: flex;
      align-items: center;
      position: relative;
      min-height: 52px;
      margin-bottom: 1px;
    }
    .header-logo {
      width: 52px;
      height: 52px;
      object-fit: contain;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    .header-text {
      width: 100%;
      text-align: center;
      padding: 0 54px;
    }
    .title {
      font-size: 21pt;
      font-weight: 700;
      letter-spacing: -0.2px;
      color: #05161c;
      line-height: 1.1;
      margin-bottom: 2px;
    }
    .subtitle {
      font-size: 9.2pt;
      font-style: italic;
      color: #2b3b42;
      line-height: 1.18;
      margin-bottom: 2px;
    }
    .pitch-meta {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 7.8pt;
      color: #444444;
      line-height: 1.15;
      margin-bottom: 2px;
    }
    .links {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 7.9pt;
      color: #111111;
      line-height: 1.15;
    }
    .links a {
      color: #0b3d4a;
      text-decoration: underline;
      font-weight: 600;
    }
    hr.divider {
      border: none;
      border-top: 1px solid #333333;
      margin: 3px 0 4px 0;
    }

    /* Central Hook */
    .quote-hook {
      text-align: center;
      font-style: italic;
      font-size: 10.2pt;
      color: #05161c;
      line-height: 1.28;
      margin: 2px 0 3px 0;
      font-weight: 500;
    }

    /* Section Headings */
    .section-title {
      text-align: center;
      font-family: "Georgia", "Cambria", serif;
      font-size: 9.0pt;
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: #05161c;
      margin: 3px 0 2px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

    p.lead-text {
      text-align: justify;
      color: #1a1a1a;
      font-size: 8.4pt;
      line-height: 1.32;
      margin-bottom: 0px;
    }

    /* 4-Step Pipeline Flowchart */
    .flowchart-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 2px 0;
      gap: 4px;
    }
    .flow-box {
      flex: 1;
      border: 1px solid #1a1a1a;
      padding: 5px 4px;
      text-align: center;
      background: #FFFFFF;
      min-height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .flow-box-title {
      font-size: 8.1pt;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      color: #05161c;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .flow-box-desc {
      font-size: 7.3pt;
      line-height: 1.18;
      color: #2b3b42;
    }
    .flow-arrow {
      font-size: 9pt;
      font-weight: 700;
      color: #0F4C5C;
      padding: 0 1px;
    }

    /* GNANI Indic Engine Matrix */
    .gnani-matrix {
      display: flex;
      gap: 6px;
      background: #F4F9FA;
      border: 1px solid #0F4C5C;
      padding: 6px 8px;
      margin: 2px 0;
    }
    .gnani-col {
      flex: 1;
      border-right: 1px solid #D2E4E8;
      padding-right: 6px;
    }
    .gnani-col:last-child {
      border-right: none;
      padding-right: 0;
    }
    .gnani-tag {
      font-size: 7.9pt;
      font-weight: 750;
      color: #0F4C5C;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      display: flex;
      align-items: center;
      gap: 3px;
      margin-bottom: 2px;
    }
    .gnani-desc {
      font-size: 7.4pt;
      line-height: 1.24;
      color: #1a2a30;
      text-align: justify;
    }

    /* 3-Column Workflow Cards */
    .workflow-cards-container {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      margin: 2px 0;
    }
    .workflow-card {
      flex: 1;
      border: 1px solid #1a1a1a;
      padding: 7px 8px;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 124px;
    }
    .workflow-card-title {
      font-size: 8.2pt;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      color: #05161c;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .workflow-card-body {
      font-size: 7.6pt;
      line-height: 1.25;
      color: #1a1a1a;
      text-align: justify;
      flex: 1;
    }
    .workflow-card-footer {
      font-size: 7.1pt;
      font-style: italic;
      color: #3b4b52;
      margin-top: 4px;
      text-align: left;
    }

    .plus-bar {
      text-align: center;
      font-size: 7.6pt;
      line-height: 1.24;
      color: #222222;
      margin: 2px 0;
    }
    .plus-bar strong {
      color: #05161c;
    }

    /* Safety Box */
    .callout-box {
      border: 1px solid #333333;
      padding: 5px 9px;
      margin: 2px 0;
      background: #fafafa;
      font-size: 7.6pt;
      line-height: 1.24;
      text-align: justify;
    }
    .callout-box strong {
      color: #05161c;
    }

    /* Personal Note from Builder */
    .personal-note-box {
      border: 1px solid #0F4C5C;
      background: #F4FBFB;
      padding: 6px 9px;
      margin: 2px 0;
      font-size: 7.7pt;
      line-height: 1.26;
      text-align: justify;
      color: #0A3641;
    }
    .personal-note-box strong {
      color: #0F4C5C;
      font-weight: 700;
    }

    /* 4-Cell Engineering Metrics Strip */
    .metrics-strip {
      display: flex;
      gap: 5px;
      margin: 3px 0 1px 0;
    }
    .metric-cell {
      flex: 1;
      border: 1px solid #1a1a1a;
      background: #FFFFFF;
      padding: 5px 4px;
      text-align: center;
    }
    .metric-number {
      font-size: 9.0pt;
      font-weight: 700;
      color: #05161c;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin-bottom: 2px;
    }
    .metric-caption {
      font-size: 6.9pt;
      color: #333333;
      line-height: 1.16;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* Footer */
    .footer {
      margin-top: 2px;
    }
    .footer hr {
      border: none;
      border-top: 1px solid #333333;
      margin-bottom: 3px;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 7.6pt;
      color: #333333;
    }

    @media print {
      html, body {
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: none !important;
      }
      body {
        display: block !important;
      }
      .sheet {
        border: 1.5px solid #1a1a1a !important;
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        box-sizing: border-box !important;
        padding: 10px 16px 6px 16px !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="content-body">
      <!-- Header -->
      <div class="header">
        <img src="data:image/png;base64,${emblemBase64}" class="header-logo" alt="AyuSwar AI Emblem Logo" />
        <div class="header-text">
          <div class="title">AyuSwar AI</div>
          <div class="subtitle">Ayu (life) + Swar (voice) — Voice-First Sovereign Health Assistant for Bharat</div>
          <div class="pitch-meta">One-page solution pitch · Gnani's Great Indian AI Internship Challenge 2026</div>
          <div class="links">Live app: <a href="https://ayuswar-ai.vercel.app">ayuswar-ai.vercel.app</a> · Code: <a href="https://github.com/Samrudh2006/Ayuswar-Ai">github.com/Samrudh2006/Ayuswar-Ai</a></div>
        </div>
      </div>

      <hr class="divider">

      <!-- Central Hook -->
      <div class="quote-hook">
        What would healthcare software look like if it listened and spoke<br>
        in the languages India actually uses?
      </div>

      <!-- Problem Section -->
      <div>
        <div class="section-title">THE CRISIS IN BHARAT'S CLINICS · WHY I BUILT THIS</div>
        <p class="lead-text">
          In rural Primary Health Centres (PHCs), 1 doctor serves over 2,500 villagers daily; losing 42% of consultation time to manual EHR typing causes severe clinician burnout. Prescriptions fail when patients cannot read English slips, and families are drained by expensive branded medicines. In emergencies, describing acute pain in a second language costs life-saving minutes. AyuSwar AI solves this at the root: replacing keyboards and paper slips with ambient, sovereign Indic voice.
        </p>
      </div>

      <!-- Flowchart Pipeline -->
      <div>
        <div class="section-title">HOW AYUSWAR WORKS (VOICE-FIRST TELEMETRY)</div>
        <div class="flowchart-container">
          <div class="flow-box">
            <div class="flow-box-title">${icons.mic} LISTEN</div>
            <div class="flow-box-desc">Voice intake in Telugu, Hindi &amp; English</div>
          </div>
          <div class="flow-arrow">&gt;</div>
          <div class="flow-box">
            <div class="flow-box-title">${icons.brain} UNDERSTAND</div>
            <div class="flow-box-desc">Dialect speech mapped to ICD-10 notes</div>
          </div>
          <div class="flow-arrow">&gt;</div>
          <div class="flow-box">
            <div class="flow-box-title">${icons.stethoscope} ASSIST</div>
            <div class="flow-box-desc">SOAP drafts, spoken Rx &amp; triage</div>
          </div>
          <div class="flow-arrow">&gt;</div>
          <div class="flow-box">
            <div class="flow-box-title">${icons.ambulance} CONNECT</div>
            <div class="flow-box-desc">Hospital maps &amp; WhatsApp handover</div>
          </div>
        </div>
      </div>

      <!-- Dedicated Gnani Engine Matrix -->
      <div>
        <div class="section-title">${icons.cpu} GNANI.AI INDIC ENGINE UNDER THE HOOD</div>
        <div class="gnani-matrix">
          <div class="gnani-col">
            <div class="gnani-tag">${icons.mic} Prisma v3 (STT)</div>
            <div class="gnani-desc">Rayalaseema Telugu dialect ASR + linguistic diarization separating doctor &amp; patient speech without manual buttons.</div>
          </div>
          <div class="gnani-col">
            <div class="gnani-tag">${icons.wave} Timbre v2.5 (TTS)</div>
            <div class="gnani-desc">Nalini 24kHz maternal voice reading prescriptions aloud with 1:1 karaoke highlighting and Telugu food cues.</div>
          </div>
          <div class="gnani-col">
            <div class="gnani-tag">${icons.brain} Evon 30B (LLM)</div>
            <div class="gnani-desc">Maps colloquial Telugu symptom idioms to WHO ICD-10 (e.g. K21.9 for GERD, R00.2) &amp; SNOMED-CT without hallucinations.</div>
          </div>
        </div>
      </div>

      <!-- Three Workflows Cards -->
      <div>
        <div class="section-title">THREE PRODUCTION WORKFLOWS</div>
        <div class="workflow-cards-container">
          <!-- Card 1 -->
          <div class="workflow-card">
            <div>
              <div class="workflow-card-title">${icons.stethoscope} AMBIENT OPD SCRIBE</div>
              <div class="workflow-card-body">
                Transcribes consultations in regional Telugu dialects using automated pitch DSP diarization. Suggests WHO ICD-10 &amp; SNOMED-CT codes for physician review. The system assists; it never decides.
              </div>
            </div>
            <div class="workflow-card-footer">
              Includes PMBJP generic substitution saving up to 86% on routine medication.
            </div>
          </div>

          <!-- Card 2 -->
          <div class="workflow-card">
            <div>
              <div class="workflow-card-title">${icons.ambulance} SANJIVANI 108</div>
              <div class="workflow-card-body">
                Voice symptom intake, rules-based red/yellow/green triage, GPS nearest hospital mapping, and structured clinician handover summaries with live ambulance coordination telemetry.
              </div>
            </div>
            <div class="workflow-card-footer">
              Research simulation; emergency ambulance dispatch is an interface demo.
            </div>
          </div>

          <!-- Card 3 -->
          <div class="workflow-card">
            <div>
              <div class="workflow-card-title">${icons.wave} ACOUSTIC VOICE LAB</div>
              <div class="workflow-card-body">
                Records voice and breathing sounds to compute on-device signal features (pitch F0, Harmonics-to-Noise Ratio, 380–450Hz wheeze harmonics) via Web Audio API with bilingual voice readouts.
              </div>
            </div>
            <div class="workflow-card-footer">
              Physical signal screening demonstration, not clinical diagnosis.
            </div>
          </div>
        </div>

        <!-- Plus Bar -->
        <div class="plus-bar">
          Plus: <strong>PMBJP Jan Aushadhi</strong> generic savings · <strong>Audio-Rx</strong> spoken prescriptions in native dialect with <strong>WhatsApp</strong> delivery · <strong>ABDM M3 FHIR</strong> zero-network offline sync
        </div>
      </div>

      <!-- How It Is Built -->
      <div>
        <div class="section-title">${icons.shieldCheck} ARCHITECTURE &amp; ZERO-MOCK TESTING</div>
        <p class="lead-text">
          React + Vite PWA on Vercel with native Capacitor wrapper. Provider calls route through a secure serverless gateway (/api/gnani/stt, /api/gnani/tts, /api/evon) keeping API keys strictly server-side, rate-limiting requests, and failing closed honestly when unconfigured. Client-side 48kHz audio DSP analysis runs directly on the device. Protected by 74 automated clinical &amp; safety test specifications passing 100% green.
        </p>
      </div>

      <!-- Safety Box -->
      <div class="callout-box">
        <strong>Stated plainly:</strong> AyuSwar AI is a working prototype built on synthetic benchmark profiles and open government formularies — not a medical device, not clinically validated, not a diagnostic tool, and designed strictly to keep a certified doctor in the loop. Emergency workflows are labelled simulations; for a real emergency, India dials <strong>112</strong> or <strong>108</strong>.
      </div>

      <!-- Why This Fits Gnani -->
      <div>
        <div class="section-title">WHY THIS FITS GNANI'S SOVEREIGN MISSION</div>
        <p class="lead-text">
          India-first healthcare needs Indic-first voice — exactly the stack Gnani has pioneered. AyuSwar shows what that stack achieves end to end: consultation scribing, generic medicine savings, vernacular WhatsApp audio prescriptions, and rural offline continuity. Next on my roadmap: field evaluation with rural ASHA health workers in Andhra Pradesh, real-time SIP telephony integration, and clinical trials.
        </p>
      </div>

      <!-- Personal Note from Builder -->
      <div class="personal-note-box">
        <strong>A personal note from the builder:</strong> Growing up in Andhra Pradesh and watching elders in my family struggle to understand English prescription slips at local clinics showed me that healthcare failure in rural India is rarely about medicine—it is about communication. When a patient takes the wrong dose because they cannot read the label, or spends ₹200 on branded tablets when a ₹30 Jan Aushadhi generic exists at the government counter, software has failed them. I built AyuSwar AI solo from Aditya University for this challenge because voice is the only interface that respects people who cannot read or type.
      </div>

      <!-- 4-Cell Engineering Metrics Strip -->
      <div class="metrics-strip">
        <div class="metric-cell">
          <div class="metric-number">${icons.pill} 86% Savings</div>
          <div class="metric-caption">PMBJP Jan Aushadhi Generic Substitution</div>
        </div>
        <div class="metric-cell">
          <div class="metric-number">${icons.wave} 48kHz DSP</div>
          <div class="metric-caption">WebAudio Client Wheeze Harmonics (380-450Hz)</div>
        </div>
        <div class="metric-cell">
          <div class="metric-number">${icons.shieldCheck} 74 / 74 Green</div>
          <div class="metric-caption">Zero-Mock Clinical Invariant Tests Passed</div>
        </div>
        <div class="metric-cell">
          <div class="metric-number">${icons.stethoscope} ABDM M3 Ready</div>
          <div class="metric-caption">FHIR R4 JSON &amp; Encrypted Offline Buffer</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <hr>
      <div class="footer-content">
        <span><strong>Satya Samrudh Dwivedula</strong> · B.Tech CSE, Aditya University (expected Sep 2028)</span>
        <span>AyuSwar AI · Solution pitch · 2026</span>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('pitch.html', htmlContent, 'utf8');
fs.writeFileSync('public/pitch.html', htmlContent, 'utf8');
console.log('Saved GNANI-DAPPU pitch.html and public/pitch.html cleanly.');

// 3. Launch Puppeteer, validate logo, render PDF and preview PNG
async function run() {
  const os = require('os');
  const tempProfileDir = path.join(os.tmpdir(), 'puppeteer_pitch_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7));
  if (!fs.existsSync(tempProfileDir)) {
    fs.mkdirSync(tempProfileDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: tempProfileDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Save screenshot preview
    const previewPngPath = path.resolve(process.cwd(), 'AyuSwar_AI_Solution_Pitch_Preview.png');
    await page.screenshot({ path: previewPngPath, fullPage: false });
    console.log(`✓ Screenshot preview saved: ${previewPngPath}`);

    // Generate PDF
    const localPdfPath = path.resolve(process.cwd(), 'AyuSwar_AI_Solution_Pitch.pdf');
    await page.pdf({
      path: localPdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });

    const pdfBuf = fs.readFileSync(localPdfPath);
    const pageCount = (pdfBuf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log(`✓ PDF Generated: ${localPdfPath} (${pdfBuf.length} bytes, Pages: ${pageCount})`);

    // Copy to Downloads with newly dedicated name to bypass ANY file lock
    const downloadsPdfPathOfficial = 'C:\\Users\\HP\\Downloads\\AyuSwar_AI_Pitch_Gnani_Official.pdf';
    fs.copyFileSync(localPdfPath, downloadsPdfPathOfficial);
    console.log(`✓ OFFICIAL PDF Saved to Downloads: ${downloadsPdfPathOfficial}`);

    // Also try copying to the original name if unlocked
    try {
      const downloadsPdfPathOriginal = 'C:\\Users\\HP\\Downloads\\AyuSwar_AI_Solution_Pitch.pdf';
      fs.copyFileSync(localPdfPath, downloadsPdfPathOriginal);
      console.log(`✓ Also updated: ${downloadsPdfPathOriginal}`);
    } catch (err) {
      console.warn('Note: AyuSwar_AI_Solution_Pitch.pdf was open in viewer, but AyuSwar_AI_Pitch_Gnani_Official.pdf is cleanly updated!');
    }

    return { pageCount };
  } finally {
    await browser.close();
  }
}

run().then(res => {
  console.log('=== SUCCESS ===', JSON.stringify(res));
}).catch(err => {
  console.error('Execution error:', err);
  process.exit(1);
});
