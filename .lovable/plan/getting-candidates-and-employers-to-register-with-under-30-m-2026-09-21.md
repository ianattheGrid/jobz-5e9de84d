# Getting candidates and employers to register — with under 30 minutes a week from you

You want both sides growing, tech is a big slice of the roles, and you can only give this about half an hour a week. So everything below either runs itself or lands in one approval screen you clear in a few minutes on a Monday.

## Short answer on GitHub

No, we should not source candidates from GitHub the way people mean it — pulling names and emails off public profiles and messaging them. A public profile is still a private individual's data, and emailing them unasked is the same cold outreach we ruled out for LinkedIn. It would also contradict the promise Jobz is built on.

What is worth doing with the developer crowd is being *visible* where they already gather, and making it worth their while to come to us: a genuinely useful free tool they can use without an account, that quietly ends with "want Bristol employers to find you?". That is the part we are missing most.

## What we're actually missing

We already have: invite links with share buttons, the free CV review, public shareable profiles, nightly employer prospecting with an approval queue, weekly gap emails to Connectors. What's missing is:

1. **Nothing to come back for.** Someone who gets a CV review and leaves has no reason to return. There's no follow-up.
2. **The employer queue sits empty of contact details.** The agent finds companies but you have to hunt the email address yourself — that's the thing eating your 30 minutes.
3. **Nothing tech-specific.** Big slice of the roles, nothing aimed at that audience.
4. **No idea what's working.** No single number telling you where registrations come from.

## What to build

### 1. One Monday morning email to you (smallest, biggest time saver)
A single email every Monday: how many candidates and employers joined, from where, who's waiting for your approval, and a direct link to the approval screen. Your 30 minutes starts and ends there.

### 2. Make the prospect queue one-click
Right now you add the contact email by hand. The agent will try to find the public contact address on the company's own careers or contact page (published business contact details, nothing scraped from people), and pre-fill it. You still read the message and press send — or press skip.

Also add a "skip this company" button and a reason, so the queue stops showing you the same names.

### 3. A free tool for the tech crowd
A **"What's this job actually worth?"** salary check: paste a job advert or a job title, get a Bristol pay range, what the market's paying, and what an agency would charge the employer to fill it. No account needed. Ends with the same "want to be found?" invitation as the CV review.

This is shareable, it's the kind of thing that gets posted in Bristol tech groups and Slack channels, and it makes the LinkedIn markup argument concretely.

### 4. Bring people back
- **Candidate:** if someone did a CV review but never registered, one email a week later — "three Bristol employers searched for your kind of role this week". One email, one opt-out, never a chase.
- **Employer:** the prospect who opened the first email but didn't sign up appears in the queue again after two weeks, with a one-line different angle, for you to approve or bin. Still never automatic.

### 5. A growth number you can actually read
Extend the admin growth page with a simple table: where each registration came from (invite link, CV review, salary tool, employer email, direct), this week and last. So the Monday email has something real in it.

## Order

1. Monday summary email to you
2. Contact-detail finding and skip button in the prospect queue
3. Where-did-they-come-from tracking and the admin table
4. Salary check tool
5. The two bring-people-back emails

## Still ruled out

Scraping GitHub, LinkedIn or anywhere else for individuals; buying candidate lists; emailing people who never asked; automatic multi-step sequences to anyone.

## Technical notes

- **Monday summary:** new `growth-digest` edge function, `pg_cron` Monday 08:00, counts from `invite_signups`, `candidate_profiles`, `employer_profiles`, `employer_prospects` over the last 7 days, sent via `_shared/email.ts` (`EMAIL_FROM_ALERTS`) to the addresses in `admins`. Read-only, no batching concerns.
- **Contact enrichment:** extend `find-employer-prospects` with a bounded per-run fetch (same 25-item cap, same `job_locks` lease and circuit breaker) of the prospect's own `company_website` contact/careers page, extracting a published `mailto:` or contact address only; store in `employer_prospects.contact_email` with a `contact_source` column. Add `status = 'skipped'` plus `skip_reason`, and filter skipped companies out of future runs by normalised name.
- **Attribution:** `signup_source` and `signup_source_detail` columns on `candidate_profiles` and `employer_profiles`, written at profile creation in `src/utils/profile-creation/*` from a small `src/utils/growth/source.ts` that reads the stored invite code, a `?from=` param, and the referrer. Admin table reads grouped counts; no new table.
- **Salary tool:** public route `/what-is-this-job-worth`, edge function `job-worth` with `verify_jwt = false`, Lovable AI Gateway with the default chat model, input capped and validated with Zod, output framed as publicly reported ranges with no invented precision, rate-limited by a per-IP counter row. Reuses the `CvReview` page shell and the existing share-back card.
- **Return emails:** a `growth_followups` table (email, kind, due_at, sent_at, suppressed) with a unique key on email+kind for idempotency; the weekly job sends a bounded batch, checks `outreach_suppressions` first, and stops on provider errors. Employer re-approach rows appear in the existing approval queue rather than sending themselves.
- All new tables get explicit `GRANT`s plus admin-only RLS, matching `employer_prospects`.
