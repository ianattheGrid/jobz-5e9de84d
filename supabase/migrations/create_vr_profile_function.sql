
-- Function to create a VR profile with proper permissions
CREATE OR REPLACE FUNCTION public.create_vr_profile(
  user_id UUID,
  user_full_name TEXT,
  user_email TEXT
) RETURNS BOOLEAN
SECURITY DEFINER
-- This is important to bypass RLS policies
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  new_vr_number TEXT;
BEGIN
  -- Generate VR number
  SELECT generate_vr_number() INTO new_vr_number;
  
  -- Insert the profile with all required fields
  INSERT INTO public.virtual_recruiter_profiles (
    id,
    full_name,
    email,
    location,
    vr_number,
    bank_account_verified,
    is_active
  ) VALUES (
    user_id,
    user_full_name,
    user_email,
    'Not specified', -- Default location
    new_vr_number,
    false,
    true
  );
  
  RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error creating VR profile: %', SQLERRM;
  RETURN FALSE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_vr_profile TO authenticated;

-- Add comment for clarity
COMMENT ON FUNCTION public.create_vr_profile IS 
'Creates a Virtual Recruiter profile with proper permissions, bypassing RLS';

