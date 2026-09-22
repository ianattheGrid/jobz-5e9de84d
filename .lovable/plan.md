# Build a Bristol company list from the postcodes, and read it every day

## The short answer

Yes. There is a free, official list: Companies House publishes every registered company, searchable by postcode. Every BS postcode gives us the companies registered there — name, address, status, what they do. It is company information, not personal data, and it is meant to be looked up.

Two things need fixing before that helps, though.

## What I found

- 265 companies on the list, but only **29** are ones the nightly reader actually looks at.
- The 102 employers we kept from the job feed this morning were saved without their own website — all we have is the advert address. The reader skips them, so their other vacancies never get seen.
- Only 30 companies were read in the last day.

So we already have more companies than we are reading. The list isn't the only bottleneck.

## What we'll build

### 1. Give the 102 employers we already found a website

For each one, find their own site and careers page (the same step the finder already does), then switch them on. From then on the reader visits them daily and picks up every role they advertise, not just the one that appeared in the feed.

### 2. A Companies House list, postcode by postcode

A new nightly job walks the Bristol postcodes in rotation and asks Companies House for the companies registered there:

- Active companies only — no dissolved or dormant ones.
- Skip recruitment and employment agencies by their registered trade code.
- Skip anything already on the list, already skipped, or already a Jobz customer.
- Find each one's own website, then their careers page. No careers page, no entry — a company with nowhere to advertise gives us nothing to read.

Expect this to be noisy: thousands of Bristol companies are one-person firms or registered at an accountant's address. The careers-page test is what keeps those out.

### 3. Read the whole list every day, honestly

The reader can't visit thousands of sites in one go, so:

- Companies that have produced a real vacancy before get read every day.
- Everything else rotates, so each company comes round every few days.
- Ones that produce nothing for a month get read weekly, then dropped.

That keeps the board fresh without pretending we can fetch everything at once.

### 4. See it on the admin page

/admin/growth gains a line: how many companies we hold, how many have a careers page, how many were read today, how many gave us a vacancy this week.

## What does not change

- No personal data, no individuals' profiles, no scraping anyone.
- Nothing is emailed. This only fills a list and a board.
- Agencies still never reach the board.
- Jobz's own vacancies stay first on /jobs.

## Technical notes

- Backfill: one-off pass over `target_companies` where `discovered_from = 'adzuna'` and `excluded_reason IS NULL` — resolve the employer's own domain (`resolveWebsite` in `discover-employers`), run `findCareersPage`, set `website`, `careers_page_url`, `is_active = true`. Leave unresolvable ones inactive with a note rather than guessing.
- New `fetch-companies-house` function using the free Companies House REST API (`/advanced-search/companies` with `location=<postcode>`, `company_status=active`, excluding SIC 78100/78200/78300). Needs a free Companies House API key — I'll open the secret form when we build.
- Postcode rotation reuses `BRISTOL_POSTCODES` from `discover-employers`; a handful of postcodes per night, `job_locks` lease, batch cap, same 402/403/429 circuit breaker.
- `target_companies` gains `read_frequency` (daily/rotating/weekly/dormant) and `last_vacancy_at`; `scrape-external-jobs` orders by frequency then `last_scraped_at`, keeping `COMPANY_LIMIT` and the `MAX_HOPS` chain so a night's run walks the queue without hitting the 150s timeout.
- Nightly schedule: Companies House at 00:00, Adzuna 00:30, discover-employers 01:00, reader 02:00.

## Order

1. Backfill the 102 employers and switch them on — biggest gain, no new service.
2. Reading priority and the chain, so the whole list gets covered.
3. Companies House postcode sweep.
4. The counts on /admin/growth.
