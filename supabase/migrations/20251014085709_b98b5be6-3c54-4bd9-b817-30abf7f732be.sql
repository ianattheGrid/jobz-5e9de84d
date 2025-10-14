-- Add go-live tracking fields to app_settings
ALTER TABLE app_settings
ADD COLUMN IF NOT EXISTS go_live_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS soft_launch_end_date timestamp with time zone;

-- Create RLS policy for admins to update app settings
CREATE POLICY "Admins can update app settings"
ON app_settings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);