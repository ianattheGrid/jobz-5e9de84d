-- Create storage RLS policies for cvs bucket; ignore if they already exist

DO $$
BEGIN
  BEGIN
    CREATE POLICY "cvs_users_can_select_own" ON storage.objects
    FOR SELECT USING (
      bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]
    );
  EXCEPTION WHEN duplicate_object THEN
    -- ignore
  END;
END $$;

DO $$
BEGIN
  BEGIN
    CREATE POLICY "cvs_users_can_insert_own" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]
    );
  EXCEPTION WHEN duplicate_object THEN
    -- ignore
  END;
END $$;

DO $$
BEGIN
  BEGIN
    CREATE POLICY "cvs_users_can_update_own" ON storage.objects
    FOR UPDATE USING (
      bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]
    );
  EXCEPTION WHEN duplicate_object THEN
    -- ignore
  END;
END $$;

DO $$
BEGIN
  BEGIN
    CREATE POLICY "cvs_users_can_delete_own" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]
    );
  EXCEPTION WHEN duplicate_object THEN
    -- ignore
  END;
END $$;