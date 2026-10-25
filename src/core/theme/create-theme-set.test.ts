import {expect, test} from '@playwright/test';

import {createThemeSet} from './create-theme-set';

test.describe('createThemeSet', () => {
  test('creates a theme set with custom name and palette names', () => {
    const themeSet = createThemeSet('customTheme', 'brand', 'slate');

    expect(themeSet.name).toBe('customTheme');

    expect(themeSet.dark[0]).toEqual({
      background: 'slate.c800',
      display: 'brand.c400',
      error: 'error.c300',
      mode: 'dark',
      outline: 'brand.c200',
      primary: 'slate.c100',
      secondary: 'slate.c300',
      success: 'success.c300',
      type: 0,
      warning: 'warning.c300',
    });

    expect(themeSet.dark[1]).toEqual({
      background: 'black',
      display: 'brand.c400',
      error: 'error.c400',
      mode: 'dark',
      outline: 'brand.c200',
      primary: 'slate.c100',
      secondary: 'slate.c400',
      success: 'success.c400',
      type: 1,
      warning: 'warning.c400',
    });

    expect(themeSet.dark[2]).toEqual({
      background: 'brand.c900',
      display: 'brand.c400',
      error: 'error.c400',
      mode: 'dark',
      outline: 'brand.c200',
      primary: 'slate.c100',
      secondary: 'slate.c400',
      success: 'success.c400',
      type: 2,
      warning: 'warning.c400',
    });

    expect(themeSet.dark[3]).toEqual({
      background: 'brand.c700',
      display: 'brand.c400',
      error: 'error.c200',
      mode: 'dark',
      outline: 'brand.c200',
      primary: 'white',
      secondary: 'slate.c200',
      success: 'success.c200',
      type: 3,
      warning: 'warning.c200',
    });

    expect(themeSet.light[0]).toEqual({
      background: 'slate.c100',
      display: 'brand.c600',
      error: 'error.c600',
      mode: 'light',
      outline: 'brand.c800',
      primary: 'slate.c900',
      secondary: 'slate.c700',
      success: 'success.c600',
      type: 0,
      warning: 'warning.c600',
    });

    expect(themeSet.light[1]).toEqual({
      background: 'white',
      display: 'brand.c600',
      error: 'error.c600',
      mode: 'light',
      outline: 'brand.c800',
      primary: 'slate.c900',
      secondary: 'slate.c700',
      success: 'success.c600',
      type: 1,
      warning: 'warning.c600',
    });

    expect(themeSet.light[2]).toEqual({
      background: 'brand.c100',
      display: 'brand.c600',
      error: 'error.c700',
      mode: 'light',
      outline: 'brand.c800',
      primary: 'slate.c900',
      secondary: 'slate.c700',
      success: 'success.c700',
      type: 2,
      warning: 'warning.c700',
    });

    expect(themeSet.light[3]).toEqual({
      background: 'brand.c200',
      display: 'brand.c600',
      error: 'error.c800',
      mode: 'light',
      outline: 'brand.c800',
      primary: 'black',
      secondary: 'slate.c800',
      success: 'success.c800',
      type: 3,
      warning: 'warning.c800',
    });
  });
});
