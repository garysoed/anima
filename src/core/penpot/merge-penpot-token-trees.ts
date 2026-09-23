import {
  PenpotColorToken,
  PenpotTokenTree,
  PenpotTypographyToken,
} from './penpot';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLeafToken(value: Record<string, unknown>): boolean {
  return typeof value['$type'] === 'string';
}

function isTokenTree(value: unknown): value is PenpotTokenTree {
  return isPlainObject(value) && !isLeafToken(value);
}

export function mergePenpotTokenTrees(
  ...trees: readonly PenpotTokenTree[]
): PenpotTokenTree {
  const result: Record<
    string,
    PenpotColorToken | PenpotTokenTree | PenpotTypographyToken
  > = {};

  for (const tree of trees) {
    for (const [key, value] of Object.entries(tree)) {
      const existing = result[key];
      if (isTokenTree(existing) && isTokenTree(value)) {
        result[key] = mergePenpotTokenTrees(existing, value);
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}
