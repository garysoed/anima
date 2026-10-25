import {contrast} from 'gs-tools/export/color';

import {PaletteSet} from '../palette/palette-set';

import {resolveThemeColor, Theme, ThemeType} from './theme';
import {ThemeSet} from './theme-set';

export const MIN_BACKGROUND_CONTRAST = 1.1;

function getAdjacentTypes(type: ThemeType): readonly ThemeType[] {
  switch (type) {
    case 0:
      return [1];
    case 1:
      return [0, 2];
    case 2:
      return [1, 3];
    case 3:
      return [2];
  }
}

export function hasAdjacentBackgroundContrastViolation(
  theme: Theme,
  themeSet: ThemeSet,
  palettes: PaletteSet,
): boolean {
  const currentBgColor = resolveThemeColor(palettes, theme.background);
  const adjacentTypes = getAdjacentTypes(theme.type);
  const modeThemes = themeSet[theme.mode];

  for (const adjacentType of adjacentTypes) {
    const adjacentTheme = modeThemes[adjacentType];
    const adjacentBgColor = resolveThemeColor(
      palettes,
      adjacentTheme.background,
    );
    if (contrast(currentBgColor, adjacentBgColor) < MIN_BACKGROUND_CONTRAST) {
      return true;
    }
  }

  return false;
}
