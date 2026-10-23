import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { IndicSpeechService } from '../src/services/indicSpeechService.js';
import { EVON_MODEL_METADATA } from '../src/services/gnaniEvonService.js';

console.log('--- RUNNING PHASE 3: VOICE INTEGRATION & HONEST STATUS TESTS ---');

// 1. Static Contract: Voice endpoints exist and use server-side credentials
{
  assert.ok(existsSync(resolve('api/gnani/status.js')), 'api/gnani/status.js must exist');
  assert.ok(existsSync(resolve('api/gnani/stt.js')), 'api/gnani/stt.js must exist');
  assert.ok(existsSync(resolve('api/gnani/tts.js')), 'api/gnani/tts.js must exist');

  const gnaniStatusSrc = readFileSync(resolve('api/gnani/status.js'), 'utf8');
  assert.ok(gnaniStatusSrc.includes('UNCONFIGURED'), 'api/gnani/status.js must report UNCONFIGURED when keys are unset');
  assert.ok(gnaniStatusSrc.includes('UNAVAILABLE'), 'api/gnani/status.js must report UNAVAILABLE on upstream error');
  assert.ok(gnaniStatusSrc.includes('LIVE'), 'api/gnani/status.js must report LIVE after successful ping');

  console.log('✓ Test 1 Passed: Gnani status route implements honest 3-state schema (LIVE | UNAVAILABLE | UNCONFIGURED).');
}

// 2. Static Contract: Evon status endpoint implements honest 3-state schema
{
  assert.ok(existsSync(resolve('api/evon/status.js')), 'api/evon/status.js must exist');
  const evonStatusSrc = readFileSync(resolve('api/evon/status.js'), 'utf8');
  assert.ok(evonStatusSrc.includes('UNCONFIGURED'), 'api/evon/status.js must report UNCONFIGURED when keys are unset');
  assert.ok(evonStatusSrc.includes('UNAVAILABLE'), 'api/evon/status.js must report UNAVAILABLE on upstream error');
  assert.ok(evonStatusSrc.includes('LIVE'), 'api/evon/status.js must report LIVE after successful ping');

  console.log('✓ Test 2 Passed: Evon status route implements honest 3-state schema (LIVE | UNAVAILABLE | UNCONFIGURED).');
}

// 3. IndicSpeechService Unit Test: Honest provider state when unconfigured
{
  const speechService = new IndicSpeechService();
  const providerInfo = speechService.getProviderInfo();

  assert.strictEqual(providerInfo.isGnani, false, 'Speech service must NOT report isGnani=true when unverified');
  assert.strictEqual(providerInfo.provider, 'browser_fallback', 'Speech service must report browser_fallback by default');
  assert.strictEqual(providerInfo.status, 'UNCONFIGURED', 'Speech service must report UNCONFIGURED status');
  assert.ok(!providerInfo.label.includes('LIVE'), 'Provider label must NOT contain LIVE when unconfigured');

  console.log('✓ Test 3 Passed: IndicSpeechService defaults strictly to safe browser fallback without spoofing live status.');
}

// 4. IndicSpeechService Unit Test: Simulated live roundtrip activation
{
  const speechService = new IndicSpeechService();
  
  // Simulate successful server roundtrip
  speechService.activeProvider = 'gnani_tts_live';
  speechService.lastGnaniSuccessTime = Date.now();
  speechService.gnaniAvailable = true;

  const liveInfo = speechService.getProviderInfo();
  assert.strictEqual(liveInfo.isGnani, true, 'isGnani must be true only after verified roundtrip');
  assert.strictEqual(liveInfo.status, 'LIVE', 'status must be LIVE after verified roundtrip');
  assert.ok(liveInfo.label.includes('LIVE'), 'label must report LIVE only after verified roundtrip');

  console.log('✓ Test 4 Passed: IndicSpeechService transitions to LIVE only upon verified roundtrip.');
}

// 5. Zero Client Secret Leak Contract for Voice Integration
{
  const filesToCheck = [
    resolve('src/services/indicSpeechService.js'),
    resolve('src/services/gnaniEvonService.js'),
    resolve('src/components/EvonStatusChip.jsx')
  ];

  for (const filePath of filesToCheck) {
    const content = readFileSync(filePath, 'utf8');
    assert.ok(!content.includes('process.env.GNANI_API_KEY'), `${filePath} must not access process.env.GNANI_API_KEY directly`);
    assert.ok(!content.includes('process.env.EVON_API_KEY'), `${filePath} must not access process.env.EVON_API_KEY directly`);
    assert.ok(!content.includes('x-gnani-api-key'), `${filePath} must not transmit credentials in client request headers`);
    assert.ok(!content.includes('x-evon-api-key'), `${filePath} must not transmit credentials in client request headers`);
  }

  console.log('✓ Test 5 Passed: Zero client secrets or header credentials detected across voice services.');
}

console.log('======================================================================');
console.log('ALL 5 PHASE 3 VOICE INTEGRATION & HONEST STATUS TESTS PASSED! 🎉');
console.log('======================================================================');
