ALTER TABLE public.target_companies
  ADD COLUMN IF NOT EXISTS discovered_from text,
  ADD COLUMN IF NOT EXISTS excluded_reason text;

CREATE INDEX IF NOT EXISTS idx_target_companies_active_excluded
  ON public.target_companies (is_active)
  WHERE excluded_reason IS NULL;