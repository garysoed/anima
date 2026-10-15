import {expect, test} from '@playwright/test';
import type {DesignTokens} from 'style-dictionary/types';

import {serializeTokens} from './serialize-tokens';

test.describe('serializeTokens', () => {
  test('serializes DesignTokens tree into formatted JSON string', async () => {
    const tokens: DesignTokens = {
      color: {
        primary: {
          $type: 'color',
          $value: '#ff0000',
        },
      },
    };

    const result = await serializeTokens(tokens);

    expect(result).toBe(JSON.stringify(tokens, null, 2));
    expect(JSON.parse(result)).toEqual(tokens);
  });
});
