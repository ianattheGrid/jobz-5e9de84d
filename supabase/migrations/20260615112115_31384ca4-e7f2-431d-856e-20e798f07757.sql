
-- 1. Revoke EXECUTE on the SECURITY DEFINER admin-check helper from PUBLIC/authenticated/anon.
--    It is still callable from inside other security-definer functions and RLS policies.
REVOKE EXECUTE ON FUNCTION public.current_user_is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.current_user_is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.current_user_is_admin() FROM authenticated;

-- 2. Remove broad bucket-wide SELECT policies on public buckets so files can't be listed/enumerated.
--    Public URLs (storage/v1/object/public/<bucket>/<file>) still work because the buckets are flagged public.
DROP POLICY IF EXISTS "Allow anyone to view images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public viewing of profile_pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view company_assets" ON storage.objects;
DROP POLICY IF EXISTS "Portfolio files are publicly accessible" ON storage.objects;
