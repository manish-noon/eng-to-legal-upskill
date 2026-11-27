LAB.coldread = async function(main) {
  labIntro(main, 'coldread');
  const cases = [
    {
      id: '08-tempus', label: 'Tempus · aircraft purchase',
      brief: 'You represent the buyer on closing day. All aircraft are at the delivery location. The seller wants its share transfer forms released before the escrow call so it can announce completion. An FAA search still shows a lender lien on one aircraft. The lender emailed “we expect to approve tomorrow.” Escrow has neither a discharge authority nor a signed release. Your client wants to preserve today’s close if it can take clean title to the whole fleet.',
      decision: 'Keep the share transfer forms in escrow. Positioning the aircraft solves only the location question. An expectation of lender approval gives escrow no authority to discharge the recorded lien. Do not authorize a partial release for the other aircraft.',
      provisions: [
        ['§4.4.1', 'all of the Aircraft are in position', 'Confirm the fleet is present. This is the first closing delivery.'],
        ['§4.4.5.1', 'irrevocably authorized to discharge the same', 'Escrow must confirm the specified registry searches and, for the outstanding lien, irrevocable authority and any applicable executed releases for contemporaneous filing.'],
        ['§4.4.5.2', 'concurrently with Seller’s instruction', 'The buyer’s release instruction belongs on the coordinated closing call.'],
        ['§7.4.1', 'Seller delivers possession of each Aircraft to Purchaser', 'Title and risk pass when the share forms and bills of sale have been released to their recipients and possession delivered. Location alone proves none of those releases.']
      ],
      action: 'Ask seller’s counsel to obtain the lender’s irrevocable authority and executed release where applicable. Have escrow verify the search results, release documents and coordinated delivery instructions on the call. Close today only if escrow can give the confirmations. Otherwise adjourn with signed papers held to order.',
      checks: ['I gave escrow an immediate instruction about the share forms.', 'I distinguished the lien search result from authority to discharge it.', 'I identified what must move together and what evidence would permit closing today.']
    },
    {
      id: '19-williams-sonoma', label: 'Williams-Sonoma · aircraft lease',
      brief: 'You advise the proposed lessee before signature. Finance has $987,000 of total authority for three full calendar months of guaranteed access. The forecast then falls to zero flight hours. The sponsor says, “We can just hand it back after month three.” No retirement event or mortgage default is expected. The business would accept fewer months if the entire commitment fits its authority.',
      decision: 'Withhold signature. Three full months of basic rent alone cost 3 × $375,000 = $1,125,000, already $138,000 above the entire mandate before operating expenses. The filed term is 36 months. An empty flight schedule gives finance no contractual exit under the identified termination terms.',
      provisions: [
        ['§2', '36 Months, unless earlier terminated', 'The three-month forecast does not set the lease term.'],
        ['§3(b)', '$375,000 per calendar month, payable in advance', 'Basic rent is monthly. Budget it even if utilization falls to zero.'],
        ['§1(c)', 'hangarage and insuring the Aircraft will be paid by Lessee', 'The net lease adds costs beyond basic rent.'],
        ['§15', 'under the Aircraft Mortgage acted on by the Bank', 'The lessee option here depends on a mortgage default acted on by the bank. The separate retirement provision has its own trigger and notice timing. Neither supplies the requested discretionary return.']
      ],
      action: 'Offer two full months at the filed monthly rate only with a signed fixed end date and a $987,000 aggregate ceiling covering rent, operating and return costs. Two months consume $750,000, leaving $237,000 for everything else. Finance must verify those costs or secure a binding cap before signature. If the lessor requires three full months, negotiate a lower all-in price or return to finance for authority.',
      checks: ['I quantified the three-month shortfall using the monthly rent.', 'I explained why returning the aircraft after three months would leave a contractual exposure.', 'My counterproposal specifies duration, total cost and who must verify any remaining exposure.']
    }
  ];
  const pick = el('select', {'aria-label':'Select public filing'}, cases.map(c=>el('option',{value:c.id},c.label)));
  const desk = el('div');
  main.append(answerLabel('Public filing',pick),desk);
  async function open() {
    const item = cases.find(c=>c.id===pick.value);
    desk.replaceChildren(el('p',{},'Loading the filing…'));
    const pane = await documentPane(item.id);
    if (pick.value!==item.id) return;
    const draft = readCaseDraft('coldread',item.id);
    const notes = el('textarea',{rows:4,required:true});
    const instruction = el('textarea',{rows:6,required:true});
    notes.value = draft.notes || '';
    instruction.value = draft.instruction || '';
    const review = el('section',{'aria-live':'polite'});
    const form = el('form',{class:'lab-form'},
      answerLabel('Record clause references and short exact excerpts supporting your decision.',notes),
      answerLabel('Write your instruction to the client. State the decision, your reasons and what to do next.',instruction),
      el('button',{type:'submit'},'Compare with model memo'));
    function showModel() {
      const saved = readCaseDraft('coldread',item.id);
      const boxes = item.checks.map(()=>el('input',{type:'checkbox'}));
      const done = el('p',{'role':'status'});
      function update() {
        const checks = boxes.map(box=>box.checked);
        const reviewed = checks.every(Boolean);
        saveCaseDraft('coldread',item.id,{checks,reviewed});
        const count = cases.filter(c=>readCaseDraft('coldread',c.id).reviewed).length;
        recordLab('coldread',count+' / 2 cases reviewed');
        done.textContent = count+' / 2 cases reviewed.';
      }
      boxes.forEach((box,i)=>{box.checked = !!saved.checks?.[i]; box.onchange = update;});
      review.replaceChildren(el('h2',{},'Model memo'),el('p',{},item.decision),
        ...item.provisions.map(([section,quote,meaning])=>el('div',{},evidence({section,quote}),el('p',{},meaning))),
        el('p',{},item.action),el('h3',{},'Assess your own instruction'),
        el('p',{},'Compare your reasoning with each point. Other instructions can meet the mandate. Tick each point your memo supports, revising your draft if needed.'),
        ...boxes.map((box,i)=>el('label',{},box,' '+item.checks[i])),done);
      done.textContent = cases.filter(c=>readCaseDraft('coldread',c.id).reviewed).length+' / 2 cases reviewed.';
    }
    form.oninput = ()=>saveCaseDraft('coldread',item.id,{notes:notes.value,instruction:instruction.value});
    form.onsubmit = event=>{
      event.preventDefault();
      for (const field of [notes,instruction]) {
        if (!field.value.trim()) {field.focus();return;}
      }
      saveCaseDraft('coldread',item.id,{notes:notes.value,instruction:instruction.value,revealed:true});
      showModel();
    };
    desk.replaceChildren(el('h2',{},'Hypothetical client mandate'),el('p',{class:'lede'},item.brief),
      el('div',{class:'split reading-desk'},pane,el('div',{},form,review)));
    if (draft.revealed) showModel();
  }
  pick.onchange = open;
  await open();
};
