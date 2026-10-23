-- AyuSwar AI — Supabase Migration: 001 Initial Clinical & Triage Schema
-- Compliant with ABDM Health Data Management Policy & India DPDP Act 2023.
-- NOTE: Stores minimal clinical triage metadata only. Zero raw patient voice or audio streams stored.

-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('doctor', 'patient', 'chw', 'admin')),
  abha_id TEXT UNIQUE,
  mobile TEXT,
  email TEXT UNIQUE,
  preferred_language TEXT NOT NULL DEFAULT 'te' CHECK (preferred_language IN ('te', 'hi', 'en', 'ta', 'kn', 'mr')),
  license_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for ABHA lookup
CREATE INDEX IF NOT EXISTS idx_profiles_abha_id ON public.profiles(abha_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. Triage Sessions Table (Conservative Emergency Clinical Urgency Records)
CREATE TABLE IF NOT EXISTS public.triage_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  triage_level TEXT NOT NULL CHECK (triage_level IN ('RED', 'YELLOW', 'GREEN')),
  severity TEXT NOT NULL,
  transcript_snippet TEXT,
  acoustic_panic_index INTEGER CHECK (acoustic_panic_index >= 0 AND acoustic_panic_index <= 100),
  suspected_condition TEXT NOT NULL,
  icd10 TEXT,
  priority_protocol TEXT NOT NULL,
  execution_source TEXT NOT NULL CHECK (execution_source IN ('RULES_ONLY', 'RULES_PLUS_MODEL_ADVISORY', 'RULES_FALLBACK_ON_ERROR', 'LOCAL_RULES_FALLBACK')),
  model_escalation_applied BOOLEAN NOT NULL DEFAULT FALSE,
  is_emergency_override BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for rapid triage queries
CREATE INDEX IF NOT EXISTS idx_triage_user_id ON public.triage_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_triage_level ON public.triage_sessions(triage_level);
CREATE INDEX IF NOT EXISTS idx_triage_created_at ON public.triage_sessions(created_at DESC);

-- Automatic updated_at trigger for profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
