# Read more job boards when finding Bristol employers

## What changes

The nightly finder currently reads five boards — Indeed (UK), Reed, Totaljobs, CV-Library and Adzuna — two of them each night on rotation. We add more places where Bristol roles get advertised:

- Jobsite
- Guardian Jobs
- Bristol Post / Bristol Live jobs
- Jobs.ac.uk (universities and research)
- CharityJob (Bristol charities)
- Otta / Workinstartups (Bristol tech)

That makes eleven. Still two a night on rotation, so each board gets read roughly every five or six nights and no single run gets long or trips the search service's rate limit.

## What does not change

- Nothing is emailed. Discovery only adds companies to the list your approval queue is built from.
- Agencies and boards advertising on someone else's behalf are still rejected and remembered, with an "Actually, allow this one" button on /admin/growth.
- Same nightly limits: at most 20 new companies, six adverts read per night, one lock, and it stops itself if the search service errors or runs out of credit.
- Only companies within reach of Bristol, and only ones that employ people directly.

## Technical notes

- `BOARD_SITES` in `supabase/functions/discover-employers/index.ts` gains `site:jobsite.co.uk`, `site:jobs.theguardian.com`, `site:jobs.bristolpost.co.uk`, `site:jobs.ac.uk`, `site:charityjob.co.uk`, `site:otta.com`, `site:workinstartups.com`.
- Those same domains are currently in `NOT_BOARDS` (the `-site:` exclusions used by the careers-page pass) and in `EXCLUDED_DOMAIN_PARTS`. They stay excluded there — the careers pass must never treat a board as an employer. The board pass targets them deliberately with `site:` and only ever keeps the advertiser's own resolved domain, which is still checked against `EXCLUDED_DOMAIN_PARTS`.
- Rotation stays `night % BOARD_SITES.length`, two queries per run, so the added boards cost no extra runtime.
- `jobs.ac.uk` advertisers resolve to `ac.uk` domains, which `EXCLUDED_DOMAIN_PARTS` blocks. Either allow `ac.uk` through for the board pass or drop that board. Recommendation: drop `jobs.ac.uk` unless you want universities in the queue.

## Order

1. Add the boards and confirm the exclusion lists still behave.
2. One live run, then check what lands in the queue and in the skipped list.
