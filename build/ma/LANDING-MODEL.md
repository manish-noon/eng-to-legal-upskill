# Landing Model: predicting where a deal lands and deciding whether to pursue it

A plain, checkable method. It isn't a black box. Every step leaves a cited trail, so a partner can disagree with a specific step.

## 1. The unit: one issue = one knowledge record
For each disputed term (from the Gulfstream harness):

| Field | Example (general warranty cap) |
|---|---|
| Principle | The seller's liability for unknown problems should be proportionate to the price |
| Why it exists | The buyer can't diligence everything; the seller wants a clean exit |
| Buyer open | 100% of price |
| Seller open | 10% of price |
| Precedent band | P25–P75 from comparable deals (§2) |
| Leverage score | −2 … +2 (§3) |
| Predicted landing | Point estimate plus range |
| What shifts it | W&I in place, auction, DD red flags, seller rollover |
| Walk-away? | Is there a level beyond which the buyer should not sign? (§5) |

## 2. Precedent bands
1. Take the precedent table and filter it to comparables: same **seller type** (founders, PE or corporate carve-out), **W&I/RWI yes/no**, a size bucket (<$50m, $50–500m, >$500m) and, if you have enough rows, the legal family (English-style or US-style).
2. Normalise each term to a comparable unit: **% of price** for de minimis, basket, cap and escrow; **months** for survival; categories for basket type, sandbagging and scrape.
3. Report **n**, P25, median and P75. If n < 4, widen the filter one notch and say so.
4. Cross-check the result against the published studies in the course (CMS 2026 for European-style deals, ABA 2025 for US). If your band and the study disagree, explain why. Don't average them.

## 3. Leverage: which way the term moves inside the band
Score each factor from the **buyer's** point of view (+1 = favours the buyer, −1 = favours the seller):

| Factor | +1 (buyer strong) | −1 (seller strong) |
|---|---|---|
| Competition | Bilateral, buyer is the only realistic exit | Auction with several bidders |
| Seller's need | Distressed, needs to exit, carve-out under deadline | No pressure, can stay owner |
| W&I/RWI | No insurance, so the seller must stand behind the warranties | Insurance, so seller cap at 0–1% |
| DD findings | Known red flags (they go to *specific indemnities*, not the general cap) | Clean DD |
| Seller continuity | Founders leave with all the cash | Founders roll equity or stay as managers (buyer won't sue its own team) |
| Buyer type | PE, financially disciplined | Strategic that "must have" the asset |
| Market cycle | Buyer's market, few buyers (the aircraft-sale example) | Seller's market, too much cash chasing deals |
| Regulatory certainty | Low risk | Merger control or FDI risk, so the seller wants certainty |

**Leverage score** = the sum of the factor scores, clipped to −2…+2.
**Predicted landing** = the median, moved toward the buyer's end of the band by (score/2) × (P75−median) when the score is positive, or toward the seller's end by (|score|/2) × (median−P25) when it's negative. Then **clamp the result between the two opening positions**. A deal never lands outside its opens.

Sanity rules from practice (practitioner rules of thumb, to be confirmed with a practising lawyer):
- "Ask for ten, get three." Opening positions are padded. Don't treat the buyer's open as its real floor.
- Durations follow audit logic: commercial ~12 months, business ~18 months, tax/financial ~24 months+ (one or two audit cycles). Tax often matches the statute of limitations.
- Fundamental warranties (title, capacity, authority) are capped at the price. Fraud is uncapped. These rarely move.
- Known risks go into **specific indemnities** at 100%, outside the basket and cap. Don't spend negotiating capital on them inside the general cap.

## 4. Exposure: what the buyer keeps at the landing point
For each risk *r* you identified in DD or think likely:
- p = probability it becomes a claim
- L = loss if it does
- recovered = what the SPA lets you recover at the *landed* terms (after de minimis, basket and cap, within the time limit, or from W&I above the retention)
- **kept_r = p × (L − recovered)**

`tools/exposure.py` runs this calculation and compares term packages side by side.

## 5. The pursue / walk decision
**Value to buyer** = standalone value + synergies − integration cost.
**Effective price** = headline price + Σ kept_r + deal costs (legal, W&I premium, filing fees) + cost of delay (regulatory timeline × value of time).

| Result | Advice |
|---|---|
| Effective price ≤ value, and no walk-away trigger is hit | **Pursue.** List the issues to *trade* (concede where kept risk is small) |
| Effective price ≤ value *only if* certain landings are achieved | **Pursue with conditions.** Name them (e.g., "specific indemnity for the VAT finding, 100%, 5 years, or price −X") |
| Effective price > value, or a trigger is hit | **Walk**, or re-price by at least the gap |

**Walk-away triggers** (decide them *before* negotiating; the client sets these):
- A known material risk that the seller refuses to cover by specific indemnity or price
- An uninsurable exposure (e.g., W&I war/sanctions exclusions for some MENA exposure) with no seller cover
- Regulatory approval that can't fit inside the long-stop date (UAE: a deemed rejection if the Ministry is silent)
- A cap below the expected loss from a single known issue

**Tradeables:** convert terms into money so they can be traded across issues. For example, "I'll accept a deductible basket (cost ≈ AED 140k expected) if you give me 24-month survival (value ≈ AED 400k)". This is what a good M&A lawyer does by feel. The model just makes it explicit.
