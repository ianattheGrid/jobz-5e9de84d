-- Add Proof of Potential columns to candidate_profiles
ALTER TABLE candidate_profiles
ADD COLUMN IF NOT EXISTS proof_of_potential JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS show_proof_of_potential BOOLEAN DEFAULT true;

-- Add comment for documentation
COMMENT ON COLUMN candidate_profiles.proof_of_potential IS 'Structured data for 18-25 year olds showcasing potential: work_style_tags, experience_context_tags, reliability_tags, next_chapter_sectors, hobby_tags, show_and_tell_items';
COMMENT ON COLUMN candidate_profiles.show_proof_of_potential IS 'Whether to display Proof of Potential section to employers';