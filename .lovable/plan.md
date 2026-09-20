# Attracting candidates and making them easier to find

## What the two sites actually do

**Juicebox** is a search engine over ~800 million public profiles. An employer types a sentence ("IT support, Bristol, 2+ years"), and it turns that into filters, ranks everyone, and shows a green/amber/red verdict per person with the reason written out. It also runs searches in the background and emails a daily shortlist.

**Jack & Jill** is the opposite bet: no giant scraped database, just people who have had a proper conversation with their candidate-side agent. The company side searches only that pool, scores each person against criteria agreed in a chat, and then makes a warm introduction to the hiring manager instead of an application. The candidate side is free and genuinely useful on its own — job scanning, salary benchmarks, coaching — which is *how they got the candidates in the first place*.

## What's worth copying (and what isn't)

Worth copying:
- **Ranked results with a plain-English reason** per candidate. You already rank; the reasoning is thin.
- **A background search that emails employers a shortlist** when someone new matches, instead of them coming back to look.
- **"Freshness" dots** — actively looking / open / quiet — so employers don't waste time on dormant profiles.
- **Give candidates something free and useful before asking them to sign up.** This is the real lesson from Jack & Jill, and it's how you solve the LinkedIn problem. You already have the free CV review — it's buried.

Not worth copying: scraping LinkedIn or buying a profile database. It's expensive, legally messy in the UK, and it destroys your whole "no middlemen, direct, honest" positioning.

## How to get more candidates (the LinkedIn question)

You cannot out-database LinkedIn. You can be the place worth joining for a specific group: people who want Bristol jobs, no agency in the middle, and want to be found rather than to apply endlessly. Proposed build:

1. **Free CV Review as the front door.** Promote it on the homepage as the main candidate call to action. At the end of a review, offer: "Want employers in Bristol to find you? We'll turn this into your profile" — the CV pre-fills the profile so signup takes a minute, not twenty.
2. **A shareable candidate profile link.** One clean public page a candidate can put in their LinkedIn bio, in a DM, or on a CV. Every candidate becomes a small advert for Jobz.
3. **"Open to work, quietly" switch.** Candidates say what they want next without their current employer seeing it — the thing LinkedIn is bad at.
4. **Invite by link for recruiters and candidates.** Recruiter email invites work now; add a copyable link and a WhatsApp/LinkedIn share.
5. **Weekly "roles that fit you" email** so candidates come back rather than sign up once and vanish.

## Making candidates easier to find (employer side)

6. **Rewrite the results list** to show, per candidate: fit percentage, one sentence on why they fit, what's missing, and how recently they were active.
7. **Search from a vacancy** — one button on a posted job: "Find people for this role", no filters to fill in.
8. **Saved search → daily email** of new matching candidates.
9. **Restyle the search page** — it's white on a dark cosmic site and looks like a different product.

## Suggested order

Start with 1, 2, 6 and 7 — they give candidates a reason to join and employers an immediately better list. Then 3, 5, 8. Then the rest.

## Technical notes

- `src/pages/CandidateSearch.tsx` + `src/components/candidate-search/*` and `src/hooks/useCandidateSearch.ts` already do natural-language criteria; extend the result card with reasoning, gaps and activity rather than rebuilding.
- Activity dots from `candidate_profiles.updated_at` / last sign-in plus a new self-declared `availability_status` column.
- CV-to-profile prefill reuses the existing `tailor-cv` style edge function pattern (JWT-verified, no invented facts).
- Saved-search alerts: extend the existing saved searches table with a cadence flag and a scheduled function using the shared `_shared/email.ts` sender.
- Public profile page: new route with a slug column and an explicit candidate opt-in, RLS-readable by anon only when opted in.
