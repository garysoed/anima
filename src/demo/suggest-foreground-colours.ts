import {Color, contrast} from 'gs-tools/export/color';

import {Palette} from '../core/palette/palette';
import {PaletteSet} from '../core/palette/palette-set';
import {
  PaletteColorKey,
  resolveThemeColor,
  ShadeKey,
  Theme,
  TYPES,
} from '../core/theme/theme';
import {ThemeSet} from '../core/theme/theme-set';

const MIN_CONTRAST_DISPLAY = 3.0;
const MIN_CONTRAST_FOREGROUND = 4.5;
const DEFAULT_SHADE: ShadeKey = 'c500';

const SHADE_ORDER: readonly ShadeKey[] = [
  'c500',
  'c600',
  'c400',
  'c700',
  'c300',
  'c800',
  'c200',
  'c900',
  'c100',
  'c950',
  'c50',
];

function getPalettePrefix(key: PaletteColorKey, fallback: string): string {
  if (key === 'black' || key === 'white') {
    return fallback;
  }
  const [prefix] = key.split('.');
  return prefix || fallback;
}

function findBestShade(
  palette: Palette,
  bg: Color,
  minContrast: number,
  primaryColor?: Color,
): ShadeKey {
  let highestContrast = -1;
  let bestShade: ShadeKey = DEFAULT_SHADE;

  for (const shade of SHADE_ORDER) {
    const candidate = palette[shade];
    if (primaryColor && contrast(candidate, primaryColor) <= 1.0) {
      continue;
    }
    const ratio = contrast(candidate, bg);
    if (ratio >= minContrast) {
      return shade;
    }
    if (ratio > highestContrast) {
      highestContrast = ratio;
      bestShade = shade;
    }
  }

  return bestShade;
}

function findDisplayShade(
  palettes: PaletteSet,
  backgrounds: readonly Color[],
): ShadeKey {
  let highestMinContrast = -1;
  let bestShade: ShadeKey = DEFAULT_SHADE;

  for (const shade of SHADE_ORDER) {
    const candidate = palettes.main[shade];
    let minContrastAcrossBackgrounds = Infinity;
    for (const bg of backgrounds) {
      const ratio = contrast(candidate, bg);
      if (ratio < minContrastAcrossBackgrounds) {
        minContrastAcrossBackgrounds = ratio;
      }
    }
    if (minContrastAcrossBackgrounds >= MIN_CONTRAST_DISPLAY) {
      return shade;
    }
    if (minContrastAcrossBackgrounds > highestMinContrast) {
      highestMinContrast = minContrastAcrossBackgrounds;
      bestShade = shade;
    }
  }

  return bestShade;
}

function suggestForegroundColourForTheme(
  currentTheme: Theme,
  displayShade: ShadeKey,
  palettes: PaletteSet,
): Theme {
  const bg = resolveThemeColor(palettes, currentTheme.background);
  const isLight = contrast(palettes.black, bg) >= MIN_CONTRAST_FOREGROUND;
  const primaryKey: PaletteColorKey = isLight ? 'black' : 'white';
  const primaryColor = isLight ? palettes.black : palettes.white;

  const mainPrefix = getPalettePrefix(currentTheme.display, 'main');
  const neutralPrefix = getPalettePrefix(currentTheme.secondary, 'neutral');
  const errorPrefix = getPalettePrefix(currentTheme.error, 'error');
  const warningPrefix = getPalettePrefix(currentTheme.warning, 'warning');
  const successPrefix = getPalettePrefix(currentTheme.success, 'success');

  const secondaryShade = findBestShade(
    palettes.neutral,
    bg,
    MIN_CONTRAST_FOREGROUND,
    primaryColor,
  );
  const errorShade = findBestShade(palettes.error, bg, MIN_CONTRAST_FOREGROUND);
  const warningShade = findBestShade(
    palettes.warning,
    bg,
    MIN_CONTRAST_FOREGROUND,
  );
  const successShade = findBestShade(
    palettes.success,
    bg,
    MIN_CONTRAST_FOREGROUND,
  );

  return {
    background: currentTheme.background,
    display: `${mainPrefix}.${displayShade}`,
    error: `${errorPrefix}.${errorShade}`,
    mode: currentTheme.mode,
    outline: currentTheme.outline,
    primary: primaryKey,
    secondary: `${neutralPrefix}.${secondaryShade}`,
    success: `${successPrefix}.${successShade}`,
    type: currentTheme.type,
    warning: `${warningPrefix}.${warningShade}`,
  };
}

export function suggestForegroundColours(
  currentThemeSet: ThemeSet,
  palettes: PaletteSet,
): ThemeSet {
  const lightBackgrounds = TYPES.map((type) =>
    resolveThemeColor(palettes, currentThemeSet.light[type].background),
  );
  const darkBackgrounds = TYPES.map((type) =>
    resolveThemeColor(palettes, currentThemeSet.dark[type].background),
  );

  const lightDisplayShade = findDisplayShade(palettes, lightBackgrounds);
  const darkDisplayShade = findDisplayShade(palettes, darkBackgrounds);

  return {
    dark: {
      0: suggestForegroundColourForTheme(
        currentThemeSet.dark[0],
        darkDisplayShade,
        palettes,
      ),
      1: suggestForegroundColourForTheme(
        currentThemeSet.dark[1],
        darkDisplayShade,
        palettes,
      ),
      2: suggestForegroundColourForTheme(
        currentThemeSet.dark[2],
        darkDisplayShade,
        palettes,
      ),
      3: suggestForegroundColourForTheme(
        currentThemeSet.dark[3],
        darkDisplayShade,
        palettes,
      ),
    },
    light: {
      0: suggestForegroundColourForTheme(
        currentThemeSet.light[0],
        lightDisplayShade,
        palettes,
      ),
      1: suggestForegroundColourForTheme(
        currentThemeSet.light[1],
        lightDisplayShade,
        palettes,
      ),
      2: suggestForegroundColourForTheme(
        currentThemeSet.light[2],
        lightDisplayShade,
        palettes,
      ),
      3: suggestForegroundColourForTheme(
        currentThemeSet.light[3],
        lightDisplayShade,
        palettes,
      ),
    },
    name: currentThemeSet.name,
  };
}
