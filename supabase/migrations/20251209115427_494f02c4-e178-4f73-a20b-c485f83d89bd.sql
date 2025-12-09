-- Add personal_statement column to candidate_profiles table
ALTER TABLE public.candidate_profiles 
ADD COLUMN personal_statement TEXT;

-- Add a check constraint to limit the length to 1000 characters
ALTER TABLE public.candidate_profiles 
ADD CONSTRAINT personal_statement_max_length CHECK (char_length(personal_statement) <= 1000);