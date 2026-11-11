// Word Order: rebuild a Scripture phrase by tapping words in order. Tap a placed word to return it.
// Keep the current sentence visible so the player can edit it at their own pace.
import { h, shuffle, rng, esc, $, $$ } from './core-utilities-and-dom-helpers.js';
import { sfx, buzz } from './sound-effects-music-narration-haptics.js';

export function mount(root, p, ctx) {
  const words = p.words.map((w, i) => ({ id: i, w }));
  let order = shuffle(words, rng(p.words.join('').length * 7 + 3));
  if (order.map((x) => x.w).join(' ') === p.words.join(' ')) order = order.reverse();
  const line = []; const locked = new Set(); let finished = false;

  root.innerHTML = `<p class="clue">Put the words in order.</p><p class="kicker" style="text-align:center">${esc(p.ref)} (KJV)</p>
    <div class="wo-line" aria-label="Your sentence"></div><div class="wo-tray bank" role="group" aria-label="Word choices"></div>`;
  const lineEl = $('.wo-line', root), trayEl = $('.wo-tray', root);

  function render() {
    lineEl.innerHTML = ''; trayEl.innerHTML = '';
    line.forEach((id, i) => lineEl.append(h(`<button class="chip wo ${locked.has(i) ? 'locked' : ''}" data-line="${i}" ${locked.has(i) ? 'disabled' : ''}>${esc(words[id].w)}</button>`)));
    order.filter((x) => !line.includes(x.id)).forEach((x) => trayEl.append(h(`<button class="chip" data-id="${x.id}">${esc(x.w)}</button>`)));
  }
  const text = () => line.map((id) => words[id].w).join(' ');
  function check() {
    if (line.length < words.length) return;
    if (text() === p.words.join(' ')) { finished = true; lineEl.classList.add('win'); ctx.solved('You rebuilt the verse.'); return; }
    sfx('oops', .4); ctx.miss?.(); ctx.say('Almost. Choose a placed word to return it, then try a different order.', 'soft');
    $$('.wo', root).forEach((b, i) => { if (words[line[i]].w !== p.words[i]) b.classList.add('bad'); });

  }
  root.addEventListener('click', (e) => {
    if (finished) return;
    const t = e.target.closest('[data-id]'), l = e.target.closest('[data-line]');
    if (t) {
      line.push(+t.dataset.id); sfx('place', .5); buzz(8); render();
      if (e.detail === 0) ($('.wo-tray .chip', root) || $('.wo:enabled', root))?.focus();
      check();
    } else if (l && !locked.has(+l.dataset.line)) {
      const [id] = line.splice(+l.dataset.line, 1);
      sfx('unplace', .4); render();
      if (e.detail === 0) $(`.wo-tray [data-id="${id}"]`, root)?.focus();
    }
  });
  ctx.onHint(() => {
    if (finished) return;
    const i = line.findIndex((id, k) => words[id].w !== p.words[k]); const at = i < 0 ? line.length : i;
    if (at >= words.length) return;
    const candidate = words.find(x => x.w === p.words[at] && (!line.includes(x.id) || line.indexOf(x.id) > at));
    if (!candidate) return;
    const id = candidate.id;
    const old = line.indexOf(id); if (old >= 0) line.splice(old, 1);
    line.splice(at, 0, id); line.length = Math.min(line.length, words.length);
    // The hinted word is at a fixed position, so keep the already correct prefix in place.
    for (let i = 0; i <= at; i++) locked.add(i);
    sfx('pluck', .5); render(); ctx.say(`Hint: the next word is "${p.words[at]}".`, 'soft'); check();
  });
  render();
}
