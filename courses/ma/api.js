// Client-side replacement for the old Python API. Everything runs in the browser; state lives in localStorage.
// This makes the site fully static (Cloudflare Pages, GitHub Pages, any bucket).
const LS={get:(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let _PRE=null;const pre=async()=>_PRE||(_PRE=await (await fetch('data/precedents.json')).json());
const NUMF={dm_pct:0.25,basket_pct:0.15,cap_pct:0.1,survival_m:0,escrow_pct:0.15};
const SRCF=['law','mechanism','rwi','structure','dm_pct','basket_type','basket_pct','cap_pct','survival_m','escrow_pct','sandbagging','scrape'];
function toNum(x){if(x==null)return null;const s=String(x).trim().replace(/[,%]/g,'');if(s===''||['n/a','na','none','-'].includes(s.toLowerCase()))return null;const v=Number(s);return isNaN(v)?'bad':v}
const unlockedNow=()=>Object.keys(LS.get('ma_graded',{})).length>=4||LS.get('ma_unlock',false);
function saveFile(name,text){const saved=LS.get('ma_saved',{});saved[name]={text,at:Date.now()};LS.set('ma_saved',saved);
  try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/markdown'}));a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}catch(e){}
  return{ok:true,path:name+' (downloaded, and kept in this browser)'}}
const LOCAL={
 'GET /api/progress':()=>LS.get('ma_progress',{}),
 'POST /api/progress':b=>{LS.set('ma_progress',b);return{ok:true}},
 'GET /api/deals':async()=>{const p=await pre(),g=LS.get('ma_graded',{});return{deals:p.rows.map(r=>({id:r.id,name:r.name,file:p.files[r.id],best:g[r.id]??null})),unlocked:unlockedNow()}},
 'GET /api/precedents':async q=>{if(!unlockedNow()&&!q.has('force'))return{locked:true};return{rows:(await pre()).rows}},
 'POST /api/grade':async b=>{const p=await pre(),row=p.rows.find(r=>r.id===b.deal);if(!row)return{error:'unknown deal'};const out={};let ok=0;
   for(const f of SRCF){if(!(f in b.answers))continue;const a=row[f],g0=b.answers[f];let good;
    if(f in NUMF){const g=toNum(g0);if(g==='bad')good=false;else if(a==null)good=g==null;else if(g==null)good=a===0;else if(a===0)good=Math.abs(g)<0.05;else good=Math.abs(g-a)<=Math.max(NUMF[f]*Math.abs(a),0.011)}
    else good=a==null?['','unknown','n/a','not found'].includes(String(g0).toLowerCase()):String(g0).trim().toLowerCase()===String(a).toLowerCase();
    ok+=good;out[f]=Object.assign({ok:good,actual:a==null?'not stated / cannot be computed':a},p.src[row.id]?.[f]||{detail:null,section:null,quote:null})}
   const n=Object.keys(out).length,pct=Math.round(100*ok/Math.max(n,1)),gr=LS.get('ma_graded',{});gr[row.id]=Math.max(pct,gr[row.id]||0);LS.set('ma_graded',gr);
   return{fields:out,score:ok,of:n,note:row.note,unlocked:unlockedNow()}},
 'GET /api/landing/new':async q=>{const p=await pre();const pool=p.rows.filter(r=>r.structure==='indemnity'&&r.price_usd_m);const seen=new Set((q.get('seen')||'').split(','));const cand=pool.filter(r=>!seen.has(r.id));const c=cand.length?cand:pool;const r=c[Math.floor(Math.random()*c.length)];
   const facts={};for(const k of['id','name','year','law','seller','price_usd_m','mechanism','rwi'])facts[k]=r[k];return{deal:facts,comps:p.rows.filter(x=>x.id!==r.id)}},
 'POST /api/landing/score':async b=>{const p=await pre(),r=p.rows.find(x=>x.id===b.deal);if(!r)return{error:'unknown deal'};const pr=b.pred||{};let pts=0;const det={};
   const band=(f,full,half)=>{const a=r[f],g=toNum(pr[f]);if(a==null||g==null||g==='bad'){det[f]={actual:a,pts:0};return}const d=Math.abs(g-a);const s=d<=full(a)?2:d<=half(a)?1:0;pts+=s;det[f]={actual:a,pts:s}};
   band('cap_pct',a=>Math.max(.25*a,1),a=>Math.max(.6*a,4));band('basket_pct',a=>Math.max(.3*a,.15),a=>Math.max(.8*a,.5));band('survival_m',()=>0,()=>3);band('escrow_pct',a=>Math.max(.3*a,.75),a=>Math.max(.8*a,3));
   for(const f of['basket_type','sandbagging']){const s=String(pr[f]||'').toLowerCase()===String(r[f]).toLowerCase()?2:0;pts+=s;det[f]={actual:r[f],pts:s}}
   return{detail:det,points:pts,of:12,note:r.note,row:r}},
 'POST /api/save':b=>saveFile(String(b.name||'note.md').replace(/[^a-zA-Z0-9_.-]/g,'_').slice(0,80),b.text||'')
};
async function api(path,body){const u=new URL(path,location.href);const k=(body?'POST ':'GET ')+u.pathname.replace(/^.*(\/api\/)/,'/api/');const f=LOCAL[k];if(!f)throw new Error('no handler '+k);return f(body||u.searchParams)}
