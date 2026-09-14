# Anima Project Rules & Guidelines

## 1. Design Tokens & CSS Custom Properties

- **Omit Redundant Category Keywords**: When creating or updating CSS custom properties for design tokens, do not repeat the category nouns `palette` or `theme` in the variable names.
  - Palette tokens: `--an-[palette_type]-[shade]` (e.g. `--an-main_highlight-100`, `--an-error-500`).
  - Base palette tokens: `--an-white` and `--an-black`.
  - Theme tokens: `--an-main-[mode]_[type]-[section]` (e.g. `--an-main-light_0-background`, `--an-main-dark_1-primary`).
- **Theme Variable Resolution**: Theme CSS variables should reference the corresponding palette CSS variables via `var(...)`.

## 2. Architectural Boundary: Core vs. Demo

- **Core Module (`src/core/`)**: Must remain a pure library containing color calculations, palette generation, and data models. It must have zero DOM dependencies and must never import from `src/demo/`.
- **Demo Module (`src/demo/`)**: Houses the showcase application, Web Components, and DOM token application logic (such as `apply-theme-tokens.ts`).

## 3. Theme Models & Constants

- **PaletteColorKey**: Role colors are defined by `PaletteColorKey` (`'black' | 'white' | `${PaletteKey}.${ShadeKey}``).
- **Static Theme Configurations**: Themes are statically defined in `THEME_SET: ThemeSet` in `src/core/theme/theme-set.ts`. Inline and reference `THEME_SET` directly rather than wrapping it in reactive signals or factory calls.
