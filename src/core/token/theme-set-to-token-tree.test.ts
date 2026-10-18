import {expect, test} from '@playwright/test';

import {ThemeSet} from '../theme/theme-set';

import {themeSetToTokenTree} from './theme-set-to-token-tree';

test.describe('themeSetToTokenTree', () => {
  test('formats theme group keys hierarchically under name, mode, and type', () => {
    const themeSet: ThemeSet = {
      dark: {
        0: {
          background: 'neutral.c800',
          display: 'main.c500',
          error: 'error.c300',
          mode: 'dark',
          outline: 'main.c50',
          primary: 'neutral.c100',
          secondary: 'neutral.c950',
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
      name: 'theme',
    };
    const tree = themeSetToTokenTree(themeSet);

    expect(tree['theme']).toEqual(
      expect.objectContaining({
        dark: expect.objectContaining({
          0: {
            background: {
              $type: 'color',
              $value: '{neutral.800}',
              name: 'theme.dark.0.background',
            },
            display: {
              $type: 'color',
              $value: '{main.500}',
              name: 'theme.dark.0.display',
            },
            error: {
              $type: 'color',
              $value: '{error.300}',
              name: 'theme.dark.0.error',
            },
            outline: {
              $type: 'color',
              $value: '{main.50}',
              name: 'theme.dark.0.outline',
            },
            primary: {
              $type: 'color',
              $value: '{neutral.100}',
              name: 'theme.dark.0.primary',
            },
            secondary: {
              $type: 'color',
              $value: '{neutral.950}',
              name: 'theme.dark.0.secondary',
            },
            success: {
              $type: 'color',
              $value: '{success.300}',
              name: 'theme.dark.0.success',
            },
            warning: {
              $type: 'color',
              $value: '{warning.300}',
              name: 'theme.dark.0.warning',
            },
          },
          1: expect.objectContaining({
            background: {
              $type: 'color',
              $value: '{black}',
              name: 'theme.dark.1.background',
            },
          }),
          3: expect.objectContaining({
            primary: {
              $type: 'color',
              $value: '{white}',
              name: 'theme.dark.3.primary',
            },
          }),
        }),
        light: expect.objectContaining({
          0: expect.objectContaining({
            background: {
              $type: 'color',
              $value: '{neutral.100}',
              name: 'theme.light.0.background',
            },
            primary: {
              $type: 'color',
              $value: '{neutral.900}',
              name: 'theme.light.0.primary',
            },
          }),
        }),
      }),
    );
  });
});
