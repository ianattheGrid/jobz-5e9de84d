# Keep the Bristol employer list topping itself up

## The problem

The overnight employer agent only reads the careers pages of companies already on its list. Nobody has been adding new Bristol companies, so the list is stale and the approval queue keeps coming back empty. The agent works fine — it just has nothing new to look at.

## What we'll build

### 1. A discovery agent that finds Bristol companies advertising jobs

A new nightly job runs before the existing prospect agent. It searches public job listings for roles advertised in Bristol and the surrounding area, then works backwards to the company itself:

- Pull the company name and website from each listing.
- Visit that company's own site and find their careers page.
- Add the company to the list the existing agent already reads from — name, website, careers page, location, and where we found them.

From then on the existing nightly agent handles it as normal: reads their careers page, notes the roles, works out what an agency would charge, finds their published contact address, and puts them in your approval queue with a "why now" line.

Nothing is emailed. Discovery only adds companies to a list.

### 2. A box for you to add one yourself

A single field at the top of /admin/growth: paste a company website, press add. It finds their careers page itself and drops them straight into the list. Useful when you spot a Bristol business you'd like on Jobz.

### 3. Sensible limits so it doesn't run away

- At most 20 new companies discovered per night.
- Skips anything already on the list, already a Jobz customer, or on your "never this company" list.
- Skips recruitment agencies and job boards — we don't want to invite the middlemen.
- Only companies within reach of Bristol.
- One lock so two runs can't overlap, and it stops itself if the search service errors or runs out of credit.

## What stays exactly as it is

- No personal data. Companies and their published business addresses only.
- Nothing sends without you pressing send. One email ever, clear opt-out, no chase.
- No scraping of individuals' profiles anywhere.

## Technical notes

- New `discover-employers` edge function; nightly pg_cron at 01:00, before `scrape-external-jobs` (02:00) and the prospect agent.
- Job-listing discovery via the Firecrawl connector's search endpoint (needs connecting — I'll open the connect card when we build). Query set: Bristol job listings by work area, time-filtered to the last week.
- Inserts into the existing `target_companies` table (`company_name`, `website`, `careers_page_url`, `location`, `is_active`, plus `notes` recording where we found them). New column `discovered_from` (text, nullable) and an exclusion column `excluded_reason` so skipped companies stay skipped.
- Careers-page resolution reuses the fetch-and-parse approach already in `find-employer-prospects` (`/careers`, `/jobs`, `/join-us`, `/work-with-us`, 6s timeout, same JobzBot user agent).
- Agency/job-board filter: name and domain keyword list (`recruit`, `talent`, `staffing`, `jobs`, `hays`, `reed`, etc.) plus a skip list you can extend from the admin page.
- Single-flight lease via the existing `job_locks` row; batch cap 20; per-run circuit breaker halting on 402/403/repeated 429 and writing `paused_reason` into `job_locks`.
- Dedupe on normalised company name and apex domain against `target_companies`, `employer_profiles`, and `employer_prospects`.
- Admin add-a-company box calls the same function with a single URL, bypassing search.

## Order

1. Discovery agent plus the nightly schedule.
2. The add-a-company box and skip controls on /admin/growth.
3. Run it once live and check what lands in the queue.
