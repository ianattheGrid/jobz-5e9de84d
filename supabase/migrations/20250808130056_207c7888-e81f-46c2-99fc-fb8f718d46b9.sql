-- Create employer interview feedback table
CREATE TABLE public.employer_interview_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id bigint NOT NULL,
  employer_id uuid NOT NULL,
  feedback_type text NOT NULL CHECK (feedback_type IN ('offer_position', 'another_interview', 'employer_control', 'not_proceeding')),
  message text,
  next_interview_times timestamp with time zone[] DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.employer_interview_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Employers can insert feedback for their interviews"
ON public.employer_interview_feedback
FOR INSERT
WITH CHECK (
  auth.uid() = employer_id AND
  EXISTS (
    SELECT 1 FROM interviews 
    WHERE interviews.id = interview_id 
    AND interviews.employer_id = auth.uid()
  )
);

CREATE POLICY "Employers can view their own feedback"
ON public.employer_interview_feedback
FOR SELECT
USING (auth.uid() = employer_id);

CREATE POLICY "Employers can update their own feedback"
ON public.employer_interview_feedback
FOR UPDATE
USING (auth.uid() = employer_id);

-- Candidates can view feedback for their interviews
CREATE POLICY "Candidates can view feedback for their interviews"
ON public.employer_interview_feedback
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM interviews 
    WHERE interviews.id = interview_id 
    AND interviews.candidate_id = auth.uid()
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_employer_interview_feedback_updated_at
  BEFORE UPDATE ON public.employer_interview_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();