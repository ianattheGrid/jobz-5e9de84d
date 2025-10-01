-- Drop the problematic circular RLS policy
DROP POLICY IF EXISTS "Allow admins to manage admin records" ON public.admins;

-- Create a security definer function to check admin status
-- This bypasses RLS to avoid circular dependency
CREATE OR REPLACE FUNCTION public.is_admin(user_email text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE email = user_email
  );
$$;

-- Create a new RLS policy that allows authenticated users to check if an email is an admin
CREATE POLICY "Authenticated users can check admin status"
ON public.admins
FOR SELECT
TO authenticated
USING (true);

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin(text) TO authenticated;