import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Import the exact clinical ML inference engine
import { analyzeAcousticSignals, ACOUSTIC_CLUSTER_PROFILES } from '../src/services/clinicalMlInferenceEngine.js';

const downloadsDir = 'C:/Users/HP/Downloads';
const files = [
  'WhatsApp Audio 2026-10-18 at 4.50.41 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.50.43 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.50.45 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.50.47 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.50.49 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.50.51 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.50.53 PM.mpeg',
  'WhatsApp Audio 2026-10-18 at 4.54.55 PM.mpeg'
];

function extractRawPcm(filePath, sampleRate = 22050) {
  // Use ffmpeg to decode into 16-bit signed PCM mono
  const cmd = `ffmpeg -v error -i "${filePath}" -f s16le -acodec pcm_s16le -ac 1 -ar ${sampleRate} -`;
  const buffer = execSync(cmd, { maxBuffer: 30 * 1024 * 1024 });
  const samples = new Float32Array(buffer.length / 2);
  for (let i = 0; i < samples.length; i++) {
    samples[i] = buffer.readInt16LE(i * 2) / 32768.0;
  }
  return { samples, sampleRate };
}

function computeAcousticDspMetrics(samples, sampleRate) {
  const frameSize = 1024;
  const hopSize = 512;
  const numFrames = Math.floor((samples.length - frameSize) / hopSize);

  let pitchPeriods = [];
  let peakAmplitudes = [];
  let centroids = [];
  let hnrValues = [];

  for (let i = 0; i < numFrames; i++) {
    const start = i * hopSize;
    const frame = samples.subarray(start, start + frameSize);

    // RMS
    let sumSq = 0;
    for (let j = 0; j < frameSize; j++) sumSq += frame[j] * frame[j];
    const rms = Math.sqrt(sumSq / frameSize);
    if (rms < 0.015) continue; // Skip silence / noise floor

    // Autocorrelation for pitch & HNR
    let maxCorr = -1;
    let bestPeriod = 0;
    const minPeriod = Math.floor(sampleRate / 500); // 500 Hz
    const maxPeriod = Math.floor(sampleRate / 60);  // 60 Hz

    let r0 = 0;
    for (let j = 0; j < frameSize; j++) r0 += frame[j] * frame[j];

    for (let lag = minPeriod; lag < maxPeriod; lag++) {
      let corr = 0;
      for (let j = 0; j < frameSize - lag; j++) {
        corr += frame[j] * frame[j + lag];
      }
      if (corr > maxCorr) {
        maxCorr = corr;
        bestPeriod = lag;
      }
    }

    if (bestPeriod > 0 && r0 > 0) {
      const normCorr = maxCorr / r0;
      if (normCorr > 0.35) { // Voiced frame
        pitchPeriods.push(bestPeriod);
        
        // Find peak amplitude in frame
        let peak = 0;
        for (let j = 0; j < frameSize; j++) {
          const abs = Math.abs(frame[j]);
          if (abs > peak) peak = abs;
        }
        peakAmplitudes.push(peak);

        // HNR approximation (dB)
        const safeNorm = Math.min(0.999, Math.max(0.001, normCorr));
        const frameHnr = 10 * Math.log10(safeNorm / (1.0001 - safeNorm));
        hnrValues.push(frameHnr);
      }
    }

    // Spectral Centroid via DFT magnitude
    let num = 0;
    let den = 0;
    const numBins = 128; // first 128 bins up to ~2.7 kHz
    for (let k = 1; k < numBins; k++) {
      let re = 0, im = 0;
      const freq = (k * sampleRate) / frameSize;
      const angleStep = (2 * Math.PI * k) / frameSize;
      for (let n = 0; n < frameSize; n += 4) { // subsample for speed
        const angle = angleStep * n;
        re += frame[n] * Math.cos(angle);
        im -= frame[n] * Math.sin(angle);
      }
      const mag = Math.sqrt(re * re + im * im);
      num += freq * mag;
      den += mag;
    }
    if (den > 0.0001) {
      centroids.push(num / den);
    }
  }

  // Aggregate Metrics
  let pitchF0 = 140;
  let jitterPct = 1.2;
  let shimmerPct = 2.8;
  let hnrDb = 18.0;
  let spectralCentroid = 1200;

  if (pitchPeriods.length > 5) {
    const f0Values = pitchPeriods.map(p => sampleRate / p);
    pitchF0 = f0Values.reduce((a, b) => a + b, 0) / f0Values.length;

    // Jitter (Relative Average Perturbation)
    let sumJitterDiff = 0;
    for (let i = 1; i < pitchPeriods.length; i++) {
      sumJitterDiff += Math.abs(pitchPeriods[i] - pitchPeriods[i - 1]);
    }
    const meanPeriod = pitchPeriods.reduce((a, b) => a + b, 0) / pitchPeriods.length;
    jitterPct = ((sumJitterDiff / (pitchPeriods.length - 1)) / meanPeriod) * 100;

    // Shimmer (Relative Amplitude Perturbation)
    let sumShimmerDiff = 0;
    for (let i = 1; i < peakAmplitudes.length; i++) {
      sumShimmerDiff += Math.abs(peakAmplitudes[i] - peakAmplitudes[i - 1]);
    }
    const meanPeak = peakAmplitudes.reduce((a, b) => a + b, 0) / peakAmplitudes.length;
    shimmerPct = ((sumShimmerDiff / (peakAmplitudes.length - 1)) / (meanPeak || 0.01)) * 100;
  }

  if (hnrValues.length > 0) {
    hnrDb = hnrValues.reduce((a, b) => a + b, 0) / hnrValues.length;
  }

  if (centroids.length > 0) {
    spectralCentroid = centroids.reduce((a, b) => a + b, 0) / centroids.length;
  }

  return {
    pitchF0: Math.round(pitchF0 * 10) / 10,
    jitterPct: Math.round(Math.min(15, Math.max(0.1, jitterPct)) * 100) / 100,
    shimmerPct: Math.round(Math.min(25, Math.max(0.2, shimmerPct)) * 100) / 100,
    hnrDb: Math.round(Math.min(35, Math.max(2, hnrDb)) * 10) / 10,
    spectralCentroid: Math.round(spectralCentroid)
  };
}

const allResults = [];

for (const fileName of files) {
  const filePath = path.join(downloadsDir, fileName);
  console.log(`Processing: ${fileName}...`);
  try {
    const { samples, sampleRate } = extractRawPcm(filePath);
    const dspMetrics = computeAcousticDspMetrics(samples, sampleRate);
    const labAnalysis = analyzeAcousticSignals(dspMetrics);

    allResults.push({
      fileName,
      durationSec: Math.round((samples.length / sampleRate) * 100) / 100,
      dspMetrics,
      topMatch: labAnalysis.topAcousticMatch,
      allMatches: labAnalysis.allAcousticMatches
    });
  } catch (err) {
    console.error(`Error processing ${fileName}:`, err.message);
  }
}

fs.writeFileSync('scripts/whatsapp_audio_test_results.json', JSON.stringify(allResults, null, 2));
console.log('\n--- ANALYSIS COMPLETE ---');
console.log(JSON.stringify(allResults, null, 2));
