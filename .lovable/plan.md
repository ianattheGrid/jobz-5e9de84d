# Tailor my CV to this vacancy

Drop the mock-interview idea. Build one candidate feature: help a candidate adapt their CV (and cover letter) to a specific Jobz vacancy, with the candidate always in control of the final text.

## What the candidate gets

On a job they can apply to, a "Tailor my CV for this role" action opens a panel that shows:

- A short read of how their CV lines up with this vacancy — what already matches, and what the vacancy asks for that their CV doesn't currently evidence.
- 3-6 rewritten CV bullet points, using only the experience already in their CV, worded against this vacancy's language and requirements.
- A suggested professional summary/profile paragraph aimed at this role.
- Keyword gaps: terms in the job ad that a screener would look for and that are missing from the CV, with guidance on where to add them honestly.
- A draft cover letter tailored to the vacancy, editable, pre-filled into the existing application cover-letter field when they choose to use it.

Nothing is auto-submitted and nothing is invented — the AI is instructed never to add employers, dates, qualifications or metrics that aren't in the CV. Every suggestion is copy/edit-first.

## Where it appears

- Inside the job application flow (the apply dialog on a job card), so it is used at the moment of applying.
- On the candidate's applications area, for applications not yet submitted.
- The existing public `/cv-review` tool stays as-is (general CV feedback, no vacancy). This new feature is the logged-in, vacancy-specific version.

## Scope boundaries

- No mock interview.
- No bulk/auto apply.
- No scraping of external job boards for this feature.
- No rewriting of the stored CV file — suggestions only; the candidate edits their own document.

## Technical notes

- New edge function `supabase/functions/tailor-cv/index.ts`, JWT-verified (unlike `cv-review`, which is public). It:
  - Authenticates the caller, loads the candidate's own profile/CV text and the target job by id, and rejects any request where the caller doesn't own the profile.
  - Calls the Lovable AI Gateway with `openai/gpt-5.6-sol`, using structured tool-calling output (same pattern as `cv-review`) for: `alignment`, `rewrittenBullets`, `suggestedSummary`, `keywordGaps`, `coverLetterDraft`.
  - Handles gateway 429/402/403 explicitly and returns the gateway message to the UI; caps input size like `cv-review` does.
- CV text source: reuse the existing `parse-cv` output / stored CV text where available; fall back to a paste box when the profile has no parsed CV.
- New component `src/components/job-card/TailorCvPanel.tsx`, opened from the apply dialog; writes the accepted cover-letter draft into `coverLetter` state in `src/components/job-card/hooks/useApplication.ts`.
- Reuse existing match-explanation data (`utils/matchExplanation.ts`, `useMatchScore`) to seed the alignment section so the AI and the match score tell the same story.
- Register the function in `supabase/config.toml` with `verify_jwt = true`.

## Build order

1. `tailor-cv` edge function + ownership checks, tested with a real vacancy.
2. `TailorCvPanel` UI in the apply flow, with copy-to-clipboard and "use this cover letter".
3. Wire keyword gaps into the match-score explanation so the advice is consistent.
