-- Create RLS policies for CVs storage bucket to allow signed URL generation

-- Policy to allow users to view/download their own CVs
CREATE POLICY "Users can view their own CVs" ON storage.objects
FOR SELECT
USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy to allow users to create signed URLs for their own CVs (needed for createSignedUrl)
CREATE POLICY "Users can create signed URLs for their own CVs" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy to allow users to upload their own CVs
CREATE POLICY "Users can upload their own CVs" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy to allow users to update their own CVs
CREATE POLICY "Users can update their own CVs" ON storage.objects
FOR UPDATE
USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);