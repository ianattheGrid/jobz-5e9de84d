CREATE TABLE public.employer_shortlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'My shortlist',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.employer_shortlists TO authenticated;
GRANT ALL ON public.employer_shortlists TO service_role;

ALTER TABLE public.employer_shortlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers manage their own shortlists"
  ON public.employer_shortlists FOR ALL TO authenticated
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

CREATE TABLE public.employer_shortlist_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shortlist_id uuid NOT NULL REFERENCES public.employer_shortlists(id) ON DELETE CASCADE,
  employer_id uuid NOT NULL,
  candidate_id uuid NOT NULL,
  job_id bigint REFERENCES public.jobs(id) ON DELETE SET NULL,
  tags text[] NOT NULL DEFAULT '{}',
  note text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (shortlist_id, candidate_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.employer_shortlist_entries TO authenticated;
GRANT ALL ON public.employer_shortlist_entries TO service_role;

ALTER TABLE public.employer_shortlist_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers manage their own shortlist entries"
  ON public.employer_shortlist_entries FOR ALL TO authenticated
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

CREATE TRIGGER update_employer_shortlists_updated_at
  BEFORE UPDATE ON public.employer_shortlists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employer_shortlist_entries_updated_at
  BEFORE UPDATE ON public.employer_shortlist_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_shortlist_entries_employer ON public.employer_shortlist_entries(employer_id);
CREATE INDEX idx_shortlist_entries_shortlist ON public.employer_shortlist_entries(shortlist_id);