# Codex handoff: First Principles (parallel work with Claude)

You are joining an in-progress project. Claude Code is working in the same folder at the same time, so follow the coordination rules below.

## Project
First Principles: a premium animated Christian Bible-learning adventure game (children, teens, adults). No-build static site: vanilla ES modules, hash router (`#/map`, `#/lesson/0`, `#/garden`, `#/review`), state in `localStorage` key `wol.v1`. Folder: `/Users/bskt/Downloads/Kenney Game Assets All-in-1/word-of-life`. **Read `AGENTS.md` first and obey it.** No framework, no new dependencies. The folder is not a git repository, so copy a file somewhere safe before a risky edit.

Run it: `cd word-of-life && python3 -m http.server 8733` then open `http://127.0.0.1:8733/`. Use Playwright (already available) for real browser checks.

## Hard rules (from the owner)
- Scripture-first KJV. Never write a verse from memory: fetch KJV from a public-domain source (e.g. `https://bible-api.com/<ref>?translation=kjv`) and copy it unchanged. Flag anything unverifiable. No tithing or offerings content. No hearts, lives, aggressive streaks, or rewards that imply spiritual worth.
- Content follows the private teaching manual's wording; player-facing text must not name the manual or the church. Pastoral review is the owner's and is still pending: do not "fix" doctrine.
- Preserve saved progress. Changes to `wol.v1` must be additive (old saves must still load).
- **Every image must be HD**: natural pixels at least 2x displayed CSS size. Use `srcset` where sizes differ. Record provenance for any new art in `assets/licenses/ASSET-CREDITS-AND-LICENSES.txt` (Gemini app, picker name, method, date).
- **Preview before installing** UI or art changes and make them in small steps. A blunt global restyle was rejected earlier. Do not claim something is fixed without testing it in the browser (desktop and phone, console clean).
- Files under about 200 lines where sensible, kebab-case descriptive names, descriptive comments about the why (not plan or finding codes).

## Architecture in one minute
- Worlds: `js/worlds-registry-active-world-and-progress-keys.js` (content registry, active world, saved keys; World 1 keeps legacy keys `quiz`, `complete`, `plates[1]`). World content: `js/world-1-born-again-curriculum-content.js`, `js/world-2-holy-spirit-curriculum-content.js`. Worlds 3 to 6 are not built.
- Map: `js/screen-adventure-map-for-active-world.js` (`MAP_LAYOUTS` per world: portrait and landscape marker positions), painted scenes through `js/unified-plate-scene-builder-for-world-maps.js` with `js/world-1-unified-plate-scene.js`, `js/world-2-unified-plate-scene.js`. Garden config `GARDENS` in `js/art-cartoon-landscape-scenes-and-adventure-map.js`. Achievements per world in `js/progress-stats-achievements-and-daily-word-logic.js`.
- Lessons and puzzles: `js/lesson-screen-five-stage-flow-and-puzzle-host.js`, host `js/exercise-host-with-progress-bar-and-feedback-sheet.js`, seven engines `js/puzzle-*.js` (they call `ctx.solved`, `ctx.say`, `ctx.miss`, `ctx.onHint`).
- Adaptive learning: `js/adaptive-learning-signals-mastery-and-review-scheduling.js` (per-puzzle signals in `state.learn.puzzles`, mastery, due review, suggestion). Switch: Settings, "Adaptive help and review".
- Styling: `css/tokens.css`, `components.css`, `cartoon-game-theme-overrides.css` (later rules win), `painted-screen-headers-for-secondary-screens.css`, `world-*.css`.

## State of work
Done and verified: HD art pass; World 2 content, map, garden, medals, Progress screen, unlock after the World 1 review; responsive/accessibility fixes (single h1 per screen, 44 px targets, large-text wrapping); adaptive learning (support card after two wrong answers, scheduling, adaptive Daily Word, map suggestion) and the review session.

**Review session: done and verified by Claude** (`#/review`): `js/screen-review-session-of-due-ideas.js`, the route in `js/main.js`, a "Review N ideas" button on the Daily screen, `.review-list` styles in `css/components.css`. It gathers up to 5 due ideas (3 for children), falls back to the least-secure learned ideas, shows a calm empty state, and ends with a summary. These files are free to edit now.

**Claude's next intended work (tell Claude if you want it): none claimed yet.** Say which file you are about to edit and Claude will stay out of it.

**Good places for Codex that do not overlap:**
1. Tablet map recomposition (768 to 1099 px portrait uses the portrait painting stretched; plan a proper tablet layout or alternate crop). Files: `css/world-1-unified-plate.css`, `css/world-2-adventure-map.css`, marker positions in `MAP_LAYOUTS`.
2. Daily Word and welcome/Chapter-complete/header backdrops for World 2 (`worldTwoHeroScene` exists but is not wired; headers on Progress/Library still use World 1's painting).
3. Worlds 3 to 6 content from manual Sessions 3 to 6 (World 3 cites "Easy English" translation: ask the owner before using it).
4. Performance pass (Core Web Vitals, preload, lazy loading) and slow-network and interrupted-lesson tests.

## How to verify (what has worked)
- Real browser flows with Playwright in isolated contexts. Seed `localStorage` `wol.v1` with an init script (and reload; the app keeps state in memory). Test phone (320, 390), tablet (768, 1024), desktop (1440), large text, keyboard-only.
- Regression guard: hash `#app` innerHTML for each route under several saved states before and after a refactor, against a copy of the old code, and explain every difference.
- Run a quick audit for horizontal scroll, off-screen content, targets under 44 px, missing names/alt/labels, headings, duplicate ids.

## Coordination
- Tell the owner which files you are about to edit. Do not touch a file Claude lists as in progress. Do not revert changes you did not make; if a file changed on disk, re-read it.
- Keep progress notes in your replies; the owner decides priorities.
