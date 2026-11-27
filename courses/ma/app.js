// Core engine: routing, progress, module loading, quizzes, drill.
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const el=(tag,attrs={},...kids)=>{const e=document.createElement(tag);for(const[k,v]of Object.entries(attrs)){if(k==='class')e.className=v;else if(k==='html')e.innerHTML=v;else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);else if(v!==null&&v!==undefined&&v!==false)e.setAttribute(k,v)}for(const k of kids.flat()){if(k==null)continue;e.append(k.nodeType?k:document.createTextNode(k))}return e};
const fmt=(n,d=0)=>n==null||isNaN(n)?'–':Number(n).toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});

let P={items:{},counts:{},done:{},labs:{},cards:{}};
let saveT;
function saveP(){LS.set('ma_progress',P)}
async function loadP(){P=Object.assign(P,LS.get('ma_progress',{}))}

function modScore(mid){const n=P.counts[mid]||0;let ans=0,first=0;for(const[id,v]of Object.entries(P.items)){if(id.startsWith(mid)){if(v.done)ans++;if(v.done&&v.first)first++}}return{n,ans,first,pct:n?Math.round(100*first/n):0,complete:n>0&&ans>=n}}

function renderSide(){const cur=location.hash||'#/home';const s=$('#side');s.innerHTML='';
  const tot=MODS.reduce((a,[id])=>{const m=modScore(id);a.n+=m.n||10;a.a+=m.ans;return a},{n:0,a:0});const pct=Math.round(100*tot.a/tot.n);
  s.append(el('h1',{},'Calling the Deal'),el('div',{class:'sub'},`M&A from zero · ${pct}% complete`),el('div',{class:'bar'},el('i',{style:`width:${pct}%`})));
  const link=(href,n,t,sc,done,ext)=>el('a',{href,class:cur===href?'on':'',target:ext?'_blank':null},el('span',{class:'n'},n),el('span',{},t),sc?el('span',{class:'sc'+(done?' done':'')},sc):null);
  s.append(link('../../','←','All courses'),link('#/home','⌂','Dashboard'));
  let grp='';MODS.forEach(([id,t,g])=>{if(g!==grp){grp=g;s.append(el('h3',{},g))}const m=modScore(id);s.append(link('#/m/'+id,MLABEL(id),t,m.n?(m.complete?`${m.pct}%`:`${m.ans}/${m.n}`):'',m.complete))});
  s.append(el('h3',{},'Labs on real documents'));LABS.forEach(([id,t])=>s.append(link('#/lab/'+id,'▸',t.replace(/^Lab \d · /,''),P.labs[id]||'',!!P.labs[id])));
  s.append(el('h3',{},'Reference'));s.append(link('#/drill','↻','Flashcard drill'),link('podcast.html','♪','Podcast',null,0,1),link('handbook.html','▤','Handbook',null,0,1),link('cheatsheet.html','▤','Cheatsheet',null,0,1),link('docs/index.html','▤','Documents',null,0,1));
  s.append(el('h3',{},'Your progress'),el('div',{class:'mut',style:'font-size:12px;margin:0 8px'},'Stored in this browser only.'),el('div',{class:'tools'},
    el('button',{class:'sec',onclick:exportProgress},'Export'),el('button',{class:'sec',onclick:importProgress},'Import'),el('button',{class:'sec',onclick:()=>{if(confirm('Erase all progress in this browser?')){['ma_progress','ma_graded','ma_saved','ma_pod'].forEach(k=>localStorage.removeItem(k));location.reload()}}},'Reset')));
  const crumb=$('#crumb');if(crumb){const [,a,b]=cur.split('/');let t='Dashboard',g='';if(a==='m'){const m=MODS.find(x=>x[0]===b);if(m){g=m[2];t=m[1]}}else if(a==='lab'){const l=LABS.find(x=>x[0]===b);if(l){g='Labs';t=l[1].replace(/^Lab \d · /,'')}}else if(a==='drill'){g='Reference';t='Flashcard drill'}crumb.innerHTML='';crumb.append(g?el('span',{},g+'  /  '):'',el('b',{},t))}
}
const PKEYS=['ma_progress','ma_graded','ma_saved','ma_pod','ma_unlock'];
function exportProgress(){const o={};PKEYS.forEach(k=>{const v=localStorage.getItem(k);if(v!=null)o[k]=v});const a=el('a',{href:URL.createObjectURL(new Blob([JSON.stringify(o)],{type:'application/json'})),download:'calling-the-deal-progress.json'});document.body.append(a);a.click();a.remove()}
function importProgress(){const i=el('input',{type:'file',accept:'.json,application/json'});i.onchange=async()=>{try{const o=JSON.parse(await i.files[0].text());PKEYS.forEach(k=>{if(k in o)localStorage.setItem(k,o[k])});location.reload()}catch(e){alert('That file is not a progress export.')}};i.click()}
// ---------- quizzes ----------
function rec(id,correct){const v=P.items[id]||(P.items[id]={first:null,done:false});if(v.first===null)v.first=correct;if(correct)v.done=true;saveP();renderSide();updateFoot()}
function wireQuiz(q){const id=q.dataset.id,ul=$('ul',q);if(!ul)return;const lis=$$('li',ul);for(let i=lis.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));ul.append(lis[j]);lis.splice(j,1)}
  const st=P.items[id];if(st&&st.done){q.classList.add('done');$$('li',ul).forEach(l=>{if(l.hasAttribute('data-correct'))l.classList.add('right')});tag(q,st.first)}
  $$('li',ul).forEach(li=>li.addEventListener('click',()=>{if(q.classList.contains('done'))return;const ok=li.hasAttribute('data-correct');li.classList.add(ok?'right':'wrong');rec(id,ok);if(ok){q.classList.add('done');tag(q,P.items[id].first)}}))}
function tag(q,first){if($('.tag',q))return;$('.q',q).append(el('span',{class:'tag '+(first?'ok':'bad')},first?'first try':'got there'))}
function parseNum(s){s=String(s).trim().toLowerCase().replace(/,/g,'').replace(/(aed|usd|gbp|eur|\$|£|€|%|months?|years?|days?)/g,'').trim();let mult=1;if(/bn$|b$/.test(s)){mult=1e9;s=s.replace(/bn$|b$/,'')}else if(/m$/.test(s)){mult=1e6;s=s.replace(/m$/,'')}else if(/k$/.test(s)){mult=1e3;s=s.replace(/k$/,'')}const v=parseFloat(s);return isNaN(v)?NaN:v*mult}
function wireNum(q){const id=q.dataset.id,ans=parseFloat(q.dataset.answer),tol=parseFloat(q.dataset.tol||'0.01');let tries=0;
  const inp=el('input',{class:'numin',placeholder:'answer',inputmode:'decimal'}),btn=el('button',{},'Check'),msg=el('span',{class:'mut',style:'margin-left:10px'}),show=el('button',{class:'sec',style:'display:none;margin-left:8px'},'Show answer');
  const row=el('div',{},inp,' ',btn,show,msg);q.insertBefore(row,$('.explain',q));
  const finish=()=>{q.classList.add('done');inp.disabled=btn.disabled=true;show.style.display='none';msg.textContent=' Answer: '+fmt(ans,ans%1?2:0);tag(q,P.items[id].first)};
  const st=P.items[id];if(st&&st.done){finish();return}
  const check=()=>{const v=parseNum(inp.value);if(isNaN(v)){msg.textContent=' Enter a number (k, m suffixes work)';return}const ok=ans===0?Math.abs(v)<1e-9:Math.abs(v-ans)<=Math.abs(ans)*tol+1e-9;tries++;rec(id,ok);if(ok)finish();else{msg.textContent=' Not yet. Recheck your working.';msg.className='bad';if(tries>=2)show.style.display=''}};
  btn.addEventListener('click',check);inp.addEventListener('keydown',e=>{if(e.key==='Enter')check()});show.addEventListener('click',()=>{P.items[id].done=true;saveP();renderSide();updateFoot();finish()})}

let curMod=null;
function updateFoot(){const f=$('#modfoot');if(!f||!curMod)return;const m=modScore(curMod);const i=MODS.findIndex(x=>x[0]===curMod);f.innerHTML='';
  const prog=$('#modprog');if(prog){prog.innerHTML='';prog.append(el('div',{class:'bar'},el('i',{style:`width:${m.n?100*m.ans/m.n:0}%`})),el('span',{},`${m.ans} of ${m.n} answered`+(m.ans?` · ${m.pct}% first try`:'')))}
  const status=el('div',{class:'status'},el('div',{class:'k'},`${m.ans} / ${m.n}`),el('div',{class:'mut'},'questions answered'),m.complete?el('div',{class:m.pct>=80?'ok':'warn',style:'margin-top:6px;font-weight:600'},m.pct>=80?`Passed · ${m.pct}% first try`:`${m.pct}% first try · below the 80% pass mark. Re-read the sections you missed.`):el('div',{class:'mut',style:'margin-top:6px'},'Pass mark: 80% right first try'));
  if(m.n&&m.ans)status.append(el('button',{class:'sec',style:'margin-top:10px',onclick:()=>{if(confirm('Clear your answers for this module?')){for(const k of Object.keys(P.items))if(k.startsWith(curMod))delete P.items[k];saveP();route()}}},'Reset module'));
  const nav=el('div',{class:'pn'});const prev=MODS[i-1],next=MODS[i+1];
  nav.append(prev?el('a',{href:'#/m/'+prev[0],class:'pv'},el('span',{},'← Previous'),el('b',{},prev[1])):el('span'),next?el('a',{href:'#/m/'+next[0],class:'nx'},el('span',{},'Next →'),el('b',{},next[1])):el('a',{href:'#/lab/extract',class:'nx'},el('span',{},'Next →'),el('b',{},'Labs on real documents')));
  f.append(status,nav)}

let tocObs=null;
async function showModule(mid){curMod=mid;const main=$('#main');main.innerHTML='<p class="mut">Loading…</p>';const meta=MODS.find(m=>m[0]===mid);
  const r=await fetch(`content/${mid}.html`);if(!r.ok){main.innerHTML=`<h1>${meta[1]}</h1><p>Not available.</p>`;return}
  const box=el('article',{class:'prose',html:await r.text()});
  const h1=$('h1',box),lede=$('.lede',box);const words=box.textContent.split(/\s+/).length;const nq=$$('.quiz,.num',box).length;
  const head=el('header',{class:'modhead'},el('div',{class:'kicker'},`${meta[2]}  ·  ${mid==='d00'?'Diagnostic':mid==='x16'?'Final exam':'Module '+MLABEL(mid)}`),el('h1',{},h1?h1.textContent:meta[1]),lede?el('p',{class:'lede'},lede.textContent):null,
    el('div',{class:'chips'},el('span',{},`${Math.max(5,Math.round(words/230))} min`),el('span',{},`${nq} questions`),$$('[data-widget]',box).length?el('span',{},`${$$('[data-widget]',box).length} interactive tool`):null),el('div',{class:'modprog',id:'modprog'}));
  h1&&h1.remove();lede&&lede.remove();
  const hs=$$('h2',box);hs.forEach((h,k)=>{h.id='s'+(k+1)});
  const toc=el('nav',{class:'toc'},el('div',{class:'tt'},'On this page'),...hs.map(h=>el('a',{href:'#',onclick:e=>{e.preventDefault();h.scrollIntoView({behavior:'smooth',block:'start'})},'data-for':h.id},h.textContent)));
  main.innerHTML='';main.append(el('div',{class:'modgrid'},el('div',{class:'modcol'},head,box,el('footer',{class:'modfoot',id:'modfoot'})),el('aside',{class:'tocwrap'},toc)));
  $$('table',box).forEach(t=>{const w=el('div',{class:'tablewrap'});t.replaceWith(w);w.append(t)});$$('.quiz',box).forEach(wireQuiz);$$('.num',box).forEach(wireNum);$$('[data-widget]',box).forEach(w=>{const f=WIDGETS[w.dataset.widget];if(f){w.classList.add('widget');f(w)}});
  P.counts[mid]=nq;saveP();updateFoot();renderSide();window.scrollTo(0,0);
  if(tocObs)tocObs.disconnect();tocObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){$$('.toc a').forEach(a=>a.classList.toggle('on',a.dataset.for===e.target.id))}})},{rootMargin:'-70px 0px -70% 0px'});hs.forEach(h=>tocObs.observe(h))}

// ---------- drill ----------
async function allTerms(){if(allTerms.c)return allTerms.c;const out=[];for(const[id]of MODS){try{const r=await fetch(`content/${id}.html`);if(!r.ok)continue;const d=new DOMParser().parseFromString(await r.text(),'text/html');$$('dl.terms dt',d).forEach(dt=>{const dd=dt.nextElementSibling;if(dd)out.push({k:id+':'+dt.textContent.trim(),t:dt.textContent.trim(),d:dd.textContent.trim(),m:id})})}catch(e){}}return allTerms.c=out}
async function showDrill(){const main=$('#main');main.innerHTML='<h1>Flashcard drill</h1><p class="lede">Every key term from every module. Cards you miss come back sooner. Say the definition out loud before you flip.</p>';
  const terms=await allTerms();if(!terms.length){main.append(el('p',{},'No terms yet.'));return}
  const box=el('div',{class:'card flash'}),ctl=el('div',{class:'foot'}),stat=el('p',{class:'mut'});main.append(stat,box,ctl);let cur,flipped,dir=0;
  const pick=()=>{const now=Date.now();const due=terms.filter(t=>!(P.cards[t.k])||P.cards[t.k].due<=now);const pool=due.length?due:terms;cur=pool[Math.floor(Math.random()*pool.length)];flipped=false;dir=Math.random()<.35?1:0;draw();const known=terms.filter(t=>P.cards[t.k]&&P.cards[t.k].box>=2).length;stat.textContent=`${terms.length} cards · ${known} solid · ${due.length} due now`};
  const draw=()=>{box.innerHTML='';const front=dir?cur.d:cur.t,back=dir?cur.t:cur.d;box.append(el('div',{class:'mut',style:'font-size:12px'},dir?'Name the term':'Define it'),el('div',{style:'margin:10px 0;font-weight:600'},front));if(flipped)box.append(el('div',{style:'font-size:17px;border-top:1px solid var(--line);padding-top:10px;max-width:640px'},back),el('div',{class:'mut',style:'font-size:12px;margin-top:8px'},'from module '+cur.m.slice(1)));
    ctl.innerHTML='';if(!flipped)ctl.append(el('button',{onclick:()=>{flipped=true;draw()}},'Flip (space)'));else ctl.append(el('button',{onclick:()=>grade(true)},'Knew it (1)'),el('button',{class:'sec',onclick:()=>grade(false)},'Missed it (2)'))};
  const grade=ok=>{const c=P.cards[cur.k]||{box:0};c.box=ok?Math.min(c.box+1,5):0;c.due=Date.now()+[1,10,60,360,1440,4320][c.box]*60000;P.cards[cur.k]=c;saveP();pick()};
  document.onkeydown=e=>{if(location.hash!=='#/drill')return;if(e.key===' '&&!flipped){e.preventDefault();flipped=true;draw()}else if(flipped&&e.key==='1')grade(true);else if(flipped&&e.key==='2')grade(false)};pick()}

function route(){const h=location.hash||'#/home';curMod=null;document.onkeydown=null;const[, a, b]=h.split('/');
  document.body.classList.toggle('journal-home',a==='home');setNavigation(false);renderSide();
  if(a==='m'&&MODS.some(m=>m[0]===b))return showModule(b);if(a==='lab'&&LAB[b]){$('#main').innerHTML='';window.scrollTo(0,0);return LAB[b]($('#main'))}if(a==='drill')return showDrill();showHome(b)}
window.addEventListener('scroll',()=>{const b=$('#rp');if(!b)return;const h=document.documentElement;b.style.width=(curMod?100*h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight):0)+'%'},{passive:true});
window.addEventListener('hashchange',route);loadP().then(route);
