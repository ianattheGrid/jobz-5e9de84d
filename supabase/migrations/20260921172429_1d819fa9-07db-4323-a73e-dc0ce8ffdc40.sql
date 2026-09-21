CREATE TABLE public.external_job_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_job_id UUID NOT NULL REFERENCES public.external_jobs(id) ON DELETE CASCADE,
  candidate_id UUID,
  viewed_on DATE NOT NULL DEFAULT CURRENT_DATE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.external_job_views TO authenticated;
GRANT SELECT ON public.external_job_views TO authenticated;
GRANT ALL ON public.external_job_views TO service_role;

ALTER TABLE public.external_job_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signed-in people can record a view"
ON public.external_job_views FOR INSERT TO authenticated
WITH CHECK (candidate_id IS NULL OR candidate_id = auth.uid());

CREATE POLICY "Admins can read views"
ON public.external_job_views FOR SELECT TO authenticated
USING (public.current_user_is_admin());

CREATE UNIQUE INDEX external_job_views_once_a_day
ON public.external_job_views (external_job_id, candidate_id, viewed_on);

CREATE INDEX external_job_views_recent
ON public.external_job_views (external_job_id, viewed_at DESC);

ALTER TABLE public.employer_prospects
ADD COLUMN IF NOT EXISTS advert_views_7d INTEGER NOT NULL DEFAULT 0;