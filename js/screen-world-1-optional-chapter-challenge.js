// Optional World 1 capstone host. Each puzzle saves separately so an interrupted run resumes at its first unfinished stop.
import { $ } from './core-utilities-and-dom-helpers.js';
import { activeWorld } from './worlds-registry-active-world-and-progress-keys.js';
import { state, markDone, isDone } from './saved-progress-and-settings-state.js';
import { lessonVerses } from './answer-feedback-cited-verse-lookup.js';
import { runExercise } from './exercise-host-with-progress-bar-and-feedback-sheet.js';
import { topbar } from './ui-navigation-topbar-sheet-and-confetti.js';
import { companion } from './art-mascot-sprout-with-expressions.js';
import { CHAPTER_CHALLENGE_COMPLETE_KEY, chapterChallengeDoneKey } from './world-1-chapter-challenge-content.js';

function challengeComplete(root, go) {
  root.innerHTML = `<div class="screen">${topbar('Chapter Challenge', { back: true, heading: false })}
    <div class="page"><section class="card talk rise challenge-finish">
      ${companion('sprig', 'celebrating')}<p class="kicker">Optional chapter challenge</p>
      <h1>Challenge complete</h1>
      <p>You connected new life in Christ, the gift of eternal life, and what Romans 10:9 says about salvation.</p>
      <button class="btn big" id="return">Back to chapter</button>
    </section></div></div>`;
  $('[data-back]', root).onclick = () => go('complete');
  $('#return', root).onclick = () => go('complete');
}

export function renderChapterChallenge(root, _params, go) {
  if (activeWorld().id !== 1) return go('complete');
  let stop = () => {};
  const world = activeWorld(), stages = world.chapterChallenge;
  const verses = world.lessons.flatMap(lessonVerses);

  function show() {
    stop();
    const index = stages.findIndex((p) => !isDone(chapterChallengeDoneKey(p.id)));
    if (index < 0) {
      markDone(CHAPTER_CHALLENGE_COMPLETE_KEY);
      return challengeComplete(root, go);
    }
    const puzzle = stages[index];
    root.innerHTML = `<div class="screen">${topbar('Chapter Challenge', { back: true, heading: false })}
      <div class="page"><section id="challenge-stage" class="stage chapter-challenge-stage"></section></div></div>`;
    $('[data-back]', root).onclick = () => go('complete');
    stop = runExercise($('#challenge-stage', root), puzzle, {
      level: state.level, heading: 'Chapter Challenge', label: `Stop ${index + 1} of ${stages.length}`,
      pct: Math.round((index / stages.length) * 100), verses,
      onExit: () => go('complete'),
      onSolved: () => {
        markDone(chapterChallengeDoneKey(puzzle.id));
        if (index === stages.length - 1) markDone(CHAPTER_CHALLENGE_COMPLETE_KEY);
      },
      onContinue: show,
    });
  }
  show();
  return () => stop();
}
