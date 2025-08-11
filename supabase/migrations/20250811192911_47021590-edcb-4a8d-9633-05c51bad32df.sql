-- Drop the old function and create a corrected one
DROP FUNCTION IF EXISTS public.get_cv_signed_url(TEXT, INTEGER);

-- Create a simple function that just validates access and returns the file path
-- The client will handle the signed URL generation
CREATE OR REPLACE FUNCTION public.get_cv_file_path(file_path TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id_from_path TEXT;
BEGIN
  -- Extract user ID from the file path (should be first segment)
  user_id_from_path := split_part(file_path, '/', 1);
  
  -- Check if the requesting user matches the file owner
  IF auth.uid()::TEXT != user_id_from_path THEN
    RETURN JSON_BUILD_OBJECT('error', 'Access denied');
  END IF;
  
  -- Return the validated file path
  RETURN JSON_BUILD_OBJECT('filePath', file_path);
END;
$$;