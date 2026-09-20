ALTER TABLE public.employer_searches
  ADD COLUMN IF NOT EXISTS alert_frequency text NOT NULL DEFAULT 'off',
  ADD COLUMN IF NOT EXISTS last_alert_sent_at timestamp with time zone;

ALTER TABLE public.employer_searches
  DROP CONSTRAINT IF EXISTS employer_searches_alert_frequency_check;
ALTER TABLE public.employer_searches
  ADD CONSTRAINT employer_searches_alert_frequency_check
  CHECK (alert_frequency IN ('off','daily'));

ALTER TABLE public.candidate_profiles
  ADD COLUMN IF NOT EXISTS weekly_job_email boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_job_digest_sent_at timestamp with time zone;