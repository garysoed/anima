import {expect, test} from '@playwright/test';
import {rgb} from 'gs-tools/export/color';

import {createNeutralPalette} from '../palette/create-neutral-palette';
import {createPalette} from '../palette/create-palette';
import {PaletteSet} from '../palette/palette-set';

import {createThemeSet} from './create-theme-set';
import {hasAdjacentBackgroundContrastViolation} from './has-adjacent-background-contrast-violation';
import {ThemeSet} from './theme-set';

test.describe('hasAdjacentBackgroundContrastViolation', () => {
  const seed = rgb({b: 38, g: 38, r: 220});
  const palettes: PaletteSet = {
    black: rgb('#000000'),
    error: createPalette(rgb('#dc2626')),
    main: createPalette(seed),
    neutral: createNeutralPalette(seed),
    other: new Map(),
    success: createPalette(rgb('#16a34a')),
    warning: createPalette(rgb('#ffbf00')),
    white: rgb('#ffffff'),
  };

  test('returns false when adjacent background contrast meets requirement', () => {
    const defaultThemeSet = createThemeSet('theme', 'main', 'neutral');

    expect(
      hasAdjacentBackgroundContrastViolation(
        defaultThemeSet.light[0],
        defaultThemeSet,
        palettes,
      ),
    ).toBe(false);
  });

  test('returns true when an adjacent pair does not meet contrast requirement', () => {
    const defaultThemeSet = createThemeSet('theme', 'main', 'neutral');
    const violatingThemeSet: ThemeSet = {
      ...defaultThemeSet,
      light: {
        ...defaultThemeSet.light,
        3: {
          ...defaultThemeSet.light[3],
          background: 'main.c100',
        },
      },
    };

    expect(
      hasAdjacentBackgroundContrastViolation(
        violatingThemeSet.light[3],
        violatingThemeSet,
        palettes,
      ),
    ).toBe(true);
  });
});
