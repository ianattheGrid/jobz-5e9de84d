# Why the board looks empty — and how to fill it

## What I found

You're right, and the cause isn't the number of companies. There are 25 Bristol companies on the list already. The problem is the reading of their jobs pages:

| Company | Adverts ever collected | Live now |
|---|---|---|
| EY Bristol | 25 | 0 |
| TLT Solicitors | 22 | 0 |
| Aardman | 19 | 2 |
| Rolls-Royce | 10 | 0 |
| Burges Salmon | 7 | 0 |
| Parmenion, Leonardo | 1 each | 0 |
| The other 18 companies | 0 | 0 |

Eighteen of twenty-five have never produced a single advert, and the ones that did were mostly menu links, which we correctly switched off last time.

The reason: most modern jobs pages don't contain the jobs in the page itself. The list is loaded afterwards by the page's own software (Workday, Greenhouse, Lever, and search widgets). Our reader fetches the raw page, sees an empty shell, and comes away with nothing. Aardman works because their page is plain HTML.

So: more companies won't help until the reader can actually see the jobs.

## What we'll do

### 1. Read jobs pages properly

Two changes to the nightly reader:

- Where a company uses a known hiring system (Workday, Greenhouse, Lever, Ashby, SmartRecruiters, Teamtailor), ask that system directly for its list of roles. These give clean, complete lists — title, location, link, date — no guessing.
- For everything else, render the page the way a browser does before reading it, using the same page-reading service the employer finder already uses. That turns the empty shells into real lists.

Keep every safeguard already in place: only things that read like a real role, only links that point at one advert, a cap per company per night.

### 2. Filter to Bristol

Many of those companies hire nationally. Only keep adverts whose location is Bristol, a Bristol postcode, or one of the surrounding towns already on the list. Everything else is ignored, so the board stays a Bristol board.

### 3. Find more companies, faster

The finder currently adds at most 20 companies a night and searches four postcodes. Raise it to four postcode searches plus the existing queries with a higher nightly cap, and add a catch-up run so the backlog clears in days rather than weeks. Same rules: no agencies, no job boards, no individuals, one lock, stops itself if the search service errors.

### 4. Show what we've got

Nothing changes on /jobs beyond it filling up: same "Also hiring in Bristol" section, same "Found on their careers page" label, same link out to the company's own advert, same "Are you this company?" claim line, same view counting feeding your approval queue.

## Technical notes

- `scrape-external-jobs`: add an ATS-detection step from the careers URL (`myworkdayjobs.com`, `boards.greenhouse.io`, `jobs.lever.co`, `jobs.ashbyhq.com`, `smartrecruiters.com`, `teamtailor.com`) and fetch each one's public JSON board endpoint; store `ats_type` back on `target_companies` when detected.
- Fallback path: Firecrawl `/scrape` with `formats: ["markdown","links"]` and `waitFor`, reusing `FIRECRAWL_API_KEY` (direct API, as in `discover-employers`), then run the existing `isRealVacancy` filter over the rendered links. Cap the number of Firecrawl scrapes per run (≈15) and pause between calls, with the same 402/403/429 circuit breaker writing `paused_reason` into `job_locks`.
- Bristol filter: reuse the postcode pattern and place-name list from `discover-employers`, applied to the advert's location text; adverts with no location fall back to the company's own location.
- `discover-employers`: `BATCH_LIMIT` 20 → 40, postcode queries per night 4 → 8, still one lease and the same rejection rules.
- No schema change needed; `external_jobs` and `get_found_adverts` already carry everything the board shows.

## Order

1. Hiring-system and rendered reading in the nightly scraper, plus the Bristol filter.
2. One live run; check how many real adverts land.
3. Widen the company finder once the reader is proven.
