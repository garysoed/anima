import type {DeepKeyTokenMap} from '@tokens-studio/types';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLeafToken(value: Record<string, unknown>): boolean {
  return (
    typeof value['$type'] === 'string' ||
    typeof value['value'] !== 'undefined' ||
    typeof value['$value'] !== 'undefined'
  );
}

function isTokenTree(value: unknown): value is DeepKeyTokenMap {
  return isPlainObject(value) && !isLeafToken(value);
}

export function mergeTokenTrees(
  ...trees: readonly DeepKeyTokenMap[]
): DeepKeyTokenMap {
  const result: DeepKeyTokenMap = {};

  for (const tree of trees) {
    for (const [key, value] of Object.entries(tree)) {
      const existing = result[key];
      if (isTokenTree(existing) && isTokenTree(value)) {
        result[key] = mergeTokenTrees(existing, value);
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}
