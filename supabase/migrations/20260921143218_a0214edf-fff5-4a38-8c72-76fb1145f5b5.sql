CREATE TABLE public.candidate_job_hunt (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL,
  company TEXT NOT NULL,
  role_title TEXT NOT NULL,
  job_url TEXT,
  source TEXT,
  applied_on DATE NOT NULL DEFAULT CURRENT_DATE,
  stage TEXT NOT NULL DEFAULT 'applied',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidate_job_hunt TO authenticated;
GRANT ALL ON public.candidate_job_hunt TO service_role;

ALTER TABLE public.candidate_job_hunt ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates manage their own job hunt board"
ON public.candidate_job_hunt
FOR ALL
TO authenticated
USING (auth.uid() = candidate_id)
WITH CHECK (auth.uid() = candidate_id);

CREATE INDEX idx_candidate_job_hunt_candidate ON public.candidate_job_hunt (candidate_id, applied_on DESC);

CREATE TRIGGER update_candidate_job_hunt_updated_at
BEFORE UPDATE ON public.candidate_job_hunt
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Daily application cap: genuine job hunters do not need more than ten a day.
CREATE OR REPLACE FUNCTION public.enforce_daily_application_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.applications
  WHERE applicant_id = NEW.applicant_id
    AND created_at > now() - INTERVAL '24 hours';

  IF recent_count >= 10 THEN
    RAISE EXCEPTION 'You have applied for 10 roles in the last 24 hours, which is the daily limit on Jobz. Employers here know every application is a real one, so please come back tomorrow.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_daily_application_limit_trigger
BEFORE INSERT ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.enforce_daily_application_limit();

-- Employers may see only how many roles a candidate applied for recently.
CREATE OR REPLACE FUNCTION public.candidate_recent_application_count(_candidate_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.applications
  WHERE applicant_id = _candidate_id
    AND created_at > now() - INTERVAL '30 days';
$$;

GRANT EXECUTE ON FUNCTION public.candidate_recent_application_count(UUID) TO authenticated;