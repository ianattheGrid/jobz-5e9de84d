-- Completely remove all storage policies for company_assets to simplify
DROP POLICY IF EXISTS "Allow authenticated uploads to company_assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public viewing of company_assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete own company_assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update own company_assets" ON storage.objects;

-- Create the simplest possible policies that just work
CREATE POLICY "Anyone can upload to company_assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'company_assets');

CREATE POLICY "Anyone can view company_assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'company_assets');

CREATE POLICY "Anyone can delete from company_assets" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'company_assets');

CREATE POLICY "Anyone can update company_assets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'company_assets');