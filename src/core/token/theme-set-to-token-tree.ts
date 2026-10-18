import type {DeepKeyTokenMap} from '@tokens-studio/types';
import {TokenTypes} from '@tokens-studio/types';

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

export function themeSetToTokenTree(
  themeSet: ThemeSet,
): DeepKeyTokenMap<false> {
  const modeTokens: DeepKeyTokenMap<false> = {};

  for (const mode of MODES) {
    const typeTokens: DeepKeyTokenMap<false> = {};
    const modeThemes = themeSet[mode];
    for (const type of TYPES) {
      const theme = modeThemes[type];
      const roleTokens: DeepKeyTokenMap<false> = {};
      for (const section of SECTIONS) {
        roleTokens[section] = {
          $type: TokenTypes.COLOR,
          $value: getPaletteAlias(theme[section]),
        };
      }
      typeTokens[type] = roleTokens;
    }
    modeTokens[mode] = typeTokens;
  }

  return {
    [themeSet.name]: modeTokens,
  };
}
