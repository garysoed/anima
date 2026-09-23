import {expect, test} from '@playwright/test';

import {createPaletteSet} from './create-palette-set';
import {SeededPaletteSet} from './seeded-palette-set';

test.describe('createPaletteSet', () => {
  test('returns palette set containing seededPaletteSets', () => {
    const seededMap = new Map<string, SeededPaletteSet>();
    const paletteSet = createPaletteSet(seededMap);

    expect(paletteSet.seededPaletteSets).toBe(seededMap);
  });
});
