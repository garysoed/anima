import {Palette} from './palette';

export interface SeededPaletteSet {
  readonly highlight: Palette;
  readonly neutral: Palette;
  readonly seedName: string;
}
