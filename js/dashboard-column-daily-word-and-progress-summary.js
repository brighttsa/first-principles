// Right-hand panel: Daily Word, World Progress and a Growth Garden preview. Kept compact so the map stays the focus.
import { esc } from './core-utilities-and-dom-helpers.js';
import { mascot } from './art-mascot-sprout-with-expressions.js';
import { gardenScene } from './art-cartoon-landscape-scenes-and-adventure-map.js';
import { stats, achievementState, dailyDone, gardenPlantStages } from './progress-stats-achievements-and-daily-word-logic.js';
import { isDone } from './saved-progress-and-settings-state.js';

// Painted medal for an achievement id (assets/medals/painted/<id>.png); locked medals are faded, never hidden.
export const medalImg = (id, got, size = 56) => `<img src="assets/medals/painted/${id}.png" alt="" height="${size}" loading="lazy" style="height:${size}px;width:auto;${got ? '' : 'filter:grayscale(.85);opacity:.55'}">`;

export function dashboardColumn({ compact = false, world } = {}) {
  // The map passes its world so the ring follows the active world; screens that omit it keep the World 1 figures.
  const s = stats(), done = dailyDone(), ach = achievementState(world);
  const lessons = world ? world.lessons.filter((l) => isDone('t_' + l.id)).length : s.lessons, lessonsTotal = world ? world.lessons.length : s.lessonsTotal;
  const pct = Math.round((lessons / lessonsTotal) * 100);
  const ring = `<svg class="ring" viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="none" stroke="#EAF2FD" stroke-width="6"/><circle cx="22" cy="22" r="18" fill="none" stroke="#58CC65" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(pct * 1.131).toFixed(1)} 113" transform="rotate(-90 22 22)"/></svg>`;
  return `<aside class="dash" aria-label="Your progress">
    <div class="card dash-daily"><div class="dash-row">${mascot(done ? 'celebrating' : 'encouraging')}<div>
      <p class="kicker">Daily Word</p><h3>${done ? 'Done for today!' : 'Today\'s verse puzzle'}</h3></div></div>
      <button class="btn ${done ? 'alt' : ''}" data-go="daily">${done ? 'See today' : 'Play'}</button></div>
    <div class="card"><p class="kicker">World progress</p><div class="dash-row">${ring}<div><b class="big-n">${pct}%</b><p class="muted" style="margin:0">${lessons} of ${lessonsTotal} lessons</p></div></div></div>
    <div class="card garden-mini"><p class="kicker">Growth Garden</p><div class="garden-thumb">${gardenScene(gardenPlantStages(world), { preview: true, worldId: world?.id })}</div>
      <button class="btn alt" data-go="garden">Visit garden</button></div>
    ${compact ? `<div class="card"><p class="kicker">Achievements · ${ach.filter((a) => a.got).length}/${ach.length}</p><div class="medals">${ach.slice(0, 6).map((a) => `<div class="medal" title="${esc(a.name)}">${medalImg(a.id, a.got, 44)}</div>`).join('')}</div></div>` : ''}
  </aside>`;
}
