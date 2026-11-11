// Welcome + two-step onboarding: choose a reading level, then comfort settings. Scenic, cinematic, portrait-first.
import { sunriseScene } from './art-cartoon-landscape-scenes-and-adventure-map.js';
import { companion } from './art-mascot-sprout-with-expressions.js';
import { state, save, applySettings } from './saved-progress-and-settings-state.js';
import { activeWorldId } from './worlds-registry-active-world-and-progress-keys.js';
import { sfx, syncMusic, speak } from './sound-effects-music-narration-haptics.js';
import { icons } from './kenney-icon-and-sparkle-helpers.js';
import { $ } from './core-utilities-and-dom-helpers.js';

const LEVELS = [
  ['child', icons.star, 'Seedling', 'Big letters, short words, and a voice to read along.'],
  ['teen', icons.map, 'Sprout', 'Fuller teachings and trickier puzzles.'],
  ['adult', icons.book, 'Oak', 'Deeper study, cross-references and reflection.'],
];

export function renderWelcome(root, _p, go) {
  let step = 0;
  root.innerHTML = `<div class="screen scenic full">${sunriseScene(state.started ? activeWorldId() : 1)}<div class="content" id="c"></div></div>`;
  const c = $('#c', root);

  function draw(moveFocus = false) {
    c.onclick = null; c.onchange = null;
    if (step === 0) {
      c.innerHTML = `<div class="rise panel"><div class="cast">${companion('sprig', 'celebrating')}</div>
        <h1 class="logo"><small>The Living Adventure</small>First Principles</h1>
        <p class="tagline">Discover the Word. Grow in Faith. Live the Truth.</p>
        <div class="stack">${state.started
          ? '<button class="btn big" id="cont">Continue journey</button><button class="btn alt" id="begin">Change reading setup</button>'
          : '<button class="btn big" id="begin">Begin journey</button>'}</div></div>`;
      $('#begin', c).onclick = () => { sfx('page'); step = 1; draw(true); };
      $('#cont', c)?.addEventListener('click', () => { sfx('page'); go('map'); });
    } else if (step === 1) {
      c.innerHTML = `<div class="card rise"><p class="kicker">Welcome</p><h1 class="onboarding-heading" tabindex="-1">Choose your reading level</h1>
        <div class="levels">${LEVELS.map(([id, e, n, d]) => `<button class="level" data-l="${id}" aria-pressed="${state.level === id}"><span class="big">${e}</span><span><b>${n}</b>${d}</span></button>`).join('')}</div>
        <p class="muted onboarding-note">Everyone learns the same teachings. You can change this any time in Settings.</p>
        <div class="row"><button class="btn big" id="next">Next</button></div></div>`;
      c.onclick = (e) => { const b = e.target.closest('.level'); if (!b) return; state.level = b.dataset.l; save(); applySettings(); sfx('tap'); c.querySelectorAll('.level').forEach(item => item.setAttribute('aria-pressed', String(item === b))); };
      $('#next', c).onclick = () => { sfx('page'); step = 2; draw(true); };
    } else {
      const s = state.settings;
      c.innerHTML = `<div class="card rise"><p class="kicker">Make it comfortable</p><h1 class="onboarding-heading" tabindex="-1">How would you like to play?</h1>
        ${[['sfx', 'Sound effects'], ['music', 'Gentle music'], ['narration', 'Read aloud to me'], ['haptics', 'Vibration feedback']].map(([k, l]) => `<label class="toggle"><span>${l}</span><input type="checkbox" data-k="${k}" ${s[k] ? 'checked' : ''}></label>`).join('')}
        <label class="toggle"><span>Reduce motion</span><input type="checkbox" data-k="motion" ${s.motion === 'on' ? 'checked' : ''}></label>
        <div class="row"><button class="btn alt" id="setup-back">Back</button><button class="btn big" id="go">Start exploring</button></div></div>`;
      c.onchange = (e) => {
        const k = e.target.dataset.k; if (!k) return;
        state.settings[k] = k === 'motion' ? (e.target.checked ? 'on' : 'auto') : e.target.checked; save(); applySettings(); syncMusic(); sfx('toggle');
      };
      $('#setup-back', c).onclick = () => { step = 1; draw(true); };
      $('#go', c).onclick = () => { state.started = true; save(); sfx('chapter', .5); if (state.settings.narration) speak('Welcome to First Principles!'); go('map'); };
    }
    if (moveFocus) $('h1', c)?.focus();
  }
  draw();
}
