import {Theme, ThemeType} from './theme';

export interface ThemeSet {
  readonly dark: Record<ThemeType, Theme>;
  readonly light: Record<ThemeType, Theme>;
}
