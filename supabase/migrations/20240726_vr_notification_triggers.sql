
-- Create a function to find the VR who recommended a candidate
CREATE OR REPLACE FUNCTION find_vr_for_candidate(candidate_email TEXT, job_id BIGINT)
RETURNS TABLE(vr_id UUID, recommendation_id BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT cr.vr_id, cr.id 
  FROM candidate_recommendations cr
  WHERE cr.candidate_email = candidate_email
  AND (cr.job_id IS NULL OR cr.job_id = job_id);
END;
$$ LANGUAGE plpgsql;

-- Function to notify VR when their candidate gets matched with a job
CREATE OR REPLACE FUNCTION notify_vr_on_candidate_match()
RETURNS TRIGGER AS $$
DECLARE
  vr_data RECORD;
  job_title TEXT;
BEGIN
  -- Get job title
  SELECT title INTO job_title FROM jobs WHERE id = NEW.job_id;
  
  -- Find VR who recommended this candidate
  FOR vr_data IN 
    SELECT * FROM find_vr_for_candidate(NEW.applicant_id, NEW.job_id)
  LOOP
    -- Insert notification for the VR
    INSERT INTO push_notifications (
      user_id, 
      type, 
      title, 
      message, 
      related_entity_id
    ) VALUES (
      vr_data.vr_id,
      'vr_candidate_update',
      'Candidate Job Match',
      'Your candidate has matched with a job as a ' || job_title,
      vr_data.recommendation_id::TEXT
    );
    
    -- Update recommendation status
    UPDATE candidate_recommendations 
    SET status = 'matched'
    WHERE id = vr_data.recommendation_id;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for application status changes
CREATE OR REPLACE FUNCTION notify_vr_on_application_status_change()
RETURNS TRIGGER AS $$
DECLARE
  vr_data RECORD;
  job_title TEXT;
  notification_title TEXT;
  notification_message TEXT;
  candidate_email TEXT;
BEGIN
  -- Get info
  SELECT title INTO job_title FROM jobs WHERE id = NEW.job_id;
  SELECT email INTO candidate_email FROM auth.users WHERE id = NEW.applicant_id;
  
  -- Skip if no status change
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;
  
  -- Set notification based on status
  CASE NEW.status
    WHEN 'interview_scheduled' THEN
      notification_title := 'Interview Scheduled';
      notification_message := 'Your candidate has been scheduled for an interview';
    WHEN 'rejected' THEN
      notification_title := 'Application Rejected';
      notification_message := 'Your candidate was not selected for the position';
    WHEN 'offered' THEN
      notification_title := 'Job Offer Extended';
      notification_message := 'Your candidate has received a job offer';
    WHEN 'hired' THEN
      notification_title := 'Candidate Started Job';
      notification_message := 'Your candidate has started their new position';
    ELSE
      RETURN NEW; -- No notification for other statuses
  END CASE;
  
  -- Add job title
  IF job_title IS NOT NULL THEN
    notification_message := notification_message || ' as a ' || job_title;
  END IF;
  
  -- Find VR who recommended this candidate
  FOR vr_data IN 
    SELECT * FROM find_vr_for_candidate(candidate_email, NEW.job_id)
  LOOP
    -- Insert notification
    INSERT INTO push_notifications (
      user_id, 
      type, 
      title, 
      message, 
      related_entity_id
    ) VALUES (
      vr_data.vr_id,
      'vr_candidate_update',
      notification_title,
      notification_message,
      vr_data.recommendation_id::TEXT
    );
    
    -- Update recommendation status based on application status
    UPDATE candidate_recommendations 
    SET status = CASE
      WHEN NEW.status = 'interview_scheduled' THEN 'interviewing'
      WHEN NEW.status = 'rejected' THEN 'rejected'
      WHEN NEW.status = 'offered' THEN 'offered'
      WHEN NEW.status = 'hired' THEN 'hired'
      ELSE status
    END
    WHERE id = vr_data.recommendation_id;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER on_application_created
AFTER INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION notify_vr_on_candidate_match();

CREATE TRIGGER on_application_status_changed
AFTER UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION notify_vr_on_application_status_change();
