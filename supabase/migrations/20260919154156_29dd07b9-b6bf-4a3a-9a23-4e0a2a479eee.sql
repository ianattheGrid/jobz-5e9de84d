GRANT SELECT, UPDATE ON public.interview_slots TO authenticated;

CREATE POLICY "Candidates can respond to their interview slots"
ON public.interview_slots
FOR UPDATE
TO authenticated
USING (candidate_id = auth.uid())
WITH CHECK (candidate_id = auth.uid());