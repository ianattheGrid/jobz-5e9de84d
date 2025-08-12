-- Add policy to allow public viewing of candidate profiles
-- This is needed for the "Preview Public Profile" functionality
CREATE POLICY "Allow public viewing of candidate profiles" 
ON candidate_profiles 
FOR SELECT 
USING (true);