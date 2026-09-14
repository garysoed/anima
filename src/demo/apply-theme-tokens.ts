import {format} from 'gs-tools/export/color';

import {Palette} from '../core/palette/palette';
import {PaletteSet} from '../core/palette/palette-set';
import {
  getPaletteCssVar,
  PaletteKey,
  ThemeMode,
  ThemeSection,
  ThemeType,
} from '../core/theme/theme';
import {ThemeSet} from '../core/theme/theme-set';

const PALETTE_KEYS: readonly PaletteKey[] = [
  'highlight',
  'neutral',
  'error',
  'warning',
  'success',
];

const SHADE_KEYS: ReadonlyArray<keyof Palette> = [
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

const MODES: readonly ThemeMode[] = ['light', 'dark'];
const TYPES: readonly ThemeType[] = [0, 1, 2, 3];
const SECTIONS: readonly ThemeSection[] = [
  'background',
  'display',
  'error',
  'primary',
  'secondary',
  'success',
  'warning',
];

export function getThemeTokensCssProperties(
  themeSet: ThemeSet,
  palettes: PaletteSet,
  seedName: string,
): Record<string, string> {
  const properties: Record<string, string> = {
    '--an-black': '#000000',
    '--an-white': '#ffffff',
  };

  for (const palKey of PALETTE_KEYS) {
    const palette = palettes[palKey];
    const prefix =
      palKey === 'highlight' || palKey === 'neutral'
        ? `${seedName}_${palKey}`
        : palKey;

    for (const shadeKey of SHADE_KEYS) {
      const shadeNum = shadeKey.slice(1);
      properties[`--an-${prefix}-${shadeNum}`] = format(
        palette[shadeKey],
        'hex',
      );
    }
  }

  for (const mode of MODES) {
    const modeThemes = themeSet[mode];
    for (const type of TYPES) {
      const theme = modeThemes[type];
      for (const section of SECTIONS) {
        properties[`--an-${seedName}-${mode}_${type}-${section}`] =
          getPaletteCssVar(theme[section], seedName);
      }
    }
  }

  return properties;
}

export function applyThemeTokens(
  themeSet: ThemeSet,
  palettes: PaletteSet,
  targetStyle: {setProperty: (name: string, value: string) => void},
  seedName: string,
): void {
  const properties = getThemeTokensCssProperties(themeSet, palettes, seedName);
  for (const [key, value] of Object.entries(properties)) {
    targetStyle.setProperty(key, value);
  }
}
