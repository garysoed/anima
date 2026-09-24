import {expect, test} from '@playwright/test';
import {rgb} from 'gs-tools/export/color';

import {createPaletteSet} from '../core/palette/create-palette-set';
import {createSeededPaletteSet} from '../core/palette/create-seeded-palette-set';
import {createThemeSet} from '../core/theme/theme-set';

import {
  applyThemeTokens,
  getThemeTokensCssProperties,
} from './apply-theme-tokens';

test.describe('apply-theme-tokens', () => {
  const seed = rgb({b: 220, g: 38, r: 38});
  const seeded = createSeededPaletteSet(seed, 'main');
  const palettes = createPaletteSet(new Map([['main', seeded]]));
  const themeSet = createThemeSet('main');

  test.describe('getThemeTokensCssProperties', () => {
    test('includes --an-white and --an-black css variables', () => {
      const properties = getThemeTokensCssProperties(
        themeSet,
        palettes,
        'main',
      );
      expect(properties['--an-white']).toBe('#ffffff');
      expect(properties['--an-black']).toBe('#000000');
    });

    test('generates palette tokens and theme role tokens', () => {
      const properties = getThemeTokensCssProperties(
        themeSet,
        palettes,
        'main',
      );
      expect(properties['--an-main_neutral-100']).toBeDefined();
      expect(properties['--an-error-300']).toBeDefined();
      expect(properties['--an-main-light_0-background']).toBe(
        'var(--an-main_neutral-100)',
      );
      expect(properties['--an-main-light_0-border']).toBe(
        'var(--an-main_highlight-800)',
      );
      expect(properties['--an-main-dark_0-background']).toBe(
        'var(--an-main_neutral-800)',
      );
      expect(properties['--an-main-dark_0-border']).toBe(
        'var(--an-main_highlight-200)',
      );
    });
  });

  test.describe('applyThemeTokens', () => {
    test('sets properties on targetStyle', () => {
      const applied: Record<string, string> = {};
      const targetStyle = {
        setProperty: (name: string, value: string) => {
          applied[name] = value;
        },
      };
      applyThemeTokens(themeSet, palettes, targetStyle, 'main');
      expect(applied['--an-white']).toBe('#ffffff');
      expect(applied['--an-black']).toBe('#000000');
      expect(applied['--an-main-light_0-background']).toBe(
        'var(--an-main_neutral-100)',
      );
    });
  });
});
