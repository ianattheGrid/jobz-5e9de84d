CREATE OR REPLACE FUNCTION public.get_found_adverts(_limit integer DEFAULT 30, _search text DEFAULT NULL)
RETURNS TABLE(
  id uuid,
  job_title text,
  location text,
  job_url text,
  salary_min integer,
  salary_max integer,
  company_name text,
  company_website text,
  scraped_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ej.id, ej.job_title, ej.location, ej.job_url, ej.salary_min, ej.salary_max,
         tc.company_name, tc.website, ej.scraped_at
  FROM public.external_jobs ej
  JOIN public.target_companies tc ON tc.id = ej.company_id
  WHERE ej.is_active = true
    AND (_search IS NULL OR ej.job_title ILIKE '%' || _search || '%')
  ORDER BY ej.scraped_at DESC
  LIMIT LEAST(COALESCE(_limit, 30), 60)
$$;

REVOKE EXECUTE ON FUNCTION public.get_found_adverts(integer, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_found_adverts(integer, text) TO anon, authenticated;