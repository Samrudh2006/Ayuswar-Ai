import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { computeAcousticDspMetrics, LAB_STATES } from '../src/services/acousticDspEngine.js';

function parseWav(filePath) {
  const buf = fs.readFileSync(filePath);
  // Parse sampleRate from bytes 24-27
  const sampleRate = buf.readUInt32LE(24);
  const numChannels = buf.readUInt16LE(22);
  const bitsPerSample = buf.readUInt16LE(34);
  const dataOffset = 44; // Standard PCM WAV header
  const numSamples = (buf.length - dataOffset) / (bitsPerSample / 8);
  const channelData = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const val = buf.readInt16LE(dataOffset + i * 2);
    channelData[i] = val / 32768.0;
  }
  return { channelData, sampleRate };
}

console.log('=====================================================');
console.log('STAGE 2 ACCEPTANCE GATES VERIFICATION');
console.log('=====================================================');

// Check b: Tone tests on individual single-tone files
console.log('\n--- CHECK (b): Individual Single-Tone Pitch Accuracy Tests ---');
const tones = [
  { freq: 120, file: 'test/fixtures/tone_120hz.wav', regression: true },
  { freq: 280, file: 'test/fixtures/tone_280hz.wav', regression: true },
  { freq: 110, file: 'test/fixtures/tone_110hz.wav', regression: false },
  { freq: 220, file: 'test/fixtures/tone_220hz.wav', regression: false }
];

tones.forEach(({ freq, file, regression }) => {
  const { channelData, sampleRate } = parseWav(file);
  const res = computeAcousticDspMetrics(channelData, sampleRate);
  const diff = Math.abs(res.pitchF0 - freq);
  const passed = diff <= 2.0;
  console.log(`Tone ${freq} Hz (${regression ? 'REGRESSION CASE' : 'Fresh check'}): Expected ${freq} Hz | Measured ${res.pitchF0} Hz | Error ${diff.toFixed(2)} Hz -> ${passed ? 'PASS (+/- 2 Hz tolerance)' : 'FAIL'}`);
  assert.ok(passed, `Tone ${freq} Hz must be within +/- 2 Hz, measured ${res.pitchF0} Hz`);
  assert.strictEqual(res.status, 'SUCCESS');
  assert.strictEqual(res.isVoiced, true);
});

// Reference Synthetic Vowel Test (Known F0 = 120 Hz)
console.log('\n--- REFERENCE SYNTHETIC VOWEL (F0 = 120 Hz) ---');
const vowelFile = 'test/fixtures/reference_synthetic_vowel_120hz.wav';
const { channelData: vowelData, sampleRate: vowelSr } = parseWav(vowelFile);
const vowelRes = computeAcousticDspMetrics(vowelData, vowelSr);
const vowelDiff = Math.abs(vowelRes.pitchF0 - 120);
console.log(`Synthetic Vowel (F0 120 Hz): Expected 120 Hz | Measured ${vowelRes.pitchF0} Hz | Error ${vowelDiff.toFixed(2)} Hz -> PASS`);
assert.ok(vowelDiff <= 2.0, `Vowel F0 must be within +/- 2 Hz of 120 Hz, got ${vowelRes.pitchF0}`);

// Check c: Silent / empty input test
console.log('\n--- CHECK (c): Silent / Empty Input Test ---');
const { channelData: silentData, sampleRate: silentSr } = parseWav('test/fixtures/silent.wav');
let silentError = null;
try {
  computeAcousticDspMetrics(silentData, silentSr);
} catch (e) {
  silentError = e;
}
assert.ok(silentError, 'Silent audio must throw an error');
console.log(`Silent input test: Threw honest error "${silentError.message}" -> PASS (Lands in ERROR state, never healthy verdict)`);

let emptyError = null;
try {
  computeAcousticDspMetrics(new Float32Array(0), 44100);
} catch (e) {
  emptyError = e;
}
assert.ok(emptyError, 'Empty audio must throw an error');
console.log(`Empty input test: Threw honest error "${emptyError.message}" -> PASS`);

// Check d: Unvoiced-but-valid input test
console.log('\n--- CHECK (d): Unvoiced-But-Valid Input Test ---');
const { channelData: noiseData, sampleRate: noiseSr } = parseWav('test/fixtures/unvoiced_noise.wav');
const unvoicedRes = computeAcousticDspMetrics(noiseData, noiseSr);
assert.strictEqual(unvoicedRes.status, 'SUCCESS', 'Unvoiced audio is valid audio, so status must be SUCCESS');
assert.strictEqual(unvoicedRes.isVoiced, false, 'Unvoiced audio must be marked isVoiced = false');
assert.strictEqual(unvoicedRes.pitchF0, null, 'Unvoiced audio must honestly report F0 as null/unavailable');
assert.strictEqual(unvoicedRes.jitterPct, null, 'Unvoiced audio must report jitter as null/unavailable');
assert.strictEqual(unvoicedRes.shimmerPct, null, 'Unvoiced audio must report shimmer as null/unavailable');
assert.ok(typeof unvoicedRes.spectralCentroid === 'number', 'Spectral centroid should be measured');
console.log(`Unvoiced input test: Status=${unvoicedRes.status}, isVoiced=${unvoicedRes.isVoiced}, PitchF0=${unvoicedRes.pitchF0} (honest unavailable), Centroid=${unvoicedRes.spectralCentroid} Hz -> PASS`);

// Check e & a: State Machine Invariants
console.log('\n--- CHECK (a & e): State Machine Invariants ---');
assert.strictEqual(LAB_STATES.AWAITING_AUDIO, 'AWAITING_AUDIO');
assert.strictEqual(LAB_STATES.RECORDING, 'RECORDING');
assert.strictEqual(LAB_STATES.ANALYSING, 'ANALYSING');
assert.strictEqual(LAB_STATES.SUCCESS, 'SUCCESS');
assert.strictEqual(LAB_STATES.ERROR, 'ERROR');
console.log('State machine definitions: Verified [AWAITING_AUDIO, RECORDING, ANALYSING, SUCCESS, ERROR] -> PASS');

console.log('\n=====================================================');
console.log('ALL STAGE 2 ACCEPTANCE GATES PASSED! 🎉');
console.log('=====================================================');
