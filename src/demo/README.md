# Demo

Interactive demo application and visualizer for Anima.

## Files

- [apply-theme-tokens.ts](apply-theme-tokens.ts): Utility functions generating CSS custom properties and applying palette and theme design tokens.
- [apply-typography-tokens.ts](apply-typography-tokens.ts): Utility functions generating typography CSS custom properties and applying typography design tokens to element styles.
- [demo.scss](demo.scss): Styles for the `<an-demo>` component defining combined light-dark CSS variables (`--an-main_[type]-[section]`) via `light-dark()`, typography token bindings (`h1`, `h2`, `p`, `li`, `code`, `button`), typography controls, segmented mode toggles, 5-palette previews, and the 8-theme showcase grid.
- [demo.ts](demo.ts): `<an-demo>` Lit Web Component coordinating introduction, picker, 5-palette previews, 8-theme showcase grid, typography controls and reactive token bindings, segmented light/dark mode selection, Penpot design token export, and dynamic root CSS token theming via `Signal.subtle.Watcher`.
- [download-penpot-tokens.ts](download-penpot-tokens.ts): Utility function triggering browser download of Penpot palette, theme, and typography design tokens.
- [favicon.svg](favicon.svg): Vector SVG favicon featuring the Anima harmonic color bloom.
- [google-fonts.ts](google-fonts.ts): Curated Google Fonts lists (`ALL_FONTS`, `TITLE_FONTS`, `BODY_FONTS`, `CODE_FONTS`).
- [index.html](index.html): HTML shell hosting the bundled demo application with preloaded Google Fonts stylesheet links.
- [main.ts](main.ts): Demo application entry point script.
- [README.md](README.md): Demo directory documentation.

## Subdirectories

- [assets/](assets/)
- [component/](component/)
- [goldens/](goldens/)
