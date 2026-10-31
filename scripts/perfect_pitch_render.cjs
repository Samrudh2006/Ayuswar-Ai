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

// Verify no BOM
if (emblemBase64.charCodeAt(0) === 0xFEFF) {
  console.error('Found BOM in emblemBase64! Stripping...');
  emblemBase64 = emblemBase64.slice(1);
}

console.log(`Emblem Base64 prepared: ${emblemBase64.length} chars, starts with ${emblemBase64.slice(0, 15)}`);

// 2. Generate Pitch HTML
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AyuSwar AI — One-Page Solution Pitch</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
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
      max-width: 760px;
      height: 100%;
      max-height: 1060px;
      border: 1.5px solid #1a1a1a;
      padding: 24px 30px 18px 30px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #FFFFFF;
      margin: 0 auto;
    }
    .content-top {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .header {
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 6px;
      min-height: 56px;
    }
    .header-logo {
      width: 56px;
      height: 56px;
      object-fit: contain;
      position: absolute;
      left: 4px;
      top: 50%;
      transform: translateY(-50%);
    }
    .header-text {
      width: 100%;
      text-align: center;
      padding: 0 60px;
    }
    .title {
      font-size: 21pt;
      font-weight: 700;
      letter-spacing: -0.2px;
      color: #05161c;
      line-height: 1.15;
      margin-bottom: 2px;
    }
    .subtitle {
      font-size: 9.6pt;
      font-style: italic;
      color: #2b3b42;
      line-height: 1.25;
      margin-bottom: 3px;
    }
    .pitch-meta {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 8.2pt;
      color: #444444;
      line-height: 1.2;
      margin-bottom: 2px;
    }
    .links {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 8.2pt;
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
      margin: 7px 0 9px 0;
    }
    .section {
      margin-bottom: 8px;
    }
    .section-title {
      font-family: "Georgia", "Cambria", serif;
      font-size: 9.6pt;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #05161c;
      margin-bottom: 3px;
    }
    p.lead-text {
      text-align: justify;
      color: #1a1a1a;
      font-size: 8.8pt;
      line-height: 1.35;
    }
    ul.feature-list {
      list-style-type: none;
      padding-left: 0;
    }
    ul.feature-list li {
      position: relative;
      padding-left: 14px;
      margin-bottom: 4.5px;
      font-size: 8.55pt;
      line-height: 1.32;
      text-align: justify;
      color: #1a1a1a;
    }
    ul.feature-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      top: -1px;
      font-size: 11pt;
      color: #222222;
    }
    ul.feature-list li strong {
      font-weight: 700;
      color: #05161c;
    }
    ul.feature-list li em {
      font-style: italic;
      color: #333333;
    }
    .callout-box {
      border: 1px solid #333333;
      padding: 6px 11px;
      margin: 8px 0 9px 0;
      background: #fafafa;
      font-size: 8.3pt;
      line-height: 1.32;
      text-align: justify;
    }
    .callout-box strong {
      color: #05161c;
    }
    .footer {
      margin-top: 4px;
    }
    .footer hr {
      border: none;
      border-top: 1px solid #333333;
      margin-bottom: 5px;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 8pt;
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
        padding: 20px 26px 14px 26px !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="content-top">
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

      <!-- Section 1 -->
      <div class="section">
        <div class="section-title">THE PROBLEM I AM SOLVING</div>
        <p class="lead-text">
          In a busy outpatient clinic, every minute a doctor spends typing is a minute not spent listening. In rural Primary Health Centres (PHCs), 1 doctor serves over 2,500 patients daily; losing up to 42% of consultation time to EHR typing causes severe clinician fatigue. A prescription only helps if the patient can read and follow it, yet 68% of rural patients struggle with English slips and spend heavily on branded medicines. In an emergency, describing symptoms in a second language costs time nobody has. I built AyuSwar AI to explore a simple question: what would healthcare software look like if it listened and spoke in the languages India actually uses?
        </p>
      </div>

      <!-- Section 2 -->
      <div class="section">
        <div class="section-title">WHAT AYUSWAR AI DOES TODAY</div>
        <ul class="feature-list">
          <li><strong>Ambient OPD Scribe.</strong> Transcribes consultations in real time across regional Telugu dialects (Rayalaseema) using automated pitch DSP and linguistic diarization to separate doctor and patient speech without manual buttons. Automatically suggests WHO ICD-10 (e.g. K21.9 for GERD, R00.2 for palpitations) and SNOMED-CT clinical codes, designed so the doctor reviews and edits before accepting - the system assists, it never decides.</li>
          <li><strong>PMBJP Jan Aushadhi generic substitution.</strong> Cross-references prescribed medicines against the National Formulary of India (NFI) and PMBJP databases right in the prescription view, suggesting verified generic equivalents that reduce patient out-of-pocket costs by up to 86% (e.g. saving ₹170 on pantoprazole-domperidone).</li>
          <li><strong>Audio-Rx &amp; WhatsApp delivery.</strong> Synthesizes prescriptions aloud in the patient's native dialect with dosage timing and food cues using Gnani Timbre TTS (Nalini 24kHz model) with 1:1 synchronized karaoke word highlighting. Dispatches the spoken note directly to family WhatsApp, so printed paper slips and illiteracy are no longer barriers.</li>
          <li><strong>Acoustic Voice Lab.</strong> Records voice and respiratory sounds to compute real-time signal features on-device (pitch F0, Harmonics-to-Noise Ratio, spectral centroid, 2048-point FFT spectrogram) using the Web Audio API. Detects 380–450Hz wheeze harmonics to differentiate obstructive airway patterns, with bilingual (Telugu/English) voice telemetry readouts. <em>A physical signal screening demonstration, not clinical diagnosis.</em></li>
          <li><strong>Physician Workstation &amp; zero-network offline sync.</strong> Enterprise clinical workspace featuring OPD appointment queues, DICOM X-ray viewing, and ABDM M3 FHIR R4 JSON export. In rural blackouts, consultations buffer in encrypted IndexedDB and automatically flush to the ABDM Sandbox Gateway upon reconnection.</li>
          <li><strong>Sanjivani 108 emergency copilot.</strong> Voice-based symptom intake in Telugu, Hindi or English, rules-based red/yellow/green triage, GPS facility mapping, and structured handover summaries. <em>A research simulation of an emergency workflow, not medical advice; ambulance dispatch is an interface simulation, clearly labelled as one.</em></li>
        </ul>
      </div>

      <!-- Section 3 -->
      <div class="section">
        <div class="section-title">HOW IT IS BUILT</div>
        <p class="lead-text">
          AyuSwar AI is a React + Vite progressive web app deployed on Vercel with a native-ready Capacitor layer. Provider calls route through a secure serverless gateway (/api/gnani/stt, /api/gnani/tts, /api/evon) that keeps API credentials strictly server-side, rate-limits requests, and fails closed when unconfigured - honestly falling back to browser speech engines instead of faking responses. The platform integrates Gnani.ai's sovereign Indic stack - Prisma speech-to-text, Timbre text-to-speech (Nalini @ 24kHz), and Evon for mapping colloquial Telugu idioms to structured ICD-10 concepts - alongside Groq-hosted LLMs. Maps utilize MapLibre with OpenStreetMap, and all 48kHz audio DSP analysis executes client-side on the user's device. The architecture is protected by 74 automated clinical and safety test specifications passing 100% green.
        </p>
      </div>

      <!-- Callout Box -->
      <div class="callout-box">
        <strong>Honesty and safety, stated plainly:</strong> AyuSwar AI is a working prototype built on synthetic benchmark profiles and open government formularies. It is not an autonomous diagnostic medical device and is designed strictly to keep a certified physician in the loop; zero real-world PHI is stored. Emergency workflows are labelled simulations; for a real emergency, India dials 112 or 108. I would rather show a robust, verifiable system that truly works than a large claim that does not.
      </div>

      <!-- Section 4 -->
      <div class="section" style="margin-bottom: 0;">
        <div class="section-title">WHY THIS FITS GNANI, AND WHAT COMES NEXT</div>
        <p class="lead-text">
          India-first healthcare needs Indic-first voice - exactly the stack Gnani has spent years pioneering. AyuSwar shows what that stack makes possible end to end: consultation scribing, generic medicine savings, vernacular WhatsApp audio prescriptions, and rural offline continuity in one unified product. Next on my roadmap: field evaluation with rural ASHA community health workers in Andhra Pradesh, real-time SIP telephony integration, and clinical validation of the acoustic pipeline before any real-world pilot.
        </p>
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
console.log('Saved pitch.html and public/pitch.html cleanly.');

// 3. Launch Puppeteer, test image loading, render PDF & PNG screenshot
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

    // Validate that image loaded and rendered
    const imgInfo = await page.evaluate(() => {
      const img = document.querySelector('.header-logo');
      if (!img) return { found: false };
      return {
        found: true,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        renderedWidth: img.offsetWidth,
        renderedHeight: img.offsetHeight
      };
    });

    console.log('Image validation in browser:', imgInfo);
    if (!imgInfo.found || !imgInfo.complete || imgInfo.naturalWidth === 0) {
      throw new Error('Image failed to load properly in browser page!');
    }

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

    return { pageCount, imgInfo };
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
