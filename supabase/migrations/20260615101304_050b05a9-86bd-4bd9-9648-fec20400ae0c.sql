ALTER TABLE public.applications ALTER COLUMN employer_accepted DROP DEFAULT;
ALTER TABLE public.applications ALTER COLUMN candidate_accepted DROP DEFAULT;

UPDATE public.applications
SET employer_accepted = NULL
WHERE employer_accepted = false
  AND rejection_reason IS NULL;

UPDATE public.applications
SET candidate_accepted = NULL
WHERE candidate_accepted = false;