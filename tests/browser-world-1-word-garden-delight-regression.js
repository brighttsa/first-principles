// Playwright browser_run_code snippet for the three opening Word Garden levels.
async (page, base = 'http://127.0.0.1:8733', screenshotDir = '') => {
 const c=await page.context().browser().newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});
 const assert=(ok,msg)=>{if(!ok)throw Error(msg)}, errors=[];
 const p=await c.newPage(); p.setDefaultTimeout(6500);

 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});p.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(r.status()+' '+r.url())});
 const levels=['Wake the garden','Words in the waterfall','The Spirit crossing'];
 async function level(n){await p.getByRole('heading',{name:levels[n]}).waitFor();assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'viewport overflow')}
 const tile=l=>p.locator('.wg-letter[aria-pressed="false"]').filter({hasText:new RegExp('^'+l+'$')}).first();
 async function enter(word,method='key'){for(const l of word){const t=tile(l);if(method==='tap')await t.tap();else await t.press('Enter')} await p.locator('[data-submit]').press('Enter')}
 async function drag(word,touch){const tiles=await p.locator('.wg-letter').all(), visited=new Set(), points=[];
 for(const l of word){for(const t of tiles){const id=await t.getAttribute('data-letter');if(!visited.has(id)&&await t.innerText()===l){visited.add(id);const b=await t.boundingBox();points.push({x:b.x+b.width/2,y:b.y+b.height/2});break}}}
 const [a,...rest]=points;
 if(touch){const s=await c.newCDPSession(p);await s.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[a]});for(const point of rest)await s.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point]});await s.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await s.detach()}
 else {await p.mouse.move(a.x,a.y);await p.mouse.down();for(const point of rest)await p.mouse.move(point.x,point.y,{steps:5});await p.mouse.up()}
 }
 async function learn(answer,ref){await p.locator('.wg-discovery [data-bible-text]').first().waitFor();assert(await p.locator('.wg-discovery [data-bible-reader]').getAttribute('data-ref')===ref,'reference '+ref);await p.getByRole('button',{name:answer,exact:true}).press('Enter');await p.getByRole('button',{name:'Continue',exact:true}).waitFor();}
 try{
 await p.goto(base+'/?wg-debug#/lesson/0');await p.getByRole('button',{name:'Start puzzles'}).tap();await level(0);
 if (screenshotDir) await p.screenshot({path:screenshotDir+'/'+'delight-wheel-phone.png'});
 await drag('NEW',true);await p.getByRole('listitem',{name:'NEW found'}).waitFor();
 assert(await p.locator('.wg-scene').getAttribute('data-growth')==='1','sprout grows');
 await enter('ONE','tap');await p.locator('[data-feedback="bonus"]').waitFor();
 await enter('ONE');await p.locator('[data-feedback="repeat"]').waitFor();
 await enter('NNW');await p.locator('[data-feedback="retry"]').waitFor();
 await p.getByRole('button',{name:'Hint',exact:true}).tap();await p.getByText(/Hint: The key word/).waitFor();
 await p.getByRole('button',{name:'Shuffle letters'}).tap();
 assert(await p.locator('.wg-letter').count()===7,'shuffle retains letters');
 await enter('BORN');await learn('A person needs a new birth.','Jn 3:3');
 await p.reload();await level(1);
 await p.setViewportSize({width:768,height:1024});await level(1);
 await drag('WATER',false);await p.getByText('What does Peter say the new birth comes by? Find the key word.').waitFor();
 assert((await p.locator('.wg-letter').allTextContents()).join('')==='SODWR','deterministic cascade');
 assert(await p.locator('.wg-letter').first().evaluate(e=>getComputedStyle(e).animationName)==='none','reduced motion');
 if (screenshotDir) await p.screenshot({path:screenshotDir+'/'+'delight-cascade-tablet.png'});
 const clue = p.locator('.wg-evidence-clue');
 assert(await clue.getAttribute('open') === null, 'The verse clue starts collapsed');
 await clue.locator('summary').press('Enter');
 assert(await clue.locator('p').isVisible(), 'The passage is available before solving the second rack');
 await clue.locator('summary').press('Enter');
 await p.getByRole('button', { name: 'Hint', exact: true }).press('Enter');
 await p.getByText('Hint: Open the verse and look for what comes just after “by”.').waitFor();
 await p.getByRole('button', { name: 'Hint', exact: true }).press('Enter');
 await p.getByText('Hint: The answer has four letters and starts with W.').waitFor();
 await p.getByRole('button', { name: 'Hint', exact: true }).press('Enter');
 await p.getByText('Hint: Connect W → O → R → D.').waitFor();
 await enter('WORD');
 assert(!(await p.locator('.wg-clue').isVisible()), 'The spelling prompt is replaced by the evidence task');
 assert(!(await p.locator('#foot').getByText('Hint: Connect W → O → R → D.').isVisible()), 'The old rack hint is cleared');
 const evidence = p.locator('.wg-evidence');
 await evidence.getByRole('heading', { name: 'Which phrase shows what the new birth comes by?' }).waitFor();
 assert(await evidence.getAttribute('data-ref') === '1 Pet 1:23', 'Evidence retains the KJV reference');
 assert(await evidence.getByRole('heading').evaluate(el => el === document.activeElement), 'Evidence prompt receives focus');
 await evidence.getByRole('button', { name: 'which liveth and abideth for ever.', exact: true }).press('Enter');
 await evidence.getByText(/This describes the Word of God/).waitFor();
 assert(!(await p.evaluate(() => JSON.parse(localStorage.getItem('wol.v1')).done.wg02)), 'Wrong evidence does not complete the level');
 if (screenshotDir) {
   await p.setViewportSize({ width: 390, height: 844 });
   await p.screenshot({ path: screenshotDir + '/waterfall-evidence-phone.png' });
   await p.setViewportSize({ width: 1280, height: 800 });
   await p.screenshot({ path: screenshotDir + '/waterfall-evidence-desktop.png' });
 }
 await evidence.getByRole('button', { name: 'by the word of God,', exact: true }).press('Enter');
 await p.getByRole('button', { name: 'Continue', exact: true }).waitFor();
 await p.getByRole('button',{name:'Continue',exact:true}).press('Enter');await level(2);
 await p.setViewportSize({width:1280,height:800});await level(2);
 await enter('TRIP');assert(await p.locator('.wg-scene').getAttribute('data-growth')==='1','bridge half complete');
 if (screenshotDir) await p.screenshot({path:screenshotDir+'/'+'delight-bridge-desktop.png'});
 await enter('SPIRIT');await learn('What is born of the flesh and what is born of the Spirit.','Jn 3:6');
 assert(await p.locator('.wg-scene').getAttribute('data-growth')==='3','bridge celebration');
 const saved=await p.evaluate(()=>JSON.parse(localStorage.getItem('wol.v1')));
 assert(['wg01','wg02','wg03'].every(id=>saved.done[id]),'three saved levels');
 assert(saved.wordGarden.bonusFound.wg01.join(',')==='ONE','bonus exactly once');
 const marks=await p.evaluate(()=>performance.getEntriesByType('mark').filter(e=>e.name.startsWith('word-garden:')).map(e=>e.name));
 assert(marks.includes('word-garden:wg03:complete'),'local instrumentation');
 await p.getByRole('button',{name:'Continue',exact:true}).press('Enter');await p.getByRole('heading',{name:'Nicodemus hears the invitation'}).waitFor();
 assert(!errors.length,errors.join('; '));
 return {levels:3,touchDrag:true,mouseDrag:true,tapAndKeyboard:true,bonusAndRetry:true,resume:true,cascade:true,verseClue:true,gradedHints:true,evidence:true,reducedMotion:true,existingPuzzleReached:true,errors};
 }finally{await c.close()}
}
