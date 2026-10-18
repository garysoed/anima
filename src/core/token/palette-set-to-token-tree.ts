import type {DeepKeyTokenMap} from '@tokens-studio/types';
import {TokenTypes} from '@tokens-studio/types';
import {format} from 'gs-tools/export/color';

import {Palette, SHADE_KEYS} from '../palette/palette';
import {PaletteSet} from '../palette/palette-set';

function createShadeTokens(
  palette: Palette,
  paletteName: string,
): DeepKeyTokenMap {
  const shadeTokens: DeepKeyTokenMap = {};
  for (const shadeKey of SHADE_KEYS) {
    const shadeNum = shadeKey.slice(1);
    shadeTokens[shadeNum] = {
      $type: TokenTypes.COLOR,
      $value: format(palette[shadeKey], 'hex'),
      name: `${paletteName}.${shadeNum}`,
    };
  }
  return shadeTokens;
}

export function paletteSetToTokenTree(palettes: PaletteSet): DeepKeyTokenMap {
  const tree: DeepKeyTokenMap = {
    black: {
      $type: TokenTypes.COLOR,
      $value: format(palettes.black, 'hex'),
      name: 'black',
    },
    error: createShadeTokens(palettes.error, 'error'),
    success: createShadeTokens(palettes.success, 'success'),
    warning: createShadeTokens(palettes.warning, 'warning'),
    white: {
      $type: TokenTypes.COLOR,
      $value: format(palettes.white, 'hex'),
      name: 'white',
    },
  };

  tree['main'] = createShadeTokens(palettes.main, 'main');
  tree['neutral'] = createShadeTokens(palettes.neutral, 'neutral');
  for (const [name, palette] of palettes.other) {
    tree[name] = createShadeTokens(palette, name);
  }

  return tree;
}
