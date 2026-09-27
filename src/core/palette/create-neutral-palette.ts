import {Color, convert, update} from 'gs-tools/export/color';

import {createPalette} from './create-palette';
import {Palette} from './palette';

export function createNeutralPalette(seed: Color): Palette {
  const targetSpace = seed.space;
  const neutralSeed = convert(
    update(seed, 'hsl', () => ({s: 0.05})),
    targetSpace,
  );

  return createPalette(neutralSeed);
}
