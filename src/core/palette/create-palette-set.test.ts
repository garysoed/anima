import {expect, test} from '@playwright/test';
import {convert, hsl, rgb} from 'gs-tools/export/color';

import {createPaletteSet} from './create-palette-set';
import {Palette} from './palette';

const SHADE_KEYS: ReadonlyArray<keyof Palette> = [
  'c100',
  'c200',
  'c300',
  'c400',
  'c500',
  'c600',
  'c700',
  'c800',
  'c900',
];

test.describe('createPaletteSet', () => {
  test('returns all 5 palettes with valid shades c100 to c900', () => {
    const seed = rgb({b: 200, g: 100, r: 50});
    const paletteSet = createPaletteSet(seed);

    expect(paletteSet.highlight).toBeDefined();
    expect(paletteSet.neutral).toBeDefined();
    expect(paletteSet.error).toBeDefined();
    expect(paletteSet.warning).toBeDefined();
    expect(paletteSet.success).toBeDefined();

    for (const key of SHADE_KEYS) {
      expect(paletteSet.highlight[key]).toBeDefined();
      expect(paletteSet.neutral[key]).toBeDefined();
      expect(paletteSet.error[key]).toBeDefined();
      expect(paletteSet.warning[key]).toBeDefined();
      expect(paletteSet.success[key]).toBeDefined();
    }
  });

  test('generates neutral palette with 75% reduced saturation compared to highlight', () => {
    const seed = hsl({h: 210, l: 0.5, s: 0.8});
    const paletteSet = createPaletteSet(seed);

    const highlightHsl = convert(paletteSet.highlight.c500, 'hsl');
    const neutralHsl = convert(paletteSet.neutral.c500, 'hsl');

    expect(neutralHsl.s).toBeLessThan(highlightHsl.s);
    expect(neutralHsl.s).toBeCloseTo(highlightHsl.s * 0.25, 1);
  });

  test('generates semantic palettes with expected red, amber, and green hues', () => {
    const seed = rgb({b: 50, g: 50, r: 50});
    const paletteSet = createPaletteSet(seed);

    const errorHsl = convert(paletteSet.error.c500, 'hsl');
    const warningHsl = convert(paletteSet.warning.c500, 'hsl');
    const successHsl = convert(paletteSet.success.c500, 'hsl');

    expect(errorHsl.h).toBeLessThan(30);
    expect(warningHsl.h).toBeGreaterThanOrEqual(25);
    expect(warningHsl.h).toBeLessThan(60);
    expect(successHsl.h).toBeGreaterThanOrEqual(100);
    expect(successHsl.h).toBeLessThan(170);
  });
});
