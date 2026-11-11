// The Learn screen: a playable adventure map for the active world. Each real lesson has a landmark and a marker placed on
// the winding stone path. Marker state comes from saved progress; lessons unlock in order, finished ones replay.
import { guideMascot, prepareGuideMotion } from './art-mascot-sprout-with-expressions.js';
import { icon, sparkBurst } from './kenney-icon-and-sparkle-helpers.js';
import { WORLDS } from './worlds-overview-six-world-metadata.js';
import { isDone, state } from './saved-progress-and-settings-state.js';
import { dashboardColumn } from './dashboard-column-daily-word-and-progress-summary.js';
import { sfx } from './sound-effects-music-narration-haptics.js';
import { toast, esc } from './core-utilities-and-dom-helpers.js';
import { environmentMarkup, mountEnvironment } from './world-environment-renderer.js';
import { worldOneUnifiedScene } from './world-1-unified-plate-scene.js';
import { worldTwoUnifiedScene } from './world-2-unified-plate-scene.js';
import { activeWorld, activeWorldId, allWorlds, isWorldUnlocked, setActiveWorld, worldById, reviewDoneKey } from './worlds-registry-active-world-and-progress-keys.js';
import { adaptiveSuggestion } from './adaptive-learning-signals-mastery-and-review-scheduling.js';

// Each world has its own painting, so each composition has its own landmark positions (percent of the map frame).
// Landscape coordinates include the right-edge crop. Index order = lesson order, review last.
const MAP_LAYOUTS = {
  1: { portrait: [[72, 22], [64, 39], [58, 56], [60, 76], [66, 91]], landscape: [[17, 48], [36, 55], [54, 76], [70, 53], [86, 72]], scene: worldOneUnifiedScene },
  2: { portrait: [[48, 80], [68, 64], [36, 38], [74, 47], [62, 26]], landscape: [[14, 56], [36, 72], [73, 72], [89, 60], [82, 33]], scene: worldTwoUnifiedScene },
};

// World 1 is the default so screens that are still World 1 only (garden, achievements) keep their meaning.
export const worldProgress = (world = worldById(1)) => {
  const total = world.lessons.reduce((count, lesson) => count + lesson.puzzles.length + 1, 1);
  const completed = world.lessons.reduce((count, lesson) => count + (isDone('t_' + lesson.id)
    ? lesson.puzzles.length + 1 : lesson.puzzles.filter(puzzle => isDone(puzzle.id)).length), Number(isDone(reviewDoneKey(world))));
  return completed / total;
};

/** Marker states for [lesson1..lessonN, mastery], from actual progress. */
export function mapStates(world = worldById(1)) {
  const L = world.lessons.map((l) => isDone('t_' + l.id)), cur = L.indexOf(false), mastered = isDone(reviewDoneKey(world));
  return [...L.map((d, i) => (d ? 'done' : i === cur ? 'cur' : 'lock')), mastered ? 'done' : cur < 0 ? 'cur' : 'lock'];
}

function nextStop(states, world) {
  const index = states.indexOf('cur');
  const lesson = world.lessons[index];
  if (lesson) return {
    context: `Lesson ${index + 1} of ${world.lessons.length}`,
    title: lesson.title,
    action: lesson.puzzles.some(puzzle => isDone(puzzle.id)) ? 'Resume lesson' : 'Start lesson',
    route: 'lesson/' + index,
  };
  if (index === world.lessons.length) return {
    context: 'Next stop', title: 'Chapter review', action: 'Start review', route: 'quiz',
  };
  return {
    context: 'Journey complete', title: 'Chapter review finished', action: 'View results', route: 'complete',
  };
}

function nextStopMarkup(states, world, pct) {
  const stop = nextStop(states, world);
  // One quiet suggestion from what the learner has actually done: an idea due for review, or a lesson worth revisiting. None for new learners.
  const tip = adaptiveSuggestion({ world, allPuzzles: allWorlds().flatMap((w) => w.lessons.flatMap((l) => l.puzzles)), currentIndex: states.indexOf('cur') });
  const suggestion = tip ? `<p class="map-suggest"><span>${esc(tip.text)}</span><button type="button" class="map-suggest-action" data-go="${tip.route}">${esc(tip.action)}</button></p>` : '';
  const wordLevels = world.id === 1 ? world.lessons.flatMap(lesson => lesson.puzzles.filter(puzzle => puzzle.type === 'wordgarden')) : [];
  const nextWordLesson = world.lessons.findIndex(lesson => lesson.puzzles.some(puzzle => puzzle.type === 'wordgarden' && !isDone(puzzle.id))
    && lesson.puzzles.filter(puzzle => puzzle.type !== 'wordgarden').every(puzzle => isDone(puzzle.id)));
  const completedWordLevels = wordLevels.filter(puzzle => isDone(puzzle.id)).length;
  const wordGarden = nextWordLesson >= 0 && completedWordLevels < wordLevels.length
    ? `<p class="map-suggest map-word-garden-invite"><span>Optional Word Garden · ${completedWordLevels} of ${wordLevels.length} levels complete</span><button type="button" class="map-suggest-action" data-go="lesson/${nextWordLesson}">Continue</button></p>` : '';
  const locate = states.includes('cur')
    ? '<button class="map-locate" type="button" data-world-next aria-describedby="map-next-title">Show on map</button>' : '';
  return `<section class="map-next-stop" aria-label="Journey progress">
    <div class="map-journey-heading"><div><p class="kicker">World ${world.id}</p><h1>${esc(world.name)}</h1></div>${locate}
      <div class="ex-bar" role="progressbar" aria-label="World ${world.id} activity progress" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div></div>
    <div class="map-journey-next"><p class="map-next-context">${esc(stop.context)}</p><p class="map-next-title" id="map-next-title">${esc(stop.title)}</p></div>
    <button class="map-next-action" type="button" data-go="${stop.route}" aria-describedby="map-next-title">${esc(stop.action)}${icon('arrowRight')}</button>${wordGarden}${suggestion}
  </section>`;
}

function marker(i, st, label, kind, layout) {
  const [x, y] = layout.portrait[i];
  const [wideX, wideY] = layout.landscape[i];
  const face = st === 'done' ? icon('star') : st === 'lock' ? icon('locked') : `${icon('arrowRight')}<b>PLAY</b>`;
  return `<div class="mnode ${st}" data-kind="${kind}" style="--node-x:${x}%;--node-y:${y}%;--wide-x:${wideX}%;--wide-y:${wideY}%"><button class="mbtn" data-kind="${kind}" data-i="${i}" ${st === 'cur' ? 'aria-current="step"' : ''} aria-label="${esc(label)}${st === 'lock' ? ', locked' : st === 'done' ? ', completed' : ', play'}">${face}</button><span class="mlabel">${esc(label)}</span></div>`;
}

/** Soft desaturating mist over the part of the map the learner has not reached yet. */
function fog(st, layout) {
  const next = st.findIndex((x) => x === 'lock'); if (next < 0) return '';
  const top = Math.max(0, layout.portrait[next][1] - 9);
  const left = (layout.landscape[next - 1][0] + layout.landscape[next][0]) / 2;
  return `<div class="fog" style="--fog-top:${top}%;--fog-left:${left}%"></div>`;
}

// Track reactions within the visit. Persistent scenery always comes from the saved lesson state.
const seen = {};
const seenFor = (world) => seen[world.id] ||= { completed: mapStates(world).filter(value => value === 'done').length, mastery: isDone(reviewDoneKey(world)) };

function worldChip(world) {
  const current = world.id === activeWorldId();
  const locked = !world.ready || !isWorldUnlocked(world.id);
  const status = !world.ready ? ', unavailable' : locked ? ', locked until the World ' + (world.id - 1) + ' review is done' : '';
  return `<button class="wchip" style="--world-color:${world.color};--world-deep:${world.deep}" data-world="${world.id}" ${locked ? 'data-locked' : ''}
    aria-label="World ${world.id}: ${esc(world.name)}${status}" ${current ? 'aria-current="true"' : ''}>${locked ? icon('locked') : ''}<span>${world.id}</span></button>`;
}

export function renderMap(root, _p, go) {
  const world = activeWorld(), layout = MAP_LAYOUTS[world.id], tally = seenFor(world);
  const st = mapStates(world), pct = Math.round(worldProgress(world) * 100);
  const nodes = world.lessons.map((l, i) => marker(i, st[i], `${i + 1} · ${l.title}`, 'lesson', layout)).join('') + marker(world.lessons.length, st[world.lessons.length], 'Chapter review', 'quiz', layout);
  const completed = st.filter(value => value === 'done').length;
  const mastered = isDone(reviewDoneKey(world));
  const newMastery = mastered && !tally.mastery;
  const newMilestone = completed > tally.completed;
  tally.completed = completed;
  tally.mastery = mastered;
  const guideMood = newMilestone ? 'celebrating' : 'happy';
  const environment = environmentMarkup({
    ...layout.scene(st), fog: fog(st, layout),
    guide: guideMascot(guideMood, newMilestone), landmarks: nodes, mastered,
  });
  root.innerHTML = `<div class="screen mapscreen"><div class="map-layout"><section class="map-col" aria-label="World ${world.id} adventure map">
    <div class="world-strip" role="group" aria-label="Learning worlds">${WORLDS.map(worldChip).join('')}</div>
    ${nextStopMarkup(st, world, pct)}${environment}</section>${dashboardColumn({ world })}</div></div>`;
  const screen = root.firstElementChild;
  const scene = screen.querySelector('.living-world');
  if (world.id !== 1) scene.dataset.world = world.id; // per-world art tweaks in CSS; World 1 keeps its original markup
  const motion = mountEnvironment(scene);
  const guide = scene.querySelector('.world-guide');
  let reaction, celebrationFrame, removeBurst;
  prepareGuideMotion(guide);
  function showGuide(mood) {
    guide.innerHTML = guideMascot(mood);
    prepareGuideMotion(guide);
  }
  function react(mood) {
    showGuide(mood);
    clearTimeout(reaction);
    reaction = setTimeout(() => showGuide(guideMood), 850);
  }
  function burst(anchor, count) {
    removeBurst?.();
    removeBurst = sparkBurst(anchor, count);
  }
  if (newMastery) {
    celebrationFrame = requestAnimationFrame(() => {
      if (motion.canMove()) burst(screen.querySelector('.map-journey-heading h1'), 8);
    });
  }
  screen.onclick = (e) => {
    const g = e.target.closest('[data-go]'); if (g) { sfx('page'); return go(g.dataset.go); }
    const wc = e.target.closest('.wchip');
    if (wc && Number(wc.dataset.world) !== activeWorldId()) {
      const world = WORLDS.find(item => item.id === Number(wc.dataset.world));
      if (!world.ready || !isWorldUnlocked(world.id)) {
        sfx('oops', .3);
        return toast(world.ready ? `Finish the World ${world.id - 1} review to open ${world.name}.` : `${world.name} is still in development. Born Again is ready to play.`);
      }
      setActiveWorld(world.id);
      sfx('page');
      // The learner is already on #/map, so the hash does not change: ask the router to draw the screen again for the new world.
      dispatchEvent(new HashChangeEvent('hashchange'));
      root.querySelector('.wchip[aria-current]')?.focus({ preventScroll: true });
      return;
    }
    if (e.target.closest('[data-world-next]')) {
      const next = scene.querySelector('.mnode.cur .mbtn');
      if (next) {
        react('pointing');
        next.setAttribute('data-located', '');
        next.addEventListener('blur', () => next.removeAttribute('data-located'), { once: true });
        motion.goTo(next, e.detail > 0);
      }
      return;
    }
    const b = e.target.closest('.mbtn'); if (!b) return;
    const { kind, i } = b.dataset, mn = b.closest('.mnode');
    if (mn.classList.contains('lock')) {
      react('thinking');
      sfx('oops', .3);
      const prerequisite = world.lessons[Number(i) - 1];
      return toast(kind === 'quiz' ? 'Finish all four lessons to open the Chapter review.' : `Finish “${prerequisite.title}” to open this lesson.`);
    }
    const destination = kind === 'lesson' ? 'lesson/' + i : mn.classList.contains('done') ? 'complete' : 'quiz';
    sfx('page');
    go(destination);
  };
  return () => {
    clearTimeout(reaction);
    if (celebrationFrame) cancelAnimationFrame(celebrationFrame);
    removeBurst?.();
    motion.destroy();
  };
}

export { renderIntro } from './screen-chapter-introduction-world-1.js';
