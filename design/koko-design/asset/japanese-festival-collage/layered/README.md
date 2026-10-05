# Superseded layered reinterpretation

Do not use this version for page adaptation. It changed the source composition. The current handoff is the [pixel-identical layered master](../exact-layered/README.md).

Open `KM-CAM-A-japanese-festival-layered.svg` in Figma, Illustrator, Affinity Designer or Inkscape. The file uses named SVG layers for background, motifs, lettering, six separate character assets and the official logo.

The Japanese title is live SVG text: **にほんご まつり**. Convert it to outlines only when producing a final print export, while retaining this live-text master.

Each character is a separate transparent PNG and can be moved, resized, hidden or replaced without affecting the others. Character internals remain raster artwork rather than editable vector paths. The manifest records layer names, source files, intended role and editability.

Keep this SVG and its `layers/` directory together so linked images resolve. Use the official logo layer rather than any generated logo contained in the flattened concept.

- [Open the editable SVG master](KM-CAM-A-japanese-festival-layered.svg)
- [Open the rendered preview](KM-CAM-A-japanese-festival-layered-preview.png)
- [Inspect the layer manifest](manifest.json)
