// The Bible-study side of a lesson: KJV verse, the lesson explanation, personal notes.
// On desktop this is the persistent right column; on phones it sits under the puzzle.
import { esc, $ } from './core-utilities-and-dom-helpers.js';
import { state, save } from './saved-progress-and-settings-state.js';
import { BibleVerse } from './bible-verse-reader-and-version-comparison-component.js';

export function studyPanel(L, openVerse) {
  const kid = state.level === 'child';
  const contents = `
    <details class="card study-primary" ${openVerse ? 'open' : ''}><summary class="ref study-summary">${esc(L.ref)} · Read the verse</summary>
      ${BibleVerse(L.ref, state.settings.bibleVersion, { simple: kid })}</details>
    <details class="card study-more-tools"><summary class="study-summary">More study tools</summary><div class="study-more-content">
      ${(L.support || []).length ? `<details class="study-extra"><summary class="ref study-summary">More verses to read</summary>${L.support.map((v) => BibleVerse(v.ref, state.settings.bibleVersion, { simple: kid })).join('')}</details>` : ''}
      <div class="study-extra"><p class="kicker">What Scripture teaches</p><p>${esc(kid ? L.introKid : L.intro)}</p>
        <p class="muted study-citation-note">Scripture is quoted from the King James Version.</p></div>
      <div class="study-extra"><label class="kicker" for="notes">My notes</label>
        <textarea id="notes" class="notes" placeholder="Write what you are learning...">${esc(state.notes[L.id] || '')}</textarea></div></div></details>`;
  return `<aside class="study" aria-label="Scripture study">${L.fieldLesson
    ? `<details class="field-disclosure"><summary>Scripture and study notes</summary><div class="field-study-content">${contents}</div></details>`
    : contents}</aside>`;
}

export function wireStudyPanel(root, L) {
  $('#notes', root)?.addEventListener('input', (e) => { state.notes[L.id] = e.target.value; save(); });
}
