-- Admins: stop allowing every authenticated user to read all admin emails.
DROP POLICY IF EXISTS "Authenticated users can check admin status" ON public.admins;
REVOKE SELECT ON public.admins FROM anon;

CREATE POLICY "Admins can view only their own admin row"
ON public.admins
FOR SELECT
TO authenticated
USING (email = auth.email());

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE email = auth.email()
  );
$$;

REVOKE ALL ON FUNCTION public.current_user_is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_user_is_admin() TO authenticated, service_role;

-- Applications: drop the unscoped employer read policy; keep the owner-scoped one.
DROP POLICY IF EXISTS "Employers can view their job applications" ON public.applications;
DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON public.applications;
CREATE POLICY "Employers can view applications for their jobs"
ON public.applications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.jobs
    WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
  )
);

-- Recruiter messages: require caller is the candidate or the employer that owns the job.
DROP POLICY IF EXISTS "Users can view their own messages" ON public.recruiter_messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.recruiter_messages;

CREATE POLICY "Application parties can view recruiter messages"
ON public.recruiter_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.applications a
    WHERE a.id = recruiter_messages.application_id
      AND (
        a.applicant_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.jobs j
          WHERE j.id = a.job_id
            AND j.employer_id = auth.uid()
        )
      )
  )
);

CREATE POLICY "Application parties can send recruiter messages as themselves"
ON public.recruiter_messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.applications a
    WHERE a.id = recruiter_messages.application_id
      AND (
        a.applicant_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.jobs j
          WHERE j.id = a.job_id
            AND j.employer_id = auth.uid()
        )
      )
  )
);

-- Candidate profiles: no unauthenticated full-profile access. Restrict to the candidate, employers, VRs, and admins.
DROP POLICY IF EXISTS "Allow public viewing of candidate profiles" ON public.candidate_profiles;
REVOKE SELECT ON public.candidate_profiles FROM anon;

DROP POLICY IF EXISTS "Employers, VRs, and admins can view candidate profiles" ON public.candidate_profiles;
CREATE POLICY "Employers, VRs, and admins can view candidate profiles"
ON public.candidate_profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR public.current_user_is_admin()
  OR EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('employer', 'vr')
  )
);

-- User roles: stop self-escalation. Trigger assign_user_role still sets the requested role server-side at signup.
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;
CREATE POLICY "Users can self assign candidate role only"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND role = 'candidate'
);

-- Webby presence requires authentication.
DROP POLICY IF EXISTS "Anyone can view presence data" ON public.webby_presence;
CREATE POLICY "Authenticated users can view presence data"
ON public.webby_presence
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- CVs: scope SELECT to the owner and employers reviewing applications they own.
DROP POLICY IF EXISTS "Anyone can view CVs" ON storage.objects;
DROP POLICY IF EXISTS "cvs_policy_select" ON storage.objects;
CREATE POLICY "CV owners and application employers can view CVs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'cvs'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1
      FROM public.applications a
      JOIN public.jobs j ON j.id = a.job_id
      WHERE j.employer_id = auth.uid()
        AND (
          a.resume_url = storage.objects.name
          OR a.resume_url LIKE ('%' || storage.objects.name)
          OR (a.applicant_id)::text = (storage.foldername(storage.objects.name))[1]
        )
    )
  )
);

-- Company assets: only authenticated owners can write to their own folder.
DROP POLICY IF EXISTS "Anyone can upload to company_assets" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update company_assets" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from company_assets" ON storage.objects;

CREATE POLICY "Company asset owners can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company_assets'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Company asset owners can update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'company_assets'
  AND (auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'company_assets'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

CREATE POLICY "Company asset owners can delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'company_assets'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);