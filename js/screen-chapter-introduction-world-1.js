// Animated chapter introduction: sunrise scene, a companion greeting, learning objectives.
import { sunriseScene } from './art-cartoon-landscape-scenes-and-adventure-map.js';
import { companion } from './art-mascot-sprout-with-expressions.js';
import { activeWorld } from './worlds-registry-active-world-and-progress-keys.js';
import { isDone, state } from './saved-progress-and-settings-state.js';
import { sfx, speak } from './sound-effects-music-narration-haptics.js';
import { $, esc } from './core-utilities-and-dom-helpers.js';
import { storyForWorld } from './story-living-storybook-content-a-new-beginning.js';

export function renderIntro(root, _p, go) {
  const world = activeWorld();
  const story = storyForWorld(world.id); // flagship Living Storybook for this world, when one exists
  const started = world.lessons.some((l) => l.puzzles.some((p) => isDone(p.id)));
  const txt = state.level === 'child' ? world.welcome.child : world.welcome.teen;
  root.innerHTML = `<div class="screen scenic">${sunriseScene(world.id)}<div class="content"><div class="card rise">
    <p class="kicker">World ${world.id}</p><h1>${world.name}</h1>
    <div class="feedback">${companion('sprig', 'happy')}<div class="bubble">${esc(txt)}</div></div>
    <p class="kicker intro-objective-heading">In this world you will</p><ul class="intro-objectives">${world.objectives.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
    <p class="muted intro-meta">${world.lessons.length} lessons · puzzles · a mastery challenge · a collectible bookplate</p>
    ${story ? `<p class="kicker intro-objective-heading">Begin with a story</p><button class="btn alt intro-story-btn" id="story">${esc(story.title)} →</button>` : ''}
    <div class="row"><button class="btn big" id="go">${started ? 'Continue' : `Begin World ${world.id}`}</button><button class="btn alt" id="back">Back to the path</button></div></div></div></div>`;
  $('#go', root).onclick = () => { sfx('chapter', .5); const next = world.lessons.findIndex((l) => !isDone('t_' + l.id)); go(next < 0 ? 'quiz' : 'lesson/' + next); };
  $('#back', root).onclick = () => go('map');
  if (story) $('#story', root).onclick = () => { sfx('page', .5); go('story/' + story.id); };
  speak(txt);
}
