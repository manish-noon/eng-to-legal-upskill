// The two reading desks share the browser's existing exportable draft store.
function readCaseDraft(desk, id) {
  return LS.get('av_saved', {})[desk]?.[id] || {};
}

function saveCaseDraft(desk, id, changes) {
  const saved = LS.get('av_saved', {});
  saved[desk] ||= {};
  saved[desk][id] = {...saved[desk][id], ...changes};
  LS.set('av_saved', saved);
}

function proofText(text) {
  return text.toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
}

function containsCitation(source, field, answer) {
  const excerpt = proofText(answer);
  const words = excerpt.match(/[\p{L}\p{N}]+/gu) || [];
  const text = proofText(source);
  const scope = field.scope ? text.indexOf(proofText(field.scope)) : 0;
  if(scope < 0) return false;
  const start = text.indexOf(proofText(field.start), scope);
  const end = text.indexOf(proofText(field.end), start + proofText(field.start).length);
  if(start < 0 || end <= start || words.length < 5 || words.length > 40) return false;
  const passage = text.slice(start,end);
  const index = passage.indexOf(excerpt);
  if(index < 0 || !excerpt.includes(field.core)) return false;
  const inWord = char=>!!char && /[\p{L}\p{N}]/u.test(char);
  return !(inWord(passage[index-1]) && inWord(excerpt[0])) &&
    !(inWord(passage[index+excerpt.length]) && inWord(excerpt.at(-1)));
}

LAB.fileread = async function(main) {
  labIntro(main, 'fileread');
  const response = await fetch('data/reading-cases.json');
  if (!response.ok) throw new Error('Reading cases unavailable');
  const cases = await response.json();
  const pick = el('select', {'aria-label':'Agreement to read'},
    cases.map(c=>el('option',{value:c.id},c.label)));
  const desk = el('div');
  main.append(el('div',{class:'controls'},answerLabel('Agreement',pick)),desk);

  async function openCase() {
    const item = cases.find(c=>c.id === pick.value);
    desk.replaceChildren(el('p',{},'Loading the filing…'));
    const pane = await documentPane(item.id);
    if (pick.value !== item.id) return;
    const source = pane.querySelector('.doc').textContent;
    const draft = readCaseDraft('fileread',item.id);
    const inputs = item.questions.map((question,index)=>{
      const input = question.choices ? selector([...question.choices].sort()) : el('input',{required:true,type:'number',step:'any'});
      input.value = draft.answers?.[index] || '';
      return input;
    });
    const proof = el('textarea',{required:true,rows:3});
    proof.value = draft.citation || '';
    const location = selector(item.proof.locations);
    location.value = draft.location || '';
    const memo = el('textarea',{required:true,rows:3});
    memo.value = draft.memo || '';
    const result = el('div',{'aria-live':'polite'});
    const form = el('form',{class:'lab-form'},
      ...inputs.map((input,i)=>answerLabel(item.questions[i].prompt,input)),
      answerLabel('Which provision contains your evidence?',location),
      answerLabel(item.proof.prompt+' Use 5–40 consecutive words from the filing.',proof),
      answerLabel('Your instruction to the client. What would you do now, and what still needs evidence?',memo),
      el('button',{type:'submit'},'Check against the filing'), result);
    function save() {
      saveCaseDraft('fileread',item.id,{answers:inputs.map(input=>input.value),citation:proof.value,location:location.value,memo:memo.value});
    }
    form.oninput = ()=>{save(); result.replaceChildren();};
    form.onsubmit = event=>{
      event.preventDefault();
      save();
      const checks = item.questions.map((q,i)=>q.choices ? inputs[i].value === q.value : Number(inputs[i].value) === q.value);
      const cited = location.value===item.proof.locator && containsCitation(source,item.proof,proof.value);
      const total = checks.filter(Boolean).length + Number(cited);
      const max = checks.length + 1;
      result.replaceChildren(el('h3',{},total+' / '+max+' objective checks'));
      item.questions.forEach((q,i)=>result.append(
        el('p',{class:checks[i]?'ok':'bad'},(checks[i]?'Correct. ':'Review. ')+q.reason),evidence(q)));
      result.append(el('p',{class:cited?'ok':'bad'},cited?'Excerpt found in the requested passage.':'Check the provision, then copy a complete phrase that includes the requested operative words.'),evidence(item.proof),
        el('h3',{},'Compare your instruction'),el('p',{},item.memo),
        el('small',{},'The excerpt check verifies its location. Compare its meaning and your written advice with the model.'));
      if(total===max) saveCaseDraft('fileread',item.id,{passed:true});
      const passed = cases.filter(c=>readCaseDraft('fileread',c.id).passed).length;
      recordLab('fileread',passed+' / '+cases.length+' files');
    };
    desk.replaceChildren(el('p',{class:'lede'},item.brief),el('div',{class:'split reading-desk'},pane,form));
  }
  main.append(el('p',{},el('a',{href:'#/lab/coldread'},'Next: take the client call on a fresh agreement →')));
  pick.onchange = openCase;
  await openCase();
};

LAB.markup = async function(main) {
  labIntro(main,'markup');
  const response = await fetch('data/negotiation-files.json');
  if(!response.ok) throw new Error('Negotiation files unavailable');
  const files = await response.json();
  const pick = el('select',{'aria-label':'Negotiation file'},files.map(f=>el('option',{value:f.id},f.name)));
  const work = el('div');
  main.append(el('p',{},'These practice files are fictional. Give your advice on the opening paper before you see what came back.'),
    el('div',{class:'controls'},answerLabel('File',pick)),work);
  function draw() {
    const file = files.find(f=>f.id===pick.value);
    const draft = readCaseDraft('markup',file.id);
    const before = el('section',{class:'prose'},el('h2',{},'Opening paper'),el('p',{},file.mandate),
      el('h3',{},'Draft clause'),el('blockquote',{class:'clause'},file.draft),
      el('h3',{},'Proposed change'),el('p',{},el('del',{},file.old),' → ',el('ins',{},file.new)),
      el('h3',{},'Reviewer’s comment'),el('p',{},file.note));
    const guess = selector(file.forecast), advice = el('textarea',{required:true,rows:3});
    guess.value = draft.guess || '';
    advice.value = draft.advice || '';
    const forecast = el('form',{class:'lab-form'},el('h2',{},'Advise on the markup'),
      answerLabel('Which landing would you take into the next call?',guess),
      answerLabel('Name the leverage fact, a fallback and the document or evidence that would make it work.',advice));
    const saveForecast = ()=>saveCaseDraft('markup',file.id,{guess:guess.value,advice:advice.value});
    forecast.oninput = saveForecast;
    work.replaceChildren(el('div',{class:'split reading-desk'},before,forecast));
    if(!draft.revealed) {
      forecast.append(el('button',{type:'submit'},'Open the later file'));
      forecast.onsubmit = event=>{
        event.preventDefault();saveForecast();saveCaseDraft('markup',file.id,{revealed:true});draw();
        work.querySelector('.later-file').focus();
      };
      return;
    }
    guess.disabled = advice.disabled = true;
    const later = el('section',{class:'prose later-file',tabindex:-1},el('h2',{},'The later file'),
      el('p',{},file.compare),el('blockquote',{class:'clause'},file.final),el('p',{},file.schedule));
    const amount = el('input',{required:true,type:'number',step:'any'}), action = selector([...file.action].sort());
    amount.value = draft.amount || '';
    action.value = draft.action || '';
    const feedback = el('div',{'aria-live':'polite'});
    const check = el('form',{class:'lab-form'},el('h2',{},'Read back the result'),answerLabel(file.question,amount),
      answerLabel('Which instruction fits the actual paper and the client’s mandate?',action),
      el('button',{type:'submit'},'Check the outcome'),feedback);
    check.oninput = ()=>{saveCaseDraft('markup',file.id,{amount:amount.value,action:action.value});feedback.replaceChildren();};
    check.onsubmit = event=>{
      event.preventDefault();
      const rightAmount = Number(amount.value)===file.answer, rightAction = action.value===file.decision;
      const passed = rightAction && rightAmount;
      saveCaseDraft('markup',file.id,{amount:amount.value,action:action.value,passed:passed||!!readCaseDraft('markup',file.id).passed});
      feedback.replaceChildren(el('h3',{},(Number(rightAmount)+Number(rightAction))+' / 2 objective checks'),
        el('p',{class:rightAmount?'ok':'bad'},file.working),el('p',{class:rightAction?'ok':'bad'},file.model),
        el('p',{},'Compare this with your opening prediction. Which word, event or missing document changed your advice?'));
      const count = files.filter(f=>readCaseDraft('markup',f.id).passed).length;
      recordLab('markup',count+' / '+files.length+' files');
    };
    work.append(el('div',{class:'split reading-desk'},later,check));
  }
  pick.onchange = draw;
  draw();
};
