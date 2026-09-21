# What Pin and Boilr do, and what Jobz should take from them

## The short version

Both are tools for recruiters, not for employers or candidates. Both are built on the two
things Jobz has deliberately ruled out.

**Pin** searches 850 million profiles scraped from LinkedIn, GitHub, Crunchbase and
others, then runs automated outreach sequences to people who never asked to be contacted.
It costs $99–$179 per recruiter per month.

**Boilr** calls itself "an AI sales employee" for recruitment agencies. It watches funding
announcements, Companies House filings, news and hiring pages, then writes and sends cold
sales emails to the people who'd pay an agency fee — and sources candidates from LinkedIn
and GitHub on the side.

So Boilr is the machine that creates the £8,000 agency fee Jobz exists to remove. Neither
is a competitor to copy wholesale. But two of their ideas are good and legal.

## Idea 1 — Hiring signals, not just job adverts (worth doing)

Right now the overnight prospect agent only notices an employer when they've already
posted a job advert somewhere. By then an agency has usually called them.

Boilr's better trick is spotting the moment *before* the advert: a funding round, a new
office, a jump in hiring. Those all come from public business sources — Companies House,
local Bristol news, company blogs — which are company facts, not personal data, so this
stays on the right side of the line.

What changes:

- Each prospect in your queue gains a short "why now" line: *"Posted 4 roles in the last
  month"*, *"Filed a funding round in August"*, *"Opened a Bristol office"*.
- Prospects sort by strongest signal, so the ones worth a message are at the top.
- The signal, with a link to where it came from, goes in the note you approve — so the
  one email you send says something real rather than a generic pitch.

Nothing about the approval flow changes. Still one email, ever, still only after you press
send, still a clear opt-out.

## Idea 2 — "Why this person fits", in plain words (worth doing)

Pin's genuinely good bit is that every candidate comes with a sentence explaining the
match: *"shipped payments systems at two Series B fintechs — direct match for the core
stack"*. Jobz shows a match percentage. A number without a reason makes an employer
click into every profile.

What changes:

- Each candidate in employer search results and on each application gains one or two
  plain-sentence reasons, written from the profile data Jobz already holds — years in
  similar roles, overlapping skills, location, availability.
- Written once when the result is shown, never invented: anything not in the profile
  isn't mentioned. No stored claims about people.

## Idea 3 — The morning habit (small, worth doing)

Boilr's framing is "one morning habit": everything the agent did lands in one inbox and
you clear it in ten minutes. Jobz already emails you a daily round-up at 7am, but the
round-up doesn't link straight to the things needing a decision.

Change the round-up into a short list of actual buttons: *3 employers to approve*,
*2 candidates waiting*, each linking directly to the item. That's the under-30-minutes
week made real.

## What Jobz should not copy

- **Scraping 850 million profiles.** Public doesn't mean fair game under UK GDPR, and
  LinkedIn sues scrapers. It also breaks the promise on our own homepage.
- **Automated outreach sequences.** Day 1 email, day 2 LinkedIn, day 5 follow-up, to
  someone who never asked. Jobz sends one message, once, after you approve it.
- **"Autonomous mode".** Boilr will send on a schedule with nobody reading it. Everything
  Jobz sends stays behind your press of a button.
- **Verified decision-maker personal emails.** Jobz uses the published business address on
  the company's own site, not an enriched personal one.

## Technical notes

1. Extend `find-employer-prospects` with a signals step: alongside the existing external
   job pull, query Companies House's free public API by company name for recent filings
   and incorporation, count that company's adverts seen in the last 30 days, and read the
   company's own news/blog page already fetched for the contact address. Store as
   `signal_kind`, `signal_summary`, `signal_source_url`, `signal_at` on
   `employer_prospects`; order the admin queue by `signal_at`. Same batch cap, lease row
   and circuit breaker as now.
2. Match reasons: a small pure helper (`src/utils/matching/matchReasons.ts`) deriving two
   reason strings from the candidate profile and vacancy already loaded client-side — no
   AI call, no new table, no writes. Rendered in the employer search result card and
   `ApplicationCard`.
3. `growth-digest`: group the counts into action rows with deep links to
   `/admin/growth` and the relevant dashboard; same daily 7am schedule, same sender.

## Order

1. Hiring signals on the prospect queue.
2. Match reasons in employer search and applications.
3. Round-up email becomes an action list.
