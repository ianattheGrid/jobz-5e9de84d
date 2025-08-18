-- Create portfolio table for candidate portfolio items
CREATE TABLE public.candidate_portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image', 'pdf', 'document'
  file_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.candidate_portfolio ENABLE ROW LEVEL SECURITY;

-- Create policies for candidate portfolio
CREATE POLICY "Candidates can manage own portfolio" 
ON public.candidate_portfolio 
FOR ALL 
USING (auth.uid() = candidate_id)
WITH CHECK (auth.uid() = candidate_id);

CREATE POLICY "Employers can view candidate portfolios" 
ON public.candidate_portfolio 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'employer'
));

-- Create storage bucket for portfolio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('candidate_portfolio', 'candidate_portfolio', true);

-- Create storage policies for portfolio bucket
CREATE POLICY "Portfolio files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'candidate_portfolio');

CREATE POLICY "Users can upload their own portfolio files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'candidate_portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own portfolio files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'candidate_portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own portfolio files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'candidate_portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add updated_at trigger
CREATE TRIGGER update_candidate_portfolio_updated_at
  BEFORE UPDATE ON public.candidate_portfolio
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();