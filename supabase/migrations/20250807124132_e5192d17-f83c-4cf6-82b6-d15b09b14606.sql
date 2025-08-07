-- Create tables for user-generated skills system

-- Master skills table for all approved skills across work areas
CREATE TABLE public.master_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name TEXT NOT NULL,
  work_area TEXT NOT NULL,
  specialization TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(skill_name, work_area, specialization)
);

-- User skill suggestions table
CREATE TABLE public.skill_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_name TEXT NOT NULL,
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

-- Enable RLS
ALTER TABLE public.master_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS policies for master_skills
CREATE POLICY "Anyone can view approved skills" 
ON public.master_skills 
FOR SELECT 
USING (true);

-- RLS policies for skill_suggestions
CREATE POLICY "Users can view their own suggestions" 
ON public.skill_suggestions 
FOR SELECT 
USING (auth.uid() = suggested_by);

CREATE POLICY "Users can create suggestions" 
ON public.skill_suggestions 
FOR INSERT 
WITH CHECK (auth.uid() = suggested_by);

CREATE POLICY "Admins can view all suggestions" 
ON public.skill_suggestions 
FOR SELECT 
USING ((auth.jwt() ->> 'email'::text) IN ( SELECT admins.email FROM admins));

CREATE POLICY "Admins can update suggestions" 
ON public.skill_suggestions 
FOR UPDATE 
USING ((auth.jwt() ->> 'email'::text) IN ( SELECT admins.email FROM admins));

-- Add indexes for performance
CREATE INDEX idx_master_skills_work_area ON public.master_skills(work_area);
CREATE INDEX idx_master_skills_specialization ON public.master_skills(specialization);
CREATE INDEX idx_skill_suggestions_status ON public.skill_suggestions(admin_status);
CREATE INDEX idx_skill_suggestions_work_area ON public.skill_suggestions(work_area);

-- Trigger for updated_at
CREATE TRIGGER update_master_skills_updated_at
BEFORE UPDATE ON public.master_skills
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_skill_suggestions_updated_at
BEFORE UPDATE ON public.skill_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Populate master_skills with existing IT skills
INSERT INTO public.master_skills (skill_name, work_area, specialization) 
SELECT skill, 'IT', 'General' 
FROM unnest(ARRAY[
  'Agile (Methodology)', 'Amazon Web Services (AWS)', 'Android Development', 'Angular',
  'Apache Hadoop', 'Apache Kafka', 'Artificial Intelligence (AI)', 'ASP.NET',
  'Atlassian Jira', 'Automation Testing', 'Azure DevOps', 'Bash/Shell Scripting',
  'Big Data', 'Blockchain', 'Bootstrap', 'Business Intelligence (BI)',
  'C', 'C#', 'C++', 'Cisco Networking', 'Cloud Computing', 'Cloud Security',
  'CSS', 'Cybersecurity', 'Data Analysis', 'Data Engineering', 'Data Mining',
  'Data Science', 'Data Visualization', 'Database Management', 'DevOps',
  'Django', 'Docker', 'Elasticsearch', 'ETL (Extract, Transform, Load)',
  'Firebase', 'Flask', 'Git', 'Go (Golang)', 'Google Cloud Platform (GCP)',
  'GraphQL', 'HTML', 'Internet of Things (IoT)', 'iOS Development',
  'IT Project Management', 'ITIL (Information Technology Infrastructure Library)',
  'Java', 'JavaScript', 'Jenkins', 'JSON', 'Kubernetes', 'Laravel',
  'Linux', 'Machine Learning (ML)', 'MATLAB', 'Microsoft Access',
  'Microsoft Azure', 'Microsoft Excel (Advanced)', 'MongoDB', 'MySQL',
  'Network Administration', 'Node.js', 'Numpy', 'Oracle', 'Oracle Database',
  'Pandas', 'Penetration Testing', 'Perl', 'PHP', 'Power BI', 'PowerShell',
  'PostgreSQL', 'Programming (General)', 'Python', 'R', 'React',
  'React Native', 'Redis', 'RESTful APIs', 'Ruby', 'Ruby on Rails',
  'Rust', 'Salesforce', 'SAP', 'SAS', 'Scala', 'Scrum (Framework)',
  'SEO (Search Engine Optimization)', 'Software Development', 'Software Testing',
  'Spring Boot', 'SQL', 'SQL Server', 'Swift', 'Terraform', 'Troubleshooting',
  'TypeScript', 'UI/UX Design', 'Unity (Game Development)',
  'Virtualization (e.g., VMware, Hyper-V)', 'Vue.js', 'Web Development',
  'Web Security', 'Windows Server', 'WordPress', 'XML', 'Xamarin',
  'YAML', 'Zend Framework', 'Zookeeper'
]) AS skill
ON CONFLICT (skill_name, work_area, specialization) DO NOTHING;