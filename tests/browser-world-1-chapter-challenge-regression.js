// Playwright browser_run_code snippet. Verifies the optional capstone, save/resume, and mobile/desktop layouts.
async (page, base = 'http://127.0.0.1:8733') => {
  const browser = page.context().browser(), errors = [], result = {};
  const assert = (ok, message) => { if (!ok) throw new Error(message); };
  const saved = {
    started: true, activeWorld: 1, level: 'teen',
    settings: { sfx: false, music: false, narration: false, haptics: false, motion: 'on', text: 1, focus: false, adaptive: true, bibleVersion: 'KJV' },
    done: { quiz: Date.now(), complete: Date.now(), t_l1: true, t_l2: true, t_l3: true, t_l4: true },
    daily: {}, saved: {}, notes: {}, plates: { 1: true }, firstTry: {}, learn: { puzzles: {} }, wordGarden: { bonusFound: {} },
  };
  const lockedContext = await browser.newContext({ viewport: { width: 320, height: 568 }, hasTouch: true });
  const lockedPage = await lockedContext.newPage();
  await lockedPage.goto(base + '/index.html#/challenge');
  await lockedPage.waitForTimeout(400);
  assert(await lockedPage.locator('body').getAttribute('data-screen') !== 'challenge', 'Locked direct route does not render challenge');
  await lockedContext.close();
  result.lockedRouteDoesNotRender = true;

  const context = await browser.newContext({ viewport: { width: 320, height: 568 }, hasTouch: true, reducedMotion: 'reduce' });
  await context.addInitScript(value => { if (!localStorage.getItem('wol.v1')) localStorage.setItem('wol.v1', JSON.stringify(value)); }, saved);
  try {
    const p = await context.newPage(); p.setDefaultTimeout(8000);
    p.on('pageerror', e => errors.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    const origin = new URL(base).origin;
    p.on('response', r => { if (r.status() >= 400 && new URL(r.url()).origin === origin) errors.push(`${r.status()} ${r.url()}`); });
    await p.goto(base + '/index.html#/complete');
    await p.getByRole('button', { name: 'Try Chapter Challenge', exact: true }).click();
    await p.locator('.wg-heading h2').getByText('Find the new life', { exact: true }).waitFor();
    assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow at 320px');
    assert(await p.locator('#nav').evaluate(el => getComputedStyle(el).display === 'none'), 'Exercise controls have the full mobile viewport');
    result.mobileOverflow = false;
    await p.screenshot({ path: '/Users/bskt/Documents/ChatGPT/Word of Life/chapter-challenge-phone.png', fullPage: true });
    const stages = await p.evaluate(async () => (await import('./js/world-1-chapter-challenge-content.js')).world1ChapterChallenge);
    const original = await p.evaluate(() => JSON.parse(localStorage.getItem('wol.v1')));
    const press = async locator => { await locator.focus(); await p.keyboard.press('Enter'); };

    for (const word of stages[0].targetWords) {
      for (const letter of word) {
        const id = await p.locator('.wg-letter[aria-pressed="false"]').evaluateAll((tiles, value) => tiles.find(tile => tile.textContent === value)?.dataset.letter, letter);
        assert(id !== undefined, `Available letter ${letter} for ${word}`);
        await press(p.locator(`.wg-letter[data-letter="${id}"]`));
      }
      await press(p.getByRole('button', { name: 'Find word', exact: true }));
    }
    await press(p.locator('.wg-choice').filter({ hasText: stages[0].choices.find(choice => choice.correct).text }));
    await p.getByRole('button', { name: 'Continue', exact: true }).waitFor();
    assert((await p.evaluate(() => JSON.parse(localStorage.getItem('wol.v1')))).done['w1.chapterChallenge.cc-new-creature'], 'First stop saved in wol.v1');
    await p.reload();
    await p.locator('.scripture-trail h2').getByText('Restore the promise', { exact: true }).waitFor();
    result.resumesAfterReload = true;

    for (const word of stages[1].words) await press(p.locator('.st-bank .st-word').filter({ hasText: new RegExp(`^${word}$`) }));
    await p.locator('.st-question h3').getByText(stages[1].question, { exact: true }).waitFor();
    await press(p.locator('.st-choice').filter({ hasText: stages[1].choices.find(choice => choice.correct).text }));
    await press(p.getByRole('button', { name: 'Continue', exact: true }));
    await p.locator('.det-q').getByText(stages[2].question, { exact: true }).waitFor();

    await p.setViewportSize({ width: 1280, height: 800 });
    assert(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow at desktop width');
    result.desktopOverflow = false;
    await p.screenshot({ path: '/Users/bskt/Documents/ChatGPT/Word of Life/chapter-challenge-desktop.png', fullPage: true });

    const evidence = stages[2].segments.flatMap((part, index) => part.ev ? [index] : []);
    for (const index of evidence) await press(p.locator(`.seg[data-i="${index}"]`));
    await press(p.getByRole('button', { name: 'Check my evidence', exact: true }));
    await press(p.locator('.opts [data-reply]').filter({ hasText: stages[2].reply.options.find(option => option.ok).t }));
    await press(p.getByRole('button', { name: 'Continue', exact: true }));
    await p.getByRole('heading', { name: 'Challenge complete', exact: true }).waitFor();
    await p.getByRole('button', { name: 'Back to chapter', exact: true }).click();
    await p.getByText('Optional Chapter Challenge complete.', { exact: true }).waitFor();

    const after = await p.evaluate(() => JSON.parse(localStorage.getItem('wol.v1')));
    for (const key of ['quiz', 'complete', 't_l1', 't_l2', 't_l3', 't_l4']) assert(after.done[key] === original.done[key], `Existing progress preserved: ${key}`);
    assert(after.plates[1] === original.plates[1], 'Chapter medal progress preserved');
    result.challengeSavedWithoutChangingChapterProgress = true;
    result.errors = errors;
    assert(errors.length === 0, `No browser errors: ${errors.join(' | ')}`);
    return result;
  } finally { await context.close(); }
}
