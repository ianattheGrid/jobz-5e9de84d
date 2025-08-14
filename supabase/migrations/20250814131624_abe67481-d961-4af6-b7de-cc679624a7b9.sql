-- Create master job titles table for approved titles
CREATE TABLE public.master_job_titles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_area TEXT NOT NULL,
  specialization TEXT,
  job_title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique job titles within work area/specialization
  UNIQUE(work_area, specialization, job_title)
);

-- Create job title suggestions table for user submissions
CREATE TABLE public.job_title_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title TEXT NOT NULL,
  work_area TEXT NOT NULL,
  specialization TEXT,
  suggested_by UUID NOT NULL,
  ai_validation_status TEXT NOT NULL DEFAULT 'pending',
  ai_validation_score NUMERIC,
  ai_validation_reason TEXT,
  admin_status TEXT NOT NULL DEFAULT 'pending',
  admin_reviewed_by UUID,
  admin_reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.master_job_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_title_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS policies for master_job_titles
CREATE POLICY "Anyone can view approved job titles" 
ON public.master_job_titles 
FOR SELECT 
USING (true);

-- RLS policies for job_title_suggestions
CREATE POLICY "Users can create their own job title suggestions" 
ON public.job_title_suggestions 
FOR INSERT 
WITH CHECK (auth.uid() = suggested_by);

CREATE POLICY "Users can view their own job title suggestions" 
ON public.job_title_suggestions 
FOR SELECT 
USING (auth.uid() = suggested_by);

CREATE POLICY "Admins can view all job title suggestions" 
ON public.job_title_suggestions 
FOR SELECT 
USING ((auth.jwt() ->> 'email'::text) IN ( SELECT admins.email FROM admins ));

CREATE POLICY "Admins can update job title suggestions" 
ON public.job_title_suggestions 
FOR UPDATE 
USING ((auth.jwt() ->> 'email'::text) IN ( SELECT admins.email FROM admins ));

-- Add trigger for updated_at
CREATE TRIGGER update_master_job_titles_updated_at
BEFORE UPDATE ON public.master_job_titles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_job_title_suggestions_updated_at
BEFORE UPDATE ON public.job_title_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert existing job titles from constants into master_job_titles table
-- IT Roles
INSERT INTO public.master_job_titles (work_area, specialization, job_title) VALUES
('IT', 'Software Development and Programming', 'Software Developer / Engineer'),
('IT', 'Software Development and Programming', 'Front-End Developer'),
('IT', 'Software Development and Programming', 'Back-End Developer'),
('IT', 'Software Development and Programming', 'Full-Stack Developer'),
('IT', 'Software Development and Programming', 'Mobile App Developer'),
('IT', 'Software Development and Programming', 'Game Developer'),
('IT', 'Software Development and Programming', 'DevOps Engineer'),
('IT', 'Software Development and Programming', 'API Developer'),
('IT', 'Software Development and Programming', 'Embedded Systems Developer'),

('IT', 'IT Support and Operations', 'IT Support Specialist'),
('IT', 'IT Support and Operations', 'Help Desk Technician'),
('IT', 'IT Support and Operations', 'IT Technician'),
('IT', 'IT Support and Operations', 'IT Operations Manager'),
('IT', 'IT Support and Operations', 'System Administrator'),
('IT', 'IT Support and Operations', 'Network Administrator'),
('IT', 'IT Support and Operations', 'Desktop Support Technician'),

('IT', 'Networking and Infrastructure', 'Network Engineer'),
('IT', 'Networking and Infrastructure', 'Network Architect'),
('IT', 'Networking and Infrastructure', 'Cloud Engineer'),
('IT', 'Networking and Infrastructure', 'Infrastructure Engineer'),
('IT', 'Networking and Infrastructure', 'VoIP Engineer'),
('IT', 'Networking and Infrastructure', 'Wireless Network Engineer'),

('IT', 'Cybersecurity', 'Cybersecurity Analyst'),
('IT', 'Cybersecurity', 'Cybersecurity Engineer'),
('IT', 'Cybersecurity', 'Information Security Analyst'),
('IT', 'Cybersecurity', 'Penetration Tester (Ethical Hacker)'),
('IT', 'Cybersecurity', 'Security Architect'),
('IT', 'Cybersecurity', 'Incident Response Specialist'),
('IT', 'Cybersecurity', 'Chief Information Security Officer (CISO)'),

('IT', 'Data and Analytics', 'Data Scientist'),
('IT', 'Data and Analytics', 'Data Analyst'),
('IT', 'Data and Analytics', 'Data Engineer'),
('IT', 'Data and Analytics', 'Database Administrator (DBA)'),
('IT', 'Data and Analytics', 'Machine Learning Engineer'),
('IT', 'Data and Analytics', 'Business Intelligence Analyst'),
('IT', 'Data and Analytics', 'Data Architect'),

('IT', 'Cloud Computing', 'Cloud Architect'),
('IT', 'Cloud Computing', 'Cloud Operations Engineer'),
('IT', 'Cloud Computing', 'Azure Administrator'),
('IT', 'Cloud Computing', 'AWS Solutions Architect'),
('IT', 'Cloud Computing', 'Google Cloud Engineer'),
('IT', 'Cloud Computing', 'Cloud DevOps Engineer'),

('IT', 'Artificial Intelligence and Machine Learning', 'AI Engineer'),
('IT', 'Artificial Intelligence and Machine Learning', 'Machine Learning Engineer'),
('IT', 'Artificial Intelligence and Machine Learning', 'Natural Language Processing (NLP) Specialist'),
('IT', 'Artificial Intelligence and Machine Learning', 'Computer Vision Engineer'),
('IT', 'Artificial Intelligence and Machine Learning', 'AI Research Scientist'),
('IT', 'Artificial Intelligence and Machine Learning', 'Robotics Engineer'),

('IT', 'Testing and Quality Assurance', 'QA Engineer'),
('IT', 'Testing and Quality Assurance', 'Software Tester'),
('IT', 'Testing and Quality Assurance', 'Automation Tester'),
('IT', 'Testing and Quality Assurance', 'Test Analyst'),
('IT', 'Testing and Quality Assurance', 'Performance Tester'),

('IT', 'IT Management', 'IT Manager'),
('IT', 'IT Management', 'IT Director'),
('IT', 'IT Management', 'Chief Information Officer (CIO)'),
('IT', 'IT Management', 'Chief Technology Officer (CTO)'),
('IT', 'IT Management', 'IT Project Manager'),
('IT', 'IT Management', 'IT Service Manager'),
('IT', 'IT Management', 'Scrum Master'),
('IT', 'IT Management', 'Product Owner'),
('IT', 'IT Management', 'Programme Manager'),
('IT', 'IT Management', 'Head of Department'),

('IT', 'Specialised IT Roles', 'Blockchain Developer'),
('IT', 'Specialised IT Roles', 'IoT Engineer'),
('IT', 'Specialised IT Roles', 'AR/VR Developer'),
('IT', 'Specialised IT Roles', 'ERP Specialist (SAP Consultant)'),
('IT', 'Specialised IT Roles', 'Site Reliability Engineer (SRE)'),
('IT', 'Specialised IT Roles', 'Technical Writer');