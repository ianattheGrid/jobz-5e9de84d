# Getting the Companies House key working

## What to put in the form on your screen

- **Application name:** Jobz
- **Description:** Finds Bristol companies for the Jobz job board
- **Environment:** **Live** — this is the important one. A Test key only talks to a dummy register with made-up companies, which is almost certainly why the first key was refused.
- **Terms & Conditions URL / other URLs:** leave blank.

Create it, then open the application and choose **Create new key** → key type **REST**. Copy the whole key and paste it here, and I'll save it.

## What I'll do once the key is in

1. Save the new key and clear the "paused" flag the failed attempt left on the postcode sweep.
2. Run the sweep live against three Bristol postcodes and check what comes back.
3. Confirm the size filter is doing its job: dormant companies and one-person firms dropped, recruitment agencies dropped by their registered trade code, and only companies filing small accounts or bigger kept.
4. Check the new companies land on the list switched off until we've found their careers page, so nothing unread reaches the board.
5. Report the counts on /admin/growth: companies held, how many have a careers page, read today, advertising this week.

## If the Live key is refused too

I'll stop and show you the exact response from Companies House rather than guess — it would mean the key type is wrong rather than the environment, and it's a two-minute fix on the same page.

## What does not change

- Companies only — no personal data, nothing about individuals.
- Nothing is emailed by this job. It fills a list.
- Recruitment agencies never reach the board.
