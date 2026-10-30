REVOKE ALL ON public.launch_interest_registrations FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.launch_interest_registrations FROM authenticated;
GRANT SELECT ON public.launch_interest_registrations TO authenticated;
GRANT ALL ON public.launch_interest_registrations TO service_role;