# Full workflow test with realistic people and roles

Agreed — the new match-led flow has only been checked page by page. The next step is a proper run-through with several made-up vacancies and candidates, some strong fits and some deliberately poor ones, following each one from match to offer.

## The cast

Three vacancies, posted by two test companies (one verified, one left unverified on purpose):

- Senior Network Engineer, Bristol, £45-55k
- IT Support Technician, Bristol, £26-32k
- Data Analyst, Bath, £38-45k

Six test candidates:

- Two strong fits for the network role (one available now, one on notice)
- One near fit (right skills, salary too high) — should rank lower with a clear reason
- One clear non-fit (wrong field entirely) — should not appear at all
- One match who has switched off "show me in matches" — must never appear
- One match who has blocked the test company — must never appear to that company

Everything is created through the real screens, signing up and filling in profiles like a person would, not inserted straight into the database. All test accounts use one obvious address pattern so they can be listed and removed cleanly at the end.

## The journey being tested

Run as two people at once — the employer in one window, the candidate in another — confirming each handover by reloading the other side.

1. Employer posts a vacancy; it appears on the job board and in Manage Vacancies.
2. Candidate is alerted about a matching role; employer is alerted about matching people.
3. Employer opens the vacancy, presses "Find people for this role", and checks the ranking, the reasons, and that the hidden and blocked candidates are absent.
4. Employer shortlists someone, adds a private note, and asks to see their full profile.
5. Candidate sees the request, shares details; employer can now see name and contact. A second request is declined and stays hidden.
6. Candidate applies to a role from the board; employer sees the application with its fit reasons.
7. Employer offers interview times; candidate picks one; the interview appears on both diaries.
8. After the interview both sides leave feedback; employer moves one candidate to offer, rejects another with a reason, and the candidate sees the right outcome each time.
9. The unverified company is checked separately: it can post a vacancy but gets a clear explanation instead of match results.

Alongside the happy path, the awkward ones: applying twice, reaching the ten-a-day application cap, declining an interview, cancelling, an employer viewing a profile that was never shared, and signing out mid-journey.

Every screen in the run is also checked at phone size (390x844) for cut-off text and sideways scrolling.

## Fixing and reporting

Each blocker gets fixed at the cause, not patched at the surface, then the step is repeated to prove it. At the end you get three lists: what worked first time, what was broken and is now fixed, and what still needs you.

## Clean-up

Every test account, vacancy, application, interview, shortlist entry and request created during the run is listed for you first, then deleted. Your four real accounts and the genuine external Bristol vacancies are not touched.

## Technical notes

- Test accounts use the `@jobztest.dev` pattern, same as the earlier clean-up, so they can be found and removed by address.
- Driven through the live app in a browser session rather than by SQL, so triggers, alerts and access rules are exercised as they are in production.
- Notification triggers, the `get_candidate_matches_for_job` and `get_candidate_full` access rules, the daily application limit trigger, and the interview slot-to-interview trigger are all exercised as part of the run.
- Email alerts go through the verified `mail.dgrid.co` sender; test inboxes are not real, so email sending is verified from the function logs rather than delivery.
- Payments remain unwired, so the offer step records the bonus figure without charging anything; that is noted rather than treated as a fault.
