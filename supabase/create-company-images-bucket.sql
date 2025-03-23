
-- Create storage bucket for company images
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('company_images', 'company_images', true, false)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload, read, and delete images
DO $$
BEGIN
  INSERT INTO storage.policies (name, definition, bucket_id)
  VALUES 
    ('Allow employers to upload images', 
     '(bucket_id = ''company_images'' AND auth.role() = ''authenticated'')', 
     'company_images'),
    ('Allow public read access', 
     '(bucket_id = ''company_images'')', 
     'company_images'),
    ('Allow owners to delete their images', 
     '(bucket_id = ''company_images'' AND auth.role() = ''authenticated'')', 
     'company_images');
EXCEPTION WHEN others THEN
  -- Ignore if policies already exist
END $$;
