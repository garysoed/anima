import {format} from 'gs-tools/export/color';

import {Palette, SHADE_KEYS} from '../core/palette/palette';
import {PaletteSet} from '../core/palette/palette-set';
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

  const globalPalettes: ReadonlyMap<string, Palette> = new Map([
    ['error', palettes.error],
    ['success', palettes.success],
    ['warning', palettes.warning],
  ]);

  for (const [name, palette] of globalPalettes) {
    for (const shadeKey of SHADE_KEYS) {
      const shadeNum = shadeKey.slice(1);
      properties[`--an-${name}-${shadeNum}`] = format(palette[shadeKey], 'hex');
    }
  }

  for (const shadeKey of SHADE_KEYS) {
    const shadeNum = shadeKey.slice(1);
    properties[`--an-main-${shadeNum}`] = format(
      palettes.main[shadeKey],
      'hex',
    );
    properties[`--an-neutral-${shadeNum}`] = format(
      palettes.neutral[shadeKey],
      'hex',
    );
  }

  for (const [name, palette] of palettes.other) {
    for (const shadeKey of SHADE_KEYS) {
      const shadeNum = shadeKey.slice(1);
      properties[`--an-${name}-${shadeNum}`] = format(palette[shadeKey], 'hex');
    }
  }

  for (const mode of MODES) {
    const modeThemes = themeSet[mode];
    for (const type of TYPES) {
      const theme = modeThemes[type];
      for (const section of SECTIONS) {
        properties[`--an-${seedName}-${mode}_${type}-${section}`] =
          getPaletteCssVar(theme[section]);
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
