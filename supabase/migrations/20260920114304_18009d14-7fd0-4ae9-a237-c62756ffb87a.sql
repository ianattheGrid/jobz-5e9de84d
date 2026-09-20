ALTER TABLE public.candidate_profiles
  ADD COLUMN IF NOT EXISTS public_profile_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS public_profile_slug text,
  ADD COLUMN IF NOT EXISTS availability_status text NOT NULL DEFAULT 'open_to_offers';

CREATE UNIQUE INDEX IF NOT EXISTS candidate_profiles_public_slug_key
  ON public.candidate_profiles (public_profile_slug)
  WHERE public_profile_slug IS NOT NULL;

CREATE OR REPLACE FUNCTION public.get_public_candidate_profile(_slug text)
RETURNS TABLE (
  slug text,
  full_name text,
  job_title text,
  desired_job_title text,
  years_experience integer,
  min_salary integer,
  max_salary integer,
  location text[],
  required_skills text[],
  additional_skills text,
  work_area text,
  specialization text,
  personal_statement text,
  availability_status text,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    cp.public_profile_slug,
    cp.full_name,
    cp.job_title,
    cp.desired_job_title,
    cp.years_experience,
    cp.min_salary,
    cp.max_salary,
    cp.location,
    cp.required_skills,
    cp.additional_skills,
    cp."workArea",
    cp."itSpecialization",
    cp.personal_statement,
    cp.availability_status,
    cp.updated_at
  FROM public.candidate_profiles cp
  WHERE cp.public_profile_enabled = true
    AND cp.public_profile_slug = _slug
  LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.get_public_candidate_profile(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_candidate_profile(text) TO anon, authenticated;