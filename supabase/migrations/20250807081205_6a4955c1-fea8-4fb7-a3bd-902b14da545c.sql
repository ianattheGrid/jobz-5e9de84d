-- Fix RLS security issue by enabling RLS on missing tables
-- These tables should already have RLS but the linter flagged them

-- Enable RLS on signup_attempts if not already enabled
ALTER TABLE signup_attempts ENABLE ROW LEVEL SECURITY;

-- Create admin-only policy for signup_attempts
CREATE POLICY "Admin access to signup attempts" ON signup_attempts
FOR ALL USING ((auth.jwt() ->> 'email'::text) IN (
  SELECT email FROM admins
));