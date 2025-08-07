-- Add rejection reason fields to applications table
ALTER TABLE public.applications 
ADD COLUMN rejection_reason TEXT,
ADD COLUMN rejection_notes TEXT;

-- Create a trigger to notify candidates when application status changes
CREATE OR REPLACE FUNCTION notify_candidate_application_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Only send notification if employer_accepted status changed
  IF OLD.employer_accepted IS DISTINCT FROM NEW.employer_accepted THEN
    -- Notification for acceptance
    IF NEW.employer_accepted = true THEN
      INSERT INTO push_notifications (user_id, type, title, message, related_entity_id)
      VALUES (
        NEW.applicant_id,
        'application_accepted',
        'Application Accepted!',
        'Great news! Your application has been accepted. You will hear from the employer soon.',
        NEW.id::text
      );
    -- Notification for rejection
    ELSIF NEW.employer_accepted = false THEN
      INSERT INTO push_notifications (user_id, type, title, message, related_entity_id)
      VALUES (
        NEW.applicant_id,
        'application_rejected',
        'Application Update',
        CASE 
          WHEN NEW.rejection_reason IS NOT NULL THEN 
            'Your application was not successful. Reason: ' || NEW.rejection_reason ||
            CASE WHEN NEW.rejection_notes IS NOT NULL THEN '. Additional notes: ' || NEW.rejection_notes ELSE '' END
          ELSE 'Your application was not successful on this occasion.'
        END,
        NEW.id::text
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER notify_candidate_on_status_change
  AFTER UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_candidate_application_status();