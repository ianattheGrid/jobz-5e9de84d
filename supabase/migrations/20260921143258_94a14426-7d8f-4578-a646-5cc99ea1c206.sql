REVOKE ALL ON FUNCTION public.enforce_daily_application_limit() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enforce_daily_application_limit() FROM anon;
REVOKE ALL ON FUNCTION public.enforce_daily_application_limit() FROM authenticated;
REVOKE ALL ON FUNCTION public.candidate_recent_application_count(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.candidate_recent_application_count(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.candidate_recent_application_count(UUID) TO authenticated;