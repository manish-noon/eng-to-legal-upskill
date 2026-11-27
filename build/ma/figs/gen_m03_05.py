import re
def arrowdef(i): return ""  # f'<defs><marker id="{i}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arr" d="M0 0L10 5L0 10z"/></marker></defs>'

# ---- m03 timeline
stages=[("Approach","NDA, teaser","days–2 wk",64),("Outline terms","LOI / offer","2–4 wk",84),
 ("Exclusivity + DD + SPA","data room, draft SPA","6–12 wk",170),("Signing","SPA signed","1 day",0),
 ("The gap","CPs collected","0–6+ months",130),("Closing","shares ↔ money","1 day",0),("Post-closing","true-up, claims","1–3 yrs; tax longer",116)]
x=10; parts=[]; y=100
for name,doc,dur,w in stages:
    if w==0:
        parts.append(f'<line class="lna" x1="{x}" y1="{y-30}" x2="{x}" y2="{y+20}"/><rect class="fa" x="{x-5}" y="{y-5}" width="10" height="10"/>'
                     f'<text class="tb ta" x="{x}" y="{y-62}" text-anchor="middle">{name}</text><text class="ts tm" x="{x}" y="{y-47}" text-anchor="middle">{doc}</text><text class="ts tm" x="{x}" y="{y-34}" text-anchor="middle">{dur}</text>')
        x+=26
    else:
        cls="fwarns" if name=="The gap" else "box2"
        parts.append(f'<rect class="{cls}" x="{x}" y="{y-14}" width="{w}" height="28"/><text class="tb ts" x="{x+w/2}" y="{y+4}" text-anchor="middle">{name}</text>'
                     f'<text class="ts tm" x="{x+w/2}" y="{y+34}" text-anchor="middle">{doc}</text><text class="ts tm" x="{x+w/2}" y="{y+48}" text-anchor="middle">{dur}</text>')
        x+=w+12
W=x
parts.append(f'<line class="lnd" x1="10" y1="170" x2="{W-10}" y2="170"/><text class="tl" x="10" y="190">Information released and commitment rise left → right · bands not to scale</text>')
m03=f'''<figure class="diagram"><svg viewBox="0 0 {W} 200" role="img" aria-labelledby="m03f1-t m03f1-d"><title id="m03f1-t">Deal lifecycle timeline</title><desc id="m03f1-d">Approach (NDA), outline terms (LOI), exclusivity with diligence and SPA negotiation, signing, the gap while conditions are collected, closing, then post-closing true-up and claims, with rule-of-thumb durations.</desc>{"".join(parts)}</svg><figcaption><b>Figure 3.1.</b> Seven stages, two one-day events. The SPA arrives late; signing binds, closing pays. Durations are rules of thumb, not statistics.</figcaption></figure>'''

# ---- m04 waterfall
steps=[("EV","8 × 25",200,"tot"),("Bank|debt","",-45,""),("Shareholder|loan","",-5,""),("Finance|leases","",-4,""),("Unpaid|tax","",-2,""),("Gratuity","contested",-3,""),
 ("Free|cash","16 − 2",14,""),("Working|capital","28 vs 30",-2,""),("Equity|value","price",None,"tot"),("Escrow|10%","",-15.3,""),("Cash at|closing","",None,"tot")]
s=1.05; base=250; bw=44; gap=16; x=40; run=0; out=[]
out.append(f'<line class="lnm" x1="30" y1="{base}" x2="{40+len(steps)*(bw+gap)}" y2="{base}"/>')
prev=None
for name,sub,v,k in steps:
    if k=="tot":
        if v is not None: run=v
        top=base-run*s; out.append(f'<rect class="fink" x="{x}" y="{top}" width="{bw}" height="{run*s}"/>')
        lab=f'{run:.1f}'; ly=top-6; cls="tn tb"
    else:
        a,b=run,run+v; run=b; top=base-max(a,b)*s; h=abs(v)*s
        out.append(f'<rect class="{"fok" if v>0 else "fbad"}" x="{x}" y="{top}" width="{bw}" height="{max(h,1.5)}"/>')
        lab=(f'+{v:g}' if v>0 else f'−{abs(v):g}'); ly=top-6; cls="tn"
    if prev is not None: out.append(f'<line class="lnd" x1="{x-gap}" y1="{base-prev*s}" x2="{x}" y2="{base-prev*s}"/>')
    prev=run
    out.append(f'<text class="{cls}" x="{x+bw/2}" y="{ly}" text-anchor="middle">{lab}</text><text class="ts" x="{x+bw/2}" y="{base+16}" text-anchor="middle">'+"".join(f'<tspan x="{x+bw/2}" dy="{0 if j==0 else 13}">{ln}</tspan>' for j,ln in enumerate(name.split("|")))+'</text>')
    if sub: out.append(f'<text class="ts tm" x="{x+bw/2}" y="{base+44}" text-anchor="middle">{sub}</text>')
    x+=bw+gap
assert abs(run-137.7)<1e-9, run
W=x+10
m04=f'''<figure class="diagram"><svg viewBox="0 0 {W} 304" role="img" aria-labelledby="m04f1-t m04f1-d"><title id="m04f1-t">Bridge from enterprise value to cash at closing</title><desc id="m04f1-d">Waterfall in AED m: enterprise value 200, less bank debt 45, shareholder loan 5, finance leases 4, unpaid tax 2, gratuity 3, plus free cash 14, less working capital shortfall 2, gives equity value 153; less 10 percent escrow of 15.3 gives cash at closing of 137.7.</desc><text class="tl" x="30" y="14">AED m</text>{"".join(out)}</svg><figcaption><b>Figure 4.1.</b> The worked bridge from the table: 200 headline becomes 153 price and 137.7 cash on the day. Red reduces, green adds; every step is a definition, not a renegotiation.</figcaption></figure>'''

# ---- m05 routing tree
qs=[("Fatal to the deal, or unlawful?","Walk away","no price compensates","fbads","tbad"),
    ("Fixable before closing?","Condition precedent / pre-closing fix","removes the risk","fas","ta"),
    ("Known and quantifiable?","Price reduction","certain, immediate","foks","tok"),
    ("Known, amount uncertain?","Specific indemnity","1:1, back it with escrow","fwarns","twarn")]
o=[arrowdef("m05a")]; y=20
for i,(q,r,sub,f,t) in enumerate(qs):
    o.append(f'<rect class="box" x="10" y="{y}" width="250" height="40"/><text class="tb" x="135" y="{y+25}" text-anchor="middle">{q}</text>'
             f'<line class="ln" x1="260" y1="{y+20}" x2="352" y2="{y+20}"/><polygon class="arr" points="360,{y+20} 351,{y+15} 351,{y+25}"/><text class="ts tm" x="300" y="{y+14}" text-anchor="middle">yes</text>'
             f'<rect class="{f}" x="360" y="{y}" width="300" height="40"/><text class="tb {t}" x="372" y="{y+18}">{r}</text><text class="ts tm" x="372" y="{y+33}">{sub}</text>'
             f'<line class="ln" x1="135" y1="{y+40}" x2="135" y2="{y+62}"/><polygon class="arr" points="135,{y+70} 130,{y+61} 140,{y+61}"/><text class="ts tm" x="143" y="{y+58}">no</text>')
    y+=70
o.append(f'<rect class="box2" x="10" y="{y}" width="250" height="40"/><text class="tb" x="135" y="{y+25}" text-anchor="middle">Unknown: nothing found</text>'
         f'<line class="ln" x1="260" y1="{y+20}" x2="352" y2="{y+20}"/><polygon class="arr" points="360,{y+20} 351,{y+15} 351,{y+25}"/>'
         f'<rect class="box" x="360" y="{y}" width="300" height="40"/><text class="tb" x="372" y="{y+18}">Warranty + disclosure</text><text class="ts tm" x="372" y="{y+33}">only for the unknown; disclosed = no claim</text>')
H=y+50
m05=f'''<figure class="diagram"><svg viewBox="0 0 670 {H}" role="img" aria-labelledby="m05f1-t m05f1-d"><title id="m05f1-t">Routing a diligence finding</title><desc id="m05f1-d">Ask in order: fatal or unlawful, walk away; fixable before closing, make it a condition; known and quantifiable, reduce the price; known but uncertain, specific indemnity; unknown, warranty and disclosure.</desc>{"".join(o)}</svg><figcaption><b>Figure 5.1.</b> The decision rule, in order. Each finding gets exactly one primary home. Known problems never rely on a warranty: they will be disclosed against it.</figcaption></figure>'''

import os
D="courses/ma/content/"
def ins(fn,anchor,fig,name):
    p=D+fn; t=open(p).read()
    if 'class="diagram"' in t and fig.split('aria-labelledby="')[1][:5] in t: print("skip",fn); return
    assert t.count(anchor)==1,(fn,anchor); t=t.replace(anchor,fig+"\n"+anchor); open(p,"w").write(t)
    open(f"build/ma/figs/{name}.html","w").write(fig)
ins("m03.html","<p>These durations are practitioner rules of thumb",m03,"m03-lifecycle")
ins("m04.html","<p>The headline was 200. The seller banks 137.7.",m04,"m04-bridge")
ins("m05.html","<p>Two refinements make this real.</p>",m05,"m05-routing")
