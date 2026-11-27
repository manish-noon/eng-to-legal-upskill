function labIntro(main,id){
  const [,title,description]=LABS.find(l=>l[0]===id);
  main.append(el('div',{class:'kicker'},title.split(' · ')[0]),el('h1',{},title.split(' · ')[1]),el('p',{class:'lede'},description));
}
function recordLab(id,message){P.labs[id]=message;saveP();renderSide();}
function selector(options){
  return el('select',{required:true},el('option',{value:''},'Choose an answer'),options.map(s=>el('option',{value:s},s)));
}
function answerLabel(title,input){return el('label',{},el('span',{},title),input);}
function evidence(field){
  return el('div',{class:'lab-result'},el('b',{},field.section),el('q',{},field.quote));
}
async function documentPane(id){
  const box=el('div'), viewer=el('div',{class:'doc',tabindex:0,'aria-label':'Exhibit text'});
  const res=await fetch('docs/'+id+'.txt');
  if(!res.ok)throw new Error('Exhibit unavailable');
  const source=await res.text();
  const search=el('input',{type:'search','aria-label':'Find text in exhibit',placeholder:'Find a word or phrase'});
  const status=el('span',{class:'mut','aria-live':'polite'});
  let previous='',marks=[],current=-1;
  function find(){
    const word=search.value.trim();
    if(word!==previous){
      previous=word;marks=[];current=-1;viewer.replaceChildren();
      const lower=source.toLowerCase();let start=0,hit;
      while(word && marks.length<1200 && (hit=lower.indexOf(word.toLowerCase(),start))>=0){
        const mark=el('mark',{},source.slice(hit,hit+word.length));
        viewer.append(source.slice(start,hit),mark);marks.push(mark);start=hit+word.length;
      }
      viewer.append(source.slice(start));
    }
    if(marks.length){current=(current+1)%marks.length;marks[current].scrollIntoView({block:'nearest'});}
    status.textContent=marks.length?(current+1)+' / '+marks.length:(word?'No matches':'');
  }
  search.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();find();}};
  viewer.textContent=source;
  box.append(el('div',{class:'controls'},search,el('button',{class:'sec',onclick:find},'Find next'),status),viewer);
  return box;
}
function showResults(target,row,answers,marks){
  target.replaceChildren(el('h3',{},marks.filter(Boolean).length+' / '+marks.length+' correct'));
  row.fields.forEach((f,i)=>target.append(el('p',{class:marks[i]?'ok':'bad'},(marks[i]?'Correct. ':'Review. ')+f.prompt+' '+f.value),evidence(f)));
}
const LAB={
  async extract(main){
    labIntro(main,'extract');
    const rows=await publicExhibits();
    const pick=el('select',{'aria-label':'Exhibit'},rows.map(r=>el('option',{value:r.id},r.id.slice(0,2)+' · '+r.name)));
    const desk=el('div',{class:'split'});
    main.append(el('div',{class:'controls'},el('b',{},'Exhibit'),pick),desk);
    async function draw(){
      const row=rows.find(r=>r.id===pick.value);
      desk.replaceChildren(el('p',{class:'mut'},'Loading exhibit…'));
      const pane=await documentPane(row.id);
      if(row.id!==pick.value)return;
      const inputs=row.fields.map(f=>selector([...f.choices].sort((a,b)=>a.localeCompare(b))));
      const results=el('div',{'aria-live':'polite'});
      const form=el('form',{class:'lab-form'},el('div',{class:'kicker'},row.kind),el('h2',{},'Extract the terms'),
        ...inputs.map((s,i)=>answerLabel(row.fields[i].prompt,s)),el('button',{type:'submit'},'Grade extraction'),results);
      form.onsubmit=e=>{e.preventDefault();const a=inputs.map(s=>s.value),marks=gradeExtraction(row,a);
        showResults(results,row,a,marks);recordLab('extract',Object.keys(LS.get('av_graded',{})).length+' graded');};
      desk.replaceChildren(pane,el('div',{class:'sticky'},form));
    }
    pick.onchange=draw;await draw();
  },
  async errors(main){
    labIntro(main,'errors');
    const claims=[
      ['The buyer signs the acceptance certificate after the technical acceptance process succeeds.','Supported','8.3','Upon successful completion of the Technical Acceptance Process'],
      ['Signing the certificate itself transfers title even if the balance is outstanding.','Contradicted','9.2.2','pass to the Buyer contemporaneously with the delivery by the Seller to the Buyer of such Bill of Sale'],
      ['Acceptance waives the right to revoke acceptance, including for reasons unknown when signed.','Supported','8.4','to revoke acceptance of the Aircraft for any reason, whether known or unknown'],
      ['The filing establishes a 36-month warranty period under the general warranty clause.','Unverified','12.1.3','will be limited to those defects that [***]']
    ];
    const inputs=claims.map(()=>selector(['Supported','Contradicted','Unverified']));
    const out=el('div',{'aria-live':'polite'});
    const form=el('form',{class:'lab-form'},el('h2',{},'Airbus / JetBlue'),el('p',{},'Distinguish a false inference from a claim the public text cannot resolve.'),
      ...claims.map((c,i)=>answerLabel(c[0],inputs[i])),el('button',{},'Check the summary'),out);
    form.onsubmit=e=>{e.preventDefault();let count=0;out.replaceChildren();claims.forEach(([claim,value,section,quote],i)=>{
      const ok=inputs[i].value===value;count+=Number(ok);out.append(el('p',{class:ok?'ok':'bad'},(ok?'Correct. ':'Review. ')+claim+' '+value+'.'),evidence({section,quote}));});recordLab('errors',count+' / 4');};
    main.append(el('div',{class:'split'},await documentPane('01-jetblue-a320'),el('div',{class:'sticky'},form)));
  },
  async explorer(main){
    labIntro(main,'explorer');const count=Object.keys(LS.get('av_graded',{})).length;
    if(count<4){main.append(el('p',{},'You have graded '+count+' of four required exhibits. Compare different aircraft and counterparties.'),el('a',{href:'#/lab/extract'},'Open the clause hunt →'));return;}
    const rows=await publicExhibits(),pick=el('select',{'aria-label':'Document family'},['All families',...new Set(rows.map(r=>r.kind))].map(t=>el('option',{},t)));
    const out=el('div');
    function compare(){
      const cohort=rows.filter(r=>pick.selectedIndex===0||r.kind===pick.value);
      const sample=cohort.flatMap(r=>r.fields.filter(f=>f.metric==='rentGrace').map(f=>({row:r,field:f})));
      out.replaceChildren(el('h2',{},'Ordinary periodic rent default'),
        el('p',{},'Business days from due date to the initial nonpayment threshold. Excludes technical-transfer exceptions and notice-based clocks. Only comparable disclosed terms enter the calculation.'));
      const v=sample.map(x=>Number(x.field.value));
      out.append(el('div',{class:'calc-result'},v.length>=4?'n = '+v.length+' · P25 '+quartile(v,.25)+' · median '+quartile(v,.5)+' · P75 '+quartile(v,.75)+' business days':'n = '+v.length+' · too few for a band. Widen the family filter or use a scenario.'));
      sample.forEach(({row,field})=>out.append(el('details',{},el('summary',{},row.name+' · '+field.value+' business days'),evidence(field))));
      out.append(el('h2',{},'Exhibits in this selection'));
      cohort.forEach(r=>out.append(el('details',{},el('summary',{},r.name),...r.fields.map(f=>el('div',{},el('p',{},f.prompt+' '+f.value),evidence(f))))));
      recordLab('explorer','Viewed');
    }
    main.append(el('div',{class:'controls'},el('b',{},'Family'),pick),out);pick.onchange=compare;compare();
  },
  async landing(main){
    labIntro(main,'landing');
    const rows=(await publicExhibits()).filter(r=>r.fields.some(f=>f.metric==='rentGrace'));
    const pick=el('select',{'aria-label':'Withheld agreement'},rows.map(r=>el('option',{value:r.id},r.name)));
    const out=el('div');
    function draw(){
      const selected=rows.find(r=>r.id===pick.value),field=selected.fields.find(f=>f.metric==='rentGrace');
      const comps=rows.filter(r=>r!==selected);
      const guess=el('input',{type:'number',min:0,max:365,required:true,step:1}),reason=el('textarea',{required:true});
      const result=el('div',{'aria-live':'polite'});
      const form=el('form',{class:'lab-form'},answerLabel('Predict the basic rent clock in business days from the due date',guess),
        answerLabel('Which part of your prediction depends on leverage the filing cannot show?',reason),el('button',{},'Reveal filed term'),result);
      form.onsubmit=e=>{e.preventDefault();result.replaceChildren(el('h3',{},'Filed threshold · '+field.value+' business days'),evidence(field),
        el('p',{},'Absolute difference: '+Math.abs(Number(guess.value)-Number(field.value))+' business days. Read the qualifications in the provision before using the number.'));recordLab('landing','Predicted');};
      out.replaceChildren(el('p',{},'You are advising the airline on '+selected.name+'. Estimate the ordinary periodic rent nonpayment trigger. A longer clock favours the airline. The other observations are a thin reference set.'),
        el('ul',{},comps.map(r=>el('li',{},r.name+' · '+r.fields.find(f=>f.metric==='rentGrace').value+' business days'))),form);
    }
    main.append(pick,out);pick.onchange=draw;draw();
  },
  exposure(main){
    labIntro(main,'exposure');main.append(el('p',{},'Use dollars measured at one valuation date. Enter recovery conditional on the loss and collection. The model has one loss state and one no-loss state. Hard stops are a separate decision.'));
    riskCalculator(main);
    main.addEventListener('input',()=>recordLab('exposure','Modelled'),{once:true});
  }
};

const MANDATES=[
  {title:'The spare airframe',description:'Used purchase. Inspection and lien releases are complete. A parts shortfall can cost $360,000. A solvent seller funds $120,000 of that loss through escrow. The buyer puts the chance of the shortfall at 25%. All sums are present dollars.',
    price:4850000,costs:90000,loss:360000,recovery:120000,probability:25,ceiling:5100000,
    position:'The buyer has an alternative with equivalent verified value. The board accepts the full downside and has cash for it.',verdict:'Sign',why:'The $240,000 downside is funded. Expected kept risk is $60,000. Current terms leave $100,000 of headroom.'},
  {title:'The bridge lease',description:'Operating lease. The airline has a credible competing offer. Its non-cancellable rent has present value of $7.8m. Expected return-condition loss must be priced separately. There is a 40% chance of a $750,000 invoice, with $250,000 collectible from eligible reserves in that state.',
    price:7800000,costs:140000,loss:750000,recovery:250000,probability:40,ceiling:8070000,
    position:'The lessor can authorise a $90,000 present-value rent credit. The client accepts the tail if the ceiling is met. The reserve payments are already in the base package.',verdict:'Negotiate',why:'Expected kept risk is $200,000. Effective cost exceeds the ceiling by $70,000. Require at least that much unconditional present-value credit. The available $90,000 is enough.'},
  {title:'The encumbered delivery',description:'Finance lease. Title sits with a financing vehicle. A prior creditor has refused to release its interest or consent to quiet enjoyment. The operator will lose its route if the aircraft is taken. The ordinary equipment loss model below excludes that title problem.',
    price:6000000,costs:110000,loss:550000,recovery:350000,probability:15,ceiling:6350000,
    position:'Board veto: no closing without the creditor protection. Counsel confirms it cannot be obtained by the final slot date. A price discount cannot waive this mandate.',verdict:'Walk',why:'Ordinary expected kept risk is $30,000 and the arithmetic leaves $210,000. The unresolved superior interest breaches a non-waivable mandate.'}
];
LAB.dealdesk=function(main){
  labIntro(main,'dealdesk');main.append(el('p',{},'These are synthetic mandates. Use the same valuation date for every amount. Make the commercial call before reading the model memo.'));
  const pick=el('select',{'aria-label':'Mandate'},MANDATES.map((c,i)=>el('option',{value:i},c.title)));
  const out=el('div');main.append(pick,out);
  function draw(){
    const c=MANDATES[Number(pick.value)], expected=priceExposure(c);
    const kept=el('input',{type:'number',min:0,required:true}),maximum=el('input',{type:'number',min:0,required:true});
    const verdict=selector(['Sign','Negotiate','Walk']),reason=el('textarea',{required:true});
    const result=el('div',{'aria-live':'polite'});
    const form=el('form',{class:'lab-form'},answerLabel('Probability-weighted kept loss (USD)',kept),answerLabel('Break-even base price or rent PV (USD)',maximum),
      answerLabel('Decision on current paper',verdict),answerLabel('Instruction to the deal team: condition, trade, or veto',reason),el('button',{},'Check mandate'),result);
    form.onsubmit=e=>{e.preventDefault();const checks=[Number(kept.value)===expected.kept,Number(maximum.value)===expected.breakEven,verdict.value===c.verdict];
      result.replaceChildren(el('h3',{},c.verdict+' · '+checks.filter(Boolean).length+' / 3'),
        el('p',{},c.why),el('p',{},'Break-even base amount '+cash(expected.breakEven)+'; effective cost '+cash(expected.effective)+'.'),
        el('p',{},'Compare your written instruction with the model. Only the two amounts and the decision are scored.'));
      const saved=LS.get('av_saved',{});saved[c.title]={kept:kept.value,maximum:maximum.value,verdict:verdict.value,memo:reason.value};LS.set('av_saved',saved);
      recordLab('dealdesk',MANDATES.filter(m=>saved[m.title]).length+' / 3 cases');};
    const saved=LS.get('av_saved',{})[c.title];if(saved){kept.value=saved.kept;maximum.value=saved.maximum;verdict.value=saved.verdict;reason.value=saved.memo;}
    out.replaceChildren(el('section',{class:'prose'},el('h2',{},c.title),el('p',{},c.description),el('p',{},c.position),
      el('table',{},el('tbody',{},[['Base amount',c.price],['Other transaction costs',c.costs],['Client value ceiling',c.ceiling]].map(([t,v])=>el('tr',{},el('th',{},t),el('td',{},cash(v))))))),form);
  }
  pick.onchange=draw;draw();
};
LAB.issues=async function(main){
  labIntro(main,'issues');
  const draft=el('textarea',{required:true,rows:10});draft.value=LS.get('av_saved',{}).issues||'';
  const output=el('div');
  const form=el('form',{class:'lab-form'},el('h2',{},'Act for the airframe buyer'),el('p',{},'Use the Baltia / Kalitta agreement. For three issues, record the clause, current allocation, requested change, fallback and evidence needed before release.'),
    answerLabel('Your issues list',draft),el('button',{},'Compare with model list'),output);
  draft.oninput=()=>{let saved=LS.get('av_saved',{});saved.issues=draft.value;LS.set('av_saved',saved);};
  form.onsubmit=e=>{e.preventDefault();output.replaceChildren(el('h3',{},'Model negotiation notes'),
    el('p',{},'Recitals and §1(b). The defined asset is an airframe without engines. The as-is wording still contains a landing-gear inspection-life promise. Ask for records demonstrating that life and an express cash adjustment for any deficit. If the seller declines, cap your bid at the evidenced residual value.'),
    el('p',{},'§3(b). Technical acceptance has already occurred. The waiver retains protection for intervening damage or a changed condition before delivery. Require a dated reinspection and a records comparison before releasing funds. An agreed condition exception needs a remedy and a deadline.'),
    el('p',{},'§§1(c), 2(a), 4. The price is wired to the seller while sale instruments are held by an escrow agent. Align cleared funds, lien releases and instrument release. If simultaneous escrow is refused, quantify cash exposed during the gap and get explicit authority to take it.'),
    el('a',{href:'#/lab/markup'},'Work a negotiation file →'),el('p',{},'Use the same record structure on your own agreement.'),el('a',{href:'../../build/aviation/templates/landing-memo.md',download:'aircraft-landing-memo.md'},'Download the decision memo template'));recordLab('issues','Draft compared');};
  main.append(el('div',{class:'split'},await documentPane('05-baltia-kalitta'),el('div',{class:'sticky'},form)));
};
