import {format} from 'gs-tools/export/color';

import {Palette, SHADE_KEYS} from '../palette/palette';
import {PaletteSet} from '../palette/palette-set';

import {PenpotColorToken, PenpotTokenTree} from './penpot';

function createShadeTokens(palette: Palette): Record<string, PenpotColorToken> {
  const shadeTokens: Record<string, PenpotColorToken> = {};
  for (const shadeKey of SHADE_KEYS) {
    const shadeNum = shadeKey.slice(1);
    shadeTokens[shadeNum] = {
      $type: 'color',
      $value: format(palette[shadeKey], 'hex'),
    };
  }
  return shadeTokens;
}

export function paletteSetToPenpotTokenTree(
  palettes: PaletteSet,
): PenpotTokenTree {
  const tree: Record<string, PenpotColorToken | PenpotTokenTree> = {
    black: {
      $type: 'color',
      $value: format(palettes.black, 'hex'),
    },
    error: createShadeTokens(palettes.error),
    success: createShadeTokens(palettes.success),
    warning: createShadeTokens(palettes.warning),
    white: {
      $type: 'color',
      $value: format(palettes.white, 'hex'),
    },
  };

  for (const [seedName, seededPalette] of palettes.seededPaletteSets) {
    tree[`${seedName}_highlight`] = createShadeTokens(seededPalette.highlight);
    tree[`${seedName}_neutral`] = createShadeTokens(seededPalette.neutral);
  }

  return tree;
}
