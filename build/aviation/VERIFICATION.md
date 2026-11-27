# Aviation course verification

## Contract-reading edition

Sixteen modules contain 146 scored items. The diagnostic has 18 items and the final has 24. All 152 question IDs from the original edition remain usable. New lessons sit directly after the relevant foundation lesson. Browser progress and individual module resets distinguish those IDs and the new lesson suffixes.

| Check | Evidence |
|---|---|
| Three new teaching modules | Independent readers answered all 28 shuffled and unmarked items before comparing with the keys, including six numeric answers. They checked the diagrams, worked figures and filed clauses. |
| New diagnostic and exam questions | Eight new items answered blind. Clarified the exam question asking for the amount of a repair bill borne by the buyer. |
| Four public-file exercises | Twelve interpretations and calculations independently solved from the exhibits. Each case also requires the correct provision and a short excerpt containing its operative language. The OEM delay exercise scopes the evidence check to the replacement letter. |
| Four fictional markup exercises | Independently recomputed the collateral peak, warranty distribution, programme-transfer shortfall and unfunded records risk. The two scored checks per case concern the later file. Opening forecasts and written trade proposals have model commentary and are unscored. |
| Two independent client calls | A separate reader received the deal briefs, read the exhibits and reached both decisions before seeing the model memos. All eight short quotations and both lease-budget calculations checked. The learner assesses their own written advice against a published rubric. |
| Existing teaching and calculations | Checked the new read-alongs against their cited provisions. Recomputed all three earlier deal-desk decisions. Existing public extraction fields pass the 21-file audit below. |

The instructional markups, comments, counters, time limits and assumed commercial facts in fictional files are teaching examples. Private materials informed topic selection. They supply neither public quotations nor market statistics. For a live file, a practitioner must confirm the complete executed set, third-party authority, actual technical evidence and jurisdiction-specific procedures.

## Original edition

The original 13 teaching modules contained 118 scored items. Its baseline had 15 and its final had 19. Reviewers answered shuffled prompts with grading attributes and explanations removed, then compared their responses with the authored keys. A different author checked each group. Worked examples, SVG values, factual claims and legal qualifications were reviewed separately.

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
