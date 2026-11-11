// Knowledge Challenge: comprehension questions. Every option, right or wrong, explains itself.
// Wrong answers allow a retry; first-try results are recorded for the learner's own summary only.
import { h, esc, $, announce, shuffle } from './core-utilities-and-dom-helpers.js';
import { sfx, buzz, speak } from './sound-effects-music-narration-haptics.js';
import { sprig } from './art-sprig-character-and-world-glyphs.js';

export function runQuiz(root, questions, { onDone, onFirstTry, verses = [] }) {
  let qi = 0, firstTry = 0, tried = false;
  function ask(moveFocus = false, reply = '') {
    const q = questions[qi], part = reply ? q.evidence : q;
    if (!reply) tried = false;
    const options = shuffle(part.options);
    const context = q.evidence ? (reply ? ' · Scripture evidence' : ' · Story decision') : '';
    const passages = (part.refs || []).map(ref => verses.find(verse => verse.ref === ref)).filter(Boolean);
    root.innerHTML = `<div class="steps" aria-hidden="true">${questions.map((_, i) => `<i class="${i < qi ? 'done' : i === qi ? 'now' : ''}"></i>`).join('')}</div>
      <p class="kicker" style="margin-top:16px">Question ${qi + 1} of ${questions.length}${context}</p><h2 id="quiz-question" tabindex="-1"></h2>
      ${reply ? `<p class="muted"><strong>Your reply:</strong> ${esc(reply)}</p>` : ''}
      ${passages.map(verse => `<details class="ex-verses"><summary>Read ${esc(verse.ref)} (KJV)</summary><p class="ex-verse">${esc(verse.text)}</p></details>`).join('')}
      <div class="opts" role="group" aria-labelledby="quiz-question"></div><div id="fb"></div>`;
    $('#quiz-question', root).textContent = part.q; speak(part.q);
    if (moveFocus) $('#quiz-question', root).focus();
    const opts = $('.opts', root);
    options.forEach((o, i) => opts.append(h(`<button class="opt" data-i="${i}">${esc(o.t)}</button>`)));
    opts.onclick = (e) => {
      const b = e.target.closest('.opt'); if (!b || b.disabled) return;
      const o = { ...options[+b.dataset.i] }, fb = $('#fb', root);
      o.why = o.why.replace(/^(Yes|Not quite)[:.!]?\s*/, ''); // the bold lead-in is added below
      if (o.ok) {
        if (q.evidence && !reply) {
          sfx('good', .6); buzz(20);
          ask(true, o.t);
          announce('That reply fits. Now find the Scripture that supports it.');
          return;
        }
        b.classList.add('right'); sfx('good', .6); buzz(20); if (!tried) { firstTry++; onFirstTry?.(q.id, true); }
        fb.innerHTML = `<div class="feedback">${sprig('happy')}<div class="explain good"><b>Yes!</b> ${esc(o.why)}</div></div><div class="row"><button class="btn" id="go">${qi === questions.length - 1 ? 'See my results' : 'Next question'}</button></div>`;
        announce('Correct. ' + o.why);
        $('#go', root).focus(); $('#go', root).onclick = () => { qi++; if (qi >= questions.length) onDone({ firstTry, total: questions.length }); else { sfx('page', .3); ask(true); } };
        opts.querySelectorAll('.opt').forEach((x) => { x.disabled = true; });
      } else {
        b.classList.add('wrong'); b.disabled = true; sfx('oops', .4); if (!tried) onFirstTry?.(q.id, false); tried = true;
        fb.innerHTML = `<div class="feedback">${sprig('curious')}<div class="explain bad"><b>Not quite.</b> ${esc(o.why)} Try another answer.</div></div>`;
        announce('Not quite. ' + o.why + ' Try another answer.');
        if (e.detail === 0) (b.nextElementSibling?.matches(':enabled') ? b.nextElementSibling : $('.opt:enabled', opts))?.focus();
      }
    };
  }
  ask();
}
