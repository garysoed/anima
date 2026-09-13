# Anima Project Rules & Guidelines

## 1. Design Tokens & CSS Custom Properties

- **Omit Redundant Category Keywords**: When creating or updating CSS custom properties for design tokens, do not repeat the category nouns `palette` or `theme` in the variable names.
  - Palette tokens: `--an-[palette_type]-[shade]` (e.g. `--an-main_highlight-100`, `--an-error-500`).
  - Theme tokens: `--an-main-[mode]_[type]-[section]` (e.g. `--an-main-light_0-background`, `--an-main-dark_1-primary`).
