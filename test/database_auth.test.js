import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { isSupabaseConfigured, supabaseConfig } from '../src/services/supabaseClient.js';
import { authService } from '../src/services/authService.js';

console.log('--- RUNNING PHASE 4: DATABASE & AUTHENTICATION TESTS ---');

// 1. Static Contract: Supabase Migrations Exist & Have Correct Schema
{
  const migration1Path = resolve('supabase/migrations/20261023_001_initial_schema.sql');
  const migration2Path = resolve('supabase/migrations/20261023_002_rls_policies.sql');

  assert.ok(existsSync(migration1Path), '20261023_001_initial_schema.sql must exist');
  assert.ok(existsSync(migration2Path), '20261023_002_rls_policies.sql must exist');

  const schemaSql = readFileSync(migration1Path, 'utf8');
  assert.ok(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.profiles'), 'Must define public.profiles table');
  assert.ok(schemaSql.includes('CREATE TABLE IF NOT EXISTS public.triage_sessions'), 'Must define public.triage_sessions table');
  assert.ok(schemaSql.includes('CHECK (role IN'), 'Must enforce role constraint on profiles');
  assert.ok(schemaSql.includes('CHECK (triage_level IN'), 'Must enforce triage_level constraint');

  console.log('✓ Test 1 Passed: Supabase schema migrations define profiles and triage_sessions with data integrity constraints.');
}

// 2. Static Contract: Row Level Security (RLS) Enabled & Forced on All Tables
{
  const rlsSql = readFileSync(resolve('supabase/migrations/20261023_002_rls_policies.sql'), 'utf8');

  assert.ok(rlsSql.includes('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;'), 'Must enable RLS on profiles');
  assert.ok(rlsSql.includes('ALTER TABLE public.triage_sessions ENABLE ROW LEVEL SECURITY;'), 'Must enable RLS on triage_sessions');
  assert.ok(rlsSql.includes('ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;'), 'Must force RLS on profiles');
  assert.ok(rlsSql.includes('ALTER TABLE public.triage_sessions FORCE ROW LEVEL SECURITY;'), 'Must force RLS on triage_sessions');

  assert.ok(rlsSql.includes('auth.uid() = id'), 'Profiles policies must scope to auth.uid() = id');
  assert.ok(rlsSql.includes('auth.uid() = user_id'), 'Triage policies must scope to auth.uid() = user_id');

  console.log('✓ Test 2 Passed: Row Level Security (RLS) is strictly enabled and owner-scoped on all tables.');
}

// 3. Client Isolation Contract: Zero SUPABASE_SERVICE_ROLE_KEY in Frontend
{
  const srcFiles = [
    'src/services/supabaseClient.js',
    'src/services/authService.js',
    'src/views/UnifiedAuthView.jsx'
  ];

  for (const file of srcFiles) {
    const fullPath = resolve(file);
    if (existsSync(fullPath)) {
      const content = readFileSync(fullPath, 'utf8');
      assert.ok(!content.includes('SUPABASE_SERVICE_ROLE_KEY'), `${file} must NOT reference SUPABASE_SERVICE_ROLE_KEY`);
    }
  }

  console.log('✓ Test 3 Passed: Zero server service-role keys bundled or referenced in frontend code.');
}

// 4. AuthService Unit Test: Unconfigured Prototype Graceful Degradation
{
  assert.strictEqual(isSupabaseConfigured, false, 'Default test environment must report unconfigured Supabase');
  const providerInfo = authService.getProviderInfo();
  assert.strictEqual(providerInfo.configured, false);
  assert.strictEqual(providerInfo.authMode, 'DEMO_PROTOTYPE');

  console.log('✓ Test 4 Passed: AuthService accurately reports unconfigured prototype mode without crashing.');
}

// 5. AuthService Unit Test: OTP Request & Verification in Demo Mode
{
  const otpReq = await authService.requestOtp({ destination: '+91-9876543210', type: 'phone' });
  assert.strictEqual(otpReq.success, true);
  assert.strictEqual(otpReq.isDemo, true);

  const otpVerify = await authService.verifyOtp({
    destination: '+91-9876543210',
    token: '123456',
    type: 'phone',
    role: 'doctor',
    fullName: 'Dr. Test Prasad'
  });

  assert.strictEqual(otpVerify.success, true);
  assert.strictEqual(otpVerify.isDemo, true);
  assert.strictEqual(otpVerify.user.role, 'doctor');
  assert.strictEqual(otpVerify.user.fullName, 'Dr. Test Prasad');

  console.log('✓ Test 5 Passed: AuthService handles demo OTP request and verification seamlessly.');
}

// 6. Server Token Verification Route
{
  const verifyPath = resolve('api/auth/verify.js');
  assert.ok(existsSync(verifyPath), 'api/auth/verify.js must exist for server-side token checks');
  const verifySrc = readFileSync(verifyPath, 'utf8');
  assert.ok(verifySrc.includes('checkRateLimit'), 'api/auth/verify.js must enforce rate limiting');
  assert.ok(verifySrc.includes('sanitizeClientError'), 'api/auth/verify.js must sanitize errors');

  console.log('✓ Test 6 Passed: Server-side token verification endpoint properly configured.');
}

// 7. Supabase Feedback Table Migration & Anonymous Insert Contract
{
  const feedbackMigrationPath = resolve('supabase/migrations/20261024_003_feedback.sql');
  assert.ok(existsSync(feedbackMigrationPath), '20261024_003_feedback.sql must exist');

  const feedbackSql = readFileSync(feedbackMigrationPath, 'utf8');
  assert.ok(feedbackSql.includes('create table if not exists public.feedback'), 'Must create public.feedback table');
  assert.ok(feedbackSql.includes('overall_stars int not null check (overall_stars between 1 and 5)'), 'Must enforce overall_stars constraint');
  assert.ok(feedbackSql.includes('alter table public.feedback enable row level security;'), 'Must enable RLS on feedback');
  assert.ok(feedbackSql.includes('on public.feedback for insert to anon with check (true)'), 'Must grant anon insert policy on feedback');

  console.log('✓ Test 7 Passed: Supabase feedback schema migration and anonymous insert policies verified.');
}

console.log('======================================================================');
console.log('ALL 7 PHASE 4 DATABASE & AUTHENTICATION TESTS PASSED! 🎉');
console.log('======================================================================');
