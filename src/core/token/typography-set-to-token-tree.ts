import type {
  DeepKeyTokenMap,
  SingleTypographyToken,
} from '@tokens-studio/types';
import {TokenTypes} from '@tokens-studio/types';

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

export interface TypographyTokenPayload {
  readonly code?: TypographyToken;
}

export type TypographyToken = SingleTypographyToken<
  true,
  TypographyTokenPayload
>;

function createTypographyToken(
  value: TypographyValue,
  name: string,
  codeToken: TypographyToken | null,
): TypographyToken {
  return {
    $type: TokenTypes.TYPOGRAPHY,
    $value: {
      fontFamily: value.fontFamily,
      fontSize: value.fontSize,
      fontWeight: `${value.fontWeight}`,
      letterSpacing:
        value.letterSpacing !== undefined
          ? `${value.letterSpacing}`
          : undefined,
      lineHeight: `${value.lineHeight}`,
      textCase: value.textCase,
      textDecoration: value.textDecoration,
    },
    code: codeToken ?? undefined,
    name,
  };
}

export function typographySetToTokenTree(
  typographySet: TypographySet,
): DeepKeyTokenMap {
  const typographyTokens: Record<
    string,
    Record<
      string,
      {
        code: TypographyToken | null;
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
      sizeGroup.code = createTypographyToken(value, `${type}.${size}.code`, null);
    } else {
      sizeGroup.standard = value;
    }
  }

  const result: DeepKeyTokenMap = {};
  for (const [type, sizes] of Object.entries(typographyTokens)) {
    const typeTokens: DeepKeyTokenMap = {};
    for (const [size, {code, standard}] of Object.entries(sizes)) {
      if (standard !== null) {
        typeTokens[size] = createTypographyToken(standard, `${type}.${size}`, code);
      } else if (code !== null) {
        typeTokens[size] = {code};
      }
    }
    result[type] = typeTokens;
  }

  return result;
}
