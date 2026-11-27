# Independent verification pass (mandatory)

Agents that write modules invent small facts. Check with fresh agents given the files, not your summary.

## Checker agent brief (one per ~4 modules)
"You are checking course modules `courses/<id>/content/mNN.html` … for a learner who will rely on them. For every `.num` item: recompute the answer from the question text alone, then compare with `data-answer`/`data-tol`. For every `.quiz`: answer it yourself before looking at `data-correct`; report any item where your answer differs or where two options are defensible. Read the prose: flag overstated law, statements true only in some jurisdictions without a flag, statistics not found in `build/<id>/research-notes.md` or attributed to the wrong study, invented statutes/cases/deals, terms used before they are defined. Output a table: id or quote | problem | evidence | suggested fix. Do not edit files."

## Simulator agent
Recompute every capstone/lab number against the engine code (`labs.js`, `widgets.js`, the method). Check that the three capstone cases produce the three intended verdicts and that break-even values are right.

## Answer-key audit agent
For each row of the flat grading table, open the source document, find the section, confirm the value and quote. Report mismatches, redaction mistakes, confusions between similar mechanisms.

## Then
Fix every confirmed finding, re-run `check_modules.py`, and list unresolved points (to confirm with a practitioner) in the final report.
