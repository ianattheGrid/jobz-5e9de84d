-- Remove all existing policies for CVs bucket to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Users can create signed URLs for their own CVs" ON storage.objects;
DROP POLICY IF EXISTS "Enable signed URL generation for CVs" ON storage.objects;
DROP POLICY IF EXISTS "cvs_select_own" ON storage.objects;
DROP POLICY IF EXISTS "cvs_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "cvs_update_own" ON storage.objects;
DROP POLICY IF EXISTS "cvs_delete_own" ON storage.objects;
DROP POLICY IF EXISTS "cvs_users_can_select_own" ON storage.objects;
DROP POLICY IF EXISTS "cvs_users_can_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "cvs_users_can_update_own" ON storage.objects;
DROP POLICY IF EXISTS "cvs_users_can_delete_own" ON storage.objects;

-- Create simple, comprehensive policies for CV access
CREATE POLICY "cvs_policy_select" ON storage.objects
FOR SELECT USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "cvs_policy_insert" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "cvs_policy_update" ON storage.objects
FOR UPDATE USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "cvs_policy_delete" ON storage.objects
FOR DELETE USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);