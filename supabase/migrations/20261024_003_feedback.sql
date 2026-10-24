-- Migration: 20261024_003_feedback.sql
-- Table: feedback
-- Description: Stores anonymous visitor feedback and ratings for AyuSwar AI.
-- RLS: Enabled. Anon inserts allowed. Read access restricted to dashboard/service role.

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  overall_stars int not null check (overall_stars between 1 and 5),
  voice_stars int check (voice_stars between 1 and 5),
  ease_stars int check (ease_stars between 1 and 5),
  design_stars int check (design_stars between 1 and 5),
  tags text[] default '{}',
  improvement text,
  name text,
  page_path text,
  user_agent text
);

alter table public.feedback enable row level security;

-- Insert policy for anonymous feedback submission
drop policy if exists "anyone can submit feedback" on public.feedback;
create policy "anyone can submit feedback"
  on public.feedback for insert to anon with check (true);
