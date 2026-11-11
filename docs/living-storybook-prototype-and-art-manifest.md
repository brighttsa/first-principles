# Living Storybook — prototype and art manifest

## What exists (prototype, browser-verified)
Flagship story **"A New Beginning" (John 3, Nicodemus)**, reachable from the chapter intro ("Begin with a story") or `#/story/john3`.

- `js/story-living-storybook-content-a-new-beginning.js` — scene data + story registry (`storyForWorld`).
- `js/screen-living-storybook-reader.js` — the reader screen (route `story`).
- `css/living-storybook-reader.css` — styles.
- Wired: route in `main.js`, entry button in `screen-chapter-introduction-world-1.js`, stylesheet in `index.html`.

Flow: 7 painted scenes, tap/Next to advance, night→day scene filter, Sprig narrates. Interactions: tap the glowing word **again** to reveal "from above"; a reflective choice ("What is the new birth?") with a gentle correction. Ends by handing into the first lesson (`#/lesson/0`). A read flag is saved (`state.story.read.john3`, additive to `wol.v1`).

Scripture is shown only through the Bible reader component (verbatim KJV from the provider — built-in lesson text or bible-api.com): **Jn 3:3**, **Jn 3:5-6**, and **John 3:8** (3:8 fetches live from the provider; offline it shows the reader loading/error state). Narration is plain description in our own words; Jesus' words appear only as the cited verse.

## Art used (existing, real assets)
- Backdrops: `assets/art/world-1-plates/landscape-early-2752.webp` and `landscape-complete-2752.webp` (night via CSS filter).
- Scene sprites: `gemini-world-1/sprite2-lantern-lit`, `sprite-doorway-lit`, `sprite-bible-open`, `sprite-garden-bloom`.
- Sprig poses for the narrator.

## Bespoke art still to produce (Gemini, not yet made)
Match the existing World 1 plate style (bold ink outlines, saturated emerald/gold, ~15% watercolour softness). Portrait or square, transparent where a cutout is needed. Record model/method/date in `assets/licenses/ASSET-CREDITS-AND-LICENSES.txt`.

1. **Nicodemus** — DONE as a full painted night scene (`assets/art/story-a-new-beginning/night-garden-nicodemus-2528.webp`): the teacher with a glowing lantern on the moonlit garden path. Used as the night backdrop for scenes 1-4. A separate figure cutout/bust could still be added for variety.
2. **Jesus** — reverent, warm, not a face close-up; a standing figure with gentle light, robes. Used when the cited verse is His. Keep respectful and non-caricatured; get pastoral sign-off on depiction.
3. **Night-garden backdrop** — DONE (same image as #1); the CSS day-plate filter is no longer used for night.
4. **Wind of the Spirit** — DONE (`assets/art/story-a-new-beginning/wind-of-the-spirit.webp`): the day garden mid-gust for the John 3:8 beat. Optional still: a Nicodemus+Jesus two-shot for the conversation.

Until (1)-(2) exist, scenes use the lantern/doorway sprites and Sprig rather than placeholder character faces.

## Open questions / for pastoral review
- Whether and how to depict Jesus visually (option: keep Him off-screen, represented by light, and only ever show His words as the verse).
- The reflective-choice wording ("A new life God gives" vs "A life we earn ourselves") and the correction line — confirm doctrine and tone.
- Which additional stories per world, and where each launches (intro only, or also a map landmark).

## Scripture-accuracy pass (2026-11-11)
Narration audited against KJV John 3:1-8 (fetched from source) and tightened:
- Opening now states only what the text says ("a ruler of the Jews named Nicodemus, a teacher, came to Jesus by night"); dropped the invented "quietly through the garden".
- Nicodemus' line now reflects 3:2 ("no one could do Jesus' miracles unless God was with him").
- Jn 3:4 reflected ("asked how a man could be born when he is old").
- The wind beat now matches 3:8 ("cannot tell where the wind comes from or where it goes, yet you hear its sound; so is every one born of the Spirit") instead of the earlier "see the leaves it lifts".
- Removed the seed→flower metaphor (foreign to John 3); the Sprig line now says the new birth is "God's own work — born of the Spirit, not of ourselves".
Verses (Jn 3:3, 3:5-6, John 3:8) remain verbatim through the KJV reader.

### Still for the owner's pastoral review (interpretive, not changed unilaterally)
- The "anothen = from above" teaching note (consistent with the World 1 curriculum's ANOTHEN puzzle).
- The reflective choice: correct "A new life God gives" vs incorrect "A life we earn ourselves" / "not something we earn" — a grace framing inferred from the passage; confirm wording and doctrine.
- Depicting Jesus at all (the night conversation scene). Confirm the depiction is acceptable, or we keep Him represented by light only.
