// Truth Revealed: the journal page that unfolds after a lesson's puzzles. Saves the verse to the Library
// and schedules it for spaced review. Adults also get cross-references; everyone gets an optional reflection.
import { esc, $ } from './core-utilities-and-dom-helpers.js';
import { sprig } from './art-sprig-character-and-world-glyphs.js';
import { state, save, saveVerse, markDone } from './saved-progress-and-settings-state.js';
import { sfx, speak } from './sound-effects-music-narration-haptics.js';
import { confetti } from './ui-navigation-topbar-sheet-and-confetti.js';

export function truthCard(L, i, total, { next }) {
  const T = L.truth, lvl = state.level;
  const body = lvl === 'child' ? T.kid : T.teaching;
  const deeper = lvl === 'adult' ? `<p class="kicker">Go deeper</p><p>${T.deeper.map(esc).join(' · ')}</p>` : '';
  const support = (L.support || []).slice(0, lvl === 'child' ? 1 : 9).map((v) =>
    `<p class="verse"><span class="ref">${esc(v.ref)} (KJV)</span><br>${esc(v.text)}</p>`).join('') + deeper;
  const reflection = `<label class="kicker" for="reflect">${lvl === 'adult' ? 'Reflect' : 'Think about it (optional)'}</label>
    <p>${esc(T.reflection)}</p><textarea id="reflect" class="notes" placeholder="Your thoughts..."></textarea>`;
  const actions = `<div class="row"><button class="btn alt" data-listen>Listen</button><button class="btn" id="next">${i < total - 1 ? 'Next lesson' : 'Knowledge Challenge'}</button></div>`;
  const saved = `<div class="feedback">${sprig('cheer')}<div class="bubble">Saved to your Scripture Library and planted in your Growth Garden.</div></div>`;
  const fieldExtras = L.fieldLesson ? `<div class="field-truth-extras">
    ${support ? `<details class="field-disclosure"><summary>Read supporting Scripture (KJV)</summary><div>${support}</div></details>` : ''}
    <details class="field-disclosure"><summary>Reflect and write a note</summary><div>${reflection}</div></details></div>` : '';
  const html = `<div class="card truth unfold"><p class="kicker">Truth revealed</p><h2>${esc(L.title)}</h2>
    <p class="ref">${esc(L.ref)} (KJV)</p><p class="verse">${esc(L.verse)}</p><p>${esc(body)}</p>
    ${L.fieldLesson ? saved + actions + fieldExtras : support + saved + reflection + actions}</div>`;
  return {
    html,
    wire(root) {
      markDone('t_' + L.id); saveVerse(L.ref); sfx('page'); confetti(14);
      const r = $('#reflect', root); r.value = state.notes['r_' + L.id] || '';
      r.addEventListener('input', () => { state.notes['r_' + L.id] = r.value; save(); });
      $('[data-listen]', root).onclick = () => speak(`${L.title}. ${body}`, true);
      $('#next', root).onclick = next;
    },
  };
}
