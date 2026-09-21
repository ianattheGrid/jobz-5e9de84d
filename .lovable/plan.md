# Read the job boards too — but only keep the real employers

## Why

Right now the nightly finder deliberately avoids the big job boards. That was to stop it filling the list with adverts instead of companies. The side effect is we ignore the place where most Bristol vacancies actually appear.

We can read the boards and still keep agencies out — the advert itself usually gives the game away.

## What we'll build

### 1. A board-reading pass in the nightly finder

A second pass runs after the current one. It reads Bristol listings on the public boards, and for each advert works out who is really hiring:

- Pull the advertiser name from the listing.
- Decide whether that advertiser is the employer or a middleman.
- If it's a real employer, find their own website and careers page, and add them to the list the existing agent reads from.
- If it's an agency advertising on someone's behalf, drop it — and remember the agency so we never look at their adverts again.

### 2. Three tests an advert has to pass

1. **The advertiser's name.** Names containing recruitment, talent, resourcing, search, staffing, consultancy and the like are dropped, plus a growing list of known agencies we've already seen.
2. **The words in the advert.** Phrases like "our client", "on behalf of", "a leading Bristol business", "my client is looking for" mean an agency wrote it. Adverts hiding the employer's name go too.
3. **Their own website.** We find the advertiser's site and look at it: a company that sells recruitment services is an agency, whoever they say they are. Anything we still can't place goes to the same judgement step the finder already uses — "does this company employ people itself?" — and anything it can't vouch for is not added.

Only adverts that pass all three become companies on the list.

### 3. An agency memory

Every advertiser we reject is remembered with the reason, so the next run skips it instantly instead of re-checking. You can see and undo these on /admin/growth, in case something legitimate got caught.

## What does not change

- Companies only. No personal data, no individuals' profiles, no LinkedIn.
- Nothing is emailed. Discovery only adds companies to a list; you still approve every message.
- Same nightly limits: at most 20 new companies a night, one lock, and it stops itself if the search service errors or runs out of credit.

## Technical notes

- Extend `discover-employers` with a `boards` pass rather than a new function. Firecrawl search with `site:` targeting instead of the current `-site:` exclusions (Indeed, Reed, Totaljobs, CV-Library, Adzuna), time-filtered to the last week, Bristol-scoped queries by work area.
- Scrape each listing (Firecrawl `markdown`, `onlyMainContent`) to read advertiser name and body text — cheaper than crawling, and the advertiser line is in the main content on every board.
- Agency detection order: name keyword list → body phrase list (`our client`, `on behalf of`, `client is`, `we are recruiting for`, `confidential client`) → resolve advertiser website (Firecrawl search on the name + "Bristol") and reuse the existing `keepRealEmployers` AI judgement on the resolved domain. Unresolvable advertiser = skip, never add.
- Rejections written to `target_companies` with `excluded_reason` set (`agency`, `board`, `unverified`) so the existing partial index keeps them out of active use, and a normalised-name set loaded at the start of each run short-circuits repeat checks.
- Reuse existing `findCareersPage`, `apexDomain`, dedupe sets, `BATCH_LIMIT`, `job_locks` lease and 402/403/429 circuit breaker. Board pass only runs with budget left after the careers-page pass.
- `/admin/growth`: a "Skipped companies" list showing name, reason and date, with an "Actually, allow this one" button clearing `excluded_reason`.

## Order

1. Board pass with the three agency tests.
2. Agency memory and the skipped-companies list on /admin/growth.
3. Run it once live and check what lands — expect the first run to reject far more than it keeps.
