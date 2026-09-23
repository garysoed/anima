import {Color, convert, update} from 'gs-tools/export/color';

import {createPalette} from './create-palette';
import {SeededPaletteSet} from './seeded-palette-set';

export function createSeededPaletteSet(
  seedColor: Color,
  seedName: string,
): SeededPaletteSet {
  const targetSpace = seedColor.space;
  const neutralSeed = convert(
    update(seedColor, 'hsl', () => ({s: 0.05})),
    targetSpace,
  );

  return {
    highlight: createPalette(seedColor),
    neutral: createPalette(neutralSeed),
    seedName,
  };
}
