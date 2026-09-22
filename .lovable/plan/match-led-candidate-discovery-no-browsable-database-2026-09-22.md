# Match-led candidate discovery (no browsable database)

Jobz keeps the job board, drops the idea of a searchable candidate database, and makes every candidate appear only in the context of a real role. Employers get a short ranked list with reasons instead of endless scrolling. Visitors still see anonymous preview cards as proof there are real people here.

## What changes for each person

**Visitor (not signed in)**
- Sees a small set of anonymous preview cards: role, rough area, pay range, years of experience, top skills, availability dot.
- No name, photo, contact details, current employer, or CV. No way to page through everyone.

**Employer**
- Opens a vacancy and presses "Find people for this role". Gets a ranked shortlist with a plain-English reason for each ("matches your role title, 6 years' experience, available now").
- No free-text trawl through all candidates. The role is the search.
- Can shortlist, add private notes, and press "Ask to see full profile" — a short note tied to that vacancy.
- Identifying details only appear once the candidate agrees, or if the candidate has already ticked a field as always visible.

**Candidate**
- A control panel: appear in matches (on/off), availability, and per-field visibility ticks (all off by default).
- A request list showing which company asked and for which role, with Share or Decline, plus a blocklist for companies they don't want seeing them.

## Employer verification

- Checked automatically at signup: Companies House match, work email domain checked against the company website, free webmail rejected.
- Unverified employers can post jobs but cannot see match results or send reveal requests.
- Admin screen to review and revoke.

## What we are not building

- A browsable candidate database or "search all candidates" page.
- Any list of people not attached to a live vacancy.
- Any exposure of identity without the candidate's explicit action.

## Technical notes

Database (one migration):
- `candidate_profiles`: `board_enabled` (default false), `board_visible_fields` (jsonb, all off), `board_blocked_companies` (uuid[]).
- `employer_profiles`: `verification_status` (default 'unverified'), `verified_at`, `verification_method`, `companies_house_number`.
- `candidate_reveal_requests`: candidate, employer, job, note, status (pending/shared/declined), timestamps. RLS: candidate sees their own, employer sees their own.
- `get_candidate_matches_for_job(_job_id uuid)` — SECURITY DEFINER, verified employers who own the job only; returns anonymised fields plus match score and reason components.
- `get_candidate_full(_candidate_id uuid, _job_id uuid)` — SECURITY DEFINER; identifying fields only when the employer is verified and the request is shared, or the candidate ticked the field public.
- `get_public_preview_cards(_limit int)` — SECURITY DEFINER, anon-executable, anonymised cards from opted-in candidates only.
- GRANTs on every new table; EXECUTE granted per function to the roles above.

Frontend:
- Replace the free-text candidate search with a vacancy-scoped results view; `useCandidateSearch` moves to the RPC and stops using `select(*)`.
- `ViewCandidateProfile` gated behind `get_candidate_full`.
- Reveal request panel for employers, request inbox for candidates, visibility panel in candidate settings.
- Public preview strip on the homepage using `get_public_preview_cards`.
- Admin verification queue in `AdminDashboard`.

Styling follows the current deep-space theme; UK English throughout.
