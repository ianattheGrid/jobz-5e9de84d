# Jobz: Deep Space redesign

Jobz currently looks like a light-mode 2024 website with a few dark space sections bolted on. The plan is to flip the whole app to one deep-space look — near-black, glass panels, one electric pink accent, Apple-style full-width scenes — while keeping every word, page and feature exactly as it is.

## The look (locked from your picks)

- Background: near-black `#07070F`, panels in `#12122A` glass with a hairline edge
- Text: soft white `#F5F5F7`, quieter greys for supporting copy
- One accent: the Jobz pink `#FF2E88` — used sparingly, for the thing you should click
- Type: Outfit for headings (tight, Apple-like), Figtree for body
- Layout: one idea per screen, generous space, cards in rounded glass tiles
- Motion: slow drifting starfield, sections fading up as you scroll, cards lifting slightly on hover, big numbers counting up once

## What changes, in order

**Stage 1 — the foundation**
Switch the app's default from light to deep space in one place, load the two new fonts, and remove the old site-wide rules that force white backgrounds and black text. This is what stops pages randomly appearing white.

**Stage 2 — shell**
Navigation bar becomes a translucent sticky bar that darkens as you scroll; footer restyled to match; mobile and tablet menu kept as it is behaviourally.

**Stage 3 — homepage**
Hero, "Looking for work?", the Employers/Candidates/Connectors switcher, the feature grid, the pathways planets, the "£8,000 vs £9" comparison, the "Who takes a cut" tiles and their pop-ups, the calculator, FAQ and sign-up section — all rebuilt to the new look. Wording, figures and links untouched.

**Stage 4 — the other public pages**
Pricing, How hiring really works, Job board and job detail, free CV review, Contact, sign-in and sign-up, the shareable public profile page, and the not-found page.

**Stage 5 — the signed-in areas**
Candidate dashboard, profile builder, applications and interviews; employer dashboard, post a vacancy, manage jobs, candidate search, shortlist; recruiter dashboard; admin. These get the same surfaces, forms and buttons, so they stop looking like a different product.

**Stage 6 — check it**
Walk every page at desktop width and at phone size (390x844), looking for unreadable text, white flashes, cut-off headings and sideways scrolling, and fix what I find.

## What will not change

- No copy rewrites, no new figures, no removed sections
- No changes to how anything works — matching, applying, posting, emails, payments all stay as they are
- The space concept stays; it just gets quieter and more expensive-looking

## Technical notes

- Replace the light token set in `src/index.css` with a single dark token set (`--background`, `--card`, `--muted`, `--border`, `--primary` = pink, plus new `--glass`, `--glow`, `--surface-2`). Add Outfit/Figtree to `index.html` and map them in `tailwind.config.ts` as `font-display` / `font-sans`.
- Delete the global `!important` overrides in `src/index.css` that force `label`, form fields and `#root` to light colours, plus the `.cosmic-form` / `.space-card` counter-overrides they made necessary. Restyle the shadcn primitives (`button`, `card`, `input`, `select`, `dialog`, `tabs`, `badge`) once so every page inherits the new look instead of each page patching itself.
- Introduce shared presentation pieces: `Starfield` (replacing the several bespoke background components), `GlassCard`, `SectionShell` (full-bleed scene with consistent vertical rhythm), and a `useCountUp` hook for the price figures.
- Add a `prefers-reduced-motion` guard so the starfield and reveals stop for users who ask for that.
- Presentation only: no route changes, no data access changes, no edge function changes.

Staged so you can see the homepage first and say stop or carry on before I go through the signed-in areas.
