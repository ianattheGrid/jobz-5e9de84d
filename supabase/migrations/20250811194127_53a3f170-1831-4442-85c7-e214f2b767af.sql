-- Fix storage policies for CVs bucket to allow signed URL creation
-- Drop existing policies that might be restrictive
DROP POLICY IF EXISTS "Users can download their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own CVs" ON storage.objects;

-- Create comprehensive policies for CV access
CREATE POLICY "Users can view their own CVs"
ON storage.objects FOR SELECT
USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can create signed URLs for their own CVs"
ON storage.objects FOR SELECT
USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Ensure the policy allows all necessary operations for signed URLs
CREATE POLICY "Enable signed URL generation for CVs"
ON storage.objects FOR ALL
USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);