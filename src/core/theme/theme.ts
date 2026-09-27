import {Color} from 'gs-tools/export/color';

import {Palette} from '../palette/palette';
import {PaletteSet} from '../palette/palette-set';

export type GlobalPaletteKey = 'error' | 'success' | 'warning';
export type ShadeKey = keyof Palette;
export type PaletteColorKey = 'black' | 'white' | `${string}.${ShadeKey}`;

export type ThemeMode = 'dark' | 'light';
export type ThemeType = 0 | 1 | 2 | 3;
export type ThemeSection =
  | 'background'
  | 'border'
  | 'display'
  | 'error'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

export const MODES: readonly ThemeMode[] = ['light', 'dark'];
export const TYPES: readonly ThemeType[] = [0, 1, 2, 3];
export const SECTIONS: readonly ThemeSection[] = [
  'background',
  'border',
  'display',
  'error',
  'primary',
  'secondary',
  'success',
  'warning',
];

export interface Theme {
  readonly background: PaletteColorKey;
  readonly border: PaletteColorKey;
  readonly display: PaletteColorKey;
  readonly error: PaletteColorKey;
  readonly mode: ThemeMode;
  readonly primary: PaletteColorKey;
  readonly secondary: PaletteColorKey;
  readonly success: PaletteColorKey;
  readonly type: ThemeType;
  readonly warning: PaletteColorKey;
}

export function isGlobalPaletteKey(
  key: string | undefined,
): key is GlobalPaletteKey {
  return key === 'error' || key === 'success' || key === 'warning';
}

export function isShadeKey(key: string | undefined): key is ShadeKey {
  return (
    key === 'c50' ||
    key === 'c100' ||
    key === 'c200' ||
    key === 'c300' ||
    key === 'c400' ||
    key === 'c500' ||
    key === 'c600' ||
    key === 'c700' ||
    key === 'c800' ||
    key === 'c900' ||
    key === 'c950'
  );
}

export function resolveThemeColor(
  palettes: PaletteSet,
  key: PaletteColorKey,
): Color {
  if (key === 'white') {
    return palettes.white;
  }
  if (key === 'black') {
    return palettes.black;
  }
  const [paletteKey, shadeKey] = key.split('.');
  if (!paletteKey || !isShadeKey(shadeKey)) {
    throw new Error(`Invalid palette color key: ${key}`);
  }
  if (isGlobalPaletteKey(paletteKey)) {
    return palettes[paletteKey][shadeKey];
  }
  if (paletteKey === 'main') {
    return palettes.main[shadeKey];
  }
  if (paletteKey === 'neutral') {
    return palettes.neutral[shadeKey];
  }
  const otherPalette = palettes.other.get(paletteKey);
  if (otherPalette) {
    return otherPalette[shadeKey];
  }
  throw new Error(`Palette not found: ${paletteKey}`);
}

export function getPaletteCssVar(key: PaletteColorKey): string {
  if (key === 'white') {
    return 'var(--an-white)';
  }
  if (key === 'black') {
    return 'var(--an-black)';
  }
  const [paletteKey, shadeKey] = key.split('.');
  if (!paletteKey || !isShadeKey(shadeKey)) {
    throw new Error(`Invalid palette color key: ${key}`);
  }
  const shadeNum = shadeKey.slice(1);
  return `var(--an-${paletteKey}-${shadeNum})`;
}
