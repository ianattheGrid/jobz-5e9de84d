-- Add soft_launch_only flag to jobs table
ALTER TABLE public.jobs 
ADD COLUMN soft_launch_only boolean DEFAULT false;

-- Create index for better query performance
CREATE INDEX idx_jobs_soft_launch ON public.jobs(soft_launch_only, created_at);

-- Add comment for documentation
COMMENT ON COLUMN public.jobs.soft_launch_only IS 'If true, job is only visible during soft launch period. If false, visible in all modes.';