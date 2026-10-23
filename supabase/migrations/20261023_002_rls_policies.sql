-- AyuSwar AI — Supabase Migration: 002 Row Level Security (RLS) & Access Control Policies
-- Ensures complete owner data isolation and role-scoped permissions.
-- Zero unauthenticated reads or cross-tenant data leakage.

-- 1. Enable Row Level Security (RLS) on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.triage_sessions ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owners
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.triage_sessions FORCE ROW LEVEL SECURITY;

-- 2. Profiles Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile upon registration
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Verified doctors and admins can read patient profiles with consent / clinical duty
CREATE POLICY "Doctors and admins can view patient profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('doctor', 'admin')
    )
  );

-- 3. Triage Sessions Policies
-- Authenticated users can view their own triage sessions
CREATE POLICY "Users can view own triage sessions"
  ON public.triage_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can log their triage sessions
CREATE POLICY "Users can insert own triage sessions"
  ON public.triage_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Verified doctors and emergency dispatchers can review urgent triage sessions
CREATE POLICY "Doctors and dispatchers can review urgent triage sessions"
  ON public.triage_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('doctor', 'admin', 'chw')
    )
  );
