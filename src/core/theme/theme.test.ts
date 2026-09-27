import {expect, test} from '@playwright/test';
import {format, rgb} from 'gs-tools/export/color';

import {createNeutralPalette} from '../palette/create-neutral-palette';
import {createPalette} from '../palette/create-palette';
import {PaletteSet} from '../palette/palette-set';

import {getPaletteCssVar, resolveThemeColor} from './theme';

test.describe('Theme utilities', () => {
  const seed = rgb({b: 220, g: 38, r: 38});
  const otherPalette = createPalette(rgb('#3b82f6'));
  const palettes: PaletteSet = {
    black: rgb('#000000'),
    error: createPalette(rgb('#dc2626')),
    main: createPalette(seed),
    neutral: createNeutralPalette(seed),
    other: new Map([['accent', otherPalette]]),
    success: createPalette(rgb('#16a34a')),
    warning: createPalette(rgb('#d97706')),
    white: rgb('#ffffff'),
  };

  test.describe('resolveThemeColor', () => {
    test('resolves white to #ffffff', () => {
      const color = resolveThemeColor(palettes, 'white');
      expect(format(color, 'hex')).toBe('#ffffff');
    });

    test('resolves black to #000000', () => {
      const color = resolveThemeColor(palettes, 'black');
      expect(format(color, 'hex')).toBe('#000000');
    });

    test('resolves neutral palette shade key to neutral palette color', () => {
      const color = resolveThemeColor(palettes, 'neutral.c100');
      expect(color).toBe(palettes.neutral.c100);
    });

    test('resolves main palette shade key to main palette color', () => {
      const color = resolveThemeColor(palettes, 'main.c500');
      expect(color).toBe(palettes.main.c500);
    });

    test('resolves other palette shade key to color in other map', () => {
      const color = resolveThemeColor(palettes, 'accent.c500');
      expect(color).toBe(otherPalette.c500);
    });

    test('resolves global palette shade key to global palette color', () => {
      const color = resolveThemeColor(palettes, 'error.c300');
      expect(color).toBe(palettes.error.c300);
    });

    test('throws error if palette is not found in PaletteSet', () => {
      expect(() =>
        resolveThemeColor(palettes, 'nonexistent.c100'),
      ).toThrow('Palette not found: nonexistent');
    });
  });

  test.describe('getPaletteCssVar', () => {
    test('returns var(--an-white) for white', () => {
      expect(getPaletteCssVar('white')).toBe('var(--an-white)');
    });

    test('returns var(--an-black) for black', () => {
      expect(getPaletteCssVar('black')).toBe('var(--an-black)');
    });

    test('returns var for main and neutral', () => {
      expect(getPaletteCssVar('neutral.c100')).toBe(
        'var(--an-neutral-100)',
      );
      expect(getPaletteCssVar('main.c900')).toBe(
        'var(--an-main-900)',
      );
    });

    test('returns unprefixed var for semantic palettes', () => {
      expect(getPaletteCssVar('error.c300')).toBe('var(--an-error-300)');
      expect(getPaletteCssVar('warning.c500')).toBe('var(--an-warning-500)');
      expect(getPaletteCssVar('success.c200')).toBe('var(--an-success-200)');
    });
  });
});
