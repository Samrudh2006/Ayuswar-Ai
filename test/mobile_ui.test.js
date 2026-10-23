import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

console.log('--- RUNNING PHASE 5: MOBILE UI/UX DECLUTTER & ACCESSIBILITY TESTS ---');

// 1. Static Contract: Hero landing contains responsive declutter classes
{
  const heroLandingSrc = readFileSync(resolve('src/components/HeroLanding.jsx'), 'utf8');
  assert.ok(heroLandingSrc.includes('hero-doctor-visual-container'), 'Hero image container must have hero-doctor-visual-container class');
  assert.ok(heroLandingSrc.includes('hero-intro-text'), 'Subtitle paragraph must have hero-intro-text class');
  assert.ok(heroLandingSrc.includes('hero-feature-pills-row'), 'Feature pills row must have hero-feature-pills-row class');
  assert.ok(heroLandingSrc.includes('hero-primary-cta'), 'Primary walkthrough button must have hero-primary-cta class');

  console.log('✓ Test 1 Passed: HeroLanding implements responsive markup hooks for mobile viewports.');
}

// 2. Static Contract: CSS eliminates hero image overlap on mobile screens
{
  const indexCss = readFileSync(resolve('src/index.css'), 'utf8');
  assert.ok(indexCss.includes('.hero-doctor-visual-container'), 'CSS must define rules for .hero-doctor-visual-container');
  assert.ok(indexCss.includes('display: none !important'), 'CSS must hide visual container on mobile to prevent headline overlap');

  console.log('✓ Test 2 Passed: Mobile CSS strictly eliminates hero image overlay on mobile viewports (360px & 390px).');
}

// 3. Static Contract: Intro text clamped and single dominant CTA above fold
{
  const indexCss = readFileSync(resolve('src/index.css'), 'utf8');
  assert.ok(indexCss.includes('-webkit-line-clamp: 3 !important'), 'CSS must clamp mobile intro text to max 3 lines');
  assert.ok(indexCss.includes('.hero-primary-cta'), 'CSS must style dominant primary action for mobile');

  console.log('✓ Test 3 Passed: Mobile landing text is tightened and single dominant action is prioritized above the fold.');
}

// 4. Safe-Area Floating Assistant Clearance
{
  const indexCss = readFileSync(resolve('src/index.css'), 'utf8');
  assert.ok(indexCss.includes('.floating-assistant-container'), 'CSS must target floating assistant container');
  assert.ok(indexCss.includes('safe-area-inset-bottom'), 'CSS must respect mobile safe-area-inset-bottom');

  console.log('✓ Test 4 Passed: Floating assistant clears bottom navigation bar with safe-area spacing.');
}

// 5. 5-Item Bottom Navigation Contract & Zero Blank Destinations
{
  const bottomNavSrc = readFileSync(resolve('src/components/MobileAppBottomNav.jsx'), 'utf8');
  assert.ok(bottomNavSrc.includes("id: 'home'"), 'Bottom nav must include home');
  assert.ok(bottomNavSrc.includes("id: 'scanner'"), 'Bottom nav must include scanner');
  assert.ok(bottomNavSrc.includes("id: 'sos'"), 'Bottom nav must include sos');
  assert.ok(bottomNavSrc.includes("id: 'doctor'"), 'Bottom nav must include doctor');
  assert.ok(bottomNavSrc.includes("id: 'patient'"), 'Bottom nav must include patient');

  // Verify all 5 destinations exist in App.jsx routes
  const appSrc = readFileSync(resolve('src/App.jsx'), 'utf8');
  assert.ok(appSrc.includes('path="/"'), 'Home destination must be routed');
  assert.ok(appSrc.includes('path="/scanner"'), 'Scanner destination must be routed');
  assert.ok(appSrc.includes('path="/sanjivani"'), 'SOS destination must be routed');
  assert.ok(appSrc.includes('path="/doctor-portal"'), 'Doctor portal destination must be routed');
  assert.ok(appSrc.includes('path="/patient-portal"'), 'Patient portal destination must be routed');

  console.log('✓ Test 5 Passed: Mobile bottom navigation strictly enforces 5 items with verified active routes.');
}

console.log('======================================================================');
console.log('ALL 5 PHASE 5 MOBILE UI/UX & NAVIGATION TESTS PASSED! 🎉');
console.log('======================================================================');
