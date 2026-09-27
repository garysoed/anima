import {expect, test} from '@playwright/test';
import {rgb} from 'gs-tools/export/color';

import {createNeutralPalette} from '../core/palette/create-neutral-palette';
import {createPalette} from '../core/palette/create-palette';
import {PaletteSet} from '../core/palette/palette-set';
import {ThemeSet} from '../core/theme/theme-set';

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
    other: new Map([['food', createPalette(rgb('#10b981'))]]),
    success: createPalette(rgb('#16a34a')),
    warning: createPalette(rgb('#d97706')),
    white: rgb('#ffffff'),
  };
  const themeSet: ThemeSet = {
    dark: {
      0: {
        background: 'neutral.c800',
        display: 'main.c500',
        error: 'error.c300',
        mode: 'dark',
        outline: 'main.c200',
        primary: 'neutral.c100',
        secondary: 'neutral.c300',
        success: 'success.c300',
        type: 0,
        warning: 'warning.c300',
      },
      1: {
        background: 'black',
        display: 'main.c500',
        error: 'error.c400',
        mode: 'dark',
        outline: 'main.c200',
        primary: 'neutral.c100',
        secondary: 'neutral.c400',
        success: 'success.c400',
        type: 1,
        warning: 'warning.c400',
      },
      2: {
        background: 'main.c900',
        display: 'main.c500',
        error: 'error.c400',
        mode: 'dark',
        outline: 'main.c200',
        primary: 'neutral.c100',
        secondary: 'neutral.c400',
        success: 'success.c400',
        type: 2,
        warning: 'warning.c400',
      },
      3: {
        background: 'main.c700',
        display: 'main.c400',
        error: 'error.c200',
        mode: 'dark',
        outline: 'main.c200',
        primary: 'white',
        secondary: 'neutral.c200',
        success: 'success.c200',
        type: 3,
        warning: 'warning.c200',
      },
    },
    light: {
      0: {
        background: 'neutral.c100',
        display: 'main.c500',
        error: 'error.c600',
        mode: 'light',
        outline: 'main.c800',
        primary: 'neutral.c900',
        secondary: 'neutral.c700',
        success: 'success.c600',
        type: 0,
        warning: 'warning.c600',
      },
      1: {
        background: 'white',
        display: 'main.c500',
        error: 'error.c600',
        mode: 'light',
        outline: 'main.c800',
        primary: 'neutral.c900',
        secondary: 'neutral.c700',
        success: 'success.c600',
        type: 1,
        warning: 'warning.c600',
      },
      2: {
        background: 'main.c200',
        display: 'main.c600',
        error: 'error.c700',
        mode: 'light',
        outline: 'main.c800',
        primary: 'neutral.c900',
        secondary: 'neutral.c700',
        success: 'success.c700',
        type: 2,
        warning: 'warning.c700',
      },
      3: {
        background: 'main.c300',
        display: 'main.c600',
        error: 'error.c800',
        mode: 'light',
        outline: 'main.c800',
        primary: 'black',
        secondary: 'neutral.c800',
        success: 'success.c800',
        type: 3,
        warning: 'warning.c800',
      },
    },
  };

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
      expect(properties['--an-food-500']).toBeDefined();
      expect(properties['--an-main-50']).toBeDefined();
      expect(properties['--an-main-950']).toBeDefined();
      expect(properties['--an-neutral-50']).toBeDefined();
      expect(properties['--an-neutral-950']).toBeDefined();
      expect(properties['--an-neutral-100']).toBeDefined();
      expect(properties['--an-error-300']).toBeDefined();
      expect(properties['--an-main-light_0-background']).toBe(
        'var(--an-neutral-100)',
      );
      expect(properties['--an-main-light_0-outline']).toBe(
        'var(--an-main-800)',
      );
      expect(properties['--an-main-dark_0-background']).toBe(
        'var(--an-neutral-800)',
      );
      expect(properties['--an-main-dark_0-outline']).toBe(
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
