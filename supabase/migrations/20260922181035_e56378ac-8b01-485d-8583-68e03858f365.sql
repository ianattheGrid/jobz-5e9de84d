CREATE POLICY "Candidates can view their interviews"
ON public.interviews
FOR SELECT
TO authenticated
USING (auth.uid() = candidate_id);