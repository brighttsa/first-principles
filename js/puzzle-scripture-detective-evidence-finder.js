// Scripture Detective: read a passage, then tap the phrases that answer the question (the evidence).
// Some cases ask the player to use their evidence in a reply before closing the case.
import { h, esc, $, $$, shuffle } from './core-utilities-and-dom-helpers.js';
import { sfx, buzz } from './sound-effects-music-narration-haptics.js';

export function mount(root, p, ctx) {
  const picked = new Set(); let finished = false;
  const story = p.scenario ? `<p class="kicker">Story case</p><p>${esc(p.scenario)}</p>` : '';
  root.innerHTML = `${story}<p class="kicker">${esc(p.ref)} (KJV)</p><h2 class="det-q"></h2>
    <p class="muted">Tap the part (or parts) of the passage that answer the question.</p><div class="det-text" role="group" aria-label="Passage"></div>
    <div class="row"><button class="btn" id="check" disabled>Check my evidence</button></div>`;
  $('.det-q', root).textContent = p.question;
  const box = $('.det-text', root), check = $('#check', root);
  p.segments.forEach((s, i) => box.append(h(`<button class="seg" data-i="${i}" aria-pressed="false">${esc(s.t)}</button>`), document.createTextNode(' ')));

  const sync = () => { $$('.seg', root).forEach((b) => b.setAttribute('aria-pressed', picked.has(+b.dataset.i))); check.disabled = picked.size === 0; };
  root.addEventListener('click', (e) => {
    if (finished) return;
    const b = e.target.closest('.seg');
    if (b) { const i = +b.dataset.i; picked.has(i) ? picked.delete(i) : picked.add(i); sfx('tap', .4); buzz(8); $$('.seg.bad', root).forEach((x) => x.classList.remove('bad')); return sync(); }
    if (e.target.closest('#check')) {
      const need = p.segments.map((s, i) => (s.ev ? i : -1)).filter((i) => i >= 0);
      const wrong = [...picked].filter((i) => !p.segments[i].ev), missing = need.filter((i) => !picked.has(i));
      if (!wrong.length && !missing.length) {
        finished = true;
        if (p.reply) return mountReply(root, p, ctx, story);
        $$('.seg', root).forEach((x) => x.classList.toggle('ok', picked.has(+x.dataset.i)));
        return ctx.solved('You found the evidence.');
      }
      sfx('oops', .4); wrong.forEach((i) => $(`.seg[data-i="${i}"]`, root).classList.add('bad'));
      ctx.miss?.(); ctx.say(wrong.length ? 'Some of those phrases do not answer the question. Read the question again.' : `You are on the right track. There ${missing.length > 1 ? 'are more pieces' : 'is one more piece'} of evidence.`, 'soft');
    }
  });
  ctx.onHint(() => {
    if (p.hint) { ctx.say(`Hint: ${p.hint}`, 'good'); return; }
    const i = p.segments.findIndex((s, k) => s.ev && !picked.has(k)); if (i < 0) return;
    const b = $(`.seg[data-i="${i}"]`, root); b.classList.add('hint'); setTimeout(() => b.classList.remove('hint'), 2200);
    ctx.say('Hint: look at the glowing phrase.', 'good');
  });
  sync();
}


function mountReply(root, p, ctx, story) {
  const options = shuffle(p.reply.options);
  const evidence = p.segments.filter(segment => segment.ev).map(segment => segment.t).join(' ');
  root.innerHTML = `${story}<p class="kicker">Use your evidence</p>
    <h2 id="detective-reply" tabindex="-1">${esc(p.reply.question)}</h2>
    <details class="ex-verses"><summary>Review your evidence · ${esc(p.ref)} (KJV)</summary><p class="ex-verse">${esc(evidence)}</p></details>
    <div class="opts" role="group" aria-labelledby="detective-reply">${options.map((option, i) =>
      `<button class="opt" data-reply="${i}">${esc(option.t)}</button>`).join('')}</div>`;
  const group = $('.opts', root);
  ctx.onHint(() => ctx.say(`Hint: ${p.reply.hint}`, 'good'));
  ctx.say('You found the evidence. Now use it to choose a reply.', 'good');
  $('#detective-reply', root).focus();
  group.onclick = (event) => {
    const button = event.target.closest('[data-reply]');
    if (!button || button.disabled) return;
    const option = options[+button.dataset.reply];
    if (option.ok) {
      button.classList.add('right');
      $$('button', group).forEach(choice => { choice.disabled = true; });
      ctx.solved('You used the Scripture to answer the question.');
    } else {
      button.classList.add('wrong'); button.disabled = true; sfx('oops', .4);
      ctx.miss?.(); ctx.say(option.why, 'soft');
      if (event.detail === 0) $('button:enabled', group)?.focus();
    }
  };
}
