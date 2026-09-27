# Core Palette Module

Color palette generation interfaces and algorithms for Anima.

## Files

- [create-neutral-palette.ts](create-neutral-palette.ts): Factory function generating the 11-shade neutral palette from a seed color with reduced saturation.
- [create-palette.ts](create-palette.ts): Radial gamut boundary sampling palette generator producing 11 shades (c50 to c950).
- [palette-set.ts](palette-set.ts): Type definition for the global design system palette set interface (`PaletteSet`).
- [palette.ts](palette.ts): Type definition for the 11-shade color palette interface (Palette).

## Subdirectories

- [goldens/](goldens/)
