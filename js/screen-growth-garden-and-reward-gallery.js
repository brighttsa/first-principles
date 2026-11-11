// Growth Garden: plot stages and rewards reflect saved learning milestones.
import { gardenScene, worldBookplateArt } from './art-cartoon-landscape-scenes-and-adventure-map.js';
import { activeWorld, rewardCollected } from './worlds-registry-active-world-and-progress-keys.js';
import { state } from './saved-progress-and-settings-state.js';
import { topbar } from './ui-navigation-topbar-sheet-and-confetti.js';
import { esc, announce } from './core-utilities-and-dom-helpers.js';
import { gardenPlantStages } from './progress-stats-achievements-and-daily-word-logic.js';
import { mapStates } from './screen-adventure-map-for-active-world.js';

const STAGES = ['Seed planted', 'Sprouting', 'In bloom'];
const VISITORS = [
  ['rabbit', 'Rabbit', 'Finish one lesson.'],
  ['frog', 'Frog', 'Finish two lessons.'],
  ['chick', 'Chick', 'Finish three lessons.'],
  ['owl', 'Owl', 'Finish the Chapter review.'],
  ['parrot', 'Parrot', 'Collect the World 1 bookplate.'],
  ['duck', 'Duck', 'Remember a verse in your Library.'],
];

// "the Born Again bookplate", "the Holy Spirit bookplate": the world's own title with a single leading "the".
const bookplateName = (world) => 'the ' + world.bookplate.title.replace(/^the\s+/i, '');

function plotDetails(index, plant, markers, world) {
  const lesson = world.lessons[index];
  if (lesson) {
    const title = lesson.title;
    if (markers[index] === 'lock') {
      return { title, ref: lesson.ref, note: `Finish “${world.lessons[index - 1].title}” to open this lesson.` };
    }
    const [note, action] = [
      ['Solve the first puzzle to see this seed sprout.', 'Start lesson'],
      ['Reach Truth Revealed to see this plant bloom.', 'Continue lesson'],
      ['Your plant is in bloom. Revisit the Scripture and reflection from this lesson.', 'Revisit teaching'],
    ][plant];
    return { title, ref: lesson.ref, note, action, route: 'lesson/' + index };
  }
  if (index === world.lessons.length) {
    if (markers[index] === 'done') return {
      title: 'Chapter review', note: 'You completed the Knowledge Challenge and this plot is in bloom.', action: 'View chapter results', route: 'complete',
    };
    if (markers[index] === 'cur') return {
      title: 'Chapter review', note: 'Put together what you learned across the four lessons.', action: 'Start chapter review', route: 'quiz',
    };
    return { title: 'Chapter review', note: 'Finish all four lessons to unlock the Knowledge Challenge.' };
  }
  return {
    title: `World ${world.id} bookplate`,
    note: plant === 2 ? `You collected ${bookplateName(world)} bookplate. Find it below.` : `Complete the Chapter review to collect your ${world.bookplate.title} bookplate.`,
  };
}

function plotPanel(detail) {
  return `<div><h2>${esc(detail.title)}</h2>
    ${detail.ref ? `<p class="garden-verse-ref">${esc(detail.ref)} · KJV</p>` : ''}
    <p>${esc(detail.note)}</p></div>
    ${detail.action ? `<a class="garden-action" href="#/${detail.route}">${esc(detail.action)}</a>` : ''}`;
}

export function renderGarden(root, _params, go) {
  const world = activeWorld();
  const plants = gardenPlantStages(world), markers = mapStates(world);
  const bloomed = plants.slice(0, world.lessons.length).filter(stage => stage === 2).length;
  const quiz = plants[world.lessons.length] === 2;
  const earned = rewardCollected(world);
  const reviewed = Object.values(state.saved).some(verse => verse.box > 0);
  const visitors = [bloomed >= 1, bloomed >= 2, bloomed >= 3, quiz, earned, reviewed];
  const next = markers.indexOf('cur');
  const defaultPlot = next < 0 ? plants.length - 1 : next;
  const labels = [...world.lessons.map((_, index) => 'Lesson ' + (index + 1)), 'Chapter review', `World ${world.id} reward`];

  root.innerHTML = `<div class="screen garden-screen">${topbar('<h1 class="garden-title">Growth Garden</h1>', { back: true })}<div class="page">
    <div class="garden-experience">
    <div class="garden">${gardenScene(plants, { selectedPlot: defaultPlot, worldId: world.id })}</div><div class="garden-controls">
    <div class="plant-list" role="group" aria-label="Garden plots">${plants.map((stage, index) =>
      `<button type="button" class="garden-plot-button" data-plot="${index}" aria-pressed="${index === defaultPlot}" aria-controls="garden-plot-detail">
        <span>${labels[index]}</span><span class="garden-plot-stage" data-stage="${stage}">${STAGES[stage]}</span></button>`).join('')}</div>
    <section id="garden-plot-detail" class="garden-plot-detail" aria-label="Selected plot">${plotPanel(plotDetails(defaultPlot, plants[defaultPlot], markers, world))}</section></div></div>
    <p class="muted garden-note">Your garden celebrates what you’ve learned. Each plant grows as you work through a teaching.</p>
    ${world.id === 1 ? `<h2>Garden visitors</h2>
    <ul class="garden-visitors">${VISITORS.map(([asset, name, requirement], index) => `<li class="garden-visitor" data-earned="${visitors[index]}">
      <img src="assets/animals/${asset}.png" alt="" width="72" height="72"><b>${name}</b>
      <p>${visitors[index] ? 'Visiting your garden' : requirement}</p></li>`).join('')}</ul>` : ''}
    <h2 class="garden-bookplate-heading">World ${world.id} bookplate</h2>
    <div class="plate garden-bookplate ${earned ? '' : 'locked'}">${worldBookplateArt(world)}<b>${esc(world.bookplate.title)}</b>
      <p>${earned ? 'Collected' : 'Earn it in the Chapter review.'}</p></div></div></div>`;

  const screen = root.firstElementChild;
  screen.querySelector('[data-back]').onclick = () => go('map');
  const plotButtons = screen.querySelectorAll('[data-plot]');
  const anchors = screen.querySelectorAll('[data-garden-anchor]');
  const detailPanel = screen.querySelector('#garden-plot-detail');
  screen.querySelector('.plant-list').onclick = event => {
    const button = event.target.closest('[data-plot]');
    if (!button || button.getAttribute('aria-pressed') === 'true') return;
    const index = Number(button.dataset.plot);
    for (const plot of plotButtons) plot.setAttribute('aria-pressed', String(plot === button));
    anchors.forEach((anchor, position) => { anchor.hidden = position !== index; });
    const detail = plotDetails(index, plants[index], markers, world);
    detailPanel.innerHTML = plotPanel(detail);
    announce(`${detail.title}. ${detail.note}`);
  };
}
