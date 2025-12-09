-- Add JObz messaging contact preference column
ALTER TABLE candidate_profiles 
ADD COLUMN contact_jobz_ok BOOLEAN DEFAULT true;