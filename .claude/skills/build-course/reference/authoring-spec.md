# Module authoring spec (give this verbatim to writing agents)

Fill in before sending: COURSE TITLE, LEARNER PROFILE, END CAPABILITY, MODULE LIST, YOUR MODULES, ALREADY TAUGHT, WIDGETS, RESEARCH FILE PATH, ANSWER KEY PATH, JURISDICTION OVERLAYS.

- Output: one HTML fragment per module `content/mNN.html` (no html/head/body/script/style/inline styles). A JS engine wires interactive elements.
- 1,500–2,300 words of prose, 5–8 `<h2>` sections. Plain English, short sentences, second person. No em dashes.
- Structure: `<h1>`, `<p class="lede">` (what you can do after), sections, items placed right after the idea they test, then `<h2>Key terms</h2><dl class="terms"><dt>..</dt><dd>..</dd></dl>` (8–15 terms; feed flashcards and handbook glossary).
- Markup:
  - MCQ: `<div class="quiz" data-id="m04q1"><p class="q">?</p><ul><li>..</li><li data-correct>..</li></ul><p class="explain">why right AND why the tempting wrong one is wrong</p></div>` (exactly one data-correct, 3–5 plausible options)
  - Numeric: `<div class="num" data-id="m04n1" data-answer="900000" data-tol="0.01"><p class="q">… in AED.</p><p class="explain">working</p></div>` (tol is relative)
  - Think-first: `<details class="think"><summary>Before reading on: …?</summary><p>…</p></details>`
  - Callouts: `div.note`, `.note.us`, `.note.uae` (jurisdiction overlay), `.note.trap`, `.note.lawyer` (one line a partner would say)
  - Clause sample `<blockquote class="clause">` followed by a plain-English decode; two-sides table `<table class="bs">` (Term | Side A wants | Side B wants | Why | Typical landing)
  - Widgets: `<div data-widget="NAME"></div>` (only names from WIDGETS)
- 9–12 scored items per module (≥2 numeric), 3–5 think prompts; questions require reasoning on new fact patterns; ≥3 per module hard enough to catch a skimmer.
- Use the learner profile to choose pace and difficulty. Explain clauses through the decisions the parties face. When a private matter suggests a lesson, write a fresh fictional transaction with a different disputed fact, remedy and commercial setting. Label the exercise, and ground claims about actual deals in the public source.
- Accuracy: no invented statistics, statutes or case names; stats only from the research file with the study named; well-established doctrine is fine; flag jurisdiction variance.
- Self-check before finishing: valid nesting, unique ids, one data-correct, recomputed numerics, no undefined terms.

Also tell each agent:
- Ids are `<module>q<n>` for MCQs and `<module>n<n>` for numerics; never reuse across modules.
- Do not redefine terms listed under ALREADY TAUGHT; refer back instead ("the basket from module 8").
- Report back: word count, item counts, any fact you were unsure of (with why), any term you used but did not define.
