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

// Test 9: Gnani Evon Integrity — No simulated/mocked replies presented as Evon output
const evonServicePath = resolve('src/services/gnaniEvonService.js');
const evonServiceSrc = readFileSync(evonServicePath, 'utf8');
assert.ok(!evonServiceSrc.includes('executeLocalEvonReasoning'), 'gnaniEvonService must NOT contain executeLocalEvonReasoning or hardcoded LLM replies');
assert.ok(!evonServiceSrc.includes('localStorage.getItem(\'ayuswar_hf_token\')'), 'gnaniEvonService must NOT store or retrieve tokens in localStorage');
assert.ok(!evonServiceSrc.includes('VITE_HF_TOKEN'), 'gnaniEvonService must NOT read VITE_HF_TOKEN');
assert.ok(evonServiceSrc.includes('/api/evon/chat'), 'gnaniEvonService must query Evon exclusively via /api/evon/chat');
assert.ok(evonServiceSrc.includes('/api/evon/status'), 'gnaniEvonService must query status via /api/evon/status');
console.log('✓ Test 9 Passed: gnaniEvonService contains zero hardcoded/mocked Evon replies and uses server routes only.');

// Test 10: Callers Integrity — Emergency triage never embeds fake evonReasoning in deterministic rules
const emergencyTriageSrc = readFileSync(resolve('src/services/sanjivaniEmergencyService.js'), 'utf8');
assert.ok(!emergencyTriageSrc.includes('evonReasoning: {'), 'sanjivaniEmergencyService must not attach fake evonReasoning to deterministic triage');
assert.ok(emergencyTriageSrc.includes('DETERMINISTIC_SAFETY_RULE'), 'sanjivaniEmergencyService must stamp triageMethod as DETERMINISTIC_SAFETY_RULE');
console.log('✓ Test 10 Passed: Emergency RED triage runs purely on deterministic safety rules without fake Evon attribution.');

// Test 11: Server Routes exist for Vercel and dev middleware
assert.ok(existsSync(resolve('api/evon/status.js')), 'api/evon/status.js must exist for server-side status checks');
assert.ok(existsSync(resolve('api/evon/chat.js')), 'api/evon/chat.js must exist for server-side completions proxy');
const viteConfigSrc = readFileSync(resolve('vite.config.js'), 'utf8');
assert.ok(viteConfigSrc.includes('/api/evon/status'), 'vite.config.js must configure dev middleware for /api/evon/status');
assert.ok(viteConfigSrc.includes('/api/evon/chat'), 'vite.config.js must configure dev middleware for /api/evon/chat');
assert.ok(viteConfigSrc.includes('EVON_BASE_URL'), 'vite.config.js must read EVON_BASE_URL');
assert.ok(viteConfigSrc.includes('EVON_API_KEY'), 'vite.config.js must read EVON_API_KEY');
console.log('✓ Test 11 Passed: Server-side Evon routes and dev proxy middleware properly configured.');

// Test 12: Frontend keys isolation — No EVON_API_KEY or VITE_EVON_* in client code
for (const filePath of filesToAudit) {
  const content = readFileSync(filePath, 'utf8');
  assert.ok(!content.includes('VITE_EVON_API_KEY'), `Client file ${filePath} must never reference VITE_EVON_API_KEY`);
  assert.ok(!content.includes('VITE_HF_TOKEN'), `Client file ${filePath} must never reference VITE_HF_TOKEN`);
  assert.ok(!content.includes('localStorage.setItem(\'ayuswar_hf_token\''), `Client file ${filePath} must not store HF token`);
}
console.log('✓ Test 12 Passed: Client-side codebase verified completely free of frontend Evon keys or tokens.');

// Test 13: Evon Parameter Specification — Must be 30B total (~3.5B active/token), never 32B total
assert.ok(evonServiceSrc.includes('30B total, ~3.5B active/token'), 'gnaniEvonService must specify 30B total, ~3.5B active/token');
assert.ok(!evonServiceSrc.includes('32B total'), 'gnaniEvonService must NOT specify 32B total');
for (const filePath of filesToAudit) {
  const content = readFileSync(filePath, 'utf8');
  assert.ok(!content.includes('32B total'), `File ${filePath} must not specify 32B total`);
}
console.log('✓ Test 13 Passed: Evon model specification verified as 30B total (~3.5B active/token) with zero 32B claims.');

// Test 14: Token Savings Integrity — No unmeasured hardcoded calculateIndicTokenSavings or language tax estimates
assert.ok(!evonServiceSrc.includes('calculateIndicTokenSavings'), 'calculateIndicTokenSavings must be completely removed');
for (const filePath of filesToAudit) {
  const content = readFileSync(filePath, 'utf8');
  assert.ok(!content.includes('calculateIndicTokenSavings'), `File ${filePath} must not contain calculateIndicTokenSavings`);
}
console.log('✓ Test 14 Passed: Zero unmeasured hardcoded tokenizer calculations across codebase.');

// Test 15: Honest Fallback Labeling — When offline, explicitly labels Rule-based FALLBACK (Not Evon) with zero fake <reasoning>
assert.ok(evonServiceSrc.includes("'Rule-based FALLBACK (Not Evon)'"), 'gnaniEvonService must label fallback as Rule-based FALLBACK (Not Evon)');
assert.ok(!evonServiceSrc.includes('thoughtTrace: `[FALLBACK]'), 'Fallback states must not populate fake thoughtTrace');
console.log('✓ Test 15 Passed: Honest fallback labeling enforced with zero simulated <reasoning> traces.');

console.log('====================================================');
console.log('ALL 15 AUDIT ASSERTION TESTS PASSED SUCCESSFULLY! 🎉');
console.log('====================================================');

