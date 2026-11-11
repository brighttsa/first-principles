// Playwright browser_run_code snippet. Covers every authored Word Garden level in the live lesson flow.
async (page, base = 'http://127.0.0.1:8733') => {
  const context = await page.context().browser().newContext({
    viewport: { width: 320, height: 568 }, hasTouch: true, reducedMotion: 'reduce',
  });
  const p = await context.newPage(), errors = [], completed = [];
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  try {
    p.on('pageerror', error => errors.push(error.message));
    p.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await p.goto(base + '/index.html');
    const curriculum = await p.evaluate(async () => {
      const { world1 } = await import('./js/world-1-born-again-curriculum-content.js');
      return world1.lessons.map(lesson => ({ id: lesson.id, puzzles: lesson.puzzles.map(puzzle => ({ id: puzzle.id, type: puzzle.type })) }));
    });
    const done = Object.fromEntries(curriculum.flatMap(lesson => lesson.puzzles.filter(puzzle => puzzle.type !== 'wordgarden').map(puzzle => [puzzle.id, 1])));
    curriculum.forEach(lesson => { done['t_' + lesson.id] = 1; });
    await p.evaluate(saved => localStorage.setItem('wol.v1', JSON.stringify({ started: true, activeWorld: 1, done: saved, settings: { sfx: false } })), done);
    await p.reload();
    await p.goto(base + '/index.html#/map');
    await p.getByText(/Optional Word Garden/).waitFor();
    await p.getByRole('button', { name: 'Continue', exact: true }).click();
    await p.locator('.wg-heading').waitFor();
    const touchMetrics = await p.evaluate(() => ({
      tiles: [...document.querySelectorAll('.wg-letter')].map(tile => tile.getBoundingClientRect()),
      transition: parseFloat(getComputedStyle(document.querySelector('.wg-letter')).transitionDuration) * 1000,
      targetLabels: [...document.querySelectorAll('.wg-target')].map(target => target.getAttribute('aria-label')),
    }));
    assert(touchMetrics.tiles.every(tile => tile.width >= 44 && tile.height >= 44), 'Letter targets meet the touch minimum');
    assert(touchMetrics.transition < 1, 'Reduced motion shortens letter transitions');
    assert(touchMetrics.targetLabels.every(label => /\d+ letters/.test(label)), 'Target blanks announce their lengths');

    for (let lessonIndex = 0; lessonIndex < curriculum.length; lessonIndex++) {
      const levels = curriculum[lessonIndex].puzzles.filter(puzzle => puzzle.type === 'wordgarden');
      if (lessonIndex > 0) await p.goto(`${base}/index.html#/lesson/${lessonIndex}`);
      for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
        const level = levels[levelIndex];
        await p.locator('.wg-heading').waitFor();
        assert((await p.locator('.word-garden').getAttribute('aria-label')).includes('Level'), `Level banner: ${level.id}`);
        if (level.id === 'wg01') {
          await p.getByRole('button', { name: 'Shuffle letters' }).click();
          await p.getByRole('button', { name: 'Hint', exact: true }).click();
          await p.getByText(/Hint:/).waitFor();
        }
        const runtime = await p.evaluate(async (id) => {
          const { world1 } = await import('./js/world-1-born-again-curriculum-content.js');
          return world1.lessons.flatMap(lesson => lesson.puzzles).find(puzzle => puzzle.id === id);
        }, level.id);
        for (const answer of runtime.targetWords) {
          for (const letter of answer) {
            const id = await p.locator('.wg-letter[aria-pressed="false"]').evaluateAll((items, char) => items.find(item => item.textContent === char)?.dataset.letter, letter);
            assert(id !== undefined, `Available letter ${letter}: ${level.id}`);
            await p.locator(`.wg-letter[data-letter="${id}"]`).focus();
            await p.keyboard.press('Enter');
          }
          await p.getByRole('button', { name: 'Find word' }).focus();
          await p.keyboard.press('Enter');
          if (await p.locator('.wg-play').isVisible()) await p.getByRole('listitem', { name: answer + ' found' }).waitFor();
          else await p.locator('.wg-question').waitFor();
        }
        const correct = runtime.choices.findIndex(choice => choice.correct);
        await p.locator(`[data-choice="${correct}"]`).focus();
        await p.keyboard.press('Enter');
        await p.getByRole('button', { name: 'Continue', exact: true }).waitFor();
        const savedAttempt = await p.evaluate(() => JSON.parse(localStorage.getItem('wol.v1')));
        assert(savedAttempt.done[level.id], `Saved completion: ${level.id}`);
        if (level.id === 'wg01') assert(savedAttempt.learn.puzzles.wg01.hints === 1, 'Hint use enters the adaptive learning record');
        await p.getByRole('button', { name: 'Continue', exact: true }).click();
        completed.push(level.id);
        if (levelIndex < levels.length - 1) await p.locator('.wg-heading').waitFor();
      }
    }
    await p.reload();
    const result = await p.evaluate(() => {
      const saved = JSON.parse(localStorage.getItem('wol.v1'));
      const tiles = [...document.querySelectorAll('.wg-letter')].map(tile => tile.getBoundingClientRect());
      return { width: innerWidth, documentWidth: document.documentElement.scrollWidth, saved: saved.done, transition: getComputedStyle(document.querySelector('.wg-letter') || document.body).transitionDuration, tileSizes: tiles.map(box => [box.width, box.height]) };
    });
    assert(completed.length === 10, 'All ten Word Garden levels played');
    assert(completed.every(id => result.saved[id]), 'All ten level completions persist after reload');
    assert(result.width === result.documentWidth, 'No horizontal overflow at 320px');
    assert(!errors.length, 'Browser errors: ' + errors.join('; '));
    return { completed, result, errors };
  } finally { await context.close(); }
}
