import {expect, test} from '@playwright/test';

import {createThemeSet} from './theme-set';

test.describe('createThemeSet', () => {
  test('creates ThemeSet with role colors referencing main and neutral palettes', () => {
    const themeSet = createThemeSet();
    expect(themeSet.dark[0].background).toBe('neutral.c800');
    expect(themeSet.dark[0].border).toBe('main.c200');
    expect(themeSet.dark[0].display).toBe('main.c500');
    expect(themeSet.dark[0].mode).toBe('dark');
    expect(themeSet.light[0].border).toBe('main.c800');
    expect(themeSet.light[0].mode).toBe('light');
  });
});
