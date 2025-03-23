
-- Create company_gallery table
CREATE TABLE IF NOT EXISTS company_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID NOT NULL REFERENCES employer_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE company_gallery ENABLE ROW LEVEL SECURITY;

-- Allow employers to view their own gallery
CREATE POLICY view_own_gallery ON company_gallery
  FOR SELECT USING (employer_id = auth.uid());

-- Allow employers to insert into their own gallery
CREATE POLICY insert_own_gallery ON company_gallery
  FOR INSERT WITH CHECK (employer_id = auth.uid());

-- Allow employers to delete from their own gallery
CREATE POLICY delete_own_gallery ON company_gallery
  FOR DELETE USING (employer_id = auth.uid());

-- Allow anyone to view gallery images (for public profile viewing)
CREATE POLICY view_any_gallery ON company_gallery
  FOR SELECT USING (true);

-- Add new columns to employer_profiles if they don't exist
ALTER TABLE employer_profiles
  ADD COLUMN IF NOT EXISTS company_description TEXT,
  ADD COLUMN IF NOT EXISTS office_amenities TEXT,
  ADD COLUMN IF NOT EXISTS nearby_amenities TEXT;
