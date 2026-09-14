import {Color} from 'gs-tools/export/color';

import {Palette} from '../palette/palette';
import {PaletteSet} from '../palette/palette-set';

export type PaletteKey = keyof PaletteSet;
export type ShadeKey = keyof Palette;
export type PaletteColorKey = `${PaletteKey}.${ShadeKey}`;

export type ThemeMode = 'dark' | 'light';
export type ThemeType = 0 | 1 | 2 | 3;
export type ThemeSection =
  | 'background'
  | 'display'
  | 'error'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

export interface Theme {
  readonly background: PaletteColorKey;
  readonly display: PaletteColorKey;
  readonly error: PaletteColorKey;
  readonly mode: ThemeMode;
  readonly primary: PaletteColorKey;
  readonly secondary: PaletteColorKey;
  readonly success: PaletteColorKey;
  readonly type: ThemeType;
  readonly warning: PaletteColorKey;
}

export function isPaletteKey(key: string): key is PaletteKey {
  return (
    key === 'error' ||
    key === 'highlight' ||
    key === 'neutral' ||
    key === 'success' ||
    key === 'warning'
  );
}

export function isShadeKey(key: string): key is ShadeKey {
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
  const [palKey, shadeKey] = key.split('.');
  if (!isPaletteKey(palKey) || !isShadeKey(shadeKey)) {
    throw new Error(`Invalid palette color key: ${key}`);
  }
  return palettes[palKey][shadeKey];
}

export function getPaletteCssVar(
  key: PaletteColorKey,
  seedName: string,
): string {
  const [palKey, shadeKey] = key.split('.');
  if (!isPaletteKey(palKey) || !isShadeKey(shadeKey)) {
    throw new Error(`Invalid palette color key: ${key}`);
  }
  const shadeNum = shadeKey.slice(1);
  const paletteType =
    palKey === 'highlight' || palKey === 'neutral'
      ? `${seedName}_${palKey}`
      : palKey;
  return `var(--an-${paletteType}-${shadeNum})`;
}
