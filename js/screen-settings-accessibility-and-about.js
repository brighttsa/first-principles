// Settings: independent music / effects / narration / haptics, reduced motion, text size, reading level,
// distraction-free reading, reset. About section carries attribution and the review notice.
import { state, save, applySettings, resetAll } from './saved-progress-and-settings-state.js';
import { syncMusic, sfx } from './sound-effects-music-narration-haptics.js';
import { topbar, openSheet } from './ui-navigation-topbar-sheet-and-confetti.js';
import { $ } from './core-utilities-and-dom-helpers.js';
import { bibleVersionOptions } from './bible-text-provider-and-authorized-translation-states.js';

export function renderSettings(root) {
  const s = state.settings;
  const tog = (k, l) => `<label class="toggle"><span>${l}</span><input type="checkbox" data-k="${k}" ${s[k] ? 'checked' : ''}></label>`;
  root.innerHTML = `<div class="screen">${topbar('Settings')}<div class="page"><div class="card">
    <h2 class="setting-group-title">Reading</h2>
    <label class="toggle toggle-choice"><span>Bible version</span><select data-k="bibleVersion" aria-label="Preferred Bible version">${bibleVersionOptions(s.bibleVersion)}</select></label>
    <p class="setting-note">KJV is available in the game. Other versions will appear here when approved text access is connected. Exact-word Scripture puzzles stay labelled KJV.</p>
    <h2 class="setting-group-title">Sound</h2>${tog('music', 'Music')}${tog('sfx', 'Sound effects')}${tog('narration', 'Read aloud (narration)')}${tog('haptics', 'Vibration')}
    <h2 class="setting-group-title">Comfort</h2>
    <label class="toggle toggle-choice"><span>Reduce motion</span><select data-k="motion"><option value="auto">Follow my device</option><option value="on">Reduced</option><option value="off">Full motion</option></select></label>
    <label class="toggle toggle-range"><span>Text size</span><input type="range" min="0.9" max="1.4" step="0.1" value="${s.text}" data-k="text" aria-label="Text size"></label>
    ${tog('focus', 'Distraction-free lessons (hide extra study tools)')}
    ${tog('adaptive', 'Adaptive help and review')}
    <p class="setting-note">When on, the game shows the teaching again after two wrong answers, brings back ideas that were hard, and suggests a review. It never changes the Scripture, and it stays on this device.</p>
    <label class="toggle toggle-choice"><span>Reading level</span><select data-k="level"><option value="child">Seedling (children)</option><option value="teen">Sprout (teens)</option><option value="adult">Oak (adults)</option></select></label>
    <h2 class="setting-group-title">About</h2>
    <p class="setting-note">The in-game King James Version text is public domain. Other selected versions are shown as unavailable until their app access is approved. Sounds and artwork elements by Kenney (kenney.nl), CC0.</p>
    <div class="row"><button class="btn alt" id="reset">Reset all progress</button></div></div></div></div>`;
  $('[data-k=motion]', root).value = s.motion; $('[data-k=level]', root).value = state.level;
  root.onchange = root.oninput = (e) => {
    const k = e.target.dataset.k; if (!k) return;
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.type === 'range' ? +e.target.value : e.target.value;
    if (k === 'level') state.level = v; else s[k] = v;
    save(); applySettings(); syncMusic(); if (e.type === 'change') sfx('toggle');
  };
  $('#reset', root).onclick = () => {
    const modal = openSheet(`<h2 id="game-modal-title">Erase saved progress?</h2>
      <p>This removes lessons, saved verses, notes, achievements, and settings from this device. This cannot be undone.</p>
      <div class="row"><button class="btn alt" type="button" data-modal-cancel>Keep progress</button>
      <button class="btn danger" type="button" data-modal-confirm>Erase progress</button></div>`);
    modal.el.querySelector('[data-modal-cancel]').addEventListener('click', modal.close);
    modal.el.querySelector('[data-modal-confirm]').addEventListener('click', resetAll);
  };
  // The router reuses the root across screens.
  return () => { root.onchange = null; root.oninput = null; };
}
