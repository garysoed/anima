import {format} from 'gs-tools/export/color';

import {SHADE_KEYS} from '../palette/palette';
import {PALETTE_KEYS, PaletteSet} from '../palette/palette-set';
import {
  isPaletteKey,
  isShadeKey,
  MODES,
  PaletteColorKey,
  SECTIONS,
  TYPES,
} from '../theme/theme';
import {ThemeSet} from '../theme/theme-set';
import {TypographySet, TypographyValue} from '../typography/types';

import {
  PenpotColorToken,
  PenpotExportData,
  PenpotTokenTree,
  PenpotTypographyToken,
} from './penpot';

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

function getPenpotPaletteAlias(key: PaletteColorKey, seedName: string): string {
  if (key === 'white') {
    return '{white}';
  }
  if (key === 'black') {
    return '{black}';
  }
  const [palKey, shadeKey] = key.split('.');
  if (!isPaletteKey(palKey) || !isShadeKey(shadeKey)) {
    throw new Error(`Invalid palette color key: ${key}`);
  }
  const shadeNum = shadeKey.slice(1);
  const paletteType =
    palKey === 'highlight' || palKey === 'neutral'
      ? `${seedName}_${palKey}`
      : palKey;
  return `{${paletteType}.${shadeNum}}`;
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

export function getPenpotTokens(
  themeSet: ThemeSet,
  palettes: PaletteSet,
  typographySet: TypographySet,
  seedName: string,
): PenpotExportData {
  const paletteTokens: Record<string, PenpotColorToken | PenpotTokenTree> = {
    black: {
      $type: 'color',
      $value: '#000000',
    },
    white: {
      $type: 'color',
      $value: '#ffffff',
    },
  };

  for (const palKey of PALETTE_KEYS) {
    const palette = palettes[palKey];
    const prefix =
      palKey === 'highlight' || palKey === 'neutral'
        ? `${seedName}_${palKey}`
        : palKey;

    const shadeTokens: Record<string, PenpotColorToken> = {};
    for (const shadeKey of SHADE_KEYS) {
      const shadeNum = shadeKey.slice(1);
      shadeTokens[shadeNum] = {
        $type: 'color',
        $value: format(palette[shadeKey], 'hex'),
      };
    }
    paletteTokens[prefix] = shadeTokens;
  }

  const themeTokens: Record<string, PenpotTokenTree | PenpotTypographyToken> =
    {};

  for (const mode of MODES) {
    const modeThemes = themeSet[mode];
    for (const type of TYPES) {
      const theme = modeThemes[type];
      const roleTokens: Record<string, PenpotColorToken> = {};
      for (const section of SECTIONS) {
        roleTokens[section] = {
          $type: 'color',
          $value: getPenpotPaletteAlias(theme[section], seedName),
        };
      }
      themeTokens[`${seedName}-${mode}_${type}`] = roleTokens;
    }
  }

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
    themeTokens[type] = typeTokens;
  }

  return {
    $metadata: {
      activeSets: ['palette', 'theme'],
      tokenSetOrder: ['palette', 'theme'],
    },
    palette: paletteTokens,
    theme: themeTokens,
  };
}
