-- Add Second Chapter columns to candidate_profiles
ALTER TABLE public.candidate_profiles 
ADD COLUMN IF NOT EXISTS second_chapter jsonb DEFAULT '{}'::jsonb;

ALTER TABLE public.candidate_profiles 
ADD COLUMN IF NOT EXISTS show_second_chapter boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.candidate_profiles.second_chapter IS 'Optional Second Chapter data for career changers - stores sectors, role shape, team contribution, environment preferences, and summary';
COMMENT ON COLUMN public.candidate_profiles.show_second_chapter IS 'Whether to show the Second Chapter section on the candidate profile';