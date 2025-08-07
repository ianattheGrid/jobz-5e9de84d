-- Add missing profile fields for enhanced matching

-- Add industry sector field to candidate profiles
ALTER TABLE candidate_profiles 
ADD COLUMN IF NOT EXISTS industry_sector text,
ADD COLUMN IF NOT EXISTS company_address text,
ADD COLUMN IF NOT EXISTS notice_period text DEFAULT 'Immediate',
ADD COLUMN IF NOT EXISTS contract_type_preference text DEFAULT 'permanent';

-- Add contact preferences for candidates
ALTER TABLE candidate_profiles 
ADD COLUMN IF NOT EXISTS contact_phone_ok boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS contact_email_ok boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS contact_linkedin_ok boolean DEFAULT false;

-- Add skills experience tracking (JSON object to store skill -> years mapping)
ALTER TABLE candidate_profiles 
ADD COLUMN IF NOT EXISTS skills_experience jsonb DEFAULT '{}';

-- Add education details as structured data
ALTER TABLE candidate_profiles 
ADD COLUMN IF NOT EXISTS education_details jsonb DEFAULT '[]';

-- Add industry sector and location fields to employer profiles  
ALTER TABLE employer_profiles 
ADD COLUMN IF NOT EXISTS industry_sector text,
ADD COLUMN IF NOT EXISTS company_address text,
ADD COLUMN IF NOT EXISTS company_postcode text,
ADD COLUMN IF NOT EXISTS remote_work_policy text DEFAULT 'office_based';

-- Add company culture and values
ALTER TABLE employer_profiles 
ADD COLUMN IF NOT EXISTS company_culture text,
ADD COLUMN IF NOT EXISTS company_values text[];

-- Update job postings to include more matching criteria
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS remote_work_allowed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS hybrid_work_allowed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS contract_type text DEFAULT 'permanent',
ADD COLUMN IF NOT EXISTS notice_period_required text,
ADD COLUMN IF NOT EXISTS interview_process_description text;