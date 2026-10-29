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

## 3. Scope of AGENTS.md

- **Coding & Architecture Guidelines Only**: `AGENTS.md` is strictly reserved for agent coding standards, tooling workflows, and architectural boundaries. Never add product features, UI component specifications, design system guidelines, or application copy to this file; those belong in application source code, demo pages (e.g. `src/demo/demo.ts`), or `docs/`.
- **No Unsolicited Rule Additions**: Do not proactively modify `AGENTS.md` during task commits or routine workflow execution unless explicitly directed by the user.
