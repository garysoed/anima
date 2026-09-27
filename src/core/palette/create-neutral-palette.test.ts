import {expect, test} from '@playwright/test';
import {convert, rgb} from 'gs-tools/export/color';

import {createNeutralPalette} from './create-neutral-palette';
import {SHADE_KEYS} from './palette';

test.describe('createNeutralPalette', () => {
  test('generates 11 low-saturation shades from seed color', () => {
    const seed = rgb({b: 50, g: 100, r: 200});
    const palette = createNeutralPalette(seed);

    const c500Hsl = convert(palette.c500, 'hsl');
    expect(c500Hsl.s).toBeCloseTo(0.05, 1);

    const neutralSeedOklch = convert(palette.c500, 'oklch');
    for (const key of SHADE_KEYS) {
      const shadeOklch = convert(palette[key], 'oklch');
      expect(shadeOklch.c).toBeLessThanOrEqual(neutralSeedOklch.c + 0.01);
    }
  });
});
