# Penpot

Core Penpot design token data structures, per-set converters, and recursive token tree merger.

## Files

- [merge-penpot-token-trees.ts](merge-penpot-token-trees.ts): Pure recursive utility merging multiple Penpot token trees into a unified token tree.
- [palette-set-to-penpot-token-tree.ts](palette-set-to-penpot-token-tree.ts): Converter transforming a `PaletteSet` (including seeded palettes and global palettes) into a `PenpotTokenTree`.
- [penpot.ts](penpot.ts): Types and interfaces defining the Penpot token tree, color tokens, and composite typography tokens.
- [theme-set-to-penpot-token-tree.ts](theme-set-to-penpot-token-tree.ts): Converter transforming a `ThemeSet` into a `PenpotTokenTree` referencing palette color aliases.
- [typography-set-to-penpot-token-tree.ts](typography-set-to-penpot-token-tree.ts): Converter transforming a `TypographySet` into a `PenpotTokenTree` with composite typography tokens and code variants.
