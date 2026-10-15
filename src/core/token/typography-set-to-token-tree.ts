import type {DesignToken, DesignTokens} from 'style-dictionary/types';

import {TypographySet, TypographyValue} from '../typography/types';

interface ParsedTypographyKey {
  readonly isCode: boolean;
  readonly size: string;
  readonly type: string;
}

function parseTypographyKey(key: string): ParsedTypographyKey | null {
  const match = key.match(
    /^(body|display|headline|label|title)(Large|Medium|Small)(Code)?$/,
  );
  const type = match?.[1];
  const size = match?.[2];
  if (!match || !type || !size) {
    return null;
  }
  return {
    isCode: match[3] === 'Code',
    size: size.toLowerCase(),
    type,
  };
}

function createTypographyToken(
  value: TypographyValue,
  codeToken: DesignToken | null,
): DesignToken {
  return {
    $type: 'typography',
    $value: {
      fontFamily: value.fontFamily,
      fontSize: value.fontSize,
      fontWeight: value.fontWeight,
      letterSpacing: value.letterSpacing,
      lineHeight: `${value.lineHeight}`,
      textCase: value.textCase,
      textDecoration: value.textDecoration,
    },
    code: codeToken ?? undefined,
  };
}

export function typographySetToTokenTree(
  typographySet: TypographySet,
): DesignTokens {
  const typographyTokens: Record<
    string,
    Record<
      string,
      {
        code: DesignToken | null;
        standard: TypographyValue | null;
      }
    >
  > = {};

  for (const [key, value] of Object.entries(typographySet)) {
    if (!value) {
      continue;
    }
    const parsed = parseTypographyKey(key);
    if (!parsed) {
      continue;
    }
    const {isCode, size, type} = parsed;
    const typeGroup = (typographyTokens[type] ??= {});
    const sizeGroup = (typeGroup[size] ??= {code: null, standard: null});
    if (isCode) {
      sizeGroup.code = createTypographyToken(value, null);
    } else {
      sizeGroup.standard = value;
    }
  }

  const result: DesignTokens = {};
  for (const [type, sizes] of Object.entries(typographyTokens)) {
    const typeTokens: DesignTokens = {};
    for (const [size, {code, standard}] of Object.entries(sizes)) {
      if (standard !== null) {
        typeTokens[size] = createTypographyToken(standard, code);
      } else if (code !== null) {
        typeTokens[size] = {code};
      }
    }
    result[type] = typeTokens;
  }

  return result;
}
