// Daily Word: one short Scripture exercise per day, the same for everyone. Completing it only adds to
// "days practiced"; missing a day costs nothing.
import { $, esc } from './core-utilities-and-dom-helpers.js';
import { state, markDone } from './saved-progress-and-settings-state.js';
import { companion } from './art-mascot-sprout-with-expressions.js';
import { dailyPuzzle, dailyDone, markDailyDone, stats } from './progress-stats-achievements-and-daily-word-logic.js';
import { runExercise } from './exercise-host-with-progress-bar-and-feedback-sheet.js';
import { topbar } from './ui-navigation-topbar-sheet-and-confetti.js';
import { sfx } from './sound-effects-music-narration-haptics.js';
import { adaptiveOn, duePuzzleIds, learnRecord } from './adaptive-learning-signals-mastery-and-review-scheduling.js';
import { allWorlds } from './worlds-registry-active-world-and-progress-keys.js';

export function renderDaily(root, _p, go) {
  let stop = () => {};
  function summary() {
    stop(); const done = dailyDone(), s = stats();
    // Ideas still due for review: offer the longer review session (only when adaptive help is on).
    const due = adaptiveOn() ? duePuzzleIds(allWorlds().flatMap((w) => w.lessons.flatMap((l) => l.puzzles))).length : 0;
    root.innerHTML = `<div class="screen">${topbar('Daily Word', { heading: false })}<div class="page"><div class="card talk rise">
      ${companion('bloom', done ? 'cheer' : 'happy')}<p class="kicker">${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      <h1>${done ? 'You did it!' : 'Today\'s Daily Word'}</h1>
      <p>${done ? 'Today\'s Scripture exercise is complete. A fresh one arrives tomorrow.' : 'One short exercise from the Word. No timer, no pressure.'}</p>
      <p class="muted">${s.days} day${s.days === 1 ? '' : 's'} practiced in total</p>
      <div class="row"><button class="btn big ${done ? 'hide' : ''}" id="start">Start</button>${due ? `<button class="btn alt" id="review">Review ${due} idea${due === 1 ? '' : 's'}</button>` : ''}<button class="btn alt" id="path">Back to the path</button></div></div></div></div>`;
    $('#review', root)?.addEventListener('click', () => go('review'));
    $('#start', root).onclick = () => { sfx('page'); play(); };
    $('#path', root).onclick = () => go('map');
  }
  function play() {
    root.innerHTML = `<div class="screen"><div class="page"><div id="stage" class="stage"></div></div></div>`;
    const puzzle = dailyPuzzle();
    stop = runExercise($('#stage', root), puzzle, {
      level: state.level, label: 'Daily Word', pct: 100, review: Boolean(learnRecord(puzzle.id)),
      onExit: summary, onSolved: (p) => { markDailyDone(); markDone('d_' + p.id); }, onContinue: summary,
    });
  }
  summary();
  return () => stop();
}
