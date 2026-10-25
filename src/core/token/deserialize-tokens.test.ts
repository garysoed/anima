import {expect, test} from '@playwright/test';

import {deserializeTokens} from './deserialize-tokens';

test.describe('deserializeTokens', () => {
  test('preserves token sets, metadata, and input structure', () => {
    const rawData = {
      $metadata: {
        tokenSetOrder: ['base', 'themes'],
      },
      $themes: [],
      base: {
        main: {
          500: {
            $type: 'color',
            $value: '#3b82f6',
          },
        },
      },
      themes: {
        theme: {
          light: {
            0: {
              background: {
                $type: 'color',
                $value: '{neutral.100}',
              },
            },
          },
        },
      },
    };

    const tokenSets = deserializeTokens(rawData);

    expect(tokenSets).toEqual(rawData);
  });
});
