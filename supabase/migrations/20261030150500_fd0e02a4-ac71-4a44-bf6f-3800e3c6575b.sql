CREATE TABLE public.launch_interest_registrations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 app_name text NOT NULL DEFAULT 'Jobz',
 name text,
 email text NOT NULL,
 launch_email_consent boolean NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(app_name, email)
);
GRANT SELECT ON public.launch_interest_registrations TO authenticated;
GRANT ALL ON public.launch_interest_registrations TO service_role;
ALTER TABLE public.launch_interest_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can read launch interest" ON public.launch_interest_registrations FOR SELECT TO authenticated USING (public.current_user_is_admin());
CREATE OR REPLACE FUNCTION public.validate_launch_interest() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 NEW.email := lower(btrim(NEW.email));
 NEW.name := nullif(btrim(NEW.name), '');
 IF NEW.app_name <> 'Jobz' OR length(NEW.email)>255 OR NEW.email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR length(NEW.name)>100 OR NEW.launch_email_consent IS DISTINCT FROM true THEN
 RAISE EXCEPTION 'Invalid launch interest registration';
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER validate_launch_interest BEFORE INSERT OR UPDATE ON public.launch_interest_registrations FOR EACH ROW EXECUTE FUNCTION public.validate_launch_interest();
REVOKE ALL ON FUNCTION public.validate_launch_interest() FROM PUBLIC, anon, authenticated;
CREATE OR REPLACE FUNCTION public.block_beta_account_creation() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 RAISE EXCEPTION 'Jobz is in beta. Register launch interest instead of creating an account.';
END; $$;
REVOKE ALL ON FUNCTION public.block_beta_account_creation() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER jobz_beta_block_signup BEFORE INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.block_beta_account_creation();