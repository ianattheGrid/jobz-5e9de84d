-- Create a secure function to generate signed URLs for user's own CVs
CREATE OR REPLACE FUNCTION public.get_cv_signed_url(file_path TEXT, expires_in INTEGER DEFAULT 3600)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
DECLARE
  user_id_from_path TEXT;
  signed_url_result JSON;
BEGIN
  -- Extract user ID from the file path (should be first segment)
  user_id_from_path := split_part(file_path, '/', 1);
  
  -- Check if the requesting user matches the file owner
  IF auth.uid()::TEXT != user_id_from_path THEN
    RETURN JSON_BUILD_OBJECT('error', 'Access denied');
  END IF;
  
  -- Generate signed URL using the storage API
  SELECT storage.create_signed_url('cvs', file_path, expires_in) INTO signed_url_result;
  
  IF signed_url_result IS NULL THEN
    RETURN JSON_BUILD_OBJECT('error', 'Failed to generate signed URL');
  END IF;
  
  RETURN JSON_BUILD_OBJECT('signedUrl', signed_url_result);
END;
$$;