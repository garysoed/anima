import {expect, test} from '@playwright/test';

import {createThemeSet} from './theme-set';

test.describe('createThemeSet', () => {
  test('creates ThemeSet with specified themeName and dark/light configurations', () => {
    const themeSet = createThemeSet('custom-theme');
    expect(themeSet.themeName).toBe('custom-theme');
    expect(themeSet.dark[0].mode).toBe('dark');
    expect(themeSet.light[0].mode).toBe('light');
  });
});
