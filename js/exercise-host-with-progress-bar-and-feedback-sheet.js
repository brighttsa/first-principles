// Exercise frame shared by lessons and the Daily Word: close button, thick progress bar, the puzzle itself,
// and a bottom feedback sheet. Correct = green sheet with a short Scripture explanation and Continue.
// Incorrect = gentle coral note, no penalty, retry. Companions react: Drizzle helps, Bloom celebrates.
import { esc, announce, $ } from './core-utilities-and-dom-helpers.js';
import { companion } from './art-mascot-sprout-with-expressions.js';
import { icons, sparkBurst } from './kenney-icon-and-sparkle-helpers.js';
import { sfx } from './sound-effects-music-narration-haptics.js';
import { citedVerses } from './answer-feedback-cited-verse-lookup.js';
import { BibleVerse, hydrateBibleReaders, wireBibleReaders } from './bible-verse-reader-and-version-comparison-component.js';
import { state } from './saved-progress-and-settings-state.js';
import { recordAttempt, needsSupport, adaptiveOn, challengeLevel } from './adaptive-learning-signals-mastery-and-review-scheduling.js';
import * as wordbuild from './puzzle-word-builder-tiles-drag-and-tap.js';
import * as wordgarden from './puzzle-word-garden-formation-and-discovery.js';
import * as complete from './puzzle-scripture-completion-word-bank.js';
import * as match from './puzzle-concept-matching-with-ribbons.js';
import * as wordsearch from './puzzle-word-search-grid-generator-and-selection.js';
import * as truthsort from './puzzle-truth-or-misconception-cards.js';
import * as reorder from './puzzle-word-order-sentence-reorder.js';
import * as detective from './puzzle-scripture-detective-evidence-finder.js';
import * as scripturetrail from './puzzle-scripture-trail-reveal-and-meaning.js';
import * as wordhunt from './puzzle-hidden-word-hunt-in-world-one.js';

const ENGINES = { wordbuild, wordgarden, complete, match, wordsearch, truthsort, reorder, detective, scripturetrail, wordhunt };
export const TYPE_NAMES = { wordbuild: 'Word Builder', wordgarden: 'Word Garden', complete: 'Scripture Completion', match: 'Truth Match', wordsearch: 'Word Search', truthsort: 'Truth or Misconception', reorder: 'Word Order', detective: 'Scripture Detective', scripturetrail: 'Scripture Trail', wordhunt: 'Hidden Word Hunt' };
const HINT_ICON = icons.bulb.replace('<svg', '<svg width="22" height="22"');

/**
 * Mount one exercise into `stage`. Returns a cleanup function.
 * opts: { level, label, pct (0-100), review (true when the puzzle returns as a review), onExit(), onSolved(p), onContinue() }
 */
export function runExercise(stage, p, opts) {
  const cleanups = []; let hintFn = () => {}; let solved = false;
  let misses = 0, hints = 0; // this attempt only; recordAttempt turns them into the learner's signals when the puzzle is solved
  const stepLabel = opts.label && /\bof\b/i.test(opts.label) ? `${TYPE_NAMES[p.type]} · ${opts.label}`
    : opts.label ? `${opts.label} · ${TYPE_NAMES[p.type]}` : TYPE_NAMES[p.type];
  stage.innerHTML = `<div class="ex rise"${p.adventure ? ' data-garden-exercise' : ''}>
    <div class="ex-top"><button class="iconbtn" data-exit aria-label="Leave lesson">✕</button><div class="ex-bar" role="progressbar" aria-label="Activity progress" aria-valuenow="${opts.pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${opts.pct}%"></i></div></div>
    <h1 class="kicker ex-heading">${esc(stepLabel)}</h1>
    <div class="ex-card" tabindex="-1" aria-label="${esc(TYPE_NAMES[p.type])}${opts.heading ? ', ' + esc(opts.heading) : opts.label ? ', ' + esc(opts.label) : ''}"><div id="pz"></div></div>
    <div class="ex-foot" id="foot" data-state="idle"></div></div>`;
  const foot = $('#foot', stage);
  wireBibleReaders(stage);
  $('[data-exit]', stage).onclick = () => opts.onExit?.();

  const useHint = () => {
    const keepFocus = foot.contains(document.activeElement);
    hints += 1; sfx('pluck2', .4); hintFn();
    if (keepFocus && !solved) $('#hint', foot)?.focus();
  };
  function idle(text = p.adventure ? '' : 'Take your time. There is no timer and no penalty.', mood = 'idle') {
    foot.dataset.state = 'idle';
    // After a wrong answer the hint button is offered more clearly (a stronger border only: no glow, no motion).
    const nudge = misses >= 1 && adaptiveOn() ? ' nudge' : '';
    foot.innerHTML = `<div class="ex-msg">${text ? `${companion('sprig', mood)}<p>${esc(text)}</p>` : ''}</div><button class="btn alt${nudge}" id="hint">${HINT_ICON} Hint</button>`;
    $('#hint', foot).onclick = useHint;
  }
  // After a second wrong answer the teaching is shown again, with its verse. There is no timer: the learner chooses when to try again.
  function support(text) {
    foot.dataset.state = 'support';
    const cited = citedVerses(p.learn || '', opts.verses || []);
    const verses = cited.length ? `<details class="ex-verses"><summary>Read ${cited.map((v) => esc(v.ref)).join(' and ')} · Puzzle Scripture (KJV)</summary>${cited.map((v) => BibleVerse(v.ref, 'KJV', { puzzleSource: true, simple: state.level === 'child' })).join('')}</details>` : '';
    foot.innerHTML = `<div class="ex-msg">${companion('sprig', 'curious')}<div><b>Let’s look at the teaching again</b><p>${esc(p.learn)}</p><p class="muted">${esc(text)}</p></div></div>${verses}
      <div class="row"><button class="btn" id="again">Try again</button><button class="btn alt" id="hint">${HINT_ICON} Hint</button></div>`;
    hydrateBibleReaders(foot);
    announce('Here is the teaching again. ' + p.learn);
    $('#again', foot).onclick = () => { sfx('page', .3); idle(); $('.ex-card', stage).focus(); };
    $('#hint', foot).onclick = useHint;
  }
  function bad(text) {
    if (needsSupport(misses) && p.learn) return support(text);
    foot.dataset.state = 'bad';
    foot.innerHTML = `<div class="ex-msg">${companion('sprig', 'thinking')}<div><b>Not quite</b><p>${esc(text)}</p></div></div><button class="btn alt" id="hint">${HINT_ICON} Hint</button>`;
    $('#hint', foot).onclick = useHint;
    announce(text);
  }
  function ok(text) {
    foot.dataset.state = 'ok';
    // The verse(s) the explanation cites, in KJV, collapsed so the answer feedback stays short.
    const cited = citedVerses(text, opts.verses || []);
    const verses = cited.length ? `<details class="ex-verses"><summary>Read ${cited.map((v) => esc(v.ref)).join(' and ')} (KJV)</summary>${cited.map((v) => `<p class="ex-verse"><span class="ref">${esc(v.ref)}</span> ${esc(v.text)}</p>`).join('')}</details>` : '';
    foot.innerHTML = `<div class="ex-msg">${companion('sprig', 'celebrating')}<div><b>You found it</b><p>${esc(text)}</p></div></div>${verses}<button class="btn big" id="cont">Continue</button>`;
    hydrateBibleReaders(foot);
    announce('Correct. ' + text); sparkBurst($('.ex-card', stage), 4); sfx('solved', .35);
    const c = $('#cont', foot); c.focus(); c.onclick = () => { sfx('page'); opts.onContinue?.(); };
  }
  idle();
  const ctx = {
    level: challengeLevel(p.id, opts.level, opts.review),
    motion: () => state.settings.motion === 'off' || (state.settings.motion === 'auto' && !matchMedia('(prefers-reduced-motion: reduce)').matches),
    // A message that starts with "Hint:" is help, not a wrong answer, so it is shown as help.
    say(t, tone) {
      if (solved) return;
      if (/^Hint:/.test(t) || tone === 'good') {
        idle(t, tone === 'good' ? 'happy' : 'curious'); announce(t);
      } else bad(t);
    },
    clearFeedback: () => { if (!solved) idle(); },
    miss: () => { misses += 1; },
    solved: (t) => { if (solved) return; solved = true; recordAttempt(p.id, { miss: misses, hint: hints, review: Boolean(opts.review) }); opts.onSolved?.(p); ok(p.afterLearn || p.learn || t); },
    onHint: (f) => { hintFn = f; }, cleanup: (f) => cleanups.push(f),
  };
  ENGINES[p.type].mount($('#pz', stage), p, ctx);
  // The control that led here (Start, Continue) was just removed; keep keyboard and screen-reader users in place.
  $('.ex-card', stage).focus({ preventScroll: true });
  return () => { cleanups.forEach((f) => f()); };
}
