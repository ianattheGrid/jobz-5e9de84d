# Where we are, and what's left

## Done so far

**Part 1 — whole app overview.** Delivered: five roles, every page and its status, what's stored, what's unfinished or duplicated.

**Part 2 — live testing, in progress.**
- Visitor journey: passes. Every public page loads, nothing overflows on a phone, the "page not found" page works, and sign-in-only pages correctly send you to sign in.
- Candidate journey: passes end to end, after three blockers found and fixed live:
  1. Candidates had no way to enter job title, salary or preferred location, so every job scored about 15% and applying was blocked. Added a Job Preferences step to the profile builder.
  2. "Submit Application" silently did nothing in one case.
  3. Applications couldn't reach "Pending" because two accept fields defaulted to false instead of empty.
  Also: saving "About Me" failed silently when the postcode was missing; it now explains itself.

## Still to do

1. **Employer journey** — sign up, company profile, post a vacancy, manage vacancies, review applicants, candidate search, offer interview times, messages.
2. **Virtual recruiter journey** — sign up, profile, refer a candidate, recommendations, dashboard. (The referral invite button is already known to be broken; fix and retest.)
3. **Admin journey** — sign in, dashboard, user management, candidates, virtual recruiters.
4. **Part 3 — two people at once**: employer and candidate live at the same time, checking both sides of every handover (vacancy seen, application received, messages both ways, interview offered and chosen, decision seen).
5. **Part 5 — launch readiness**: real emails from your own domain, phone alerts, removal of test data (listed before deleting), security warnings, payments, hidden pages, page titles and descriptions.
6. **Cleanup and final report**: three lists — passing, fixed just now, needs you by hand.

## Known cosmetic issues collected, not yet fixed

- 8px sideways overflow on the profile page at phone width.
- The match warning popup is white in an otherwise dark app.
- Location choices are Bristol-only.
- The app's stored name is still "localz".

## Known fixes queued for the roles not yet tested

- Virtual recruiter referral invite button errors instead of sending.
- Employer/candidate "delete account" uses a broken version in two places; a working one already exists.
- Two duplicate page addresses and one leftover unused page.
- 1,887 stale notifications piled up in the database.
