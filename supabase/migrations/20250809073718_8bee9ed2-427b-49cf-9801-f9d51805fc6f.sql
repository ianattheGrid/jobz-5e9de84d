-- Add personality snapshots to candidate profiles as JSONB array
ALTER TABLE public.candidate_profiles
ADD COLUMN IF NOT EXISTS personality JSONB NOT NULL DEFAULT '[]'::jsonb;