CREATE OR REPLACE FUNCTION public.get_my_reveal_requests()
RETURNS TABLE(
  id uuid,
  candidate_id uuid,
  employer_id uuid,
  job_id bigint,
  note text,
  status text,
  created_at timestamptz,
  company_name text,
  job_title text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.id, r.candidate_id, r.employer_id, r.job_id, r.note, r.status, r.created_at,
         e.company_name, j.title
  FROM public.candidate_reveal_requests r
  LEFT JOIN public.employer_profiles e ON e.id = r.employer_id
  LEFT JOIN public.jobs j ON j.id = r.job_id
  WHERE r.candidate_id = auth.uid()
  ORDER BY r.created_at DESC
$$;

REVOKE ALL ON FUNCTION public.get_my_reveal_requests() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_reveal_requests() TO authenticated;