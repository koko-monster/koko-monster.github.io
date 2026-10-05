# Japanese Festival — complete PNG asset set

23 transparent PNG files for review before Figma assembly. Open `index.html` locally to inspect them against checkerboard, cream or dark backgrounds. Click an asset for its original-size PNG.

## Changes in this version

- Removed 祭 from the lantern; preserved the white panel and paper ribs.
- Retained the approved Koko, Bear and folding fan assets.
- Added Gohanko, Rabbit, Yauyau and Tree using the existing PNGs corresponding to the supplied Drive folder. These were reused unchanged, not regenerated.
- Generated standalone scenery and decorative assets using the built-in image tool: sun, snow-capped Fuji, three clouds, blue waves, mint curls, sakura, petal, three accent groups, blank purple title panel and a taiko drum.
- Included the official logo unchanged.

`manifest.json` lists every asset, dimensions, alpha range, source category and intended role. `prompts.json` records the new generation/edit prompts. `first-batch-prompts.json` records the previously approved sample workflow.

## Figma handoff

Each PNG is an independently placeable raster object; internal strokes are not vector paths. Use two separate instances of `lantern-blank.png`. Character-held items remain part of each character PNG. The standalone drum is an optional additional prop, not a removal of the drum already held by Bear. The snow cap is part of `mountain.png`; the two purple title lobes are one PNG.

Add the cream background (#FFF9EF) as a native Figma fill. Add やさしい日本語 as live editable text, with two lines if needed. Neither the title nor background is baked into the PNG assets. Reuse the official logo without redrawing it.

This stage does not modify Figma. Full-set approval precedes composition and placement.

## Verification

All 23 files load successfully and have alpha channels with fully transparent pixels. Characters and motifs were visually inspected in the review page; props and decorative edges were checked against dark backgrounds, and the character set against checkerboard. Official logo bytes match the supplied local master. Some generated files have a maximum alpha of 254 rather than 255; their exact alpha ranges are retained in the manifest without altering the generated images.

Some raw image previews expose RGB values stored behind alpha-zero pixels, which can resemble colored haze. The HTML review and Figma use the alpha channel correctly.
