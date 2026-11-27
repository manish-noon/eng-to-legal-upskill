// Theme: 'system' | 'light' | 'dark'. Loaded in <head> so there is no flash.
(function(){
  const KEY='ma_theme';
  const apply=t=>{const h=document.documentElement;if(t==='light'||t==='dark')h.setAttribute('data-theme',t);else h.removeAttribute('data-theme')};
  apply(localStorage.getItem(KEY)||'system');
  const label=t=>({system:'◐ Auto',light:'☀ Light',dark:'☾ Dark'}[t]);
  window.THEME={get:()=>localStorage.getItem(KEY)||'system',
    cycle(){const o=['system','light','dark'];const n=o[(o.indexOf(this.get())+1)%3];localStorage.setItem(KEY,n);apply(n);this.paint();return n},
    paint(){document.querySelectorAll('[data-themebtn],#themebtn').forEach(b=>b.textContent=label(this.get()))}};
  document.addEventListener('DOMContentLoaded',()=>{THEME.paint();document.querySelectorAll('[data-themebtn],#themebtn').forEach(b=>b.addEventListener('click',()=>THEME.cycle()))});
})();
