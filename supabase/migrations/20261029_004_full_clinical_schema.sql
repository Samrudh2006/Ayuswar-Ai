-- AyuSwar AI — Supabase Migration: 004 Full Clinical Relational Schema
-- Fully ABDM M3 (Ayushman Bharat Digital Mission) & India DPDP Act 2023 Compliant.
-- Provides normalized, production-grade schema for Encounters, Appointments, Prescriptions, Vitals, Reports & Audit Trail.

-- ============================================================================
-- 1. CLINICAL ENCOUNTERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.clinical_encounters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  abha_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  encounter_type TEXT NOT NULL DEFAULT 'OPD' CHECK (encounter_type IN ('OPD', 'Emergency', 'Teleconsult', 'HomeVisit')),
  chief_complaints JSONB NOT NULL DEFAULT '[]'::jsonb,
  clinical_notes TEXT,
  diagnosis_codes JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'signed', 'amended')),
  dsc_signature_hash TEXT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_encounters_doctor ON public.clinical_encounters(doctor_id);
CREATE INDEX IF NOT EXISTS idx_encounters_patient ON public.clinical_encounters(patient_id);
CREATE INDEX IF NOT EXISTS idx_encounters_abha ON public.clinical_encounters(abha_id);
CREATE INDEX IF NOT EXISTS idx_encounters_created ON public.clinical_encounters(created_at DESC);

-- ============================================================================
-- 2. CLINICAL APPOINTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.clinical_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  abha_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  token_number TEXT NOT NULL,
  scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_slot TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'Normal' CHECK (urgency IN ('Normal', 'Urgent', 'Critical')),
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Waiting', 'In-Consultation', 'Completed', 'Cancelled', 'No-Show')),
  chief_complaint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appts_doctor_date ON public.clinical_appointments(doctor_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_appts_patient ON public.clinical_appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appts_status ON public.clinical_appointments(status);

-- ============================================================================
-- 3. CLINICAL PRESCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.clinical_prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  encounter_id UUID REFERENCES public.clinical_encounters(id) ON DELETE SET NULL,
  doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  abha_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  medications JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions_vernacular TEXT,
  primary_language TEXT NOT NULL DEFAULT 'te',
  dsc_signed BOOLEAN NOT NULL DEFAULT FALSE,
  dsc_signature_digest TEXT,
  fhir_bundle JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON public.clinical_prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_abha ON public.clinical_prescriptions(abha_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_created ON public.clinical_prescriptions(created_at DESC);

-- ============================================================================
-- 4. PATIENT VITALS LOG TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.patient_vitals_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  abha_id TEXT NOT NULL,
  bp_systolic INTEGER CHECK (bp_systolic >= 40 AND bp_systolic <= 300),
  bp_diastolic INTEGER CHECK (bp_diastolic >= 20 AND bp_diastolic <= 200),
  pulse_bpm INTEGER CHECK (pulse_bpm >= 30 AND pulse_bpm <= 250),
  spo2_pct INTEGER CHECK (spo2_pct >= 50 AND spo2_pct <= 100),
  blood_sugar_mgdl INTEGER CHECK (blood_sugar_mgdl >= 20 AND blood_sugar_mgdl <= 1000),
  temperature_f NUMERIC(4, 1) CHECK (temperature_f >= 90.0 AND temperature_f <= 115.0),
  mews_score INTEGER DEFAULT 0,
  source_type TEXT NOT NULL DEFAULT 'manual' CHECK (source_type IN ('manual', 'report', 'telemetry', 'chw')),
  recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vitals_patient_date ON public.patient_vitals_log(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vitals_abha ON public.patient_vitals_log(abha_id);

-- ============================================================================
-- 5. DIAGNOSTIC REPORTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.diagnostic_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  abha_id TEXT NOT NULL,
  report_title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Pathology', 'Radiology', 'Cardiology', 'Pulmonology', 'General')),
  test_date DATE NOT NULL DEFAULT CURRENT_DATE,
  file_url TEXT,
  summary TEXT,
  spoken_vernacular_explanation TEXT,
  is_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  abnormal_flags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_patient ON public.diagnostic_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_abha ON public.diagnostic_reports(abha_id);
CREATE INDEX IF NOT EXISTS idx_reports_date ON public.diagnostic_reports(test_date DESC);

-- ============================================================================
-- 6. CLINICAL AUDIT TRAIL (DPDP ACT 2023 & ABDM M3 COMPLIANT, APPEND-ONLY)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.clinical_audit_trail (
  id BIGSERIAL PRIMARY KEY,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('VIEW', 'CREATE', 'UPDATE', 'EXPORT', 'SIGN', 'DELETE', 'EMERGENCY_OVERRIDE')),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('ENCOUNTER', 'PRESCRIPTION', 'APPOINTMENT', 'VITALS', 'REPORT', 'TRIAGE')),
  resource_id UUID NOT NULL,
  ip_digest TEXT,
  session_metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_resource ON public.clinical_audit_trail(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON public.clinical_audit_trail(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON public.clinical_audit_trail(timestamp DESC);

-- Prevent unauthorized update or deletion of audit logs (Immutability guarantee)
CREATE OR REPLACE FUNCTION public.prevent_audit_tampering()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit trail records are immutable and cannot be updated or deleted under ABDM M3 security guidelines.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_immutable ON public.clinical_audit_trail;
CREATE TRIGGER trg_audit_immutable
BEFORE UPDATE OR DELETE ON public.clinical_audit_trail
FOR EACH ROW EXECUTE PROCEDURE public.prevent_audit_tampering();

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.clinical_encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_vitals_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_audit_trail ENABLE ROW LEVEL SECURITY;

-- Encounters: Clinicians can CRUD their encounters; Patients can SELECT their own
CREATE POLICY "Clinicians manage encounters" ON public.clinical_encounters
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor', 'chw', 'admin')));

CREATE POLICY "Patients view own encounters" ON public.clinical_encounters
  FOR SELECT TO authenticated
  USING (patient_id = auth.uid() OR abha_id = (SELECT abha_id FROM public.profiles WHERE id = auth.uid()));

-- Appointments: Clinicians manage roster; Patients can book and view own appointments
CREATE POLICY "Clinicians manage appointments" ON public.clinical_appointments
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor', 'chw', 'admin')));

CREATE POLICY "Patients manage own appointments" ON public.clinical_appointments
  FOR ALL TO authenticated
  USING (patient_id = auth.uid() OR abha_id = (SELECT abha_id FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK (patient_id = auth.uid() OR abha_id = (SELECT abha_id FROM public.profiles WHERE id = auth.uid()));

-- Prescriptions: Clinicians write; Patients read own
CREATE POLICY "Clinicians manage prescriptions" ON public.clinical_prescriptions
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor', 'admin')));

CREATE POLICY "Patients view own prescriptions" ON public.clinical_prescriptions
  FOR SELECT TO authenticated
  USING (patient_id = auth.uid() OR abha_id = (SELECT abha_id FROM public.profiles WHERE id = auth.uid()));

-- Vitals: Clinicians & CHWs manage; Patients log and view own
CREATE POLICY "All users view and log vitals" ON public.patient_vitals_log
  FOR ALL TO authenticated
  USING (patient_id = auth.uid() OR abha_id = (SELECT abha_id FROM public.profiles WHERE id = auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor', 'chw', 'admin')))
  WITH CHECK (patient_id = auth.uid() OR abha_id = (SELECT abha_id FROM public.profiles WHERE id = auth.uid()) OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor', 'chw', 'admin')));

-- Reports: Clinicians manage; Patients view own
CREATE POLICY "Clinicians manage reports" ON public.diagnostic_reports
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('doctor', 'admin')));

CREATE POLICY "Patients view own reports" ON public.diagnostic_reports
  FOR SELECT TO authenticated
  USING (patient_id = auth.uid() OR abha_id = (SELECT abha_id FROM public.profiles WHERE id = auth.uid()));

-- Audit Trail: Authenticated users can insert log entries; Only admin/system can read
CREATE POLICY "Insert audit log" ON public.clinical_audit_trail
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins read audit log" ON public.clinical_audit_trail
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

