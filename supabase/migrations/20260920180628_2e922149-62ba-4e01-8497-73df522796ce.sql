-- 1. Invite links -------------------------------------------------------
CREATE TABLE public.invite_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  owner_role text NOT NULL,
  code text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX invite_codes_owner_unique ON public.invite_codes (owner_id, owner_role);

GRANT SELECT, INSERT, UPDATE ON public.invite_codes TO authenticated;
GRANT ALL ON public.invite_codes TO service_role;
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own invite code"
  ON public.invite_codes FOR ALL TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins can view invite codes"
  ON public.invite_codes FOR SELECT TO authenticated
  USING (public.current_user_is_admin());

CREATE TABLE public.invite_signups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL,
  inviter_id uuid,
  new_user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  new_user_role text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX invite_signups_user_unique ON public.invite_signups (new_user_id);

GRANT SELECT, INSERT ON public.invite_signups TO authenticated;
GRANT ALL ON public.invite_signups TO service_role;
ALTER TABLE public.invite_signups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inviter can see who joined"
  ON public.invite_signups FOR SELECT TO authenticated
  USING (auth.uid() = inviter_id OR auth.uid() = new_user_id OR public.current_user_is_admin());
CREATE POLICY "New user records their own signup"
  ON public.invite_signups FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = new_user_id);

-- 2. Employer prospects --------------------------------------------------
CREATE TABLE public.employer_prospects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL,
  company_website text,
  contact_email text,
  role_title text,
  role_location text,
  source_url text NOT NULL,
  source text NOT NULL DEFAULT 'external_jobs',
  estimated_salary integer,
  estimated_agency_fee integer,
  status text NOT NULL DEFAULT 'new',
  notes text,
  approved_by uuid,
  approved_at timestamp with time zone,
  sent_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX employer_prospects_source_unique ON public.employer_prospects (source_url);
CREATE INDEX employer_prospects_status_idx ON public.employer_prospects (status, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.employer_prospects TO authenticated;
GRANT ALL ON public.employer_prospects TO service_role;
ALTER TABLE public.employer_prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage employer prospects"
  ON public.employer_prospects FOR ALL TO authenticated
  USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin());

CREATE TABLE public.outreach_suppressions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.outreach_suppressions TO authenticated;
GRANT ALL ON public.outreach_suppressions TO service_role;
ALTER TABLE public.outreach_suppressions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage suppressions"
  ON public.outreach_suppressions FOR ALL TO authenticated
  USING (public.current_user_is_admin()) WITH CHECK (public.current_user_is_admin());

-- 3. Single-flight locks for nightly jobs --------------------------------
CREATE TABLE public.job_locks (
  job_name text NOT NULL PRIMARY KEY,
  locked_until timestamp with time zone NOT NULL,
  paused_reason text,
  last_run_at timestamp with time zone,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT ON public.job_locks TO authenticated;
GRANT ALL ON public.job_locks TO service_role;
ALTER TABLE public.job_locks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view job locks"
  ON public.job_locks FOR SELECT TO authenticated
  USING (public.current_user_is_admin());

-- 4. Timestamps ----------------------------------------------------------
CREATE TRIGGER invite_codes_updated_at BEFORE UPDATE ON public.invite_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER employer_prospects_updated_at BEFORE UPDATE ON public.employer_prospects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();