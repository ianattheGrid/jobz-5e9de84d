-- Remove remote_work_policy column from employer_profiles table
ALTER TABLE public.employer_profiles DROP COLUMN IF EXISTS remote_work_policy;