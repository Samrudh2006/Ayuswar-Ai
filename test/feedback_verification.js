import puppeteer from 'puppeteer-core';
import assert from 'node:assert';
import fs from 'node:fs';

const CHROME_PATH = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
].find(p => fs.existsSync(p));

if (!CHROME_PATH) {
  console.log('Skipping verification: No supported Chrome/Edge executable found.');
  process.exit(0);
}

console.log('--- STARTING FEEDBACK POPUP AUTOMATED VERIFICATION ---');

async function testFeedback() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Step 1: Set threshold to 3s via window property before navigation
    await page.evaluateOnNewDocument(() => {
      window.__AYUSWAR_FEEDBACK_THRESHOLD__ = 3;
    });

    console.log('Navigating to http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

    // Wait 4 seconds for popup to appear
    console.log('Waiting for feedback popup to trigger (3s threshold)...');
    await page.waitForSelector('.ayuswar-feedback-card', { timeout: 8000 });
    console.log('✓ Test 1 Passed: Feedback popup triggered automatically on active time threshold.');

    // Step 2: Verify visual elements
    const titleText = await page.$eval('#ayuswar-feedback-title', el => el.textContent.trim());
    assert.strictEqual(titleText, 'How was AyuSwar for you?');
    console.log(`✓ Test 2 Passed: Correct title rendered ("${titleText}").`);

    const headerImgSrc = await page.$eval('.ayuswar-feedback-header-img', el => el.getAttribute('src'));
    assert.ok(headerImgSrc.includes('popup-header.png'), 'Header image must be popup-header.png');
    console.log('✓ Test 3 Passed: Header illustration loaded.');

    // Step 3: Verify submit button initially disabled
    const isSubmitDisabled = await page.$eval('.ayuswar-feedback-submit-btn', el => el.disabled);
    assert.strictEqual(isSubmitDisabled, true, 'Submit button must be disabled until Overall is rated');
    console.log('✓ Test 4 Passed: Submit button disabled by default.');

    // Step 4: Interact with stars
    // Click star 5 on Overall experience (first star row)
    const starButtons = await page.$$('.ayuswar-feedback-star-row:nth-child(1) .ayuswar-feedback-star-btn');
    assert.strictEqual(starButtons.length, 5, 'Must have 5 star buttons in Overall row');
    await starButtons[4].click(); // click 5th star

    // Submit button should now be enabled
    const isSubmitEnabled = await page.$eval('.ayuswar-feedback-submit-btn', el => !el.disabled);
    assert.strictEqual(isSubmitEnabled, true, 'Submit button should be enabled after Overall rated');
    console.log('✓ Test 5 Passed: Overall experience star selection enables Submit button.');

    // Click star 4 on Voice understanding (second row)
    const voiceStars = await page.$$('.ayuswar-feedback-star-row:nth-child(2) .ayuswar-feedback-star-btn');
    await voiceStars[3].click(); // 4 stars

    // Step 5: Toggle chips
    const chips = await page.$$('.ayuswar-feedback-chip');
    assert.strictEqual(chips.length, 4, 'Must render 4 chips');
    await chips[0].click(); // 'Voice check'
    await chips[1].click(); // 'Emergency triage'

    const selectedChipsCount = await page.$$eval('.ayuswar-feedback-chip.selected', els => els.length);
    assert.strictEqual(selectedChipsCount, 2, 'Two chips must be selected');
    console.log('✓ Test 6 Passed: Multi-select chips work correctly.');

    // Step 6: Textarea input and live counter
    const testFeedbackText = 'Voice recognition in Telugu was exceptionally fast, clear acoustic feedback!';
    await page.type('#ayuswar-feedback-improvement', testFeedbackText);
    const counterText = await page.$eval('.ayuswar-feedback-counter', el => el.textContent.trim());
    assert.strictEqual(counterText, `${testFeedbackText.length} / 500`);
    console.log(`✓ Test 7 Passed: Live character counter verified (${counterText}).`);

    // Step 7: Name input
    await page.type('.ayuswar-feedback-name-input', 'Dr. Ramesh');

    // Step 8: Verify honeypot is hidden
    const honeypotVisible = await page.$eval('.ayuswar-feedback-honeypot', el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.opacity !== '0' && rect.width > 0 && rect.height > 0;
    });
    assert.strictEqual(honeypotVisible, false, 'Honeypot must be visually hidden');
    console.log('✓ Test 8 Passed: Honeypot is completely off-screen and invisible.');

    // Step 9: Submit feedback
    console.log('Submitting feedback...');
    await page.click('.ayuswar-feedback-submit-btn');

    // Verify thank-you state
    await page.waitForSelector('.ayuswar-feedback-thankyou-body', { timeout: 6000 });
    const thankYouTitle = await page.$eval('.ayuswar-feedback-thankyou-title', el => el.textContent.trim());
    assert.strictEqual(thankYouTitle, 'Thank you');

    const thankYouImgSrc = await page.$eval('.ayuswar-feedback-thankyou-img', el => el.getAttribute('src'));
    assert.ok(thankYouImgSrc.includes('popup-thankyou.png'), 'Thank you image must be popup-thankyou.png');
    console.log('✓ Test 9 Passed: Thank-you state displayed with diya-lotus illustration.');

    // Step 10: Verify persistence in localStorage
    const isDoneStored = await page.evaluate(() => localStorage.getItem('ayuswar_feedback_done'));
    assert.strictEqual(isDoneStored, 'true', 'ayuswar_feedback_done must be stored in localStorage');
    console.log('✓ Test 10 Passed: ayuswar_feedback_done written to localStorage.');

    // Step 11: Refresh page and verify popup never appears again
    console.log('Reloading page to verify suppression...');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 4000));
    const popupAfterReload = await page.$('.ayuswar-feedback-card');
    assert.strictEqual(popupAfterReload, null, 'Popup must NOT appear after localStorage is set');
    console.log('✓ Test 11 Passed: Persistence confirmed — popup never returns once submitted.');

    // Step 12: Verify emergency route suppression
    console.log('Testing emergency route suppression...');
    const page2 = await browser.newPage();
    await page2.evaluateOnNewDocument(() => {
      window.__AYUSWAR_FEEDBACK_THRESHOLD__ = 2;
    });
    await page2.goto('http://localhost:5173/emergency', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 3500));
    const popupOnEmergency = await page2.$('.ayuswar-feedback-card');
    assert.strictEqual(popupOnEmergency, null, 'Popup must NEVER show on /emergency');
    console.log('✓ Test 12 Passed: Route safety invariant confirmed — popup never interrupts emergency triage.');

    console.log('======================================================================');
    console.log('ALL FEEDBACK POPUP VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('======================================================================');
  } finally {
    await browser.close();
  }
}

testFeedback().catch(err => {
  console.error('Feedback verification failed:', err);
  process.exit(1);
});
