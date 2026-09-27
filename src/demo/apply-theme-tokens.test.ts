import {expect, test} from '@playwright/test';
import {rgb} from 'gs-tools/export/color';

import {createNeutralPalette} from '../core/palette/create-neutral-palette';
import {createPalette} from '../core/palette/create-palette';
import {PaletteSet} from '../core/palette/palette-set';
import {createThemeSet} from '../core/theme/theme-set';

import {
  applyThemeTokens,
  getThemeTokensCssProperties,
} from './apply-theme-tokens';

test.describe('apply-theme-tokens', () => {
  const seed = rgb({b: 220, g: 38, r: 38});
  const palettes: PaletteSet = {
    black: rgb('#000000'),
    error: createPalette(rgb('#dc2626')),
    main: createPalette(seed),
    neutral: createNeutralPalette(seed),
    other: new Map(),
    success: createPalette(rgb('#16a34a')),
    warning: createPalette(rgb('#d97706')),
    white: rgb('#ffffff'),
  };
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
      expect(properties['--an-neutral-100']).toBeDefined();
      expect(properties['--an-error-300']).toBeDefined();
      expect(properties['--an-main-light_0-background']).toBe(
        'var(--an-neutral-100)',
      );
      expect(properties['--an-main-light_0-border']).toBe(
        'var(--an-main-800)',
      );
      expect(properties['--an-main-dark_0-background']).toBe(
        'var(--an-neutral-800)',
      );
      expect(properties['--an-main-dark_0-border']).toBe(
        'var(--an-main-200)',
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
        'var(--an-neutral-100)',
      );
    });
  });
});
