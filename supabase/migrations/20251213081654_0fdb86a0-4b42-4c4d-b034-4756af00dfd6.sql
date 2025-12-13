-- Add career breaks and accessibility info columns to candidate_profiles
ALTER TABLE public.candidate_profiles
ADD COLUMN IF NOT EXISTS career_breaks jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS accessibility_info jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.candidate_profiles.career_breaks IS 'Array of career break entries with type, dates, gains, and return preferences';
COMMENT ON COLUMN public.candidate_profiles.accessibility_info IS 'Accessibility needs, work environment preferences, and visibility settings';