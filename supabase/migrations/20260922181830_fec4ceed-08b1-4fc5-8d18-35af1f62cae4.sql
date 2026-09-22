CREATE OR REPLACE FUNCTION public.sync_application_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.employer_accepted IS FALSE THEN
    NEW.status := 'rejected';
  ELSIF NEW.employer_accepted IS TRUE AND NEW.candidate_accepted IS TRUE THEN
    NEW.status := 'matched';
  ELSIF NEW.employer_accepted IS TRUE THEN
    NEW.status := 'reviewing';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_application_status_trg ON public.applications;
CREATE TRIGGER sync_application_status_trg
BEFORE UPDATE OF employer_accepted, candidate_accepted ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.sync_application_status();