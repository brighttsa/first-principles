// Rebuild a KJV phrase as stepping stones, read the passage, then show understanding.
import { h, shuffle, rng, esc, $ } from './core-utilities-and-dom-helpers.js';
import { sfx, buzz } from './sound-effects-music-narration-haptics.js';
import { BibleVerse, hydrateBibleReaders } from './bible-verse-reader-and-version-comparison-component.js';

export function mount(root, p, ctx) {
  const pieces = shuffle(p.words.map((word, id) => ({ word, id })), rng(p.id.length * 91));
  const placed = []; let revealed = false, finished = false, feedback = '';
  const isCorrect = () => placed.length === p.words.length && placed.every((id, index) => pieces.find(piece => piece.id === id).word === p.words[index]);
  root.innerHTML = `<section class="scripture-trail"><header><p class="kicker">Scripture Trail · ${esc(p.ref)} (KJV)</p><h2>${esc(p.trailTitle)}</h2><p>${esc(p.clue)}</p></header>
    <ol class="st-path" aria-label="Verse stepping stones"></ol><div class="st-bank" role="group" aria-label="Available verse words"></div><p class="st-feedback" role="status" aria-live="polite"></p></section>`;
  const path = $('.st-path', root), bank = $('.st-bank', root), status = $('.st-feedback', root);
  function draw() {
    path.innerHTML = ''; bank.innerHTML = '';
    placed.forEach((id, index) => path.append(h(`<li><button type="button" class="st-stone" data-remove="${index}" aria-label="Remove ${esc(p.words[index])} from step ${index + 1}">${esc(pieces.find(piece => piece.id === id).word)}</button></li>`)));
    pieces.filter(piece => !placed.includes(piece.id)).forEach(piece => bank.append(h(`<button type="button" class="chip st-word" data-word="${piece.id}">${esc(piece.word)}</button>`)));
    status.textContent = feedback;
  }
  function reveal() {
    revealed = true; feedback = '';
    bank.hidden = true; feedback = 'Read the passage, then choose what it teaches.'; status.textContent = feedback;
    root.querySelector('.scripture-trail').insertAdjacentHTML('beforeend', `<section class="st-reveal"><h3>Read the passage</h3>${BibleVerse(p.ref, 'KJV', { puzzleSource: true, simple: ctx.level === 'child' })}<div class="st-question"><h3>${esc(p.question)}</h3><div class="st-choices" role="group" aria-label="Choose what the passage teaches"></div></div></section>`);
    hydrateBibleReaders(root);
    const choices = shuffle(p.choices.map((choice, id) => ({ ...choice, id })), rng(p.id.length * 17));
    const group = $('.st-choices', root);
    choices.forEach(choice => group.append(h(`<button type="button" class="st-choice" data-choice="${choice.id}">${esc(choice.text)}</button>`)));
    group.addEventListener('click', event => {
      const button = event.target.closest('[data-choice]'); if (!button || finished) return;
      const choice = p.choices[Number(button.dataset.choice)];
      if (!choice.correct) { feedback = choice.feedback; status.textContent = feedback; ctx.miss?.(); ctx.say(`${feedback} Read the passage, then try again.`, 'soft'); return; }
      finished = true; button.classList.add('correct'); group.querySelectorAll('button').forEach(option => { option.disabled = true; });
      status.textContent = 'Correct. You understood the passage.';
      ctx.solved(p.afterLearn);
    });
    $('.st-reveal h3', root)?.focus?.({ preventScroll: true });
    const question = $('.st-question h3', root); question.tabIndex = -1; question.focus({ preventScroll: true });
  }
  bank.addEventListener('click', event => {
    const button = event.target.closest('[data-word]'); if (!button || revealed) return;
    placed.push(Number(button.dataset.word)); sfx('place', .45); buzz(8); draw();
    if (placed.length === p.words.length) {
      if (isCorrect()) reveal();
      else { feedback = 'One stone is out of place. Tap a placed stone to lift it and try again.'; status.textContent = feedback; ctx.miss?.(); ctx.say(feedback, 'soft'); }
    }
  });
  path.addEventListener('click', event => {
    const button = event.target.closest('[data-remove]'); if (!button || revealed) return;
    placed.splice(Number(button.dataset.remove), 1); feedback = ''; sfx('unplace', .3); draw();
  });
  ctx.onHint(() => {
    if (revealed) return;
    const correctNext = p.words[placed.length];
    const id = pieces.find(piece => piece.word === correctNext)?.id;
    if (id === undefined) return;
    placed.push(id); feedback = `The next stone is “${correctNext}.”`; draw(); sfx('pluck', .4); ctx.say(`Hint: ${feedback}`, 'soft');
    if (isCorrect()) reveal();
  });
  draw();
}
