# What to take from AI Apply (and what to refuse)

AI Apply's headline feature fires up to 70 applications a day per person. That is
the machine that's burying every employer in AI-written CVs, and it's the exact
opposite of what Jobz promises. We're not copying it. We already have their
genuinely useful parts: the free CV review, a CV tailored to one vacancy with a
cover note draft, match scores with reasons, and the salary check.

Three things to build.

## 1. A job-hunt board

Today a candidate can only see the jobs they applied for *on Jobz*. Most of their
hunt happens elsewhere, so they never come back. The board becomes the one page
they keep open.

- Every Jobz application appears automatically, with its status.
- They can add a job they applied for anywhere else: company, role, link, the
  date, and where they found it.
- Four simple columns: applied, waiting to hear, interview booked, no.
- A nudge when something's been sitting untouched for two weeks: "Chase
  [company]?" — shown on the page, not emailed.
- Nothing is shared with employers. This is the candidate's private notebook.

## 2. A CV they can download

Once a profile is filled in, one button produces a clean, plain CV — no columns,
no graphics, the kind that machines read properly — with a small "profile:
jobz.dgrid.co/p/their-link" line at the bottom.

- Useful even for jobs they find elsewhere, which is the point: it gives people
  a reason to complete the profile, and every CV carries a Jobz link.
- Built as a print-clean page the browser saves as PDF, so there's nothing new
  to install and it always matches the live profile.

## 3. "No spray-and-pray" — said out loud and actually true

Employers everywhere now assume every application is AI-generated. If Jobz can
honestly promise otherwise, that's a better sales line than any feature.

- A candidate can send at most 10 applications a day on Jobz. Nobody genuinely
  hunting in Bristol needs more; a bot does. Enforced in the database, not just
  the screen, with a plain message when they hit it.
- Each employer sees, on an application: "Applied to 4 roles on Jobz in the last
  month." Quiet, factual, and impossible on any other platform.
- The promise goes on the comparison section, the employer sign-up page and the
  FAQ: everyone here applied on purpose, to you.

## Not doing

Auto-apply, bulk sending, live interview help, or anything that writes to an
employer without the candidate pressing send.

## Technical notes

- New `candidate_job_hunt` table (candidate_id, company, role_title, job_url,
  source, applied_on, stage, notes, updated_at) with owner-only RLS and GRANTs
  for `authenticated` + `service_role`. `src/pages/candidate/Applications.tsx`
  becomes the board, merging Jobz `applications` rows (read-only, stage derived
  from `status`) with manual rows; stale nudges computed client-side from
  `applied_on`.
- CV download: new `/my-cv` route rendering profile data with a print stylesheet
  (`@media print`), scoped so the deep-space theme doesn't bleed into the page;
  a Download button calling `window.print()`. No PDF dependency.
- Apply cap: a `BEFORE INSERT` trigger on `applications` raising a clear
  exception past 10 rows for that `applicant_id` in the last 24 hours; the apply
  hook surfaces the message. Employer count via a `SECURITY DEFINER` function
  returning only the 30-day application count for a candidate, so no other
  application data leaks across employers.
- Copy changes in `MiddlemenComparisonSection.tsx`, `FAQ.tsx` and the employer
  sign-up page; `hiringModels.ts` gains the AI-platform spray figure already
  referenced there.
- Build order: 1, then 3 (small), then 2.
