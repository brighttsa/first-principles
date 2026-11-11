// Living Storybook reader: one painted scene at a time, advanced by tapping or the Next button, with a meaningful action at the
// key beat (reveal the word's meaning, then a short reflective choice) before the story hands over to the lesson.
// Scripture is shown through the Bible reader so it stays verbatim KJV; narration text is plain description.
import { $, esc } from './core-utilities-and-dom-helpers.js';
import { mascot } from './art-mascot-sprout-with-expressions.js';
import { icons } from './kenney-icon-and-sparkle-helpers.js';
import { confetti } from './ui-navigation-topbar-sheet-and-confetti.js';
import { sfx, speak, stopSpeaking } from './sound-effects-music-narration-haptics.js';
import { state, save } from './saved-progress-and-settings-state.js';
import { BibleVerse, hydrateBibleReaders, wireBibleReaders } from './bible-verse-reader-and-version-comparison-component.js';
import { storyById, BACKDROP, SPRITE } from './story-living-storybook-content-a-new-beginning.js';

const SPEAKER_CLASS = { Jesus: 'is-scripture', Sprig: 'is-sprig', Nicodemus: 'is-person', Narrator: 'is-narrator' };

export function renderStorybook(root, _args, go) {
  const id = (location.hash.split('/')[2] || 'john3');
  const story = storyById(id);
  if (!story) { go('map'); return () => {}; }
  const scenes = story.scenes;
  let i = 0;

  const picture = (s) => `<picture><source media="(min-width:700px)" srcset="${SPRITE[s]}-768.webp"><img src="${SPRITE[s]}-384.webp" alt="" decoding="async"></picture>`;

  root.innerHTML = `<div class="screen lsb"><h1 class="sr-only">${esc(story.title)} — a story from ${esc(story.subtitle)}</h1>
    <div class="lsb-stage" id="lsb-stage">
      <img class="lsb-bg" id="lsb-bg" src="${BACKDROP.early}" alt="" decoding="async">
      <div class="lsb-veil" id="lsb-veil"></div>
      <div class="lsb-art" id="lsb-art" aria-hidden="true"></div>
      <button class="iconbtn lsb-close" id="lsb-close" aria-label="Leave the story">${icons.close}</button>
      <div class="lsb-dots" id="lsb-dots" aria-hidden="true"></div>
    </div>
    <div class="lsb-card" id="lsb-card"></div></div>`;

  const stage = $('#lsb-stage', root), bg = $('#lsb-bg', root), veil = $('#lsb-veil', root);
  const art = $('#lsb-art', root), dots = $('#lsb-dots', root), card = $('#lsb-card', root);
  dots.innerHTML = scenes.map((_, n) => `<i data-n="${n}"></i>`).join('');
  $('#lsb-close', root).onclick = () => go('map');

  function show(n, forward = true) {
    i = n;
    const s = scenes[n], last = n === scenes.length - 1;
    bg.src = s.night ? BACKDROP.night : (BACKDROP[s.bg] || BACKDROP.early);
    stage.dataset.night = s.night ? 'on' : 'off';
    art.innerHTML = s.sprite ? picture(s.sprite) : '';
    art.classList.remove('lsb-pop'); void art.offsetWidth; if (s.sprite) art.classList.add('lsb-pop');
    [...dots.children].forEach((d, k) => d.classList.toggle('on', k <= n));

    const text = s.reveal
      ? `${esc(s.reveal.before)}<button class="lsb-word" id="lsb-word">${esc(s.reveal.word)}</button>${esc(s.reveal.after)}`
      : esc(s.text);
    card.innerHTML = `<span class="lsb-sprig">${mascot(s.mood || 'idle')}</span>
      <p class="lsb-speaker ${SPEAKER_CLASS[s.speaker] || ''}">${esc(s.speaker)}${s.verse ? ' · ' + esc(s.verse) : ''}</p>
      <div class="lsb-text" id="lsb-text">${s.reveal ? '' : ''}<p>${text}</p></div>
      ${s.verse ? `<div class="lsb-verse">${BibleVerse(s.verse, 'KJV', { puzzleSource: true, simple: state.level === 'child' })}</div>` : ''}
      <div class="lsb-action" id="lsb-action"></div>`;
    card.classList.remove('lsb-rise'); void card.offsetWidth; card.classList.add('lsb-rise');
    if (s.verse) { hydrateBibleReaders(card); wireBibleReaders(card); }
    if (state.settings.narration) speak(s.text);

    const action = $('#lsb-action', root);
    if (s.reveal) {
      action.innerHTML = `<p class="lsb-hint">Tap the glowing word.</p>`;
      $('#lsb-word', root).onclick = () => {
        sfx('found', .4);
        $('#lsb-word', root).classList.add('is-open');
        action.innerHTML = `<p class="lsb-reveal">${esc(s.reveal.meaning)}</p>`;
        action.append(nextButton(last));
      };
    } else if (s.choice) {
      action.innerHTML = `<p class="lsb-ask">${esc(s.choice.prompt)}</p><div class="lsb-choices"></div>`;
      const box = $('.lsb-choices', action);
      s.choice.options.forEach((opt) => {
        const b = document.createElement('button'); b.className = 'btn alt lsb-choice'; b.textContent = opt.label;
        b.onclick = () => {
          sfx(opt.correct ? 'good' : 'oops', .4);
          box.querySelectorAll('button').forEach((x) => { x.disabled = true; });
          b.classList.add(opt.correct ? 'is-right' : 'is-soft');
          action.insertAdjacentHTML('beforeend', `<p class="lsb-reveal">${esc(opt.say)}</p>`);
          action.append(nextButton(true));
        };
        box.append(b);
      });
    } else {
      action.append(nextButton(last));
    }
    const heading = card.querySelector('.lsb-text');
    heading?.setAttribute('tabindex', '-1'); if (forward) heading?.focus({ preventScroll: true });
  }

  function nextButton(last) {
    const b = document.createElement('button'); b.className = 'btn big lsb-next';
    b.textContent = last ? 'Begin the lesson' : 'Next';
    b.onclick = () => { sfx('page', .4); last ? finish() : show(i + 1); };
    return b;
  }

  function finish() {
    (state.story ||= { read: {} }).read[story.id] = Date.now(); save();
    confetti(40);
    go('lesson/0');
  }

  // Tapping the scene advances only when nothing on the card is waiting for the reader.
  stage.addEventListener('click', (e) => {
    if (e.target.closest('.lsb-close')) return;
    const pending = $('#lsb-word', root) && !$('#lsb-word', root).classList.contains('is-open');
    const choosing = $('.lsb-choice', root) && !$('.lsb-choice[disabled]', root);
    if (!pending && !choosing && i < scenes.length - 1) { sfx('page', .3); show(i + 1); }
  });

  show(0, false);
  return () => stopSpeaking();
}
