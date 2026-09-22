# A candidate board, with the candidate in control

Yes — it's worth having. The job board shows roles; the candidate board shows people who are open to work. Today employers can already search people once signed in, and that search hands over everything on a profile, including name, current employer and contact details. That's the part to fix while adding the board.

## How it works

**Public preview (anyone)**
A wall of anonymous cards: role, rough area (e.g. "Near BS5"), pay range, years of experience, top skills, availability dot. No name, no photo, no employer, no contact. Purely to show employers there are real people here, and to show candidates what a card of theirs would look like.

**Verified employers (signed in and checked)**
Same cards, plus full search and filters, shortlisting, and a "Ask to see full profile" button.

**The candidate's controls**
On their profile, one panel:
- Appear on the candidate board — off by default.
- Availability: actively looking / open to the right offer / not looking.
- Tick what verified employers see straight away: first name, photo, current company, contact details, CV, full location. All off by default.
- Anything untidied stays hidden and needs a request.
- A "See my card as employers see it" preview.
- A list of requests: who asked, their company, the role, with Share / Decline. Sharing can be undone later.
- Blocklist: never show me to these companies (useful for hiding from a current employer).

**Requests**
Employer sends a short note tied to a real vacancy. Candidate gets a notification and email. Nothing personal moves until they say yes.

**Employer verification**
Automatic on signup: company matched to Companies House, work email domain checked against the company website, free webmail rejected. Passing gives instant access; failing puts them in a pending queue. An admin screen lists every employer with status and lets you approve, revoke or suspend by hand.

## Technical detail

Database (migration):
- `candidate_profiles`: `board_enabled` (default false), `board_visible_fields` jsonb (all false by default), `board_blocked_companies` text[].
- `employer_profiles`: `verification_status` (pending/verified/rejected), `verified_at`, `verification_method`, `companies_house_number`.
- New `candidate_reveal_requests`: candidate_id, employer_id, job_id, message, status (pending/accepted/declined/revoked), timestamps. RLS: candidate sees their own, employer sees their own; GRANTs for authenticated + service_role.
- Security-definer function `get_candidate_board(filters)` returning anonymised rows only — no name, email, phone, employer, photo, exact address. This is what both the public preview and employer search read.
- Second function `get_candidate_full(_candidate_id)` that returns identifying fields only when the caller is a verified employer and an accepted reveal request exists, or the candidate ticked that field public.

Frontend:
- New `/people` page (public preview) and employer-only filters, reusing the cosmic dark styling from `CandidateSearch`.
- Rewrite `useCandidateSearch` to call `get_candidate_board` instead of `select('*')` on `candidate_profiles`, and tighten `candidate_profiles` RLS so employers can no longer read rows directly.
- `ViewCandidateProfile` gains a locked state with the reveal request form.
- New `CandidateBoardCard` control panel on the candidate profile page, alongside the existing shareable-profile card.
- Admin employer verification screen; edge function for the Companies House / domain check at signup.

## Order of work

1. Migration: new columns, requests table, board functions, tighter RLS.
2. Anonymous card component + `/people` public preview.
3. Candidate control panel and card preview.
4. Rewire employer search to the anonymised feed; add reveal requests and notifications.
5. Employer verification (auto check + admin queue), gate the employer view behind it.
6. Check on desktop and 390x844, with a verified and an unverified employer.

## Worth flagging

- Existing employer searches will show less than they do now. That's the point, but it is a visible change for the four real accounts.
- No emails go out without a real person clicking send, in line with the outreach rules already set.
