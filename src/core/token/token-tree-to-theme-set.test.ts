import {expect, test} from '@playwright/test';
import type {DeepKeyTokenMap} from '@tokens-studio/types';

import {createThemeSet} from '../theme/create-theme-set';

import {themeSetToTokenTree} from './theme-set-to-token-tree';
import {tokenTreeToThemeSet} from './token-tree-to-theme-set';

test.describe('tokenTreeToThemeSet', () => {
  test('reconstructs ThemeSet from themeSetToTokenTree output', () => {
    const original = createThemeSet('test-theme', 'main', 'neutral');
    const tokenTree = themeSetToTokenTree(original);
    const result = tokenTreeToThemeSet(tokenTree, 'test-theme');

    expect(result).toEqual(original);
  });

  test('reconstructs ThemeSet when mode trees are at root of tokenTree', () => {
    const original = createThemeSet('theme', 'main', 'neutral');
    const tokenTree = themeSetToTokenTree(original);
    const modeTree: DeepKeyTokenMap = {};
    Object.assign(modeTree, tokenTree['theme']);
    const result = tokenTreeToThemeSet(modeTree, 'theme');

    expect(result).toEqual(original);
  });
});
