// Truth or Misconception: sort statements into "taught in Scripture" or "a common misconception".
// Every answer shows WHY. Wrong cards return to the end of the stack so the learner meets them again.
import { h, esc, $ } from './core-utilities-and-dom-helpers.js';
import { sfx, buzz } from './sound-effects-music-narration-haptics.js';

export function mount(root, p, ctx) {
  const queue = p.cards.map((c, i) => ({ ...c, i })); let done = 0, lock = false;
  root.innerHTML = `<p class="kicker" id="count"></p><div class="card sortcard" id="card" aria-live="polite"></div>
    <div class="sortbtns"><button class="btn alt" data-a="true">Taught in Scripture<small>press T or ←</small></button>
    <button class="btn alt" data-a="false">A misconception<small>press M or →</small></button></div><div id="exp"></div>`;
  const card = $('#card', root), exp = $('#exp', root), count = $('#count', root);

  function show() {
    exp.innerHTML = ''; lock = false;
    count.textContent = `Statement ${Math.min(done + 1, p.cards.length)} of ${p.cards.length}`;
    card.textContent = queue[0].t; card.classList.remove('unfold'); void card.offsetWidth; card.classList.add('pop');
  }
  function answer(val) {
    if (lock) return; lock = true;
    const cur = queue[0], right = cur.truth === val;
    sfx(right ? 'good' : 'oops', .5); buzz(right ? 15 : 6); if (!right) ctx.miss?.();
    exp.innerHTML = `<div class="explain ${right ? 'good' : 'bad'}"><b>${right ? 'Yes!' : 'Not quite.'}</b> ${esc(cur.why.replace(/^(Yes|Not quite)[:.!]?\s*/, ''))}</div><div class="row"><button class="btn" id="next">${right && queue.length === 1 ? 'Finish' : 'Next'}</button></div>`;
    $('#next', root).focus();
    $('#next', root).onclick = () => {
      if (right) { queue.shift(); done++; } else queue.push(queue.shift());
      if (!queue.length) { exp.innerHTML = ''; ctx.solved('Every statement is sorted.'); return; }
      sfx('page', .3); show();
    };
  }
  root.addEventListener('click', (e) => { const b = e.target.closest('[data-a]'); if (b) answer(b.dataset.a === 'true'); });
  const onKey = (e) => {
    if (e.target.matches?.('textarea,input')) return;
    if (['t', 'T', 'ArrowLeft'].includes(e.key)) answer(true); if (['m', 'M', 'ArrowRight'].includes(e.key)) answer(false);
  };
  document.addEventListener('keydown', onKey); ctx.cleanup(() => document.removeEventListener('keydown', onKey));
  ctx.onHint(() => ctx.say('Hint: six common things are mistaken for the new birth, such as church, baptism and being sinless.', 'soft'));
  show();
}
