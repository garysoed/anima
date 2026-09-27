import {Color} from 'gs-tools/export/color';

import {Palette} from './palette';

export interface PaletteSet {
  readonly black: Color;
  readonly error: Palette;
  readonly main: Palette;
  readonly neutral: Palette;
  readonly other: ReadonlyMap<string, Palette>;
  readonly success: Palette;
  readonly warning: Palette;
  readonly white: Color;
}
