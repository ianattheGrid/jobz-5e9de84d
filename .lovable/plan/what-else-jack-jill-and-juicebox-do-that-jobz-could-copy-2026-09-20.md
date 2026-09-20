# What else Jack & Jill and Juicebox do that Jobz could copy

Already done from the earlier reviews: plain-English reasons on each result, activity/freshness dots, natural-language search, "Find people for this role" from a vacancy, free CV review, shareable public profile.

Below is what's genuinely left, in the order I'd do it.

## 1. Saved search that emails a shortlist (Juicebox's "agent")
Employers save a search today but nothing happens afterwards. Add a "email me new matches" switch on a saved search, and a daily job that emails anyone new who matched since yesterday — one email, three to five people, each with the fit percentage and the one-line reason already shown on screen. This is the single biggest thing both sites do that Jobz doesn't: the employer stops having to come back and look.

## 2. CV review turns straight into a profile
Right now the free CV review ends and the person leaves. At the end, offer "Turn this into your Jobz profile" — the CV fills in job title, skills, years of experience and salary expectations, and they just check it and confirm. This is exactly how Jack & Jill builds its candidate pool: give something useful first, ask for the sign-up second.

## 3. Weekly "roles that fit you" email for candidates
One email a week with the jobs that match, so people come back instead of signing up once and vanishing. Pairs with 2 — no point filling the pool if it goes quiet.

## 4. A shortlist employers can keep (lightweight CRM)
Let an employer save a person to a named shortlist, tag them and add a private note, and revisit it per vacancy. At the moment interest is one-shot. Also enables 5.

## 5. "People from your past pipeline" on a new vacancy
When a vacancy is posted, show the people who already applied to that employer, or scored well and were passed over, who fit the new role. No new data needed — it's re-using what's already there.

## 6. Describe the vacancy in a sentence instead of filling the form
Employer types "1st line IT support, Bristol, £26–30k, 2 years' experience", the assistant drafts the whole vacancy and shows it for editing before anything is posted. The current form is long and was a blocker before. The form stays as the manual option.

## 7. Invite by link
Recruiters and candidates can copy a link or share to WhatsApp, not just send an email invite.

## 8. Restyle the candidate search page
It's still white cards on a dark cosmic site and looks like a different product.

## Still explicitly not copying
Scraping LinkedIn or buying a profile database; cold email to people who never signed up; a second named AI agent; per-hire agency-style fees.

## Suggested first step
Items 1 and 2 together: one gives employers a reason to stay, the other is how the candidate pool grows.

## Technical notes
- Saved-search alerts: add `alert_frequency` to `employer_searches`, a scheduled edge function re-running `useCandidateSearch`'s criteria server-side, sending via `_shared/email.ts`; track last-sent to avoid repeats.
- CV-to-profile: extend `cv-review`/`parse-cv` output into the candidate profile draft shape; nothing saves without the candidate confirming; no invented facts.
- Weekly candidate digest: scheduled function over `usePersonalizedJobs` logic plus an unsubscribe flag on `candidate_profiles`.
- Shortlist/CRM + rediscovery: new `employer_shortlists` / `employer_shortlist_entries` tables, RLS scoped to the employer, GRANTs for `authenticated` and `service_role`.
- Conversational intake: new edge function emitting the `VacancyFormSchema` shape via tool-calling, same pattern as `parse-candidate-search`, rendered into the existing form.
- Search restyle: apply the cosmic tokens to `SearchResults.tsx` / `CandidateSearch.tsx` (presentation only).
