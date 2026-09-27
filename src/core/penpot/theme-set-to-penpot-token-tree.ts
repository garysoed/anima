import {
  isShadeKey,
  MODES,
  PaletteColorKey,
  SECTIONS,
  TYPES,
} from '../theme/theme';
import {ThemeSet} from '../theme/theme-set';

import {PenpotColorToken, PenpotTokenTree} from './penpot';

function getPenpotPaletteAlias(key: PaletteColorKey): string {
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

export function themeSetToPenpotTokenTree(themeSet: ThemeSet): PenpotTokenTree {
  const tree: Record<string, Record<string, PenpotColorToken>> = {};

  for (const mode of MODES) {
    const modeThemes = themeSet[mode];
    for (const type of TYPES) {
      const theme = modeThemes[type];
      const roleTokens: Record<string, PenpotColorToken> = {};
      for (const section of SECTIONS) {
        roleTokens[section] = {
          $type: 'color',
          $value: getPenpotPaletteAlias(theme[section]),
        };
      }
      tree[`${mode}_${type}`] = roleTokens;
    }
  }

  return tree;
}
