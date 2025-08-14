-- Clean up existing storage policies for company_assets
DROP POLICY IF EXISTS "Anyone can view company assets" ON storage.objects;
DROP POLICY IF EXISTS "Employer can upload company assets" ON storage.objects;
DROP POLICY IF EXISTS "Employers can delete company assets" ON storage.objects;
DROP POLICY IF EXISTS "Employers can upload company assets" ON storage.objects;
DROP POLICY IF EXISTS "Employers can view company assets" ON storage.objects;

-- Create correct storage policies for company_assets bucket
CREATE POLICY "Allow authenticated uploads to company_assets" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
    bucket_id = 'company_assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow public viewing of company_assets" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'company_assets');

CREATE POLICY "Allow authenticated users to delete own company_assets" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
    bucket_id = 'company_assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow authenticated users to update own company_assets" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
    bucket_id = 'company_assets' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Also ensure profile_pictures bucket exists and has correct policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile_pictures', 'profile_pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Clean up profile_pictures policies
DROP POLICY IF EXISTS "Allow authenticated uploads to profile_pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow public viewing of profile_pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete own profile_pictures" ON storage.objects;

-- Create profile_pictures policies
CREATE POLICY "Allow authenticated uploads to profile_pictures" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
    bucket_id = 'profile_pictures' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow public viewing of profile_pictures" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'profile_pictures');