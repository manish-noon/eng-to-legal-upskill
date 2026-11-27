# Design guide

The look every course shares. The shared styles live in `shared/style.css` (tokens and components), `shared/dashboard.css` (course front pages) and `shared/catalog.css` (course catalog). The theme switch lives in `shared/theme.js`. Reference screenshots: `docs/design/`. Inspiration: Stripe/Linear docs for the interface, a Substack-style reading column for prose. Aim for this level on the first pass.

**Editorial journal.** Keep panels, cards and controls square. Round waypoints trace the six stages on a course map. Swiss/editorial grid in the spirit of IBM Carbon, the FT and Bloomberg: strong rules and 1px borders, a 2–4px ink or accent rule to mark hierarchy (module header, section headers, question cards, figures), restrained colour, **no soft shadows** (at most a solid 3–6px offset on hover or the podcast artwork), square status markers, square progress meter instead of a ring. The reading column stays a ~70ch serif with 1.72 line-height.

![Module page](design/redesign-1.jpg)

## Type
| Role | Font | Use |
|---|---|---|
| Interface | Inter (`--ui`) 15px/1.55, `cv11`,`ss01` | sidebar, buttons, cards, tables, callouts, questions |
| Reading | Source Serif 4 (`--read`) 18px/1.72, max 70ch | `.prose`, ledes (20px, `--mut`), clauses (italic 16.5px) |
| Numbers | JetBrains Mono (`--mono`) | counters, module numbers, scores, numeric inputs, durations |
Use the display serif (Georgia, with Source Serif 4 as fallback) for the catalog, course mastheads, lesson titles, reading-section headings and podcast cover. Keep controls and navigation in Inter. The course masthead scales from 58px to 103px and the module title from 37px to 65px. Kickers and section labels: 10.5–11px, 650, uppercase, letter-spacing .09–.11em.

## Tokens
| Token | Light | Dark | Meaning |
|---|---|---|---|
| `--bg` | #faf8f2 (warm paper) | #201c18 | page |
| `--surface` / `--surface-2` | #fffdf8 / #f1ece1 | #28231e / #302a24 | cards / chips, table heads |
| `--ink` / `--ink-2` / `--mut` | #261f19 / #423831 / #675d52 | #f7f2e8 / #ded5c7 / #b9afa0 | headings / body / secondary |
| `--line` / `--line-2` | #e2dccc / #c9bfad | #403931 / #51483c | borders |
| `--acc` / `--acc-soft` / `--acc-ink` | #a13c20 / #f7e7da / #fff | #ffab82 / #4c3328 / #201c18 | accent (terracotta) |
| `--ok` `--bad` `--warn` (+`-soft`) | #147a4a #b42318 #9a6200 | #5fcf93 #ff8f84 #e6b45a | right / wrong / caution |
| `--hl` | #fff1a8 | #5b4c08 | highlighted text in documents |
| `--us` `--uae` `--trap` `--law` | sand, green, amber, parchment | dark tints | callout backgrounds |
Radius: **0 for cards and controls** (`--radius:0`, global override). Shadow: **none** (`--shadow:none`); use borders and, for hover affordance, `3px 3px 0 var(--ink)`. Left rules carry meaning: ink on questions (accent once answered), terracotta/green/amber/umber on callouts. Sidebar width `--side` 288px.

## Light / dark
System default via `prefers-color-scheme`; user override with `html[data-theme=light|dark]`. Load `shared/theme.js` in `<head>` before the stylesheet so there is no flash. Any `[data-themebtn]` or `#themebtn` cycles Auto → Light → Dark (◐ ☀ ☾). New tokens must be defined in all three blocks (`:root`, `html[data-theme=dark]`, the media query). Check every page in both themes.

## Layout
- **Shell**: grid of sticky sidebar + main. Sidebar: course title, subtitle with % complete, progress bar, curriculum grouped by part (uppercase labels), each item = mono number, title, right-aligned status (`3/11`, green when passed); labs, references, Export/Import/Reset.
- **Top bar**: sticky, 52px, blurred translucent background, breadcrumb (`Part / **Module**`), theme toggle, and a 2px reading-progress line (`#rp`) at its bottom edge.
- **Module page**: `.modgrid` = reading column (72ch) + 220px "On this page" TOC with scroll-spy (`.toc a.on`, hidden below 1280px). `.modhead`: kicker (part), 40px title, lede, chips (minutes, questions, tools), module progress bar. End: `.status` card (score, pass state) then previous/next cards (`.pn`).
- **Dashboard**: journal masthead and progress count above a photographic next-lesson card and six-stage course map. Each waypoint opens the first unfinished lesson in its stage. The grouped curriculum, document labs and reference shelf follow.
- **Labs**: `.split` = document pane (`.doc`, serif, pre-wrap, 76vh scroll, `mark` highlights) + sticky answer panel.
- **Catalog** (`index.html`): two-column course index with monochrome cover photos from `courses.json`. The index stacks on mobile.
- **Podcast page**: centered 1060px column, cover art square (umber record grooves, serif title), episode rows with play button, per-episode progress, fixed blurred bottom player.
- **Mobile (<900px)**: one column, sidebar slides in from the left with a dim overlay (`body.nav`), menu button in the top bar; terms list stacks; padding 18px.
- **Print**: hide sidebar/top bar/buttons, show explanations, flatten shadows (handbook and cheatsheet print to PDF).

## Components (class → use)
- `.lede` opening promise ("After this module you can…").
- Questions: `.quiz` (MCQ, lettered options A–D drawn by CSS counter, "Check" label, green/red states, `.explain` revealed after answering) and `.num` ("Calculate" label, mono right-aligned input, relative tolerance).
- `details.think` dashed box with a round "?" badge: predict before reading on.
- Callouts `.note` (Note), `.note.us`, `.note.uae` (jurisdiction overlays; relabel per course), `.note.trap` (Trap), `.note.lawyer` ("Say it like a partner", italic).
- `blockquote.clause` real wording, left rule, serif italic, followed by a plain-English decode.
- Tables: square, bordered, header on `--surface-2`, `td.r` tabular numerals; `.tablewrap` for horizontal scroll.
- `dl.terms` two-column glossary.
- `.widget` calculator card with a 3px accent top border and uppercase accent `h4`; `.big` for the headline number; `.wf` waterfall bars.
- Buttons: primary filled accent; `.sec` outline; `.iconbtn` for the top bar. Inputs get an accent focus ring (`0 0 0 3px --acc-soft`).
- `.pill`, `.tag.ok/.bad`, `.chips`, `.kicker`, `.bar` progress (6px, square).
- **`figure.diagram`**: hand-authored inline SVG explaining a mechanism (timeline, waterfall, decision tree, funnel, stack, band chart, matrix). Markup:
  ```html
  <figure class="diagram"><svg viewBox="0 0 680 260" role="img" aria-labelledby="m08f1-t m08f1-d">
    <title id="m08f1-t">Claim pipeline</title><desc id="m08f1-d">What the diagram shows, in words</desc>
    <rect class="box" x="10" y="20" width="120" height="44"/><text x="70" y="47" text-anchor="middle">De minimis</text> ...
  </svg><figcaption><b>Figure 2.</b> One sentence on what to notice.</figcaption></figure>
  ```
  Rules: no external libraries, no hard-coded colours or `style` attributes; use only the SVG vocabulary classes in `shared/style.css` (shapes `box box2 fa fas fok foks fbad fbads fwarn fwarns fmut fink`, lines `ln lnm lna lnd lnok lnbad`, arrowheads as polygons with `arr`, text `tm ts tb tn tl ta tok tbad twarn`) so light and dark both work; square corners (no `rx`); text ≥11px at a ~680 viewBox width; unique id prefix per figure; place the figure right after the paragraph it explains, never inside a question. Every number in a figure must match the text (recompute). Reuse the same figures, smaller, in the handbook and cheatsheet.

## Rules
- One accent colour; meaning colours only for state (right/wrong/caution) and callouts.
- No inline styles in module content; course-specific CSS goes in the course folder, never in `shared/` unless every course benefits (then re-check `courses/ma/`).
- Writing style in UI copy: plain English, short, no em dashes.
