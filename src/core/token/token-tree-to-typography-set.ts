import type {DeepKeyTokenMap} from '@tokens-studio/types';

import {isRecord} from '../../util/is-record';
import {
  TypographySet,
  TypographySize,
  TypographyType,
  TypographyValue,
} from '../typography/types';

function isTypographyType(key: string): key is TypographyType {
  return (
    key === 'body' ||
    key === 'display' ||
    key === 'headline' ||
    key === 'label' ||
    key === 'title'
  );
}

function isTypographySize(key: string): key is TypographySize {
  return key === 'large' || key === 'medium' || key === 'small';
}

function isTextCase(
  value: unknown,
): value is 'capitalize' | 'lowercase' | 'none' | 'uppercase' {
  return (
    value === 'capitalize' ||
    value === 'lowercase' ||
    value === 'none' ||
    value === 'uppercase'
  );
}

function isTextDecoration(
  value: unknown,
): value is 'none' | 'strike-through' | 'underline' {
  return (
    value === 'none' || value === 'strike-through' || value === 'underline'
  );
}

function parseTypographyValue(raw: unknown): TypographyValue | null {
  if (!isRecord(raw)) {
    return null;
  }
  const fontFamily =
    typeof raw['fontFamily'] === 'string' ? raw['fontFamily'] : null;
  const fontSize = typeof raw['fontSize'] === 'string' ? raw['fontSize'] : null;
  const fontWeight =
    typeof raw['fontWeight'] === 'number' ||
    typeof raw['fontWeight'] === 'string'
      ? raw['fontWeight']
      : null;
  const lineHeight =
    typeof raw['lineHeight'] === 'number' ||
    typeof raw['lineHeight'] === 'string'
      ? raw['lineHeight']
      : null;

  if (!fontFamily || !fontSize || fontWeight === null || lineHeight === null) {
    return null;
  }

  return {
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing:
      typeof raw['letterSpacing'] === 'number' ||
      typeof raw['letterSpacing'] === 'string'
        ? raw['letterSpacing']
        : undefined,
    lineHeight,
    textCase: isTextCase(raw['textCase']) ? raw['textCase'] : undefined,
    textDecoration: isTextDecoration(raw['textDecoration'])
      ? raw['textDecoration']
      : undefined,
  };
}

function isTypographySetKey(key: string): key is keyof TypographySet {
  const match = key.match(
    /^(body|display|headline|label|title)(Large|Medium|Small)(Code)?$/,
  );
  return match !== null;
}

export function tokenTreeToTypographySet(
  tokenTree: DeepKeyTokenMap,
): TypographySet {
  const typographyNode = tokenTree['typography'];
  const root: Record<string, unknown> = isRecord(typographyNode)
    ? typographyNode
    : tokenTree;

  const result: Partial<Record<keyof TypographySet, TypographyValue>> = {};

  for (const [type, sizes] of Object.entries(root)) {
    if (!isTypographyType(type) || !isRecord(sizes)) {
      continue;
    }

    for (const [size, sizeNode] of Object.entries(sizes)) {
      if (!isTypographySize(size) || !isRecord(sizeNode)) {
        continue;
      }

      const capitalizedSize = size.charAt(0).toUpperCase() + size.slice(1);
      const standardKey = `${type}${capitalizedSize}`;
      const standardValue = parseTypographyValue(sizeNode['$value']);
      if (standardValue && isTypographySetKey(standardKey)) {
        result[standardKey] = standardValue;
      }

      const codeNode = sizeNode['code'];
      if (isRecord(codeNode)) {
        const codeKey = `${type}${capitalizedSize}Code`;
        const codeValue = parseTypographyValue(codeNode['$value']);
        if (codeValue && isTypographySetKey(codeKey)) {
          result[codeKey] = codeValue;
        }
      }
    }
  }

  return result;
}
