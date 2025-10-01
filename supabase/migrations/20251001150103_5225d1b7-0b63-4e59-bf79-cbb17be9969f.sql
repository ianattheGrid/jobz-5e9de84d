-- Create target_companies table for Bristol SMEs
CREATE TABLE IF NOT EXISTS public.target_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  website TEXT,
  careers_page_url TEXT NOT NULL,
  ats_type TEXT, -- 'workday', 'smartrecruiters', 'bamboohr', 'greenhouse', 'lever', 'jazzhr', 'custom'
  industry_sector TEXT,
  estimated_size INTEGER CHECK (estimated_size <= 499),
  location TEXT NOT NULL DEFAULT 'Bristol',
  is_active BOOLEAN DEFAULT true,
  last_scraped_at TIMESTAMP WITH TIME ZONE,
  scrape_frequency_hours INTEGER DEFAULT 24,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create external_jobs table to store scraped job listings
CREATE TABLE IF NOT EXISTS public.external_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.target_companies(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  job_description TEXT,
  location TEXT NOT NULL,
  work_area TEXT, -- for matching with our taxonomy
  specialization TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  contract_type TEXT,
  required_skills TEXT[],
  required_qualifications TEXT[],
  years_experience INTEGER,
  job_url TEXT NOT NULL UNIQUE,
  posting_date TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create external_job_matches table to track which candidates have been notified
CREATE TABLE IF NOT EXISTS public.external_job_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_job_id UUID REFERENCES public.external_jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL,
  match_score INTEGER NOT NULL,
  match_explanation TEXT,
  notified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  candidate_viewed_at TIMESTAMP WITH TIME ZONE,
  candidate_interested BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_target_companies_active ON public.target_companies(is_active, last_scraped_at);
CREATE INDEX idx_external_jobs_company ON public.external_jobs(company_id);
CREATE INDEX idx_external_jobs_active ON public.external_jobs(is_active, scraped_at);
CREATE INDEX idx_external_jobs_location ON public.external_jobs(location);
CREATE INDEX idx_external_job_matches_candidate ON public.external_job_matches(candidate_id);
CREATE INDEX idx_external_job_matches_job ON public.external_job_matches(external_job_id);

-- Enable RLS
ALTER TABLE public.target_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_job_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for target_companies (admin only for insert/update, public read)
CREATE POLICY "Anyone can view active target companies"
  ON public.target_companies FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage target companies"
  ON public.target_companies FOR ALL
  USING ((auth.jwt() ->> 'email') IN (SELECT email FROM public.admins));

-- RLS Policies for external_jobs (public read for active jobs)
CREATE POLICY "Anyone can view active external jobs"
  ON public.external_jobs FOR SELECT
  USING (is_active = true);

CREATE POLICY "System can manage external jobs"
  ON public.external_jobs FOR ALL
  USING (true); -- Will be called by edge functions with service role

-- RLS Policies for external_job_matches (candidates can view their own matches)
CREATE POLICY "Candidates can view their own matches"
  ON public.external_job_matches FOR SELECT
  USING (auth.uid() = candidate_id);

CREATE POLICY "Candidates can update their own matches"
  ON public.external_job_matches FOR UPDATE
  USING (auth.uid() = candidate_id);

-- Add trigger for updated_at
CREATE TRIGGER update_target_companies_updated_at
  BEFORE UPDATE ON public.target_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_external_jobs_updated_at
  BEFORE UPDATE ON public.external_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial Bristol SME companies for testing
INSERT INTO public.target_companies (company_name, website, careers_page_url, ats_type, industry_sector, estimated_size, location) VALUES
('Engine Shed', 'https://www.engine-shed.co.uk', 'https://www.engine-shed.co.uk/careers/', 'custom', 'Technology', 50, 'Bristol'),
('Aardman Animations', 'https://www.aardman.com', 'https://www.aardman.com/careers/', 'custom', 'Creative', 200, 'Bristol'),
('OVO Energy', 'https://www.ovoenergy.com', 'https://www.ovoenergy.com/careers', 'greenhouse', 'Energy/Tech', 400, 'Bristol')
ON CONFLICT DO NOTHING;