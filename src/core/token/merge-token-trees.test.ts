import {expect, test} from '@playwright/test';
import type {DeepKeyTokenMap} from '@tokens-studio/types';
import {TokenTypes} from '@tokens-studio/types';

import {mergeTokenTrees} from './merge-token-trees';

test.describe('mergeTokenTrees', () => {
  test('merges disjoint token trees', () => {
    const treeA: DeepKeyTokenMap<false> = {
      palette: {
        black: {$type: TokenTypes.COLOR, $value: '#000000'},
      },
    };
    const treeB: DeepKeyTokenMap<false> = {
      theme: {
        background: {$type: TokenTypes.COLOR, $value: '{white}'},
      },
    };
    const merged = mergeTokenTrees(treeA, treeB);

    expect(merged).toEqual({
      palette: {
        black: {$type: TokenTypes.COLOR, $value: '#000000'},
      },
      theme: {
        background: {$type: TokenTypes.COLOR, $value: '{white}'},
      },
    });
  });

  test('recursively merges nested subtrees and overrides overlapping leaves', () => {
    const treeA: DeepKeyTokenMap<false> = {
      display: {
        large: {
          $type: TokenTypes.TYPOGRAPHY,
          $value: {
            fontFamily: 'Roboto',
            fontSize: '57px',
            fontWeight: '400',
            lineHeight: '64px',
          },
        },
        medium: {
          $type: TokenTypes.TYPOGRAPHY,
          $value: {
            fontFamily: 'Roboto',
            fontSize: '45px',
            fontWeight: '400',
            lineHeight: '52px',
          },
        },
      },
    };
    const treeB: DeepKeyTokenMap<false> = {
      display: {
        large: {
          $type: TokenTypes.TYPOGRAPHY,
          $value: {
            fontFamily: 'Open Sans',
            fontSize: '57px',
            fontWeight: '700',
            lineHeight: '64px',
          },
        },
        small: {
          $type: TokenTypes.TYPOGRAPHY,
          $value: {
            fontFamily: 'Roboto',
            fontSize: '36px',
            fontWeight: '400',
            lineHeight: '44px',
          },
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
        },
        medium: {
          $type: TokenTypes.TYPOGRAPHY,
          $value: {
            fontFamily: 'Roboto',
            fontSize: '45px',
            fontWeight: '400',
            lineHeight: '52px',
          },
        },
        small: {
          $type: TokenTypes.TYPOGRAPHY,
          $value: {
            fontFamily: 'Roboto',
            fontSize: '36px',
            fontWeight: '400',
            lineHeight: '44px',
          },
        },
      },
    });
  });
});
