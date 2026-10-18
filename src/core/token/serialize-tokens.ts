import type {DeepKeyTokenMap} from '@tokens-studio/types';

export function serializeTokens(
  tokenSets: Record<string, DeepKeyTokenMap<false>>,
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
