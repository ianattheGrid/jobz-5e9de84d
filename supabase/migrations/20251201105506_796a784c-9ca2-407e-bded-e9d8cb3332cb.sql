-- Add Next Chapter fields to webby_candidate_profiles
ALTER TABLE webby_candidate_profiles 
ADD COLUMN IF NOT EXISTS next_chapter_summary TEXT,
ADD COLUMN IF NOT EXISTS moving_towards_sectors TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS moving_towards_functions TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS next_chapter_environment TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sectors_to_avoid TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS functions_to_avoid TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hobby_work_preferences JSONB DEFAULT '{}';

-- Add sector/function/environment tags to webby_job_specs
ALTER TABLE webby_job_specs 
ADD COLUMN IF NOT EXISTS sector_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS function_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS environment_tags TEXT[] DEFAULT '{}';

-- Add career-switcher preferences to employer_profiles
ALTER TABLE employer_profiles 
ADD COLUMN IF NOT EXISTS open_to_career_switchers BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS willing_to_train_on_the_job BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS values_soft_skills_over_experience BOOLEAN DEFAULT false;

-- Create master sector tags table
CREATE TABLE IF NOT EXISTS master_sector_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  aliases TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create master function tags table
CREATE TABLE IF NOT EXISTS master_function_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  aliases TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create master environment tags table
CREATE TABLE IF NOT EXISTS master_environment_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on master tables
ALTER TABLE master_sector_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_function_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_environment_tags ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read master tags
CREATE POLICY "Anyone can view sector tags" ON master_sector_tags FOR SELECT USING (true);
CREATE POLICY "Anyone can view function tags" ON master_function_tags FOR SELECT USING (true);
CREATE POLICY "Anyone can view environment tags" ON master_environment_tags FOR SELECT USING (true);

-- Seed sector tags
INSERT INTO master_sector_tags (name, aliases) VALUES
  ('hospitality', '{"hotel", "restaurant", "catering", "bar"}'),
  ('retail', '{"shop", "store", "sales"}'),
  ('sport_fitness', '{"gym", "sports", "fitness", "coaching"}'),
  ('admin', '{"administration", "office", "clerical"}'),
  ('tech', '{"technology", "IT", "software", "digital"}'),
  ('trades', '{"construction", "plumbing", "electrical", "carpentry"}'),
  ('care', '{"healthcare", "social care", "nursing", "support"}'),
  ('creative', '{"design", "media", "arts", "marketing"}'),
  ('education', '{"teaching", "training", "tutoring"}'),
  ('logistics', '{"warehouse", "delivery", "transport", "driving"}'),
  ('finance', '{"accounting", "banking", "insurance"}'),
  ('professional_services', '{"legal", "consulting", "business services"}')
ON CONFLICT (name) DO NOTHING;

-- Seed function tags
INSERT INTO master_function_tags (name, aliases) VALUES
  ('coaching_teaching', '{"trainer", "instructor", "educator"}'),
  ('customer_service', '{"support", "helpdesk", "front desk"}'),
  ('warehouse_operations', '{"picking", "packing", "stock"}'),
  ('kitchen_food_prep', '{"chef", "cook", "food service"}'),
  ('cleaning_maintenance', '{"cleaner", "janitor", "facilities"}'),
  ('software_development', '{"programming", "coding", "developer"}'),
  ('marketing', '{"advertising", "promotion", "content"}'),
  ('sales', '{"business development", "account management"}'),
  ('operations', '{"coordination", "planning", "logistics"}'),
  ('management', '{"supervision", "leadership", "team lead"}'),
  ('data_entry', '{"admin", "typing", "records"}'),
  ('creative_design', '{"graphic design", "UX", "branding"}')
ON CONFLICT (name) DO NOTHING;

-- Seed environment tags
INSERT INTO master_environment_tags (name) VALUES
  ('public_facing'),
  ('quiet_focused'),
  ('physical'),
  ('creative'),
  ('outdoors'),
  ('office'),
  ('remote'),
  ('team_based'),
  ('independent'),
  ('fast_paced'),
  ('structured'),
  ('flexible')
ON CONFLICT (name) DO NOTHING;