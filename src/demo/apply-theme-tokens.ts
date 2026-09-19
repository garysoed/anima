import {format} from 'gs-tools/export/color';

import {SHADE_KEYS} from '../core/palette/palette';
import {PALETTE_KEYS, PaletteSet} from '../core/palette/palette-set';
import {getPaletteCssVar, MODES, SECTIONS, TYPES} from '../core/theme/theme';
import {ThemeSet} from '../core/theme/theme-set';

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
