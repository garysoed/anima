# Demo

Interactive demo application and visualizer for Anima.

## Files

- [apply-theme-tokens.ts](apply-theme-tokens.ts): Utility functions generating CSS custom properties and applying palette and theme design tokens.
- [apply-typography-tokens.ts](apply-typography-tokens.ts): Utility functions generating typography CSS custom properties and applying typography design tokens to element styles.
- [demo.scss](demo.scss): Styles for the `<an-demo>` component defining combined light-dark CSS variables (`--an-main_[type]-[section]`) via `light-dark()` and styling segmented mode toggles, 5-palette previews, and the 8-theme showcase grid.
- [demo.ts](demo.ts): `<an-demo>` Lit Web Component coordinating introduction, picker, 5-palette previews, 8-theme showcase grid, segmented light/dark mode selection, Penpot design token export, and dynamic root CSS token theming (`--an-[palette_type]-[shade]` and `--an-main-[mode]_[type]-[section]`) via `Signal.subtle.Watcher`.
- [download-penpot-tokens.ts](download-penpot-tokens.ts): Utility function triggering browser download of Penpot design tokens.
- [favicon.svg](favicon.svg): Vector SVG favicon featuring the Anima harmonic color bloom.
- [google-fonts.ts](google-fonts.ts): Curated Google Fonts lists (`TITLE_FONTS`, `BODY_FONTS`, `CODE_FONTS`).
- [index.html](index.html): HTML shell hosting the bundled demo application for GitHub Pages.
- [load-google-font.ts](load-google-font.ts): Utility function dynamically loading Google Fonts stylesheet links into document head.
- [main.ts](main.ts): Demo application entry point script.
- [README.md](README.md): Demo directory documentation.

## Subdirectories

- [assets/](assets/)
- [component/](component/)
- [goldens/](goldens/)
