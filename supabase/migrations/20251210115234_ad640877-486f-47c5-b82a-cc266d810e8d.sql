-- Add experience level and apprenticeship fields for young users
ALTER TABLE public.candidate_profiles 
ADD COLUMN IF NOT EXISTS experience_level text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS open_to_apprenticeships boolean DEFAULT false;