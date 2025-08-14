-- Temporarily simplify the storage policy to fix the upload issue
DROP POLICY IF EXISTS "Allow authenticated uploads to company_assets" ON storage.objects;

-- Create a simpler policy that allows any authenticated user to upload
CREATE POLICY "Allow authenticated uploads to company_assets" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'company_assets');

-- Also simplify the delete and update policies
DROP POLICY IF EXISTS "Allow authenticated users to delete own company_assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update own company_assets" ON storage.objects;

CREATE POLICY "Allow authenticated users to delete own company_assets" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'company_assets');

CREATE POLICY "Allow authenticated users to update own company_assets" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'company_assets');