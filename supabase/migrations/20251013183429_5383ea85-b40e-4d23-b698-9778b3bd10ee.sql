-- Create app_settings table
CREATE TABLE app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_name text UNIQUE NOT NULL,
  status text NOT NULL CHECK (status IN ('soft_launch', 'live')),
  launch_location text NOT NULL,
  is_free_in_launch_location boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can check app status)
CREATE POLICY "Anyone can view app settings"
  ON app_settings FOR SELECT
  USING (true);

-- Insert initial data for 'localz'
INSERT INTO app_settings (app_name, status, launch_location, is_free_in_launch_location)
VALUES ('localz', 'soft_launch', 'Bristol', true);