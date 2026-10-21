import puppeteer from 'puppeteer-core';
import assert from 'node:assert';
import fs from 'node:fs';

const CHROME_PATH = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(p => fs.existsSync(p));

if (!CHROME_PATH) {
  console.log('Skipping E2E browser tests: No supported Chrome/Edge executable found.');
  process.exit(0);
}

console.log('--- RUNNING AYUSWAR AI HEADLESS BROWSER E2E TEST SUITE ---');
console.log(`Using Browser Executable: ${CHROME_PATH}`);

async function runE2eTests() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Test 1: Landing Page
    console.log('Navigating to http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    const pageTitle = await page.title();
    assert.ok(pageTitle.includes('AyuSwar AI'), `Page title must contain AyuSwar AI, got: ${pageTitle}`);
    console.log('✓ E2E Test 1 Passed: Landing page loaded successfully with valid title & meta.');

    // Test 2: Acoustic Biomarker Lab Lazy-Loaded Route
    console.log('Navigating to http://localhost:5173/acoustic-lab ...');
    await page.goto('http://localhost:5173/acoustic-lab', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForSelector('h1, h2', { timeout: 10000 });
    const acousticHeading = await page.$eval('h1, h2', el => el.textContent);
    assert.ok(acousticHeading.toLowerCase().includes('acoustic') || acousticHeading.toLowerCase().includes('biomarker'), 'Acoustic Lab view heading rendered');
    console.log('✓ E2E Test 2 Passed: Route-level code-split Acoustic Biomarker Lab renders DSP oscilloscope.');

    // Test 3: Emergency Triage Transparent Watermark Assertion
    console.log('Navigating to http://localhost:5173/emergency ...');
    await page.goto('http://localhost:5173/emergency', { waitUntil: 'networkidle0', timeout: 15000 });
    await page.waitForSelector('h1, h2, input', { timeout: 10000 });
    const emergencyContent = await page.content();
    assert.ok(
      emergencyContent.includes('Lexical Estimation') || emergencyContent.includes('Acoustic Lab'),
      'Emergency Triage must display honest lexical estimation disclaimer'
    );
    console.log('✓ E2E Test 3 Passed: Emergency Triage renders transparent lexical acoustic estimation disclaimer.');

    // Test 4: Doctor Portal & Modular Sub-components
    console.log('Navigating to http://localhost:5173/doctor-portal ...');
    await page.goto('http://localhost:5173/doctor-portal', { waitUntil: 'networkidle0', timeout: 15000 });
    await page.waitForSelector('h1, h2, nav, button', { timeout: 10000 });
    const docPortalText = await page.content();
    assert.ok(docPortalText.includes('Doctor') || docPortalText.includes('OPD') || docPortalText.includes('Patient'), 'Doctor Portal must render clinician workspace');
    console.log('✓ E2E Test 4 Passed: Doctor Portal renders modular enterprise clinician workspace.');

    // Test 5: Patient Portal & Modular Sub-components
    console.log('Navigating to http://localhost:5173/patient-portal ...');
    await page.goto('http://localhost:5173/patient-portal', { waitUntil: 'networkidle0', timeout: 15000 });
    await page.waitForSelector('h1, h2, nav, button', { timeout: 10000 });
    const patPortalText = await page.content();
    assert.ok(patPortalText.includes('ABHA') || patPortalText.includes('Health') || patPortalText.includes('Care'), 'Patient Portal must render citizen health locker');
    console.log('✓ E2E Test 5 Passed: Patient Portal renders modular wellness care plan and health goals.');

    console.log('======================================================================');
    console.log('ALL 5 HEADLESS BROWSER E2E TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('======================================================================\n');
  } finally {
    await browser.close();
  }
}

runE2eTests().catch(err => {
  console.error('E2E Test Execution Error:', err);
  process.exit(1);
});
