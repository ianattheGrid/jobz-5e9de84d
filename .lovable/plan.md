# Agents that go out and find new people

You picked the option I'd flagged as ruled out, so let me be straight about why, and then show what we can build that gets you the same result legally.

## What we can't do

Scraping LinkedIn profiles and cold-emailing people who never signed up is how Juicebox works. In the UK that needs a lawful basis under UK GDPR and PECR, LinkedIn actively blocks and sues scrapers, and it contradicts the promise the whole of Jobz is built on: your CV stays yours, nobody pitches you without asking. One complaint would cost more than the hires are worth. I'm not going to build it.

## What we build instead: two growth agents

Same outcome — new candidates and new employers arriving without you chasing them — but every person has raised their hand first.

### Agent 1 — find employers who are already hiring

Bristol SMEs advertising jobs in public (their own careers pages, public feeds) are businesses, not private individuals, and a business contact address is fair game. The agent runs nightly and:

- collects newly advertised Bristol roles from sources that permit it (we already scrape external jobs — this reuses that pipeline)
- works out the employer behind each role and whether they're already on Jobz
- builds a queue of prospects with the role, the likely agency fee at 20%, and the Jobz price
- **shows them to you in the admin area for approval** — nothing is sent automatically
- on your approval, sends one email, once, with a clear opt-out and no follow-up chase

You stay the person who decides. That's the difference between outreach and spam.

### Agent 2 — turn every candidate into a recruiter of candidates

Candidates can't be cold-contacted, so they arrive through people who already trust Jobz:

- **Invite links** — every candidate, employer and Connector gets a copyable link plus WhatsApp and LinkedIn share buttons
- **Referral credit** — when someone joins through your link, it's recorded, and the existing Connector commission machinery already handles rewarding it
- **Share-back after the free CV review** — the moment someone gets a useful free review is the moment they'll tell a friend
- **A nightly agent** that spots the gaps: work areas where employers are searching but we have nobody, then emails Connectors "3 employers are looking for warehouse supervisors in Bristol — know anyone?"

### The admin control room

One page showing what both agents found last night, what's waiting for your approval, what was sent, who joined, and a kill switch.

## Order I'd build it

1. Invite links and share buttons — smallest job, immediate effect
2. Employer prospect agent with approval queue and the admin page
3. Referral credit and the CV-review share-back
4. Gap-spotting emails to Connectors

## Technical notes

- Prospect agent: new `employer_prospects` table (source URL, company, role, status, approved_by, sent_at), reusing the `scrape-external-jobs` pipeline; a nightly `pg_cron` job calling a new `find-employer-prospects` function with a batch cap, a single-flight lease row, idempotent per-source dedupe, and a circuit breaker that pauses on AI credit or rate-limit errors.
- Sending stays a separate function triggered only by an admin action, using `_shared/email.ts` (`Jobz <hello@mail.dgrid.co>`), one message per prospect with a suppression list and unsubscribe link; never a sequence.
- Invite links: a `referral_code` on each profile plus a `/join/:code` route feeding the existing `processReferralCode` flow; share buttons are presentation only.
- Gap detection reads `employer_searches` criteria against `candidate_profiles` counts; emails Connectors only, who have already consented to referral prompts.
- Admin page under the existing admin routes, RLS restricted to the admin role, with GRANTs for `authenticated` and `service_role`.
