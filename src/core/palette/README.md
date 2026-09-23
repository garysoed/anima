# Core Palette Module

Color palette generation interfaces and algorithms for Anima.

## Files

- [create-palette-set.ts](create-palette-set.ts): Factory function generating the global design system palette set (`black`, `white`, `error`, `warning`, `success`, and `seededPaletteSets`).
- [create-palette.ts](create-palette.ts): Radial gamut boundary sampling palette generator producing 9 shades (c100 to c900).
- [create-seeded-palette-set.ts](create-seeded-palette-set.ts): Factory function generating dynamic `highlight` and `neutral` palettes from a seed color with `seedName`.
- [palette-set.ts](palette-set.ts): Type definition for the global design system palette set interface (`PaletteSet`).
- [palette.ts](palette.ts): Type definition for the 9-shade color palette interface (Palette).
- [seeded-palette-set.ts](seeded-palette-set.ts): Type definition for the seed-derived palette set interface (`SeededPaletteSet`).

## Subdirectories

- [goldens/](goldens/)
