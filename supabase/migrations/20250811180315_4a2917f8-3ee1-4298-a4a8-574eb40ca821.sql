-- Add RLS policies for cvs bucket to allow authenticated users to access their own CVs

-- Policy to allow users to view their own CVs
CREATE POLICY "Users can view their own CVs" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'cvs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow users to insert their own CVs
CREATE POLICY "Users can insert their own CVs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'cvs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow users to update their own CVs
CREATE POLICY "Users can update their own CVs" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'cvs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy to allow users to delete their own CVs
CREATE POLICY "Users can delete their own CVs" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'cvs' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);