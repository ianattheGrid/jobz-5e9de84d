CREATE OR REPLACE FUNCTION public.create_interview_from_accepted_slot()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'accepted'
     AND NEW.selected_time IS NOT NULL
     AND (OLD.status IS DISTINCT FROM NEW.status OR OLD.selected_time IS DISTINCT FROM NEW.selected_time)
  THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.interviews i
      WHERE i.job_id = NEW.job_id
        AND i.candidate_id = NEW.candidate_id
        AND i.scheduled_at = NEW.selected_time
    ) THEN
      INSERT INTO public.interviews (
        job_id, candidate_id, employer_id, interviewer_name, scheduled_at, status,
        interview_type, interview_stage, duration_minutes, interview_location
      ) VALUES (
        NEW.job_id, NEW.candidate_id, NEW.employer_id,
        COALESCE(NEW.interviewer_name, 'TBC'), NEW.selected_time, 'scheduled',
        NEW.interview_type, NEW.interview_stage, NEW.duration_minutes, NEW.interview_location
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_interview_from_accepted_slot() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS create_interview_on_slot_accept ON public.interview_slots;
CREATE TRIGGER create_interview_on_slot_accept
AFTER UPDATE ON public.interview_slots
FOR EACH ROW EXECUTE FUNCTION public.create_interview_from_accepted_slot();