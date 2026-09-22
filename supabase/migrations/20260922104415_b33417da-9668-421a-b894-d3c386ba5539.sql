DELETE FROM public.external_jobs WHERE company_id IN (SELECT id FROM public.target_companies WHERE discovered_from = 'adzuna');
DELETE FROM public.target_companies WHERE discovered_from = 'adzuna';