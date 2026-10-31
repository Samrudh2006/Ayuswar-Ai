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

// 2. Generate Masterpiece HTML with Natural Proportions & Zero Awkward Whitespace
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AyuSwar AI — One-Page Solution Pitch</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
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
      max-width: 770px;
      height: 100%;
      max-height: 1085px;
      border: 1.5px solid #1a1a1a;
      padding: 18px 24px 14px 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #FFFFFF;
      margin: 0 auto;
    }
    .content-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Header */
    .header {
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 2px;
      min-height: 52px;
    }
    .header-logo {
      width: 52px;
      height: 52px;
      object-fit: contain;
      position: absolute;
      left: 2px;
      top: 50%;
      transform: translateY(-50%);
    }
    .header-text {
      width: 100%;
      text-align: center;
      padding: 0 56px;
    }
    .title {
      font-size: 21pt;
      font-weight: 700;
      letter-spacing: -0.2px;
      color: #05161c;
      line-height: 1.15;
      margin-bottom: 1px;
    }
    .subtitle {
      font-size: 9.3pt;
      font-style: italic;
      color: #2b3b42;
      line-height: 1.2;
      margin-bottom: 2px;
    }
    .pitch-meta {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 8pt;
      color: #444444;
      line-height: 1.2;
      margin-bottom: 1px;
    }
    .links {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 8.1pt;
      color: #111111;
      line-height: 1.2;
    }
    .links a {
      color: #0b3d4a;
      text-decoration: underline;
    }
    hr.divider {
      border: none;
      border-top: 1px solid #333333;
      margin: 4px 0 5px 0;
    }

    /* Central Hook */
    .quote-hook {
      text-align: center;
      font-style: italic;
      font-size: 10.2pt;
      color: #1a1a1a;
      line-height: 1.32;
      margin: 3px 0 5px 0;
    }

    /* Section Headings */
    .section-title {
      text-align: center;
      font-family: "Georgia", "Cambria", serif;
      font-size: 9.2pt;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #05161c;
      margin: 4px 0 2px 0;
    }

    p.lead-text {
      text-align: justify;
      color: #1a1a1a;
      font-size: 8.55pt;
      line-height: 1.32;
      margin-bottom: 2px;
    }

    /* 4-Step Pipeline Flowchart */
    .flowchart-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 4px 0;
      gap: 4px;
    }
    .flow-box {
      flex: 1;
      border: 1px solid #222222;
      padding: 6px 4px;
      text-align: center;
      background: #FFFFFF;
      min-height: 52px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .flow-box-title {
      font-size: 8.3pt;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #05161c;
      margin-bottom: 2px;
    }
    .flow-box-desc {
      font-size: 7.4pt;
      line-height: 1.2;
      color: #333333;
    }
    .flow-arrow {
      font-size: 8.5pt;
      color: #555555;
      padding: 0 1px;
    }

    /* 3-Column Workflow Cards */
    .workflow-cards-container {
      display: flex;
      justify-content: space-between;
      gap: 7px;
      margin: 4px 0 3px 0;
    }
    .workflow-card {
      flex: 1;
      border: 1px solid #222222;
      padding: 7px 8px;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 124px;
    }
    .workflow-card-title {
      font-size: 8.3pt;
      font-weight: 700;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      color: #05161c;
      margin-bottom: 3px;
      text-align: left;
    }
    .workflow-card-body {
      font-size: 7.7pt;
      line-height: 1.26;
      color: #1a1a1a;
      text-align: justify;
      flex: 1;
    }
    .workflow-card-footer {
      font-size: 7.15pt;
      font-style: italic;
      color: #444444;
      margin-top: 4px;
      text-align: left;
    }

    .plus-bar {
      text-align: center;
      font-size: 7.8pt;
      line-height: 1.27;
      color: #222222;
      margin: 3px 0 4px 0;
    }
    .plus-bar strong {
      color: #05161c;
    }

    /* Safety Box */
    .callout-box {
      border: 1px solid #333333;
      padding: 6px 10px;
      margin: 4px 0;
      background: #fafafa;
      font-size: 7.85pt;
      line-height: 1.28;
      text-align: justify;
    }
    .callout-box strong {
      color: #05161c;
    }

    /* Personal Note from Builder */
    .personal-note-box {
      border: 1px solid #0F4C5C;
      background: #F4FBFB;
      padding: 6px 10px;
      margin: 4px 0;
      font-size: 7.85pt;
      line-height: 1.28;
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
      gap: 6px;
      margin: 4px 0 2px 0;
    }
    .metric-cell {
      flex: 1;
      border: 1px solid #1a1a1a;
      background: #FFFFFF;
      padding: 6px 5px;
      text-align: center;
    }
    .metric-number {
      font-size: 9.2pt;
      font-weight: 700;
      color: #05161c;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin-bottom: 2px;
    }
    .metric-caption {
      font-size: 7.1pt;
      color: #444444;
      line-height: 1.2;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* Footer */
    .footer {
      margin-top: 3px;
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
      font-size: 7.8pt;
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
        padding: 16px 20px 12px 20px !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="content-body">
      <!-- Top Group -->
      <div>
        <!-- Header -->
        <div class="header">
          <img src="data:image/png;base64,${emblemBase64}" class="header-logo" alt="AyuSwar AI Emblem Logo" />
          <div class="header-text">
            <div class="title">AyuSwar AI</div>
            <div class="subtitle">Ayu (life) + Swar (voice) - a voice-first health assistant built for India</div>
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
      </div>

      <!-- Problem Section -->
      <div>
        <div class="section-title">THE PROBLEM · WHY I BUILT THIS</div>
        <p class="lead-text">
          In a busy outpatient clinic, every minute a doctor spends typing is a minute not spent listening. In rural Primary Health Centres (PHCs), 1 doctor serves over 2,500 patients daily; losing up to 42% of consultation time to EHR typing causes severe clinician fatigue. A prescription only helps if the patient can read and follow it, yet 68% of rural patients struggle with English slips and spend heavily on branded medicines. In an emergency, describing symptoms in a second language costs time nobody has.
        </p>
      </div>

      <!-- Flowchart Pipeline -->
      <div>
        <div class="section-title">HOW AYUSWAR WORKS</div>
        <div class="flowchart-container">
          <div class="flow-box">
            <div class="flow-box-title">LISTEN</div>
            <div class="flow-box-desc">Voice intake in Telugu, Hindi &amp; English</div>
          </div>
          <div class="flow-arrow">&gt;</div>
          <div class="flow-box">
            <div class="flow-box-title">UNDERSTAND</div>
            <div class="flow-box-desc">Speech mapped to clinical ICD-10 notes</div>
          </div>
          <div class="flow-arrow">&gt;</div>
          <div class="flow-box">
            <div class="flow-box-title">ASSIST</div>
            <div class="flow-box-desc">SOAP drafts, spoken Rx &amp; triage</div>
          </div>
          <div class="flow-arrow">&gt;</div>
          <div class="flow-box">
            <div class="flow-box-title">CONNECT</div>
            <div class="flow-box-desc">Hospital maps &amp; WhatsApp handover</div>
          </div>
        </div>
      </div>

      <!-- Three Workflows Cards -->
      <div>
        <div class="section-title">THREE WORKFLOWS, ONE ASSISTANT</div>
        <div class="workflow-cards-container">
          <!-- Card 1 -->
          <div class="workflow-card">
            <div>
              <div class="workflow-card-title">AMBIENT OPD SCRIBE</div>
              <div class="workflow-card-body">
                Transcribes consultations in regional Telugu dialects (Rayalaseema) using automated pitch DSP diarization. Suggests WHO ICD-10 &amp; SNOMED-CT codes for physician review. The system assists; it never decides.
              </div>
            </div>
            <div class="workflow-card-footer">
              Includes PMBJP generic substitution saving up to 86% on routine medication.
            </div>
          </div>

          <!-- Card 2 -->
          <div class="workflow-card">
            <div>
              <div class="workflow-card-title">SANJIVANI 108</div>
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
              <div class="workflow-card-title">ACOUSTIC VOICE LAB</div>
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
        <div class="section-title">HOW IT IS BUILT</div>
        <p class="lead-text">
          AyuSwar AI is a React + Vite progressive web app deployed on Vercel with a native-ready Capacitor layer. Provider calls route through a secure serverless gateway (/api/gnani/stt, /api/gnani/tts, /api/evon) that keeps API credentials strictly server-side, rate-limits requests, and fails closed when unconfigured - honestly falling back to browser speech engines instead of faking responses. The platform integrates Gnani.ai's sovereign Indic stack - Prisma speech-to-text, Timbre text-to-speech (Nalini @ 24kHz), and Evon for mapping colloquial Telugu idioms to structured ICD-10 concepts - alongside Groq-hosted LLMs. Maps utilize MapLibre with OpenStreetMap, and all 48kHz audio DSP analysis executes client-side on the user's device.
        </p>
      </div>

      <!-- Safety Box -->
      <div class="callout-box">
        <strong>Stated plainly:</strong> AyuSwar AI is a working prototype built on synthetic benchmark profiles and open government formularies - not a medical device, not clinically validated, not a diagnostic tool, and designed strictly to keep a certified doctor in the loop. Emergency workflows are labelled simulations; for a real emergency, India dials <strong>112</strong> or <strong>108</strong>.
      </div>

      <!-- Why This Fits Gnani -->
      <div>
        <div class="section-title">WHY THIS FITS GNANI</div>
        <p class="lead-text">
          India-first healthcare needs Indic-first voice - exactly the stack Gnani has spent years pioneering. AyuSwar shows what that stack makes possible end to end. Next on my roadmap: field evaluation with rural ASHA community health workers in Andhra Pradesh, real-time SIP telephony integration, and clinical validation of the acoustic pipeline before any real-world pilot.
        </p>
      </div>

      <!-- Personal Note from Builder -->
      <div class="personal-note-box">
        <strong>A personal note from the builder:</strong> Growing up in Andhra Pradesh and watching elders in my family struggle to understand English prescription slips at local clinics showed me that healthcare failure in rural India is rarely about medicine—it is about communication. When a patient takes the wrong dose because they cannot read the label, or spends ₹200 on branded tablets when a ₹30 Jan Aushadhi generic exists at the government counter, software has failed them. I built AyuSwar AI solo for this challenge because voice is the only interface that respects people who cannot read or type.
      </div>

      <!-- 4-Cell Engineering Metrics Strip -->
      <div class="metrics-strip">
        <div class="metric-cell">
          <div class="metric-number">86% Savings</div>
          <div class="metric-caption">PMBJP Jan Aushadhi Generic Substitution</div>
        </div>
        <div class="metric-cell">
          <div class="metric-number">48kHz DSP</div>
          <div class="metric-caption">WebAudio Client Wheeze Harmonics (380-450Hz)</div>
        </div>
        <div class="metric-cell">
          <div class="metric-number">74 / 74 Green</div>
          <div class="metric-caption">Zero-Mock Clinical Invariant Tests Passed</div>
        </div>
        <div class="metric-cell">
          <div class="metric-number">ABDM M3 Ready</div>
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
console.log('Saved perfected pitch.html and public/pitch.html cleanly.');

// 3. Launch Puppeteer, validate logo, render PDF and preview PNG
async function run() {
  const tempProfileDir = path.resolve(process.cwd(), '.puppeteer_pdf_profile');
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

    // Copy to Downloads
    const downloadsPdfPath = 'C:\\Users\\HP\\Downloads\\AyuSwar_AI_Solution_Pitch.pdf';
    fs.copyFileSync(localPdfPath, downloadsPdfPath);
    console.log(`✓ PDF Saved to Downloads: ${downloadsPdfPath}`);

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
