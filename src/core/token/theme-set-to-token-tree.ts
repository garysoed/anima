import type {DesignTokens} from 'style-dictionary/types';

import {
  isShadeKey,
  MODES,
  PaletteColorKey,
  SECTIONS,
  TYPES,
} from '../theme/theme';
import {ThemeSet} from '../theme/theme-set';

function getPaletteAlias(key: PaletteColorKey): string {
  if (key === 'white') {
    return '{white}';
  }
  if (key === 'black') {
    return '{black}';
  }
  const [paletteKey, shadeKey] = key.split('.');
  if (!paletteKey || !isShadeKey(shadeKey)) {
    throw new Error(`Invalid palette color key: ${key}`);
  }
  const shadeNum = shadeKey.slice(1);
  return `{${paletteKey}.${shadeNum}}`;
}

export function themeSetToTokenTree(themeSet: ThemeSet): DesignTokens {
  const tree: DesignTokens = {};

  for (const mode of MODES) {
    const modeThemes = themeSet[mode];
    for (const type of TYPES) {
      const theme = modeThemes[type];
      const roleTokens: DesignTokens = {};
      for (const section of SECTIONS) {
        roleTokens[section] = {
          $type: 'color',
          $value: getPaletteAlias(theme[section]),
        };
      }
      tree[`${mode}_${type}`] = roleTokens;
    }
  }

  return tree;
}
