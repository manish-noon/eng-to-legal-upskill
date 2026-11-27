# The decision method: position → precedent → leverage → landing → value → advice

Every course ends with the learner applying this to real material. It is checkable: each step leaves a cited trail so an expert can disagree with one specific step. The M&A instance is `build/ma/LANDING-MODEL.md`; modules m14/m15 teach it.

## 0. Map the domain first
| Slot | Question to answer for the domain | M&A instance |
|---|---|---|
| Issue / term | What is negotiated or decided, one item at a time? | Warranty cap, basket, survival, escrow |
| Unit | How do you make items comparable across cases? | % of price, months, categories |
| Comparable set | Where do real outcomes come from? Most explanatory filter? | 22 signed SPAs; insurance yes/no first |
| Sides | Who pulls which way? | Buyer vs seller |
| Leverage factors | What facts move the outcome inside the band? | Competition, seller need, insurance, DD, continuity, buyer type, cycle, regulatory |
| Kept risk | What is left in money after the landing? | p × (loss − recoverable) |
| Value | What is the decision compared against? | Standalone value + synergies − integration |
| Verdicts | The 3 outputs | Pursue / pursue with conditions / walk |

## 1. Position: one knowledge record per issue
principle → why it exists → side A ask → side B pushback → usual landing → what shifts it → walk-away level.
(This "essence capture" format came from watching a practitioner walk through a negotiated contract: capture the reasoning, risks and choices left to the client, not just changed wording.)

## 2. Precedent band
1. Filter comparables; apply the most explanatory filter first. Never blend populations that behave differently (in M&A, insured and uninsured deals).
2. Normalise to the unit.
3. Report n, P25, median, P75. If n < 4, widen one notch and say so.
4. Cross-check against published studies in the research file; if they disagree, explain why; do not average.

## 3. Leverage
Score each factor +1 / 0 / −1 from side A's view; sum; clip to ±2.
Landing = median + (|s|/2) × (band edge on the stronger side − median). Clamp between the two opening positions (an outcome never lands outside the opens). Then name dominant factors that override the arithmetic (e.g. a known risk goes to a specific remedy, not the general band).
Practice heuristics to teach alongside: opens are padded ("ask for ten, get three"); some items rarely move (fundamentals); durations often follow a natural cycle (audit cycles, limitation periods).

## 4. Value and kept risk
For each identified risk: kept = p × (loss − actually recoverable at the landed terms). Effective cost = headline + Σ kept + transaction costs + cost of delay. Compare with value.

## 5. Advice
| Result | Advice |
|---|---|
| Effective cost ≤ value, no trigger hit | Proceed; list what to trade (concede where kept risk is small) |
| ≤ value only if specific landings are achieved | Proceed with conditions; name them |
| > value, or a trigger is hit | Walk, or re-price by at least the gap |
Walk-away triggers are set in advance by the client. Always state break-even. Convert terms to money so they can be traded across issues.

## 6. Deliverable
A memo template in `build/<id>/templates/` with: bottom line (3 lines), facts driving leverage (scored table), issues → landing table (with precedent n and source rows), kept risk, triggers and tradeables, jurisdiction overlay, verification log (every number → source clause or precedent row; AI items marked verified/unverified).
