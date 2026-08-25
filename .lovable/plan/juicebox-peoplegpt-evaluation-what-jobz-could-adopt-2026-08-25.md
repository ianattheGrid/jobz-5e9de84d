# Juicebox (PeopleGPT) evaluation — what Jobz could adopt

## What Juicebox actually is

Juicebox is an **outbound sourcing tool for recruiters**, not a job board. Recruiters type a plain-English description of who they want, and it searches ~800M scraped public profiles across 30+ data sources, verifies contact details, and then emails those people automatically. Pricing starts around $99/month per recruiter seat.

Its core pieces:

1. Natural-language search ("PeopleGPT") — no boolean filter forms, just a sentence.
2. AI sourcing agents — a persistent agent that keeps hunting and shortlisting for an open role.
3. AI-written outreach + multi-step email sequences with reply tracking.
4. A candidate CRM: everyone you've ever sourced stays in a searchable pool.
5. "Talent rediscovery" — re-surfacing past applicants when a new role opens.
6. ATS/CRM integrations so it sits on top of existing tooling.
7. Explainable shortlists — each candidate comes with reasons they fit.

## How this compares to Jobz

Jobz is a **two-sided inbound marketplace** (candidates opt in, employers post vacancies, Connectors refer, Webby matches). Juicebox's whole premise — scraping and cold-emailing people who never signed up — is the opposite model, and in the UK it also carries GDPR baggage. So most of Juicebox is **not** something Jobz should copy.

Where Jobz genuinely lags is that employer-side search is still a **filter form** (`SearchForm` with work area, location, radius, commission, signup period), while matching quality, outreach and re-engagement are thin.

## Recommended adoptions (ranked)

### 1. Natural-language candidate search for employers
Replace/augment the filter form on `/candidate-search` with a single prompt box: *"Senior React dev in Bristol, open to hybrid, under £70k."* An AI call parses the sentence into the existing search filters, runs the existing query, and shows the filters it inferred as editable chips. Low risk — it's a front door onto search logic that already exists.

### 2. Explainable match results everywhere
Jobz already computes a match score and a breakdown when applying. Surface the same "why this person fits / what's missing" text on employer search results and swipe cards, not just at application time. This is Juicebox's most-praised feature and Jobz is one UI change away from it.

### 3. Talent rediscovery
When an employer posts a new vacancy, automatically scan candidates who previously applied to that employer (or scored highly and were passed over) and show "12 people from your past pipeline match this role." Pure re-use of existing data, zero scraping.

### 4. A saved talent pool / lightweight CRM
Employers can shortlist, tag and add private notes to candidates, and revisit them per-role. Currently interest is fairly transient (swipe / Webby interest). Saved searches already exist — this extends the same idea to people.

### 5. Webby as a persistent sourcing agent
Today Webby is conversational and reactive. Give employers a "keep looking for this role" toggle so Webby re-runs matching as new candidates sign up and notifies them on a new strong match. This is Juicebox's "agent" idea, implemented inbound-only.

### 6. Sequenced, AI-drafted outreach (opt-in only)
AI-drafted first message plus one automated nudge if a candidate doesn't reply — but only to candidates already on Jobz who have consented to being contacted. Never cold email.

## Explicitly not recommended

- Scraping public profiles / building a shadow database of non-users — GDPR risk and it breaks the consent-first, candidate-controlled positioning Jobz is built on.
- Cold email sequences to people who never signed up.
- Repositioning as a recruiter seat-licence tool — it conflicts with the Connector commission model.

## Technical notes

- NL search: new edge function (Lovable AI Gateway) that maps a prompt to the existing `searchFormSchema` shape; UI change in `src/components/candidate-search/SearchForm.tsx` + `useCandidateSearch`.
- Explanations: reuse `src/components/job-card/utils/matchExplanation.ts` and `useMatchScore` on the employer side.
- Rediscovery + talent pool: new tables (`employer_talent_pool`, plus a saved-candidate note/tag table) with RLS scoped to the employer, and grants for `authenticated` / `service_role`.
- Persistent Webby agent: scheduled job re-running `webby-match-employer` against new candidate rows since last run.

## Suggested first step

Ship items 1 and 2 together — natural-language search with explained results. It's the visible half of Juicebox's appeal, uses data Jobz already holds, and needs no new legal posture.
