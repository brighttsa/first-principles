// App entry: hash router, parallax pointer tracking, settings bootstrap.
import { applySettings, state, isDone } from './saved-progress-and-settings-state.js';
import { renderNav } from './ui-navigation-topbar-sheet-and-confetti.js';
import { renderWelcome } from './screen-welcome-and-onboarding.js';
import { renderMap, renderIntro } from './screen-adventure-map-for-active-world.js';
import { renderDaily } from './screen-daily-word-challenge.js';
import { renderProgress } from './screen-progress-and-achievements.js';
import { renderLesson } from './lesson-screen-five-stage-flow-and-puzzle-host.js';
import { renderQuiz, renderComplete } from './screen-quiz-and-chapter-completion-rewards.js';
import { renderChapterChallenge } from './screen-world-1-optional-chapter-challenge.js';
import { renderLibrary } from './screen-scripture-library-and-spaced-review.js';
import { renderGarden } from './screen-growth-garden-and-reward-gallery.js';
import { renderSettings } from './screen-settings-accessibility-and-about.js';
import { renderReview } from './screen-review-session-of-due-ideas.js';
import { syncMusic, stopSpeaking } from './sound-effects-music-narration-haptics.js';
import { $, toast } from './core-utilities-and-dom-helpers.js';
import { activeWorld, lessonDoneKey, reviewDoneKey, completeDoneKey } from './worlds-registry-active-world-and-progress-keys.js';

const go = (r) => { location.hash = '#/' + r; };
const ROUTES = {
  welcome: renderWelcome, map: renderMap, intro: renderIntro, lesson: renderLesson,
  quiz: renderQuiz, complete: renderComplete, challenge: renderChapterChallenge, library: renderLibrary, garden: renderGarden, settings: renderSettings,
  daily: renderDaily, review: renderReview, progress: renderProgress, achievements: renderProgress,
};
let cleanup, routeNotice = '';
let hasRenderedRoute = false;

// Some browsers show :focus-visible on native selects after taps; retain rings for keyboard navigation only.
document.addEventListener('pointerdown', () => { document.documentElement.dataset.inputMode = 'pointer'; }, { capture: true, passive: true });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab' || event.key.startsWith('Arrow') || event.key === 'Escape') document.documentElement.dataset.inputMode = 'keyboard';
}, true);

function route() {
  const [name = '', arg] = location.hash.replace(/^#\/?/, '').split('/');
  const key = Object.hasOwn(ROUTES, name) ? name : 'welcome';
  const n = arg === undefined ? 0 : Number(arg);
  if (['lesson', 'quiz', 'complete', 'challenge'].includes(key)) {
    const world = activeWorld();
    const allLessonsDone = world.lessons.every(lesson => isDone(lessonDoneKey(lesson)));
    const locked = key === 'lesson'
      ? !Number.isInteger(n) || !world.lessons[n] || (!isDone(lessonDoneKey(world.lessons[n])) &&
        world.lessons.slice(0, n).some(lesson => !isDone(lessonDoneKey(lesson))))
      : key === 'quiz' ? !allLessonsDone && !isDone(reviewDoneKey(world))
        : key === 'challenge' ? world.id !== 1 || !isDone(completeDoneKey(world))
          : !isDone(reviewDoneKey(world));
    if (locked) {
      routeNotice = key === 'lesson' ? 'Choose an available lesson on the path.' : 'Finish the available stops on the path first.';
      location.replace('#/map');
      return;
    }
  }
  cleanup?.(); stopSpeaking();
  document.querySelectorAll('.confetti').forEach((n) => n.remove()); // celebration belongs to the screen that launched it
  const root = $('#app'); root.innerHTML = '';
  const previousNotice = $('#toast');
  previousNotice.classList.remove('show'); previousNotice.textContent = '';
  document.body.dataset.screen = key;
  document.body.dataset.world = activeWorld().id; // lets the painted backdrop and per-world styles follow the active world
  renderNav(['map', 'intro', 'lesson', 'quiz', 'complete', 'challenge'].includes(key) ? 'map' : key === 'garden' ? 'progress' : key === 'review' ? 'daily' : key, go);
  cleanup = ROUTES[key](root, { n }, go);
  const heading = root.querySelector('h1, [role="heading"][aria-level="1"]');
  if (hasRenderedRoute) {
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    else root.focus({ preventScroll: true });
  }
  hasRenderedRoute = true;
  window.scrollTo(0, 0);
  if (routeNotice) { toast(routeNotice); routeNotice = ''; }
}

// Gentle parallax: pointer position nudges the layered scene.
addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch' || !$('.scene .px1')) return;
  const s = document.documentElement.style;
  s.setProperty('--mx', ((e.clientX / innerWidth) * 2 - 1).toFixed(2));
  s.setProperty('--my', ((e.clientY / innerHeight) * 2 - 1).toFixed(2));
}, { passive: true });
document.addEventListener('click', (e) => { const b = e.target.closest('[data-back]'); if (b && !b.onclick) history.back(); });
$('a.skip').addEventListener('click', (event) => {
  event.preventDefault();
  const main = $('#app');
  const heading = main.querySelector('h1, [role="heading"][aria-level="1"]');
  const target = heading || main;
  if (heading) heading.tabIndex = -1;
  target.focus();
  target.scrollIntoView({ block: 'start', behavior: 'instant' });
});
addEventListener('hashchange', route);
applySettings();
if (state.settings.music) addEventListener('pointerdown', syncMusic, { once: true });
route();
