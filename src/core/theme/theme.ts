import {Color} from 'gs-tools/export/color';

import {Palette} from '../palette/palette';
import {PaletteSet} from '../palette/palette-set';

export type GlobalPaletteKey = 'error' | 'success' | 'warning';
export type SeededPaletteKey = 'highlight' | 'neutral';
export type PaletteKey = `${string}_${SeededPaletteKey}` | GlobalPaletteKey;
export type ShadeKey = keyof Palette;
export type PaletteColorKey = 'black' | 'white' | `${PaletteKey}.${ShadeKey}`;

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

export function isPaletteKey(key: string | undefined): key is PaletteKey {
  if (isGlobalPaletteKey(key)) {
    return true;
  }
  if (typeof key === 'string') {
    return key.endsWith('_highlight') || key.endsWith('_neutral');
  }
  return false;
}

export function isShadeKey(key: string | undefined): key is ShadeKey {
  return (
    key === 'c100' ||
    key === 'c200' ||
    key === 'c300' ||
    key === 'c400' ||
    key === 'c500' ||
    key === 'c600' ||
    key === 'c700' ||
    key === 'c800' ||
    key === 'c900'
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
  if (!isPaletteKey(paletteKey) || !isShadeKey(shadeKey)) {
    throw new Error(`Invalid palette color key: ${key}`);
  }
  if (isGlobalPaletteKey(paletteKey)) {
    return palettes[paletteKey][shadeKey];
  }
  const lastUnderscore = paletteKey.lastIndexOf('_');
  const seedName = paletteKey.slice(0, lastUnderscore);
  const basePaletteKey = paletteKey.slice(lastUnderscore + 1);
  const seeded = palettes.seededPaletteSets.get(seedName);
  if (!seeded) {
    throw new Error(`Seed not found: ${seedName}`);
  }
  if (basePaletteKey === 'highlight' || basePaletteKey === 'neutral') {
    return seeded[basePaletteKey][shadeKey];
  }
  throw new Error(`Invalid seeded palette key: ${paletteKey}`);
}

export function getPaletteCssVar(key: PaletteColorKey): string {
  if (key === 'white') {
    return 'var(--an-white)';
  }
  if (key === 'black') {
    return 'var(--an-black)';
  }
  const [paletteKey, shadeKey] = key.split('.');
  if (!isPaletteKey(paletteKey) || !isShadeKey(shadeKey)) {
    throw new Error(`Invalid palette color key: ${key}`);
  }
  const shadeNum = shadeKey.slice(1);
  return `var(--an-${paletteKey}-${shadeNum})`;
}
