// Hide the interactive targets over familiar, approved World 1 landmarks; keep the painting itself untouched.
import { esc, $ } from './core-utilities-and-dom-helpers.js';
import { sfx, buzz } from './sound-effects-music-narration-haptics.js';
import { worldOneHeroScene } from './world-1-unified-plate-scene.js';
import { BibleVerse, hydrateBibleReaders } from './bible-verse-reader-and-version-comparison-component.js';

export function mount(root, p, ctx) {
  let index = 0, finished = false;
  root.innerHTML = `<section class="word-hunt"><header class="wh-heading"><p class="kicker">Explore the Born Again world</p><h2>${esc(p.title)}</h2><p class="wh-clue" data-clue aria-live="polite"></p></header>
    <div class="wh-scene">${worldOneHeroScene(true)}<div class="wh-targets" role="group" aria-label="Explore the world landmarks">${p.targets.map(target => `<button type="button" class="wh-hotspot" data-object="${esc(target.id)}" style="--portrait-x:${target.portrait.x}%;--portrait-y:${target.portrait.y}%;--portrait-w:${target.portrait.width}%;--portrait-h:${target.portrait.height}%;--wide-x:${target.landscape.x}%;--wide-y:${target.landscape.y}%;--wide-w:${target.landscape.width}%;--wide-h:${target.landscape.height}%" aria-label="${esc(target.label)}"></button>`).join('')}</div></div>
    <p class="wh-progress" data-progress role="status" aria-live="polite"></p><div class="wh-question" hidden></div></section>`;
  const clue = $('[data-clue]', root), progress = $('[data-progress]', root), question = $('.wh-question', root);
  const buttons = [...root.querySelectorAll('.wh-hotspot')];
  function updatePrompt() {
    clue.textContent = index < p.targets.length ? p.targets[index].clue : 'Read the passage, then choose what it teaches.';
    progress.textContent = `${index} of ${p.targets.length} landmarks discovered`;
  }
  function showQuestion() {
    question.hidden = false;
    question.innerHTML = `<h3>${esc(p.question)}</h3>${BibleVerse(p.ref, 'KJV', { puzzleSource: true, simple: ctx.level === 'child' })}<div class="wh-choices" role="group" aria-label="Choose what Scripture teaches"></div>`;
    const group = $('.wh-choices', question);
    p.choices.forEach((choice, i) => group.insertAdjacentHTML('beforeend', `<button type="button" class="wh-choice" data-choice="${i}">${esc(choice.text)}</button>`));
    hydrateBibleReaders(question);
    question.addEventListener('click', event => {
      const answer = event.target.closest('[data-choice]'); if (!answer || finished) return;
      const choice = p.choices[Number(answer.dataset.choice)];
      if (!choice.correct) { ctx.miss?.(); ctx.say(choice.feedback, 'soft'); return; }
      finished = true; answer.classList.add('correct');
      $('.wh-choices', question).querySelectorAll('button').forEach(button => { button.disabled = true; });
      progress.textContent = 'All landmarks found. You connected the clues with Scripture.';
      ctx.solved(p.afterLearn);
    });
  }
  root.addEventListener('click', event => {
    const button = event.target.closest('.wh-hotspot'); if (!button || finished || button.disabled) return;
    const target = p.targets[index];
    if (button.dataset.object !== target.id) {
      ctx.miss?.(); ctx.say(`Keep exploring. ${target.clue}`, 'soft'); return;
    }
    button.disabled = true; button.classList.remove('hint'); button.classList.add('found'); button.textContent = target.word;
    button.setAttribute('aria-label', `${target.label}, found ${target.word}`);
    sfx('ok', .4); buzz(12); index++; updatePrompt();
    ctx.say(`Found ${target.word}. ${target.learning}`, 'good');
    if (index === p.targets.length) showQuestion();
  });
  ctx.onHint(() => {
    if (index >= p.targets.length) return;
    const target = p.targets[index], button = buttons.find(item => item.dataset.object === target.id);
    button?.classList.add('hint'); button?.focus({ preventScroll: true });
    ctx.say(`Hint: ${target.hint}`, 'good');
  });
  updatePrompt();
}
