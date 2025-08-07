-- Add match percentage and detailed score breakdown to applications table
ALTER TABLE applications 
ADD COLUMN match_percentage integer,
ADD COLUMN match_score_breakdown jsonb DEFAULT '{}'::jsonb,
ADD COLUMN match_explanation text;

-- Add index for better performance when querying by match percentage
CREATE INDEX idx_applications_match_percentage ON applications(match_percentage);

-- Update RLS policies to allow candidates to view their match scores
-- (The existing policies already allow candidates to view their own applications)