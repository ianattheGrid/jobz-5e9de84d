
-- 1. Candidate controls
ALTER TABLE public.candidate_profiles
  ADD COLUMN IF NOT EXISTS board_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS board_visible_fields jsonb NOT NULL DEFAULT '{"full_name":false,"email":false,"phone_number":false,"current_employer":false,"linkedin_url":false,"cv_url":false,"profile_picture_url":false}'::jsonb,
  ADD COLUMN IF NOT EXISTS board_blocked_companies uuid[] NOT NULL DEFAULT '{}'::uuid[];

-- 2. Employer verification
ALTER TABLE public.employer_profiles
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS verified_at timestamptz,
  ADD COLUMN IF NOT EXISTS verification_method text,
  ADD COLUMN IF NOT EXISTS companies_house_number text;

-- 3. Reveal requests
CREATE TABLE IF NOT EXISTS public.candidate_reveal_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL,
  employer_id uuid NOT NULL,
  job_id bigint,
  note text,
  status text NOT NULL DEFAULT 'pending',
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS candidate_reveal_requests_unique
  ON public.candidate_reveal_requests (candidate_id, employer_id, COALESCE(job_id, -1));

GRANT SELECT, INSERT, UPDATE ON public.candidate_reveal_requests TO authenticated;
GRANT ALL ON public.candidate_reveal_requests TO service_role;

ALTER TABLE public.candidate_reveal_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates see their own reveal requests"
  ON public.candidate_reveal_requests FOR SELECT TO authenticated
  USING (candidate_id = auth.uid() OR employer_id = auth.uid());

CREATE POLICY "Verified employers can ask"
  ON public.candidate_reveal_requests FOR INSERT TO authenticated
  WITH CHECK (
    employer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.employer_profiles ep
      WHERE ep.id = auth.uid() AND ep.verification_status = 'verified'
    )
  );

CREATE POLICY "Candidates respond to their own requests"
  ON public.candidate_reveal_requests FOR UPDATE TO authenticated
  USING (candidate_id = auth.uid())
  WITH CHECK (candidate_id = auth.uid());

CREATE TRIGGER candidate_reveal_requests_updated_at
  BEFORE UPDATE ON public.candidate_reveal_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Anonymised, vacancy-scoped matches for the owning verified employer
CREATE OR REPLACE FUNCTION public.get_candidate_matches_for_job(_job_id bigint)
RETURNS TABLE(
  candidate_id uuid,
  job_title text,
  desired_job_title text,
  years_experience integer,
  years_in_current_title integer,
  min_salary integer,
  max_salary integer,
  required_skills text[],
  additional_skills text,
  required_qualifications text[],
  security_clearance text,
  commission_percentage numeric,
  "workArea" text,
  "itSpecialization" text,
  location text[],
  home_postcode text,
  availability_status text,
  personal_statement text,
  updated_at timestamptz,
  reveal_status text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _employer uuid := auth.uid();
BEGIN
  IF _employer IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.jobs j
    WHERE j.id = _job_id AND j.employer_id = _employer
  ) THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.employer_profiles ep
    WHERE ep.id = _employer AND ep.verification_status = 'verified'
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    cp.id,
    cp.job_title,
    cp.desired_job_title,
    cp.years_experience,
    cp.years_in_current_title,
    cp.min_salary,
    cp.max_salary,
    cp.required_skills,
    cp.additional_skills,
    cp.required_qualifications,
    cp.security_clearance,
    cp.commission_percentage,
    cp."workArea",
    cp."itSpecialization",
    cp.location,
    left(coalesce(cp.home_postcode, ''), 4) AS home_postcode,
    coalesce(cp.availability_status, 'open_to_offers'),
    cp.personal_statement,
    cp.updated_at,
    coalesce(rr.status, 'none') AS reveal_status
  FROM public.candidate_profiles cp
  LEFT JOIN public.candidate_reveal_requests rr
    ON rr.candidate_id = cp.id
   AND rr.employer_id = _employer
   AND coalesce(rr.job_id, -1) = _job_id
  WHERE cp.board_enabled = true
    AND NOT (_employer = ANY (cp.board_blocked_companies));
END;
$$;

REVOKE ALL ON FUNCTION public.get_candidate_matches_for_job(bigint) FROM public;
GRANT EXECUTE ON FUNCTION public.get_candidate_matches_for_job(bigint) TO authenticated;

-- 5. Identifying fields, only with consent
CREATE OR REPLACE FUNCTION public.get_candidate_full(_candidate_id uuid, _job_id bigint DEFAULT NULL)
RETURNS TABLE(
  candidate_id uuid,
  full_name text,
  email text,
  phone_number text,
  current_employer text,
  linkedin_url text,
  cv_url text,
  profile_picture_url text,
  shared boolean
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _employer uuid := auth.uid();
  _shared boolean := false;
  _vis jsonb;
BEGIN
  IF _employer IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.employer_profiles ep
    WHERE ep.id = _employer AND ep.verification_status = 'verified'
  ) THEN
    RETURN;
  END IF;

  SELECT cp.board_visible_fields INTO _vis
  FROM public.candidate_profiles cp
  WHERE cp.id = _candidate_id
    AND cp.board_enabled = true
    AND NOT (_employer = ANY (cp.board_blocked_companies));

  IF _vis IS NULL THEN
    RETURN;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.candidate_reveal_requests rr
    WHERE rr.candidate_id = _candidate_id
      AND rr.employer_id = _employer
      AND rr.status = 'shared'
  ) INTO _shared;

  RETURN QUERY
  SELECT
    cp.id,
    CASE WHEN _shared OR coalesce((_vis->>'full_name')::boolean, false) THEN cp.full_name END,
    CASE WHEN _shared OR coalesce((_vis->>'email')::boolean, false) THEN cp.email END,
    CASE WHEN _shared OR coalesce((_vis->>'phone_number')::boolean, false) THEN cp.phone_number END,
    CASE WHEN _shared OR coalesce((_vis->>'current_employer')::boolean, false) THEN cp.current_employer END,
    CASE WHEN _shared OR coalesce((_vis->>'linkedin_url')::boolean, false) THEN cp.linkedin_url END,
    CASE WHEN _shared OR coalesce((_vis->>'cv_url')::boolean, false) THEN cp.cv_url END,
    CASE WHEN _shared OR coalesce((_vis->>'profile_picture_url')::boolean, false) THEN cp.profile_picture_url END,
    _shared
  FROM public.candidate_profiles cp
  WHERE cp.id = _candidate_id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_candidate_full(uuid, bigint) FROM public;
GRANT EXECUTE ON FUNCTION public.get_candidate_full(uuid, bigint) TO authenticated;

-- 6. Fully anonymous public preview cards
CREATE OR REPLACE FUNCTION public.get_public_preview_cards(_limit integer DEFAULT 6)
RETURNS TABLE(
  token text,
  job_title text,
  area text,
  min_salary integer,
  max_salary integer,
  years_experience integer,
  top_skills text[],
  availability_status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    md5(cp.id::text) AS token,
    coalesce(cp.desired_job_title, cp.job_title) AS job_title,
    coalesce(cp.location[1], split_part(coalesce(cp.home_postcode, ''), ' ', 1), 'UK') AS area,
    cp.min_salary,
    cp.max_salary,
    cp.years_experience,
    (SELECT array_agg(s) FROM unnest(coalesce(cp.required_skills, '{}'::text[])) WITH ORDINALITY t(s, i) WHERE i <= 4) AS top_skills,
    coalesce(cp.availability_status, 'open_to_offers') AS availability_status
  FROM public.candidate_profiles cp
  WHERE cp.board_enabled = true
    AND coalesce(cp.desired_job_title, cp.job_title) IS NOT NULL
  ORDER BY cp.updated_at DESC NULLS LAST
  LIMIT greatest(1, least(coalesce(_limit, 6), 24));
$$;

REVOKE ALL ON FUNCTION public.get_public_preview_cards(integer) FROM public;
GRANT EXECUTE ON FUNCTION public.get_public_preview_cards(integer) TO anon, authenticated;
