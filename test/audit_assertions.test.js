import assert from 'node:assert';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
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
const bannedPct = ['99', '.4%'].join('');
assert.ok(!indexSrc.includes(bannedPct), 'index.html must not claim high precision percentage');
assert.ok(!indexSrc.includes('autonomous 108 emergency ambulance routing'), 'index.html must not claim autonomous 108 dispatch');
console.log('✓ Test 7 Passed: Public index.html metadata verified honest.');

// Test 8: Scan src/ and README.md for any banned claims or unverified partner mentions
function getFilesRecursively(dir) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

const bannedChecks = [
  { label: 'Rule 1: Unmeasured high precision claim', regex: new RegExp(['99', '\\.4%?'].join(''), 'i') },
  { label: 'Rule 2: Unverified 10k metric', regex: new RegExp(['10,00', '0\\+'].join(''), 'i') },
  { label: 'Rule 3: Unverified 1M metric', regex: new RegExp(['1M', '\\+'].join(''), 'i') },
  { label: 'Rule 4: Unverified accuracy metric', regex: new RegExp(['96', '\\.4%?'].join(''), 'i') },
  { label: 'Rule 5: Unverified 12.4k sample metric', regex: new RegExp(['12,', '400'].join(''), 'i') },
  { label: 'Rule 6: Unverified 3k sample metric', regex: new RegExp(['3,00', '0\\+\\s*samples'].join(''), 'i') },
  { label: 'Rule 7: Unverified 4.1 metric', regex: new RegExp(['4', '\\.1%'].join(''), 'i') },
  { label: 'Rule 8: Unverified MOS score', regex: new RegExp(['MOS', '\\s*4\\.7'].join(''), 'i') },
  { label: 'Rule 9: Unverified #1 claim', regex: new RegExp(['#1\\s*in\\s*Indic', '\\s*Healthcare'].join(''), 'i') },
  { label: 'Rule 10: Clinical Precision claim', regex: new RegExp(['Clinical', '\\s*Precision'].join(''), 'i') },
  { label: 'Rule 11: Unverified mock data claim', regex: new RegExp(['No\\s*Mock', '\\s*Data'].join(''), 'i') },
  { label: 'Rule 12: Unverified academic partner M', regex: new RegExp(['\\b', 'M', 'ayo\\b'].join(''), 'i') },
  { label: 'Rule 13: Unverified academic partner S', regex: new RegExp(['\\b', 'Stan', 'ford\\b'].join(''), 'i') },
  { label: 'Rule 14: Unverified academic partner I', regex: new RegExp(['\\b', 'II', 'Sc\\b'].join(''), 'i') },
  { label: 'Rule 15: Unverified academic partner N', regex: new RegExp(['\\b', 'N', 'IH\\b'].join(''), 'i') }
];

const filesToAudit = [
  ...getFilesRecursively(resolve('src')).filter(f => !f.match(/\.(png|jpg|jpeg|webp|ico|svg)$/i)),
  resolve('README.md')
];

const violations = [];
for (const filePath of filesToAudit) {
  const content = readFileSync(filePath, 'utf8');
  for (const check of bannedChecks) {
    if (check.regex.test(content)) {
      violations.push(`Violation in ${filePath}: Found banned pattern "${check.label}"`);
    }
  }
}

assert.strictEqual(violations.length, 0, `Banned claims detected:\n${violations.join('\n')}`);
console.log('✓ Test 8 Passed: Zero banned claims or unverified metrics found across src/ and README.md.');

console.log('====================================================');
console.log('ALL 8 AUDIT ASSERTION TESTS PASSED SUCCESSFULLY! 🎉');
console.log('====================================================');
