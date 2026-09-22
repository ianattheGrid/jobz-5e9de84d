# Fill the board with real Bristol vacancies

## Why it's only two

Three separate bottlenecks, none of them "Bristol isn't hiring":

1. The list has 29 companies. Most of them simply aren't advertising today.
2. The nightly reader only gets through six companies per run before it runs out of time, so most of those 29 are barely read at all.
3. When the finder reads a job board, it keeps the employer and throws the advert away. The hundreds of Bristol adverts it walks past every night are discarded by design.

## What we'll do

### 1. Pull Bristol adverts from Adzuna's official feed

Adzuna publishes an approved feed of UK vacancies. We ask it for everything within a few miles of Bristol, every night, and keep the ones posted by companies hiring for themselves. This is the fastest route to a board with hundreds of roles on it, and it's properly licensed — no scraping.

Each advert keeps the employer's name, the role, the location, the salary when given, and a link straight to the advert. Same as now: no Apply button on Jobz, no match score, we point people at the company.

To switch this on I need an Adzuna application ID and key — free, from their developer page. I'll ask for them when we build.

### 2. Keep the adverts we already read on the boards

The nightly finder already opens board listings to work out who's behind them. When the advertiser passes the agency tests, we now also keep the advert itself, not just the company.

### 3. Agencies still don't get on the board

Every advert from both sources goes through the checks we already have: agency words in the advertiser's name, "our client" style phrasing, and the judgement on the advertiser's own website. Rejected advertisers stay remembered, with the "Actually, allow this one" button at /admin/growth.

### 4. Read every company on the list each night

The reader stops at six because a single run times out. We change it to work through the list in small batches back to back until everyone has been read, so all 29 — and the hundreds we add over time — get read every night rather than once a week.

### 5. Stop throwing away good adverts

The current rules demand a job title contain a word from a fixed list, which quietly drops things like "Groundworker", "Bid Writer" or "Head of Retail". We flip it: reject the things we know aren't jobs (menu links, newsletters, "skip to main content") and keep the rest, still requiring the link to point at a single advert and the location to be Bristol.

### 6. Add companies from the adverts themselves

Every employer we see advertising in Bristol and don't already have gets added to the company list automatically. So the more adverts we pull, the faster the list grows — hundreds of companies, not 29.

## What does not change

- Nothing is emailed. Approving an employer approach is still your button press.
- No personal data, no scraping of individuals, no agencies on the board.
- Jobz's own vacancies stay first on /jobs; found adverts stay in the quieter "Also hiring in Bristol" section with the "Are you this company?" claim line and the view counting behind it.

## Technical notes

- New `fetch-adzuna-jobs` function: Adzuna `/v1/api/jobs/gb/search` with `where=Bristol`, `distance=15`, `results_per_page=50`, paged to a nightly cap, `sort_by=date`. Needs `ADZUNA_APP_ID` and `ADZUNA_APP_KEY`. Store the employer under `target_companies` (`discovered_from: 'adzuna'`) and the advert in `external_jobs`, deduped on `job_url`; `redirect_url` is the link we show. Reuse `looksLikeAgencyName` / `AGENCY_NAME_WORDS` and the `excluded_reason` memory.
- Board pass in `discover-employers`: insert the scraped listing into `external_jobs` for advertisers that pass all three tests, using the resolved company row.
- `scrape-external-jobs`: replace the single-shot `COMPANY_LIMIT = 6` with a chained run — process a batch, then self-invoke while unread companies remain, carrying a hop budget (max 8 hops), a cooldown between hops, the existing `job_locks` lease, and the 402/403/429 circuit breaker. Progress is already idempotent via `last_scraped_at`.
- Filtering: drop `ROLE_WORDS` as a requirement (keep it only as a tiebreaker when a URL has no id or slug); keep `NON_ROLE_PATTERNS`, `NON_ADVERT_URL`, `FILE_ENDING`, the id/slug shape test, `jobIsLocal` and `confirmLocal`.
- Cost control: Adzuna is a JSON API, so no Firecrawl spend; `RENDER_LIMIT` stays at 6 per run.

## Order

1. Adzuna feed plus automatic company adding — the volume lever.
2. Every-company nightly reading and the loosened title rules.
3. Keeping the board-pass adverts.
4. One live run, then check the board and the skipped list.
