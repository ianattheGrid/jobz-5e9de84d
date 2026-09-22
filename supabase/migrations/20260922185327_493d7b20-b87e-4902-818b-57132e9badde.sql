CREATE POLICY "Employers can update their interviews"
ON public.interviews FOR UPDATE TO authenticated
USING (auth.uid() = employer_id)
WITH CHECK (auth.uid() = employer_id);

CREATE POLICY "Candidates can update their interviews"
ON public.interviews FOR UPDATE TO authenticated
USING (auth.uid() = candidate_id)
WITH CHECK (auth.uid() = candidate_id);