import {expect, test} from '@playwright/test';
import type {DeepKeyTokenMap} from '@tokens-studio/types';
import {TokenTypes} from '@tokens-studio/types';

import {serializeTokens} from './serialize-tokens';

test.describe('serializeTokens', () => {
  test('serializes multi-set tokens into formatted JSON with $metadata.tokenSetOrder', () => {
    const baseSet: DeepKeyTokenMap = {
      color: {
        primary: {
          $type: TokenTypes.COLOR,
          $value: '#ff0000',
          name: 'color.primary',
        },
      },
    };
    const themesSet: DeepKeyTokenMap = {
      theme: {
        background: {
          $type: TokenTypes.COLOR,
          $value: '{color.primary}',
          name: 'theme.background',
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
    const setA: DeepKeyTokenMap = {
      black: {
        $type: TokenTypes.COLOR,
        $value: '#000000',
        name: 'black',
      },
    };
    const setB: DeepKeyTokenMap = {
      white: {
        $type: TokenTypes.COLOR,
        $value: '#ffffff',
        name: 'white',
      },
    };

    const result = serializeTokens({a: setA, b: setB}, ['b', 'a']);

    const parsed = JSON.parse(result);
    expect(parsed.$metadata.tokenSetOrder).toEqual(['b', 'a']);
  });
});
