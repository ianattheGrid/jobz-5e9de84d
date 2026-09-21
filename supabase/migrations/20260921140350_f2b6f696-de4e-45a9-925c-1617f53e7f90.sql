-- Attribution on profiles
ALTER TABLE public.candidate_profiles
  ADD COLUMN IF NOT EXISTS signup_source text,
  ADD COLUMN IF NOT EXISTS signup_source_detail text;

ALTER TABLE public.employer_profiles
  ADD COLUMN IF NOT EXISTS signup_source text,
  ADD COLUMN IF NOT EXISTS signup_source_detail text;

-- Prospect queue improvements
ALTER TABLE public.employer_prospects
  ADD COLUMN IF NOT EXISTS contact_source text,
  ADD COLUMN IF NOT EXISTS skip_reason text;

-- One-off follow-up emails
CREATE TABLE IF NOT EXISTS public.growth_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  kind text NOT NULL,
  context jsonb,
  due_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  suppressed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.growth_followups TO service_role;
GRANT SELECT ON public.growth_followups TO authenticated;

ALTER TABLE public.growth_followups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view follow-ups"
  ON public.growth_followups FOR SELECT
  TO authenticated
  USING (public.current_user_is_admin());

CREATE UNIQUE INDEX IF NOT EXISTS growth_followups_email_kind_idx
  ON public.growth_followups (lower(email), kind);

CREATE INDEX IF NOT EXISTS growth_followups_due_idx
  ON public.growth_followups (due_at) WHERE sent_at IS NULL AND suppressed = false;

CREATE TRIGGER growth_followups_updated_at
  BEFORE UPDATE ON public.growth_followups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Per-IP rate limiting for the public salary tool
CREATE TABLE IF NOT EXISTS public.public_tool_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool text NOT NULL,
  ip_address text NOT NULL,
  used_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.public_tool_usage TO service_role;

ALTER TABLE public.public_tool_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view tool usage"
  ON public.public_tool_usage FOR SELECT
  TO authenticated
  USING (public.current_user_is_admin());

CREATE INDEX IF NOT EXISTS public_tool_usage_lookup_idx
  ON public.public_tool_usage (tool, ip_address, used_at DESC);