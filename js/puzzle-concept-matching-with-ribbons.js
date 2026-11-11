// Concept Connections: tap one item on each side to join them with an animated ribbon.
import { h, shuffle, rng, esc, $ } from './core-utilities-and-dom-helpers.js';
import { sfx, buzz } from './sound-effects-music-narration-haptics.js';

const RIBBON = ['#37B9B0', '#F47768', '#9174D5', '#F8C948'];

export function mount(root, p, ctx) {
  const n = p.pairs.length, seed = p.pairs[0][0].length * 31;
  const left = p.pairs.map((pr, i) => ({ i, t: pr[0] }));
  let right = shuffle(p.pairs.map((pr, i) => ({ i, t: pr[1] })), rng(seed));
  if (right.every((r, k) => r.i === k)) right = right.reverse();
  const matched = {}; let sel = null, finished = false;

  root.innerHTML = `<p class="clue">Match each Scripture idea to what it teaches.</p><div class="match"><svg class="ribbons" aria-hidden="true"></svg>
    <div class="col" data-side="L"></div><div class="col" data-side="R"></div></div>`;
  const cols = { L: $('[data-side=L]', root), R: $('[data-side=R]', root) }, svg = $('svg', root);
  const mk = (side, it) => h(`<button class="chip" data-side="${side}" data-i="${it.i}" aria-pressed="false">${esc(it.t)}</button>`);
  left.forEach(it => cols.L.append(mk('L', it))); right.forEach(it => cols.R.append(mk('R', it)));
  const buttons = [...root.querySelectorAll('button')];

  function render() {
    for (const button of buttons) {
      const { side, i } = button.dataset, done = i in matched;
      button.setAttribute('aria-pressed', String(sel?.side === side && sel.i === Number(i)));
      button.disabled = done;
      if (done) button.classList.add('on', 'm' + matched[i]);
    }
    drawRibbons();
  }
  function drawRibbons() {
    const box = $('.match', root).getBoundingClientRect(); svg.innerHTML = '';
    Object.entries(matched).forEach(([i, c]) => {
      const a = $(`[data-side=L][data-i="${i}"]`, root), b = $(`[data-side=R][data-i="${i}"]`, root); if (!a || !b) return;
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      const x1 = ra.right - box.left, y1 = ra.top + ra.height / 2 - box.top, x2 = rb.left - box.left, y2 = rb.top + rb.height / 2 - box.top, m = (x1 + x2) / 2;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M${x1} ${y1}C${m} ${y1} ${m} ${y2} ${x2} ${y2}`); path.setAttribute('stroke', RIBBON[c % 4]);
      svg.append(path);
    });
  }
  root.addEventListener('click', (e) => {
    const c = e.target.closest('.chip'); if (!c || finished) return;
    const side = c.dataset.side, i = +c.dataset.i; sfx('tap', .4);
    if (!sel || sel.side === side) { sel = sel && sel.side === side && sel.i === i ? null : { side, i }; return render(); }
    if (sel.i === i) {
      matched[i] = Object.keys(matched).length; sel = null; sfx('ok', .5); buzz(15); render();
      if (Object.keys(matched).length === n) { finished = true; ctx.solved('Every idea is connected.'); }
      else {
        if (e.detail === 0) buttons.find(button => !button.disabled)?.focus();
        ctx.say('Connected!', 'good');
      }
    } else {
      sel = null; sfx('oops', .35); render();
      if (ctx.motion() && e.detail > 0) c.animate([{ transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'none' }], { duration: 280 });
      ctx.miss?.(); ctx.say('Those two do not belong together yet. Try another partner.', 'soft');
    }
  });
  ctx.onHint(() => {
    const i = left.find((l) => !(l.i in matched))?.i; if (i === undefined) return;
    if (ctx.motion()) [$(`[data-side=L][data-i="${i}"]`, root), $(`[data-side=R][data-i="${i}"]`, root)].forEach((b) => b?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 700, iterations: 3 }));
    ctx.say(`Hint: “${p.pairs[i][0]}” belongs with “${p.pairs[i][1]}”.`, 'soft');
  });
  const resize = new ResizeObserver(drawRibbons);
  resize.observe(root); ctx.cleanup(() => resize.disconnect());
  render();
}
