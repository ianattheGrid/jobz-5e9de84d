-- Fix the candidate_gallery RLS policy that's causing permission denied error
-- Remove the problematic policy that references auth.users
DROP POLICY IF EXISTS "Employers can view candidate galleries" ON candidate_gallery;

-- Create a simpler policy for employers to view galleries
CREATE POLICY "Employers can view candidate galleries" 
ON candidate_gallery 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role = 'employer'
));