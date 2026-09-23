import {expect, test} from '@playwright/test';

import {mergePenpotTokenTrees} from './merge-penpot-token-trees';
import {PenpotTokenTree} from './penpot';

test.describe('mergePenpotTokenTrees', () => {
  test('merges disjoint token trees', () => {
    const treeA: PenpotTokenTree = {
      palette: {
        black: {$type: 'color', $value: '#000000'},
      },
    };
    const treeB: PenpotTokenTree = {
      theme: {
        background: {$type: 'color', $value: '{white}'},
      },
    };
    const merged = mergePenpotTokenTrees(treeA, treeB);

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
    const treeA: PenpotTokenTree = {
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
    const treeB: PenpotTokenTree = {
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
    const merged = mergePenpotTokenTrees(treeA, treeB);

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
