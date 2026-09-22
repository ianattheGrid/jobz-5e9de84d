# Bristol companies with real staff numbers — and reading them every day

## On the 25-staff question

Partly. Nobody publishes a live headcount for every company, but Companies House tells us which size bracket each company files its accounts under, and that is a good proxy:

| What they file | Roughly means |
|---|---|
| Dormant | Not trading — drop |
| Micro-entity | Under 10 staff — drop |
| Small | Up to 50 staff — keep |
| Medium / Full / Group | 50+ staff — keep |

So "25 or more" becomes "not dormant, not a micro-entity". That removes the one-person firms and shell companies, which is the noise you're worried about. It will still let through some 12-person firms that file as small — those are decent Jobz customers anyway, and they drop out naturally if they never advertise a job.

Where a company's accounts do state an employee count, we use the real number and require 25 or more.

## What I found

- 265 companies on the list, but only **29** are ones the nightly reader actually looks at.
- The 102 employers kept from the job feed this morning were saved without their own website — only the advert address — so the reader skips them and their other vacancies never get seen.
- Only 30 companies were read in the last day.

We already hold more companies than we read. Worth fixing before adding thousands more.

## What we'll build

### 1. Give the 102 employers we already found a website

Find each one's own site and careers page, then switch them on. From then on the reader visits them daily and picks up every role they advertise, not just the one that showed up in the feed.

### 2. A Companies House list, postcode by postcode, filtered by size

A nightly job walks the Bristol postcodes in rotation and asks Companies House who is registered there, keeping only companies that are:

- Actively trading.
- Above the size line above — no dormant, no micro-entities, 25+ where a real figure is published.
- Not a recruitment or employment agency, by their registered trade code.
- Not already on the list, already skipped, or already a Jobz customer.
- Findable — they must have their own website with a careers page. No careers page, nothing for us to read.

### 3. Read the whole list every day, honestly

The reader can't visit thousands of sites at once, so:

- Companies that have produced a real vacancy before are read every day.
- Everything else rotates, coming round every few days.
- Ones that give nothing for a month drop to weekly, then stop.

### 4. See it on the admin page

/admin/growth gains a line: how many companies we hold, how many passed the size test, how many were read today, how many gave a vacancy this week.

## What does not change

- No personal data, no individuals' profiles, no scraping anyone.
- Nothing is emailed. This fills a list and a board, nothing more.
- Agencies never reach the board.
- Jobz's own vacancies stay first on /jobs.

## Technical notes

- Size filter: Companies House `/advanced-search/companies` with `location=<postcode>`, `company_status=active`, excluding SIC 78100/78200/78300. Then the company profile's `accounts.last_accounts.type` — reject `dormant` and `micro-entity`. Where the filing history exposes an employee figure, require >= 25. Keep the existing `validate_sme_size` ceiling in mind: companies over 499 staff are outside Jobz's SME pitch but still useful board content, so they stay on the board and are flagged, not approached.
- Needs a free Companies House API key — I'll open the secret form when we build.
- Backfill: one-off pass over `target_companies` where `discovered_from = 'adzuna'` and `excluded_reason IS NULL` — resolve the employer's own domain (`resolveWebsite` in `discover-employers`), run `findCareersPage`, set `website`, `careers_page_url`, `is_active = true`; unresolvable ones stay inactive with a note.
- New `fetch-companies-house` function; postcode rotation reuses `BRISTOL_POSTCODES`, a `job_locks` lease, batch cap, and the same 402/403/429 circuit breaker.
- `target_companies` gains `staff_band`, `read_frequency` (daily/rotating/weekly/dormant) and `last_vacancy_at`; `scrape-external-jobs` orders by frequency then `last_scraped_at`, keeping `COMPANY_LIMIT` and the `MAX_HOPS` chain so a run stays inside the 150s timeout.
- Nightly schedule: Companies House 00:00, Adzuna 00:30, discover-employers 01:00, reader 02:00.

## Order

1. Backfill the 102 employers and switch them on — biggest gain, no new service.
2. Reading priority and the chain, so the whole list gets covered.
3. Companies House postcode sweep with the size filter.
4. The counts on /admin/growth.
