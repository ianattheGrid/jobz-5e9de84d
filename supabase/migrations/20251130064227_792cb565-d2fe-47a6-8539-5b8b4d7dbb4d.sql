-- Add missing columns to webby_job_specs table
ALTER TABLE webby_job_specs 
ADD COLUMN IF NOT EXISTS employer_id UUID REFERENCES employer_profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS role_title TEXT,
ADD COLUMN IF NOT EXISTS pay_range_min INTEGER,
ADD COLUMN IF NOT EXISTS pay_range_max INTEGER,
ADD COLUMN IF NOT EXISTS soft_qualities_sought TEXT[],
ADD COLUMN IF NOT EXISTS hidden_skills_valued TEXT[],
ADD COLUMN IF NOT EXISTS company_culture TEXT;

-- Create index for faster employer lookups
CREATE INDEX IF NOT EXISTS idx_webby_job_specs_employer_id ON webby_job_specs(employer_id);