// Review session: a few exercises in a row on the ideas that are due, or, when nothing is due, the ideas the learner has practised least.
// Same exercise frame as lessons and the Daily Word, so hints, the teaching card and recording all work unchanged.
// No points, no streak, no timer: the summary only says what was remembered on its own and what will come back soon.
import { $, esc } from './core-utilities-and-dom-helpers.js';
import { state } from './saved-progress-and-settings-state.js';
import { companion } from './art-mascot-sprout-with-expressions.js';
import { allWorlds, worldById } from './worlds-registry-active-world-and-progress-keys.js';
import { duePuzzleIds, practicePuzzleIds, learnRecord } from './adaptive-learning-signals-mastery-and-review-scheduling.js';
import { runExercise, TYPE_NAMES } from './exercise-host-with-progress-bar-and-feedback-sheet.js';
import { lessonVerses } from './answer-feedback-cited-verse-lookup.js';
import { topbar } from './ui-navigation-topbar-sheet-and-confetti.js';
import { sfx } from './sound-effects-music-narration-haptics.js';

const everyLesson = () => allWorlds().flatMap((w) => w.lessons);
const lessonOf = (puzzleId) => everyLesson().find((l) => l.puzzles.some((p) => p.id === puzzleId));

/** The exercises for one session: due ideas first, otherwise the least secure learned ones. Children get a shorter session. */
function buildSession(lessons) {
  const puzzles = lessons.flatMap((l) => l.puzzles), size = state.level === 'child' ? 3 : 5;
  const dueAll = duePuzzleIds(puzzles), due = dueAll.slice(0, size);
  const ids = due.length ? due : practicePuzzleIds(puzzles, 3);
  return { kind: due.length ? 'due' : 'practice', waiting: dueAll.length, items: ids.map((id) => puzzles.find((p) => p.id === id)) };
}

export function renderReview(root, { n }, go) {
  let stop = () => {};
  const world = worldById(n), lessons = world ? world.lessons : everyLesson();
  const heading = world ? `Review · ${world.name}` : 'Review';
  let session = buildSession(lessons);
  const results = [];

  function start(moveFocus = false) {
    stop();
    const n = session.items.length;
    const lead = !n ? 'Nothing to review yet. Finish a lesson and your ideas will appear here.'
      : session.kind === 'due' ? `${session.waiting === 1 ? '1 idea is' : session.waiting + ' ideas are'} ready to review. We will do ${n} now.`
        : 'Nothing is due right now. Here are a few ideas worth practising again.';
    root.innerHTML = `<div class="screen">${topbar(esc(heading))}<div class="page"><div class="card talk rise">
      ${companion('sprig', n ? 'happy' : 'curious')}<h2>${n ? 'Let’s revisit what you learned' : 'No review yet'}</h2>
      <p>${esc(lead)}</p>${n ? `<p class="muted">${n} short exercise${n === 1 ? '' : 's'} · no timer · no penalty</p>` : ''}
      <div class="row"><button class="btn big ${n ? '' : 'hide'}" id="go">Start review</button><button class="btn alt" id="path">Back to the path</button></div></div></div></div>`;
    if (moveFocus) ($('#go:not(.hide)', root) || $('#path', root)).focus();
    $('#go', root)?.addEventListener('click', () => { sfx('page'); play(0); });
    $('#path', root).onclick = () => go('map');
  }

  function play(i) {
    if (i >= session.items.length) return summary();
    stop();
    const p = session.items[i], lesson = lessonOf(p.id), before = learnRecord(p.id)?.clean || 0;
    root.innerHTML = `<div class="screen"><div class="page"><div id="stage" class="stage"></div></div></div>`;
    stop = runExercise($('#stage', root), p, {
      level: state.level, verses: lesson ? lessonVerses(lesson) : [], review: true, heading: 'Practice review',
      label: `Review ${i + 1} of ${session.items.length}`, pct: Math.round((i / session.items.length) * 100),
      onExit: () => (results.length ? summary() : start(true)),
      onSolved: () => results.push({ p, lesson, clean: (learnRecord(p.id)?.clean || 0) > before }),
      onContinue: () => play(i + 1),
    });
  }

  function summary() {
    stop();
    const clean = results.filter((r) => r.clean).length, more = buildSession(lessons).waiting;
    const rows = results.map((r) => `<li class="review-row" data-clean="${r.clean}"><b>${esc(r.lesson?.title || TYPE_NAMES[r.p.type])}</b>
      <span>${esc(TYPE_NAMES[r.p.type])}</span><em>${r.clean ? 'Remembered on your own' : 'We’ll bring this back soon'}</em></li>`).join('');
    root.innerHTML = `<div class="screen">${topbar(esc(heading))}<div class="page"><div class="card talk rise">
      ${companion('sprig', 'celebrating')}<h2 tabindex="-1">Review complete</h2>
      <p>${results.length === 0 ? 'No exercises were finished this time.' : `You went over ${results.length} idea${results.length === 1 ? '' : 's'}, and ${clean === results.length ? 'remembered every one on your own' : clean + ' of them came back clearly'}.`}</p>
      <ul class="review-list">${rows}</ul>
      <div class="row"><button class="btn big" id="path">Back to the path</button>${more ? `<button class="btn alt" id="more">Review ${more} more</button>` : ''}</div></div></div></div>`;
    $('#path', root).onclick = () => go('map');
    $('h2', root).focus();
    $('#more', root)?.addEventListener('click', () => { sfx('page'); session = buildSession(lessons); results.length = 0; start(true); });
  }

  start();
  return () => stop();
}
