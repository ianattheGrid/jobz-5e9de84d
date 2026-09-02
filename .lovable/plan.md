# "Who takes a cut, and how" — explaining the middlemen (including AI platforms)

## Goal

Today Jobz explains why agencies and job boards make hiring expensive, but says nothing about the newer AI hiring platforms. Candidates and employers should be able to see, on one page, exactly what each model costs them and what it does with their data and their applications.

## What gets built

### 1. A comparison section (homepage) + a dedicated page

A new section on the homepage — placed right after the existing cost comparison — with a short intro and a compact comparison table, plus a "See the full breakdown" link to a new page at `/how-hiring-really-works` holding the long-form version.

### 2. The four models compared

Each row/card covers: who pays, how much, what happens to your CV, and the catch.

- **Recruitment agencies** — employer pays a placement fee, typically 15-25% of salary. Candidate is a product being sold; SMEs often can't justify the outlay at all.
- **Job boards / LinkedIn recruiter tools** — employer pays thousands a year just for the right to search. Candidates compete inside a paid-visibility system.
- **AI recruiting agents (the Jack & Jill model)** — employer pays a per-hire fee, positioned at roughly half an agency's, commonly quoted around 10% of first-year salary. Cheaper than an agency, but it is still a per-hire cut, and the agent decides who gets shown.
- **AI auto-apply tools (the AIApply model)** — candidate pays a subscription; the tool fires large volumes of generated applications at roles. Result: employer inboxes flooded with near-identical CVs, real applicants buried, and the candidate has little control over what was sent in their name.
- **Jobz** — £9 flat to the employer, no per-hire cut, no auto-blasting. Candidates apply themselves; AI tailors and advises but never submits on their behalf.

### 3. Two short audience explainers

- **For candidates:** why 200 auto-sent applications does not beat 5 good ones, and why a per-hire commission changes who an agent puts in front of an employer.
- **For employers:** why AI-blasted volume makes hiring harder, and what a per-hire percentage actually costs on a £45k role versus £9.

### 4. Tone and accuracy

Named-competitor claims are phrased as the pricing model rather than a hard current price ("typically around 10% of first-year salary, roughly half an agency fee") with a short "pricing as publicly described at time of writing" note, so the page cannot go stale into being wrong. No disparagement beyond what the models factually do.

## Technical notes

- New `src/components/home/MiddlemenComparisonSection.tsx`, rendered in `src/pages/Index.tsx` after `CostComparisonVisual`.
- New `src/pages/HowHiringReallyWorks.tsx`, routed in `src/App.tsx` (the active router) at `/how-hiring-really-works`, with a Footer link.
- Uses existing semantic tokens and the cosmic theme; no new colour values. Comparison renders as cards on mobile, table from `md` up.
- Page gets its own title/meta description and an FAQ-style JSON-LD block for the "what does a recruitment agency cost" style questions.
- Content only — no schema, edge function, or matching-logic changes.
