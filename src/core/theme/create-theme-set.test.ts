import {expect, test} from '@playwright/test';
import {contrast, rgb} from 'gs-tools/export/color';

import {createThemeSet} from './create-theme-set';

test.describe('createThemeSet', () => {
  test('meets accessible contrast ratios for primary and secondary text', () => {
    const seed = rgb({b: 220, g: 38, r: 38});
    const themeSet = createThemeSet(seed);

    // Light 0, 1, 2 primary text has high contrast with background (> 4.5)
    expect(contrast(themeSet.light[0].primary, themeSet.light[0].background))
        .toBeGreaterThanOrEqual(4.5);
    expect(contrast(themeSet.light[1].primary, themeSet.light[1].background))
        .toBeGreaterThanOrEqual(4.5);
    expect(contrast(themeSet.light[2].primary, themeSet.light[2].background))
        .toBeGreaterThanOrEqual(4.5);

    // Dark 0, 1, 2 primary text has high contrast with background (> 4.5)
    expect(contrast(themeSet.dark[0].primary, themeSet.dark[0].background))
        .toBeGreaterThanOrEqual(4.5);
    expect(contrast(themeSet.dark[1].primary, themeSet.dark[1].background))
        .toBeGreaterThanOrEqual(4.5);
    expect(contrast(themeSet.dark[2].primary, themeSet.dark[2].background))
        .toBeGreaterThanOrEqual(4.5);

    // Display text in Light 0, 1, 2 has >= 3:1 contrast for large headings
    expect(contrast(themeSet.light[0].display, themeSet.light[0].background))
        .toBeGreaterThanOrEqual(3.0);
    expect(contrast(themeSet.light[1].display, themeSet.light[1].background))
        .toBeGreaterThanOrEqual(3.0);
    expect(contrast(themeSet.light[2].display, themeSet.light[2].background))
        .toBeGreaterThanOrEqual(3.0);
  });
});
