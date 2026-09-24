import {expect, test} from '@playwright/test';

import {createThemeSet} from '../theme/theme-set';

import {themeSetToPenpotTokenTree} from './theme-set-to-penpot-token-tree';

test.describe('themeSetToPenpotTokenTree', () => {
  const themeSet = createThemeSet('custom');
  const tree = themeSetToPenpotTokenTree(themeSet);

  test('formats theme group keys as mode_type and references palette aliases with seedName', () => {
    expect(tree['dark_0']).toEqual({
      background: {$type: 'color', $value: '{custom_neutral.800}'},
      border: {$type: 'color', $value: '{custom_highlight.200}'},
      display: {$type: 'color', $value: '{custom_highlight.500}'},
      error: {$type: 'color', $value: '{error.300}'},
      primary: {$type: 'color', $value: '{custom_neutral.100}'},
      secondary: {$type: 'color', $value: '{custom_neutral.300}'},
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
        background: {$type: 'color', $value: '{custom_neutral.100}'},
        primary: {$type: 'color', $value: '{custom_neutral.900}'},
      }),
    );
  });
});
