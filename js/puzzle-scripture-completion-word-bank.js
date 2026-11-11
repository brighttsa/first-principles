// Scripture Completion: fill the blanks in a KJV verse from a word bank.
// Real rendered text, strict answer validation, retry without punishment, hint fills one correct word.
import { h, shuffle, rng, esc, $, $$ } from './core-utilities-and-dom-helpers.js';
import { sfx, buzz } from './sound-effects-music-narration-haptics.js';

export function mount(root, p, ctx) {
  const answers = [...p.text.matchAll(/\[\[(.+?)\]\]/g)].map((m) => m[1]);
  const parts = p.text.split(/\[\[.+?\]\]/);
  const bank = shuffle([...answers, ...(ctx.level === 'child' ? p.extra.slice(0, 1) : p.extra)].map((w, i) => ({ id: i, w })), rng(p.text.length));
  const filled = Array(answers.length).fill(null), locked = Array(answers.length).fill(false);
  let finished = false;

  root.innerHTML = `${p.lead ? `<p class="ex-lead"><span class="kicker">What Scripture teaches</span>${esc(p.lead)}</p>` : ''}<p class="kicker">${esc(p.ref)} (KJV)</p><div class="verse-line"></div><div class="bank" role="group" aria-label="Word bank"></div>`;
  const line = $('.verse-line', root), bankEl = $('.bank', root);

  function render() {
    line.innerHTML = '';
    parts.forEach((txt, i) => {
      line.append(document.createTextNode(txt));
      if (i < answers.length) {
        const w = filled[i] !== null ? bank[filled[i]].w : '';
        const b = h(`<button class="blank ${w ? 'filled' : ''}" data-i="${i}" ${!w || locked[i] ? 'disabled' : ''} aria-label="Blank ${i + 1}${w ? ', ' + esc(w) : ', empty'}">${esc(w)}</button>`);
        line.append(b);
      }
    });
    bankEl.innerHTML = '';
    bank.forEach((b, idx) => bankEl.append(h(`<button class="chip ${filled.includes(idx) ? 'used' : ''}" data-id="${idx}" ${filled.includes(idx) ? 'disabled' : ''}>${esc(b.w)}</button>`)));
  }

  function check() {
    if (filled.some((f) => f === null)) return;
    const wrong = filled.map((f, i) => bank[f].w.toLowerCase() !== answers[i].toLowerCase());
    if (!wrong.some(Boolean)) {
      finished = true; $$('.blank', root).forEach((b) => b.classList.add('ok'));
      ctx.solved('The verse is complete.'); return;
    }
    sfx('oops', .4);
    $$('.blank', root).forEach((b, i) => { if (wrong[i]) b.classList.add('bad'); });
    ctx.miss?.(); ctx.say('Almost. Choose a filled blank to return its word to the bank, then try again.', 'soft');

  }

  root.addEventListener('click', (e) => {
    if (finished) return;
    const chip = e.target.closest('.chip'), blank = e.target.closest('.blank');
    if (chip) {
      const i = filled.findIndex((f) => f === null); if (i < 0) return;
      filled[i] = +chip.dataset.id; sfx('place', .5); buzz(8); render();
      if (e.detail === 0) ($(filled.includes(null) ? '.chip:enabled' : '.blank:enabled', root))?.focus();
      check();
    } else if (blank) {
      const i = +blank.dataset.i; if (filled[i] === null || locked[i]) return;
      const id = filled[i]; filled[i] = null; sfx('unplace', .4); render();
      if (e.detail === 0) $(`.chip[data-id="${id}"]`, root)?.focus();
    }
  });
  ctx.onHint(() => {
    if (finished) return;
    const i = filled.findIndex((f, k) => f === null || bank[f].w.toLowerCase() !== answers[k].toLowerCase());
    if (i < 0) return;
    const idx = bank.findIndex((b, k) => b.w.toLowerCase() === answers[i].toLowerCase() && !(filled.includes(k) && locked[filled.indexOf(k)]));
    const from = filled.indexOf(idx); if (from >= 0) filled[from] = null;
    filled[i] = idx; locked[i] = true; sfx('pluck', .5); render(); ctx.say('Hint: one word is now in place.', 'soft'); check();
  });
  render();
}
