-- Add commute_preference_minutes column to candidate_profiles
ALTER TABLE public.candidate_profiles
ADD COLUMN IF NOT EXISTS commute_preference_minutes integer;

COMMENT ON COLUMN public.candidate_profiles.commute_preference_minutes IS 'Maximum acceptable commute time one-way in minutes (0 = remote only)';