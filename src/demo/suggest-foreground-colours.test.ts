import {expect, test} from '@playwright/test';
import {contrast, rgb} from 'gs-tools/export/color';

import {createNeutralPalette} from '../core/palette/create-neutral-palette';
import {createPalette} from '../core/palette/create-palette';
import {PaletteSet} from '../core/palette/palette-set';
import {resolveThemeColor} from '../core/theme/theme';
import {ThemeSet} from '../core/theme/theme-set';

import {INITIAL_THEME_SET} from './default-themes';
import {suggestForegroundColours} from './suggest-foreground-colours';

test.describe('suggestForegroundColours', () => {
  const seed = rgb({b: 220, g: 38, r: 38});
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

  test('suggests foreground colours meeting contrast requirements and preserves outlines', () => {
    const inputThemeSet: ThemeSet = {
      ...INITIAL_THEME_SET,
      dark: {
        ...INITIAL_THEME_SET.dark,
        0: {
          ...INITIAL_THEME_SET.dark[0],
          outline: 'main.c300',
        },
      },
      light: {
        ...INITIAL_THEME_SET.light,
        0: {
          ...INITIAL_THEME_SET.light[0],
          outline: 'main.c700',
        },
      },
    };

    const suggested = suggestForegroundColours(inputThemeSet, palettes);

    expect(suggested.name).toBe(inputThemeSet.name);

    // Outline preservation
    expect(suggested.light[0].outline).toBe('main.c700');
    expect(suggested.dark[0].outline).toBe('main.c300');

    // Display shade synchronization across all 4 themes in light mode
    expect(suggested.light[0].display).toBe(suggested.light[1].display);
    expect(suggested.light[1].display).toBe(suggested.light[2].display);
    expect(suggested.light[2].display).toBe(suggested.light[3].display);

    // Display shade synchronization across all 4 themes in dark mode
    expect(suggested.dark[0].display).toBe(suggested.dark[1].display);
    expect(suggested.dark[1].display).toBe(suggested.dark[2].display);
    expect(suggested.dark[2].display).toBe(suggested.dark[3].display);

    // Contrast requirements in light mode (Theme 0)
    const light0Bg = resolveThemeColor(palettes, suggested.light[0].background);
    const light0Display = resolveThemeColor(
      palettes,
      suggested.light[0].display,
    );
    const light0Primary = resolveThemeColor(
      palettes,
      suggested.light[0].primary,
    );
    const light0Secondary = resolveThemeColor(
      palettes,
      suggested.light[0].secondary,
    );
    const light0Error = resolveThemeColor(palettes, suggested.light[0].error);
    const light0Warning = resolveThemeColor(
      palettes,
      suggested.light[0].warning,
    );
    const light0Success = resolveThemeColor(
      palettes,
      suggested.light[0].success,
    );

    expect(suggested.light[0].primary).toBe('black');
    expect(contrast(light0Display, light0Bg)).toBeGreaterThanOrEqual(3.0);
    expect(contrast(light0Primary, light0Bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(light0Secondary, light0Bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(light0Error, light0Bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(light0Warning, light0Bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(light0Success, light0Bg)).toBeGreaterThanOrEqual(4.5);

    // Contrast requirements in dark mode (Theme 0)
    const dark0Bg = resolveThemeColor(palettes, suggested.dark[0].background);
    const dark0Display = resolveThemeColor(palettes, suggested.dark[0].display);
    const dark0Primary = resolveThemeColor(palettes, suggested.dark[0].primary);
    const dark0Secondary = resolveThemeColor(
      palettes,
      suggested.dark[0].secondary,
    );
    const dark0Error = resolveThemeColor(palettes, suggested.dark[0].error);
    const dark0Warning = resolveThemeColor(palettes, suggested.dark[0].warning);
    const dark0Success = resolveThemeColor(palettes, suggested.dark[0].success);

    expect(suggested.dark[0].primary).toBe('white');
    expect(contrast(dark0Display, dark0Bg)).toBeGreaterThanOrEqual(3.0);
    expect(contrast(dark0Primary, dark0Bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(dark0Secondary, dark0Bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(dark0Error, dark0Bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(dark0Warning, dark0Bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(dark0Success, dark0Bg)).toBeGreaterThanOrEqual(4.5);
  });
});
