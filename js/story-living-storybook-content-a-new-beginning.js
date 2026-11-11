// Living Storybook content. An interactive illustrated story, not a video: the player taps through painted scenes, meets the
// moment in Scripture, and takes a small action at the key beat before the lesson begins.
//
// Scripture rule: the only quoted words are shown through the Bible reader component, which loads verbatim KJV from the
// text provider (built-in lesson text or bible-api.com). Narration here is plain description in our own words, never Scripture
// from memory, and Jesus' words appear only as the cited verse. Draft wording; pastoral review is the owner's and still pending.
//
// Scenes use existing painted art: a World 1 backdrop, a scene sprite from assets/art/gemini-world-1, and Sprig as the guide.
// Bespoke character art (Nicodemus, Jesus) is not yet produced; see docs for the art manifest.

/** One flagship story keyed by id. `verse` refs resolve through the KJV provider; `reveal` and `choice` are the interactions. */
export const STORIES = {
  john3: {
    id: 'john3', world: 1, title: 'A New Beginning', subtitle: 'John 3 · Nicodemus by night',
    scenes: [
      { bg: 'early', night: true, sprite: null, speaker: 'Narrator', mood: 'thinking',
        text: 'Late one night, a respected teacher named Nicodemus came quietly through the garden to find Jesus.' },
      { bg: 'early', night: true, sprite: null, speaker: 'Narrator', mood: 'curious',
        text: 'Nicodemus knew that God must be with Jesus. But Jesus told him about something completely new.' },
      { bg: 'early', night: true, sprite: null, speaker: 'Jesus', mood: 'encouraging',
        text: 'Jesus answered him:', verse: 'Jn 3:3' },
      { bg: 'early', night: true, sprite: null, speaker: 'Narrator', mood: 'thinking',
        text: 'Nicodemus wondered how anyone could be born a second time.',
        reveal: { before: 'The word Jesus used, ', word: 'again', after: ', means something wonderful.',
          meaning: 'It means “from above”. The new birth is a new life that comes down from God, from heaven.' } },
      { bg: 'early', night: false, sprite: 'bible-open', speaker: 'Jesus', mood: 'encouraging',
        text: 'Jesus explained how this new life begins:', verse: 'Jn 3:5-6' },
      { bg: 'complete', night: false, sprite: 'garden-bloom', speaker: 'Sprig', mood: 'happy',
        text: 'A life born of the Spirit grows like a tiny seed becoming a flower — something only God can make alive.' },
      { bg: 'complete', night: false, sprite: 'garden-bloom', speaker: 'Sprig', mood: 'pointing',
        text: 'One last thought before we begin.',
        choice: { prompt: 'What is the new birth?',
          options: [
            { label: 'A new life God gives', correct: true, say: 'Yes — it is a gift from God, from above.' },
            { label: 'A life we earn ourselves', correct: false, say: 'Gently, no — it is a gift from God, from above, not something we earn.' },
          ] } },
    ],
  },
};

export const storyById = (id) => STORIES[id] || null;
export const storyForWorld = (worldId) => Object.values(STORIES).find((s) => s.world === worldId) || null;

// Scene art lives here so the screen stays about behaviour. Backdrops are World 1 plates; sprites are the gemini-world-1 set.
export const BACKDROP = {
  early: 'assets/art/world-1-plates/landscape-early-2752.webp',
  complete: 'assets/art/world-1-plates/landscape-complete-2752.webp',
  night: 'assets/art/story-a-new-beginning/night-garden-nicodemus-2528.webp',
};
export const SPRITE = {
  'lantern-lit': 'assets/art/gemini-world-1/sprite2-lantern-lit',
  'doorway-lit': 'assets/art/gemini-world-1/sprite-doorway-lit',
  'bible-open': 'assets/art/gemini-world-1/sprite-bible-open',
  'garden-sprout': 'assets/art/gemini-world-1/sprite-garden-sprout',
  'garden-bloom': 'assets/art/gemini-world-1/sprite-garden-bloom',
};
