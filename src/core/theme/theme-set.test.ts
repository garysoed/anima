import {expect, test} from '@playwright/test';

import {createThemeSet} from './theme-set';

test.describe('createThemeSet', () => {
  test('creates ThemeSet with seedName prefixed to role colors', () => {
    const themeSet = createThemeSet('custom');
    expect(themeSet.dark[0].background).toBe('custom_neutral.c800');
    expect(themeSet.dark[0].border).toBe('custom_highlight.c200');
    expect(themeSet.dark[0].display).toBe('custom_highlight.c500');
    expect(themeSet.dark[0].mode).toBe('dark');
    expect(themeSet.light[0].border).toBe('custom_highlight.c800');
    expect(themeSet.light[0].mode).toBe('light');
  });
});
