import {expect, test} from '@playwright/test';
import type {DeepKeyTokenMap} from '@tokens-studio/types';
import {TokenTypes} from '@tokens-studio/types';

import {mergeTokenTrees} from './merge-token-trees';

test.describe('mergeTokenTrees', () => {
  test('merges disjoint token trees', () => {
    const treeA: DeepKeyTokenMap = {
      palette: {
        black: {
          $type: TokenTypes.COLOR,
          $value: '#000000',
          name: 'palette.black',
        },
      },
    };
    const treeB: DeepKeyTokenMap = {
      theme: {
        background: {
          $type: TokenTypes.COLOR,
          $value: '{white}',
          name: 'theme.background',
        },
      },
    };
    const merged = mergeTokenTrees(treeA, treeB);

    expect(merged).toEqual({
      palette: {
        black: {
          $type: TokenTypes.COLOR,
          $value: '#000000',
          name: 'palette.black',
        },
      },
      theme: {
        background: {
          $type: TokenTypes.COLOR,
          $value: '{white}',
          name: 'theme.background',
        },
      },
    });
  });

  test('recursively merges nested subtrees and overrides overlapping leaves', () => {
    const treeA: DeepKeyTokenMap = {
      display: {
        large: {
          $type: TokenTypes.TYPOGRAPHY,
          $value: {
            fontFamily: 'Roboto',
            fontSize: '57px',
            fontWeight: '400',
            lineHeight: '64px',
          },
          name: 'display.large',
        },
        medium: {
          $type: TokenTypes.TYPOGRAPHY,
          $value: {
            fontFamily: 'Roboto',
            fontSize: '45px',
            fontWeight: '400',
            lineHeight: '52px',
          },
          name: 'display.medium',
        },
      },
    };
    const treeB: DeepKeyTokenMap = {
      display: {
        large: {
          $type: TokenTypes.TYPOGRAPHY,
          $value: {
            fontFamily: 'Open Sans',
            fontSize: '57px',
            fontWeight: '700',
            lineHeight: '64px',
          },
          name: 'display.large',
        },
        small: {
          $type: TokenTypes.TYPOGRAPHY,
          $value: {
            fontFamily: 'Roboto',
            fontSize: '36px',
            fontWeight: '400',
            lineHeight: '44px',
          },
          name: 'display.small',
        },
      },
    };
    const merged = mergeTokenTrees(treeA, treeB);

    expect(merged).toEqual({
      display: {
        large: {
          $type: TokenTypes.TYPOGRAPHY,
          $value: {
            fontFamily: 'Open Sans',
            fontSize: '57px',
            fontWeight: '700',
            lineHeight: '64px',
          },
          name: 'display.large',
        },
        medium: {
          $type: TokenTypes.TYPOGRAPHY,
          $value: {
            fontFamily: 'Roboto',
            fontSize: '45px',
            fontWeight: '400',
            lineHeight: '52px',
          },
          name: 'display.medium',
        },
        small: {
          $type: TokenTypes.TYPOGRAPHY,
          $value: {
            fontFamily: 'Roboto',
            fontSize: '36px',
            fontWeight: '400',
            lineHeight: '44px',
          },
          name: 'display.small',
        },
      },
    });
  });
});
