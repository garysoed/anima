import {Color} from 'gs-tools/export/color';

export interface Palette {
  readonly c100: Color;
  readonly c200: Color;
  readonly c300: Color;
  readonly c400: Color;
  readonly c500: Color;
  readonly c600: Color;
  readonly c700: Color;
  readonly c800: Color;
  readonly c900: Color;
}

export const SHADE_KEYS: ReadonlyArray<keyof Palette> = [
  'c100',
  'c200',
  'c300',
  'c400',
  'c500',
  'c600',
  'c700',
  'c800',
  'c900',
];

