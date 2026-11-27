function cash(value) {
  return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(value);
}
function riskCalculator(container) {
  const fields = [
    ['price','Price or PV of rent',900000], ['costs','Other PV costs',35000],
    ['probability','Loss probability (%)',25], ['loss','Loss if it occurs',400000],
    ['recovery','Collectible in that state',160000], ['ceiling','Value ceiling',1000000]
  ];
  const inputs={}, form=el('div',{class:'lab-form'});
  const grid=el('div',{class:'risk-inputs'}),result=el('div',{class:'calc-result','aria-live':'polite'});
  for(const [key,label,value] of fields){
    const input=el('input',{type:'number',min:0,max:key==='probability'?100:null,step:'any',value});
    inputs[key]=input;
    grid.append(el('label',{},el('span',{},label),input));
  }
  function update(){
    if(Object.values(inputs).some(i=>!i.value||!i.validity.valid)){
      result.textContent='Enter nonnegative amounts and a probability from 0 to 100.';return;
    }
    const data=Object.fromEntries(Object.entries(inputs).map(([k,i])=>[k,Number(i.value)]));
    const v=priceExposure(data);
    result.replaceChildren(el('b',{},'Effective cost '+cash(v.effective)),
      el('p',{},'Tail loss after recovery '+cash(v.tail)+' × '+data.probability+'% = expected kept risk '+cash(v.kept)+'.'),
      el('p',{},'Maximum price '+cash(v.breakEven)+'. '+(v.headroom>=0?'Headroom ':'Price cut needed ')+cash(Math.abs(v.headroom))+'.'));
  }
  form.addEventListener('input',update);form.append(grid,result);container.append(form);update();
}
const WIDGETS={exposure:riskCalculator};

// The rent clock is longer when the airline has more bargaining power.
WIDGETS.rentLanding=async function(container){
  const rows=await publicExhibits();
  const observations=rows.flatMap(r=>r.fields.filter(f=>f.metric==='rentGrace').map(f=>Number(f.value)));
  if(observations.length<4){container.textContent='The evidence set is too small for a numerical band.';return;}
  const factors=['Competing aircraft or placements','Scarcity of the required slot','Funding certainty','Closing timetable','Control of the draft'];
  const inputs=factors.map(()=>el('select',{},el('option',{value:0},'Balanced or unknown'),el('option',{value:1},'Airline advantage (+1)'),el('option',{value:-1},'Lessor advantage (−1)')));
  const result=el('output',{class:'calc-result','aria-live':'polite'});
  const grid=el('div',{class:'risk-inputs'},factors.map((f,i)=>answerLabel(f,inputs[i])));
  function update(){
    const total=inputs.reduce((sum,s)=>sum+Number(s.value),0), score=Math.max(-2,Math.min(2,total));
    const median=quartile(observations,.5),edge=quartile(observations,score>0?.75:.25);
    const estimate=median+Math.abs(score)/2*(edge-median);
    const bounded=Math.max(3,Math.min(7,estimate));
    result.textContent='Score '+total+' → clipped '+score+' · continuous estimate '+bounded+' business days. State which whole-day outcome and exceptions you would propose.';
  }
  container.append(el('h4',{},'Negotiate the rent clock'),el('p',{},'Assume a three-day lessor opening and a seven-day airline opening. Change one independent fact at a time. The calculation uses the four observed terms in Figure 12.1.'),grid,result);
  grid.onchange=update;update();
};
