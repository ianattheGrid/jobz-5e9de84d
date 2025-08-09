-- Create candidate gallery table
CREATE TABLE IF NOT EXISTS public.candidate_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.candidate_gallery ENABLE ROW LEVEL SECURITY;

-- Policy: Candidates manage their own gallery (insert/update/delete/select)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'candidate_gallery' AND policyname = 'Candidates can manage own gallery'
  ) THEN
    CREATE POLICY "Candidates can manage own gallery"
    ON public.candidate_gallery
    FOR ALL
    USING (auth.uid() = candidate_id)
    WITH CHECK (auth.uid() = candidate_id);
  END IF;
END $$;

-- Policy: Employers can view all candidate galleries
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'candidate_gallery' AND policyname = 'Employers can view candidate galleries'
  ) THEN
    CREATE POLICY "Employers can view candidate galleries"
    ON public.candidate_gallery
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
          AND (raw_user_meta_data ->> 'user_type') = 'employer'
      )
    );
  END IF;
END $$;

-- Helpful index
CREATE INDEX IF NOT EXISTS idx_candidate_gallery_candidate_id ON public.candidate_gallery (candidate_id);

-- Add visible_sections column to candidate_profiles
ALTER TABLE public.candidate_profiles
ADD COLUMN IF NOT EXISTS visible_sections JSONB NOT NULL DEFAULT '{
  "about": true,
  "personality": true,
  "experience": true,
  "skills": true,
  "qualifications": true,
  "location": true,
  "gallery": true,
  "cv": true,
  "linkedin": true
}'::jsonb;

-- Create candidate_gallery storage bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('candidate_gallery', 'candidate_gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for candidate_gallery bucket
-- Public read access for candidate_gallery objects
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public read for candidate_gallery'
  ) THEN
    CREATE POLICY "Public read for candidate_gallery"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'candidate_gallery');
  END IF;
END $$;

-- Allow users to upload files to folder named by their UID
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload candidate gallery files'
  ) THEN
    CREATE POLICY "Users can upload candidate gallery files"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
      bucket_id = 'candidate_gallery'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

-- Allow users to update their own files
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update candidate gallery files'
  ) THEN
    CREATE POLICY "Users can update candidate gallery files"
    ON storage.objects
    FOR UPDATE
    USING (
      bucket_id = 'candidate_gallery'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;

-- Allow users to delete their own files
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can delete candidate gallery files'
  ) THEN
    CREATE POLICY "Users can delete candidate gallery files"
    ON storage.objects
    FOR DELETE
    USING (
      bucket_id = 'candidate_gallery'
      AND auth.uid()::text = (storage.foldername(name))[1]
    );
  END IF;
END $$;