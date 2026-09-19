CREATE OR REPLACE FUNCTION public.notify_matching_candidates()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO push_notifications (user_id, type, title, message, related_entity_id)
  SELECT 
    cp.id,
    'job_match',
    'New Job Match',
    'A new job matching your profile has been posted: ' || NEW.title,
    NEW.id::text
  FROM candidate_profiles cp
  WHERE 
    cp.job_title = NEW.work_area
    AND cp.min_salary <= NEW.salary_max
    AND cp.max_salary >= NEW.salary_min;

  IF NEW.candidate_commission IS NOT NULL THEN
    INSERT INTO push_notifications (user_id, type, title, message, related_entity_id)
    SELECT 
      id,
      'vr_job_opportunity',
      'New Job Opportunity',
      'New job posted with VR commission: ' || NEW.title,
      NEW.id::text
    FROM virtual_recruiter_profiles
    WHERE is_active = true;
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_recruiters_new_job()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    IF NEW.candidate_commission IS NOT NULL THEN
        INSERT INTO recruiter_notifications (recruiter_id, job_id)
        SELECT 
            rp.id,
            NEW.id
        FROM recruiter_profiles rp
        WHERE rp.verification_status = 'approved'
        ON CONFLICT (recruiter_id, job_id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$function$;