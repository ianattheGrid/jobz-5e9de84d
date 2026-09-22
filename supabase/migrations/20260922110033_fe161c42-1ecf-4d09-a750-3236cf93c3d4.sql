ALTER TABLE public.target_companies
  ADD COLUMN IF NOT EXISTS staff_band TEXT,
  ADD COLUMN IF NOT EXISTS read_frequency TEXT NOT NULL DEFAULT 'rotating',
  ADD COLUMN IF NOT EXISTS last_vacancy_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS site_lookup_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_target_companies_reading
  ON public.target_companies (read_frequency, last_scraped_at NULLS FIRST)
  WHERE is_active AND excluded_reason IS NULL;