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

function analyze(f) {
  const p = path.join(downloadsDir, f);
  const sampleRate = 22050;
  const cmd = `ffmpeg -v error -i "${p}" -f s16le -acodec pcm_s16le -ac 1 -ar ${sampleRate} -`;
  const buf = execSync(cmd, { maxBuffer: 30 * 1024 * 1024 });
  const samples = new Float32Array(buf.length / 2);
  for (let i = 0; i < samples.length; i++) samples[i] = buf.readInt16LE(i * 2) / 32768.0;

  const durationSec = (samples.length / sampleRate).toFixed(2);
  
  // Calculate RMS
  let sumSq = 0;
  for (let i = 0; i < samples.length; i++) sumSq += samples[i] * samples[i];
  const rms = Math.sqrt(sumSq / samples.length);

  // Pitch & Jitter via Autocorrelation
  const frameSize = 1024, hopSize = 512;
  const numFrames = Math.floor((samples.length - frameSize) / hopSize);
  let pitches = [], amps = [], hnrs = [], cents = [];

  for (let i = 0; i < numFrames; i++) {
    const frame = samples.subarray(i * hopSize, i * hopSize + frameSize);
    let fRms = 0;
    for (let j = 0; j < frameSize; j++) fRms += frame[j] * frame[j];
    if (Math.sqrt(fRms / frameSize) < 0.02) continue;

    let r0 = 0;
    for (let j = 0; j < frameSize; j++) r0 += frame[j] * frame[j];

    let maxC = -1, bestL = 0;
    for (let lag = 45; lag < 280; lag++) {
      let c = 0;
      for (let j = 0; j < frameSize - lag; j++) c += frame[j] * frame[j + lag];
      if (c > maxC) { maxC = c; bestL = lag; }
    }
    if (bestL > 0 && r0 > 0 && (maxC / r0) > 0.3) {
      pitches.push(sampleRate / bestL);
      let p = 0;
      for (let j = 0; j < frameSize; j++) if (Math.abs(frame[j]) > p) p = Math.abs(frame[j]);
      amps.push(p);
      const norm = Math.min(0.99, maxC / r0);
      hnrs.push(10 * Math.log10(norm / (1.0001 - norm)));
    }

    // Centroid
    let num = 0, den = 0;
    for (let k = 1; k < 64; k++) {
      let re = 0, im = 0;
      const freq = (k * sampleRate) / frameSize;
      const step = (2 * Math.PI * k) / frameSize;
      for (let n = 0; n < frameSize; n += 4) {
        re += frame[n] * Math.cos(step * n);
        im -= frame[n] * Math.sin(step * n);
      }
      const m = Math.sqrt(re * re + im * im);
      num += freq * m; den += m;
    }
    if (den > 0.001) cents.push(num / den);
  }

  const f0 = pitches.length ? (pitches.reduce((a, b) => a + b, 0) / pitches.length) : 145;
  let jit = 1.2;
  if (pitches.length > 2) {
    let d = 0;
    for (let i = 1; i < pitches.length; i++) d += Math.abs((sampleRate / pitches[i]) - (sampleRate / pitches[i - 1]));
    const meanP = pitches.reduce((a, b) => a + (sampleRate / b), 0) / pitches.length;
    jit = Math.min(10, Math.max(0.4, ((d / (pitches.length - 1)) / meanP) * 100));
  }
  let shim = 3.5;
  if (amps.length > 2) {
    let d = 0;
    for (let i = 1; i < amps.length; i++) d += Math.abs(amps[i] - amps[i - 1]);
    const meanA = amps.reduce((a, b) => a + b, 0) / amps.length;
    shim = Math.min(18, Math.max(1.2, ((d / (amps.length - 1)) / (meanA || 0.01)) * 100));
  }
  const hnr = hnrs.length ? Math.min(28, Math.max(5, hnrs.reduce((a, b) => a + b, 0) / hnrs.length)) : 16;
  const centroid = cents.length ? Math.round(cents.reduce((a, b) => a + b, 0) / cents.length) : 1100;

  // Profile distances & top 2 matches
  const scores = Object.entries(ACOUSTIC_CLUSTER_PROFILES).map(([k, prof]) => {
    const zF0 = Math.abs(f0 - prof.f0Mean) / prof.f0Std;
    const zJit = Math.abs(jit - prof.jitterMean) / prof.jitterStd;
    const zShim = Math.abs(shim - prof.shimmerMean) / prof.shimmerStd;
    const zHnr = Math.abs(hnr - prof.hnrMean) / prof.hnrStd;
    const zCent = Math.abs(centroid - prof.spectralCentroidMean) / prof.spectralCentroidStd;
    const avgZ = (zF0 + zJit + zShim + zHnr + zCent) / 5;
    const sim = Math.max(5, Math.min(96, Math.round(100 * Math.exp(-0.5 * Math.pow(avgZ / 1.5, 2)))));
    return { key: k, label: prof.label, category: prof.category, sim, avgZ };
  }).sort((a, b) => b.sim - a.sim);

  return {
    file: f,
    durationSec,
    rms: rms.toFixed(3),
    f0: Math.round(f0 * 10) / 10,
    jit: jit.toFixed(2),
    shim: shim.toFixed(2),
    hnr: hnr.toFixed(1),
    centroid,
    top1: scores[0],
    top2: scores[1]
  };
}

console.log(JSON.stringify(files.map(analyze), null, 2));
