import {createThemeSet} from '../core/theme/create-theme-set';
import {Theme, ThemeMode, ThemeType} from '../core/theme/theme';
import {ThemeSet} from '../core/theme/theme-set';

export const INITIAL_THEME_SET: ThemeSet = createThemeSet(
  'theme',
  'main',
  'neutral',
);

export function getDefaultTheme(mode: ThemeMode, type: ThemeType): Theme {
  return INITIAL_THEME_SET[mode][type];
}
