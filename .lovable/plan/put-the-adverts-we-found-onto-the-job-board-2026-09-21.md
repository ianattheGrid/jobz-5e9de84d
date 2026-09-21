# Put the adverts we found onto the job board

## What's actually there right now

30 live adverts sit in the database. Most of them aren't jobs.

Real vacancies found: Rolls-Royce "Software Developer", Aardman "Full Stack Developer (React/.NET)", Aardman "Social Commerce Manager", Burges Salmon "Construction and engineering".

Rubbish that got picked up as if it were a vacancy: "Our locations", "Rewards and benefits", "Belonging at EY", "What it's like to work here", "Adjustments", "Latest vacancies", "Extraordinary Leadership". These are menu links off a careers page, not roles.

The public board at /jobs is currently empty (no employer has posted yet) and still shows a "these are example jobs" notice.

So before anything goes on the board, the rubbish has to go and the finder has to stop creating it.

## What to build

### 1. Clear out the ones that aren't jobs

Delete the adverts whose titles are page headings rather than roles, and switch off the careers-page menu links. Keep the four genuine vacancies.

### 2. Stop it happening again

Tighten the test the finder uses before it saves an advert:

- the wording must read like a role, not a page name (reject "Our locations", "Rewards and benefits", "Careers in X", "What you can do here", "Latest vacancies", "Belonging at", "Adjustments" and the like)
- the link must point at a single advert, not a section of the site
- one company can only add a limited number of adverts per night, so a badly built careers page can't flood the board again

### 3. Show them on the job board

/jobs gets two parts:

- **Jobs on Jobz** — vacancies posted by employers who joined. Apply here, as now.
- **Also hiring in Bristol** — the adverts we found. Visually quieter: company, role, location, "Found on their careers page" label, and a button that opens the company's own advert. No Apply button, no match score, no employer profile.

Each found advert carries the claim line already built: "Are you [Company]? Claim this role on Jobz — £9 a month, no contract, no commission."

Opening one is counted the same way it already is on the candidate page, so the approval queue keeps showing "3 candidates viewed this week" and the approach email can say it.

The search box filters both lists. The "example jobs" notice comes off.

### 4. Be honest about what they are

A short line above the second list: "These roles are advertised on the companies' own sites. We link you straight to them — no middleman, nothing added on top."

## Technical notes

- Cleanup is a data change (`UPDATE external_jobs SET is_active = false`) on rows matching the non-role title patterns, plus keeping the four real ones.
- `parseGenericJobs` in `scrape-external-jobs`: add a `NON_ROLE_PATTERNS` reject list and require the URL to look like a specific advert (a path segment after `/job/`, `/vacancy/`, `/careers/` with a slug or id), not a bare section link; cap saved adverts per company per run.
- `Jobs.tsx`: a second query against `external_jobs` (active only) joined to `target_companies`, rendered by a new `ExternalJobList`/`ExternalJobCard` pair in the existing dark card style; reuse the `recordView` insert into `external_job_views` and the claim link from `ExternalJobsView.tsx` — extract both into `src/utils/externalJobs.ts` so the two pages don't drift.
- `external_jobs` is already readable by signed-out visitors via its select policy; confirm before shipping, and if it isn't, keep the found list to signed-in candidates rather than widening access.
- Nothing about the apply flow, matching, or employer accounts changes.
