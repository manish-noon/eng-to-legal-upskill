# Design guide

The look every course shares. Source of truth: `shared/style.css` (tokens, components) and `shared/theme.js` (theme switch). Reference screenshots: `docs/design/`. Inspiration: Stripe/Linear docs for the interface, a Substack-style reading column for prose. Aim for this level on the first pass.

![Module page](design/redesign-1.jpg)

## Type
| Role | Font | Use |
|---|---|---|
| Interface | Inter (`--ui`) 15px/1.55, `cv11`,`ss01` | sidebar, buttons, cards, tables, callouts, questions |
| Reading | Source Serif 4 (`--read`) 18px/1.72, max 70ch | `.prose`, ledes (20px, `--mut`), clauses (italic 16.5px) |
| Numbers | JetBrains Mono (`--mono`) | counters, module numbers, scores, numeric inputs, durations |
Headings are Inter: module title 40px/700/−0.03em, `h1` 34px, `h2` 22px/650 (52px top margin, scroll-margin for the sticky bar), `h3` 17px. Dashboard hero 48px/750. Kickers and section labels: 10.5–11px, 650, uppercase, letter-spacing .09–.11em.

## Tokens
| Token | Light | Dark | Meaning |
|---|---|---|---|
| `--bg` | #f7f6f3 (warm paper) | #0e1014 | page |
| `--surface` / `--surface-2` | #ffffff / #f1efea | #15181e / #1b1f26 | cards / chips, table heads |
| `--ink` / `--ink-2` / `--mut` | #1b1b1f / #3d3d45 / #6e6d76 | #e7e6e2 / #c4c3be / #8f9099 | headings / body / secondary |
| `--line` / `--line-2` | #e5e2db / #d6d2c8 | #252a32 / #323843 | borders |
| `--acc` / `--acc-soft` / `--acc-ink` | #2d55c9 / #e8edfb / #fff | #8fb0ff / #1c2740 / #0e1014 | accent (one blue only) |
| `--ok` `--bad` `--warn` (+`-soft`) | #147a4a #b42318 #9a6200 | #5fcf93 #ff8f84 #e6b45a | right / wrong / caution |
| `--hl` | #fff1a8 | #5b4c08 | highlighted text in documents |
| `--us` `--uae` `--trap` `--law` | soft blue, green, amber, violet | dark tints | callout backgrounds |
Radius `--radius` 10px; cards 12px; hero/stat cards 14–16px; pills 20px. Shadow `--shadow`: soft two layers (`0 1px 2px`, `0 4px 14px` at 5%). Sidebar width `--side` 288px.

## Light / dark
System default via `prefers-color-scheme`; user override with `html[data-theme=light|dark]`. Load `shared/theme.js` in `<head>` before the stylesheet so there is no flash. Any `[data-themebtn]` or `#themebtn` cycles Auto → Light → Dark (◐ ☀ ☾). New tokens must be defined in all three blocks (`:root`, `html[data-theme=dark]`, the media query). Check every page in both themes.

## Layout
- **Shell**: grid of sticky sidebar + main. Sidebar: course title, subtitle with % complete, progress bar, curriculum grouped by part (uppercase labels), each item = mono number, title, right-aligned status (`3/11`, green when passed); labs, references, Export/Import/Reset.
- **Top bar**: sticky, 52px, blurred translucent background, breadcrumb (`Part / **Module**`), theme toggle, and a 2px reading-progress line (`#rp`) at its bottom edge.
- **Module page**: `.modgrid` = reading column (72ch) + 220px "On this page" TOC with scroll-spy (`.toc a.on`, hidden below 1280px). `.modhead`: kicker (part), 40px title, lede, chips (minutes, questions, tools), module progress bar. End: `.status` card (score, pass state) then previous/next cards (`.pn`).
- **Dashboard**: hero (kicker, 48px title, lede), `.dash-top` = Continue card (accent gradient, round go button) + stats card with progress ring (`.ring`, conic gradient); curriculum as part cards (`.curr`/`.cg`/`.ci` with status dots: empty, half, passed green, low amber); labs and reference as `.cards`.
- **Labs**: `.split` = document pane (`.doc`, serif, pre-wrap, 76vh scroll, `mark` highlights) + sticky answer panel.
- **Catalog** (`index.html`): course cards from `courses.json`.
- **Podcast page**: centered 880px column, cover art square (blue gradient, title), episode rows with play button, per-episode progress, fixed blurred bottom player.
- **Mobile (<900px)**: one column, sidebar slides in from the left with a dim overlay (`body.nav`), menu button in the top bar; terms list stacks; padding 18px.
- **Print**: hide sidebar/top bar/buttons, show explanations, flatten shadows (handbook and cheatsheet print to PDF).

## Components (class → use)
- `.lede` opening promise ("After this module you can…").
- Questions: `.quiz` (MCQ, lettered options A–D drawn by CSS counter, "Check" label, green/red states, `.explain` revealed after answering) and `.num` ("Calculate" label, mono right-aligned input, relative tolerance).
- `details.think` dashed box with a round "?" badge: predict before reading on.
- Callouts `.note` (Note), `.note.us`, `.note.uae` (jurisdiction overlays; relabel per course), `.note.trap` (Trap), `.note.lawyer` ("Say it like a partner", italic).
- `blockquote.clause` real wording, left rule, serif italic, followed by a plain-English decode.
- Tables: rounded, bordered, header on `--surface-2`, `td.r` tabular numerals; `.tablewrap` for horizontal scroll.
- `dl.terms` two-column glossary.
- `.widget` calculator card with a 3px accent top border and uppercase accent `h4`; `.big` for the headline number; `.wf` waterfall bars.
- Buttons: primary filled accent; `.sec` outline; `.iconbtn` for the top bar. Inputs get an accent focus ring (`0 0 0 3px --acc-soft`).
- `.pill`, `.tag.ok/.bad`, `.chips`, `.kicker`, `.bar` progress.

## Rules
- One accent colour; meaning colours only for state (right/wrong/caution) and callouts.
- No inline styles in module content; course-specific CSS goes in the course folder, never in `shared/` unless every course benefits (then re-check `courses/ma/`).
- Writing style in UI copy: plain English, short, no em dashes.
