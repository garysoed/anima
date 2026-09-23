import {Color, rgb} from 'gs-tools/export/color';

import {createPalette} from './create-palette';
import {PaletteSet} from './palette-set';
import {SeededPaletteSet} from './seeded-palette-set';

const BLACK: Color = rgb({b: 0, g: 0, r: 0});
const WHITE: Color = rgb({b: 255, g: 255, r: 255});
const ERROR_SEED: Color = rgb({b: 38, g: 38, r: 220});
const WARNING_SEED: Color = rgb({b: 6, g: 119, r: 217});
const SUCCESS_SEED: Color = rgb({b: 74, g: 163, r: 22});

export function createPaletteSet(
  seededPaletteSets: ReadonlyMap<string, SeededPaletteSet>,
): PaletteSet {
  return {
    black: BLACK,
    error: createPalette(ERROR_SEED),
    seededPaletteSets,
    success: createPalette(SUCCESS_SEED),
    warning: createPalette(WARNING_SEED),
    white: WHITE,
  };
}
