// Playwright browser_run_code snippet: words found in the Word Garden are kept in the Word Treasury beside their verse.
async (page, base = 'http://127.0.0.1:8733', screenshotDir = '') => {
 const c=await page.context().browser().newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
 const assert=(ok,msg)=>{if(!ok)throw Error(msg)}, errors=[];
 const p=await c.newPage(); p.setDefaultTimeout(6500);
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});p.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.status()+' '+r.url())});
 const tile=l=>p.locator('.wg-letter[aria-pressed="false"]').filter({hasText:new RegExp('^'+l+'$')}).first();
 async function enter(word){for(const l of word)await tile(l).press('Enter');await p.locator('[data-submit]').press('Enter');await p.locator('.wg-current').filter({hasText:word}).waitFor()}
 const fits=()=>p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);
 try{
  // An empty treasury: every page waits to be started, and the totals start at zero.
  await p.goto(base+'/#/treasury');
  await p.getByRole('heading',{name:'Word Treasury'}).waitFor();
  assert((await p.locator('.wt-summary-count').innerText()).startsWith('0 of'),'empty treasury starts at zero');
  assert(await p.locator('.wt-page--locked').count()===10,'ten pages wait to be started');
  assert(await fits(),'treasury fits a phone');

  // Play the opening level: key words, garden words, a bonus word and the golden word.
  await p.goto(base+'/#/lesson/0');await p.getByRole('button',{name:'Start puzzles'}).tap();
  await p.getByRole('heading',{name:'Wake the garden'}).waitFor();
  for(const w of ['NEW','ONE','WREN','BROWN','BONE','OWN'])await enter(w);
  for(const l of 'BORN')await tile(l).press('Enter');await p.locator('[data-submit]').press('Enter');
  await p.locator('.wg-discovery [data-bible-text]').first().waitFor();
  await p.getByRole('button',{name:'A person needs a new birth.',exact:true}).press('Enter');
  await p.getByText('Word Treasury: 7 of 12 words kept on this page.').waitFor();

  // The page now holds those seven words, labels each kind, and keeps the rest as gaps.
  await p.goto(base+'/#/treasury');
  const first=p.locator('.wt-page[data-level="wg01"]');
  await first.getByText('7 of 12 words').waitFor();
  assert(await first.locator('.wt-word[data-kind="golden"]:not(.wt-word--missing)').innerText().then(t=>t.includes('WREN')),'golden word shown once found');
  assert(await first.locator('.wt-word--missing').count()===5,'five words left to find');
  assert(await first.getByLabel('Bonus word, 4 letters, not found yet').count()>0,'missing words announce their length');
  assert((await p.locator('.wt-summary-count').innerText()).startsWith('7 of'),'collection total');
  assert(await p.locator('.wt-page--locked').count()===9,'nine pages still waiting');
  // The verse opens through the Bible reader only when asked for.
  assert(await first.locator('[data-bible-reader]').count()===0,'verse is not loaded up front');
  await first.getByText('Read Jn 3:3').click();
  await first.locator('[data-bible-reader][data-ref="Jn 3:3"] [data-bible-text]').first().waitFor();
  assert(await fits(),'treasury with a page fits a phone');
  if(screenshotDir)await p.screenshot({path:screenshotDir+'/treasury-phone.png',fullPage:true});

  // Saved additively, and reachable from the Growth Garden.
  const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('wol.v1')).wordGarden);
  assert(['NEW','BROWN','BONE','OWN','BORN'].every(w=>saved.treasury.wg01.includes(w)),'required words saved');
  assert(saved.bonusFound.wg01.join(',')==='ONE,WREN','bonus store unchanged');
  await p.goto(base+'/#/garden');
  await p.getByText(/7 of \d+ Word Garden words kept beside their verses\./).waitFor();
  await p.getByRole('link',{name:'Open Word Treasury'}).click();
  await p.getByRole('heading',{name:'Word Treasury'}).waitFor();
  await p.getByRole('button',{name:'Back'}).click();
  await p.locator('.garden-screen').waitFor();
  await p.setViewportSize({width:1280,height:800});await p.goto(base+'/#/treasury');await p.locator('.wt-page').first().waitFor();
  if(screenshotDir)await p.screenshot({path:screenshotDir+'/treasury-desktop.png'});
  assert(!errors.length,errors.join('; '));
  return {emptyState:true,recorded:true,goldenShown:true,lazyVerse:true,gardenLink:true,errors};
 }finally{await c.close()}
}
