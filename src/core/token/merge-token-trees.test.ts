import {expect, test} from '@playwright/test';
import type {DesignTokens} from 'style-dictionary/types';

import {mergeTokenTrees} from './merge-token-trees';

test.describe('mergeTokenTrees', () => {
  test('merges disjoint token trees', () => {
    const treeA: DesignTokens = {
      palette: {
        black: {$type: 'color', $value: '#000000'},
      },
    };
    const treeB: DesignTokens = {
      theme: {
        background: {$type: 'color', $value: '{white}'},
      },
    };
    const merged = mergeTokenTrees(treeA, treeB);

    expect(merged).toEqual({
      palette: {
        black: {$type: 'color', $value: '#000000'},
      },
      theme: {
        background: {$type: 'color', $value: '{white}'},
      },
    });
  });

  test('recursively merges nested subtrees and overrides overlapping leaves', () => {
    const treeA: DesignTokens = {
      display: {
        large: {
          $type: 'typography',
          $value: {
            fontFamily: 'Roboto',
            fontSize: '57px',
            fontWeight: 400,
            lineHeight: '64px',
          },
        },
        medium: {
          $type: 'typography',
          $value: {
            fontFamily: 'Roboto',
            fontSize: '45px',
            fontWeight: 400,
            lineHeight: '52px',
          },
        },
      },
    };
    const treeB: DesignTokens = {
      display: {
        large: {
          $type: 'typography',
          $value: {
            fontFamily: 'Open Sans',
            fontSize: '57px',
            fontWeight: 700,
            lineHeight: '64px',
          },
        },
        small: {
          $type: 'typography',
          $value: {
            fontFamily: 'Roboto',
            fontSize: '36px',
            fontWeight: 400,
            lineHeight: '44px',
          },
        },
      },
    };
    const merged = mergeTokenTrees(treeA, treeB);

    expect(merged).toEqual({
      display: {
        large: {
          $type: 'typography',
          $value: {
            fontFamily: 'Open Sans',
            fontSize: '57px',
            fontWeight: 700,
            lineHeight: '64px',
          },
        },
        medium: {
          $type: 'typography',
          $value: {
            fontFamily: 'Roboto',
            fontSize: '45px',
            fontWeight: 400,
            lineHeight: '52px',
          },
        },
        small: {
          $type: 'typography',
          $value: {
            fontFamily: 'Roboto',
            fontSize: '36px',
            fontWeight: 400,
            lineHeight: '44px',
          },
        },
      },
    });
  });
});
