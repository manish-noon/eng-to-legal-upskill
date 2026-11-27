---
name: build-course
description: Build a new interactive, static, self-paced course in this repo (courses/<id>/) from a topic, a learner profile and an end capability, to the same quality bar and design as the "Calling the Deal" M&A course. Use when asked to create, plan or extend a course, its modules, labs, exams, handbook or cheatsheet.
---

# Build a course

Inputs you need (ask only for what is missing, in one message):
1. **Topic** and course id (short slug, e.g. `ip`, `employment`, `disputes`).
2. **Learner profile** (default: very fast, sceptical, technical senior engineer/CTO, zero domain knowledge, allergic to fluff).
3. **End capability**: one sentence, a verb the learner can do at the end on real material ("given X, predict Y and advise Z").

Output: `courses/<id>/` that plugs into the catalog (`courses.json`), reuses `shared/style.css` + `shared/theme.js`, plus `build/<id>/` (sources, answer key, research file, tools). Then hand over to the `build-podcast` skill.

Reference model: `courses/ma/` (finished course) and `build/ma/` (its sources). Copy structure, not content.

## Pipeline (in order; do not skip steps)

1. **Goal first.** Write the end capability as one sentence in `build/<id>/COURSE.md`. Every module must serve it; the last two modules ARE it (the method, then the decision). Draft the module list (≈12–16 modules, grouped into 4–6 parts: foundations → mechanics → risk/the hard parts → context/jurisdiction → applying the method). Write what each module lets the learner *do*.
2. **Learner profile.** Teach mechanisms from first principles. Dense, plain English, define every term on first use, use exact engineering analogies only (if the analogy leaks, drop it).
3. **Gather real primary documents** into `build/<id>/sources/` and the readable copies into `courses/<id>/docs/NN-slug.txt` (+ `docs/index.html`). Real documents are what make labs and tests credible. See `reference/sources.md` for where to find them (SEC EDGAR full-text search worked for contracts) and how to download safely (own folder, User-Agent, `python3 -I` for anything reading downloads, HTML→text).
4. **Build an answer key** from the documents with parallel extraction agents (≈10 documents each). Every field = `{value, section, quote ≤25 words}`; "not found" rather than guess; computed numbers (percentages etc.) flagged as computed. Hand-normalise into a flat grading table (`build/<id>/answer-key/flat.py`, see `build/ma/answer-key/`). Then run an **independent audit agent** against the source text (it found 8 errors in 22 M&A deals; typical errors: two similar-sounding mechanisms confused, redacted amounts filled in). Export what the labs need to `courses/<id>/data/*.json`. The key is public once shipped: say so in the README caveats.
5. **Research file** `build/<id>/research-notes.md`: the ONLY permitted source of market statistics. Every statistic carries its study name and year. Modules may cite numbers only from it, naming the study; anything else is "not a statistic we can quote".
6. **Authoring spec + parallel module writing.** Give `reference/authoring-spec.md` **verbatim** to writing agents, 3–4 modules per agent, each told (a) the learner profile and end capability, (b) the full module list, (c) what earlier modules already taught (terms defined, examples used), (d) which widgets exist, (e) path to the research file and answer key. Callout classes (`.note.us`, `.note.uae`) are jurisdiction overlays: rename the labels in a course-local CSS if the domain differs, do not edit `shared/style.css` content for one course.
7. **Engine, widgets and labs: write them yourself** (they encode the method and must agree with the maths). Start from `courses/ma/app.js`, `api.js`, `widgets.js`, `labs.js`, `labs2.js`, `data.js`. Change the localStorage prefix (`ma_` → `<id>_`) everywhere, including the export/import key list and the theme key only if you want a separate theme. Labs pattern that worked: extraction hunt graded against the key with the clause quoted back; spot planted errors in an AI summary; precedent explorer that unlocks after N graded extractions; blind prediction then reveal; risk/exposure simulator; capstone desk (three cases engineered to come out as the three different verdicts); write an issues list and compare with a model list.
8. **Mandatory independent verification pass** (see `reference/verification.md`). One checker agent per ~4 modules, given the code and text, not your conclusions. Plus one agent that checks capstone numbers against the simulator. In M&A this caught a wrongly marked quiz and a calculator bug. Fix, then re-run the mechanical checks.
9. **Diagnostic (`d00`), final exam (`x16` or `xNN`) and the issues-list lab.** Diagnostic: ~15 questions across all parts, unscored for pass, shows where to start. Final exam: new fact patterns across every module, numeric items included, 80% pass.
10. **Handbook + cheatsheet** distilled from the finished modules: `handbook.html` (long reference, one section per module, glossary built from all `dl.terms`) and `cheatsheet.html` (one printable page: the method, the key numbers with sources, the decision table). Print both to PDF (Chrome headless `--print-to-pdf`) and commit the PDFs.
11. **Podcast**: invoke the `build-podcast` skill.
12. **Diagrams and design pass** against `docs/DESIGN.md`. Blocky editorial style: zero radius, rules not shadows (inherited from `shared/`). Add hand-authored inline SVG `figure.diagram` blocks wherever a mechanism has shape (timeline, waterfall, decision tree, funnel, stack, band chart, verdict matrix): at least one per mechanics module, plus precedent band charts computed from the answer-key data. Fan these out to agents per module group with the figure rules from DESIGN.md; never change questions or prose; recompute every number. Save each figure to `build/<id>/figs/` and reuse them in the handbook and in the cheatsheet (a dense visual one-pager that prints to one A4 landscape page). Screenshot light/dark, desktop/iPad before shipping. Aim for the finished level from the start (the first M&A pass was rejected as "not good"; the second, with hierarchy, TOC, dashboard, landed).
13. **Ship**: add the course to `courses.json` (fields: id, title, subtitle, description, path, podcast, status, modules, hours), update README table, run locally (`python3 -m http.server 8000`), check every page, commit, push to `main`, confirm the live URLs load.

## The method (the core of every course)
Every course ends in a decision method. Use the domain-agnostic template in `reference/method.md`: **position → precedent → leverage → landing → value → advice**. Map it onto the domain before writing modules (what is a "term", what is a comparable, what are the leverage factors, what is kept risk in money, what are the verdicts). `build/ma/LANDING-MODEL.md` is the worked M&A instance; `build/ma/templates/deal-landing-memo.md` is the deliverable template; write the equivalent for the new domain in `build/<id>/`.

## Quality bar (checklist before shipping)
- [ ] Every module: 1,500–2,300 words, 9–12 scored items (≥2 numeric), 3–5 think prompts, 8–15 key terms, ≥3 items that catch a skimmer.
- [ ] Mechanical check passes: `python3 .claude/skills/build-course/check_modules.py <id>` (unique ids, exactly one `data-correct`, numeric `data-answer` present, no em dashes, no inline styles/scripts, word counts).
- [ ] Verification pass done and every finding resolved or noted.
- [ ] No statistic without a named study from the research file; no invented statutes, cases or real deals; jurisdiction variance flagged.
- [ ] Anything you wrote or edited by hand is recomputed (the only wrong marked answer in M&A came from a quick manual edit).
- [ ] Every mechanics module has a `figure.diagram`; figure numbers match the text; cheatsheet prints to one A4 landscape page.
- [ ] Light and dark both checked; mobile sidebar works; print view of handbook/cheatsheet OK.

## Rules
- Repo is PUBLIC (GitHub Pages from `main`). Never commit `.env`, confidential meeting transcripts or chat exports, or names of real people from private meetings. Extract generic method only.
- Do not break existing courses: never edit `courses/ma/` or `shared/` behaviour while building another course; if `shared/` must change, check `courses/ma/` still renders in both themes.
- Python tools: 3.9 compatible, stdlib only, load `.env` via `tools/env.py`.
- Final report to the user: what was checked, what was not, legal/factual points to confirm with a practitioner.
