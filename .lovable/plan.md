# Jack & Jill (jackandjill.ai) evaluation — what Jobz could adopt

## What Jack & Jill actually is

A two-agent hiring marketplace, $20M raised, ~374k job seekers. Two named AI personas do the work so neither side has to search:

- **Jack** — free AI career agent for candidates: finds roles, tailors the CV, identifies the hiring manager, drafts the intro, runs mock interviews, offers "career clarity" coaching.
- **Jill** — AI recruiting agent for employers: takes the brief conversationally, sources and screens, and presents a shortlist "in minutes". Priced as a per-hire fee positioned at roughly half an agency's.
- The hook: Jack knows what people want *before* they're actively looking, so Jill gets warm, consenting candidates instead of cold outreach.

Free standalone tools (resume improver, mock interviews, career clarity) run on separate entry pages and act as the top-of-funnel that feeds the candidate pool.

## How this compares to Jobz

Jobz is already the same shape: consent-first two-sided marketplace, Webby as the AI layer, Connectors for referrals. Unlike Juicebox, Jack & Jill is **not** a scraping/cold-email model, so most of it is legitimately adoptable.

Where Jobz differs today: there is no candidate-side career tooling, and no free tool that pulls new candidates in before they're job-hunting. Webby staying a single assistant is fine — it just needs to be obvious, on any given screen, whether it is helping a candidate or an employer.

## Recommended adoptions (ranked)

### 1. Free CV/resume improver as the top-of-funnel
A public, no-login page: drop a CV, get a scored analysis and rewritten bullet points in ~30 seconds, then "save this to your Jobz profile" as the signup call to action. Jobz already parses CVs (`parse-cv`), so this is mostly a new public page plus an AI critique pass. This is Jack & Jill's single biggest growth lever and Jobz is closest to it.

### 2. Make Webby's two modes obvious (no second agent)
Keep one Webby. Just make the audience unmistakable: clear "for candidates" / "for employers" framing on the Webby entry points and homepage, and mode-specific intro copy and suggested prompts once inside. Copy and routing only — no new persona, no engine change.

### 3. Conversational vacancy intake for employers
Replace the long `VacancyForm` as the *default* path with a chat: the employer describes the role, the agent drafts the structured vacancy (title, salary, skills, criteria, match threshold) and shows it for edit before posting. Mirrors the smart candidate search already shipped, and the form stays available as the manual fallback.

### 4. Candidate-side application coaching
On each job a candidate is matched to: what to emphasise from their profile, the gaps to address, and a tailored short intro. Reuses the match explanation work already built — same data, candidate-facing.

### 5. AI mock interviews
Practice questions generated from the specific vacancy plus the candidate's profile, with feedback on answers. Strong retention feature and it plugs into the existing interviews area rather than sitting alone.

### 6. "Passive candidate" signal
Let candidates mark themselves as open-but-not-looking with the conditions that would move them (salary, remote, seniority). Employers only see them when a vacancy meets those conditions. This is the Jack-knows-first mechanic, done with explicit consent.

## Explicitly not recommended

- Per-hire agency-style fee pricing — it conflicts with the Jobz Connector commission model.
- Auto-applying on a candidate's behalf without their review, and auto-drafted cold outreach to hiring managers.
- A second named AI agent. One Webby, clearly signposted per audience, is enough.
- Detaching the free tools into a separate brand; on Jobz they should feed one account system.

## Technical notes

- CV improver: public route + edge function wrapping `parse-cv` output with a Lovable AI Gateway critique call; anonymous use rate-limited, results held in session until signup.
- Webby signposting: copy and routing across `src/components/webby/`, `WebbyCandidate.tsx`, `WebbyEmployer.tsx`; no schema or engine change.
- Conversational vacancy intake: new edge function emitting the `VacancyFormSchema` shape via tool-calling (same pattern as `parse-candidate-search`), rendered into the existing form for confirmation.
- Application coaching: reuse `matchExplanation.ts` / `titleMatching.ts` on the candidate side of the job card.
- Mock interviews: new table for sessions and feedback with RLS scoped to the candidate, plus grants for `authenticated` / `service_role`.
- Passive signal: new columns on `candidate_profiles` for open-to status and trigger conditions, honoured in `useCandidateSearch` and the Webby employer matcher.

## Suggested first step

Ship item 1 (free CV improver) and item 2 (clearer Webby signposting) together — one brings strangers in, the other makes it obvious what Webby does for them once they arrive.
