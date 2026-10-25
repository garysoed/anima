# Core Theme Module

Theme types and color resolution utilities for accessible Light and Dark themes in Anima.

## Files

- [create-theme-set.ts](create-theme-set.ts): Factory function `createThemeSet` for constructing named collections of Light and Dark themes with customizable main and neutral palette names.
- [has-adjacent-background-contrast-violation.ts](has-adjacent-background-contrast-violation.ts): Validation utility evaluating whether adjacent theme backgrounds within a mode satisfy the minimum 1.1 contrast requirement.
- [theme-set.ts](theme-set.ts): Interface `ThemeSet` defining named collections of Light and Dark themes.
- [theme.ts](theme.ts): Type definitions for theme modes, types, palette color keys, the 8-role semantic theme interface (including outline), and theme color resolution utilities.
