# UI design guideline

## Existing interface foundation

These values document the current theme preview stylesheet; they do not introduce a new visual direction. Style A applies to illustrations.

| Role | Value |
| --- | --- |
| Primary ink | #16072d |
| Secondary ink | #2e1747 |
| Primary purple | #7128e5 |
| Deep purple | #4f149e |
| Cream background | #fff9ee |
| Paper surface | #fffdf8 |
| Yellow accent | #ffd82e |
| Mint accent | #70e7c0 |
| Pink accent | #ff83b2 |
| Lime accent | #a8ed5b |
| Lavender surface | #eee4ff |
| Border | #ded3e4 |
| Muted text | #71657a |

Typography: Manrope with Noto Sans JP and a sans-serif fallback. Preserve live text for headings, Japanese labels and buttons. Do not bake interface copy into scene artwork.

The existing desktop shell is capped at 1320px with 24px side gutters. The small-screen shell uses 14px gutters and a single-column layout. The base radius token is 30px; keep component geometry consistent with the selected page stylesheet.

## Usage rules

- Deliver new visual designs with a layered editable master. Keep live text, official logo, background, characters, props and decoration independently selectable; provide flattened exports only as previews or final renditions.
- Use one primary action per section and visible keyboard focus. Check text contrast for the actual colour pairing; accent colours are not automatically suitable as text backgrounds.
- Pair one main illustration with a clear headline and action. Use supporting scenes only where they explain the content.
- On mobile stack text and artwork, preserve faces and essential props, and avoid cropping a wide hero into an unreadable strip.
- Use real links and buttons with accessible names. Use empty alt text for purely decorative scenes, or short activity descriptions when the illustration conveys information.
- Style A is the default landing-page illustration style. Other character styles have separate usage rules in the character guide.

## Interface examples

<div class="ui-demo"><p class="demo-label">TYPOGRAPHY</p><h3>A world of curious learners</h3><p>Read, explore and discover Japanese together.</p><div class="demo-actions"><a class="demo-primary" href="asset/index.html">Explore scenes</a><a class="demo-secondary" href="character/index.html">Meet the characters</a></div><p class="demo-note">Purple primary action · paper surface · dark ink · lavender border</p></div>

## Related guidelines

- Interface examples below demonstrate the palette, typography and controls directly.
- [Current landing preview](../kokomonster-shopify-theme/preview/index.html)
- [Character style guide](character/style-system-v1/GUIDE.md)
- [Scene placement guide](asset/japanese-20-style-A/README.md)
