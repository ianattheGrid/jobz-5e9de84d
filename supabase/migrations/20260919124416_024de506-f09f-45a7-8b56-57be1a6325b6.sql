REVOKE ALL ON FUNCTION public.is_employer(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_employer(uuid) TO authenticated, service_role;