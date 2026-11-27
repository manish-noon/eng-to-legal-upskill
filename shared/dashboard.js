function courseMap(currentId) {
  const map = el('section',{class:'flight-map','aria-labelledby':'map-title'});
  const stations = el('ol',{class:'stations'});
  for (const [index,station] of STATIONS.entries()) {
    const unfinished = station.ids.find(id=>!modScore(id).complete);
    const active = station.ids.includes(currentId);
    const state = unfinished ? (active ? 'current' : 'upcoming') : 'finished';
    const target = unfinished || station.ids[0];
    stations.append(el('li',{class:'station '+state},
      el('a',{href:'#/m/'+target,'aria-label':station.name+' · '+state+' · '+MODS.find(m=>m[0]===target)[1]},
        el('span',{class:'waypoint','aria-hidden':'true'},unfinished ? String(index+1).padStart(2,'0') : '✓'),
        el('strong',{},station.name),el('small',{},station.range))));
  }
  map.append(el('div',{class:'map-head'},el('h2',{id:'map-title'},'Course map'),el('span',{class:'map-key'},'Current stage')),
    el('div',{class:'route-plot'},
      el('div',{class:'route-line','aria-hidden':'true',html:'<svg viewBox="0 0 600 240" preserveAspectRatio="none"><path d="M100 55 H500 C565 55 565 175 500 175 H100" /></svg>'}),stations),
    el('a',{class:'map-index',href:'#/home/curriculum'},'Full curriculum',' ↓'));
  return map;
}

function showHome(section) {
  const main = document.getElementById('main');
  main.replaceChildren();
  const next = MODS.find(([id])=>!modScore(id).complete);
  const [id,title,group] = next || MODS[MODS.length-1];
  const units = MODS.filter(([mid])=>mid.startsWith('m'));
  const completed = units.filter(([mid])=>modScore(mid).complete).length;

  const masthead = el('header',{class:'dash-hero journal-head'},
    el('div',{class:'journal-line'},el('span',{},EDITION.name),el('span',{},EDITION.topic)),
    el('div',{class:'mast-grid'},
      el('h1',{},EDITION.title[0],el('em',{},EDITION.title[1])),
      el('p',{},EDITION.description)),
    el('div',{class:'journal-line journal-meta'},el('span',{},`${units.length} modules · ${LABS.length} labs · ${EDITION.exhibits} filed exhibits`),
      el('span',{},`${completed} / ${units.length} modules completed`)));
  const feature = el('section',{class:'cover-story','aria-label':'Your next lesson'},
    el('img',{src:EDITION.image,alt:EDITION.alt,width:1500,height:1000,fetchpriority:'high'}),
    el('div',{class:'cover-caption'},
      el('div',{},el('span',{class:'cover-label'},next ? 'Next in your course' : 'Course complete'),
        el('h2',{},title),el('span',{class:'cover-part'},group)),
      el('a',{class:'cover-action',href:'#/m/'+id},next ? (modScore(id).ans?'Resume':'Start') : 'Review',' →')));
  main.append(masthead,el('div',{class:'front-spread'},feature,courseMap(next?.[0])));
  const curriculum = el('section',{id:'curriculum',class:'journal-section'},
    el('h2',{},'The curriculum'));
  const groups = el('div',{class:'curriculum-groups'});
  for (const station of STATIONS) {
    const list = el('div',{class:'curriculum-group'},el('h3',{},station.name));
    for (const mid of station.ids) {
      const row = MODS.find(m=>m[0]===mid);
      const s = modScore(mid);
      list.append(el('a',{class:'syllabus-row',href:'#/m/'+mid},
        el('span',{class:'lesson-no'},mid.startsWith('m')?mid.slice(1):mid==='d00'?'◇':'★'),
        el('span',{},row[1]),el('small',{},s.complete?s.pct+'%':s.ans?s.ans+'/'+s.n:'→')));
    }
    groups.append(list);
  }
  curriculum.append(groups);
  const labs = el('section',{id:'labs',class:'journal-section'},el('h2',{},'Labs on real documents'),
    el('div',{class:'cards'},LABS.map(([key,label,detail])=>el('a',{href:'#/lab/'+key},
      el('span',{class:'kicker'},label.split(' · ')[0]),el('b',{},label.split(' · ')[1]),el('span',{},detail),
      P.labs[key]?el('small',{class:'ok'},P.labs[key]):null))));
  const refs = el('section',{id:'reference',class:'journal-section'},el('h2',{},'The reference shelf'),
    el('div',{class:'shelf'},[...(EDITION.podcast ? [['podcast.html','Podcast']] : []),['handbook.html','Handbook'],['cheatsheet.html','One-page cheatsheet'],['docs/index.html','Exhibit library'],['#/drill','Flashcard drill']].map(([href,label])=>el('a',{href},label,' ↗'))));
  main.append(curriculum,labs,refs,el('div',{class:'prose limits',html:EDITION.limits}));
  if (['curriculum','labs','reference'].includes(section)) document.getElementById(section).scrollIntoView();
  else window.scrollTo(0,0);
}

function setNavigation(open) {
  document.body.classList.toggle('nav',open);
  $('#menu').setAttribute('aria-expanded',String(open));
}
document.addEventListener('click',event=>{
  if(event.target.closest('#menu')){
    const open=!document.body.classList.contains('nav');
    setNavigation(open);
    if(open) $('#side a').focus();
    return;
  }
  const anchor=event.target.closest('a');
  if(anchor && anchor.getAttribute('href')===location.hash && location.hash.startsWith('#/home/')){
    document.getElementById(location.hash.split('/')[2])?.scrollIntoView();
  }
  if(document.body.classList.contains('nav') && (event.target.closest('#side a') || !event.target.closest('#side'))) setNavigation(false);
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape' && document.body.classList.contains('nav')){
    setNavigation(false);
    $('#menu').focus();
  }
});
