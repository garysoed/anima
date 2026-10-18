import type {DeepKeyTokenMap} from '@tokens-studio/types';
import {TokenTypes} from '@tokens-studio/types';
import {format} from 'gs-tools/export/color';

import {Palette, SHADE_KEYS} from '../palette/palette';
import {PaletteSet} from '../palette/palette-set';

function createShadeTokens(palette: Palette): DeepKeyTokenMap<false> {
  const shadeTokens: DeepKeyTokenMap<false> = {};
  for (const shadeKey of SHADE_KEYS) {
    const shadeNum = shadeKey.slice(1);
    shadeTokens[shadeNum] = {
      $type: TokenTypes.COLOR,
      $value: format(palette[shadeKey], 'hex'),
    };
  }
  return shadeTokens;
}

export function paletteSetToTokenTree(
  palettes: PaletteSet,
): DeepKeyTokenMap<false> {
  const tree: DeepKeyTokenMap<false> = {
    black: {
      $type: TokenTypes.COLOR,
      $value: format(palettes.black, 'hex'),
    },
    error: createShadeTokens(palettes.error),
    success: createShadeTokens(palettes.success),
    warning: createShadeTokens(palettes.warning),
    white: {
      $type: TokenTypes.COLOR,
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
