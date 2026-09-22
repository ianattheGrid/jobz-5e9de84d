
DROP POLICY IF EXISTS "Employers, VRs, and admins can view candidate profiles" ON public.candidate_profiles;

CREATE POLICY "Candidate profiles visible with consent or an application"
ON public.candidate_profiles FOR SELECT TO authenticated
USING (
  id = auth.uid()
  OR public.current_user_is_admin()
  OR EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'vr'
  )
  OR EXISTS (
    SELECT 1
    FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.applicant_id = candidate_profiles.id
      AND j.employer_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.candidate_reveal_requests rr
    WHERE rr.candidate_id = candidate_profiles.id
      AND rr.employer_id = auth.uid()
      AND rr.status = 'shared'
  )
);
