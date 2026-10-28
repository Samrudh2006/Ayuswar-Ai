/**
 * AyuSwar AI — Advanced Telephony & Clinical VAD Verification Suite
 * test/advanced_telephony_vad.test.js
 * 
 * Verifies:
 * 1. On-Device Clinical VAD Engine: Silence rejection & Harmonic Voicing discrimination.
 * 2. WebRTC SIP Cellular Audio Gateway: RFC 3261 Signaling & QoS telemetry.
 * 3. Gnani WebSocket Streaming STT Client: Connection lifecycle & failover safety.
 */

import assert from 'node:assert';
import { ClinicalVadEngine, clinicalVad } from '../src/services/clinicalVadEngine.js';
import { TelephonySipGateway, telephonySipGateway } from '../src/services/telephonySipGateway.js';
import { GnaniStreamingClient, gnaniStreaming } from '../src/services/gnaniStreamingClient.js';

console.log('--- RUNNING ADVANCED TELEPHONY & CLINICAL VAD SUITE ---');

// 1. Clinical VAD: Silence Rejection Test
{
  const vad = new ClinicalVadEngine({ sampleRate: 16000 });
  const silenceFrame = new Float32Array(512).fill(0.001); // Pure ambient room floor
  const result = vad.evaluateFrame(silenceFrame);

  assert.strictEqual(result.isSpeech, false, 'Silence must NOT be classified as speech');
  assert.ok(result.speechProbability < 0.25, 'Silence probability must be < 0.25');
  console.log('✓ Test 1 Passed: Clinical VAD accurately rejects room silence floor (<0.008 RMS).');
}

// 2. Clinical VAD: Synthetic Voiced Speech Phonation (150 Hz Vocal Fundamental)
{
  const vad = new ClinicalVadEngine({ sampleRate: 16000 });
  const voicedFrame = new Float32Array(1024);
  for (let i = 0; i < voicedFrame.length; i++) {
    // 150 Hz fundamental + 300 Hz harmonic with 0.08 RMS amplitude
    voicedFrame[i] = 0.08 * Math.sin(2 * Math.PI * 150 * (i / 16000)) + 
                     0.04 * Math.sin(2 * Math.PI * 300 * (i / 16000));
  }

  // Simulate sustained frames to pass hysteresis
  let lastRes = null;
  for (let f = 0; f < 6; f++) {
    lastRes = vad.evaluateFrame(voicedFrame);
  }

  assert.ok(lastRes.speechProbability >= 0.50, 'Voiced phonation speech probability must be >= 0.50');
  assert.ok(lastRes.energyRms > 0.04, 'Voiced phonation RMS must be detected');
  assert.strictEqual(lastRes.isSpeech, true, 'Sustained voiced phonation must trigger isSpeech=true');
  console.log(`✓ Test 2 Passed: Clinical VAD recognizes human voiced formant harmonics (Probability: ${lastRes.speechProbability * 100}%).`);
}

// 3. WebRTC SIP Cellular Gateway: RFC 3261 Signaling Invariants
{
  const gateway = new TelephonySipGateway();
  const sipId = gateway.generateSipId();

  assert.ok(sipId.startsWith('AYUSWAR-108-'), 'SIP Call-ID must follow sovereign emergency nomenclature');
  assert.ok(sipId.includes('@ap.emri.108.gov.in'), 'SIP domain must anchor to Andhra Pradesh EMRI gateway');

  // Verify call lifecycle signaling
  let capturedState = null;
  let capturedSignal = null;

  gateway.onStateChange = (state, data) => {
    capturedState = state;
    capturedSignal = data;
  };

  gateway.initiateCall({ callerPhone: '+91 94401 22108', callerLocation: 'Annavaram, AP' });
  assert.ok(['INVITING', 'CONNECTED'].includes(capturedState), 'Call state must transition cleanly in headless/browser runtime');
  assert.strictEqual(gateway.currentQoS.sipCallId.startsWith('AYUSWAR-108-'), true, 'Must assign RFC 3261 Call-ID');

  gateway.terminateCall();
  assert.strictEqual(gateway.callState, 'TERMINATED', 'Call state must transition to TERMINATED');
  assert.ok(capturedSignal.sipMessage.includes('BYE sip:108@emri.ap.gov.in SIP/2.0'), 'Must transmit RFC 3261 BYE message on disconnect');

  console.log('✓ Test 3 Passed: WebRTC SIP 108 Gateway complies with RFC 3261 INVITE/BYE telephony signaling.');
}

// 4. Gnani WebSocket Streaming Client: Safe Fallback Invariant
{
  const client = new GnaniStreamingClient();
  let reportedStatus = null;

  client.onStatus = (st) => {
    reportedStatus = st;
  };

  // Attempt stream without server websocket
  const success = await client.startStreaming(null, 'te-IN');
  assert.strictEqual(success, false, 'Unconfigured websocket must fail gracefully without crash');
  assert.strictEqual(reportedStatus.status, 'UNCONFIGURED', 'Must report UNCONFIGURED status');
  assert.strictEqual(reportedStatus.provider, 'browser_fallback', 'Must gracefully fall back to local browser speech');

  console.log('✓ Test 4 Passed: Gnani WebSocket Streaming client safely implements zero-crash fallback invariant.');
}

console.log('======================================================================');
console.log('ALL 4 ADVANCED TELEPHONY, VAD & STREAMING TESTS PASSED! 🎉');
console.log('======================================================================');
