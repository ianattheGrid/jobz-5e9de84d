-- Create master_certifications table
CREATE TABLE public.master_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certification_name TEXT NOT NULL,
  work_area TEXT NOT NULL,
  specialization TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(certification_name, work_area, specialization)
);

-- Enable Row Level Security
ALTER TABLE public.master_certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for master_certifications
CREATE POLICY "Master certifications are viewable by everyone" 
ON public.master_certifications 
FOR SELECT 
USING (true);

-- Create certification_suggestions table
CREATE TABLE public.certification_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certification_name TEXT NOT NULL,
  work_area TEXT NOT NULL,
  specialization TEXT,
  suggested_by UUID NOT NULL REFERENCES auth.users(id),
  ai_validation_status TEXT NOT NULL DEFAULT 'pending',
  ai_validation_score DECIMAL,
  ai_validation_reason TEXT,
  admin_status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  admin_reviewed_by UUID REFERENCES auth.users(id),
  admin_reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.certification_suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies for certification_suggestions
CREATE POLICY "Users can view their own certification suggestions" 
ON public.certification_suggestions 
FOR SELECT 
USING (auth.uid() = suggested_by);

CREATE POLICY "Users can create their own certification suggestions" 
ON public.certification_suggestions 
FOR INSERT 
WITH CHECK (auth.uid() = suggested_by);

CREATE POLICY "Users can update their own certification suggestions" 
ON public.certification_suggestions 
FOR UPDATE 
USING (auth.uid() = suggested_by);

-- Create trigger for automatic timestamp updates on master_certifications
CREATE TRIGGER update_master_certifications_updated_at
BEFORE UPDATE ON public.master_certifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic timestamp updates on certification_suggestions
CREATE TRIGGER update_certification_suggestions_updated_at
BEFORE UPDATE ON public.certification_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial certification data
INSERT INTO public.master_certifications (certification_name, work_area, specialization) VALUES
  -- IT Certifications
  ('AWS Certified Solutions Architect', 'IT', 'Cloud Computing'),
  ('Microsoft Azure Fundamentals', 'IT', 'Cloud Computing'),
  ('Google Cloud Professional', 'IT', 'Cloud Computing'),
  ('CISSP', 'IT', 'Cybersecurity'),
  ('CompTIA Security+', 'IT', 'Cybersecurity'),
  ('Oracle Certified Professional', 'IT', 'Database Management'),
  ('Cisco CCNA', 'IT', 'Network Administration'),
  ('PMP (Project Management Professional)', 'IT', NULL),
  
  -- Finance Certifications
  ('ACCA', 'Finance', NULL),
  ('CIMA', 'Finance', NULL),
  ('CFA', 'Finance', NULL),
  ('CPA', 'Finance', NULL),
  
  -- HR Certifications
  ('CIPD Certification', 'HR', NULL),
  ('SHRM-CP', 'HR', NULL),
  ('PHR', 'HR', NULL),
  
  -- Marketing Certifications
  ('Google Ads Certified', 'Marketing', 'Digital Marketing'),
  ('Google Analytics Certified', 'Marketing', 'Digital Marketing'),
  ('HubSpot Certified', 'Marketing', 'Digital Marketing'),
  
  -- Sales Certifications
  ('Salesforce Certified', 'Sales', NULL),
  ('HubSpot Sales Certified', 'Sales', NULL),
  
  -- Legal Certifications
  ('Paralegal Certification', 'Legal', NULL),
  ('Notary Public', 'Legal', NULL),
  
  -- Engineering Certifications
  ('Professional Engineer (PE)', 'Engineering', NULL),
  ('Chartered Engineer (CEng)', 'Engineering', NULL),
  
  -- Manufacturing Certifications
  ('Lean Manufacturing Certification', 'Manufacturing', NULL),
  ('Six Sigma Green Belt', 'Manufacturing', NULL),
  ('Six Sigma Black Belt', 'Manufacturing', NULL),
  
  -- Generic Certifications
  ('PRINCE2', 'Generic', NULL),
  ('Agile/Scrum Master Certified', 'Generic', NULL),
  ('Six Sigma Green Belt', 'Generic', NULL),
  ('Six Sigma Black Belt', 'Generic', NULL);

-- Create indexes for better performance
CREATE INDEX idx_master_certifications_work_area ON public.master_certifications(work_area);
CREATE INDEX idx_master_certifications_specialization ON public.master_certifications(specialization);
CREATE INDEX idx_certification_suggestions_suggested_by ON public.certification_suggestions(suggested_by);
CREATE INDEX idx_certification_suggestions_status ON public.certification_suggestions(admin_status);