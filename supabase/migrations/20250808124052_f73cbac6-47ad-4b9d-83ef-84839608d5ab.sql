-- Create interview feedback table for candidates
CREATE TABLE public.interview_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  interview_id BIGINT NOT NULL REFERENCES public.interviews(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL,
  overall_sentiment TEXT NOT NULL CHECK (overall_sentiment IN ('felt_positive', 'still_interested', 'no_longer_interested', 'neutral')),
  additional_clarifications TEXT,
  general_feedback TEXT,
  wish_explained_better TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(interview_id, candidate_id)
);

-- Enable RLS
ALTER TABLE public.interview_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Candidates can insert their own feedback" 
ON public.interview_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Candidates can view their own feedback" 
ON public.interview_feedback 
FOR SELECT 
USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can update their own feedback" 
ON public.interview_feedback 
FOR UPDATE 
USING (auth.uid() = candidate_id);

CREATE POLICY "Employers can view feedback for their interviews" 
ON public.interview_feedback 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.interviews i 
  WHERE i.id = interview_feedback.interview_id 
  AND i.employer_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_interview_feedback_updated_at
BEFORE UPDATE ON public.interview_feedback
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();