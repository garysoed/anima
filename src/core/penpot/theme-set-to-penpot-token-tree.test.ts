import {expect, test} from '@playwright/test';

import {ThemeSet} from '../theme/theme-set';

import {themeSetToPenpotTokenTree} from './theme-set-to-penpot-token-tree';

test.describe('themeSetToPenpotTokenTree', () => {
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
  const tree = themeSetToPenpotTokenTree(themeSet);

  test('formats theme group keys as mode_type and references palette aliases', () => {
    expect(tree['dark_0']).toEqual({
      background: {$type: 'color', $value: '{neutral.800}'},
      display: {$type: 'color', $value: '{main.500}'},
      error: {$type: 'color', $value: '{error.300}'},
      outline: {$type: 'color', $value: '{main.200}'},
      primary: {$type: 'color', $value: '{neutral.100}'},
      secondary: {$type: 'color', $value: '{neutral.300}'},
      success: {$type: 'color', $value: '{success.300}'},
      warning: {$type: 'color', $value: '{warning.300}'},
    });

    expect(tree['dark_1']).toEqual(
      expect.objectContaining({
        background: {$type: 'color', $value: '{black}'},
      }),
    );

    expect(tree['dark_3']).toEqual(
      expect.objectContaining({
        primary: {$type: 'color', $value: '{white}'},
      }),
    );

    expect(tree['light_0']).toEqual(
      expect.objectContaining({
        background: {$type: 'color', $value: '{neutral.100}'},
        primary: {$type: 'color', $value: '{neutral.900}'},
      }),
    );
  });
});
