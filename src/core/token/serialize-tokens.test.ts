import {expect, test} from '@playwright/test';
import type {DeepKeyTokenMap} from '@tokens-studio/types';
import {TokenTypes} from '@tokens-studio/types';

import {serializeTokens} from './serialize-tokens';

test.describe('serializeTokens', () => {
  test('serializes multi-set tokens into formatted JSON with $metadata.tokenSetOrder', () => {
    const baseSet: DeepKeyTokenMap<false> = {
      color: {
        primary: {
          $type: TokenTypes.COLOR,
          $value: '#ff0000',
        },
      },
    };
    const themesSet: DeepKeyTokenMap<false> = {
      theme: {
        background: {
          $type: TokenTypes.COLOR,
          $value: '{color.primary}',
        },
      },
    };

    const result = serializeTokens({base: baseSet, themes: themesSet}, [
      'base',
      'themes',
    ]);

    const parsed = JSON.parse(result);
    expect(parsed).toEqual({
      $metadata: {
        tokenSetOrder: ['base', 'themes'],
      },
      base: baseSet,
      themes: themesSet,
    });
    expect(result).toBe(JSON.stringify(parsed, null, 2));
  });

  test('preserves custom tokenSetOrder when provided', () => {
    const setA: DeepKeyTokenMap<false> = {
      black: {$type: TokenTypes.COLOR, $value: '#000000'},
    };
    const setB: DeepKeyTokenMap<false> = {
      white: {$type: TokenTypes.COLOR, $value: '#ffffff'},
    };

    const result = serializeTokens({a: setA, b: setB}, ['b', 'a']);

    const parsed = JSON.parse(result);
    expect(parsed.$metadata.tokenSetOrder).toEqual(['b', 'a']);
  });
});
