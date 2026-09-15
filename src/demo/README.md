# Demo

Interactive demo application and visualizer for Anima.

## Files

- [apply-theme-tokens.ts](apply-theme-tokens.ts): Utility functions generating CSS custom properties and applying palette and theme design tokens.
- [demo.scss](demo.scss): Styles for the `<an-demo>` component utilizing CSS `light-dark()` variables bound to theme tokens, styling segmented mode toggles, 5-palette previews, and the 8-theme showcase grid.
- [demo.ts](demo.ts): `<an-demo>` Lit Web Component coordinating introduction, picker, 5-palette previews, 8-theme showcase grid, segmented light/dark mode selection, and dynamic root CSS token theming (`--an-[palette_type]-[shade]` and `--an-main-[mode]_[type]-[section]`) via `Signal.subtle.Watcher`.
- [favicon.svg](favicon.svg): Vector SVG favicon featuring the Anima harmonic color bloom.
- [index.html](index.html): HTML shell hosting the bundled demo application for GitHub Pages.
- [main.ts](main.ts): Demo application entry point script.
- [README.md](README.md): Demo directory documentation.

## Subdirectories

- [assets/](assets/)
- [component/](component/)
- [goldens/](goldens/)
