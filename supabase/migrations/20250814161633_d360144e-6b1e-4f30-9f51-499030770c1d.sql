-- Fix RLS policy for employer profiles updates
DROP POLICY IF EXISTS "Employers can update own profile" ON public.employer_profiles;

CREATE POLICY "Employers can update own profile" 
ON public.employer_profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Ensure storage policies exist for company_assets bucket
DO $$
BEGIN
    -- Check if bucket exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'company_assets'
    ) THEN
        INSERT INTO storage.buckets (id, name, public) 
        VALUES ('company_assets', 'company_assets', true);
    END IF;
END $$;

-- Create or update storage policies for company_assets
DROP POLICY IF EXISTS "Employers can upload company assets" ON storage.objects;
DROP POLICY IF EXISTS "Employers can view company assets" ON storage.objects;
DROP POLICY IF EXISTS "Employers can delete company assets" ON storage.objects;

CREATE POLICY "Employers can upload company assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
    bucket_id = 'company_assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Employers can view company assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'company_assets');

CREATE POLICY "Employers can delete company assets" 
ON storage.objects 
FOR DELETE 
USING (
    bucket_id = 'company_assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);