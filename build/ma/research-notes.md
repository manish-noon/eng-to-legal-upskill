# M&A research notes (source for the course's market statistics)

> Research report generated 21 Nov 2026. Educational, not legal advice. Figures from secondary summaries are flagged in the Caveats section; verify before relying on them in writing.


## TL;DR
- **What "market" looks like now:** The CMS European M&A Study 2026 covers 601 deals from 2025. It found liability caps below 50% of price in 58% of deals, baskets in 66% (87% of them "first dollar"/tipping), earn-outs at a record 27%, W&I insurance in 23% of deals (59% of large deals) and MAC clauses in only 14%, against 96% in the US. US practice differs materially: under the ABA 2025 study, RWI appears in 63% of deals and pro-sandbagging clauses in 28%.
- **UAE specifics that matter:** Mandatory, suspensory merger control has applied since 31 March 2025, triggered at AED 300m of UAE turnover or 40% market share. Executive Regulations took effect on 30 July 2026, filing fees are capped at AED 150,000, and if the Ministry issues no decision in time the deal is deemed rejected. Mainland share transfers need a notarised MOA amendment and a licence update. Most serious deals use DIFC/ADGM or English law with arbitration. The Middle East W&I market is cheap by global standards (Marsh puts premiums at 0.7% to 1.8% of limit), but it now carries war and sanctions exclusions.

---

## How to use this course (about 14 hours)

| Block | Day 1 | Day 2 |
|---|---|---|
| Morning | Module 1: deal map, structures, players | Module 4: SPA clause by clause (risk allocation) |
| Midday | Module 2: price mechanics, with numeric bridge | Module 5: UAE/GCC specifics |
| Afternoon | Module 3: process documents and due diligence | Module 6: AI in M&A, plus the SPA review exercise |
| Evening | Quizzes 1 to 3 and glossary | Meeting brief: rehearse 8 to 10 questions |

---

# DAY 1: How deals are built

## Module 1: The deal map, structures and roles

**Learning objectives:** describe the seven deal phases; choose between a share deal and an asset deal; explain auction versus bilateral; know who does what.

**The seven phases:**
1. **Strategy/targeting:** the buyer decides why it is buying (capability, market, talent, tech).
2. **NDA → LOI/term sheet (heads of terms):** mostly non-binding. Binding parts are usually confidentiality, exclusivity, costs and governing law.
3. **Due diligence (DD):** legal, financial (quality of earnings), tax, commercial, tech/cyber, HR.
4. **SPA drafting and negotiation:** the main contract.
5. **Regulatory approvals:** merger control, sector regulators, foreign-investment rules.
6. **Signing → closing ("the gap"):** conditions precedent (CPs) are satisfied, and gap covenants stop the seller from changing the business.
7. **Post-closing:** price adjustments, earn-outs, warranty claims and integration.

**Share deal vs asset deal:**

| | Share purchase | Asset purchase |
|---|---|---|
| What you buy | The company, with all its history and liabilities | Chosen assets and liabilities only |
| Contracts | Stay in place, but watch **change-of-control** clauses | Must be assigned or novated, often with counterparty consent |
| Employees (UAE) | Employer unchanged, so service and gratuity liability stay with the target | No automatic transfer: terminate and rehire, which triggers gratuity |
| Diligence | Wide | Narrower |
| Typical use | Most private M&A | Carve-outs, distressed deals, cherry-picking |

**Mergers:** statutory mergers are common in US public deals and less common in UAE private M&A, where share purchases dominate. The ABA 2025 study shows asset deals at 21% of its sample.

**Auction vs bilateral:** in an auction, the seller's bank runs a process (teaser, information memorandum, first-round non-binding bids, data room, binding bids on the seller's draft SPA, selection). Sellers gain leverage; buyers mark up the seller's paper. In a bilateral (proprietary) deal, terms are negotiated one to one, usually under exclusivity.

**Roles:** buyer and seller (corporate, PE sponsor, sovereign fund, family office); investment banks; lawyers (corporate M&A lead plus tax, employment, IP/tech, competition and finance specialists); accountants (financial DD, completion accounts); W&I broker and insurer; local counsel; notary and licensing authorities.

**Quiz 1**
1. Why might a buyer of a UAE business prefer an asset deal? *Leave historic liabilities behind and pick only what it needs. Cost: employee terminate-and-rehire (gratuity) and contract-by-contract transfers.*
2. Which parts of an LOI are usually binding? *Confidentiality, exclusivity, costs, governing law/jurisdiction.*
3. In an auction, whose SPA draft is used? *The seller's. Bidders submit markups.*

---

## Module 2: Price mechanics

**Learning objectives:** build an enterprise-to-equity bridge; explain cash-free/debt-free and normalised working capital; compare locked box with completion accounts; understand leakage, earn-outs, escrow and deferred consideration.

**Core idea:** buyers value the **business** (enterprise value, EV, usually a multiple of EBITDA). Sellers get paid for the **shares** (equity value). The bridge between the two is where lawyers and accountants argue.

**Cash-free/debt-free:** the headline price assumes the seller pays off debt and keeps surplus cash. Price is reduced for debt and **debt-like items**, increased for cash, and adjusted so the business is delivered with a "normal" level of **working capital** (receivables + inventory − payables).

**Worked example: EV-to-equity bridge (AED m)**

| Line | AED m | Comment |
|---|---|---|
| Enterprise value (10× EBITDA of 10) | 100.0 | Agreed headline |
| Less: bank debt | (20.0) | |
| Less: shareholder loans | (3.0) | |
| Less: finance leases | (2.0) | |
| Less: accrued unfunded end-of-service gratuity | (2.5) | Classic UAE negotiation point |
| Less: unpaid corporate tax | (1.5) | |
| Plus: cash | 8.0 | |
| Less: trapped/restricted cash | (1.0) | Buyer argues this is not "free" cash |
| Working capital adjustment: actual 10.0 vs peg 12.0 | (2.0) | Shortfall reduces price |
| **Equity value (purchase price)** | **76.0** | |
| Less: escrow/holdback (10%) | (7.6) | Released later if no claims |
| **Cash paid at closing** | **68.4** | |

Most of the fighting happens in the definitions: what counts as "debt", "cash" and "working capital", and how the peg is set (normally a trailing 12-month average to strip out seasonality).

**Completion accounts vs locked box:**
- **Completion accounts:** price set from accounts drawn up after closing, with a true-up. Favours buyers but brings post-closing disputes. SRS Acquiom 2026: 39% of working-capital adjustments use an agreed "worksheet" methodology rather than generic GAAP references.
- **Locked box:** price fixed by reference to a historic balance sheet. From the locked box date the seller promises no **leakage** (dividends, management fees, bonuses, related-party payments) other than **permitted leakage**, with a pound-for-pound indemnity for any leakage. Common in auctions and with PE sellers. Sellers often ask for a "ticker" (daily interest) between the locked box date and closing.
- **Market data:** CMS 2026 found purchase price adjustments in 48% of European deals vs 92% in the US. Among European deals without a PPA, 54% used a locked box.

**Earn-out:** part of the price depends on future performance. Bridges valuation gaps but is the biggest source of post-closing disputes. Prevalence: 27% in Europe (CMS 2026; EBIT/EBITDA metric in 55%). US: 18% (ABA 2025) to 24% excluding life sciences (SRS 2026).

**Escrow/holdback/deferred consideration:** per DealLawyers.com's summary of the SRS Acquiom 2026 study, 88% of 2025 deals had an escrow or holdback; median 10.0% of deal value without RWI and 2.8% with RWI (aggregate escrows; Fasken puts median indemnity-only escrow on RWI deals at 0.5%).

**Quiz 2**
1. Actual working capital is AED 14m against a 12m peg. *Price goes up AED 2m.*
2. Seller pays an unpermitted AED 1m bonus after the locked box date. *Leakage claim, repaid pound for pound, typically within 6–12 months.*
3. Why do sellers hate earn-outs on net profit? *Buyer controls costs and allocations after closing.*

---

## Module 3: Process documents and due diligence

| Document | What it does | Associate's role |
|---|---|---|
| NDA | Protects confidential information; may include non-solicit | First draft or markup |
| LOI / heads of terms | Price, structure, key conditions, exclusivity | Issues tracking |
| Exclusivity agreement | Seller cannot talk to others for X weeks | Check the expiry date |
| Virtual data room (VDR) | Seller's documents, indexed | Review; track new uploads |
| Q&A / RFI list | Buyer's questions and seller's answers | Draft questions; chase answers |
| Red-flag DD report | Exceptions-only report | Draft sections |
| SPA | Price, CPs, covenants, warranties, indemnities, limitations, termination, law/disputes | Markups, defined-terms checks |
| Disclosure letter | Seller's exceptions against the warranties | Review adequacy / draft |
| SHA | Governance, reserved matters, drag/tag, exits | Draft |
| Ancillaries | TSA, employment/retention letters, IP assignments, resignations, board minutes, POAs | Prepare and track |
| CP checklist | Each CP, owner, status, evidence | Owns it |
| Closing checklist | Who signs what, where, how | Owns it |
| Funds flow memo | Who pays whom, how much, which account, when | Cross-check against price mechanics |

**How DD feeds the SPA:** every material finding goes to (1) price, (2) a **specific indemnity**, (3) a **CP** or pre-closing covenant, (4) accepted risk, or (5) W&I exclusion dealt with elsewhere. (Sidley, May 2026.)

**Quiz 3**
1. Key customer (30% of revenue) has a change-of-control termination right. *Consent as CP or pre-signing step; failing that, price or specific protection.*
2. General vs specific disclosure? *General deems whole categories known (e.g., the data room); specific points to a fact against a warranty.*

---

# DAY 2: The SPA and the UAE

## Module 4: SPA risk allocation, clause by clause

**Warranties vs indemnities**
- **Warranty:** factual statement about the target. If untrue, buyer claims **damages**, must prove loss; qualified by disclosure.
- **Indemnity:** pound-for-pound reimbursement for a specific loss; usually not qualified by disclosure. **Tax covenant/deed** = English-style tax indemnity.
- US: "representations and warranties" + indemnification article. English law: "warranties" + specific indemnities.

**Key qualifiers**
- **Knowledge qualifier:** whose knowledge, actual vs constructive. ABA 2025: 90% constructive.
- **Materiality qualifier** and **materiality scrape** (strip qualifiers when calculating loss).
- **Sandbagging:** ABA 2025: 68% silent, 28% pro, 4% anti. Jurisdiction-dependent.

**Limitations**
- **De minimis:** CMS 2026: present in 73% of deals, mostly up to 0.25% of price.
- **Basket:** tipping (first dollar) — 87% of European baskets; deductible — 49% of US baskets vs 13% Europe.
- **Cap:** CMS 2026: 58% capped below 50% of price; 43% of large deals below 10%. Fundamental warranties usually 100%; fraud uncapped.
- **Time limits:** CMS 2026: 18–24m in 33%, >24m in 32%, 12–18m in 26%, 6–12m in 9%. Tax often 4–7 years.

**Worked example: de minimis, basket and cap**

Price AED 76m. De minimis 0.1% (AED 76k). Basket 1% (AED 760k). Cap 20% (AED 15.2m).

| Claim | AED k | Counts? |
|---|---|---|
| A: unpaid supplier invoice | 50 | No, below de minimis |
| B: undisclosed tax penalty | 300 | Yes |
| C: IP licence breach | 600 | Yes |
| Qualifying total | 900 | Exceeds 760 basket |

- Tipping basket: recover **AED 900k**. Deductible: **AED 140k**.
- Fraud would bypass cap and basket.
- With W&I, policy pays above a **retention** (e.g., 0.5% of EV) up to the limit.

**Conditions, the gap and termination**
- **CPs** and **long-stop date**.
- **Gap covenants**; **gun-jumping** risk.
- **MAC/MAE:** 96% US vs 14% Europe. UAE law does not define MAC; drafting matters.
- **Bring-down** of warranties at closing.

**W&I / RWI:** covers unknown breaches only. Usage: 23% Europe (59% large); 63% US mid-market (ABA 2025); ~46% SRS 2026. Pricing (Marsh Q1 2026): Middle East 0.7–1.8% of limit, retentions 0.15–0.5% of EV; UK 0.4–1.2%; US/Canada 3.0–3.7%. Aon 2026: EMEA notifications up 47% (70 → 119).

**Restrictive covenants:** typically 1–3 years; enforceability depends on reasonableness under governing law.

### Buyer wants vs seller wants

| Clause | Buyer wants | Seller wants | Market data |
|---|---|---|---|
| Price mechanism | Completion accounts | Locked box + ticker | Europe PPA 48%; locked box 54% of non-PPA (CMS 2026); US PPA 92% |
| Earn-out | Yes, EBITDA, buyer-controlled | No; else revenue-based with covenants | Europe 27%; US 18%/24% |
| Escrow | 10%+ for 18–24 months | None (W&I instead) | 88% had one; median 10.0% / 2.8% with RWI |
| Warranties | Broad, unqualified, repeated at closing | Narrow, qualified, at signing only | — |
| Disclosure | Specific only | General data-room disclosure | — |
| Knowledge | Constructive, wide group | Actual, named few | 90% constructive (US) |
| De minimis | Low or none | 0.1–0.25%+ | 73% (CMS 2026) |
| Basket | Tipping, ≤0.5% | Deductible, 1%+ | 66% have baskets; 87% tipping |
| Cap | 100% of price | 10–30%, or nominal with W&I | 58% below 50% |
| Time limit | 24–36m; tax 6–7y | 12–18m | >24m in 32% |
| Sandbagging | Express pro | Express anti | US 68/28/4 |
| Materiality scrape | Double scrape | None | Deal-dependent |
| MAC | Broad walk right | None | 14% EU vs 96% US |
| W&I | Seller pays premium | Buyer pays | Seller funded some/all in 42% |
| Restrictive covenants | 3 years, broad | 1 year, narrow | Law-dependent |
| Disputes | Forum near seller's assets | Home courts | Arbitration in 44% (EU) |

**Quiz 4**
1. AED 500k claims vs AED 760k tipping basket? *Zero.*
2. Why can W&I insurers refuse a known breach? *Known matters are excluded; use specific indemnities.*
3. Why are MACs rarer in Europe? *Deal-certainty custom; very high judicial bar.*

---

## Module 5: UAE/GCC specifics

### 5.1 Three legal systems

| | Onshore | DIFC | ADGM |
|---|---|---|---|
| System | UAE civil law | Common law (own statutes) | English common law applied directly |
| Courts | Local/federal, Arabic | DIFC Courts, English | ADGM Courts, English |
| Share transfer | Notarised transfer + MOA amendment + licence update | Transfer form + register | Transfer + register |

- Typical: English/DIFC/ADGM-law SPA with arbitration (DIAC, ICC, LCIA), plus short-form Arabic transfer document for the notary. DIFC-seated awards can be enforced onshore via the conduit route.
- DIFC-LCIA abolished Sept 2021; cases moved to DIAC. Old clauses still turn up in DD.
- Onshore courts may adjust agreed compensation; short notification periods may not work as drafted; asymmetric dispute clauses held invalid onshore. **Ask, don't assert.**

### 5.2 Corporate law
- **Federal Decree-Law No. 32 of 2021** (in force 2 Jan 2022): 100% foreign ownership default, except "strategic impact" activities (Cabinet Resolution No. 55 of 2021).
- **LLC share transfers:** notarised document; binds third parties once registered with updated licence. Watch pre-emption rights. Don't hand over shares before funds clear.
- **Federal Decree-Law No. 20 of 2025:** multiple share classes, statutory drag/tag, re-domiciliation. Effective date 15 Oct 2025 (Cleary) vs 15 Nov 2025 (Clyde & Co) — confirm.

### 5.3 Merger control
- **Federal Decree-Law No. 36 of 2023**; thresholds under Cabinet Resolution No. 3 of 2025 (effective 31 Mar 2025): **AED 300m** relevant UAE market sales **or 40%** combined share.
- File ≥**90 days before completion**; mandatory and suspensory. Executive Regulations in force **30 July 2026**: completeness check within 10 business days, then 90-day clock; practice ~30–45 days. **No decision = deemed rejection.** Third parties can object.
- Fees: Cabinet Resolution No. 105 of 2026 — 0.02% of aggregate turnover, **capped at AED 150,000** (from 12 July 2026).
- Open points: thresholds possibly applied per party (Baker McKenzie); extraterritorial reach debated (Eversheds); penalty figures vary (up to 10% of relevant UAE revenue cited).

### 5.4 Sector and public-company approvals
- Central Bank (banks, insurers, finance cos); SCA (listed companies); sector regulators; free-zone transfer approvals.
- Public M&A: SCA Decision No. 18/RM of 2017 — mandatory offer threshold 30% + 1 share, squeeze-out above 90%. Check for changes. DFSA Takeover Rules in DIFC.

### 5.5 Employment and Emiratisation
- No TUPE equivalent. Gratuity: 21 days' basic pay/year first 5 years, 30 days thereafter, capped at 2 years' pay. Treat unfunded gratuity as debt-like.
- Emiratisation: 50+ employees → +2%/year to 10% by 31 Dec 2026. Contributions reported at AED 10,000/month per unfilled post (secondary sources; some say AED 9,000). 20–49 employees in 14 sectors: at least two Emiratis.

### 5.6 Market 2025–2026
- PwC TransAct 2026: Middle East volumes +33% in 2025; UAE led with 207 deals; ME SWFs invested US$127bn globally; Mubadala US$33.7bn.
- A&O Shearman: GCC value US$72.7bn to 1 Dec 2025 (UAE US$60.4bn).
- H1 2026: UAE 80.9% of disclosed GCC value (US$52.6bn); Q1 2026 volumes fell to 33 deals from 52.
- W&I: Marsh 100+ MEA inquiries in 2025, median deal US$390m, historic-low pricing. Post-2026 conflict: war, civil unrest and sanctions exclusions; Iran uninsurable, Iraq largely off-limits (Sidley, May 2026). Cyber DD central.

**Quiz 5**
1. Target AED 50m UAE revenue, buyer AED 400m in same market? *Likely filing; confirm market definition.*
2. No Ministry response after 90 days? *Cannot close — deemed rejection.*
3. Why DIFC-seated arbitration for an onshore target? *English-language common-law forum, enforceable onshore via conduit.*

---

## Module 6: AI in M&A practice, and the SPA review exercise

**State of play (late 2026):**
- CMS 2026: AI tool use doubled to 60% of deals involving legal tech; 72% report efficiency gains.
- Harvey and Legora lead. Al Tamimi partnered with Harvey (2023), became Legora's first ME partner (Nov 2025, Arabic interface). Addleshaw Goddard (Harvey) and Fieldfisher (Legora) rollouts Nov 2026.
- Harvey: US$200m at US$11bn (Mar 2026); US$550m at US$15.5bn (9 Sept 2026).
- Kira (Litera), Luminance: established DD tools.
- **Arabic documents remain a gap.**

**Rules of the road:**
- UAE MoJ Guiding Principles for AI use by law firms (29 Sept 2026): guidance; human review, non-delegable responsibility.
- DIFC Courts PGN 2 of 2023: declare AI use, verify.
- ADGM *Arabyads Holding v Alam* [2025] ADGMCFI 0032: reported indemnity costs over AI-generated authorities (secondary source).

**Where AI helps:** DD extraction, playbook comparison, issues lists, defined-terms consistency, disclosure summaries.
**Where it fails:** invented "market" stats and case law, cross-reference misses, local-law errors, Arabic originals, confidentiality with consumer tools.

### Exercise: review a real SPA in 2–3 hours
1. SEC EDGAR full-text search for 8-K "Exhibit 2.1" + "Stock/Share Purchase Agreement"; pick a US$50–500m private-target deal (US-style caveat).
2. Map: definitions → price/adjustment → CPs → covenants → reps → indemnification/limitations → termination → law/disputes.
3. **Prompt 1 (structure):** "You are a junior M&A associate acting for the BUYER. Summarise this SPA into a table: clause number, topic, what it says in one sentence, and who it favours. Quote clause numbers exactly. If something is absent, say 'not found'. Do not infer."
4. **Prompt 2 (limitations):** "Extract every limitation on the seller's liability: de minimis, basket (tipping or deductible), cap(s) by claim type, survival periods, exclusions, sandbagging language, materiality scrape. Quote the exact text for each."
5. **Prompt 3 (issues list):** "Acting for the buyer, produce an issues list in the template below. For each issue: clause, problem, risk rating, proposed buyer position, fallback. Do not cite market statistics unless I provide them."
6. **Prompt 4 (verification):** "List every factual or legal assertion you made that is not directly quoted from the document. For each, mark 'from document' or 'from general knowledge – verify'."
7. Anti-hallucination checks: click through clause refs; check "market" only against named studies; never accept UAE law without a named statute; enterprise tools only for client docs.

**Issues-list template**

| # | Clause | Issue | Risk | Buyer proposal | Fallback | Rationale/source | Owner | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | 9.2 | Basket is deductible at 1% | H | Tipping at 0.5% | Tipping at 1% | CMS 2026: 87% tipping in Europe | Associate | Open |
| 2 | 1.1 "Debt" | Excludes unfunded gratuity | H | Include as debt-like | Specific indemnity | UAE labour law | Associate/finance | Open |
| 3 | 4.1(c) | No UAE merger control CP | H | Add CP + long-stop buffer | — | Decree-Law 36/2023 | Competition | Open |

---

## Glossary

- **EV / equity value:** business value / share value (EV − net debt ± WC adjustment).
- **Cash-free/debt-free; debt-like items; NWC peg.**
- **Completion accounts; locked box / leakage / permitted leakage / ticker.**
- **Earn-out; escrow / holdback.**
- **CP / long-stop date; gap covenants / gun-jumping.**
- **Warranty vs indemnity; disclosure letter.**
- **De minimis / basket (tipping vs deductible) / cap; fundamental warranties.**
- **Sandbagging; materiality scrape; MAC/MAE; bring-down.**
- **W&I / RWI; retention; specific indemnity / tax covenant.**
- **Red-flag DD; VDR / Q&A; SHA / drag / tag; TSA; funds flow.**
- **Economic concentration:** UAE merger control trigger.

---

## Resources
**Free:** CMS European M&A Study 2026; CMS Expert Guide (UAE employment in M&A); SRS Acquiom 2026 Deal Terms Study; Marsh Transactional Risk map Q1 2026; Aon 2026 Transaction Solutions Global Claims Study; Sidley "W&I Insurance in the Middle East Amid Heightened Geopolitical Risk" (May 2026); Baker McKenzie "UAE Continues Strengthening its Merger Control Regime" (Sept 2026); Chambers Practice Guides (Merger Control 2026 UAE; International Arbitration 2026 UAE); Lexology "Private M&A in UAE"; SEC EDGAR.
**Paid:** ABA Private Target Deal Points Study 2025; Practical Law SPA precedents; *Sinclair on Warranties and Indemnities on Share Sales*; *ABA Model Stock Purchase Agreement with Commentary*.

## Caveats
- Market data is sample-specific (CMS = European CMS deals; ABA = US public-filed mid-market; SRS = SRS-agented deals). No public GCC deal-terms dataset. Treat UAE "market" as practitioner judgement.
- Secondary-source figures: SRS escrow medians, Emiratisation amounts, Decree-Law 20/2025 date, ADGM AI costs case.
- Unsettled: merger control penalties, combined vs per-party thresholds, current SCA mandatory offer threshold.

## Key sources
- https://cms.law/en/int/publication/cms-european-m-a-study-2026
- https://www.klgates.com/2025-ABA-Private-Target-Mergers-Acquisitions-Deal-Points-Study-12-19-2025
- https://www.mondaq.com/canada/corporate-and-company-law/1785832/private-ma-deal-trends-to-watch-key-takeaways-from-srs-acquioms-2026-study
- https://www.sidley.com/en/insights/newsupdates/2026/05/w-and-i-insurance-in-the-middle-east-amid-heightened-geopolitical-risk
- https://www.bakermckenzie.com/en/insight/publications/2026/09/united-arab-emirates-continues-strengthening-its-merger-control-regime
- https://chambers.com/articles/uae-merger-control-goes-live-what-dealmakers-need-to-know-about-the-new-executive-regulations
- https://www.aon.com/insights/reports/2026-transaction-solutions-global-claims-study
- https://www.pwc.com/m1/en/publications/2026/docs/transact-2026-middle-east.pdf
- https://cms.law/en/int/expert-guides/cms-expert-guide-to-employment-issues-in-m-a-transactions/united-arab-emirates
- https://www.legalcheek.com/2026/11/addleshaws-and-fieldfisher-pick-rival-legal-ai-giants-harvey-and-legora-as-adoption-race-heats-up/
