#!/usr/bin/env python3
"""Kept-risk calculator for SPA limitation packages.

Usage: python3 exposure.py scenario.json
scenario.json:
{
  "price": 76000000,
  "packages": {
    "buyer_open":  {"de_minimis": 0, "basket": 0.005, "basket_type": "tipping", "cap": 1.0, "survival_m": 36, "wi_limit": 0, "wi_retention": 0},
    "landing":     {"de_minimis": 0.001, "basket": 0.01, "basket_type": "deductible", "cap": 0.2, "survival_m": 18, "wi_limit": 0, "wi_retention": 0}
  },
  "risks": [
    {"name": "VAT reassessment", "p": 0.3, "loss": 1200000, "months_to_surface": 20, "specific_indemnity": false},
    {"name": "Gratuity under-accrual", "p": 0.8, "loss": 450000, "months_to_surface": 6, "specific_indemnity": true}
  ]
}
Percentages are fractions of price. A risk with specific_indemnity=true is recovered in full, outside the basket and cap.
Simplification: all risks that surface are assumed to be claimed together (that is how the aggregate basket gets crossed).
"""
import json, sys, itertools

def recover(pkg, price, claims):
    """claims: list of (loss, specific). Returns amount recovered from seller + W&I."""
    spec = sum(l for l, s in claims if s)
    gen = [l for l, s in claims if not s and l > pkg.get("de_minimis", 0) * price]
    total = sum(gen)
    basket = pkg.get("basket", 0) * price
    if total <= basket:
        g = 0.0
    elif pkg.get("basket_type", "tipping") == "tipping":
        g = total
    else:
        g = total - basket
    seller_g = min(g, pkg.get("cap", 1.0) * price)
    # W&I sits above retention, up to limit, for general (unknown) breaches only
    wi = 0.0
    if pkg.get("wi_limit", 0):
        excess = max(0.0, total - pkg.get("wi_retention", 0) * price - seller_g)
        wi = min(excess, pkg["wi_limit"] * price)
    return spec + seller_g + wi

def kept(pkg, price, risks):
    """Exact expected kept loss over all 2^n combinations of risks occurring."""
    exp = 0.0
    for combo in itertools.product([0, 1], repeat=len(risks)):
        prob = 1.0; claims = []; loss = 0.0
        for on, r in zip(combo, risks):
            prob *= r["p"] if on else 1 - r["p"]
            if on:
                loss += r["loss"]
                in_time = r.get("months_to_surface", 0) <= pkg.get("survival_m", 999)
                if in_time:
                    claims.append((r["loss"], r.get("specific_indemnity", False)))
        exp += prob * (loss - recover(pkg, price, claims))
    return exp

def main():
    s = json.load(open(sys.argv[1]))
    price = s["price"]
    gross = sum(r["p"] * r["loss"] for r in s["risks"])
    print(f"Expected gross loss (no protection): {gross:,.0f}")
    for name, pkg in s["packages"].items():
        k = kept(pkg, price, s["risks"])
        print(f"{name:>14}: kept {k:,.0f}  ({k/price:.2%} of price)  -> effective price {price + k:,.0f}")

if __name__ == "__main__":
    main()
