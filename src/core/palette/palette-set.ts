import {Palette} from './palette';

export interface PaletteSet {
  readonly error: Palette;
  readonly highlight: Palette;
  readonly neutral: Palette;
  readonly success: Palette;
  readonly warning: Palette;
}

export const PALETTE_KEYS: ReadonlyArray<keyof PaletteSet> = [
  'highlight',
  'neutral',
  'error',
  'warning',
  'success',
];

