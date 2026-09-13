import {Color, convert, rgb, update} from 'gs-tools/export/color';

import {createPalette} from './create-palette';
import {PaletteSet} from './palette-set';

const ERROR_SEED = rgb({b: 38, g: 38, r: 220});
const WARNING_SEED = rgb({b: 6, g: 119, r: 217});
const SUCCESS_SEED = rgb({b: 74, g: 163, r: 22});

export function createPaletteSet(seedColor: Color): PaletteSet {
  const targetSpace = seedColor.space;
  const neutralSeed = convert(
    update(seedColor, 'hsl', (color) => ({s: color.s * 0.25})),
    targetSpace,
  );

  return {
    error: createPalette(convert(ERROR_SEED, targetSpace)),
    highlight: createPalette(seedColor),
    neutral: createPalette(neutralSeed),
    success: createPalette(convert(SUCCESS_SEED, targetSpace)),
    warning: createPalette(convert(WARNING_SEED, targetSpace)),
  };
}
