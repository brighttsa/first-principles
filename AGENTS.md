# AGENTS.md

## Project

First Principles is a premium, animated, interactive Christian educational adventure game for children, teenagers, and adults.

## Creative direction

- Create premium, original 2D cartoon game illustrations.
- Use vibrant, harmonious colors and thoughtfully designed environments.
- Keep character design, perspective, lighting, and illustration style consistent across the game.
- Give Sprig, the original sprout companion, expressive poses and reactions.
- Use polished animation and responsive game controls.
- Deliver professional experiences on mobile and desktop.
- Avoid paperboard and cut-paper aesthetics, generic AI-generated dashboards, repetitive placeholder components, and disconnected illustration styles.

## Art production

- Use Gemini Pro (Google) for new original production illustrations, as decided by the owner. Use only a model name that the Gemini API lists for the configured key, or that the owner confirms from Gemini itself. Record the actual model name, how it was run (API or Gemini app) and the date with each asset's provenance. If the model or access cannot be verified, leave the illustration pending. Do not invent identifiers or relabel legacy assets. Earlier assets keep their recorded provenance (Gamma and the Codex built-in image generator).
- Replace legacy illustrations only when the replacement passes the art approval process below and is ready to integrate. Prefer vectors for icons and interface elements where appropriate.
- Establish and follow one approved art bible. Use its approved reference artwork to keep lighting, perspective, shape language, colors, character proportions, and environmental rendering consistent.
- Keep illustrated environments separate from interactive UI. Calibrate map controls to landmarks for each art composition.
- Use artwork that belongs in the game world. Leave missing production art identified for follow-up.
- Optimize assets for web and mobile. Record sources and license information in `assets/licenses/ASSET-CREDITS-AND-LICENSES.txt`.

## Premium HD art and interaction standards

Apply this standard across the entire game, including new and revised artwork, environments, character animations, screens, and interface components.

- Keep production art crisp at its intended display size and density. Export and compress for the actual target sizes without visible loss of detail. Avoid stretching or enlarging images beyond their usable resolution.
- Prepare independently usable layers and sprites. Keep controls, labels, progress, and other live interface elements out of flattened illustrations.
- Prohibit generic AI fantasy backgrounds, filler gradients that conceal missing art, paperboard and cut-paper styling, plastic or excessively glossy characters, excessive bloom and sparkles, visual clutter, and decoration without a gameplay or storytelling purpose.
- Prohibit inconsistent character designs, generic component-library dashboards, repetitive circular lesson markers without a distinct identity, emoji in place of production assets, fake buttons, and nonfunctional interactions.

### Animation

- Give each world purposeful ambient movement, environmental reactions, expressive characters, and transformations tied to actual saved progress.
- Choose independent art layers, sprite frames, SVG, CSS, Canvas, or another technique suited to the assets and performance needs.
- A static illustration or a flattened image moving as a whole does not meet the living-world standard.
- Keep animation smooth and responsive. Preserve readability and support reduced motion and usable still states.

### Asset approval

- Inspect each asset at 100% and at its intended in-game size before integration. Compare both views with the approved references and check transparent edges against the intended backgrounds.
- Reject malformed structures, inconsistent perspective, weak silhouettes, uncontrolled detail, incorrect lighting or color treatment, unnatural anatomy, visible generation artifacts, poor transparency edges, and inadequate resolution.
- High pixel dimensions alone do not qualify an asset for approval.

### Major screen quality gates

1. Verify image sharpness and resolution at the actual display sizes.
2. Compare the screen and its assets with the approved art bible and reference artwork.
3. Verify responsive composition on desktop and mobile.
4. Exercise every interactive control through the real game.
5. Verify animation performance and reduced-motion behavior.
6. Check readability, contrast, and visual hierarchy.
7. Confirm that gameplay works and that the lesson teaches something meaningful.
8. Review actual rendered screenshots when tooling permits.

Revise work that fails these gates before calling it complete. A passing build alone does not establish visual, interaction, or educational quality.

**Every screen must feel deliberately designed. Every asset must belong to the same world. Every interaction must feel polished. Every lesson must teach something meaningful.**

## Educational design

- Follow the existing *Milk for the New Convert* curriculum as a private guide and preserve its theological framing. Keep player-facing text Scripture-first and omit the curriculum title, references to the manual, and church attribution from player-facing text.
- Maintain the six learning worlds in order: Born Again, The Holy Spirit, Righteousness, You Are Not a Sinner, Soul Winning, and Church Commitment.
- Use accurate Scripture references. Verify quotations against the named translation and flag unverified wording for review. Never invent Bible quotations or doctrine.
- Use KJV for current content. Add other translations only when authorized content is available.
- Exclude tithing and offerings from all game content.
- Prioritize understanding, reasoning, application, and long-term retention.
- Use the learning sequence **Discover → Read → Solve → Understand → Apply → Remember**.

## Gameplay

- Build interactive word puzzles, Scripture Detective, Truth Lab, Verse Builder, Meaning Match, Story Decisions, Memory Garden, and Chapter Challenges. Reuse existing puzzle engines and progression where they fit.
- Connect exercises to learning objectives and Scripture explanations. Give meaningful feedback, useful hints, and gentle retries.
- Use rewards to celebrate learning. Exclude hearts, lives, aggressive streak penalties, and rewards that imply spiritual worth.

## Engineering

- Inspect the repository and read its README when present before editing. Follow existing project instructions and conventions.
- Preserve existing functionality, saved progress, achievements, settings, and other player data. Keep compatibility with the existing `wol.v1` localStorage record.
- Implement working features in the live game. Reuse the existing architecture and components where appropriate.
- Keep the no-build static app based on vanilla ES modules, with no framework or new dependencies.
- Keep code maintainable and accessible. Use descriptive kebab-case filenames and consider modularizing code files over 200 lines.
- Support keyboard use, responsive layouts, and reduced-motion preferences.
- Run relevant tests after changes. For gameplay or UI changes, exercise the real browser flow, check desktop and mobile layouts, inspect the console, and verify progress survives reload when relevant.
- Report what was implemented, what was verified, and what remains incomplete.

## Workflow for substantial changes

1. Inspect the relevant code.
2. Identify the actual problem.
3. Plan the implementation.
4. Make focused changes.
5. Test the result.
6. Report outcomes and remaining limitations.

Avoid unnecessary rebuilds. Replace working features only when the change has a clear justification.

Build an exceptionally creative, educational, visually polished, and enjoyable Bible learning game.
