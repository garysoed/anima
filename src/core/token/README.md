# Token

Core conversion and serialization utilities for W3C DTCG / Tokens Studio design tokens.

## Files

- [deserialize-tokens.ts](deserialize-tokens.ts): Deserialization utility validating and normalizing single-set or multi-set JSON token objects into `TokenSets`.
- [get-seed-colour.ts](get-seed-colour.ts): Utility function extracting the seed color (`main.500`) from a Tokens Studio token tree.
- [merge-token-trees.ts](merge-token-trees.ts): Utility function for deep-merging multiple Tokens Studio `DeepKeyTokenMap` token trees.
- [palette-set-to-token-tree.ts](palette-set-to-token-tree.ts): Converter function translating a `PaletteSet` into Tokens Studio `DeepKeyTokenMap` color tokens.
- [serialize-tokens.ts](serialize-tokens.ts): Serialization utility formatting multi-set token dictionaries into a Penpot-compatible Tokens Studio JSON string with `$metadata.tokenSetOrder`.
- [theme-set-to-token-tree.ts](theme-set-to-token-tree.ts): Converter function translating a `ThemeSet` into Tokens Studio `DeepKeyTokenMap` tokens with palette alias references.
- [token-sets.ts](token-sets.ts): Type definition for `TokenSets` representing named token sets in Tokens Studio format.
- [token-tree-to-theme-set.ts](token-tree-to-theme-set.ts): Converter function reconstructing a `ThemeSet` from Tokens Studio `DeepKeyTokenMap` theme tokens.
- [token-tree-to-typography-set.ts](token-tree-to-typography-set.ts): Converter function reconstructing a `TypographySet` from Tokens Studio `DeepKeyTokenMap` typography tokens.
- [typography-set-to-token-tree.ts](typography-set-to-token-tree.ts): Converter function translating a `TypographySet` into Tokens Studio `DeepKeyTokenMap` typography tokens.
