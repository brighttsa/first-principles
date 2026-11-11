// Playwright browser_run_code snippet. Pass the live or preview URL as the second argument.
// Example: await (async (page, base) => { ... })(page, 'http://127.0.0.1:8739');
async (page, base = 'http://127.0.0.1:8732', screenshotDir = '') => {
  const browser = page.context().browser(), checks = [], errors = [];
  const assert = (value, label) => {
    if (!value) throw new Error(label);
    checks.push(label);
  };
  const focus = p => p.evaluate(() => document.activeElement.id || document.activeElement.className);
  const saved = p => p.evaluate(() => JSON.parse(localStorage.getItem('wol.v1')));
  const viewports = [[320, 568], [360, 800], [390, 844], [430, 932], [768, 1024], [1024, 768],
    [1280, 800], [1440, 900], [1920, 1080], [2560, 1440], [568, 320], [640, 400]];
  const routes = ['welcome', 'map', 'intro', 'lesson/0', 'quiz', 'complete', 'daily', 'library',
    'progress', 'achievements', 'garden', 'settings', 'review'];
  const complete = { started: true, done: { t_l1: 1, t_l2: 1, t_l3: 1, t_l4: 1, quiz: 1, complete: 1 } };

  async function visit([width, height], fixture, exercise, reducedMotion = 'reduce') {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 1100, reducedMotion,
      ...(fixture ? { storageState: { cookies: [], origins: [{ origin: base,
        localStorage: [{ name: 'wol.v1', value: JSON.stringify(fixture) }] }] } } : {}) });
    try {
      const p = await context.newPage();
      p.setDefaultTimeout(6000);
      p.on('pageerror', err => errors.push(err.message));
      p.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      p.on('response', res => { if (res.status() >= 400) errors.push(res.status() + ' ' + res.url()); });
      const go = async (route, expected = route.split('/')[0]) => {
        await p.goto(base + '/index.html#/' + route, { waitUntil: 'domcontentloaded' });
        await p.locator(`body[data-screen="${expected}"] #app > .screen`).waitFor();
      };
      await exercise(p, go);
    } finally { await context.close(); }
  }

  for (const viewport of viewports) await visit(viewport, { ...complete, settings: { text: 1.4 } }, async (p, go) => {
    for (const route of routes) {
      await go(route);
      const problems = await p.evaluate(() => {
        const headings = [...document.querySelectorAll('#app h1, #app [aria-level="1"]')].filter(el => el.getClientRects().length);
        const offscreen = [...document.querySelectorAll('#app button, #app select, #nav button')].find(el => {
          const rect = el.getBoundingClientRect(); return rect.width && (rect.left < -1 || rect.right > innerWidth + 1);
        });
        return [document.documentElement.scrollWidth > innerWidth && 'page overflow',
          headings.length !== 1 && headings.length + ' visible top-level headings', offscreen && offscreen.textContent.trim()].filter(Boolean);
      });
      assert(!problems.length, viewport.join('×') + ' ' + route + ' ' + problems.join(', '));
      if (screenshotDir && route === 'map' && [390, 768, 1440].includes(viewport[0])) {
        await p.locator('.wp-plate img').first().evaluate(img => img.decode());
        await p.screenshot({ path: screenshotDir + '/learn-' + viewport[0] + '.png' });
      }
    }
  });

  await visit([320, 568], null, async (p, go) => {
    for (const locked of ['lesson/2', 'lesson/404', 'quiz', 'complete']) {
      await go(locked, 'map');
      assert(p.url().endsWith('#/map'), 'Locked route redirects: ' + locked);
    }
    await go('welcome');
    await p.getByRole('button', { name: 'Begin journey' }).focus();
    await p.keyboard.press('Enter');
    assert(await p.getByRole('heading', { name: 'Choose your reading level' }).evaluate(e => e === document.activeElement), 'Onboarding focuses the new heading');
    const child = p.getByRole('button', { name: /Seedling/ });
    await child.focus(); await p.keyboard.press('Enter');
    assert(await child.getAttribute('aria-pressed') === 'true' && await child.evaluate(e => e === document.activeElement), 'Reading selection preserves keyboard focus');
    await p.getByRole('button', { name: 'Next', exact: true }).tap();
    await p.getByRole('button', { name: 'Back', exact: true }).tap();
    assert(await child.getAttribute('aria-pressed') === 'true', 'Onboarding Back keeps reading choice');
    await p.getByRole('button', { name: 'Next', exact: true }).tap();
    await p.getByRole('button', { name: 'Start exploring' }).tap();
    await p.locator('body[data-screen="map"] .map-next-action').waitFor();
    assert((await saved(p)).started, 'Onboarding saves setup');

    await go('settings');
    await p.getByRole('checkbox', { name: /Distraction-free/ }).check();
    assert(await p.locator('#nav').isVisible(), 'Distraction-free leaves navigation available');
    await p.locator('#nav').getByRole('button', { name: 'Learn' }).tap();
    await p.getByRole('button', { name: 'Start lesson', exact: true }).tap();
    const verse = p.locator('.lesson-reading'), start = p.getByRole('button', { name: 'Start puzzles' });
    await verse.waitFor();
    assert(await p.locator('#toast').innerText() === '', 'Old route notices do not cover the lesson');
    assert(await verse.isVisible() && await verse.evaluate(e => e.compareDocumentPosition(document.querySelector('#go')) & Node.DOCUMENT_POSITION_FOLLOWING), 'Primary Scripture precedes the puzzle in focus mode');
    if (screenshotDir) await p.screenshot({ path: screenshotDir + '/read-320.png', fullPage: true });
    await start.tap();
    assert(await p.getByRole('progressbar', { name: 'Activity progress' }).isVisible(), 'Exercise progress has a label');
    const wheel = p.locator('.word-garden');
    async function wheelWord(word) {
      for (const letter of word) {
        await wheel.locator('.wg-letter[aria-pressed="false"]').filter({ hasText: new RegExp('^' + letter + '$') }).first().press('Enter');
      }
      await wheel.getByRole('button', { name: 'Find word' }).press('Enter');
    }
    await wheelWord('NNW');
    assert(await p.getByRole('button', { name: 'Hint', exact: true }).isVisible(), 'Retry offers a hint');
    assert(await p.locator('.wg-current[data-feedback="retry"]').isVisible(), 'The wheel explains an invalid word');
    assert(await p.locator('.wg-letter').first().evaluate(e => e.getAnimations().length === 0), 'Reduced motion suppresses tile animations');
    await wheelWord('NEW');
    await wheelWord('BORN');
    await wheel.getByRole('button', { name: 'A person needs a new birth.' }).press('Enter');
    await p.getByRole('button', { name: 'Continue', exact: true }).waitFor();
    await p.reload();
    assert((await saved(p)).done.wg01 && await p.getByRole('heading', { name: 'Words in the waterfall' }).isVisible(), 'An interrupted lesson resumes at the next authored puzzle');
  });

  const DAY = 86400000, old = Date.now() - DAY * 2;
  for (const due of [old, old + 10 * DAY]) await visit([390, 844], {
    done: { p1: 1 }, learn: { puzzles: { p1: { attempts: 2, misses: 0, hints: 0, clean: 2, retained: 0, box: 2, last: old, due } } },
  }, async (p, go) => {
    await go('review');
    await p.getByRole('button', { name: 'Start review' }).tap();
    await p.keyboard.type('ANOTHEN');
    await p.getByRole('button', { name: 'Continue', exact: true }).tap();
    const record = (await saved(p)).learn.puzzles.p1;
    assert(record.attempts === 3 && (due === old ? record.retained === 1 && record.box === 3 : record.retained === 0 && record.box === 2 && record.due === due),
      due === old ? 'A clean due recall advances retention and mastery' : 'Early practice preserves the scheduled review and does not advance mastery');
  });

  await visit([320, 568], { level: 'adult', done: { t_l1: 1, t_l2: 1, p5: 1 } }, async (p, go) => {
    await go('lesson/2');
    const grid = p.locator('.ws');
    await grid.waitFor();
    const first = grid.locator('button[tabindex="0"]');
    await first.focus(); await p.keyboard.press('Enter'); await p.keyboard.press('ArrowRight');
    assert(await grid.locator('button[tabindex="0"][data-x="1"]').evaluate(e => e === document.activeElement) &&
      await grid.locator('button[aria-pressed="true"]').count() === 1, 'Word Search keyboard starts a word and navigates by arrow');
    await p.keyboard.press('Escape');
    assert(await grid.locator('button[aria-pressed="true"]').count() === 0, 'Escape cancels Word Search selection');
    const cell = grid.locator('button[data-x="0"][data-y="0"]');
    await cell.tap();
    assert(await cell.getAttribute('aria-pressed') === 'true', 'Touch selects the first Word Search cell');
    await cell.tap();
    assert(await cell.getAttribute('aria-pressed') === 'false', 'Touch can cancel Word Search selection');
    const widths = await grid.locator('button').evaluateAll(cells => cells.map(c => c.getBoundingClientRect().width));
    assert(Math.min(...widths) >= 24, 'Word Search cells meet the 24px minimum at 320px');
  });

  await visit([1024, 768], complete, async (p, go) => {
    await go('quiz');
    const wrong = await p.evaluate(async () => {
      const { world1 } = await import('./js/world-1-born-again-curriculum-content.js');
      return world1.quiz[0].options.find(o => !o.ok).t;
    });
    await p.locator('.opts').getByRole('button', { name: wrong, exact: true }).focus(); await p.keyboard.press('Enter');
    assert(await p.locator('.opts .opt:focus:enabled').count() === 1, 'Quiz retry moves focus to an available answer');
    const choices = p.locator('.opts .opt');
    const firstQuestion = await p.locator('#quiz-question').innerText();
    for (const option of await choices.all()) {
      if (!await option.isEnabled()) continue;
      await option.focus(); await p.keyboard.press('Enter');
      if (await p.locator('#go').count()) break;
      assert(await p.locator('.opts .opt:focus:enabled').count() === 1, 'Quiz retry moves focus to an available answer');
    }
    assert(await focus(p) === 'go', 'Quiz explanation waits for a deliberate next action');
    await p.keyboard.press('Enter');
    assert(await focus(p) === 'quiz-question' && await p.locator('#quiz-question').innerText() !== firstQuestion, 'Quiz focuses the next question');
  });

  await visit([390, 844], { done: { d_p1: 1 }, learn: { puzzles: {
    p1: { attempts: 1, misses: 0, hints: 0, clean: 1, retained: 0, box: 1, last: old, due: old },
  } } }, async (p, go) => {
    await go('daily'); await p.getByRole('button', { name: 'Start', exact: true }).tap();
    await p.locator('.tray').waitFor(); await p.keyboard.type('ANOTHEN');
    await p.getByRole('button', { name: 'Continue', exact: true }).waitFor();
    const record = (await saved(p)).learn.puzzles.p1;
    assert(record.retained === 1 && record.due > Date.now(), 'Daily-only recall advances once and reschedules');
  });
  await visit([390, 844], { level: 'teen', done: { p2: 1 }, learn: { puzzles: {
    p2: { attempts: 1, misses: 2, hints: 0, clean: 0, retained: 0, box: 0, last: old, due: old, needsSupport: true },
  } } }, async (p, go) => {
    await go('review'); await p.getByRole('button', { name: 'Start review' }).tap();
    const bank = p.locator('.bank .chip');
    await bank.first().waitFor();
    assert(await bank.count() === 4, 'Review reduces distractors after difficulty while retaining the Scripture blank');
  });

  await visit([390, 844], { done: { p1: 1, wg01: 1, wg02: 1, wg03: 1, st01: 1, p2: 1 } }, async (p, go) => {
    await go('lesson/0');
    await p.locator('.wo-tray').getByRole('button', { name: 'Ye', exact: true }).tap();
    await p.locator('.wo-tray').getByRole('button', { name: 'again', exact: true }).tap();
    await p.getByRole('button', { name: 'Hint', exact: true }).tap();
    assert(await p.locator('.wo-line button:disabled').allTextContents().then(words => words.join(' ') === 'Ye must'),
      'Word Order keeps a hinted position stable without disabling unrelated words');
  });

  assert(!errors.length, 'Browser console, runtime and HTTP checks: ' + errors.join(', '));
  return { passed: checks.length, routes: routes.length, viewports: viewports.length, flows: checks.slice(routes.length * viewports.length), errors };
}
