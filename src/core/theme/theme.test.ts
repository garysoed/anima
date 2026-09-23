import {expect, test} from '@playwright/test';
import {format, rgb} from 'gs-tools/export/color';

import {createPaletteSet} from '../palette/create-palette-set';
import {createSeededPaletteSet} from '../palette/create-seeded-palette-set';

import {getPaletteCssVar, resolveThemeColor} from './theme';

test.describe('Theme utilities', () => {
  const seed = rgb({b: 220, g: 38, r: 38});
  const seededPaletteSet = createSeededPaletteSet(seed, 'main');
  const palettes = createPaletteSet(new Map([['main', seededPaletteSet]]));

  test.describe('resolveThemeColor', () => {
    test('resolves white to #ffffff', () => {
      const color = resolveThemeColor(palettes, 'white');
      expect(format(color, 'hex')).toBe('#ffffff');
    });

    test('resolves black to #000000', () => {
      const color = resolveThemeColor(palettes, 'black');
      expect(format(color, 'hex')).toBe('#000000');
    });

    test('resolves seeded palette shade key to seeded palette color', () => {
      const color = resolveThemeColor(palettes, 'main_neutral.c100');
      expect(color).toBe(seededPaletteSet.neutral.c100);
    });

    test('resolves global palette shade key to global palette color', () => {
      const color = resolveThemeColor(palettes, 'error.c300');
      expect(color).toBe(palettes.error.c300);
    });

    test('throws error if seed is not found in seededPaletteSets', () => {
      expect(() =>
        resolveThemeColor(palettes, 'nonexistent_neutral.c100'),
      ).toThrow('Seed not found: nonexistent');
    });
  });

  test.describe('getPaletteCssVar', () => {
    test('returns var(--an-white) for white', () => {
      expect(getPaletteCssVar('white')).toBe('var(--an-white)');
    });

    test('returns var(--an-black) for black', () => {
      expect(getPaletteCssVar('black')).toBe('var(--an-black)');
    });

    test('returns prefixed var for highlight and neutral', () => {
      expect(getPaletteCssVar('main_neutral.c100')).toBe(
        'var(--an-main_neutral-100)',
      );
      expect(getPaletteCssVar('main_highlight.c900')).toBe(
        'var(--an-main_highlight-900)',
      );
    });

    test('returns unprefixed var for semantic palettes', () => {
      expect(getPaletteCssVar('error.c300')).toBe('var(--an-error-300)');
      expect(getPaletteCssVar('warning.c500')).toBe('var(--an-warning-500)');
      expect(getPaletteCssVar('success.c200')).toBe('var(--an-success-200)');
    });
  });
});
