# Cream Hero Redesign + Site-Wide Warm Background

**Date:** 2026-06-29
**Status:** Approved (pending spec review)
**Repo:** outer repo at desktop root (`Faktenschmied Website/`, branch `cream-hero-redesign`). NOT the stale `faktenschmied/` sub-clone.

## Goal

Rework the **homepage hero** to match the reference image
(`Gemini_Generated_Image_vy084fvy084fvy08.png`): a warm cream background with the
value-proposition headline in navy/orange on the left and an anvil-with-data
illustration on the right. Thread the same warm cream background through the whole
site as the base page color, while keeping the existing dark sections as deliberate
contrast accents.

## Decisions (locked with the user)

1. **Background scope:** Cream becomes the page base site-wide. The intentionally dark
   sections stay dark as accents: Methodik (`.method`), footer, final CTA (`.cta`),
   the ticker, the navy industry cards (`.icard`), and the bento CTA tile
   (`.bento .cta-tile`).
2. **Illustration:** Reuse a crop of the user's reference PNG (the anvil/hammer/sparks
   /data-icons + navy backdrop shape), excluding the baked-in text. No new image
   generation.
3. **Hero copy:** Keep the current value-prop headline, subtext, and both CTAs — only
   restyle them for the cream look. (Not the "Fakten schmied" brand-splash variant.)
4. **Interior heroes:** Stay dark navy (Approach A). Only the homepage hero becomes
   cream. The cream still threads through every page's content body below the hero.

## Sampled facts

- Reference cream sampled at **`#FAF4E4`** (corners) — this is the exact page base.
- Reference image is **1408×768**; anvil illustration occupies roughly the right ~53%.
- The illustration's own background is the same cream, so a crop blends edge-to-edge on
  the cream page.

## Current-state notes (important, from the live outer repo)

- Hero right column is currently a **forge photo** in a dark frame:
  `<div class="hero-visual reveal"><div class="hv-frame" id="tilt"><img .../><span class="hv-badge">…</span></div></div>` in `src/pages/index.astro`.
- `.home` is **shared** with product pages — `brandfacts.astro`, `rx-…`, `dental-…`
  use `class="hero interior home"` for the two-column hero layout. So the cream
  treatment must NOT key off `.hero.home`; it must be scoped to the index page only.
- Live hero background is the "warmer Glow" navy gradient (`global.css` ~line 434),
  which overrides earlier `.hero` background rules in the cascade.
- `Base.astro` `<body>` has no class; the top bar is `.menu-bar#hdr` (default white
  text; `.scrolled` → white bg + dark text). Logo is a single `/img/logo.png`.
- Existing hero motion: `#magnet` (primary CTA magnetic pull) and `#tilt`
  (mouse-driven 3D tilt on the right visual) — both reused, no JS change needed.

## Design

### 1. Color tokens (`global.css :root`)
Add:
- `--cream:#FAF4E4` — page base (matches reference).
- `--cream-2:#F3ECD7` — slightly deeper warm tone for alternating sections.
- `--cream-line:#E7DEC6` — warm divider/border on cream.

Keep `--paper:#FFFFFF` for elevated cards so they lift cleanly off the cream.
Leave `--cloud`/`--mist` as-is (still used for subtle fills *inside* white cards:
table headers, chips, flow steps — those should not change).

### 2. Site-wide cream threading (all pages)
- `body{background:var(--cream)}` (was `--paper`).
- `.feat{background:var(--cream-2)}` and `.demo{background:var(--cream-2)}`
  (were `--cloud`).
- `.proof{background:transparent}` (inherits cream) with its top/bottom borders moved
  to `--cream-line` so dividers read warm.
- Plain `<section>` blocks (Problem/Value, Use Cases, Team) inherit cream automatically.
- White cards unchanged (`.panel`, `.form`, `.cell`, `.tile`, `.step`, `.tcard`) — they
  now pop against cream. Spot-check their `var(--line)` borders against cream; nudge
  toward `--cream-line` only where a card sits directly on cream and the cool border
  looks off.

### 3. Dark accents — unchanged
`.method`, `footer.site`, `.cta`, `.ticker`, `.icard`, `.bento .cta-tile` keep their
current dark backgrounds. No edits.

### 4. Homepage scoping hook
In `Base.astro`, derive a body class from the existing `path` prop:
`<body class={path === '/' ? 'home' : undefined}>`. All cream-hero + light-header
overrides below are scoped under `body.home` so product pages with `.hero.home` are
unaffected. No change required in `index.astro` for the body class.

### 5. Homepage hero — cream restyle
Scoped under `body.home .hero`:
- Background: cream. Override the winning navy-gradient rule:
  `body.home .hero{background:var(--cream)}`. Keep `.hero .mesh{display:none}`.
- Keep the thin orange bottom divider (`.hero::before`) — it reads on cream and leads
  into the proof band. Verify contrast; keep if good.
- Text colors:
  - `body.home .hero h1{color:var(--ink)}` (the `.o` orange span and `.serif-it`
    italic stay).
  - `body.home .hero .sub{color:var(--graphite)}`.
  - `body.home .hero .micro{color:var(--slate)}` (orange pulse dot stays).
- Eyebrow: in `index.astro` change the hero eyebrow from `class="ey on-dark"` to
  `class="ey"` (the `on-dark` light-grey variant is invisible on cream).
- Buttons: in `index.astro` change the secondary CTA from `btn-onnavy` (white outline)
  to `btn-line` (dark outline). Primary `btn-primary` (orange) is unchanged.

### 6. Hero illustration (right column)
- Create asset `public/img/hero-anvil.png` by cropping the reference PNG to the anvil
  illustration: approximately `x:660–1408, y:0–768` (tune to include the hammerhead at
  top, the full anvil, the sparks, the data-viz icons, and the navy backdrop shape;
  exclude all baked-in text). Keep the cream background in the crop (it matches the
  page). Use PNG (lossless) to avoid a cream seam from compression.
- In `index.astro`, replace the `.hv-frame` photo block with:
  `<div class="hero-art" id="tilt"><img src="/img/hero-anvil.png" alt="Aus glühenden Rohdaten werden am Amboss belastbare Fakten geschmiedet — Hammer und Datenvisualisierungen über einem Amboss." width="…" height="…" loading="eager" fetchpriority="high" /></div>`
  (drop the dark frame and the `hv-badge`). Keep `id="tilt"` so the existing tilt motion
  applies.
- Add `.hero-art` CSS: image sits directly on cream (no border/shadow frame); apply a
  soft **left-edge fade mask** as insurance against a hard navy-blob edge:
  `-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 14%); mask-image:linear-gradient(90deg,transparent 0,#000 14%)`. Optional subtle
  `filter:drop-shadow(0 30px 50px rgba(20,24,59,.18))`. Set explicit `width/height` on
  the `<img>` from the final crop dimensions to avoid layout shift.
- The old `.hv-frame`/`.hv-badge`/`.hv-card` CSS stays in `global.css` (still used by
  product-page heroes that share `.home`); only the homepage markup stops using it.

### 7. Header over the cream hero
The top bar text/icon default is white (for dark heroes). Over the cream home hero it
must be dark. Add, scoped to home + closed menu + not scrolled:
- `body.home .site-menu:not(.is-open) .menu-bar:not(.scrolled){color:var(--ink)}`
- `body.home .site-menu:not(.is-open) .menu-bar:not(.scrolled) .menu-hamburger-icon{border-color:var(--line-2)}`

The `:not(.is-open)` guard is required: a `body.home .menu-bar` rule would otherwise
out-specify `.site-menu.is-open .menu-bar` and force dark text onto the dark open
overlay. Scrolled state (white bg + dark text) and all interior pages are unchanged.
**Verify** `/img/logo.png` is legible on cream; if it is a white/light logo, swap the
homepage top-bar logo to the dark/colored variant (`logo.png` vs `logo-white.png` exist
in `public/img`).

### 8. HeroLoader
Keep the existing `<HeroLoader />` intro (navy keyword-grid, once/session). Low-priority
polish: tint its final reveal frame toward cream for a smoother handoff into the new
hero. Verify there is no jarring navy→cream flash on load; only adjust if there is.

## Scope boundaries (YAGNI)
- Do **not** touch `/varianten` preview pages or the Fx*/Variant* components.
- Do **not** convert interior heroes to cream.
- Do **not** restructure hero copy or markup beyond the eyebrow class, the secondary
  button class, and the right-column visual swap.

## Affected files
- `src/styles/global.css` — tokens, body bg, section bg recolors, `body.home` hero +
  header overrides, `.hero-art`.
- `src/layouts/Base.astro` — `<body class>` from `path`; verify homepage logo.
- `src/pages/index.astro` — eyebrow class, secondary button class, right-column visual
  swap.
- `public/img/hero-anvil.png` — new cropped illustration asset.

## Verification
- `npm run build` (or `npm run dev`) succeeds.
- Home: cream hero, navy/orange headline, both CTAs visible and styled, anvil
  illustration blends into cream with no hard edge, top bar legible (dark) at top and
  when scrolled, tilt + magnet motion intact.
- Cream base visible across all pages' content; dark accent sections still dark.
- Interior pages (brandfacts/methodik/insights/etc.) unchanged in their hero.
- Reduced-motion and mobile (≤920px single-column hero) still correct.
