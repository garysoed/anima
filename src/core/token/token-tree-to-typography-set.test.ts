import {expect, test} from '@playwright/test';
import type {DeepKeyTokenMap} from '@tokens-studio/types';

import {TypographySet} from '../typography/types';

import {tokenTreeToTypographySet} from './token-tree-to-typography-set';
import {typographySetToTokenTree} from './typography-set-to-token-tree';

test.describe('tokenTreeToTypographySet', () => {
  test('reconstructs TypographySet from typographySetToTokenTree output', () => {
    const original: TypographySet = {
      bodyLarge: {
        fontFamily: 'Roboto',
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '24px',
      },
      bodyLargeCode: {
        fontFamily: 'Roboto Mono',
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '24px',
      },
      headlineLarge: {
        fontFamily: 'Montserrat',
        fontSize: '32px',
        fontWeight: '700',
        letterSpacing: '0.5px',
        lineHeight: '40px',
        textCase: 'uppercase',
        textDecoration: 'underline',
      },
    };

    const tokenTree = typographySetToTokenTree(original);
    const result = tokenTreeToTypographySet(tokenTree);

    expect(result).toEqual(original);
  });

  test('reconstructs TypographySet when wrapped in typography namespace', () => {
    const original: TypographySet = {
      bodyMedium: {
        fontFamily: 'Open Sans',
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '20px',
      },
    };

    const tokenTree = typographySetToTokenTree(original);
    const wrappedTree: DeepKeyTokenMap = {
      typography: tokenTree,
    };
    const result = tokenTreeToTypographySet(wrappedTree);

    expect(result).toEqual(original);
  });
});
