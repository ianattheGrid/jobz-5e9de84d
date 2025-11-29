-- Phase 1: Add new columns to webby_candidate_profiles for whole-person matching
ALTER TABLE webby_candidate_profiles
  ADD COLUMN IF NOT EXISTS hobbies_activities JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS life_outside_work TEXT,
  ADD COLUMN IF NOT EXISTS hidden_interests TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS soft_skills_self_assessed TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS transferable_skills_ai JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS alternative_paths_ai JSONB DEFAULT '{}'::jsonb;

-- Add comment explaining the new columns
COMMENT ON COLUMN webby_candidate_profiles.hobbies_activities IS 'Structured hobby data: [{activity: "Swimming", frequency: "4x/week", level: "Advanced", context: "Morning training"}]';
COMMENT ON COLUMN webby_candidate_profiles.life_outside_work IS 'Free-form text about what they do outside work, passions, interests';
COMMENT ON COLUMN webby_candidate_profiles.hidden_interests IS 'Interests/activities that might unlock serendipitous job matches';
COMMENT ON COLUMN webby_candidate_profiles.soft_skills_self_assessed IS 'Self-identified soft skills from conversation';
COMMENT ON COLUMN webby_candidate_profiles.transferable_skills_ai IS 'AI-identified transferable skills from hobbies: {teaching: {from: "swim_coaching", confidence: 0.9}}';
COMMENT ON COLUMN webby_candidate_profiles.alternative_paths_ai IS 'AI-suggested alternative career paths: {swim_instructor: {reasoning: "...", match_score: 0.85}}';

-- Phase 1: Add new columns to webby_job_specs for soft skills matching
ALTER TABLE webby_job_specs
  ADD COLUMN IF NOT EXISTS soft_qualities_needed TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS personality_fit JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS hidden_skills_welcome TEXT[] DEFAULT '{}';

-- Add comment explaining the new columns
COMMENT ON COLUMN webby_job_specs.soft_qualities_needed IS 'Soft skills/qualities employer wants: ["patient", "creative problem solver", "team player"]';
COMMENT ON COLUMN webby_job_specs.personality_fit IS 'Desired personality traits and cultural fit indicators';
COMMENT ON COLUMN webby_job_specs.hidden_skills_welcome IS 'Skills from hobbies/interests that would be valuable: ["coaching experience", "public speaking"]';