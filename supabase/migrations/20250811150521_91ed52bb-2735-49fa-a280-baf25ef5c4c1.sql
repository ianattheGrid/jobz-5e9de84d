-- Ensure storage policies for cvs bucket to allow users to manage their own files
-- These policies are idempotent

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'cvs_users_can_select_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY "cvs_users_can_select_own" ON storage.objects
      FOR SELECT USING (
        bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]
      );
    $$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'cvs_users_can_insert_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY "cvs_users_can_insert_own" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]
      );
    $$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'cvs_users_can_update_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY "cvs_users_can_update_own" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]
      );
    $$;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'cvs_users_can_delete_own'
  ) THEN
    EXECUTE $$
      CREATE POLICY "cvs_users_can_delete_own" ON storage.objects
      FOR DELETE USING (
        bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]
      );
    $$;
  END IF;
END $$;
