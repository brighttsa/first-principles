# Living Storybook — prototype and art manifest

## What exists (prototype, browser-verified)
Flagship story **"A New Beginning" (John 3, Nicodemus)**, reachable from the chapter intro ("Begin with a story") or `#/story/john3`.

- `js/story-living-storybook-content-a-new-beginning.js` — scene data + story registry (`storyForWorld`).
- `js/screen-living-storybook-reader.js` — the reader screen (route `story`).
- `css/living-storybook-reader.css` — styles.
- Wired: route in `main.js`, entry button in `screen-chapter-introduction-world-1.js`, stylesheet in `index.html`.

Flow: 7 painted scenes, tap/Next to advance, night→day scene filter, Sprig narrates. Interactions: tap the glowing word **again** to reveal "from above"; a reflective choice ("What is the new birth?") with a gentle correction. Ends by handing into the first lesson (`#/lesson/0`). A read flag is saved (`state.story.read.john3`, additive to `wol.v1`).

Scripture is shown only through the Bible reader component (verbatim KJV from the provider — built-in lesson text or bible-api.com): **Jn 3:3** and **Jn 3:5-6**. Narration is plain description in our own words; Jesus' words appear only as the cited verse.

## Art used (existing, real assets)
- Backdrops: `assets/art/world-1-plates/landscape-early-2752.webp` and `landscape-complete-2752.webp` (night via CSS filter).
- Scene sprites: `gemini-world-1/sprite2-lantern-lit`, `sprite-doorway-lit`, `sprite-bible-open`, `sprite-garden-bloom`.
- Sprig poses for the narrator.

## Bespoke art still to produce (Gemini, not yet made)
Match the existing World 1 plate style (bold ink outlines, saturated emerald/gold, ~15% watercolour softness). Portrait or square, transparent where a cutout is needed. Record model/method/date in `assets/licenses/ASSET-CREDITS-AND-LICENSES.txt`.

1. **Nicodemus** — an older, kindly teacher in simple first-century robes, holding or beside a lantern (he came by night). Full figure cutout + a friendly bust. For the night scenes.
2. **Jesus** — reverent, warm, not a face close-up; a standing figure with gentle light, robes. Used when the cited verse is His. Keep respectful and non-caricatured; get pastoral sign-off on depiction.
3. **Night-garden backdrop** — a dedicated dusk version of the World 1 garden (stars, moonlight, lantern glow) so night scenes don't rely on a CSS filter of the day plate.
4. Optional: a soft "wind/Spirit" motif backdrop for the "born of the Spirit" beat (John 3:8 theme), and a Nicodemus+Jesus two-shot for the conversation.

Until (1)-(2) exist, scenes use the lantern/doorway sprites and Sprig rather than placeholder character faces.

## Open questions / for pastoral review
- Whether and how to depict Jesus visually (option: keep Him off-screen, represented by light, and only ever show His words as the verse).
- The reflective-choice wording ("A new life God gives" vs "A life we earn ourselves") and the correction line — confirm doctrine and tone.
- Which additional stories per world, and where each launches (intro only, or also a map landmark).
