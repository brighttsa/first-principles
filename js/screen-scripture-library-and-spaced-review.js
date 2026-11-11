// Scripture Library: saved verses with the lesson teaching and personal notes, plus "Remember" review.
// Review is Leitner spaced repetition: recall one key word of a saved verse; misses simply come back sooner.
import { activeWorldId, allWorlds } from './worlds-registry-active-world-and-progress-keys.js';
import { state, dueVerses, recordRecall } from './saved-progress-and-settings-state.js';
import { topbar } from './ui-navigation-topbar-sheet-and-confetti.js';
import { sfx } from './sound-effects-music-narration-haptics.js';
import { sprig } from './art-sprig-character-and-world-glyphs.js';
import { $, esc, shuffle, rng } from './core-utilities-and-dom-helpers.js';
import { BibleVerse, wireBibleReaders } from './bible-verse-reader-and-version-comparison-component.js';
import { bibleVersionOptions } from './bible-text-provider-and-authorized-translation-states.js';

const lessonFor = (ref) => allWorlds().flatMap((w) => w.lessons).find((l) => l.ref === ref);
const DISTRACT = ['water', 'flesh', 'works', 'heaven', 'church', 'mercy', 'light', 'Spirit', 'again', 'creature'];

export function renderLibrary(root, _p, go) {
  const refs = Object.keys(state.saved), due = dueVerses().filter(lessonFor);
  root.innerHTML = `<div class="screen" data-world="${activeWorldId()}">${topbar('Scripture Library')}<div class="page">
    <label class="library-bible-version">Read saved Scripture in<select data-bible-version aria-label="Bible version for the Scripture Library">${bibleVersionOptions(state.settings.bibleVersion)}</select></label>
    <p class="setting-note">KJV passages are available in the game. Other versions stay unavailable until approved text access is connected.</p>
    <div class="card library-feature"><p class="kicker" role="heading" aria-level="2" id="remember" tabindex="-1">Remember</p>
      ${refs.length ? (due.length ? `<p><b>${due.length}</b> verse${due.length > 1 ? 's are' : ' is'} ready for a quick memory check.</p><button class="btn" id="review">Start review</button>`
        : '<p>Nothing due right now. Come back tomorrow to keep your verses growing.</p>') : '<p>Reach Truth Revealed in a lesson to save its Scripture here.</p><button class="btn" id="library-learn">Go to Learn</button>'}</div>
    <div class="grid2" id="list">${refs.map((r) => { const L = lessonFor(r); return L ? `<article class="card"><h3>${esc(L.title)}</h3>${BibleVerse(r, state.settings.bibleVersion, { simple: state.level === 'child' })}${(L.support || []).map((v) => BibleVerse(v.ref, state.settings.bibleVersion, { simple: state.level === 'child' })).join('')}
      <p class="muted library-teaching">${esc(L.truth.teaching)}</p>${state.notes[L.id] ? `<p class="kicker">My notes</p><p>${esc(state.notes[L.id])}</p>` : ''}</article>` : ''; }).join('')}</div></div></div>`;
  wireBibleReaders(root);
  $('#library-learn', root)?.addEventListener('click', () => go('map'));
  $('#review', root)?.addEventListener('click', () => review(root, due, () => {
    renderLibrary(root, _p, go);
    ($('#review', root) || $('#remember', root)).focus();
  }));
}

function review(root, queue, exit) {
  const ref = queue[0], L = lessonFor(ref);
  if (!L) return exit();
  const key = L.truth.key, re = new RegExp(`\\b${key}\\b`, 'i');
  const text = L.verse.replace(re, '______');
  const opts = shuffle([key, ...DISTRACT.filter((d) => d.toLowerCase() !== key.toLowerCase()).slice(0, 3)], rng(ref.length));
  root.innerHTML = `<div class="screen" data-world="${activeWorldId()}">${topbar('Remember', { back: true })}<div class="page"><div class="card"><p class="kicker">${esc(ref)} · ${queue.length} left</p>
    <p class="kicker">${esc(ref)} · KJV review text</p><p class="verse" id="review-verse">${esc(text)}</p><p id="review-question" role="heading" aria-level="2" tabindex="-1" aria-describedby="review-verse">Which word completes the verse?</p><div class="opts">${opts.map((o) => `<button class="opt" data-w="${esc(o)}">${esc(o)}</button>`).join('')}</div><div id="fb" role="status"></div><div id="review-action" hidden><div class="row"><button class="btn" id="n">${queue.length > 1 ? 'Next' : 'Finish'}</button></div></div></div></div></div>`;
  $('[data-back]', root).onclick = exit;
  $('#review-question', root).focus();
  $('.opts', root).onclick = (e) => {
    const b = e.target.closest('.opt'); if (!b) return; const ok = b.dataset.w.toLowerCase() === key.toLowerCase();
    recordRecall(ref, ok); sfx(ok ? 'good' : 'oops', .5); b.classList.add(ok ? 'right' : 'wrong');
    $('.opts', root).querySelectorAll('.opt').forEach((x) => { x.disabled = true; if (x.dataset.w.toLowerCase() === key.toLowerCase()) x.classList.add('right'); });
    $('#fb', root).innerHTML = `<div class="feedback">${sprig(ok ? 'happy' : 'curious')}<div class="explain ${ok ? 'good' : 'bad'}">${ok ? 'Yes, you remembered it!' : `The missing word is "${esc(key)}". We will practise it again soon.`}</div></div>`;
    const next = $('#n', root);
    $('#review-action', root).hidden = false;
    next.onclick = () => (queue.length > 1 ? review(root, queue.slice(1), exit) : exit());
    next.focus();
  };
}
