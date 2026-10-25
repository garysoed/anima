import type {DeepKeyTokenMap} from '@tokens-studio/types';

import {isRecord} from '../../util/is-record';
import {createThemeSet} from '../theme/create-theme-set';
import {
  isShadeKey,
  MODES,
  PaletteColorKey,
  SECTIONS,
  Theme,
  ThemeSection,
  ThemeType,
  TYPES,
} from '../theme/theme';
import {ThemeSet} from '../theme/theme-set';

function parsePaletteAlias(alias: string): PaletteColorKey {
  const clean = alias.replace(/^\{|\}$/g, '');
  if (clean === 'white' || clean === 'black') {
    return clean;
  }
  const [paletteKey, shadeNum] = clean.split('.');
  if (!paletteKey || !shadeNum) {
    throw new Error(`Invalid palette alias: ${alias}`);
  }
  const shadeKey = `c${shadeNum}`;
  if (!isShadeKey(shadeKey)) {
    throw new Error(`Invalid shade key parsed from alias: ${alias}`);
  }
  return `${paletteKey}.${shadeKey}`;
}

export function tokenTreeToThemeSet(
  tokenTree: DeepKeyTokenMap,
  name: string,
): ThemeSet {
  const defaultThemeSet = createThemeSet(name, 'main', 'neutral');
  const namedTree = tokenTree[name];
  const themesRoot: Record<string, unknown> = isRecord(namedTree)
    ? namedTree
    : tokenTree;

  const darkThemes: Record<ThemeType, Theme> = {...defaultThemeSet.dark};
  const lightThemes: Record<ThemeType, Theme> = {...defaultThemeSet.light};

  for (const mode of MODES) {
    const modeObj = themesRoot[mode];
    if (!isRecord(modeObj)) {
      continue;
    }

    for (const type of TYPES) {
      const typeObj = modeObj[type];
      if (!isRecord(typeObj)) {
        continue;
      }

      const defaultTheme = defaultThemeSet[mode][type];
      const overrides: Partial<Record<ThemeSection, PaletteColorKey>> = {};

      for (const section of SECTIONS) {
        const sectionObj = typeObj[section];
        if (isRecord(sectionObj) && typeof sectionObj['$value'] === 'string') {
          overrides[section] = parsePaletteAlias(sectionObj['$value']);
        }
      }

      const updatedTheme: Theme = {
        ...defaultTheme,
        ...overrides,
      };

      if (mode === 'dark') {
        darkThemes[type] = updatedTheme;
      } else {
        lightThemes[type] = updatedTheme;
      }
    }
  }

  return {
    dark: darkThemes,
    light: lightThemes,
    name,
  };
}
