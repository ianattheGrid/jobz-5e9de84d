-- Add a safe default for VR location and fix existing nulls
ALTER TABLE public.virtual_recruiter_profiles
  ALTER COLUMN location SET DEFAULT 'Remote';

-- Backfill any existing NULL locations to prevent NOT NULL violations
UPDATE public.virtual_recruiter_profiles
SET location = 'Remote'
WHERE location IS NULL;