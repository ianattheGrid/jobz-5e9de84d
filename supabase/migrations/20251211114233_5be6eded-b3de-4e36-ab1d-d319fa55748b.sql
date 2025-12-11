-- Phase 1-2: True Core + Career Stage fields
ALTER TABLE public.candidate_profiles
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS has_uk_driving_license boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS can_drive boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS unavailable_dates jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS primary_career_stage text,
ADD COLUMN IF NOT EXISTS secondary_career_stages text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS ascent_profile jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS core_profile jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS encore_profile jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS show_ascent_profile boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS show_core_profile boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS show_encore_profile boolean DEFAULT false;

-- Add comment for clarity
COMMENT ON COLUMN public.candidate_profiles.primary_career_stage IS 'Main career stage: launchpad, ascent, core, pivot, encore';
COMMENT ON COLUMN public.candidate_profiles.unavailable_dates IS 'Array of date ranges when candidate is unavailable';