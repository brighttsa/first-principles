# World 1 living environment

The game composites two existing painted plates with independently generated waterfall, impact foam, ripple, and stream sprites, light, Kenney spark sprites, the existing Sprig pose set, and semantic HTML controls. The portrait and desktop scenes use different landmarks. Keep the plates static and register each moving element to its own anchor. Scroll-linked depth uses the browser's view timeline when supported.

## Map image resolution

The live map selects WebP exports by layout width and display density. The portrait is available at 900 × 1613 and native 1536 × 2752. The landscape is available at 1400 × 781 and native 2752 × 1536. Both were exported directly from the original paintings. Preserve the existing cover and crop registration when replacing these files. The original JPG exports remain browser fallbacks.

## Production artwork still required

| Layer | Deliverables for both compositions |
| --- | --- |
| Sky and distance | Clean sky without baked clouds, 3 separate clouds in front and rear variations, distant mountain and ridge plates with overscan, 3-frame distant bird flight cycle. |
| Terrain | Clean path and ground plates without baked water and foam, plus standalone bridge artwork for true scenery swaps. The current crossing uses registered water sprite layers and bridge masks over both existing paintings. |
| Vegetation | Clean background behind each moving plant, tree trunks and separate canopies with branch pivots, near and far bushes, flower and grass clumps with stem pivots. |
| Wildlife | 3-frame butterfly wing cycle with consistent body anchor, 2 distinct silhouettes and approved flight references. |
| Lesson landmarks | Doorway interior light matte, fruit-free canopy and registered fruit clusters, tablet reveal overlays, closed/half-open/open book frames with the spine fixed. Keep corresponding objects off the clean plates. |
| Sprig | Approved same-size atlas or layered rig with stable foot position, closed and half-closed blink frames, left/right glance frames, and 4–6 hop frames. Keep the existing seven expressions as still fallbacks. |

Export the original working files plus web-ready transparent props with tight bounds and clean alpha. Deliver a registration sheet per composition containing source canvas size, the final crop, normalized anchors, pivot and occlusion order, and the progress state that activates each prop. Match the existing color, outline and lighting and record provenance in the asset credits. All new and replacement production artwork must come from GPT Image 2.6. For final art through the Image API, use [GPT Image 2.6 Sunburst](https://developers.openai.com/api/docs/models/gpt-image-2.6-sunburst), model ID `gpt-image-2.6-sunburst`. Record the verified model for each asset. If the tool cannot verify GPT Image 2.6, leave the asset pending. Existing plates, poses, sprites, and vector artwork are legacy assets pending replacement. The current renderer integrates them with motion effects in code.

## First production batch: Sprig

Use the current `assets/art/mascot-idle.png` as the approved character reference. The generated idle master is `assets/art/mascot-idle-master-v2.png`. Use it as the reference for the six replacement expressions and the blink and hop frames. For this batch, the owner approved the Codex built-in generator based on OpenAI’s published Images 2.6 rollout. The tool supplies no per-image model identifier. Sprig can be integrated before the painted maps receive clean plates.

The six-expression source is `assets/art/mascot-expression-atlas-v2.png`. The atlas uses a transparent 3 × 2 grid with happy, thinking, and pointing across the first row, and encouraging, celebrating, and surprised across the second. The prompt used the idle master as the identity reference and held the leaf proportions, lighting, and body scale consistent across all six cells. Runtime sprites in `assets/art/mascot-poses-v2/` share a 400 × 466 canvas and baseline. The motion source is `assets/art/mascot-motion-atlas-v2.png`. Its first two cells are half and closed blink frames, followed by crouch, takeoff, apex, and landing. The map guide blinks between actions and hops after a newly completed milestone. The still pose remains visible until all animation frames decode and when reduced motion is active. Left and right glance frames remain pending.

**Idle master prompt**

> Create a production game sprite for Sprig, the sprout companion in a premium illustrated 2D adventure. Match the supplied reference's two-leaf silhouette, proportions, green palette, navy outline, coral cheeks, and soft highlights. Show the whole character in its relaxed idle pose at the same straight-on camera angle as the reference. Use a transparent canvas with even padding. Keep the lowest point of the body on a consistent baseline. Include only Sprig, with no scenery, cast shadow, text, or extra objects.

Keep canvas size, scale, eye line, light direction, and baseline consistent across the final pose and animation exports. Review silhouettes at the actual in-game sizes and check for halos on both light and dark backgrounds. Record the exact model and reference files before integration.

## Layered waterfall crossing

The source atlas is `assets/art/world-1-crossing/water-effects-atlas.png`. Four transparent WebP exports provide the falling-water highlights, impact foam, pool ripples, and stream reflections. They share the references from both existing paintings. The owner-approved Codex image generator does not expose a per-image model ID.

The live renderer registers separate portrait and landscape anchors. Each layout clips the moving water inside the painted waterfall and splits the stream into two windows, one on each side of the bridge. The masks are registration geometry. The original bridge and water remain in the static paintings underneath. The waterfall stays visible in reduced motion, and its effect strength follows the crossing's saved lesson state.

## Growth Garden

The source plate and transparent three-stage atlas are under `assets/art/world-1-growth-garden/`. The owner-approved Codex generator used both World 1 paintings as references and supplies no per-image model ID. The runtime uses a 3:2 WebP plate with six soil anchors and transparent seed, sprout, and bloom sprites on the same baseline.

The Growth Garden and map preview use all six existing milestone plots. A lesson sprouts after its first solved puzzle and blooms when its teaching card is reached. The last two plots bloom on the chapter challenge and World 1 bookplate milestones. The New Creation plot on the map uses lesson three's same stage alongside the original painted sprout. All stages derive from `wol.v1`.

## State and motion

Doorway, crossing, discovery, garden and review use the existing World 1 lesson and quiz state. The garden gains a persistent pollen layer on lesson completion. Mastery lights the review and triggers a brief burst on return during that visit. These effects do not add a second progress store. Additional foliage, wildlife movement and opening book art depend on the assets above.

Map motion pauses under reduced-motion settings, in hidden tabs, and when individual props leave view. The next-stop control pans to the real available lesson, with an instant route for keyboard or low-motion use. Native scrolling and static states remain available without scroll-linked animation support.
