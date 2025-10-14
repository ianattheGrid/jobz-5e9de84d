-- Add foreign key constraints to external_job_matches table
ALTER TABLE external_job_matches
ADD CONSTRAINT fk_external_job_matches_candidate
FOREIGN KEY (candidate_id) 
REFERENCES candidate_profiles(id)
ON DELETE CASCADE;

ALTER TABLE external_job_matches
ADD CONSTRAINT fk_external_job_matches_external_job
FOREIGN KEY (external_job_id)
REFERENCES external_jobs(id)
ON DELETE CASCADE;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_external_job_matches_candidate_id 
ON external_job_matches(candidate_id);

CREATE INDEX IF NOT EXISTS idx_external_job_matches_external_job_id
ON external_job_matches(external_job_id);