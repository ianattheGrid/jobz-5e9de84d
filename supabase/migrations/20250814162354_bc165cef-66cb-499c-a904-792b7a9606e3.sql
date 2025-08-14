-- Fix the storage policy for company_assets uploads
DROP POLICY IF EXISTS "Allow authenticated uploads to company_assets" ON storage.objects;

-- Create a more robust policy that handles the folder structure correctly
CREATE POLICY "Allow authenticated uploads to company_assets" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
    bucket_id = 'company_assets' 
    AND (
        -- Allow if the file path starts with the user's ID
        name LIKE (auth.uid()::text || '/%')
        OR 
        -- Fallback: extract the first part before the slash and compare
        split_part(name, '/', 1) = auth.uid()::text
    )
);

-- Also update the delete and update policies to be more robust
DROP POLICY IF EXISTS "Allow authenticated users to delete own company_assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update own company_assets" ON storage.objects;

CREATE POLICY "Allow authenticated users to delete own company_assets" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
    bucket_id = 'company_assets' 
    AND (
        name LIKE (auth.uid()::text || '/%')
        OR 
        split_part(name, '/', 1) = auth.uid()::text
    )
);

CREATE POLICY "Allow authenticated users to update own company_assets" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
    bucket_id = 'company_assets' 
    AND (
        name LIKE (auth.uid()::text || '/%')
        OR 
        split_part(name, '/', 1) = auth.uid()::text
    )
);