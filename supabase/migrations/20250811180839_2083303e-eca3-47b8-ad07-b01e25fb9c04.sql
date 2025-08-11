-- Drop existing conflicting policies and recreate them correctly
DROP POLICY IF EXISTS "Users can view their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Users can insert their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own CVs" ON storage.objects;

-- Create proper RLS policies for cvs bucket
CREATE POLICY "Users can view their own CVs" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'cvs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow users to insert their own CVs
CREATE POLICY "Users can insert their own CVs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'cvs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow users to update their own CVs
CREATE POLICY "Users can update their own CVs" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'cvs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow users to delete their own CVs
CREATE POLICY "Users can delete their own CVs" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'cvs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);