
-- 1. Fix permissive RLS policies
DROP POLICY IF EXISTS "Candidates can submit applications" ON public.applications;
CREATE POLICY "Candidates can submit applications" ON public.applications
  FOR INSERT TO authenticated
  WITH CHECK (applicant_id = auth.uid());

DROP POLICY IF EXISTS "Employers can insert own profile" ON public.employer_profiles;
CREATE POLICY "Employers can insert own profile" ON public.employer_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert feedback" ON public.contractor_recruitment_feedback;
CREATE POLICY "Authenticated users can insert feedback" ON public.contractor_recruitment_feedback
  FOR INSERT TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "System can manage anonymous cards" ON public.webby_anonymous_cards;
CREATE POLICY "Service role manages anonymous cards" ON public.webby_anonymous_cards
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "System can manage external jobs" ON public.external_jobs;
CREATE POLICY "Service role manages external jobs" ON public.external_jobs
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 2. Lock search_path on all custom functions
ALTER FUNCTION public.set_signup_date() SET search_path = public;
ALTER FUNCTION public.validate_user_type() SET search_path = public;
ALTER FUNCTION public.validate_sme_size(integer) SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.assign_user_role() SET search_path = public;
ALTER FUNCTION public.check_user_employer_match(uuid, uuid) SET search_path = public;
ALTER FUNCTION public.generate_vr_number() SET search_path = public;
ALTER FUNCTION public.set_vr_number() SET search_path = public;
ALTER FUNCTION public.generate_referral_code() SET search_path = public;
ALTER FUNCTION public.set_referral_code() SET search_path = public;
ALTER FUNCTION public.handle_referred_user_signup() SET search_path = public;
ALTER FUNCTION public.normalize_company_name(text) SET search_path = public;
ALTER FUNCTION public.company_names_match(text, text) SET search_path = public;
ALTER FUNCTION public.can_apply_to_job(text, text) SET search_path = public;
ALTER FUNCTION public.notify_matching_candidates() SET search_path = public;
ALTER FUNCTION public.notify_matching_employers() SET search_path = public;
ALTER FUNCTION public.notify_employer_interview_response() SET search_path = public;
ALTER FUNCTION public.notify_candidate_application_status() SET search_path = public;
ALTER FUNCTION public.notify_employer_interview_slot_update() SET search_path = public;
ALTER FUNCTION public.notify_employers_of_candidate_matches() SET search_path = public;
ALTER FUNCTION public.check_signup_attempts(text, text, integer, integer) SET search_path = public;
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.notify_recruiters_new_job() SET search_path = public;

-- 3. Revoke EXECUTE on SECURITY DEFINER helper functions from anon/authenticated.
-- These are invoked via triggers, edge functions (service_role), or RLS policy bodies — never directly by clients.
REVOKE EXECUTE ON FUNCTION public.is_admin(text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_cv_file_path(text) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.check_signup_attempts(text, text, integer, integer) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.check_user_employer_match(uuid, uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.assign_user_role() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.validate_user_type() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_referred_user_signup() FROM anon, authenticated, public;

GRANT EXECUTE ON FUNCTION public.is_admin(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_cv_file_path(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.check_signup_attempts(text, text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.check_user_employer_match(uuid, uuid) TO service_role;
