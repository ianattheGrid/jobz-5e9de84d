# Jobz: full review, live testing and launch readiness

Five pieces of work, done in order. Parts 1-3 and 5 are review, testing and fixes. Part 4 is dropped at your request (Webby and the free CV review already cover AI drafting).

Where your brief used generic wording, I'll use the Jobz equivalents:

| Brief wording | Jobz equivalent |
| --- | --- |
| Customer | Candidate |
| Business owner | Employer |
| Listing | Job vacancy |
| Booking | Application, then interview |
| Deal / event | Not present in Jobz — skipped |

There is also a third role, Virtual Recruiter, and an Admin area; both get covered.

---

## Part 1 — Whole app overview (written summary, no changes)

I'll read the code and query the live database, then report:

- Every role and every journey they can take: sign up, sign in, build a profile, the main thing they came for, settings, delete account, sign out.
- Every page in the app, which role it's for, and whether it is finished, half-built or empty.
- What information the app stores and how the roles connect: who creates what, who can see what.
- Anything unfinished, duplicated, styled inconsistently, or likely to confuse a first-time visitor.

Nothing gets changed in this part. You get a written summary and I'll wait for your reaction before the testing begins.

## Part 2 — Human-style QA, one role at a time

For each role I'll open the app in a real browser and use it click by click.

1. Create a fresh test account with realistic details.
2. Complete the full happy path: profile, then the core journey.
3. Then the awkward paths: empty fields, bad email, wrong password, refreshing halfway through, the back button, and typing the address of a page that role shouldn't see.
4. After every step I check four things: the screen updated, the request succeeded, nothing errored behind the scenes, and the information genuinely saved — confirmed by reloading and by querying the database.

Roles and journeys:

- **Visitor** — homepage, how hiring really works, free CV review, jobs list, FAQ, contact, a page that doesn't exist.
- **Candidate** — sign up, build profile, upload CV, browse jobs, see match score, tailor CV to a vacancy, apply, dashboard, applications, interviews, messages, account settings.
- **Employer** — sign up, company profile, post a vacancy, manage vacancies, review applicants, candidate search, offer interview slots, messages.
- **Virtual Recruiter** — sign up, profile, invite a candidate by referral, recommendations list, dashboard.
- **Admin** — sign in, dashboard, user management, candidates, virtual recruiters.

Everything also gets run at phone size (390x844).

## Part 3 — Two people at once, end to end

Two live accounts running at the same time, checking both sides of every handover:

```text
Employer posts vacancy      -> candidate sees it in the jobs list
Candidate applies           -> employer sees the application
Candidate messages          -> employer receives -> replies -> candidate sees reply
Employer offers interview   -> candidate picks a time -> employer sees the choice
Employer decides            -> candidate sees accepted or declined
Virtual Recruiter refers    -> candidate signs up -> referral shows as completed
```

Each step is confirmed by reloading and by checking the stored data, not just by what flashed on screen.

## Part 4 — AI helper

Skipped. You said Webby and the free CV review already cover this.

## Part 5 — Launch readiness

I'll check each item, fix what is safely fixable, and be straight about what only you can do:

- **Emails** — whether sign-up confirmations, referral invites and welcome emails really send from your own domain, and send one to prove it.
- **Phone alerts** — whether push notifications are properly wired, and what still needs a real handset.
- **Test data** — find every test account and dummy row, including ones left from earlier sessions. I'll show you the list before deleting and never touch anything that looks like a real person.
- **Security warnings** — run the database advisor, fix what's safe, explain the rest.
- **Payments** — whether anything money-related is half-wired or just a placeholder.
- **Hidden or coming-soon pages** — which pages are empty or unreachable, and whether they explain themselves.
- **Basics** — page titles and descriptions, sign-in-only pages genuinely protected, phone screens, no errors on the main pages.

Three known items already sit outside the code and can only be changed by you in the Supabase dashboard: the database version upgrade, leaked-password protection, and the sign-in code expiry time. They'll appear in the final "needs you" list with instructions.

---

## Fixing as I go

For each blocker or major problem: one sentence on the cause, the change, then I redo that journey live to prove it works. Nothing is called fixed until it has been retested in the browser. Smaller cosmetic issues get collected into a list for you to prioritise rather than fixed silently.

## Cleanup

Every test account and every row of test data created during this work gets deleted at the end, listed first so you can see exactly what's going.

## Final report

1. Journeys tested and passing.
2. Problems found and fixed, with before and after.
3. Still broken, or only you can check it by hand — real emails, real phone alerts, payments, and the three Supabase dashboard settings.

---

## Technical notes

- Testing is driven through Playwright against the running app, with console, network and database checks after each action; screenshots at desktop and 390x844.
- Database checks go through direct queries against the connected Supabase project; any schema fix goes through a migration, never a hand-edited file.
- Auth sessions for the test accounts are created through the app's own public sign-up, since this project uses an external Supabase and managed sessions aren't available.
- Test accounts use a clearly marked naming pattern so cleanup can be verified exhaustively.
- Given the size, this runs across several messages; I'll report at the end of each part rather than going silent.
