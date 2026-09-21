ALTER TABLE public.employer_prospects
  ADD COLUMN IF NOT EXISTS signal_kind TEXT,
  ADD COLUMN IF NOT EXISTS signal_summary TEXT,
  ADD COLUMN IF NOT EXISTS signal_source_url TEXT,
  ADD COLUMN IF NOT EXISTS signal_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_employer_prospects_signal_at
  ON public.employer_prospects (signal_at DESC NULLS LAST);