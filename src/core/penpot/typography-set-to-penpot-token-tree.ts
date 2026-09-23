import {TypographySet, TypographyValue} from '../typography/types';

import {PenpotTokenTree, PenpotTypographyToken} from './penpot';

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

function createPenpotTypographyToken(
  value: TypographyValue,
  codeToken: PenpotTypographyToken | null,
): PenpotTypographyToken {
  return {
    $type: 'typography',
    $value: {
      fontFamily: value.fontFamily,
      fontSize: value.fontSize,
      fontWeight: value.fontWeight,
      letterSpacing: value.letterSpacing,
      lineHeight: value.lineHeight,
      textCase: value.textCase,
      textDecoration: value.textDecoration,
    },
    code: codeToken ?? undefined,
  };
}

export function typographySetToPenpotTokenTree(
  typographySet: TypographySet,
): PenpotTokenTree {
  const typographyTokens: Record<
    string,
    Record<
      string,
      {
        code: PenpotTypographyToken | null;
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
      sizeGroup.code = createPenpotTypographyToken(value, null);
    } else {
      sizeGroup.standard = value;
    }
  }

  const result: Record<string, PenpotTokenTree | PenpotTypographyToken> = {};
  for (const [type, sizes] of Object.entries(typographyTokens)) {
    const typeTokens: Record<string, PenpotTokenTree | PenpotTypographyToken> =
      {};
    for (const [size, {code, standard}] of Object.entries(sizes)) {
      if (standard !== null) {
        typeTokens[size] = createPenpotTypographyToken(standard, code);
      } else if (code !== null) {
        typeTokens[size] = {code};
      }
    }
    result[type] = typeTokens;
  }

  return result;
}
