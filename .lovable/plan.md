# AIApply evaluation — what Jobz should (and shouldn't) take

## What AIApply actually is

A candidate-side, subscription job-search toolkit. Not a marketplace — it sits on top of everyone else's job boards.

Their product stack:
- **Auto Apply** — after a quiz + CV upload, their AI submits 10–100 applications a day to matched roles on external boards. Sold by application volume.
- **Application Kit** — for one job description, instantly generates a tailored CV, cover letter and follow-up email.
- **Resume / cover letter builders** — ATS-oriented rewriting.
- **Mock Interview** — free role-specific practice questions with instant feedback; the main top-of-funnel hook.
- **Interview Buddy** — a desktop app that listens during a live Zoom/Teams interview and feeds real-time answer suggestions (hidden from screen share). Sold separately, USD 19/mo.
- Pricing: Toolkit USD 29/mo, Interview Buddy USD 19/mo, Auto Apply separate.

Their growth engine is the same one Jack & Jill uses and the one we already started copying: free single-purpose AI tools that rank in search, then upsell.

## The honest read for Jobz

Jobz is a consent-first two-sided marketplace where employers set a match threshold and candidates apply to real vacancies. AIApply is spray-and-pray volume from the other side of the table. **Most of their model is actively hostile to our employers** — Auto Apply is exactly the noise our match gate exists to stop, and Interview Buddy is covert coaching that would destroy employer trust if Jobz shipped it.

So the recommendation is: take their funnel tactics and their preparation tools, reject their volume automation entirely.

## Recommended: adopt

**1. Application Kit, Jobz-flavoured ("Tailor my application")**
On the apply form for a specific vacancy, a button that drafts a cover letter grounded in the candidate's real profile and that job's description and essential criteria. Editable before submit, never auto-submitted. This raises application quality for employers rather than volume — the opposite of Auto Apply. We already store `cover_letter` on applications and already have the profile + job data, so this is a natural fit.

**2. Free AI mock interview (public tool)**
Same playbook as the `/cv-review` page we just shipped: a public, no-login page that generates role-specific questions, takes typed answers, and gives structured feedback. Logged-in candidates get questions generated from a real Jobz vacancy they've been matched to. This is our second SEO/top-of-funnel asset and a genuine candidate benefit.

**3. Match-gap coaching**
Where the match score shows a gap ("missing certification X", "title distance"), tell the candidate concretely what would close it. We already compute reasons and gaps in the matching utilities; this is surfacing what we have as advice rather than a verdict.

**4. Free-tools hub page**
A single `/tools` landing page linking CV review, mock interview, and the salary/cost calculators, each with its own indexable page. This is the structural piece that makes the individual tools compound.

## Recommended: reject

- **Auto Apply / bulk applying.** Directly undermines the match threshold employers rely on, and would flood the applications table. Non-negotiable no.
- **Interview Buddy-style live answer feeding.** Covert assistance during an employer's interview. Reputationally fatal for a marketplace that sells honest matching to both sides.
- **Scraping external boards to apply on the candidate's behalf.** Legal and GDPR exposure, and off-strategy.
- **Their engagement-bait stats style** ("61% get an interview in 10 days"). We should not publish outcome claims we cannot verify from our own data.

## Suggested build order

1. Tailor-my-application (highest employer value, uses data we already hold)
2. Free mock interview page (top-of-funnel, mirrors `/cv-review`)
3. `/tools` hub + nav entry
4. Match-gap coaching copy in the candidate match UI

## Technical notes

- Tailoring and mock interview both go through new edge functions on the Lovable AI Gateway using `google/gemini-2.5-flash`, following the existing `cv-review` function's shape.
- Mock interview is public: `verify_jwt = false` in `supabase/config.toml`, no data written for anonymous users.
- Tailoring is authenticated: the function must verify the JWT and confirm the caller owns the candidate profile before reading it, matching the ownership checks we added to `open-cv`.
- Cover letter output is written to the existing form state in `useApplication.ts` — no schema change needed.
- New routes must be added to `src/App.tsx` (the real router), not `src/config/routes.tsx`.
- Each public tool page needs its own title/description and a link from the homepage or footer to be indexable.

Nothing here is built yet — this plan is the evaluation and the shortlist.
