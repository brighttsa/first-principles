// Progress: learning stats, educational achievements (Kenney medals), and a doorway to the Growth Garden.
import { esc, $ } from './core-utilities-and-dom-helpers.js';
import { achievementState } from './progress-stats-achievements-and-daily-word-logic.js';
import { medalImg, dashboardColumn } from './dashboard-column-daily-word-and-progress-summary.js';
import { topbar } from './ui-navigation-topbar-sheet-and-confetti.js';
import { companion } from './art-mascot-sprout-with-expressions.js';
import { duePuzzleIds, masteryOf } from './adaptive-learning-signals-mastery-and-review-scheduling.js';
import { isDone } from './saved-progress-and-settings-state.js';
import { activeWorld, lessonDoneKey } from './worlds-registry-active-world-and-progress-keys.js';

export function renderProgress(root, _p, go) {
  const world = activeWorld(), ach = achievementState(world), got = ach.filter((a) => a.got).length;
  const puzzles = world.lessons.flatMap(lesson => lesson.puzzles);
  const learned = world.lessons.filter(lesson => isDone(lessonDoneKey(lesson))).length;
  const secure = puzzles.filter(puzzle => masteryOf(puzzle.id) === 'secure').length;
  const due = duePuzzleIds(puzzles).length;
  const title = document.body.dataset.screen === 'achievements' ? 'Achievements' : 'Progress';
  root.innerHTML = `<div class="screen" data-world="${world.id}">${topbar(title)}<div class="page progress-layout"><div>
    ${title === 'Progress' ? `<section class="card learning-progress" aria-labelledby="learning-progress-title">
      <p class="kicker">World ${world.id}</p><h2 id="learning-progress-title">${esc(world.name)}</h2>
      <dl><div><dt>Lessons complete</dt><dd>${learned} of ${world.lessons.length}</dd></div>
      <div><dt>Ideas secure</dt><dd>${secure}</dd></div><div><dt>Ready to review</dt><dd>${due}</dd></div></dl>
      <p class="muted">An idea becomes secure after spaced practice and an independent recall.</p>
      ${due ? `<button class="btn alt" data-go="review/${world.id}">Review ideas</button>` : ''}</section>` : ''}
    <div class="card dash-row achievement-summary">${companion('sprig', 'happy')}<div><h2>${got} of ${ach.length} achievements</h2>
      <p class="muted">These celebrate what you have learned. They never measure your worth.</p></div></div>
    <div class="grid2 achievement-grid">${ach.map((a) => `<div class="card ach ${a.got ? '' : 'locked'}">${medalImg(a.id, a.got, 60)}<div><b>${esc(a.name)}</b><br><span class="muted achievement-note">${esc(a.note)}</span></div></div>`).join('')}</div>
    <div class="row achievement-actions"><button class="btn" data-go="garden">Visit my Growth Garden</button></div></div>
    ${dashboardColumn({ compact: true, world })}</div></div>`;
  root.firstElementChild.addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });
}
