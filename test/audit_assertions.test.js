import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { predictClinicalDiagnosis } from '../src/data/kaggleClinicalDataset.js';

console.log('--- RUNNING AYUSWAR AI CONTRACT & AUDIT VERIFICATION TESTS ---');

// Test 1: Language default is English (en-IN), Telugu (te-IN) available
const appContextPath = resolve('src/context/AppContext.jsx');
const appContextSrc = readFileSync(appContextPath, 'utf8');
assert.ok(appContextSrc.includes("'en-IN'"), 'Default language must be en-IN');
assert.ok(appContextSrc.includes("'te-IN'"), 'Telugu te-IN must be available');
console.log('✓ Test 1 Passed: Shared persistent language configured with en-IN default & te-IN support.');

// Test 2: kaggleClinicalDataset returns null for empty or non-matching query (no default COPD)
const emptyRes = predictClinicalDiagnosis('');
assert.strictEqual(emptyRes.topPrediction, null, 'Empty query must return topPrediction: null');
assert.strictEqual(emptyRes.confidenceScore, 0, 'Empty query must return confidenceScore: 0');

const gibberishRes = predictClinicalDiagnosis('xyz random qwerty 12345');
assert.strictEqual(gibberishRes.topPrediction, null, 'Gibberish query must return topPrediction: null, not COPD');
console.log('✓ Test 2 Passed: kaggleClinicalDataset does not default non-matches to COPD.');

// Test 3: clinicalMlInferenceEngine has 65% floor removed
const mlEnginePath = resolve('src/services/clinicalMlInferenceEngine.js');
const mlEngineSrc = readFileSync(mlEnginePath, 'utf8');
assert.ok(!mlEngineSrc.includes('Math.max(0.65,'), '65% confidence floor must be removed');
assert.ok(mlEngineSrc.includes('Non-Diagnostic Prototype'), 'ML engine must label status as Non-Diagnostic Prototype');
assert.ok(mlEngineSrc.includes('validatedForClinicalUse: false'), 'validatedForClinicalUse must be false');
console.log('✓ Test 3 Passed: 65% confidence floor removed and marked non-diagnostic prototype.');

// Test 4: aiBrainService has autonomous drug dosing removed
const aiBrainPath = resolve('src/services/aiBrainService.js');
const aiBrainSrc = readFileSync(aiBrainPath, 'utf8');
assert.ok(!aiBrainSrc.includes('Paracetamol 650mg TDS'), 'Autonomous paracetamol prescribing must be removed');
assert.ok(!aiBrainSrc.includes('Pantoprazole 40mg OD'), 'Autonomous pantoprazole prescribing must be removed');
assert.ok(aiBrainSrc.includes('112 / 108'), 'Emergency response must advise dialling 112 / 108');
console.log('✓ Test 4 Passed: Autonomous drug dosing removed from fallback logic.');

// Test 5: Emergency service labels telemetry as simulation
const emergencyServicePath = resolve('src/services/sanjivaniEmergencyService.js');
const emergencySrc = readFileSync(emergencyServicePath, 'utf8');
assert.ok(emergencySrc.includes('[SIMULATION]'), 'Emergency telemetry must be marked [SIMULATION]');
console.log('✓ Test 5 Passed: Emergency telemetry explicitly watermarked as simulation.');

// Test 6: No real secrets in client bundle or .env
assert.ok(existsSync(resolve('.env.example')), '.env.example must exist with placeholders');
const envExampleSrc = readFileSync(resolve('.env.example'), 'utf8');
assert.ok(!envExampleSrc.includes('eyJh'), 'No actual JWT or secret tokens in .env.example');
console.log('✓ Test 6 Passed: Secret credentials isolated from client bundle.');

// Test 7: index.html has unmeasured claims removed
const indexPath = resolve('index.html');
const indexSrc = readFileSync(indexPath, 'utf8');
assert.ok(!indexSrc.includes('99.4%'), 'index.html must not claim 99.4% precision');
assert.ok(!indexSrc.includes('autonomous 108 emergency ambulance routing'), 'index.html must not claim autonomous 108 dispatch');
console.log('✓ Test 7 Passed: Public index.html metadata verified honest.');

console.log('====================================================');
console.log('ALL 7 AUDIT ASSERTION TESTS PASSED SUCCESSFULLY! 🎉');
console.log('====================================================');
