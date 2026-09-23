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
      const color = resolveThemeColor(palettes, 'white', 'main');
      expect(format(color, 'hex')).toBe('#ffffff');
    });

    test('resolves black to #000000', () => {
      const color = resolveThemeColor(palettes, 'black', 'main');
      expect(format(color, 'hex')).toBe('#000000');
    });

    test('resolves seeded palette shade key to seeded palette color', () => {
      const color = resolveThemeColor(palettes, 'neutral.c100', 'main');
      expect(color).toBe(seededPaletteSet.neutral.c100);
    });

    test('resolves global palette shade key to global palette color', () => {
      const color = resolveThemeColor(palettes, 'error.c300', 'main');
      expect(color).toBe(palettes.error.c300);
    });

    test('throws error if seed is not found in seededPaletteSets', () => {
      expect(() =>
        resolveThemeColor(palettes, 'neutral.c100', 'nonexistent'),
      ).toThrow('Seed not found: nonexistent');
    });
  });

  test.describe('getPaletteCssVar', () => {
    test('returns var(--an-white) for white', () => {
      expect(getPaletteCssVar('white', 'main')).toBe('var(--an-white)');
    });

    test('returns var(--an-black) for black', () => {
      expect(getPaletteCssVar('black', 'main')).toBe('var(--an-black)');
    });

    test('returns prefixed var for highlight and neutral', () => {
      expect(getPaletteCssVar('neutral.c100', 'main')).toBe(
        'var(--an-main_neutral-100)',
      );
      expect(getPaletteCssVar('highlight.c900', 'main')).toBe(
        'var(--an-main_highlight-900)',
      );
    });

    test('returns unprefixed var for semantic palettes', () => {
      expect(getPaletteCssVar('error.c300', 'main')).toBe(
        'var(--an-error-300)',
      );
      expect(getPaletteCssVar('warning.c500', 'main')).toBe(
        'var(--an-warning-500)',
      );
      expect(getPaletteCssVar('success.c200', 'main')).toBe(
        'var(--an-success-200)',
      );
    });
  });
});
