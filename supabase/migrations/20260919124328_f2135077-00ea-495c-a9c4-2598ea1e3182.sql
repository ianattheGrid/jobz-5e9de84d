CREATE OR REPLACE FUNCTION public.is_employer(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'employer'
  );
$$;

DROP POLICY IF EXISTS "Employers can insert their own jobs" ON public.jobs;
CREATE POLICY "Employers can insert their own jobs"
ON public.jobs FOR INSERT TO authenticated
WITH CHECK (auth.uid() = employer_id AND public.is_employer(auth.uid()));

DROP POLICY IF EXISTS "Employers can view their own jobs" ON public.jobs;
CREATE POLICY "Employers can view their own jobs"
ON public.jobs FOR SELECT TO authenticated
USING (auth.uid() = employer_id OR NOT public.is_employer(auth.uid()));