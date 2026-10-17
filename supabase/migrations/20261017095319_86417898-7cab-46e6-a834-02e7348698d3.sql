CREATE OR REPLACE FUNCTION public.get_employer_trust(_employer_id uuid)
RETURNS TABLE(verified boolean, company_size integer, member_since timestamptz, avg_response_hours numeric)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT ep.verification_status = 'verified',
         ep.company_size,
         ep.created_at,
         (SELECT round(avg(extract(epoch FROM (a.employer_viewed_at - a.created_at)) / 3600)::numeric, 0)
            FROM public.applications a JOIN public.jobs j ON j.id = a.job_id
           WHERE j.employer_id = ep.id AND a.employer_viewed_at IS NOT NULL)
  FROM public.employer_profiles ep
  WHERE ep.id = _employer_id;
$$;
REVOKE EXECUTE ON FUNCTION public.get_employer_trust(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_employer_trust(uuid) TO anon, authenticated;