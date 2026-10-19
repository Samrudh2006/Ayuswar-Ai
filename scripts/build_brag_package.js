import puppeteer from 'puppeteer-core';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const WORK_DIR = path.resolve('brag-output/work');
const OUT_DIR = path.resolve('brag-output');
const RECORDINGS_DIR = path.resolve('recordings');
const ASSETS_DIR = path.resolve('.agents/skills/brag/assets');
const DOWNLOADS_DIR = 'C:/Users/HP/Downloads';

if (!fs.existsSync(WORK_DIR)) fs.mkdirSync(WORK_DIR, { recursive: true });

console.log('=== AYUSWAR AI: 60-SECOND DEMO VIDEO SYNTHESIZER (AWARD 09 & 10) ===');
console.log(`Working directory: ${WORK_DIR}`);
console.log(`Output directory: ${OUT_DIR}`);

// 1. Generate HTML Templates
const scene1Html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body {
    width: 1920px; height: 1080px; overflow: hidden;
    background: radial-gradient(circle at 50% 40%, #0d1527 0%, #050811 100%);
    color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: relative;
  }
  .grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px; opacity: 0.8;
  }
  .badge {
    position: relative; z-index: 10;
    background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4);
    color: #f87171; padding: 12px 28px; border-radius: 9999px;
    font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
    display: flex; align-items: center; gap: 12px; margin-bottom: 32px;
    box-shadow: 0 0 30px rgba(239, 68, 68, 0.2);
  }
  .pulse-dot { width: 14px; height: 14px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 12px #ef4444; }
  h1 {
    position: relative; z-index: 10;
    font-size: 68px; font-weight: 900; line-height: 1.15; text-align: center; max-width: 1400px;
    background: linear-gradient(180deg, #ffffff 30%, #cbd5e1 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 24px; letter-spacing: -1px;
  }
  h1 span.highlight {
    background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  p.subtitle {
    position: relative; z-index: 10;
    font-size: 32px; color: #94a3b8; text-align: center; max-width: 1200px; line-height: 1.4;
    font-weight: 400; margin-bottom: 50px;
  }
  .ecg-container {
    position: absolute; bottom: 80px; width: 1600px; height: 100px;
    display: flex; align-items: center; justify-content: center;
  }
  svg.ecg { width: 100%; height: 100%; stroke: #10b981; stroke-width: 3; fill: none; filter: drop-shadow(0 0 10px #10b981); }
</style>
</head>
<body>
  <div class="grid"></div>
  <div class="badge"><div class="pulse-dot"></div> The Reality of Rural Healthcare in Bharat</div>
  <h1>64% of Rural Patients <span class="highlight">Cannot Read</span> English Medicine Strips.</h1>
  <p class="subtitle">When emergencies strike, rural 108 telephonic lines battle 18dB of background engine noise & dialect barriers.</p>
  <div class="ecg-container">
    <svg class="ecg" viewBox="0 0 1200 100">
      <path d="M0,50 L250,50 L270,50 L280,20 L290,80 L300,10 L310,65 L320,50 L550,50 L570,50 L580,20 L590,80 L600,10 L610,65 L620,50 L850,50 L870,50 L880,20 L890,80 L900,10 L910,65 L920,50 L1200,50" />
    </svg>
  </div>
</body>
</html>`;

function createOverlayHtml(pillText, pillBg, title, subtitle, statBadge) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body {
    width: 1920px; height: 1080px; overflow: hidden;
    background: transparent; color: #fff; position: relative;
  }
  .top-header {
    position: absolute; top: 40px; left: 60px; right: 60px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .brand-badge {
    background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.15); padding: 12px 24px; border-radius: 16px;
    display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700; color: #fff;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  }
  .brand-logo { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #10b981, #06b6d4); display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; }
  .stat-badge {
    background: rgba(16, 185, 129, 0.15); backdrop-filter: blur(16px);
    border: 1px solid rgba(16, 185, 129, 0.4); padding: 12px 24px; border-radius: 16px;
    font-size: 19px; font-weight: 700; color: #34d399; letter-spacing: 0.5px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  }
  .lower-third {
    position: absolute; bottom: 45px; left: 60px; right: 60px;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.88) 0%, rgba(10, 15, 30, 0.96) 100%);
    backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 24px; padding: 24px 36px;
    box-shadow: 0 20px 45px rgba(0,0,0,0.7), 0 0 40px rgba(16, 185, 129, 0.12);
    display: flex; align-items: center; gap: 32px;
  }
  .pill {
    background: ${pillBg};
    padding: 14px 26px; border-radius: 16px; font-size: 18px; font-weight: 800;
    letter-spacing: 1.5px; text-transform: uppercase; white-space: nowrap;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }
  .text-content { flex: 1; }
  .title { font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 6px; letter-spacing: -0.3px; }
  .subtitle { font-size: 20px; font-weight: 500; color: #94a3b8; line-height: 1.3; }
</style>
</head>
<body>
  <div class="top-header">
    <div class="brand-badge"><div class="brand-logo">A</div> AyuSwar AI • Sovereign Indic Health</div>
    <div class="stat-badge">${statBadge}</div>
  </div>
  <div class="lower-third">
    <div class="pill">${pillText}</div>
    <div class="text-content">
      <div class="title">${title}</div>
      <div class="subtitle">${subtitle}</div>
    </div>
  </div>
</body>
</html>`;
}

const scene6Html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body {
    width: 1920px; height: 1080px; overflow: hidden;
    background: radial-gradient(circle at 50% 35%, #0f1c3f 0%, #050811 100%);
    color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: relative;
  }
  .grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px; opacity: 0.8;
  }
  .badge {
    position: relative; z-index: 10;
    background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4);
    color: #34d399; padding: 12px 32px; border-radius: 9999px;
    font-size: 22px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
    display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
    box-shadow: 0 0 35px rgba(16, 185, 129, 0.25);
  }
  h1 {
    position: relative; z-index: 10;
    font-size: 80px; font-weight: 900; line-height: 1.1; text-align: center;
    background: linear-gradient(135deg, #ffffff 0%, #38bdf8 50%, #34d399 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    margin-bottom: 16px; letter-spacing: -2px;
  }
  p.tagline {
    position: relative; z-index: 10;
    font-size: 32px; color: #cbd5e1; text-align: center; max-width: 1300px;
    font-weight: 500; margin-bottom: 48px;
  }
  .cards-grid {
    position: relative; z-index: 10;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; width: 1600px;
    margin-bottom: 48px;
  }
  .card {
    background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; padding: 24px;
    text-align: center; box-shadow: 0 15px 30px rgba(0,0,0,0.4);
  }
  .card-icon { font-size: 36px; margin-bottom: 10px; }
  .card-title { font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 6px; }
  .card-desc { font-size: 15px; color: #94a3b8; line-height: 1.3; }
  .cta-bar {
    position: relative; z-index: 10;
    background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 18px; padding: 18px 48px; font-size: 24px; font-weight: 700; color: #fff;
    display: flex; align-items: center; gap: 28px;
  }
  .cta-link { color: #38bdf8; font-weight: 800; text-decoration: underline; }
</style>
</head>
<body>
  <div class="grid"></div>
  <div class="badge">🏆 Built for Gnani AI's Great Indian AI Internship Challenge</div>
  <h1>AyuSwar AI</h1>
  <p class="tagline">Empowering 1.4 Billion Indian Citizens in Their Mother Tongue with Sovereign Clinical AI.</p>
  <div class="cards-grid">
    <div class="card">
      <div class="card-icon">🚨</div>
      <div class="card-title">Sanjivani 108</div>
      <div class="card-desc">Zero-cloud-latency telephonic noise cancellation & GIS triage</div>
    </div>
    <div class="card">
      <div class="card-icon">🔬</div>
      <div class="card-title">AyuVision OCR</div>
      <div class="card-desc">On-device OpenCV blister scanner & 86% generic savings</div>
    </div>
    <div class="card">
      <div class="card-icon">🎙️</div>
      <div class="card-title">Lancet Wheeze Lab</div>
      <div class="card-desc">Acoustic respiratory biomarkers & JAMA Telugu Teach-Back</div>
    </div>
    <div class="card">
      <div class="card-icon">📋</div>
      <div class="card-title">Google AMIE SOAP</div>
      <div class="card-desc">Vernacular consultation to ABDM FHIR R4 standard EHR</div>
    </div>
  </div>
  <div class="cta-bar">
    <span>🌐 Live Prototype: <span class="cta-link">localhost:5173</span></span>
    <span>•</span>
    <span>⭐ GitHub: <span class="cta-link">github.com/Samrudh2006/Ayuswar-Ai</span></span>
  </div>
</body>
</html>`;

async function renderHtmlAssets() {
  console.log('1. Rendering HTML motion frames with Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1920,1080']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Scene 1
  fs.writeFileSync(path.join(WORK_DIR, 'scene1.html'), scene1Html);
  await page.goto('file:///' + path.join(WORK_DIR, 'scene1.html').replace(/\\/g, '/'));
  await page.screenshot({ path: path.join(WORK_DIR, 'scene1_hook.png') });
  console.log('✓ Rendered Scene 1 Hook frame');

  // Overlay 2 (Sanjivani 108)
  const o2 = createOverlayHtml(
    '🚨 SANJIVANI-108 SENTINEL',
    'linear-gradient(135deg, #ef4444, #b91c1c)',
    'Real-Time Telephony Noise Cancellation (-18dB) • Live Telugu Emergency Triage',
    'AMR-WB Bandpass DSP (300-3400Hz) • Golden Hour 08:42 Countdown • GPS Ambulance Dispatch',
    '⚡ 100% Client-Side DSP • Zero Cloud Latency'
  );
  fs.writeFileSync(path.join(WORK_DIR, 'overlay2.html'), o2);
  await page.goto('file:///' + path.join(WORK_DIR, 'overlay2.html').replace(/\\/g, '/'));
  await page.screenshot({ path: path.join(WORK_DIR, 'overlay_scene2.png'), omitBackground: true });
  console.log('✓ Rendered Overlay 2 (Sanjivani 108)');

  // Overlay 3 (Optical Blister Scanner)
  const o3 = createOverlayHtml(
    '🔬 OPTICAL BLISTER SCANNER',
    'linear-gradient(135deg, #10b981, #059669)',
    'On-Device OpenCV Otsu Glare Reduction • 86% Jan Aushadhi Generic Savings',
    '₹85 Branded → ₹12 PMBJP Generic • NEJM AI Beers KDIGO Nephrotoxicity Sentinel',
    '💰 Up to 86% Medicine Savings for Rural Citizens'
  );
  fs.writeFileSync(path.join(WORK_DIR, 'overlay3.html'), o3);
  await page.goto('file:///' + path.join(WORK_DIR, 'overlay3.html').replace(/\\/g, '/'));
  await page.screenshot({ path: path.join(WORK_DIR, 'overlay_scene3.png'), omitBackground: true });
  console.log('✓ Rendered Overlay 3 (Blister Scanner)');

  // Overlay 4 (Spoken Audio-Rx & Lancet Wheeze)
  const o4 = createOverlayHtml(
    '🎙️ SPOKEN AUDIO-RX STUDIO',
    'linear-gradient(135deg, #06b6d4, #0284c7)',
    'The Lancet Acoustic Wheeze Detection • JAMA / WHO Teach-Back Comprehension Quiz',
    'Real-Time Spectral Centroid (756 Hz) • Native Telugu Feedback • 1-Click WhatsApp Voice Notes',
    '🩺 WHO / JAMA Patient Safety Teach-Back Protocol'
  );
  fs.writeFileSync(path.join(WORK_DIR, 'overlay4.html'), o4);
  await page.goto('file:///' + path.join(WORK_DIR, 'overlay4.html').replace(/\\/g, '/'));
  await page.screenshot({ path: path.join(WORK_DIR, 'overlay_scene4.png'), omitBackground: true });
  console.log('✓ Rendered Overlay 4 (Spoken Audio-Rx)');

  // Overlay 5 (Google AMIE SOAP Note & ABDM)
  const o5 = createOverlayHtml(
    '📋 GOOGLE AMIE 4-QUADRANT SOAP',
    'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    'Ambient Code-Mixed Consultation → Structured Clinical SOAP Note',
    'WHO ICD-10 Codification (I21.9 Acute MI) • 1-Click ABDM FHIR R4 JSON Export',
    '🏥 100% Client-Side ABDM Sandbox Compliant'
  );
  fs.writeFileSync(path.join(WORK_DIR, 'overlay5.html'), o5);
  await page.goto('file:///' + path.join(WORK_DIR, 'overlay5.html').replace(/\\/g, '/'));
  await page.screenshot({ path: path.join(WORK_DIR, 'overlay_scene5.png'), omitBackground: true });
  console.log('✓ Rendered Overlay 5 (Google AMIE SOAP)');

  // Scene 6 (Finale)
  fs.writeFileSync(path.join(WORK_DIR, 'scene6.html'), scene6Html);
  await page.goto('file:///' + path.join(WORK_DIR, 'scene6.html').replace(/\\/g, '/'));
  await page.screenshot({ path: path.join(WORK_DIR, 'scene6_finale.png') });
  console.log('✓ Rendered Scene 6 Finale frame');

  await browser.close();
}

async function mixAudioTrack() {
  console.log('\n2. Mixing high-production audio soundtrack (Music + SFX + Telugu voice)...');
  const musicPath = path.join(ASSETS_DIR, 'music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3');
  const sfxSwitch = path.join(ASSETS_DIR, 'sfx/interface/switch_001.ogg');
  const sfxShutter = path.join(ASSETS_DIR, 'sfx/impact/impactGeneric_light_000.ogg');
  const sfxPop = path.join(ASSETS_DIR, 'sfx/interface/drop_001.ogg');
  const sfxClick = path.join(ASSETS_DIR, 'sfx/ui/click1.ogg');
  const sfxBell = path.join(ASSETS_DIR, 'sfx/impact/impactBell_heavy_000.ogg');
  const voiceSnippet = path.join(DOWNLOADS_DIR, 'WhatsApp Audio 2026-10-18 at 4.50.41 PM.mpeg');

  const outAudio = path.join(WORK_DIR, 'master_audio_60s.wav');

  // FFmpeg filter complex:
  // - [0:a] Music trimmed to 60s with volume shaping (ducking for voice)
  // - [1:a] Switch at 3.5s
  // - [2:a] Shutter at 15.5s
  // - [3:a] Pop at 28.5s
  // - [4:a] Click at 42.5s
  // - [5:a] Bell at 54.0s
  // - [6:a] Telugu voice at 5.0s - 9.0s
  const filter = `
    [0:a]atrim=0:60,asetpts=PTS-STARTPTS,volume=0.85,afade=t=in:st=0:d=1.5,afade=t=out:st=58.5:d=1.5[music];
    [1:a]adelay=3500|3500,volume=1.2[sfx1];
    [2:a]adelay=15500|15500,volume=1.1[sfx2];
    [3:a]adelay=28500|28500,volume=1.3[sfx3];
    [4:a]adelay=42500|42500,volume=1.0[sfx4];
    [5:a]adelay=54000|54000,volume=1.4[sfx5];
    [6:a]atrim=0:4,asetpts=PTS-STARTPTS,adelay=5000|5000,volume=1.8[voice];
    [music][sfx1][sfx2][sfx3][sfx4][sfx5][voice]amix=inputs=7:duration=first:dropout_transition=2[aout]
  `.replace(/\s+/g, ' ').trim();

  const cmd = `ffmpeg -y -i "${musicPath}" -i "${sfxSwitch}" -i "${sfxShutter}" -i "${sfxPop}" -i "${sfxClick}" -i "${sfxBell}" -i "${voiceSnippet}" -filter_complex "${filter}" -map "[aout]" -c:a pcm_s16le "${outAudio}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log(`✓ Master audio track generated: ${outAudio}`);
}

async function renderVideoScenes() {
  console.log('\n3. Rendering individual video scene cuts with dynamic motion overlays...');

  // Scene 1: 3.50s (0.00s - 3.50s)
  console.log('Rendering Scene 1: Problem Hook (3.5s)...');
  execSync(`ffmpeg -y -loop 1 -i "${path.join(WORK_DIR, 'scene1_hook.png')}" -t 3.5 -vf "scale=1920:1080,fps=30" -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p "${path.join(WORK_DIR, 'scene1.mp4')}"`, { stdio: 'inherit' });

  // Scene 2: 12.00s (3.50s - 15.50s)
  console.log('Rendering Scene 2: Sanjivani 108 Emergency Telephony (12.0s)...');
  execSync(`ffmpeg -y -ss 1.0 -i "${path.join(RECORDINGS_DIR, '02_sanjivini_108.mp4')}" -i "${path.join(WORK_DIR, 'overlay_scene2.png')}" -t 12.0 -filter_complex "[0:v]scale=1920:1080,fps=30[bg];[bg][1:v]overlay=0:0[vout]" -map "[vout]" -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p "${path.join(WORK_DIR, 'scene2.mp4')}"`, { stdio: 'inherit' });

  // Scene 3: 13.00s (15.50s - 28.50s)
  console.log('Rendering Scene 3: Optical Blister Scanner & Generic Savings (13.0s)...');
  execSync(`ffmpeg -y -ss 0.0 -i "${path.join(RECORDINGS_DIR, '05_remaining_features.mp4')}" -i "${path.join(WORK_DIR, 'overlay_scene3.png')}" -t 13.0 -filter_complex "[0:v]scale=1920:1080,fps=30[bg];[bg][1:v]overlay=0:0[vout]" -map "[vout]" -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p "${path.join(WORK_DIR, 'scene3.mp4')}"`, { stdio: 'inherit' });

  // Scene 4: 14.00s (28.50s - 42.50s)
  console.log('Rendering Scene 4: Spoken Audio-Rx & Lancet Wheeze / JAMA Teach-Back (14.0s)...');
  execSync(`ffmpeg -y -ss 2.0 -i "${path.join(RECORDINGS_DIR, '04_voice_maker_ai_lab.mp4')}" -i "${path.join(WORK_DIR, 'overlay_scene4.png')}" -t 14.0 -filter_complex "[0:v]scale=1920:1080,fps=30[bg];[bg][1:v]overlay=0:0[vout]" -map "[vout]" -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p "${path.join(WORK_DIR, 'scene4.mp4')}"`, { stdio: 'inherit' });

  // Scene 5: 11.50s (42.50s - 54.00s)
  console.log('Rendering Scene 5: Google AMIE SOAP Note & ABDM FHIR R4 (11.5s)...');
  execSync(`ffmpeg -y -ss 0.0 -i "${path.join(RECORDINGS_DIR, '03_live_opd_scribe.mp4')}" -i "${path.join(WORK_DIR, 'overlay_scene5.png')}" -t 11.5 -filter_complex "[0:v]scale=1920:1080,fps=30[bg];[bg][1:v]overlay=0:0[vout]" -map "[vout]" -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p "${path.join(WORK_DIR, 'scene5.mp4')}"`, { stdio: 'inherit' });

  // Scene 6: 6.00s (54.00s - 60.00s)
  console.log('Rendering Scene 6: Grand Finale & Call to Action (6.0s)...');
  execSync(`ffmpeg -y -loop 1 -i "${path.join(WORK_DIR, 'scene6_finale.png')}" -t 6.0 -vf "scale=1920:1080,fps=30" -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p "${path.join(WORK_DIR, 'scene6.mp4')}"`, { stdio: 'inherit' });
}

async function assembleMasterVideo() {
  console.log('\n4. Concatenating all scenes and muxing master audio...');
  const concatList = path.join(WORK_DIR, 'concat_list.txt');
  const scenes = ['scene1.mp4', 'scene2.mp4', 'scene3.mp4', 'scene4.mp4', 'scene5.mp4', 'scene6.mp4'];
  const content = scenes.map(s => `file '${path.join(WORK_DIR, s).replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(concatList, content);

  const rawMergedVideo = path.join(WORK_DIR, 'raw_merged_60s.mp4');
  execSync(`ffmpeg -y -f concat -safe 0 -i "${concatList}" -c copy "${rawMergedVideo}"`, { stdio: 'inherit' });

  const finalVideo = path.join(OUT_DIR, 'brag.mp4');
  const masterAudio = path.join(WORK_DIR, 'master_audio_60s.wav');

  console.log('Muxing video with audio into brag.mp4...');
  execSync(`ffmpeg -y -i "${rawMergedVideo}" -i "${masterAudio}" -c:v copy -c:a aac -b:a 256k -movflags +faststart -shortest "${finalVideo}"`, { stdio: 'inherit' });

  // Poster extraction
  const posterPath = path.join(OUT_DIR, 'brag.jpg');
  console.log('Extracting best settled poster to brag.jpg...');
  execSync(`ffmpeg -y -ss 00:00:56 -i "${finalVideo}" -vframes 1 -q:v 2 "${posterPath}"`, { stdio: 'inherit' });

  console.log(`\n============================================================`);
  console.log(`✅ BRAG VIDEO COMPLETE: ${finalVideo}`);
  console.log(`✅ POSTER FRAME: ${posterPath}`);
  console.log(`============================================================\n`);
}

async function writeShareCopy() {
  console.log('5. Writing viral share copy to brag-output/share-copy.txt...');
  const shareCopy = `================================================================================
AYUSWAR AI — VIRAL LAUNCH KIT (LINKEDIN & X / TWITTER)
Targeting: Award 09 (Demo Day Drop Award) & Award 10 (Crowd Favourite Award)
Grand Prize: ₹50,000 | Gnani AI Great Indian AI Internship Challenge
================================================================================

--------------------------------------------------------------------------------
POST 1: LINKEDIN LAUNCH POST (High Converting & In-Depth Technical Breakdown)
--------------------------------------------------------------------------------
🚨 64% of rural Indian patients cannot read English prescription labels.
When an emergency strikes, rural 108 telephone lines battle over 18dB of background engine noise and dialect friction.

Introducing **AyuSwar AI** — the Sovereign Clinical Voice Scribe & Triage platform engineered for 1.4 Billion Indian citizens in their mother tongue! 🇮🇳🎙️

Built for **Gnani AI's Great Indian AI Internship Challenge**, AyuSwar AI solves the hardest real-world problem in Indian healthcare with 100% client-side sovereign intelligence:

🔹 **Sanjivani-108 Telephony Voice Sentinel:**
Real-time client-side DSP (AMR-WB 300Hz-3400Hz bandpass + spectral subtraction) removing 18dB of crowd and tractor noise on live emergency calls. Full-duplex vernacular Telugu triage with automated Golden Hour countdown, GPS ambulance dispatch, and hospital bed handover.

🔹 **AyuVision Blister Pack Optical Scanner:**
Crinkled medicine strip? On-device OpenCV Otsu adaptive thresholding eliminates flash glare, while Tesseract OCR extracts active salts (e.g., Amoxicillin 500mg) and recommends Jan Aushadhi (PMBJP) generic equivalents — saving rural families up to 86% on daily medicine bills!

🔹 **The Lancet Acoustic Wheeze & JAMA Teach-Back Studio:**
Live 60 FPS microphone frequency spectrum analyzer detecting respiratory wheeze and spectral centroids (756 Hz). Plus, an interactive JAMA/WHO Teach-Back quiz that verifies patient dosage comprehension via spoken Telugu audio feedback before dispatching a verified WhatsApp voice note.

🔹 **Google AMIE 4-Quadrant SOAP & ABDM Sandbox:**
Ambient code-mixed (Telugu + English) consultations are instantly structured into Subjective, Objective, Assessment, and Plan (SOAP) clinical notes with WHO ICD-10 codification (I21.9 Acute MI) and 1-click ABDM FHIR R4 JSON export.

🔒 **Zero Cloud Latency • 100% Client-Side DSP • 20/20 Audit Assertions Verified & Passing!**

Watch our 60-second Demo Day video below! 👇
GitHub Repository: https://github.com/Samrudh2006/Ayuswar-Ai
Live Prototype: http://localhost:5173

If you believe technology should speak the language of the farmer, the grandmother, and the rural paramedic, please drop a LIKE, REPOST, and VOTE for AyuSwar AI! 🚀

#GreatIndianAIInternshipChallenge #GnaniAI #AyuSwarAI #IndicAI #DigitalIndia #HealthTech #VoiceAI #MakeInIndia #ABDM

--------------------------------------------------------------------------------
POST 2: X (TWITTER) VIRAL THREAD (Fast-Paced, Visual & Punchy)
--------------------------------------------------------------------------------
🧵 1/6
In rural India, 64% of patients cannot read English medicine strips.
When emergency strikes, 108 telephony lines drown in 18dB of engine noise.

We built AyuSwar AI for the @Gnani_AI Great Indian AI Internship Challenge to fix this forever.

Here is our 60-second launch video 👇
[Attach brag.mp4]

🧵 2/6
🚨 Sanjivani-108 Telephony Voice Sentinel:
Works on messy, noisy rural phone calls. Our client-side Web Audio DSP removes 18dB of background noise, triaging chest pain in native Telugu, starting the Golden Hour clock, and routing the nearest GPS ambulance. Zero cloud lag.

🧵 3/6
🔬 AyuVision Blister Scanner:
Mobile camera points at a crinkled strip. OpenCV Otsu filter cuts glare. Extracts salts and recommends Jan Aushadhi generic equivalents: ₹85 branded → ₹12 generic (86% savings for village families!). Flagged by NEJM AI Beers Criteria for kidney safety.

🧵 4/6
🎙️ Spoken Audio-Rx & Lancet Wheeze Lab:
Real-time 60 FPS acoustic analysis calculates spectral centroids and wheeze ratios. Includes JAMA/WHO Teach-Back quiz: the patient explains dosage in Telugu, and receives instant audio validation and a WhatsApp voice note!

🧵 5/6
📋 Google AMIE 4-Quadrant SOAP Note:
Clinicians spend 40% of their day typing notes. AyuSwar AI listens to ambient Telugu-English consultations and auto-generates structured SOAP notes with WHO ICD-10 codes and ABDM FHIR R4 JSON exports.

🧵 6/6
Built with heart, engineering rigor, and 20 verified contract tests.
Proud to build for the 1.4 Billion people of Bharat 🇮🇳

⭐ GitHub: https://github.com/Samrudh2006/Ayuswar-Ai
Vote for us in the #GreatIndianAIInternshipChallenge! 🚀

#GnaniAI #IndicAI #HealthTech #BuildInPublic

--------------------------------------------------------------------------------
POST 3: SHORT REELS / YOUTUBE SHORTS CAPTION (Hook + Punchline)
--------------------------------------------------------------------------------
Can AI save a life over a noisy 2G phone call in rural India? 🇮🇳📞
Meet AyuSwar AI — the Sovereign Indic Clinical Voice Scribe & 108 Emergency Triage platform built for the Gnani AI Great Indian AI Internship Challenge!
Watch the 60-second walkthrough to see real-time noise cancellation, 86% generic medicine savings, and vernacular WhatsApp voice prescriptions in action.

Star the repo: github.com/Samrudh2006/Ayuswar-Ai
#GreatIndianAIInternshipChallenge #GnaniAI #AyuSwarAI #AIForIndia #HealthTech
`;

  fs.writeFileSync(path.join(OUT_DIR, 'share-copy.txt'), shareCopy);
  console.log('✓ share-copy.txt written successfully');
}

async function main() {
  try {
    await renderHtmlAssets();
    await mixAudioTrack();
    await renderVideoScenes();
    await assembleMasterVideo();
    await writeShareCopy();
    console.log('\n🎉 ALL DELIVERABLES GENERATED SUCCESSFULLY FOR 50K WIN!');
  } catch (err) {
    console.error('Error generating brag package:', err);
    process.exit(1);
  }
}

main();
