# Explain the LinkedIn Recruiter cost chain

You're right, and it's the strongest part of the story we're currently missing. At the moment LinkedIn is buried inside one generic card called "Job boards & recruiter licences". It deserves its own card and its own section, because it explains *why* the agency fee is so big.

## The argument, in plain English

A recruiter can't search LinkedIn properly without a paid Recruiter seat. Published figures put a solo "Lite" seat at roughly £1,440 a year, and the full Recruiter licence recruiters actually use at roughly £13,000 a year per person — about £1,000 a month, per recruiter, before they've placed anybody. Sources: [5](https://www.davidsongray.co.uk/a-guide-to-using-linkedin-recruiter/), [2](https://www.pin.com/blog/linkedin-recruiter-pricing-2026/).

That cost has to come back from somewhere, and it comes back as the placement fee on you:

```text
Recruiter pays LinkedIn ~£1,000/month for a seat
        ↓ must place hires to cover it
Charges the employer 15–25% of your first-year salary
        ↓ on a £45,000 job that's £6,750–£11,250
Employer either pays it (money that could have been your salary)
        ↓ or can't afford it
The job is never advertised — so you never see it
```

The candidate-facing point: you are not expensive. Being *found* is expensive, and you're the one being marked up to pay for it.

## What I'll build

1. **A dedicated "LinkedIn Recruiter" card** in the "Who takes a cut" comparison on the homepage — badge "~£13k/yr per seat", tagline "The search fee you never see". Its lightbox covers who pays, how much, what happens to your profile (you're sourced and pitched, often without being told which employer), and the catch (the licence cost is recovered from the fee on your salary).
2. **Reframe the existing job boards card** so it's about job boards only, no longer doubling as the licence card.
3. **A new "Why you get marked up" section** on `/how-hiring-really-works`, with the chain diagram above in simple cards, plus the worked £45,000 example and the honest caveat that LinkedIn doesn't publish a public rate card for the higher tiers.
4. **Two new FAQ entries** (and matching FAQ structured data, which helps this page get found in search): "What does LinkedIn Recruiter cost?" and "Why do recruiters charge 15–25%?".
5. **A short candidate-facing line on the homepage section intro** so the point lands even if nobody opens a card: recruiters pay roughly £1,000 a month just to search — and that bill arrives as a percentage of your salary.

Figures will be presented as publicly reported ranges, not as quotes, with the existing disclaimer extended to cover it.

## Technical notes

- Extend `src/data/hiringModels.ts`: add a `linkedin` model, add `"linkedin"` to the `icon` union (Linkedin from lucide), and narrow the `boards` entry. The comparison grid and the `/how-hiring-really-works` list both read from this array, so both update automatically.
- Add the `linkedin` icon to the `ICONS` map in `MiddlemenComparisonSection.tsx` and update the section intro copy.
- Add the new section and FAQ items to `src/pages/HowHiringReallyWorks.tsx` (FAQ JSON-LD is generated from `FAQ_ITEMS`, so no separate change).
- No database, auth or backend changes. Existing dark/cosmic tokens only.
