# Codex handoff: First Principles (parallel work with Claude)

Paste the block below into Codex. Claude Code is working in the same folder at the same time.

---

You are joining an in-progress project, **First Principles** — a premium animated Christian Bible-learning adventure game (children, teens, adults). No-build static site: vanilla ES modules, hash router (`#/map`, `#/lesson/0`, `#/story/john3`, `#/daily`, `#/library`, `#/progress`, `#/settings`), state in `localStorage` key `wol.v1`. Folder: `/Users/bskt/Downloads/Kenney Game Assets All-in-1/word-of-life`. **Read `AGENTS.md` first and obey it.** No framework, no new dependencies.

Run it: `cd word-of-life && python3 -m http.server 8733`, open `http://127.0.0.1:8733/`. Use a real browser (Playwright is available) to verify; the dev server may serve cached CSS, so hard-reload.

## Version control (NEW)
The folder is now a **git repo on branch `main`** (repo-local identity already set). Commit per change with conventional messages (`feat:`, `fix:`, `refactor:`…), no AI references. Latest commits: baseline → Living Storybook prototype → three painted story scenes + a Scripture-accuracy pass. Do `git log`/`git status` before you start.

## Hard rules (from the owner)
- **Scripture-first KJV, never from memory.** Show verses only through the Bible reader component (`BibleVerse(ref, 'KJV', …)` in `js/bible-verse-reader-and-version-comparison-component.js`), which loads verbatim KJV from the provider (built-in lesson text or `bible-api.com`). Narration between verses is plain description in your own words. No tithing/offerings. No hearts, lives, aggressive streaks, or rewards implying spiritual worth.
- **Pastoral review is the owner's and is pending — do not "fix" doctrine.** If a change touches doctrine/wording, surface it to the owner rather than deciding it. Player-facing text must not name the teaching manual or the church.
- **Preserve saved progress.** All `wol.v1` changes must be additive (old saves still load).
- **Every image HD** (natural pixels ≥ 2× displayed size). Record provenance for new art in `assets/licenses/ASSET-CREDITS-AND-LICENSES.txt` (tool, model shown, method, date).
- **Preview before installing, in small steps.** Don't claim something works without testing it in the browser (phone + desktop, console clean). A blunt global restyle was rejected before.
- Files ≤ ~200 lines where sensible; kebab-case descriptive names; comments explain the *why*, not plan/finding codes.

## Art direction
The approved art is the **painted Gemini World 1/2 map plates** (`assets/art/world-1-plates`, `world-2-plates`) — crisp digital cartoon, bold ink outlines, ~15% watercolour softness, emerald/turquoise/gold/coral/sky-blue/restrained-lavender. The secondary screens (Settings, Daily, Progress, Library, lessons, review) sit on this painting via `css/painted-screen-headers-for-secondary-screens.css`, and the backdrop **follows the active world** (`body[data-world]`, set in `js/main.js`). Keep the original green sprout mascot (Sprig).

## State of work
- **Living Storybook** (NEW signature feature, built and committed): "A New Beginning" (John 3, Nicodemus). Route `story` → `js/screen-living-storybook-reader.js`; content `js/story-living-storybook-content-a-new-beginning.js`; styles `css/living-storybook-reader.css`; launch button on the chapter intro (`js/screen-chapter-introduction-world-1.js`). 9 painted scenes, tap/Next, a tap-to-reveal word beat and a reflective choice, then it hands into `#/lesson/0`. Verses (Jn 3:3, 3:5-6, John 3:8) are verbatim via the reader. Narration was audited against KJV John 3:1-8. Bespoke painted scenes live in `assets/art/story-a-new-beginning/`.
  - **Open with the owner:** the scene **depicts Jesus** (reverent, soft light-glow); and two interpretive lines (the "anothen = from above" note; the "not something we earn" choice). All flagged in `docs/living-storybook-prototype-and-art-manifest.md`. **Do not alter the storybook files or its doctrine without coordinating — Claude owns them right now.**
- Done earlier and verified: World 1 and World 2 content, maps, gardens, medals, Progress, unlock; adaptive learning + review session; painted-garden secondary screens.

## Good places for Codex that do NOT overlap the storybook
1. **Offline-proof John 3:8** — it currently fetches live. Add the exact KJV text to the built-in set (`localKjv` in `js/bible-text-provider-and-authorized-translation-states.js`) by copying it from the provider's response (not from memory). Small, safe, well-scoped.
2. **Tablet map layout** (768–1099 px): the portrait map is stretched; plan a proper tablet crop/layout. Files: `css/world-1-unified-plate.css`, `css/world-2-adventure-map.css`, `MAP_LAYOUTS` in `js/screen-adventure-map-for-active-world.js`.
3. **A Stories entry + progress** beyond the intro button: a tasteful "Stories" card (e.g., on the Library) and a saved "read" indicator (`state.story.read`, already additive). Keep the reader file alone; add the entry point elsewhere.
4. **Worlds 3–6 content** from the manual's Sessions 3–6 (World 3 cites "Easy English" — ask the owner before using it).
5. **Performance/accessibility pass** on the painted-backdrop screens (the fixed full-size plate backgrounds are heavy on low-end phones); slow-network and interrupted-lesson tests.

## How to verify (what has worked)
- Real browser flows with Playwright in isolated contexts; seed `localStorage` `wol.v1` via an init script. Test phone (320, 390), tablet (768, 1024), desktop (1280), large text, keyboard-only, reduced motion. Watch for console errors, horizontal overflow, targets < 44 px, missing names/alt/labels, duplicate ids.
- Commit each working change; say in your reply which files you touched.

## Coordination
- Tell the owner which files you're about to edit. **Avoid the Living Storybook files and its art** while Claude is on them. Don't revert changes you didn't make; if a file changed on disk, re-read it. Keep progress notes in your replies; the owner decides priorities.
