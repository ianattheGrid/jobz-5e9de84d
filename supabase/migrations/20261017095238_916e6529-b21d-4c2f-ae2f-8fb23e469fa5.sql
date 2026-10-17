ALTER TABLE public.candidate_profiles
  ADD COLUMN IF NOT EXISTS radar_status text NOT NULL DEFAULT 'quiet';

CREATE OR REPLACE FUNCTION public.validate_radar_status()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.radar_status NOT IN ('off','quiet','active') THEN
    RAISE EXCEPTION 'Invalid radar_status %', NEW.radar_status;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_validate_radar_status ON public.candidate_profiles;
CREATE TRIGGER trg_validate_radar_status BEFORE INSERT OR UPDATE OF radar_status
ON public.candidate_profiles FOR EACH ROW EXECUTE FUNCTION public.validate_radar_status();

CREATE OR REPLACE FUNCTION public.get_radar_statuses_for_job(_job_id bigint)
RETURNS TABLE(candidate_id uuid, radar_status text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT cp.id, cp.radar_status
  FROM public.candidate_profiles cp
  WHERE cp.board_enabled = true
    AND EXISTS (
      SELECT 1 FROM public.jobs j
      JOIN public.employer_profiles ep ON ep.id = j.employer_id
      WHERE j.id = _job_id AND j.employer_id = auth.uid()
        AND ep.verification_status = 'verified'
    );
$$;

REVOKE EXECUTE ON FUNCTION public.get_radar_statuses_for_job(bigint) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_radar_statuses_for_job(bigint) TO authenticated;