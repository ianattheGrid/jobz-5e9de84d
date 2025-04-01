
-- Create identity reveals table
CREATE TABLE IF NOT EXISTS public.identity_reveals (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  revealed_by UUID NOT NULL,
  revealed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(application_id, revealed_by)
);

-- Add is_system_message column to recruiter_messages
ALTER TABLE public.recruiter_messages
ADD COLUMN IF NOT EXISTS is_system_message BOOLEAN DEFAULT FALSE;

-- Add RLS policies
ALTER TABLE public.identity_reveals ENABLE ROW LEVEL SECURITY;

-- Create policy for reading reveals
CREATE POLICY "Users can read their own application reveals"
ON public.identity_reveals
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM applications a
    WHERE a.id = identity_reveals.application_id
    AND (a.applicant_id = auth.uid() OR EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = a.job_id
      AND j.employer_id = auth.uid()
    ))
  )
);

-- Create policy for inserting reveals
CREATE POLICY "Users can create reveals for their own applications"
ON public.identity_reveals
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM applications a
    WHERE a.id = application_id
    AND (a.applicant_id = auth.uid() OR EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id = a.job_id
      AND j.employer_id = auth.uid()
    ))
  )
);
