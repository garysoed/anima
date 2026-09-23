import {Color} from 'gs-tools/export/color';

import {Palette} from './palette';
import {SeededPaletteSet} from './seeded-palette-set';

export interface PaletteSet {
  readonly black: Color;
  readonly error: Palette;
  readonly seededPaletteSets: ReadonlyMap<string, SeededPaletteSet>;
  readonly success: Palette;
  readonly warning: Palette;
  readonly white: Color;
}
