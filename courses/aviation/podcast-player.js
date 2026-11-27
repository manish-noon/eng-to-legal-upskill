// Keep listening progress separate from course marks and from the M&A series.
const select = selector => document.querySelector(selector);
const audio = select('#au');
const speeds = [1, 1.15, 1.25, 1.5, 1.75, 2];
const state = { pos: {}, done: {}, rate: 1 };
try {
  const saved = JSON.parse(localStorage.getItem('av_pod') || '{}');
  if (saved.pos && typeof saved.pos === 'object') state.pos = saved.pos;
  if (saved.done && typeof saved.done === 'object') state.done = saved.done;
  if (speeds.includes(saved.rate)) state.rate = saved.rate;
  if (typeof saved.last === 'string') state.last = saved.last;
} catch {
  // Playback also works with storage disabled.
}
let episodes = [];
let current = -1;
let ready = false;
let lastSaved = 0;
let requestedTranscript = '';

function save() {
  try { localStorage.setItem('av_pod', JSON.stringify(state)); } catch {}
}
function savePosition() {
  if (!ready || current < 0 || audio.ended) return;
  state.pos[episodes[current].num] = audio.currentTime;
  lastSaved = Date.now();
  save();
}
function timeLabel(value) {
  const seconds = Math.round(Math.max(0, value || 0));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const tail = String(seconds % 60).padStart(2, '0');
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${tail}` : `${minutes}:${tail}`;
}
function escapeText(text) {
  return text.replace(/[&<>]/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;'}[char]));
}
function resumeIndex() {
  const previous = episodes.findIndex(e => e.num === state.last && !state.done[e.num]);
  if (previous >= 0) return previous;
  return Math.max(0, episodes.findIndex(e => !state.done[e.num]));
}
function showProgress() {
  const total = episodes.reduce((sum, e) => sum + e.seconds, 0);
  const heard = episodes.reduce((sum, e) => sum + (state.done[e.num] ? e.seconds : Math.min(state.pos[e.num] || 0, e.seconds)), 0);
  select('#ovt').textContent = `${episodes.filter(e => state.done[e.num]).length} of ${episodes.length} finished · ${timeLabel(total - heard)} left`;
  select('#ovb').style.width = (100 * heard / Math.max(total, 1)) + '%';
}
function draw() {
  const list = select('#list');
  list.replaceChildren();
  episodes.forEach((episode, index) => {
    const selected = index === current;
    const playing = selected && !audio.paused;
    const position = state.pos[episode.num] || 0;
    const finished = state.done[episode.num];
    const row = document.createElement('div');
    const length = timeLabel(episode.seconds);
    const resume = position > 0 && !finished;
    row.className = 'ep' + (selected ? ' on' : '');
    if (episode.lesson) row.id = episode.lesson.split('/').pop();
    row.innerHTML = `<button class="pb" aria-label="${playing ? 'Pause' : 'Play'} episode ${+episode.num}">${playing ? '❚❚' : '▶'}</button>
      <div><div class="t"><span class="no">${episode.num}</span>${escapeText(episode.title)}${finished ? ' <span class="ck" aria-label="Finished">✓</span>' : ''}</div>
      <div class="s"><span>${resume ? 'Resume at ' + timeLabel(position) + ' of ' + length : length}</span>
      <a href="podcast/${episode.transcript}" data-transcript>Transcript</a>
      <a href="podcast/${episode.file}" download>MP3</a>
      ${episode.lesson ? `<a href="./${episode.lesson}">${episode.lesson.startsWith('#/lab/') ? 'Open lab' : 'Read lesson'}</a>` : ''}</div>
      ${resume ? `<div class="pr"><i style="width:${Math.min(100, 100 * position / episode.seconds)}%"></i></div>` : ''}</div>
      <span class="d">${length}</span>`;
    row.onclick = event => {
      if (event.target.closest('a')) return;
      if (selected) toggle();
      else play(index);
    };
    row.querySelector('[data-transcript]').onclick = event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showTranscript(episode);
    };
    list.append(row);
  });
  const active = current >= 0 && !audio.paused;
  select('#bp').textContent = active ? '❚❚' : '▶';
  select('#bp').setAttribute('aria-label', active ? 'Pause' : 'Play');
  select('#playall').textContent = state.last ? '▶ Resume listening' : '▶ Play series';
  showProgress();
}
async function showTranscript(episode) {
  requestedTranscript = episode.num;
  const url = 'podcast/' + episode.transcript;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error();
    const text = await response.text();
    if (requestedTranscript !== episode.num) return;
    const body = select('#trb');
    body.replaceChildren();
    for (const paragraph of text.split(/\n\n+/)) {
      const match = paragraph.match(/^\*\*(\w+):\*\*\s*([\s\S]*)/);
      if (!match) continue;
      const line = document.createElement('p');
      line.className = match[1].toLowerCase();
      const label = document.createElement('b');
      label.textContent = match[1];
      line.append(label, document.createTextNode(match[2].trim()));
      body.append(line);
    }
    select('#trh').textContent = 'Transcript · ' + Number(episode.num) + '. ' + episode.title;
    select('#tr').hidden = false;
    select('#trh').focus();
  } catch {
    select('#notice').textContent = 'Transcript unavailable. Try the link again.';
  }
}
function startAudio() {
  audio.play().catch(error => {
    if (error.name !== 'AbortError') select('#notice').textContent = 'Playback paused. Press Play to retry or use the MP3 link.';
  });
}
function play(index) {
  const episode = episodes[index];
  if (!episode) return;
  savePosition();
  current = index;
  ready = false;
  state.last = episode.num;
  save();
  select('#player').hidden = false;
  select('#notice').textContent = '';
  select('#nt').textContent = episode.title + ' · Episode ' + Number(episode.num);
  select('#tc').textContent = timeLabel(state.done[episode.num] ? 0 : state.pos[episode.num]);
  select('#td').textContent = timeLabel(episode.seconds);
  audio.src = 'podcast/' + episode.file;
  audio.onloadedmetadata = () => {
    const position = state.pos[episode.num] || 0;
    if (!state.done[episode.num] && position > 0 && position < audio.duration) audio.currentTime = position;
    ready = true;
    audio.playbackRate = state.rate;
  };
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({title: episode.title, artist: 'Clearing the Aircraft Deal', album: 'Episode ' + Number(episode.num),
      artwork: [{ src: 'podcast/cover.jpg', sizes: '1500x1500', type: 'image/jpeg' }] });
  }
  startAudio();
  draw();
}
function toggle() {
  if (current < 0) play(resumeIndex());
  else if (audio.paused) startAudio();
  else audio.pause();
}
function skip(seconds) {
  if (ready) audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
}
if ('mediaSession' in navigator) {
  const handlers = { seekbackward: () => skip(-15), seekforward: () => skip(30),
    nexttrack: () => play(current + 1), previoustrack: () => play(current - 1) };
  for (const [action, handler] of Object.entries(handlers)) {
    try { navigator.mediaSession.setActionHandler(action, handler); } catch {}
  }
}
const scrubber = select('#sk');
let scrubbing = false;
scrubber.oninput = () => {
  scrubbing = true;
  select('#tc').textContent = timeLabel(scrubber.value / 1000 * audio.duration);
};
scrubber.onchange = () => {
  if (ready) audio.currentTime = scrubber.value / 1000 * audio.duration;
  scrubbing = false;
};
audio.ontimeupdate = () => {
  if (!ready) return;
  if (!scrubbing) {
    scrubber.value = 1000 * audio.currentTime / audio.duration;
    select('#tc').textContent = timeLabel(audio.currentTime);
  }
  if (Date.now() - lastSaved > 5000) { savePosition(); showProgress(); }
};
audio.onplay = draw;
audio.onpause = () => { savePosition(); draw(); };
audio.onseeked = savePosition;
audio.onended = () => {
  state.done[episodes[current].num] = true;
  state.pos[episodes[current].num] = 0;
  save();
  if (current + 1 < episodes.length) play(current + 1);
  else draw();
};
window.addEventListener('pagehide', savePosition);
document.addEventListener('visibilitychange', () => { if (document.hidden) savePosition(); });
select('#playall').onclick = () => {
  if (current === resumeIndex() && !audio.ended) startAudio();
  else play(resumeIndex());
};
select('#bp').onclick = toggle;
select('#b15').onclick = () => skip(-15);
select('#f30').onclick = () => skip(30);
select('#rt').textContent = state.rate + '×';
select('#rt').onclick = () => {
  state.rate = speeds[(speeds.indexOf(state.rate) + 1) % speeds.length];
  audio.playbackRate = state.rate;
  select('#rt').textContent = state.rate + '×';
  save();
};
select('#copyfeed').onclick = async () => {
  try {
    await navigator.clipboard.writeText(new URL('podcast/feed.xml', location.href).href);
    select('#copyfeed').textContent = 'Copied';
  } catch {
    select('#notice').textContent = 'Copy the address of the RSS feed link to subscribe.';
  }
};
document.addEventListener('keydown', event => {
  if (event.target.closest('button,a,input,textarea,select') || event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.code === 'Space') { event.preventDefault(); toggle(); }
  if (event.key === 'ArrowLeft') skip(-15);
  if (event.key === 'ArrowRight') skip(30);
});
fetch('podcast/episodes.json').then(response => {
  if (!response.ok) throw new Error();
  return response.json();
}).then(items => {
  episodes = items;
  const total = episodes.reduce((sum, e) => sum + e.seconds, 0);
  select('#meta').innerHTML = `<span><b>${episodes.length}</b> episodes</span><span><b>${timeLabel(total)}</b> total</span><span>Hosts <b>Mira</b> (aviation lawyer) and <b>Leo</b> (operator)</span>`;
  select('#playall').disabled = !episodes.length;
  draw();
  const linked = document.getElementById(location.hash.slice(1));
  if (linked?.classList.contains('ep')) linked.querySelector('button').focus();
}).catch(() => { select('#list').textContent = 'Could not load the episode list. Reload to try again.'; });
