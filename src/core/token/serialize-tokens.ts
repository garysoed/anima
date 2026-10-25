import {TokenSets} from './token-sets';

export function serializeTokens(
  tokenSets: TokenSets,
  tokenSetOrder: readonly string[],
): string {
  const store = {
    ...tokenSets,
    $metadata: {
      tokenSetOrder,
    },
  };
  return JSON.stringify(store, null, 2);
}
