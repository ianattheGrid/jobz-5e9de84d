# Final launch tidy-up and readiness report

Emails are now sorted: all app emails send from your verified address, and the sign-in code email says Jobz. What's left is a short list of small fixes, then the written readiness report you asked for.

## Fixes to make

1. **Delete account** — two versions of this exist and the broken one is wired into candidate settings and the employer profile. Point both at the working one, and add the missing account settings page for recruiters so they can close their account too.
2. **Duplicate pages** — two addresses lead to the same candidate account page, and two lead to the same employer candidate search. Keep one of each and redirect the other. Remove one leftover page file that nothing links to.
3. **Phone layout** — the profile page scrolls sideways by a few pixels on a 390px-wide phone. Fix the element that overflows.
4. **Developer page left open** — `/push-setup` is a testing tool anyone can reach. Restrict it to admins.
5. **Old notifications** — 1,887 stale alerts sit in the database from testing. Clear the ones tied to deleted or test activity, leaving anything belonging to a real account untouched. I'll list what's going before deleting.
6. **Recruiter dashboard** — the WhatsApp card says "Coming soon – pending WhatsApp Business approval". Make it clearly labelled as not yet available rather than looking broken.

## Then verify live

Re-check each fix in the running app (desktop and 390x844 phone width), confirm no errors behind the scenes, and confirm the site builds cleanly.

## Finally: the readiness report

Three lists, in plain language:

- **Ready to go** — what's working and tested.
- **Fixed just now** — everything repaired during this review, including the employer signup and vacancy posting blockers, the application submit bug, interview scheduling, the recruiter invite, matching, and emails.
- **Needs you by hand** — anything only you can do, e.g. confirming the two test emails arrived in your inbox, checking payments (currently placeholder — I'll confirm exactly how far it's wired), and any remaining Supabase security notes.

## Technical notes

- Delete-account consolidation: `src/components/shared/DeleteAccountDialog.tsx` is the working one; the employer/candidate copies to be replaced.
- Duplicate routes in `src/App.tsx`: `/candidate/account` + `/candidate/settings`; `/employer/candidates` + `/employer/candidate-search`. Orphan file `CandidateApplications.tsx`.
- Notification cleanup via a scoped delete on `push_notifications`, listed before execution.
- `/push-setup` to be wrapped in the existing admin route guard.
