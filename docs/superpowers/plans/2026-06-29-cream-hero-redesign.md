# Cream Hero Redesign + Site-Wide Warm Background — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the homepage a cream hero matching the reference image (navy/orange value-prop copy + cropped anvil illustration) and thread the warm cream background through the whole site, keeping the existing dark sections as accents.

**Architecture:** Pure CSS + light markup edits in an Astro static site. New design tokens drive a site-wide cream base; homepage-only overrides (scoped via a `body.home` hook) repaint the hero and top bar for the light background and swap the framed forge photo for a cropped illustration asset. No JS changes — existing `#tilt`/`#magnet` motion is reused.

**Tech Stack:** Astro, plain CSS (`src/styles/global.css`), PowerShell + System.Drawing for the image crop.

## Global Constraints

- Work in the **outer repo** at the desktop root (`Faktenschmied Website/`), branch `cream-hero-redesign`. Do NOT edit the stale `faktenschmied/` sub-clone.
- Cream palette (verbatim): page base `--cream:#FAF4E4`, deeper tone `--cream-2:#F3ECD7`, warm divider `--cream-line:#E7DEC6`.
- `logo.png` is the orange mark and is legible on cream — the top-bar logo needs NO change on home.
- Do NOT touch `/varianten` pages or the `Fx*` / `Variant*` components.
- Do NOT convert interior heroes to cream (Approach A — they stay dark).
- Keep hero copy and structure; the only homepage markup changes are: the hero eyebrow class, the secondary button class, and the right-column visual swap.
- "Test" for this static/visual work = `npm run build` succeeds + visual check in the dev server. There is no unit-test suite.

---

### Task 1: Design tokens + site-wide cream background

**Files:**
- Modify: `src/styles/global.css` (`:root` ~line 6-17; `body` line 20; `.proof` line 136-143; `.feat` line 173; `.demo` line 248)

**Interfaces:**
- Produces: CSS custom properties `--cream`, `--cream-2`, `--cream-line` consumed by Task 4; cream page base used by all pages.

- [ ] **Step 1: Add cream tokens to `:root`**

In `src/styles/global.css`, add a line inside the `:root{...}` block (e.g. right after the `--success/--danger` line, line 10):

```css
  --cream:#FAF4E4;--cream-2:#F3ECD7;--cream-line:#E7DEC6;
```

- [ ] **Step 2: Set the page base to cream**

Change the `body` rule (line 20) background from `var(--paper)` to `var(--cream)`:

```css
body{font-family:var(--sans);color:var(--ink);background:var(--cream);line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
```

- [ ] **Step 3: Recolor the alternating sections to the deeper cream**

Change `.feat` (line 173):

```css
.feat{background:var(--cream-2)}
```

Change `.demo` (line 248) background from `var(--cloud)` to `var(--cream-2)`:

```css
.demo{background:var(--cream-2)}
```

- [ ] **Step 4: Make the proof band inherit cream with warm dividers**

Replace the `.proof` rule (line 136):

```css
.proof{border-top:1px solid var(--cream-line);border-bottom:1px solid var(--cream-line);background:transparent}
```

Replace `.proof .it` (line 138) divider color:

```css
.proof .it{padding:52px 30px;border-left:1px solid var(--cream-line)}
```

In the `@media(max-width:820px)` proof block (line 143), change the two `var(--line)` border references to `var(--cream-line)`:

```css
@media(max-width:820px){.proof .wrap{grid-template-columns:1fr 1fr}.proof .it{border-left:none;border-top:1px solid var(--cream-line);padding:34px 0}.proof .it:nth-child(-n+2){border-top:none}.proof .it:nth-child(odd){padding-right:24px}}
```

- [ ] **Step 5: Build to verify no breakage**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add cream tokens and thread warm background site-wide"
```

---

### Task 2: Homepage scoping hook in the layout

**Files:**
- Modify: `src/layouts/Base.astro:54`

**Interfaces:**
- Consumes: existing `path` prop (`Astro.props`, default `'/'`).
- Produces: `body.home` class present only on the index page — the scope hook all Task 4 overrides rely on.

- [ ] **Step 1: Add the body class derived from path**

Change line 54 from `<body>` to:

```astro
<body class={path === '/' ? 'home' : undefined}>
```

- [ ] **Step 2: Build to verify**

Run: `npm run build`
Expected: build completes; `dist/index.html` `<body>` has `class="home"`, other pages' `<body>` has no class.

- [ ] **Step 3: Verify the class only lands on the homepage**

Run: `grep -o '<body[^>]*>' dist/index.html dist/methodik/index.html`
Expected: `dist/index.html:<body class="home">` and `dist/methodik/index.html:<body>`

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: add body.home hook for homepage-scoped styling"
```

---

### Task 3: Crop the anvil illustration asset

**Files:**
- Create: `public/img/hero-anvil.png`
- Source: `Gemini_Generated_Image_vy084fvy084fvy08.png` (desktop root)

**Interfaces:**
- Produces: `public/img/hero-anvil.png` (~788×768) — the hero artwork referenced in Task 4.

- [ ] **Step 1: Crop the right-side illustration (exclude baked-in text)**

Run this in the repo root (Git Bash → call PowerShell, or run directly in PowerShell):

```powershell
Add-Type -AssemblyName System.Drawing
$src = [System.Drawing.Bitmap]::FromFile("C:\Users\eyubo\Desktop\Faktenschmied Website\Gemini_Generated_Image_vy084fvy084fvy08.png")
$rect = New-Object System.Drawing.Rectangle 620,0,788,768
$crop = $src.Clone($rect, $src.PixelFormat)
$crop.Save("C:\Users\eyubo\Desktop\Faktenschmied Website\public\img\hero-anvil.png", [System.Drawing.Imaging.ImageFormat]::Png)
$crop.Dispose(); $src.Dispose()
"saved $($rect.Width)x$($rect.Height)"
```

Expected: `saved 788x768`.

- [ ] **Step 2: View the crop and confirm framing**

Open/Read `public/img/hero-anvil.png`. Confirm it contains the hammerhead, the full anvil, the sparks, the data-viz icons, and the navy backdrop shape — and NO text. If the hammer top or anvil base is clipped, re-run Step 1 adjusting `620,0,788,768` (e.g. lower the `620` x-origin to include more, or keep height 768). The left edge cutting through the navy blob is fine — Task 4 masks it.

- [ ] **Step 3: Commit the asset**

```bash
git add public/img/hero-anvil.png
git commit -m "feat: add cropped anvil hero illustration"
```

---

### Task 4: Homepage cream hero + illustration swap + legible top bar

**Files:**
- Modify: `src/pages/index.astro:43` (eyebrow), `:48` (secondary button), `:52-57` (right-column visual)
- Modify: `src/styles/global.css` (append a new block at end of file)

**Interfaces:**
- Consumes: `--cream`/`--cream-2`/`--cream-line` (Task 1), `body.home` (Task 2), `public/img/hero-anvil.png` (Task 3).
- Produces: the finished cream homepage hero.

- [ ] **Step 1: Restyle the hero eyebrow for light background**

In `src/pages/index.astro` line 43, change `class="ey on-dark reveal"` to `class="ey reveal"`:

```astro
        <div class="ey reveal">Healthcare-Werbemonitoring</div>
```

- [ ] **Step 2: Swap the secondary CTA to the dark-outline variant**

In `src/pages/index.astro` line 48, change `btn-onnavy` to `btn-line`:

```astro
          <a class="btn btn-line btn-lg" href="/brandfacts"><span class="lbl">BrandFacts entdecken</span></a>
```

- [ ] **Step 3: Replace the framed forge photo with the anvil illustration**

In `src/pages/index.astro`, replace the right-column block (lines 52-57):

```astro
      <div class="hero-visual reveal" style="transition-delay:.2s">
        <div class="hv-frame" id="tilt">
          <img src="/img/forge-jennifer.webp" alt="FaktenSchmied — am Amboss wird aus glühendem Material Form geschmiedet: aus Rohdaten werden belastbare Fakten." width="880" height="1100" loading="eager" fetchpriority="high" />
          <span class="hv-badge">Aus Rohdaten Fakten schmieden</span>
        </div>
      </div>
```

with:

```astro
      <div class="hero-visual reveal" style="transition-delay:.2s">
        <div class="hero-art" id="tilt">
          <img src="/img/hero-anvil.png" alt="Aus glühenden Rohdaten werden am Amboss belastbare Fakten geschmiedet — Hammer und Datenvisualisierungen über einem Amboss." width="788" height="768" loading="eager" fetchpriority="high" />
        </div>
      </div>
```

- [ ] **Step 4: Append the homepage cream-hero CSS**

At the END of `src/styles/global.css`, append:

```css
/* ===== Homepage cream hero (matches reference image) ===== */
body.home .hero{background:var(--cream)}
body.home .hero h1{color:var(--ink)}
body.home .hero .sub{color:var(--graphite)}
body.home .hero .micro{color:var(--slate)}

/* anvil illustration sits directly on cream (replaces framed photo on home) */
.hero-art{position:relative;transition:transform .2s var(--ease)}
.hero-art img{width:100%;height:auto;display:block;
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 14%);
  mask-image:linear-gradient(90deg,transparent 0,#000 14%);
  filter:drop-shadow(0 30px 50px rgba(20,24,59,.18))}

/* top bar legible over the cream hero (closed menu, not scrolled) */
body.home .site-menu:not(.is-open) .menu-bar:not(.scrolled){color:var(--ink)}
body.home .site-menu:not(.is-open) .menu-bar:not(.scrolled) .menu-hamburger-icon{border-color:var(--line-2)}
```

- [ ] **Step 5: Build to verify**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/styles/global.css
git commit -m "feat: cream homepage hero with anvil illustration and light top bar"
```

---

### Task 5: Visual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background). Note the local URL (typically `http://localhost:4321`).

- [ ] **Step 2: Screenshot and inspect the homepage**

Navigate to `/` (use the Playwright MCP browser tools or open in a browser) and confirm:
- Cream hero background (`#FAF4E4`); headline navy with the orange `wie Ihr Markt wirbt` span; subtext and micro line legible.
- Both CTAs visible: orange primary + dark-outline secondary.
- Anvil illustration on the right blends into the cream with no hard navy edge on its left.
- Top bar: orange logo + "Menü" label + hamburger are dark/legible at the top; on scroll the bar goes to white bg + dark text as before.
- Hover the hero → illustration tilts (pointer:fine); hover the primary CTA → magnetic pull. Both still work.

- [ ] **Step 3: Confirm cream threads through and dark accents remain**

Scroll the homepage: Problem/Value, Features (`.feat` deeper cream), Use Cases, Demo (`.demo` deeper cream), proof band — all warm; Methodik, final CTA, footer, ticker, industry cards, bento CTA tile — still dark.

- [ ] **Step 4: Confirm interior pages are unchanged in their hero**

Navigate to `/methodik` and `/brandfacts`: heroes are still dark navy; content bodies below are cream; top bar is white text over the dark hero (unchanged).

- [ ] **Step 5: Check reduced-motion and mobile**

Resize to ≤920px: hero stacks to one column, illustration below text, everything legible. With `prefers-reduced-motion`, no tilt/animation regressions.

- [ ] **Step 6: Stop the dev server.**

---

## Self-Review

**Spec coverage:**
- Tokens + cream base site-wide → Task 1 ✓
- Dark accents kept (no edits to `.method`/footer/`.cta`/ticker/`.icard`/`.bento .cta-tile`) → enforced by omission + verified in Task 5 Step 3 ✓
- Homepage scoping hook → Task 2 ✓
- Hero cream restyle (h1/sub/micro/eyebrow/buttons) → Task 4 Steps 1,2,4 ✓
- Illustration crop + swap + left-edge mask → Task 3 + Task 4 Step 3,4 ✓
- Header legible over cream (with `:not(.is-open)` guard) → Task 4 Step 4 ✓
- Logo on cream → resolved (orange logo legible; no change) ✓
- Interior heroes stay dark → verified Task 5 Step 4 ✓
- HeroLoader handoff → verified in Task 5 Step 2 (load); only adjust if a flash appears (no code change planned, kept out of scope unless observed) ✓

**Placeholder scan:** No TBD/TODO; all steps carry exact code/commands. Crop coords are concrete with a tuning fallback. ✓

**Type/selector consistency:** `body.home`, `.hero-art`, `#tilt`, `--cream`/`--cream-2`/`--cream-line`, `hero-anvil.png` used identically across tasks. ✓
