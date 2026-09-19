# Clean up test data, and the Supabase settings only you can change

## Part 1 — Delete the test accounts and test data

Only accounts on the `@jobztest.dev` domain and the vacancies I created during testing are removed. No real account is touched.

Accounts to delete (7, all @jobztest.dev):
- qa.vr1789834231 (test recruiter, Vera Connector)
- qa.emp1789821215 (test employer, E2E Tech Ltd [TEMP])
- qa.cand1789818318 (test candidate, Amelia Test)
- browser.test+1781522900
- qa.candidate2
- qa.employer+test1
- qa.candidate+test1

Data created by those accounts, removed with them:
- The two test vacancies (QA Test 1st Line Support Engineer, and its duplicate)
- The applications made against them, plus the test interview and the interview invitation
- The one test referral invite (to qa.invitee...@jobztest.dev)
- Their profiles, notifications and any messages

Left alone: all 18 older vacancies with no owner, and every non-test account. If you also want those old ownerless vacancies cleared out, say so and I'll include them.

Before deleting I will re-list exactly what is about to go, delete, then confirm by re-counting.

## Part 2 — What you need to do in Supabase (I cannot do these)

These are account-level settings in the Supabase dashboard, not in the app's code.

1. **Turn on leaked-password protection** — Authentication > Policies (Password settings). Blocks sign-ups using passwords known from public data breaches.
2. **Shorten the email code expiry** — Authentication > Email settings. It is currently over an hour; set it to 600 seconds (10 minutes).
3. **Upgrade the database version** — Settings > Infrastructure. There are security patches waiting. Do it at a quiet time; it causes a short outage.
4. **Verify your own sending domain** — Resend dashboard. Right now invitation and welcome emails are sent from a test address, so they often will not arrive. Once your domain is verified I will switch the app over to it and send a live test to confirm it lands in your inbox.

Everything else the security scanner reports is already fixed or is required for the app to work (two internal permission-check functions must stay callable, and two Postgres extensions live in the default area — both are safe).

## Notes

Deleting accounts is permanent. The `@jobztest.dev` filter is what guarantees only test users are affected.
