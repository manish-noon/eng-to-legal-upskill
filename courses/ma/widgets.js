// Interactive calculators. Shared maths lives in CALC so labs use the same rules as the lessons.
const CALC={
  // claims: [{amt, month, type:'general'|'fundamental'|'specific'|'fraud'}]; pkg percentages are % of price.
  recover(pkg,price,claims){const dm=pkg.dm/100*price,basket=pkg.basket/100*price,cap=pkg.cap/100*price;const rows=[];let genTot=0,direct=0,fund=0;
    for(const c of claims){const r={...c,status:'',counted:0};
      if(c.type==='none'){r.status='Not covered by any SPA protection: buyer keeps it'}
      else if(c.type==='fraud'){r.status='Fraud: bypasses every limit';r.direct=c.amt}
      else if(c.type==='specific'){r.status='Specific indemnity: paid in full, outside basket and cap';r.direct=c.amt}
      else if(c.type==='fundamental'){r.status='Fundamental warranty: no basket, capped at price';r.direct=Math.max(0,Math.min(c.amt,price-fund));fund+=r.direct}
      else if(c.month>pkg.survival){r.status=`Out of time (surfaced month ${c.month}, limit ${pkg.survival})`}
      else if(c.amt<dm){r.status=`Below de minimis (${fmt(dm)})`}
      else{r.counted=c.amt;genTot+=c.amt;r.status='Counts toward basket'}
      direct+=r.direct||0;rows.push(r)}
    let sellerGen=0,basketNote='';
    if(genTot<=0)basketNote='No general claims qualify.';
    else if(genTot<basket||(pkg.btype==='deductible'&&genTot<=basket))basketNote=`Qualifying claims ${fmt(genTot)} do not clear the basket of ${fmt(basket)}: nothing recoverable.`;
    else if(pkg.btype==='deductible'){sellerGen=genTot-basket;basketNote=`Deductible basket: recover only the excess over ${fmt(basket)}.`}
    else{sellerGen=genTot;basketNote=`Tipping basket: once ${fmt(basket)} is reached, recover from the first dirham.`}
    let capNote='';if(sellerGen>cap){capNote=`Cap bites: ${fmt(sellerGen)} cut to ${fmt(cap)}.`;sellerGen=cap}
    let insurer=0;if(pkg.wi){const ret=pkg.ret/100*price,lim=pkg.lim/100*price;insurer=Math.min(Math.max(0,genTot-Math.max(ret,sellerGen)),lim)}
    const gross=claims.reduce((a,c)=>a+c.amt,0),seller=sellerGen+direct;return{rows,genTot,sellerGen,direct,seller,insurer,gross,kept:Math.max(0,gross-seller-insurer),basketNote,capNote}},
  // exact expected kept loss over all on/off combinations of independent risks
  expected(pkg,price,risks){let kept=0,seller=0,ins=0;const n=risks.length;for(let m=0;m<(1<<n);m++){let p=1;const cl=[];for(let i=0;i<n;i++){const on=m>>i&1;p*=on?risks[i].p:1-risks[i].p;if(on)cl.push({amt:risks[i].loss,month:risks[i].month,type:risks[i].type})}if(p===0)continue;const r=CALC.recover(pkg,price,cl);kept+=p*r.kept;seller+=p*r.seller;ins+=p*r.insurer}return{kept,seller,ins,gross:risks.reduce((a,r)=>a+r.p*r.loss,0)}},
  quant(a,q){const s=[...a].sort((x,y)=>x-y);if(!s.length)return null;const i=(s.length-1)*q,l=Math.floor(i),h=Math.ceil(i);return s[l]+(s[h]-s[l])*(i-l)},
  // dir=+1 when a higher number favours the buyer (cap, survival, escrow); -1 when lower favours the buyer (basket, de minimis)
  landing(p25,med,p75,score,dir,buyerOpen,sellerOpen){const s=Math.max(-2,Math.min(2,score));const toward=dir>0?(s>0?p75:p25):(s>0?p25:p75);let v=med+Math.abs(s)/2*(toward-med);if(buyerOpen!=null&&sellerOpen!=null&&!isNaN(buyerOpen)&&!isNaN(sellerOpen)){const lo=Math.min(buyerOpen,sellerOpen),hi=Math.max(buyerOpen,sellerOpen);v=Math.max(lo,Math.min(hi,v))}return v}
};
const FACTORS=[
 ['Competition','Bilateral: buyer is the only realistic exit','Auction with several credible bidders'],
 ["Seller's need to sell",'Distressed, deadline, or fund must exit','No pressure: can keep the business'],
 ['Warranty insurance','None: seller must stand behind warranties','W&I/RWI in place: seller cap near zero'],
 ['Diligence findings','Known red flags found','Clean diligence'],
 ['Seller continuity','Sellers leave with all the cash','Sellers roll over equity or stay as managers'],
 ['Buyer type','Disciplined financial buyer with alternatives','Strategic buyer that must have this asset'],
 ['Market cycle',"Buyer's market: few buyers, cheap targets","Seller's market: capital chasing deals"],
 ['Regulatory / timing risk','Low: quick clean close','High: seller demands certainty and prices delay']];
const numIn=(v,step='any',w)=>el('input',{type:'number',value:v,step,style:w?`width:${w}px`:null});
const lab=(t,i)=>el('label',{},t,i);

const WIDGETS={
  pricebridge(root){root.append(el('h4',{},'Price bridge: enterprise value to equity value'));
    const f={ev:numIn(100),debt:numIn(22),dl:numIn(3),cash:numIn(6),nwc:numIn(11),peg:numIn(12.5)};
    root.append(el('div',{class:'grid'},lab('Enterprise value (m)',f.ev),lab('Financial debt (m)',f.debt),lab('Debt-like items (m)',f.dl),lab('Cash (m)',f.cash),lab('Actual working capital at closing (m)',f.nwc),lab('Working capital peg (m)',f.peg)));
    const out=el('div');root.append(out);
    const draw=()=>{const v=k=>parseFloat(f[k].value)||0;const adj=v('nwc')-v('peg');const rows=[['Enterprise value',v('ev'),'tot'],['Less debt',-v('debt'),'neg'],['Less debt-like items',-v('dl'),'neg'],['Plus cash',v('cash'),''],[`Working capital ${adj>=0?'surplus':'shortfall'} vs peg`,adj,adj<0?'neg':'']];const eq=rows.reduce((a,r)=>a+r[1],0);rows.push(['Equity value (cheque to sellers)',eq,'tot']);const mx=Math.max(...rows.map(r=>Math.abs(r[1])),1);
      out.innerHTML='';const w=el('div',{class:'wf'});rows.forEach(r=>w.append(el('div',{},r[0]),el('div',{},el('div',{class:'b '+r[2],style:`width:${Math.abs(r[1])/mx*100}%`})),el('div',{class:'r',style:'text-align:right;font-variant-numeric:tabular-nums'},(r[1]<0?'−':'')+fmt(Math.abs(r[1]),2))));out.append(w,el('p',{class:'mut',style:'font-size:14px'},`Every unit moved between "debt-like" and "working capital" changes the cheque: debt-like items reduce price one for one, while working capital only matters relative to the peg. That is why these definitions are fought over.`))};
    Object.values(f).forEach(i=>i.addEventListener('input',draw));draw()},

  claimsim(root){root.append(el('h4',{},'Claim simulator: watch claims pass through the limits'));
    const f={price:numIn(76000000),dm:numIn(0.1,'0.05'),basket:numIn(1,'0.25'),btype:el('select',{},el('option',{value:'tipping'},'Tipping (first dirham)'),el('option',{value:'deductible'},'Deductible (excess only)')),cap:numIn(20,'5'),survival:numIn(18,'1'),wi:el('input',{type:'checkbox'}),ret:numIn(0.5,'0.25'),lim:numIn(20,'5')};
    root.append(el('div',{class:'grid'},lab('Price',f.price),lab('De minimis (% of price)',f.dm),lab('Basket (% of price)',f.basket),lab('Basket type',f.btype),lab('General cap (% of price)',f.cap),lab('Time limit (months)',f.survival)),
      el('div',{class:'grid'},el('label',{style:'flex-direction:row;align-items:center;gap:8px'},f.wi,'W&I insurance on'),lab('W&I retention (% of price)',f.ret),lab('W&I policy limit (% of price)',f.lim)));
    let claims=[{name:'Unpaid supplier invoice',amt:50000,month:3,type:'general'},{name:'Undisclosed tax penalty',amt:300000,month:9,type:'general'},{name:'IP licence breach',amt:600000,month:14,type:'general'}];
    const tb=el('tbody'),out=el('div');root.append(el('table',{},el('thead',{},el('tr',{},['Claim','Amount','Surfaces (month)','Type','What happens',''].map(h=>el('th',{},h)))),tb),el('button',{class:'sec',onclick:()=>{claims.push({name:'New claim',amt:200000,month:6,type:'general'});draw(true)}},'+ Add claim'),out);
    const pkg=()=>({dm:+f.dm.value||0,basket:+f.basket.value||0,btype:f.btype.value,cap:+f.cap.value||0,survival:+f.survival.value||0,wi:f.wi.checked,ret:+f.ret.value||0,lim:+f.lim.value||0});
    const draw=(rebuild)=>{const price=+f.price.value||0,r=CALC.recover(pkg(),price,claims);
      if(rebuild!==false){tb.innerHTML='';claims.forEach((c,i)=>{const n=el('input',{value:c.name,style:'width:190px'}),a=numIn(c.amt,'10000'),m=numIn(c.month,'1',70),t=el('select',{},['general','fundamental','specific','fraud','none'].map(x=>el('option',{value:x,selected:x===c.type?'':null},x)));n.oninput=()=>{c.name=n.value};a.oninput=()=>{c.amt=+a.value||0;draw(false)};m.oninput=()=>{c.month=+m.value||0;draw(false)};t.onchange=()=>{c.type=t.value;draw(false)};tb.append(el('tr',{},el('td',{},n),el('td',{},a),el('td',{},m),el('td',{},t),el('td',{class:'st'}),el('td',{},el('button',{class:'sec',onclick:()=>{claims.splice(i,1);draw(true)}},'×'))))})}
      $$('td.st',tb).forEach((td,i)=>td.textContent=r.rows[i].status);
      out.innerHTML='';out.append(el('p',{},r.basketNote+' '+r.capNote),el('div',{class:'grid'},el('div',{},el('div',{class:'mut'},'Total loss'),el('div',{class:'big'},fmt(r.gross))),el('div',{},el('div',{class:'mut'},'Seller pays'),el('div',{class:'big ok'},fmt(r.seller))),f.wi.checked?el('div',{},el('div',{class:'mut'},'Insurer pays'),el('div',{class:'big ok'},fmt(r.insurer))):null,el('div',{},el('div',{class:'mut'},'Buyer keeps'),el('div',{class:'big bad'},fmt(r.kept)))));
      if(f.wi.checked)out.append(el('p',{class:'mut',style:'font-size:14px'},'With W&I on, set the general cap to the seller\'s nominal cap (for example 0 to 1%). The policy answers for qualifying unknown breaches above the retention, up to its limit. Specific indemnities and known issues are never covered by the policy.'))};
    Object.values(f).forEach(i=>i.addEventListener('input',()=>draw(false)));draw(true)},

  landing(root){root.append(el('h4',{},'Landing calculator: precedent band + leverage'));
    const f={term:el('select',{},[['General cap (% of price)',1,10,15,25,100,10],['Basket (% of price)',-1,0.25,0.5,1,0.25,1.5],['Time limit (months)',1,12,18,24,36,12],['Escrow (% of price)',1,1,3,8,15,0],['De minimis (% of price)',-1,0.01,0.08,0.1,0,0.25]].map(o=>el('option',{value:JSON.stringify(o.slice(1))},o[0]))),p25:numIn(10),med:numIn(15),p75:numIn(25),bo:numIn(100),so:numIn(10)};
    root.append(el('div',{class:'grid'},lab('Term',f.term),lab('Precedent P25',f.p25),lab('Precedent median',f.med),lab('Precedent P75',f.p75),lab("Buyer's opening position",f.bo),lab("Seller's opening position",f.so)));
    const sels=FACTORS.map(([n,b,s])=>el('select',{},el('option',{value:1},'+1  '+b),el('option',{value:0,selected:''},' 0  Neutral / unknown'),el('option',{value:-1},'−1  '+s)));
    root.append(el('table',{},el('thead',{},el('tr',{},el('th',{},'Leverage factor (scored from the buyer\'s side)'),el('th',{},'Your read of this deal'))),el('tbody',{},FACTORS.map((x,i)=>el('tr',{},el('td',{},x[0]),el('td',{},sels[i]))))));
    const out=el('div');root.append(out);let dir=1;
    f.term.onchange=()=>{const[d,a,b,c,bo,so]=JSON.parse(f.term.value);dir=d;f.p25.value=a;f.med.value=b;f.p75.value=c;f.bo.value=bo;f.so.value=so;draw()};
    const draw=()=>{const raw=sels.reduce((a,s)=>a+ +s.value,0),s=Math.max(-2,Math.min(2,raw));const v=CALC.landing(+f.p25.value,+f.med.value,+f.p75.value,s,dir,+f.bo.value,+f.so.value);
      out.innerHTML='';out.append(el('div',{class:'grid'},el('div',{},el('div',{class:'mut'},'Raw factor sum'),el('div',{class:'big'},(raw>0?'+':'')+raw)),el('div',{},el('div',{class:'mut'},'Leverage score (clipped to ±2)'),el('div',{class:'big'},(s>0?'+':'')+s)),el('div',{},el('div',{class:'mut'},'Predicted landing'),el('div',{class:'big ok'},fmt(v,2)))),
      el('p',{class:'mut',style:'font-size:14px'},`${dir>0?'A higher number favours the buyer for this term':'A lower number favours the buyer for this term'}. The prediction starts at the precedent median and moves ${Math.abs(s)/2*100}% of the way toward the ${s>0?"buyer's":s<0?"seller's":'neither'} side of the band, then is clamped between the two opening positions.`))};
    [...Object.values(f),...sels].forEach(i=>i.addEventListener('input',draw));draw()},

  exposure(root,preset){root.append(el('h4',{},'Kept-risk simulator: what the buyer still carries, and the effective price'));
    const P0=preset||{price:76000000,value:82000000,costs:900000,
      A:{name:'Seller\'s draft',dm:0.25,basket:1,btype:'deductible',cap:10,survival:12,wi:false,ret:0.5,lim:20},
      B:{name:'Predicted landing',dm:0.1,basket:1,btype:'tipping',cap:20,survival:18,wi:false,ret:0.5,lim:20},
      risks:[{name:'VAT reassessment',p:0.3,loss:1200000,month:20,type:'general'},{name:'Key customer leaves on change of control',p:0.25,loss:3000000,month:4,type:'general'},{name:'IP licence breach',p:0.2,loss:600000,month:10,type:'general'},{name:'Unpaid supplier invoice',p:0.9,loss:50000,month:3,type:'general'}]};
    const g={price:numIn(P0.price),value:numIn(P0.value),costs:numIn(P0.costs)};
    root.append(el('div',{class:'grid'},lab('Headline price',g.price),lab('Value of the business to the buyer (standalone + synergies − integration)',g.value),lab('Deal costs (fees, W&I premium, filing, delay)',g.costs)));
    const mkPkg=p=>{const f={name:el('input',{value:p.name}),dm:numIn(p.dm,'0.05',80),basket:numIn(p.basket,'0.25',80),btype:el('select',{},['tipping','deductible'].map(x=>el('option',{selected:x===p.btype?'':null},x))),cap:numIn(p.cap,'5',80),survival:numIn(p.survival,'1',80),wi:el('input',{type:'checkbox'}),ret:numIn(p.ret,'0.25',80),lim:numIn(p.lim,'5',80)};f.wi.checked=p.wi;return f};
    const A=mkPkg(P0.A),B=mkPkg(P0.B);const rowsDef=[['Package name','name'],['De minimis %','dm'],['Basket %','basket'],['Basket type','btype'],['General cap %','cap'],['Time limit (months)','survival'],['W&I insurance','wi'],['W&I retention %','ret'],['W&I limit %','lim']];
    root.append(el('table',{},el('thead',{},el('tr',{},el('th',{},'Term'),el('th',{},'Package A'),el('th',{},'Package B'))),el('tbody',{},rowsDef.map(([t,k])=>el('tr',{},el('td',{},t),el('td',{},A[k]),el('td',{},B[k]))))));
    let risks=P0.risks.map(r=>({...r}));const tb=el('tbody');root.append(el('table',{},el('thead',{},el('tr',{},['Risk','Probability','Loss if it happens','Surfaces (month)','Protection type',''].map(h=>el('th',{},h)))),tb),el('button',{class:'sec',onclick:()=>{if(risks.length<12){risks.push({name:'New risk',p:0.2,loss:500000,month:8,type:'general'});draw(true)}}},'+ Add risk'));
    const out=el('div');root.append(out);
    const rd=f=>({dm:+f.dm.value||0,basket:+f.basket.value||0,btype:f.btype.value,cap:+f.cap.value||0,survival:+f.survival.value||0,wi:f.wi.checked,ret:+f.ret.value||0,lim:+f.lim.value||0});
    const draw=rebuild=>{if(rebuild){tb.innerHTML='';risks.forEach((r,i)=>{const n=el('input',{value:r.name,style:'width:230px'}),p=numIn(r.p,'0.05',80),l=numIn(r.loss,'50000'),m=numIn(r.month,'1',70),t=el('select',{},['general','fundamental','specific','fraud','none'].map(x=>el('option',{selected:x===r.type?'':null},x)));n.oninput=()=>r.name=n.value;p.oninput=()=>{r.p=Math.max(0,Math.min(1,+p.value||0));draw()};l.oninput=()=>{r.loss=+l.value||0;draw()};m.oninput=()=>{r.month=+m.value||0;draw()};t.onchange=()=>{r.type=t.value;draw()};tb.append(el('tr',{},el('td',{},n),el('td',{},p),el('td',{},l),el('td',{},m),el('td',{},t),el('td',{},el('button',{class:'sec',onclick:()=>{risks.splice(i,1);draw(true)}},'×'))))})}
      const price=+g.price.value||0,val=+g.value.value||0,costs=+g.costs.value||0;const ea=CALC.expected(rd(A),price,risks),eb=CALC.expected(rd(B),price,risks);
      const col=(f,e)=>{const eff=price+e.kept+costs,gap=val-eff;return el('div',{class:'card'},el('b',{},f.name.value),el('div',{class:'mut'},'Expected loss before protection: '+fmt(e.gross)),el('div',{},'Recovered from seller: '+fmt(e.seller)+(f.wi.checked?' · from insurer: '+fmt(e.ins):'')),el('div',{},'Kept by buyer: ',el('b',{class:'bad'},fmt(e.kept)),` (${fmt(e.kept/price*100,2)}% of price)`),el('div',{},'Effective price: ',el('b',{},fmt(eff))),el('div',{class:gap>=0?'ok':'bad',style:'font-weight:700;margin-top:6px'},gap>=0?`Value exceeds effective price by ${fmt(gap)}: pursue on these terms`:`Effective price exceeds value by ${fmt(-gap)}: re-price or walk`))};
      out.innerHTML='';out.append(el('div',{class:'cards'},col(A,ea),col(B,eb)),el('p',{class:'mut',style:'font-size:14px'},`Moving from A to B is worth ${fmt(ea.kept-eb.kept)} to the buyer in expected terms. That number is what the buyer can rationally trade away elsewhere (price, speed, certainty) to get B. Probabilities are your estimates: change them and see whether the advice flips. If it flips easily, say so in the memo.`))};
    [...Object.values(g),...Object.values(A),...Object.values(B)].forEach(i=>i.addEventListener('input',()=>draw()));draw(true)}
};
