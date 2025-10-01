-- Add ian@the-grid.uk as admin
INSERT INTO public.admins (email)
VALUES ('ian@the-grid.uk')
ON CONFLICT (email) DO NOTHING;