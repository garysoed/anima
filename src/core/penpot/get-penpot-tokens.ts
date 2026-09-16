import {format} from 'gs-tools/export/color';

import {SHADE_KEYS} from '../palette/palette';
import {PALETTE_KEYS, PaletteSet} from '../palette/palette-set';
import {
  isPaletteKey,
  isShadeKey,
  MODES,
  PaletteColorKey,
  SECTIONS,
  TYPES,
} from '../theme/theme';
import {ThemeSet} from '../theme/theme-set';

import {
  PenpotColorToken,
  PenpotExportData,
  PenpotTokenTree,
} from './penpot';

function getPenpotPaletteAlias(key: PaletteColorKey, seedName: string): string {
  if (key === 'white') {
    return '{palette.white}';
  }
  if (key === 'black') {
    return '{palette.black}';
  }
  const [palKey, shadeKey] = key.split('.');
  if (!isPaletteKey(palKey) || !isShadeKey(shadeKey)) {
    throw new Error(`Invalid palette color key: ${key}`);
  }
  const shadeNum = shadeKey.slice(1);
  const paletteType =
    palKey === 'highlight' || palKey === 'neutral'
      ? `${seedName}_${palKey}`
      : palKey;
  return `{palette.${paletteType}.${shadeNum}}`;
}

export function getPenpotTokens(
  themeSet: ThemeSet,
  palettes: PaletteSet,
  seedName: string,
): PenpotExportData {
  const paletteTokens: Record<string, PenpotColorToken | PenpotTokenTree> = {
    black: {
      $type: 'color',
      $value: '#000000',
    },
    white: {
      $type: 'color',
      $value: '#ffffff',
    },
  };

  for (const palKey of PALETTE_KEYS) {
    const palette = palettes[palKey];
    const prefix =
      palKey === 'highlight' || palKey === 'neutral'
        ? `${seedName}_${palKey}`
        : palKey;

    const shadeTokens: Record<string, PenpotColorToken> = {};
    for (const shadeKey of SHADE_KEYS) {
      const shadeNum = shadeKey.slice(1);
      shadeTokens[shadeNum] = {
        $type: 'color',
        $value: format(palette[shadeKey], 'hex'),
      };
    }
    paletteTokens[prefix] = shadeTokens;
  }

  const themeTokens: Record<string, PenpotTokenTree> = {};

  for (const mode of MODES) {
    const modeThemes = themeSet[mode];
    for (const type of TYPES) {
      const theme = modeThemes[type];
      const roleTokens: Record<string, PenpotColorToken> = {};
      for (const section of SECTIONS) {
        roleTokens[section] = {
          $type: 'color',
          $value: getPenpotPaletteAlias(theme[section], seedName),
        };
      }
      themeTokens[`${seedName}-${mode}_${type}`] = roleTokens;
    }
  }

  return {
    $metadata: {
      activeSets: ['palette', 'theme'],
      tokenSetOrder: ['palette', 'theme'],
    },
    palette: paletteTokens,
    theme: themeTokens,
  };
}
