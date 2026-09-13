import {Color} from 'gs-tools/export/color';

export type ThemeMode = 'dark' | 'light';
export type ThemeType = 0 | 1 | 2 | 3;
export interface Theme {
  readonly background: Color;
  readonly display: Color;
  readonly error: Color;
  readonly primary: Color;
  readonly secondary: Color;
  readonly success: Color;
  readonly warning: Color;
}
