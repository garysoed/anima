import {Color} from 'gs-tools/export/color';

import {createPaletteSet} from '../palette/create-palette-set';

import {ThemeSet} from './theme-set';

export function createThemeSet(seedColor: Color): ThemeSet {
  const palettes = createPaletteSet(seedColor);

  return {
    dark: {
      0: {
        background: palettes.neutral.c900,
        display: palettes.neutral.c400,
        error: palettes.error.c300,
        primary: palettes.neutral.c100,
        secondary: palettes.neutral.c300,
        success: palettes.success.c300,
        warning: palettes.warning.c300,
      },
      1: {
        background: palettes.neutral.c800,
        display: palettes.neutral.c400,
        error: palettes.error.c300,
        primary: palettes.neutral.c100,
        secondary: palettes.neutral.c300,
        success: palettes.success.c300,
        warning: palettes.warning.c300,
      },
      2: {
        background: palettes.highlight.c900,
        display: palettes.highlight.c400,
        error: palettes.error.c300,
        primary: palettes.highlight.c100,
        secondary: palettes.highlight.c300,
        success: palettes.success.c300,
        warning: palettes.warning.c300,
      },
      3: {
        background: palettes.highlight.c500,
        display: palettes.highlight.c900,
        error: palettes.error.c900,
        primary: palettes.highlight.c900,
        secondary: palettes.highlight.c800,
        success: palettes.success.c900,
        warning: palettes.warning.c900,
      },
    },
    light: {
      0: {
        background: palettes.neutral.c200,
        display: palettes.neutral.c600,
        error: palettes.error.c800,
        primary: palettes.neutral.c900,
        secondary: palettes.neutral.c700,
        success: palettes.success.c800,
        warning: palettes.warning.c800,
      },
      1: {
        background: palettes.neutral.c100,
        display: palettes.neutral.c600,
        error: palettes.error.c800,
        primary: palettes.neutral.c900,
        secondary: palettes.neutral.c700,
        success: palettes.success.c800,
        warning: palettes.warning.c800,
      },
      2: {
        background: palettes.highlight.c100,
        display: palettes.highlight.c600,
        error: palettes.error.c800,
        primary: palettes.highlight.c900,
        secondary: palettes.highlight.c700,
        success: palettes.success.c800,
        warning: palettes.warning.c800,
      },
      3: {
        background: palettes.highlight.c500,
        display: palettes.highlight.c100,
        error: palettes.error.c100,
        primary: palettes.highlight.c100,
        secondary: palettes.highlight.c200,
        success: palettes.success.c100,
        warning: palettes.warning.c100,
      },
    },
    palettes,
  };
}
