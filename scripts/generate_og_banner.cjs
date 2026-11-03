const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(p => fs.existsSync(p));

if (!CHROME_PATH) {
  console.error('Error: No Chrome or Edge executable found.');
  process.exit(1);
}

async function generateOgBanner() {
  const tempProfile = path.resolve(process.cwd(), '.puppeteer_og_profile_' + Date.now());
  if (!fs.existsSync(tempProfile)) fs.mkdirSync(tempProfile, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    userDataDir: tempProfile,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1200,630'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });

  const logoPath = path.resolve('public/assets/ayuswar_official_logo.png');
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@700;800;900&family=IBM+Plex+Sans:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #08232C 0%, #0F4C5C 60%, #176579 100%);
      font-family: 'IBM Plex Sans', -apple-system, sans-serif;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      padding: 50px 65px;
      position: relative;
      overflow: hidden;
      border: 3px solid #D4AF37;
    }
    .left-col {
      width: 380px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justifyContent: center;
      position: relative;
      z-index: 2;
    }
    .logo-frame {
      width: 280px;
      height: 280px;
      border-radius: 28px;
      background: #FFFFFF;
      padding: 16px;
      display: flex;
      align-items: center;
      justifyContent: center;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), 0 0 0 2px #D4AF37;
    }
    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .right-col {
      flex: 1;
      padding-left: 55px;
      display: flex;
      flex-direction: column;
      justifyContent: center;
      position: relative;
      z-index: 2;
    }
    .challenge-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(212, 175, 55, 0.15);
      border: 1.5px solid #D4AF37;
      color: #D4AF37;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 16px;
      width: fit-content;
    }
    h1 {
      font-family: 'Albert Sans', sans-serif;
      font-size: 50px;
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
      color: #FFFFFF;
    }
    h1 span.indic {
      color: #D4AF37;
      font-weight: 800;
      font-size: 44px;
      margin-left: 10px;
    }
    .subhead {
      font-size: 20px;
      line-height: 1.35;
      color: #D8EBEF;
      font-weight: 600;
      margin-bottom: 22px;
      max-width: 660px;
    }
    .pills-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 24px;
    }
    .pill {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 12.5px;
      font-weight: 600;
      color: #F8FAFC;
    }
    .pill.gold {
      background: rgba(212, 175, 55, 0.2);
      border-color: #D4AF37;
      color: #FDE047;
    }
    .footer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.18);
      padding-top: 14px;
      font-size: 13.5px;
      color: #94A3B8;
      font-weight: 600;
    }
    .url {
      color: #38BDF8;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .watermark {
      position: absolute;
      right: -30px;
      bottom: -50px;
      font-family: 'Albert Sans', sans-serif;
      font-size: 230px;
      font-weight: 900;
      color: rgba(255, 255, 255, 0.03);
      line-height: 1;
      pointer-events: none;
      z-index: 1;
    }
  </style>
</head>
<body>
  <div class="watermark">AI</div>
  <div class="left-col">
    <div class="logo-frame">
      <img class="logo-img" src="data:image/png;base64,${logoBase64}" alt="AyuSwar AI Official Emblem" />
    </div>
    <div style="margin-top: 14px; font-size: 13px; color: #D4AF37; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
      Deepam Heartbeat Mark
    </div>
  </div>

  <div class="right-col">
    <div class="challenge-badge">
      Gnani.ai Great Indian AI Challenge 2026
    </div>
    <h1>AyuSwar AI <span class="indic">(ఆయుస్వర)</span></h1>
    <div class="subhead">
      Sovereign Indic Ambient Clinical Voice Scribe, Acoustic Biomarker Phenotyping & 108 Emergency Dispatch
    </div>
    <div class="pills-row">
      <div class="pill gold">Gnani Prisma v3 STT</div>
      <div class="pill gold">Gnani Evon 30B Reasoner</div>
      <div class="pill gold">Gnani Timbre TTS</div>
      <div class="pill">ABDM M3 FHIR JSON</div>
      <div class="pill">48kHz Acoustic AI</div>
      <div class="pill">Jan Aushadhi 86% Savings</div>
    </div>
    <div class="footer-bar">
      <div>Live Production: <span class="url">https://ayuswar-ai.vercel.app</span></div>
      <div style="color: #34D399;">✓ 74/74 Test Specs Verified</div>
    </div>
  </div>
</body>
</html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });

  const outputPathPng = path.resolve('public/assets/ayuswar_og_banner.png');
  await page.screenshot({ path: outputPathPng, type: 'png' });

  const outputPathJpg = path.resolve('public/assets/ayuswar_og_banner.jpg');
  await page.screenshot({ path: outputPathJpg, type: 'jpeg', quality: 88 });

  console.log(`Generated 1200x630 OG Banner PNG: ${(fs.statSync(outputPathPng).size / 1024).toFixed(1)} KB`);
  console.log(`Generated 1200x630 OG Banner JPG: ${(fs.statSync(outputPathJpg).size / 1024).toFixed(1)} KB (Ideal for WhatsApp < 300 KB)`);

  // Clean temp profile
  try {
    fs.rmSync(tempProfile, { recursive: true, force: true });
  } catch(e) {}

  await browser.close();
}

generateOgBanner().catch(err => {
  console.error(err);
  process.exit(1);
});
