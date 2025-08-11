-- Allow authenticated users to view their own CVs in the private 'cvs' bucket via signed URLs
-- This grants SELECT on storage.objects scoped to the user's folder (first path segment = auth.uid())

-- Create policy for SELECT if it doesn't already exist (unique name)
CREATE POLICY "Users can view their own CVs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'cvs'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
