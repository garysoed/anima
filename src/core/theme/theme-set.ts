import {PaletteSet} from '../palette/palette-set';

import {Theme, ThemeType} from './theme';

export interface ThemeSet {
  readonly dark: Record<ThemeType, Theme>;
  readonly light: Record<ThemeType, Theme>;
  readonly palettes: PaletteSet;
}
