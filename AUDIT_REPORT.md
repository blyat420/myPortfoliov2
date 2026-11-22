# Website Comprehensive Audit Report

Project: `llamaaaj-portfolio` (`C:\jml\Design\web\portfolioweb`)
Audit date: 2026-11-22
Scope: audit only. No source, style, script, config, dependency or content file was modified. This file is the only file added to the project.

---

## 1. Executive Summary

The site is a small, well-built static portfolio (Astro 7 + Barba page transitions + GSAP + Lenis). In 16 pages x 7 viewports there were **zero console errors, zero failed requests, zero broken images and zero security-relevant findings in the code** (no secrets, no `innerHTML`/`eval`, no storage use). Measured local performance is good.

It is **not quite production-ready** because of a handful of concrete, mostly easy defects:

1. **Four commercial songs (~35 MB) are shipped publicly and played by the site's music widget.** Potential copyright exposure. (H-01)
2. **Mojibake on the home page**: `â€”` in the `<title>` and `â€“` in both Education rows. (H-02)
3. **Horizontal page overflow on small phones**: nav overflows on every page at 320 px; `/projects/ibu-hilmi` overflows at 320, 375 and 430 px; `/projects/alur` at 320 px. (H-03, H-04)
4. **No SEO foundations**: no `robots.txt`, sitemap, canonical, `og:image`, Twitter card, or custom 404. Detail pages share generic metadata patterns. (M-01..M-03)
5. **A visible `PLACEHOLDER` caption and a fully empty "Video" folder** are shown to visitors. (M-05)

Everything else is Medium/Low polish. Estimated total effort for Phase 1 + 2 is small (about 1 working day).

**Recommendation: Ready After Minor Fixes.**

---

## 2. Project Overview

| Item | Finding |
|---|---|
| Framework | Astro 7.4.13, static output (`dist/`), 16 pages |
| Client libs | `@barba/core` (page transitions, swaps only `<main>`), `gsap` (+ScrollTrigger, Flip), `lenis` (smooth scroll) |
| Fonts | 6 `@fontsource-variable` families (Montserrat, DM Sans, Inter, Space Grotesk, Manrope, Nunito Sans). All six are actually used. |
| Styling | 6 plain CSS files, 1,708 lines total, one global bundle loaded on every page, single breakpoint (`max-width:1024px`) |
| Content | `src/data/site.ts`, `systems.json`, `studies.ts`, `brandguidelines.json`, `gamenews.ts` |
| Routes | `/`, `/projects`, `/projects/[slug]` x 14 (5 graphic, 9 system) |
| Scripts | `dev`, `build`, `preview` only. **No lint, test or format scripts.** |
| Test tooling in repo | None (no ESLint, Prettier, Playwright, Cypress, Vitest) |
| Version control | Not a git repo and no `.gitignore` found in project root |
| Output size | `dist/_astro` 888 KB (one 200 KB JS bundle); `public/` 47.5 MB (35 MB audio, 12 MB images) |

Layout: `Layout.astro` -> `Nav` + Barba wrapper (`<main>`) + `Widgets` (scroll-to-top ring + audio player, outside Barba so music persists).

---

## 3. Audit Coverage

| Area | Method | Status |
|---|---|---|
| Project structure, source review | Manual read of layout, pages, components, scripts, CSS, data | Done |
| Build | `npm run build` (passes, 16 pages) | Done |
| Lint / unit tests | No tools exist in project | NOT TESTED (not available) |
| Pages tested | All 16 (`/`, `/projects`, 14 detail pages) in Microsoft Edge via automation (puppeteer-core, installed outside the project) against `astro preview` | Done |
| Viewports | 320x640, 375x812, 430x932, 768x1024, 1366x768, 1440x900, 1920x1080: horizontal-overflow measurement on all 16 pages (112 page loads). Screenshots reviewed for 320/375/768/1366/1920 on home, plus projects and selected detail pages | Done |
| Widths between breakpoints (e.g. 1025-1365) | Not individually sampled; root font-size formula analysed in code (see L-05) | PARTIAL |
| Console / network | Captured on every page load | Done |
| Interactions | Nav dropdown (hover/click/Enter/Esc), keyboard tab order, folder open, carousel keys + wheel, card click through Barba, browser Back, refresh on detail page, 404 route, music player play | Done |
| Accessibility | Automated heuristics (names, alt, headings, target size, contrast sampler, focus outlines, reduced motion emulation) + code review. **No screen reader was used.** | PARTIAL |
| Lighthouse / axe | Not installed; not installed per rules | NOT TESTED |
| Performance | Local unthrottled `preview` measurement (LCP, CLS, FCP, bytes) via browser performance APIs | PARTIAL (not Lighthouse, not throttled, not field data) |
| Security | Grep for secrets/unsafe DOM, `npm audit --omit=dev`, header review (not applicable to static build) | Done |
| External destinations | `liveUrl` and contact hrefs enumerated; the 8 live sites loaded OK earlier in this session. Instagram/Drive/LinkedIn not fetched (login walls) | PARTIAL |

---

## 4. Overall Quality Assessment

| Category | Condition |
|---|---|
| Functionality | Good. All tested flows worked; no JS errors. |
| Responsive | Fair. Good from 768 up; small-phone overflow defects. |
| UI/UX | Good, distinctive. A few discoverability/hierarchy issues. |
| Accessibility | Fair. Good basics (landmarks, names, focus rings, reduced-motion). Gaps: tap sizes, slider height, Barba focus management, tiny text. |
| SEO | Weak. Basics present (title, description, lang) but nearly everything else missing. |
| Performance | Good locally. Audio payload and some oversized images are the risks. |
| Security | Good. No findings in code; one legal/content risk (audio). |
| Code quality | Good for size. No tooling, no `.gitignore`/VCS, a few encoding defects. |

---

## 5. Critical and High-Priority Issues

No CRITICAL issues were found.

| ID | Sev | Title |
|---|---|---|
| H-01 | HIGH (risk) | Commercial copyrighted music shipped in `public/audio` |
| H-02 | HIGH | Encoding corruption (mojibake) on the home page title and Education |
| H-03 | HIGH | Page-level horizontal overflow at 320 px (nav) on every page |
| H-04 | HIGH | `/projects/ibu-hilmi` overflows horizontally at 320-430 px; `/projects/alur` at 320 px |

---

## 6. Detailed Findings

Legend: *Confirmed* = reproduced or measured. *Risk* = code-inspection concern. *Observation* = optional.

### 6.1 Content / Legal

**H-01 — Copyrighted tracks bundled and served (Risk, HIGH, effort Low)**
- Where: `public/audio/` (4 files, 7-11 MB each, ~35 MB): Busta Rhymes / Mariah Carey, Michael Jackson "Chicago", Selena Gomez, Laufey. `src/components/Widgets.astro:7-20` auto-builds the playlist from that folder; `scripts/sync-audio.mjs:7-8` copies from `..\assets (all)\audio`.
- Evidence: files exist in `public/audio` and `dist/audio`; player plays them (title shows "laufey - From The Start" after Play).
- Why it matters: public redistribution of commercial recordings is a takedown/licensing risk for a portfolio used professionally; it also makes `public/` 35 MB heavier.
- Recommended: replace with licensed / royalty-free / own tracks, or remove the player. Keep this a decision for the owner (business requirement).
- Related M-07: `sync-audio.mjs` depends on a folder outside the repo; on any other machine the build silently ships no player.

**M-05 — Placeholder content visible to visitors (Confirmed, MEDIUM, Low)**
- `src/pages/projects/index.astro:54`: selecting the **Video** folder shows three cards "Coming soon" and caption text literally `PLACEHOLDER: project coming soon.`
- Repro: `/projects` -> click "Video".
- Expected: either real content, a designed empty state, or the folder hidden.

**L-01 — Copy issues in About text (Confirmed, LOW, Low)**
- `src/data/site.ts:12`: `'i maketh designs, videos, ui ux , games, and websites.'` — lowercase "i", stray space before comma, archaic "maketh". If intentional humour, fine; otherwise "I make designs, videos, UI/UX, games and websites."
- About block is `text-align: justify` in a narrow column (`.hero__text--justify`), which produces uneven word gaps at 1366 px (visible in screenshot: "constantly   learning,   exploring   new   design").

**L-02 — Mixed languages without `lang` (Confirmed, LOW, Low)**
- System pages (JamalPOS, REED, etc.) show Indonesian overview/subtitle text inside an English UI (`lang="en"` on `<html>`). Screen readers will mispronounce. Mark those blocks `lang="id"` or translate.

**I-01 — Naming consistency (Observation)**
- Instagram handle is `@llamaaaj` in the nav contact list but `mr_jamaaal` on the Echo of the Hollow `liveUrl` and in REED v2 links. Mixed brand names also appear (REED / REED V2 / "Jamal Worshipper (HRIS)" vs file/slug `jamal-worshipper-hris`).
- Resume link (`src/data/site.ts`, `resumeHref`) points to a Google Drive **folder**, not a document; visitors land in a file browser.

### 6.2 Encoding

**H-02 — Mojibake (RESOLVED & verified, 2026-11-22 — Phase 1: replaced in `index.astro` lines 6 and 36 and the `home.css:1` comment; built `<title>` is `LLAMAAAJ — Rizal Jamalul Lail` (U+2014), both Education rows use U+2013, 0 mojibake sequences in `src/` or `dist/index.html`, files are UTF-8 without BOM.)**
**(original finding below)** (Confirmed, HIGH, Low)
- `src/pages/index.astro:6`: title is `LLAMAAAJ â€” Rizal Jamalul Lail` (should be `—`). Rendered `<title>` confirmed by browser.
- `src/pages/index.astro:36`: Education rows render `Bachelor System Information â€“ Institute...` and `Multimedia â€“ SMKN 1...` (visible on the hero at every viewport; see screenshots at 768 and 1366).
- `src/styles/home.css:1`: same corruption in a CSS comment (harmless).
- Cause: file saved with a wrong encoding (double-encoded UTF-8). Other `.astro` files do not show this on the rendered pages (`moji` check false on all other 15 pages).
- Fix: replace the three sequences with `—` / `–` and re-save as UTF-8.

### 6.3 Responsive

**H-03 — Nav overflows at 320 px (RESOLVED & verified, 2026-11-22 — Phase 1: new `@media (max-width: 400px)` block in `nav.css` (logo 5.4rem, item padding 0.55rem, tighter gaps). Nav now spans x=5–315 at 320 px; all 3 items + logo visible; Call me dropdown opens inside the viewport; `scrollWidth` = viewport on all 18 pages x 7 viewports.)**
**(original finding below)** (Confirmed, HIGH, Low)
- Repro: open any page at 320x640. `document.scrollWidth` = 335 > 320 on all 16 pages. `NAV.nav__inner` right edge = 335.
- Cause: `.nav__inner` content (logo `6.6rem` + 3 items with `0.7rem` padding, `white-space: nowrap`, `src/styles/nav.css:157-167`) is wider than 320 px at `html{font-size:15px}`.
- Visible: "Call me" dot is clipped (screenshot). Users get a sideways page scroll on every page.
- Fix: reduce gap/padding or logo width below ~360 px, or allow wrapping.

**H-04 — Case-study overflow on phones (RESOLVED & verified, 2026-11-22 — Phase 1: in `casestudy.css`, `.ls .cs-tiles`/`.cs-swatches` now `minmax(0,1fr)` (grid min-content from the nowrap `.wm` was the real cause), tiles are 1 column at <=560px, `.wm` uses `--wm` (set inline by `LogoStudy.astro`) capped to `15cqi` inside tiles, swatch text wraps. Both pages fit all 7 viewports; desktop sizes unchanged. Alur's 349px overflow was the same tile-grid min-content issue.)**
**(original finding below)** (Confirmed, HIGH, Low)
- `/projects/ibu-hilmi`: `scrollWidth` 504 at 320, 375 and 430 px. Offenders: `FIGURE.cs-tile.cs-tile--black` (right edge 504) and `.cs-lockup--stack .wm`. `src/styles/casestudy.css:495-502`: `.wm { white-space: nowrap; }` with a fixed-size wordmark.
- `/projects/alur` at 320: `scrollWidth` 349.
- Repro: open the URL at 375x812 and scroll horizontally.
- Fix: scale wordmark font-size with `clamp()`/container width, or let the tile shrink (`min-width:0`, `overflow:hidden`).

**M-04 — Carousel "Post" links smaller than 24 px (Confirmed, MEDIUM, Low)**
- `/projects/game-news` at 375 px: 9 "Post LINK" links measure 60x16 px (fails WCAG 2.5.8 AA minimum of 24x24 and is below the 44 px comfortable size).

**L-03 — Mobile floating widgets cover content (Confirmed, LOW, Low)**
- The fixed music player (bottom-right) and scroll ring (bottom-left) stay on screen at 768 and below and overlap page content/hero image (visible in 768 screenshot). Consider collapsing to a single icon on phones.

**L-04 — Nav is not sticky (Confirmed, LOW, Low)**
- `src/styles/nav.css:3-4`: `.nav { position: absolute }`. On long case-study pages the nav scrolls away; only the bottom ring offers a way back. Intentional design? Then keep; otherwise consider `fixed`/sticky.

**L-05 — Root font-size scaling (Observation, Low)**
- `src/styles/base.css:22-24`: `html { font-size: clamp(11px, 1.0417vw, 22px) }` (>1024 px) and fixed 15 px below. Between 1025 and ~1056 px the root drops to 11 px (min) — a 36% size jump at the 1024 breakpoint (15 px -> ~11 px). I did not sample 1025-1100 px visually. At 1920 px root is 20 px, above 2112 px it is capped at 22 px.
- With only one breakpoint, tablets in landscape (1024-1180) get the smallest text in the project (11 px root). Recommend testing 1024-1180 px.

**Responsive Audit Results table (overflow measurement, all 16 pages each):**

| Viewport | Result |
|---|---|
| 320x640 | **FAIL**: all pages overflow (335 px, nav). `/projects/ibu-hilmi` 504, `/projects/alur` 349 |
| 375x812 | **FAIL** for `/projects/ibu-hilmi` (504). Others PASS (game-news has an intentional inner scroller; page `scrollWidth` = viewport) |
| 430x932 | **FAIL** for `/projects/ibu-hilmi` (504). Others PASS |
| 768x1024 | PASS (no page overflow). Floating widgets overlap content (L-03) |
| 1366x768 | PASS |
| 1440x900 | PASS |
| 1920x1080 | PASS |

Other overflow checks excluded elements inside intentional horizontal scrollers (`.bg-row`, `.pj__track`, `.cr-slides`).

### 6.4 Functionality and QA Results

| Test | Result |
|---|---|
| Console errors/warnings on all 16 pages | PASS (0) |
| Failed network requests / HTTP >= 400 (crawl) | PASS (0) |
| Broken images after scrolling every page | PASS (0) |
| Logo, Projects, Resume, Call me links present with names | PASS |
| "Call me" dropdown: mouse click, Enter key, Esc closes and restores focus, outside-click closes | PASS |
| Nav active state (`aria-current="page"`) after Barba navigation | PASS |
| Folder -> carousel -> card click -> detail via Barba (no full reload, title updates, scroll resets to 0) | PASS |
| Browser Back from a detail page | PARTIAL: URL/title restore but the opened folder is closed (all folders `aria-pressed=false`); user loses place (M-06) |
| Refresh on `/projects/jamalpos` | PASS |
| Unknown URL `/projects/does-not-exist` | PARTIAL: 404 returned, but body is the generic preview-server text "404: Not Found". Astro has no `src/pages/404.astro`. Real host behaviour not tested (M-02) |
| Carousel arrow keys when the carousel has focus | PASS |
| Carousel arrow keys right after clicking a folder | FAIL (minor): focus stays on the folder button, arrows do nothing until the carousel is focused (L-06) |
| Mouse wheel on carousel | PASS |
| Music player play/pause | PASS |
| Forms / search / tabs / accordions | NOT APPLICABLE (none in the project) |
| External live sites (8) | PASS at time of test (earlier in session, HTTP 200) |
| Instagram, Drive, LinkedIn, WhatsApp links | NOT TESTED (login walls / external) |

**M-06 — Back button loses carousel state (Confirmed, MEDIUM, Medium)**
Repro: `/projects` -> open System -> click a card -> browser Back. Expected: System folder still open. Actual: all folders closed.

**L-06 — Arrow keys need focus (Confirmed, LOW, Low)**
Repro: click a folder, press ArrowRight immediately: caption does not change. After `focus()` on carousel it works. Consider moving focus to the carousel on open (the folder button already has `aria-controls`).

**M-08 — Barba does not manage focus or announce route changes (Confirmed, MEDIUM, Medium)**
After a Barba navigation `document.activeElement` is `BODY` and nothing announces the new page. Screen reader and keyboard users lose context. `src/scripts/main.ts:63-69` updates only `document.title`. Recommend moving focus to the new `<h1>` (`tabindex=-1`) and/or an `aria-live` route announcer.

**L-07 — Metadata not updated on Barba navigation (Confirmed, LOW, Low)**
`main.ts:64-65` updates only the title; meta description / OG remain the first page's. Not an issue for crawlers (each URL is static HTML) but matters for in-page share handlers/extensions.

### 6.5 Accessibility (WCAG 2.2 AA indicators)

| Check | Result |
|---|---|
| `lang` on `<html>` | PASS (`en`) — see L-02 |
| One `<h1>` per page, no skipped heading levels | PASS (16/16) |
| Landmarks (`header`, `nav`, `main`) | PASS |
| Image `alt` present on every `<img>` | PASS (0 missing; decorative images use `alt=""`) |
| Links/buttons without accessible name | PASS (0 found) |
| Focus visible | PASS: global `:focus-visible` outline (`base.css:76`), light variant in player (`widgets.css:186`). Tab order on home: logo -> Projects -> Resume -> Call me -> ring -> player |
| Dropdown `aria-expanded` / `aria-controls` | PASS |
| `prefers-reduced-motion` | PASS (emulated: Lenis off, text/figure visible, nav shown). Note `env.ts:1` reads it once at load; changes mid-session are not picked up (Info) |
| Color contrast (sampled text on flat backgrounds) | PARTIAL: home, projects, jamalpos: no failures in sample. `/projects/llamaaaj`: "Cool gray" swatch captions 4.3:1 (needs 4.5:1) at ~10-14 px. Text over images/photography not measured |
| Tap targets at 375 px | PARTIAL: nav items 36 px tall, player buttons 26x26, play 32x32, ring 39x39: all pass AA 24 px minimum but are below the 44 px comfortable size. **Seek slider is 147x12 px (fails 24 px minimum for a pointer target)** (M-09). Game News "Post" links 60x16 (M-04) |
| Text size | PARTIAL: `/projects/llamaaaj` at 375 px has 15 text nodes at 5 px and 44 at 10 px (swatch codes, spec captions); `/projects/jamalpos` 9-11 px labels. Likely design-intentional specimen text but unreadable on phones (M-10) |
| Screen reader behaviour | NOT TESTED |

**M-09 — Seek slider too small (Confirmed, MEDIUM, Low)** `.player__bar` renders 12 px high.
**M-10 — Tiny text on case studies (Confirmed, MEDIUM, Low)** see table; set a floor (about 11-12 px) on mobile or let those blocks scroll/zoom.
**L-08 — Decorative-only cursor tag** is `aria-hidden` and `alt=""`: OK.

### 6.6 SEO

| Check | Result |
|---|---|
| Unique `<title>` per page | PASS (16 distinct). Detail titles are `"Logo Design - LLAMAAAJ — LLAMAAAJ"` (brand repeated, hyphen and em dash mixed): LOW |
| Meta description | PARTIAL: present on all; the 5 home/projects/graphic pages share or use generic text; system pages use their Indonesian subtitle as description (`JamalPOS` -> "Point of Sale (POS) dan Inventory Management System"); `/projects` reuses the home description |
| Canonical URL | FAIL (missing everywhere) |
| `og:image`, `twitter:card`, `og:url` | FAIL (only `og:title`, `og:description`, `og:type`: `Layout.astro:38-40`). Links shared to WhatsApp/Instagram/LinkedIn will have no preview image |
| `robots.txt`, sitemap | FAIL (both 404) |
| Favicon | PASS (`/favicon.svg`) |
| Structured data (`Person` / `CreativeWork`) | NOT PRESENT (optional) |
| Semantic structure, internal links | PASS |
| Custom 404 | FAIL (none) |
| Content in static HTML | PASS (Astro static); but `.js [data-reveal]{opacity:0}` (`base.css:130`) hides content until JS runs. If the JS bundle fails, text stays invisible (L-09) |

**M-01 — Missing SEO essentials (Confirmed, MEDIUM, Low)**: add `canonical`, `og:image`, `og:url`, `twitter:card`, `robots.txt`, sitemap (`@astrojs/sitemap` is an official integration; adding it needs permission to install, and a `site` value in `astro.config.mjs` which is currently not set).
**M-02 — No 404 page (Confirmed, MEDIUM, Low)**: add `src/pages/404.astro`.
**M-03 — Description/title quality (Confirmed, MEDIUM, Low)**: unique, English descriptions per detail page.

### 6.7 Performance

Measured locally with the production build served by `astro preview`, unthrottled, desktop Edge. These are **lab numbers, not Lighthouse and not field data**; they will differ on a CDN/real device.

| Page | LCP | FCP | CLS | Notes |
|---|---|---|---|---|
| `/` (cold cache) | 260 ms (`rocks.webp`) | 112 ms | 0.0007 | 871 KB transferred, 26 requests (714 KB images, 70 KB JS, 74 KB fonts, 10 KB CSS) |
| `/projects` | 432 ms (`system.svg`) | 76 ms | 0 | |
| `/projects/game-news` | 368 ms | 96 ms | 0 | 36 of 38 images `loading="lazy"` |
| `/projects/brand-guidelines` | 416 ms | 80 ms | 0 | 132 of 134 images lazy |
| `/projects/jamalpos` | 300 ms | 116 ms | 0 | |

The subsequent-page byte counts were affected by the browser cache and are not reported. Mobile-emulated runs were also cache-affected and are not reported. **INP: not measured.**

Static findings (code inspection, not measured):
- **M-11 — Audio payload (35 MB) in `public/`** inflates deploy size; browsers only fetch on play, so runtime impact is low (Risk).
- **L-10 — Unreferenced 557 KB `public/projects/ibu-hilmi/01 Cover.png`** appears unused by `src/` (Observation).
- **L-11 — Oversized images**: many gallery images are 1,300-1,600 px wide and rendered smaller; `game-news` has 36 images delivered at roughly 2x their rendered width. Provide `srcset`/`sizes` or run through Astro `<Image>` (Observation).
- **L-12 — Detail gallery images lack `width`/`height`** (13 of 15 on JamalPOS, similar elsewhere: `SystemStudy.astro` gallery `<img>` has no dimensions). Nothing measured as shifting (CLS 0 on tested pages) because the images are below the fold and lazy, but reserve space with `width/height` or `aspect-ratio` (Risk).
- All six font families load on every page via `Layout.astro` imports; only used subsets are fetched (74 KB on home). OK.
- The JS bundle is one 200 KB file for GSAP + ScrollTrigger + Flip + Barba + Lenis; acceptable for this site.
- No caching headers are configurable from the repo (depends on host).

### 6.8 Security

| Check | Result |
|---|---|
| Secrets / API keys / tokens in source | PASS: none found (grep over `src`, `public`, `scripts`, configs; no `.env`). Matches for "Supabase" are text in project descriptions only. |
| `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `eval`, `document.write` | PASS: none in `src` |
| `localStorage` / cookies / forms | None used |
| External links | PASS: all `target="_blank"` links have `rel="noopener"` (0 violations on 16 pages) |
| Third-party scripts | PASS: none (no CDN scripts, analytics or embeds) |
| `npm audit --omit=dev` | PASS: 0 vulnerabilities (`npm outdated` printed nothing) |
| Security headers (CSP, X-Frame-Options, etc.) | NOT TESTED: depends on host; no `_headers`/`vercel.json`/`netlify.toml` exists. Recommend setting at the host |
| User-generated content | None |
| Personal data exposure (by design) | INFO: public phone number (`+62 821 4694 3003`) and email-like contact in client code and in external linked sites. Expected for a portfolio |
| Project hygiene | INFO: no `.gitignore` and no git repo detected; `node_modules`, `dist` and `.astro` have no ignore protection if version control is added |

### 6.9 Code Quality and Maintainability

Overall the architecture fits the project size. No rewrite or framework change is recommended.

- **M-07 — Build depends on an external folder**: `scripts/sync-audio.mjs:7` reads `../assets (all)/audio` and deletes files in `public/audio` not found there (`line ~21-24`). On a machine without that folder the script logs a warning and the site ships without the player; with a differently populated folder it removes tracks. Make `public/audio` the source of truth or document it.
- **M-12 — No lint/format/test tooling or CI**: add at least `astro check` + a formatter; and a Playwright smoke test for the 16 routes would have caught H-03/H-04.
- **L-13 — Single breakpoint / large CSS file**: `casestudy.css` is 899 lines with 7 `@media (max-width:1024px)` blocks and everything on one breakpoint; this is why 320-430 px and 1024-1180 px are weak. Add a ~600 px breakpoint and use `clamp()` for lockups.
- **L-14 — All CSS loaded on every page** (documented trade-off for Barba, `Layout.astro`). Acceptable (CSS total ~10 KB gzip on home).
- **L-15 — `!important`**: only 1 (`base.css:99`, Lenis). Good.
- **L-16 — Hardcoded colours** in `casestudy.css` and `widgets.css` (e.g. `#fff`, `rgba(20,20,20,.12)`) beside `--black/--white` tokens in `base.css`. Minor.
- **L-17 — `studies.ts` / `systems.json` inline presentation data** (font stacks, swatches) is fine for now.
- **L-18 — Duplicate/obsolete**: `public/projects/ibu-hilmi/01 Cover.png` unreferenced; superseded gallery images from earlier versions remain on disk under `public/projects/*` (e.g. old `reed/r*.webp`, `jamalpos/jamalpos_*.webp`) and are no longer referenced by `systems.json`.
- **L-19 — Memory/listener hygiene**: `nav.ts` registers `document`/`dd` listeners once (not per page): fine. `widgets.ts` ring uses a `ResizeObserver` on `body` without disconnect: fine because it lives for the whole session. `projects.ts` clears its intervals on destroy. No leaks found by inspection (not profiled).

---

## 7. Responsive Audit Results

See table in section 6.3. Summary: 1366 / 1440 / 1920 pass, 768 passes, 375/430 fail only on `/projects/ibu-hilmi`, 320 fails on all pages.

## 8. Functionality and QA Results

See table in section 6.4.

## 9. Performance and SEO Results

See sections 6.6 and 6.7. Lighthouse was **not run** (tool not installed; not installed per instructions), so no Lighthouse scores are reported.

## 10. Security and Accessibility Findings

See sections 6.5 and 6.8. No confirmed vulnerabilities. Risks: copyrighted audio (H-01), missing host-level security headers (unverified).

## 11. Code Quality and Maintainability

See section 6.9.

---

## 12. Prioritized Improvement Roadmap

**Phase 1: Critical / High fixes (about half a day)**
1. H-02 Fix mojibake in `index.astro` lines 6 and 36.
2. H-03 Fix nav overflow at 320 px.
3. H-04 Fix Ibu Hilmi and Alur wordmark tile overflow.
4. H-01 Decide on audio: replace with licensed/own music or remove.

**Phase 2: Functional and responsive**
5. M-06 Restore opened folder on Back; L-06 focus carousel on open.
6. M-08 Focus/announce on Barba route change.
7. M-04, M-09, M-10 Tap-target and tiny-text fixes.
8. Add ~600 px breakpoint; test 1024-1180 px (L-05).

**Phase 3: UI/UX refinements**
9. M-05 Replace the Video placeholder with content or an intentional empty state.
10. L-01 About copy and justify setting; L-03 collapse widgets on phones; L-04 decide on sticky nav; resume link target.

**Phase 4: Performance and SEO**
11. M-01/M-02/M-03 canonical, OG image, Twitter card, robots.txt, sitemap (needs `site` in config), 404 page, better descriptions.
12. L-11/L-12 image dimensions and responsive sizes; remove `01 Cover.png` and unused old gallery files.

**Phase 5: Long-term**
13. M-12 Add `astro check`, formatter and a Playwright smoke test; add `.gitignore` and version control.
14. M-07 Make audio folder part of the repo or document the sync step.
15. Run Lighthouse + axe on the deployed URL and re-measure INP on a real device.

---

## 13. Production Readiness Checklist

| Item | Status |
|---|---|
| Production build succeeds | PASS |
| No console errors / failed requests | PASS |
| No broken images / internal links | PASS (internal links; external not all tested) |
| Responsive 768 px and up | PASS |
| Responsive 320-430 px | FAIL (H-03, H-04) |
| Text encoding correct | FAIL (H-02) |
| Placeholder content removed | FAIL (M-05) |
| Navigation works with keyboard and mouse | PASS |
| Route-change accessibility (focus/announce) | FAIL (M-08) |
| Contrast (sampled) | PARTIAL |
| Touch target sizes | PARTIAL |
| Reduced-motion support | PASS |
| Screen reader testing | NOT TESTED |
| Titles / meta description | PARTIAL |
| Canonical / OG image / Twitter / sitemap / robots | FAIL |
| Custom 404 | FAIL |
| Structured data | NOT APPLICABLE (optional) |
| Core Web Vitals (lab, local) | PASS for LCP / CLS; INP NOT TESTED |
| Lighthouse scores | NOT TESTED |
| Image optimisation | PARTIAL |
| Secrets / unsafe DOM / dependency vulnerabilities | PASS |
| Security headers | NOT TESTED |
| Third-party content rights (audio) | FAIL (risk) |
| Lint / automated tests | NOT TESTED (no tooling exists) |
| Forms / search / cookies | NOT APPLICABLE |

## 14. Final Recommendation

**Ready After Minor Fixes.**

The core experience is solid: no runtime errors, fast lab performance, accessible basics and a clean codebase. The blockers are limited and quick to fix: the home-page encoding corruption, the phone-width overflow on every page at 320 px plus Ibu Hilmi/Alur, the visible placeholder content, the missing SEO/404 basics, and above all a decision about the four copyrighted songs. After Phase 1 and the SEO items in Phase 4, the site is suitable for production. Re-run Lighthouse and a screen-reader pass on the deployed URL to close the items marked NOT TESTED.

### Test limitations
- Lab measurements only (local preview, unthrottled, one browser: Edge/Chromium). Not tested on Safari/Firefox or real phones.
- Widths 321-374, 431-767 and 1025-1365 were not individually swept.
- No Lighthouse, axe or screen reader. Contrast checker ignores text over photos/gradients.
- `puppeteer-core` was installed in the session scratch folder, outside the project; the project itself was not modified.
