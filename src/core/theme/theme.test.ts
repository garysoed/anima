import {expect, test} from '@playwright/test';
import {format, rgb} from 'gs-tools/export/color';

import {createPaletteSet} from '../palette/create-palette-set';

import {getPaletteCssVar, resolveThemeColor} from './theme';

test.describe('Theme utilities', () => {
  const seed = rgb({b: 220, g: 38, r: 38});
  const palettes = createPaletteSet(seed);

  test.describe('resolveThemeColor', () => {
    test('resolves white to #ffffff', () => {
      const color = resolveThemeColor(palettes, 'white');
      expect(format(color, 'hex')).toBe('#ffffff');
    });

    test('resolves black to #000000', () => {
      const color = resolveThemeColor(palettes, 'black');
      expect(format(color, 'hex')).toBe('#000000');
    });

    test('resolves palette shade key to palette color', () => {
      const color = resolveThemeColor(palettes, 'neutral.c100');
      expect(color).toBe(palettes.neutral.c100);
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
