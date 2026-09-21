# Turn the adverts we find into employer sign-ups

Adverts we find elsewhere stay as they are for candidates — Apply opens the company's own advert, so no company gets Jobz candidates for free. What changes is that each advert now works as a way in for that company, and the approval email carries proof that people are looking.

## 1. "Are you this company?"

On each found advert, a quiet line under the Apply button:

> Are you [Company]? Claim this role on Jobz — £9 a month, no contract, no commission.

It opens employer sign-up with the company name and website already filled in, and remembers which advert they came from so it shows as the reason they joined.

## 2. Count who's looking

Every time a candidate opens one of these adverts, we record it — just the advert and the date, nothing about the person.

The company's entry in your approval list then shows "11 Bristol candidates viewed this role in the last 7 days", and the strongest interest sorts to the top, alongside the "Why now" line already there.

## 3. Say it in the one email

The single approval email gains a line when there's real interest:

> 11 people looking for work in Bristol opened your [role] advert this week. On Jobz you'd see them for £9 a month — no contract, no fee when you hire.

No change to how it's sent: still one message, only after you press send, still a clear opt-out and never a chase. If nobody viewed the advert, the line is left out rather than padded.

## What stays true

- Found adverts stay candidate-only and keep linking out to the company's own site.
- A company that hasn't joined never sees a Jobz profile, a match score or an application.
- Nothing about a candidate is shared in the view count — it's a number, not names.

## Technical notes

- New `external_job_views` table: `external_job_id`, `viewed_at`, optional `candidate_id`, insert allowed for authenticated, select admin-only; GRANTs for `authenticated` and `service_role`; index on `(external_job_id, viewed_at DESC)`. Written from `ExternalJobsView.tsx` on advert open, deduped per candidate per advert per day.
- `employer_prospects` gains `advert_views_7d` (int, default 0), filled by `find-employer-prospects` from that table and used for ordering in `AdminGrowth.tsx` alongside `signal_at`.
- Claim link: `/employer/signup?claim=<external_job_id>`, reading company name and website from `external_jobs` and storing `signup_source = 'claimed_advert'` with the advert id as detail, reusing the existing `readSource()` wiring.
- `send-prospect-email` adds the interest sentence only when `advert_views_7d > 0`.

## Order

1. View counting and the claim link on found adverts.
2. Counts and ordering in the approval list.
3. The interest line in the approval email.
