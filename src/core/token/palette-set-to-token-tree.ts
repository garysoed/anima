import {format} from 'gs-tools/export/color';
import type {DesignTokens} from 'style-dictionary/types';

import {Palette, SHADE_KEYS} from '../palette/palette';
import {PaletteSet} from '../palette/palette-set';

function createShadeTokens(palette: Palette): DesignTokens {
  const shadeTokens: DesignTokens = {};
  for (const shadeKey of SHADE_KEYS) {
    const shadeNum = shadeKey.slice(1);
    shadeTokens[shadeNum] = {
      $type: 'color',
      $value: format(palette[shadeKey], 'hex'),
    };
  }
  return shadeTokens;
}

export function paletteSetToTokenTree(palettes: PaletteSet): DesignTokens {
  const tree: DesignTokens = {
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

  tree['main'] = createShadeTokens(palettes.main);
  tree['neutral'] = createShadeTokens(palettes.neutral);
  for (const [name, palette] of palettes.other) {
    tree[name] = createShadeTokens(palette);
  }

  return tree;
}
