import {expect, test} from '@playwright/test';

import {TypographySet} from '../typography/types';

import {typographySetToTokenTree} from './typography-set-to-token-tree';

test.describe('typographySetToTokenTree', () => {
  test('converts typography definitions to tokens with nested code tokens', () => {
    const typographySet: TypographySet = {
      bodyMediumCode: {
        fontFamily: 'Fira Code',
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '20px',
      },
      displayLarge: {
        fontFamily: 'Roboto',
        fontSize: '57px',
        fontWeight: 400,
        letterSpacing: -0.25,
        lineHeight: '64px',
      },
      displayLargeCode: {
        fontFamily: 'Fira Code',
        fontSize: '57px',
        fontWeight: 400,
        letterSpacing: -0.25,
        lineHeight: '64px',
      },
    };
    const tree = typographySetToTokenTree(typographySet);

    expect(tree['display']).toEqual(
      expect.objectContaining({
        large: {
          $type: 'typography',
          $value: {
            fontFamily: 'Roboto',
            fontSize: '57px',
            fontWeight: 400,
            letterSpacing: -0.25,
            lineHeight: '64px',
            textCase: undefined,
            textDecoration: undefined,
          },
          code: {
            $type: 'typography',
            $value: {
              fontFamily: 'Fira Code',
              fontSize: '57px',
              fontWeight: 400,
              letterSpacing: -0.25,
              lineHeight: '64px',
              textCase: undefined,
              textDecoration: undefined,
            },
            code: undefined,
          },
        },
      }),
    );

    expect(tree['body']).toEqual(
      expect.objectContaining({
        medium: {
          code: {
            $type: 'typography',
            $value: {
              fontFamily: 'Fira Code',
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: undefined,
              lineHeight: '20px',
              textCase: undefined,
              textDecoration: undefined,
            },
            code: undefined,
          },
        },
      }),
    );
  });
});
