// Connects a puzzle's Scripture explanation to the verse text it cites, so the answer feedback can show
// the KJV wording itself instead of only a reference. Only verses the lesson already carries are returned.

const CITATION = /((?:[1-3] ?)?[A-Z][a-z]{1,5}) (\d+):(\d+)(?:-(\d+))?/g;
const parse = (text) => [...String(text).matchAll(CITATION)].map((m) => ({
  book: m[1].replace(' ', ''), chapter: +m[2], from: +m[3], to: +(m[4] || m[3]),
}));

/** Verses of the lesson (main verse plus supporting verses) as [{ref, text}]. */
export const lessonVerses = (lesson) => [{ ref: lesson.ref, text: lesson.verse }, ...(lesson.support || [])];

/**
 * Verses from `verses` that the explanation `learn` cites (e.g. "(Jn 3:3)"), in the order cited, at most `max`.
 * A cited verse matches a range such as "Jn 3:5-6" when it falls inside it.
 */
export function citedVerses(learn, verses, max = 2) {
  const found = [];
  for (const cite of parse(learn)) {
    const hit = verses.find((v) => parse(v.ref).some((r) => r.book === cite.book && r.chapter === cite.chapter && cite.from >= r.from && cite.to <= r.to));
    if (hit && !found.includes(hit)) found.push(hit);
  }
  return found.slice(0, max);
}
