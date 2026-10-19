import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { ACOUSTIC_CLUSTER_PROFILES } from '../src/services/clinicalMlInferenceEngine.js';

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

function analyzeFile(f) {
  const filePath = path.join(downloadsDir, f);
  const sampleRate = 22050;
  
  // Extract PCM 16-bit
  const cmd = `ffmpeg -v error -i "${filePath}" -f s16le -acodec pcm_s16le -ac 1 -ar ${sampleRate} -`;
  const buffer = execSync(cmd, { maxBuffer: 30 * 1024 * 1024 });
  const samples = new Float32Array(buffer.length / 2);
  for (let i = 0; i < samples.length; i++) {
    samples[i] = buffer.readInt16LE(i * 2) / 32768.0;
  }

  const durationSec = Math.round((samples.length / sampleRate) * 100) / 100;
  
  // Audio energy
  let sumSq = 0;
  let peak = 0;
  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    sumSq += s * s;
    if (Math.abs(s) > peak) peak = Math.abs(s);
  }
  const overallRms = Math.sqrt(sumSq / samples.length);

  // Frame processing
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

    let frameSumSq = 0;
    for (let j = 0; j < frameSize; j++) frameSumSq += frame[j] * frame[j];
    const frameRms = Math.sqrt(frameSumSq / frameSize);
    if (frameRms < 0.02) continue; // Noise gate

    // Autocorrelation
    let r0 = 0;
    for (let j = 0; j < frameSize; j++) r0 += frame[j] * frame[j];

    const minLag = Math.floor(sampleRate / 450); // ~450 Hz
    const maxLag = Math.floor(sampleRate / 75);  // ~75 Hz
    let maxCorr = -1;
    let bestLag = 0;

    for (let lag = minLag; lag < maxLag; lag++) {
      let corr = 0;
      for (let j = 0; j < frameSize - lag; j++) {
        corr += frame[j] * frame[j + lag];
      }
      if (corr > maxCorr) {
        maxCorr = corr;
        bestLag = lag;
      }
    }

    if (bestLag > 0 && r0 > 0) {
      const normCorr = maxCorr / r0;
      if (normCorr > 0.3) {
        pitchPeriods.push(bestLag);
        
        let fPeak = 0;
        for (let j = 0; j < frameSize; j++) {
          if (Math.abs(frame[j]) > fPeak) fPeak = Math.abs(frame[j]);
        }
        peakAmplitudes.push(fPeak);

        const safeNorm = Math.min(0.99, Math.max(0.01, normCorr));
        const hnr = 10 * Math.log10(safeNorm / (1.0001 - safeNorm));
        hnrValues.push(hnr);
      }
    }

    // Centroid
    let num = 0, den = 0;
    for (let k = 1; k < 128; k++) {
      let re = 0, im = 0;
      const freq = (k * sampleRate) / frameSize;
      const step = (2 * Math.PI * k) / frameSize;
      for (let n = 0; n < frameSize; n += 4) {
        re += frame[n] * Math.cos(step * n);
        im -= frame[n] * Math.sin(step * n);
      }
      const mag = Math.sqrt(re * re + im * im);
      num += freq * mag;
      den += mag;
    }
    if (den > 0.001) centroids.push(num / den);
  }

  // Calculate DSP Features
  let pitchF0 = 145.0;
  let jitterPct = 1.15;
  let shimmerPct = 3.20;
  let hnrDb = 19.5;
  let spectralCentroid = 1150;

  if (pitchPeriods.length > 5) {
    const f0s = pitchPeriods.map(p => sampleRate / p);
    pitchF0 = f0s.reduce((a, b) => a + b, 0) / f0s.length;

    let sumDiff = 0;
    for (let i = 1; i < pitchPeriods.length; i++) {
      sumDiff += Math.abs(pitchPeriods[i] - pitchPeriods[i - 1]);
    }
    const meanPeriod = pitchPeriods.reduce((a, b) => a + b, 0) / pitchPeriods.length;
    jitterPct = ((sumDiff / (pitchPeriods.length - 1)) / meanPeriod) * 100;

    let sumAmpDiff = 0;
    for (let i = 1; i < peakAmplitudes.length; i++) {
      sumAmpDiff += Math.abs(peakAmplitudes[i] - peakAmplitudes[i - 1]);
    }
    const meanPeak = peakAmplitudes.reduce((a, b) => a + b, 0) / peakAmplitudes.length;
    shimmerPct = ((sumAmpDiff / (peakAmplitudes.length - 1)) / (meanPeak || 0.01)) * 100;
  }

  if (hnrValues.length > 0) {
    hnrDb = hnrValues.reduce((a, b) => a + b, 0) / hnrValues.length;
  }
  if (centroids.length > 0) {
    spectralCentroid = centroids.reduce((a, b) => a + b, 0) / centroids.length;
  }

  // Clamp to realistic physical bounds
  pitchF0 = Math.round(pitchF0 * 10) / 10;
  jitterPct = Math.round(Math.min(10.0, Math.max(0.35, jitterPct)) * 100) / 100;
  shimmerPct = Math.round(Math.min(18.0, Math.max(1.10, shimmerPct)) * 100) / 100;
  hnrDb = Math.round(Math.min(28.0, Math.max(6.0, hnrDb)) * 10) / 10;
  spectralCentroid = Math.round(spectralCentroid);

  // Compute normalized similarity against each cluster profile
  const matches = Object.entries(ACOUSTIC_CLUSTER_PROFILES).map(([key, profile]) => {
    // Normalized Z-distance across features
    const zF0 = Math.abs(pitchF0 - profile.f0Mean) / profile.f0Std;
    const zJit = Math.abs(jitterPct - profile.jitterMean) / profile.jitterStd;
    const zShim = Math.abs(shimmerPct - profile.shimmerMean) / profile.shimmerStd;
    const zHnr = Math.abs(hnrDb - profile.hnrMean) / profile.hnrStd;
    const zCent = Math.abs(spectralCentroid - profile.spectralCentroidMean) / profile.spectralCentroidStd;

    const avgZ = (zF0 + zJit + zShim + zHnr + zCent) / 5;
    // Sigmoid / Gaussian distance to percentage: 0 -> 98%, 1 -> 80%, 2 -> 55%, 3 -> 30%
    const score = Math.max(5, Math.min(98, Math.round(100 * Math.exp(-0.5 * Math.pow(avgZ / 1.4, 2)))));

    return {
      key,
      label: profile.label,
      category: profile.category,
      description: profile.description,
      similarityScore: score,
      avgDistanceZ: Math.round(avgZ * 100) / 100
    };
  });

  matches.sort((a, b) => b.similarityScore - a.similarityScore);

  return {
    fileName: f,
    durationSec,
    overallRms: Math.round(overallRms * 1000) / 1000,
    metrics: {
      pitchF0,
      jitterPct,
      shimmerPct,
      hnrDb,
      spectralCentroid
    },
    topMatch: matches[0],
    allMatches: matches
  };
}

const results = files.map(analyzeFile);
console.log(JSON.stringify(results, null, 2));
