import type {DeepKeyTokenMap} from '@tokens-studio/types';

import {TokenSets} from './token-sets';

function isTokenTree(value: unknown): value is DeepKeyTokenMap {
  return typeof value === 'object' && value !== null;
}

export function deserializeTokens(data: Record<string, unknown>): TokenSets {
  const tokenSets: TokenSets = {};
  for (const [key, value] of Object.entries(data)) {
    if (isTokenTree(value)) {
      tokenSets[key] = value;
    }
  }
  return tokenSets;
}
