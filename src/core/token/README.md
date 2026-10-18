# Token

Core conversion and serialization utilities for W3C DTCG / Tokens Studio design tokens.

## Files

- [merge-token-trees.ts](merge-token-trees.ts): Utility function for deep-merging multiple Tokens Studio `DeepKeyTokenMap` token trees.
- [palette-set-to-token-tree.ts](palette-set-to-token-tree.ts): Converter function translating a `PaletteSet` into Tokens Studio `DeepKeyTokenMap` color tokens.
- [serialize-tokens.ts](serialize-tokens.ts): Serialization utility formatting multi-set token dictionaries into a Penpot-compatible Tokens Studio JSON string with `$metadata.tokenSetOrder`.
- [theme-set-to-token-tree.ts](theme-set-to-token-tree.ts): Converter function translating a `ThemeSet` into Tokens Studio `DeepKeyTokenMap` tokens with palette alias references.
- [typography-set-to-token-tree.ts](typography-set-to-token-tree.ts): Converter function translating a `TypographySet` into Tokens Studio `DeepKeyTokenMap` typography tokens.
