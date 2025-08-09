-- Make candidate_gallery bucket private
UPDATE storage.buckets SET public = false WHERE id = 'candidate_gallery';

-- Drop public read policy if exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read for candidate_gallery'
  ) THEN
    DROP POLICY "Public read for candidate_gallery" ON storage.objects;
  END IF;
END $$;

-- Create employer/owner read policy for candidate_gallery
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Employers and owners can read candidate_gallery'
  ) THEN
    CREATE POLICY "Employers and owners can read candidate_gallery"
    ON storage.objects
    FOR SELECT
    USING (
      bucket_id = 'candidate_gallery' AND (
        -- owner can read files in their own folder
        auth.uid()::text = (storage.foldername(name))[1]
        OR EXISTS (
          SELECT 1 FROM auth.users
          WHERE id = auth.uid() AND (raw_user_meta_data->>'user_type') = 'employer'
        )
      )
    );
  END IF;
END $$;