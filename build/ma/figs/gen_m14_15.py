import json,os,sys
ROOT=sys.argv[1]; OUT=os.path.join(ROOT,'build/ma/figs'); os.makedirs(OUT,exist_ok=True)
R=json.load(open(os.path.join(ROOT,'courses/ma/data/precedents.json')))['rows']
def pct(v,q):
    v=sorted(v);k=(len(v)-1)*q;f=int(k);c=min(f+1,len(v)-1);return v[f]+(v[c]-v[f])*(k-f)
def T(x,y,s,cls='',anchor=None):
    a=' text-anchor="%s"'%anchor if anchor else ''
    c=' class="%s"'%cls if cls else ''
    return '<text x="%g" y="%g"%s%s>%s</text>'%(x,y,c,a,s)
def rect(x,y,w,h,cls): return '<rect x="%g" y="%g" width="%g" height="%g" class="%s"/>'%(x,y,w,h,cls)
def line(x1,y1,x2,y2,cls='ln'): return '<line x1="%g" y1="%g" x2="%g" y2="%g" class="%s"/>'%(x1,y1,x2,y2,cls)
def arrR(x,y): return '<polygon points="%g,%g %g,%g %g,%g" class="arr"/>'%(x,y,x-7,y-4,x-7,y+4)
def arrL(x,y): return '<polygon points="%g,%g %g,%g %g,%g" class="arr"/>'%(x,y,x+7,y-4,x+7,y+4)
def fig(fid,w,h,title,desc,body,num,cap):
    return ('<figure class="diagram"><svg viewBox="0 0 %d %d" role="img" aria-labelledby="%s-t %s-d"><title id="%s-t">%s</title><desc id="%s-d">%s</desc>\n%s\n</svg><figcaption><b>Figure %d.</b> %s</figcaption></figure>'
            %(w,h,fid,fid,fid,title,fid,desc,"\n".join(body),num,cap))
figs={}
# ---------- m14 leverage ----------
b=[]
facs=[("Competition","Auction","Bilateral"),("Seller's need","Can keep it","Distress, deadline"),("Warranty insurance","Policy in place","None"),
      ("Diligence findings","Clean","Red flags"),("Seller continuity","Roll over / stay","Leave with cash"),("Buyer type","Strategic, needs it","Financial, has options"),
      ("Market cycle","Capital chasing deals","Few buyers"),("Regulatory / timing","Approvals needed","Quick, clean close")]
X={-1:290,0:400,1:510}
b.append(T(10,22,"Factor","tl")); b.append(T(X[-1],22,"−1 seller","tl","middle")); b.append(T(X[0],22,"0","tl","middle")); b.append(T(X[1],22,"+1 buyer","tl","middle"))
y=48
for n,s,bb in facs:
    b.append(T(10,y+4,n,"tb")); b.append(line(X[-1],y,X[1],y,'lnm'))
    for k in (-1,0,1): b.append(rect(X[k]-5,y-5,10,10,'box'))
    b.append(T(X[-1]-14,y+4,s,"ts tm","end")); b.append(T(X[1]+14,y+4,bb,"ts tm"))
    y+=26
y+=8
b.append(line(10,y,670,y,'lnm')); y+=26
b.append(T(10,y+4,"Sum of eight","tb")); b.append(T(10,y+20,"range −8 to +8","ts tm"))
x0,x1=150,650; sx=lambda v:x0+(v+8)*(x1-x0)/16.0
b.append(rect(sx(-2),y-10,sx(2)-sx(-2),20,'fas'))
b.append(line(x0,y,x1,y))
for v in range(-8,9):
    b.append(line(sx(v),y-4,sx(v),y+4)); b.append(T(sx(v),y+20,("+%d"%v if v>0 else ("−%d"%-v if v<0 else "0")),"tn tm","middle"))
b.append(T(sx(0),y-16,"clipped score: −2 to +2","ts ta tb","middle"))
b.append(line(sx(-6),y-26,sx(-2)+2,y-26,'lnd')); b.append(arrR(sx(-2)+2,y-26)); b.append(T(sx(-6),y-30,"−3 or below → −2","ts tm"))
b.append(line(sx(6),y-26,sx(2)-2,y-26,'lnd')); b.append(arrL(sx(2)-2,y-26)); b.append(T(sx(6),y-30,"+3 or above → +2","ts tm","end"))
H=y+34
figs['m14-leverage']=('m14','<p>Add the eight scores, then <b>clip</b>',fig('m14f1',680,H,"Leverage scoring: eight factors, summed and clipped",
 "Eight factors each scored minus one, zero or plus one from the buyer's side. The sum can range from minus eight to plus eight and is clipped to minus two to plus two.",b,2,
 "Score each factor from the buyer's side, add the eight scores, then clip the total to −2 … +2. Beyond that, extra leverage no longer moves a term."))
# ---------- m14 landing ----------
b=[]; x0,x1=70,610; sx=lambda v:x0+(v-8)*(x1-x0)/10.0; y=110
p25,med,p75,s=10,15,16.7,1; land=med+abs(s)/2.0*(p75-med)
assert abs(land-15.85)<1e-9
b.append(rect(sx(p25),y-22,sx(p75)-sx(p25),44,'fas'))
b.append(line(x0,y,x1,y))
for v in range(8,19): b.append(line(sx(v),y+22,sx(v),y+28)); b.append(T(sx(v),y+42,"%d%%"%v,"tn tm","middle"))
for v,l in ((p25,"P25 10%"),(med,"Median 15%"),(p75,"P75 16.7%")):
    b.append(line(sx(v),y-22,sx(v),y+22,'ln')); b.append(T(sx(v),y-30,l,"ts tb","middle"))
b.append(rect(sx(land)-6,y-6,12,12,'fa'))
b.append(T(sx(land),y+70,"Landing 15.85% (\"15 to 17\")","tb ta","middle")); b.append(line(sx(land),y+8,sx(land),y+56,'lna'))
b.append(line(sx(med),y-62,sx(land)-1,y-62,'lna')); b.append(arrR(sx(land),y-62))
b.append(T(sx(med)-6,y-58,"score +1: move ½ of the way to P75","ts","end"))
b.append(T(sx(med)-6,y-74,"15 + (1 ÷ 2) × (16.7 − 15) = 15.85","tn","end"))
b.append(line(x0-10,y,x0-40,y,'lnd')); b.append(arrL(x0-48,y)); b.append(T(x0-40,y+68,"seller's open","ts tm"))
b.append(line(x1+10,y,x1+40,y,'lnd')); b.append(arrR(x1+48,y)); b.append(T(x1+48,y+68,"buyer's open","ts tm","end"))
b.append(T(340,y+98,"Clamp: the landing never goes past either side's opening position.","ts tm","middle"))
figs['m14-landing']=('m14','<p><b>Worked example.</b> Uninsured band',fig('m14f2',680,y+110,"Landing on the band: worked example for the uninsured general cap",
 "A band from 10 percent (P25) to 16.7 percent (P75) with median 15 percent. A leverage score of plus one moves the landing half way from the median to P75, to 15.85 percent, between the two opening positions.",b,3,
 "The worked example: uninsured cap band 10 / 15 / 16.7%, score +1, landing 15.85%. Positive scores move toward the buyer's edge of the band (P75 for a cap; P25 for a basket), then the result is clamped between the openings."))
# ---------- m14 bands ----------
b=[]; panels=[("cap_pct","General cap, % of price",0,40,[0,10,20,30,40],"%g%%"),("basket_pct","Basket, % of price",0,9,[0,1,2,3,4,5,6,7,8,9],"%g%%"),("survival_m","Time limit, months",0,24,[0,6,12,18,24],"%g")]
x0,x1=130,500; y=10; stats={}
b.append(T(x1+14,y+12,"P25 / median / P75","tl")); 
for f,ttl,lo,hi,ticks,fmt in panels:
    sx=lambda v,lo=lo,hi=hi:x0+(v-lo)*(x1-x0)/float(hi-lo)
    y+=24; b.append(T(10,y,ttl,"tb")); y+=16
    for g,gl in (("N","Uninsured"),("Y","Insured")):
        v=[r[f] for r in R if r['rwi']==g and r[f] is not None]
        q=[pct(v,a) for a in (.25,.5,.75)]; stats[(f,g)]=(len(v),q)
        yc=y+20
        b.append(T(10,yc+4,gl,"ts")); b.append(rect(sx(q[0]),yc-17,max(sx(q[2])-sx(q[0]),2),34,'fas'))
        b.append(line(sx(q[1]),yc-19,sx(q[1]),yc+19,'lna'))
        seen={}
        for val in sorted(v):
            k=seen.get(val,0); seen[val]=k+1
            off=((k+1)//2)*6*(1 if k%2 else -1)
            b.append(rect(sx(val)-2.5,yc-2.5+off,5,5,'fink'))
        lab="%s / %s / %s"%tuple(("%g"%round(x,2)) for x in q)
        b.append(T(x1+14,yc+4,lab+"   n = %d"%len(v),"tn"))
        y+=42
    b.append(line(x0,y,x1,y,'ln'))
    for t in ticks: b.append(line(sx(t),y,sx(t),y+4)); b.append(T(sx(t),y+16,fmt%t,"tn tm ts","middle"))
    y+=22
figs['m14-bands']=('m14','<p>From the comparables, take',fig('m14f3',680,y+6,"Precedent bands in the 22-deal set, insured versus uninsured",
 "Dot plots of general cap, basket and time limit for the 22 signed agreements, split by warranty insurance, with the 25th to 75th percentile band shaded and the median marked.",b,1,
 "Each square is one of the 22 deals (side by side where values repeat); shaded box = P25 to P75, line = median. Percentiles by linear interpolation; deals where the term is not stated are excluded, so n differs by term. Insured deals with a cap or time limit of 0 are those where the seller's warranties end at closing."))
# ---------- m15 kept risk ----------
b=[]; x0=250; sc=300/360.0; y=34
b.append(T(10,18,"Expected loss p × L = 0.3 × AED 1.2m = AED 360k","tb"))
rows=[("General warranty, 18-month limit","claim at month 20 is out of time",0,360),("Time limit extended to 24 months","in time, clears basket, under cap",360,0),("Specific VAT indemnity","outside the general limits",360,0)]
for n,why,rec,kept in rows:
    b.append(T(10,y+14,n,"ts tb")); b.append(T(10,y+28,why,"ts tm"))
    if rec: b.append(rect(x0,y+4,rec*sc,22,'foks'))
    if kept: b.append(rect(x0+rec*sc,y+4,kept*sc,22,'fbads'))
    b.append(T(x0+310,y+20,"kept AED %s"%("360k" if kept else "0"),"tn "+("tbad" if kept else "tok")))
    y+=44
b.append(rect(x0,y+2,10,10,'foks')); b.append(T(x0+16,y+11,"recovered (weighted by p)","ts tm")); b.append(rect(x0+190,y+2,10,10,'fbads')); b.append(T(x0+206,y+11,"kept by the buyer","ts tm"))
figs['m15-keptrisk']=('m15','<p>So for this buyer, six more months',fig('m15f1',680,y+22,"Kept risk for one VAT risk under three sets of terms",
 "Expected loss of 360 thousand dirhams. Under an 18 month time limit all of it is kept; with a 24 month limit or a specific VAT indemnity none of it is kept.",b,1,
 "The worked example: price AED 76m, VAT risk p = 30%, L = AED 1.2m, surfacing at month 20. Six more months on the time limit, or a VAT indemnity, each move AED 360k of expected loss from the buyer to the seller."))
# ---------- m15 effective price vs value ----------
b=[]; base=230
def stack(x,parts,label):
    yy=base
    for h,cls,t in parts:
        b.append(rect(x,yy-h,150,h,cls)); b.append(T(x+75,(yy-h/2+4) if h<70 else (yy-16),t,"ts","middle")); yy-=h
    b.append(T(x+75,base+18,label,"tb","middle")); return yy
top1=stack(60,[(140,'box2',"Headline price"),(30,'fbads',"Expected kept risk"),(22,'fwarns',"Deal costs")],"Effective price")
top2=stack(300,[(150,'box2',"Standalone value"),(76,'foks',"Synergies")],"Value to the buyer")
b.append(rect(300,top2,150,20,'lnd')); b.append(T(375,top2+14,"− integration cost","ts","middle"))
vt=top2+20
b.append(line(40,top1,505,top1,'lnd')); b.append(line(40,vt,505,vt,'lnd'))
b.append(line(500,top1,500,vt,'lna')); b.append(arrR(500,vt) if False else '<polygon points="500,%g 496,%g 504,%g" class="arr"/>'%(vt,vt-7,vt-7))
b.append(T(514,(top1+vt)/2+4,"gap = value − effective price","ts tb"))
b.append(T(514,(top1+vt)/2+20,"break-even: gap = 0","ts tm"))
b.append(line(40,base,560,base))
figs['m15-effective']=('m15','<p>Compare the result with <b>value to the buyer</b>',fig('m15f2',700,base+30,"Effective price compared with value to the buyer",
 "Left column: headline price plus expected kept risk plus deal costs gives effective price. Right column: standalone value plus synergies minus integration cost gives value to the buyer. The gap between the two tops is the margin; break even is where it is zero.",b,2,
 "Effective price = headline price + expected kept risk + deal costs. Value = standalone value + synergies − integration cost. The advice turns on the gap between the two (schematic, not to scale)."))
# ---------- m15 verdict matrix ----------
b=[]; cx=[250,470]; cw=210; rh=52; y0=40
b.append(T(cx[0]+cw/2,26,"No walk-away trigger hit","tl","middle")); b.append(T(cx[1]+cw/2,26,"A trigger is hit","tl","middle"))
rows=[("Effective price ≤ value","on the predicted landing","foks","Pursue","concede cheap terms"),
      ("Effective price ≤ value","only with named protections","fwarns","Pursue with conditions","2 to 3 protections + fallbacks"),
      ("Effective price > value","on any realistic landing","fbads","Walk, or re-price","state the price cut needed")]
for i,(a,c,cls,v,sub) in enumerate(rows):
    y=y0+i*(rh+6)
    b.append(T(10,y+22,a,"ts tb")); b.append(T(10,y+38,c,"ts tm"))
    b.append(rect(cx[0],y,cw,rh,cls)); b.append(T(cx[0]+cw/2,y+23,v,"tb","middle")); b.append(T(cx[0]+cw/2,y+40,sub,"ts","middle"))
    b.append(rect(cx[1],y,cw,rh,'fbads')); b.append(T(cx[1]+cw/2,y+23,"Walk","tb","middle")); b.append(T(cx[1]+cw/2,y+40,"whatever else is offered","ts","middle"))
H=y0+3*(rh+6)+4
figs['m15-verdict']=('m15','<tr><th>Test</th><th>Verdict</th>',fig('m15f3',680,H,"Verdict matrix: pursue, pursue with conditions, or walk",
 "Rows compare effective price with value. Without a trigger: pursue, pursue with conditions, or walk or re-price. If a walk-away trigger is hit, the answer is walk in every row.",b,3,
 "The three verdicts. A walk-away trigger, fixed before negotiating, overrides the arithmetic in every row."))
json.dump({"%s|%s"%k:v for k,v in stats.items()},open('/tmp/figgen/stats.json','w'))
for k,(m,anchor,h) in figs.items(): open(os.path.join(OUT,k+'.html'),'w').write(h+"\n")
json.dump({k:[m,a] for k,(m,a,h) in figs.items()},open('/tmp/figgen/anchors.json','w'))
print(json.dumps({"%s|%s"%k:v for k,v in stats.items()}))
