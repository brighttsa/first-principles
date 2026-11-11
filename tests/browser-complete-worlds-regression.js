// Playwright browser_run_code snippet. Drives the actual controls using the shipped curriculum.
async (page, base = 'http://127.0.0.1:8732') => {
  const browser = page.context().browser(), results = [], errors = [];
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: 'reduce' });
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  try {
    const p = await context.newPage();
    p.setDefaultTimeout(7000);
    p.on('pageerror', err => errors.push(err.message));
    p.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    p.on('response', res => { if (res.status() >= 400) errors.push(res.status() + ' ' + res.url()); });
    await p.goto(base + '/index.html#/map');
    const worlds = await p.evaluate(async () => {
      const registry = await import(new URL('./js/worlds-registry-active-world-and-progress-keys.js', location.href));
      return registry.allWorlds();
    });
    const state = () => p.evaluate(() => JSON.parse(localStorage.getItem('wol.v1')));
    const press = async locator => { await locator.focus(); await p.keyboard.press('Enter'); };
    const puzzleButton = (selector, name) => p.locator(selector).getByRole('button', { name, exact: true }).first();
    const solve = {
      wordbuild: async puzzle => p.keyboard.type(puzzle.answer),
      wordgarden: async puzzle => {
        for (const answer of puzzle.targetWords) {
          for (const char of answer) {
            const id = await p.locator('.wg-letter[aria-pressed="false"]').evaluateAll((tiles, letter) => tiles.find(tile => tile.textContent === letter)?.dataset.letter, char);
            assert(id !== undefined, 'Word Garden has tile ' + char + ': ' + puzzle.id);
            await press(p.locator('.wg-letter[data-letter="' + id + '"]'));
          }
          await press(p.getByRole('button', { name: 'Find word', exact: true }));
          if (await p.locator('.wg-play').isVisible()) await p.getByRole('listitem', { name: answer + ' found' }).waitFor();
          else await p.locator('.wg-question').waitFor();
        }
        const correct = puzzle.choices.findIndex(choice => choice.correct);
        await press(p.locator('[data-choice="' + correct + '"]'));
      },
      complete: async puzzle => {
        for (const [, word] of puzzle.text.matchAll(/\[\[(.+?)\]\]/g)) {
          await press(p.locator('.bank .chip:enabled').filter({ hasText: new RegExp('^' + word + '$') }).first());
        }
      },
      reorder: async puzzle => {
        for (const word of puzzle.words) await press(puzzleButton('.wo-tray', word));
      },
      scripturetrail: async puzzle => {
        if (puzzle.id === 'st01') await press(p.getByRole('button', { name: 'Hint', exact: true }));
        if (puzzle.id === 'st01') {
          assert(await p.locator('.st-path .st-stone').count() === 1, 'Trail hint places one stepping stone');
          await press(p.locator('.st-path .st-stone').first());
          await press(puzzleButton('.st-bank', puzzle.words[1]));
          for (const word of [puzzle.words[0], ...puzzle.words.slice(2)]) await press(puzzleButton('.st-bank', word));
          assert(!(await p.getByText('Read the passage', { exact: true }).count()), 'Wrong trail order does not reveal the passage');
          while (await p.locator('.st-path .st-stone').count()) await press(p.locator('.st-path .st-stone').first());
        }
        for (const word of puzzle.words) await press(puzzleButton('.st-bank', word));
        await p.getByText('Read the passage', { exact: true }).waitFor();
        const verse = p.locator('.scripture-trail .bible-reader');
        await verse.waitFor();
        const wrong = puzzle.choices.find(choice => !choice.correct);
        await press(p.locator('.st-choices').getByRole('button', { name: wrong.text, exact: true }));
        assert(!(await state()).done[puzzle.id], 'A mistaken meaning answer does not complete the trail');
        await press(p.locator('.st-choices').getByRole('button', { name: puzzle.choices.find(choice => choice.correct).text, exact: true }));
      },
      wordhunt: async puzzle => {
        await press(p.getByRole('button', { name: 'Hint', exact: true }));
        assert((await p.locator('.wh-hotspot[data-object="doorway"]').getAttribute('class')).includes('hint'), 'Hint marks the next landmark to explore');
        await press(p.locator('.wh-hotspot[data-object="seedling"]'));
        assert(!(await state()).done[puzzle.id], 'An out-of-order landmark does not complete the hunt');
        for (const target of puzzle.targets) await press(p.locator('.wh-hotspot[data-object="' + target.id + '"]'));
        await p.locator('.wh-question .bible-reader').waitFor();
        const wrong = puzzle.choices.find(choice => !choice.correct);
        await press(p.locator('.wh-choices').getByRole('button', { name: wrong.text, exact: true }));
        assert(!(await state()).done[puzzle.id], 'A mistaken meaning answer does not complete the hunt');
        await press(p.locator('.wh-choices').getByRole('button', { name: puzzle.choices.find(choice => choice.correct).text, exact: true }));
      },
      match: async puzzle => {
        for (let i = 0; i < puzzle.pairs.length; i++) {
          await press(p.locator('.chip[data-side="L"][data-i="' + i + '"]'));
          await press(p.locator('.chip[data-side="R"][data-i="' + i + '"]'));
        }
      },
      detective: async puzzle => {
        const evidence = puzzle.segments.flatMap((segment, i) => segment.ev ? [i] : []);
        const segment = i => p.locator('.seg[data-i="' + i + '"]');
        const check = p.getByRole('button', { name: 'Check my evidence' });
        if (puzzle.scenario) {
          assert(await p.getByText(puzzle.scenario, { exact: true }).isVisible(), 'Story is visible: ' + puzzle.id);
          await press(p.getByRole('button', { name: 'Hint', exact: true }));
          assert(await p.getByText('Hint: ' + puzzle.hint, { exact: true }).isVisible(), 'Story hint is readable: ' + puzzle.id);
          await press(segment(evidence[0]));
          await press(check);
          assert(await p.getByText(/one more piece of evidence/).isVisible(), 'Partial evidence prompts for another piece: ' + puzzle.id);
          assert(!(await state()).done[puzzle.id], 'Partial evidence cannot complete: ' + puzzle.id);
          assert(await segment(evidence[0]).getAttribute('aria-pressed') === 'true', 'Retry keeps selected evidence: ' + puzzle.id);
          for (const i of evidence.slice(1)) await press(segment(i));
        } else {
          for (const i of evidence) await press(segment(i));
        }
        await press(check);
        if (puzzle.reply) {
          const reply = p.getByRole('heading', { name: puzzle.reply.question, exact: true });
          await reply.waitFor();
          assert(await reply.evaluate(el => el === document.activeElement), 'Reply heading receives focus');
          assert(!(await state()).done[puzzle.id], 'Evidence alone does not complete the case');
          const summary = p.locator('#pz summary');
          await press(summary);
          assert(await summary.locator('..').evaluate(el => el.open), 'Found evidence can be opened by keyboard');
          const wrong = puzzle.reply.options.find(option => !option.ok);
          await press(puzzleButton('#pz .opts', wrong.t));
          assert(await puzzleButton('#pz .opts', wrong.t).isDisabled(), 'Incorrect reply is disabled');
          assert(!(await state()).done[puzzle.id], 'Incorrect reply does not complete the case');
          await press(puzzleButton('#pz .opts', puzzle.reply.options.find(option => option.ok).t));
        }
      },
      truthsort: async puzzle => {
        for (const card of puzzle.cards) {
          await press(p.locator('button[data-a="' + card.truth + '"]'));
          await p.locator('#pz #next').waitFor();
          await p.keyboard.press('Enter');
        }
      },
      wordsearch: async puzzle => {
        const grid = p.locator('.ws button');
        const letters = await grid.evaluateAll(cells => cells.map(c => ({ x: +c.dataset.x, y: +c.dataset.y, letter: c.textContent })));
        const size = Math.sqrt(letters.length), directions = [[1,0],[0,1],[1,1],[-1,0],[-1,1],[0,-1],[-1,-1],[1,-1]];
        for (const word of puzzle.words) {
          const path = letters.flatMap(({ x, y }) => directions.map(([dx, dy]) =>
            [...word].map((_, i) => letters.find(c => c.x === x + dx * i && c.y === y + dy * i))))
            .find(line => line.every(Boolean) && line.map(c => c.letter).join('') === word);
          assert(path && size >= word.length, 'Search can place ' + word);
          const cell = ({ x, y }) => p.locator('.ws [data-x="' + x + '"][data-y="' + y + '"]');
          await cell(path[0]).tap(); await cell(path.at(-1)).tap();
        }
      },
    };

    for (const world of worlds) {
      if (world.id !== 1) {
        await p.getByRole('button', { name: 'Back to map' }).click();
        await p.getByRole('button', { name: new RegExp('World ' + world.id + ':') }).click();
      }
      let puzzles = 0;
      for (const lesson of world.lessons) {
        await p.getByRole('button', { name: 'Start lesson', exact: true }).tap();
        await p.getByRole('heading', { name: lesson.title, exact: true }).waitFor();
        await p.getByRole('button', { name: 'Start puzzles' }).tap();
        for (const puzzle of lesson.puzzles) {
          await p.locator('#pz').waitFor();
          await solve[puzzle.type](puzzle);
          const next = p.getByRole('button', { name: 'Continue', exact: true });
          await next.waitFor();
          assert((await state()).done[puzzle.id], 'Saved completion: ' + puzzle.id);
          await next.tap();
          puzzles++;
        }
        await p.getByText('Truth revealed', { exact: true }).waitFor();
        assert((await state()).saved[lesson.ref] && (await state()).done['t_' + lesson.id], 'Saved lesson and verse: ' + lesson.id);
        await p.getByRole('button', { name: 'Back', exact: true }).tap();
      }
      await p.getByRole('button', { name: 'Start review', exact: true }).first().tap();
      for (const question of world.quiz) {
        await press(puzzleButton('.opts', question.options.find(option => option.ok).t));
        if (question.evidence) {
          const heading = p.getByRole('heading', { name: question.evidence.q, exact: true });
          await heading.waitFor();
          assert(await heading.evaluate(element => element === document.activeElement), 'Evidence prompt receives focus');
          assert(await p.locator('#q details').count() === question.evidence.refs.length, 'All passages can be opened');
          await press(puzzleButton('.opts', question.evidence.options.find(option => option.ok).t));
        }
        await p.locator('#q #go').waitFor();
        await p.keyboard.press('Enter');
      }
      await p.getByText('Chapter complete', { exact: true }).waitFor();
      assert((await state()).plates[world.id], 'World reward saved');
      results.push({ world: world.id, lessons: world.lessons.length, puzzles, questions: world.quiz.length });
    }
    await p.reload();
    assert((await state()).plates[1] && (await state()).plates[2], 'Both chapter rewards survive reload');
    assert(!errors.length, 'Console, runtime or HTTP errors: ' + errors.join(', '));
    return { results, errors };
  } finally { await context.close(); }
}
