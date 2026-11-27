# Aviation course verification

The 13 teaching modules contain 118 scored items. The baseline adds 15 and the final adds 19. Reviewers answered shuffled prompts with grading attributes and explanations removed, then compared their responses with the authored keys. A different author checked each group. Worked examples, SVG values, factual claims and legal qualifications were reviewed separately.

| Material | Independent check | Result |
|---|---|---|
| Modules 1–5 | 45 answers, including ten numerical calculations; price, PDP, delay and closing illustrations | All markings matched |
| Modules 6–9 | 36 answers; deposit timing, reserve limits, insurance and financing examples | All matched; corrected a lease refund citation |
| Modules 10–13 | 37 answers, including nine numerical calculations; priority, tax, comparable data, valuation | All matched; clarified that two loss inputs are daily and updated the consolidated VAT source |
| Baseline and final | 34 answers from unmarked prompts | All matched |
| Public grading key | Read section and surrounding text for 68 fields in 21 filings; checked redactions, referenced schedules and units | Values supported. The flat export also checks quotation presence, word limit and choices |
| Simulator and deal desk | Independent calculations of retained loss, effective price, maximum price and veto | See below |

All amounts in these three exercises are hypothetical present USD.

| Mandate | Expected kept loss | Effective cost | Maximum base price | Decision |
|---|---:|---:|---:|---|
| Spare airframe | 60,000 | 5,000,000 | 4,950,000 | Sign |
| Bridge lease | 200,000 | 8,140,000 | 7,730,000 | Negotiate for at least 70,000 |
| Encumbered delivery | 30,000 | 6,140,000 | 6,210,000 | Walk on the unresolved creditor veto |

The ordinary periodic rent teaching band uses four filed clauses. The ordered observations are 3, 3, 5 and 5 business days. Inclusive interpolated quartiles are 3, 4 and 5. The model's median of four is not an observed clause. Illustrative probabilities, synthetic negotiation ranges and case values represent assumptions.

## Repeatable checks

Run from the repository root with Python 3.9 or later:

```sh
python3 -I build/aviation/answer-key/flat.py
python3 .claude/skills/build-course/check_modules.py aviation
```

The checked-in text is sufficient for the grader. Original SEC URLs, accession information and filing dates are in `sources/manifest.json`. Read `sources/descriptions.json` for incorporated terms, redactions, dates, sizes and filing scope. The searchable text loses the filing's table layout. Use the linked original to resolve alignment, signatures and document hierarchy.

Desktop light/dark, tablet navigation, narrow-screen overflow, the clause-hunt unlock, lab grading, drill, diagnostic guidance, printable references and static links were checked locally. The cheatsheet prints on one landscape A4 page. Historical evidence, a synthetic price or a successful exercise cannot establish live availability, enforcement timing, local tax treatment, or negotiated value. Seek practitioner confirmation of those facts on the actual documents.
