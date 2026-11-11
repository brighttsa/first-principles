# World 1 "Born Again": layered environment brief for Gemini Pro

Purpose: replace the single painted map plates with independent layers so the world can react to saved progress.
The renderer already has the slots (`sky`, `distance`, `landscape`, `terrain`, `vegetation`, `props`, `particles`
in `js/world-environment-renderer.js`); `distance` and `landscape` are empty today.

Record for every file: Gemini model name as reported, method (API or app), date, in
`assets/licenses/ASSET-CREDITS-AND-LICENSES.txt`.

## Shared style (paste at the top of every prompt)

> Premium original 2D cartoon game illustration, vibrant harmonious colour, clean confident outline of consistent
> weight, soft shading, one light source from the upper left, warm morning daylight. Palette: leaf green #58CC65,
> sun yellow #FFD23F, sky blue #42B9F5, coral #FF7185, lavender #8661E8, deep navy #24346A, warm white #FFFDF7.
> Match the attached reference painting for line weight, shapes and colour. No text, letters, labels, UI, borders,
> watermarks, characters or creatures. No bloom, no sparkle clutter, no fantasy spectacle.

Attach as references: `assets/art/world-1-map-exports/map-portrait-hd.webp`, `map-landscape-hd.webp`.
Transparent layers: ask for a flat solid #FF00FF background with no shadows on it, then key it out locally.

## Layers (one image each; generate portrait 9:16 and landscape 16:9 unless noted)

| # | Layer | Content | Notes |
|---|-------|---------|-------|
| 1 | sky | Morning sky, soft clouds, sun low at upper left. No hills. | Opaque. Clouds must tile horizontally in landscape. |
| 2 | distance | Lavender mountains and far blue hills only. | Transparent below ridgeline. |
| 3 | landscape | Rolling green midground hills and meadows. No path, no landmarks. | Transparent above hills. |
| 4 | path | The winding stone path only, wide enough for markers, route readable left to right (landscape) and bottom to top (portrait). | Transparent. Keep clear 8% space around bends for UI. |
| 5 | foreground | Frame foliage: trees, bushes, flowers at the edges. Centre kept empty. | Transparent. |

## Landmark sprites (square, transparent, each in a "sleeping" and a "lit" state)

1. Stone doorway: dull and closed, then with warm light in the opening.
2. Waterfall and footbridge: dry rocks, then water running (water layers already exist separately).
3. Garden bed with sprout: empty soil, sprout, flowering plant, fruit tree (three growth stages).
4. Two carved discovery tablets (sun, cloud): plain, then glowing carvings.
5. Open Bible on a stone pedestal: closed and dim, then open with soft light.

Prompt pattern: "Single object, centred, full silhouette visible with margin, [state description], [shared style],
solid #FF00FF background."

## Acceptance checklist (from AGENTS.md)

- Crisp at 100% and at display size; export WebP, portrait 1536 px wide, landscape 2752 px wide (plus a 1400 px version).
- Same light direction, perspective and line weight across all layers and sprites.
- Clean transparent edges on the intended background, no magenta fringe.
- No text or UI in any image; no empty-gradient filler; no duplicated landmark in two layers.
- Landmark positions stay at the current anchors (portrait `PORTRAIT_NODES`, landscape `LANDSCAPE_NODES` in
  `js/screen-adventure-map-for-active-world.js`) or those arrays and the prop anchors in
  `js/world-1-environment-art-and-effects.js` are updated together.
