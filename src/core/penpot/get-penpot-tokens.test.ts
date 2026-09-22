import {expect, test} from '@playwright/test';
import {rgb} from 'gs-tools/export/color';

import {createPaletteSet} from '../palette/create-palette-set';
import {THEME_SET} from '../theme/theme-set';
import {TypographySet} from '../typography/types';

import {getPenpotTokens} from './get-penpot-tokens';
import {PenpotTokenTree} from './penpot';

const PALETTE_GROUPS = [
  'main_highlight',
  'main_neutral',
  'error',
  'warning',
  'success',
];

const THEME_NAMES = [
  'main-light_0',
  'main-light_1',
  'main-light_2',
  'main-light_3',
  'main-dark_0',
  'main-dark_1',
  'main-dark_2',
  'main-dark_3',
];

const TYPOGRAPHY_SET: TypographySet = {
  bodyMedium: {
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  bodyMediumCode: {
    fontFamily: 'JetBrains Mono',
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  displayMedium: {
    fontFamily: 'Montserrat',
    fontSize: '45px',
    fontWeight: 400,
    lineHeight: 1.2,
  },
};

test.describe('getPenpotTokens', () => {
  test('outputs valid palette set and theme set with typography tokens', () => {
    const seed = rgb({b: 245, g: 158, r: 11});
    const palettes = createPaletteSet(seed);
    const paletteTokens: PenpotTokenTree = getPenpotTokens(
      'palette',
      THEME_SET,
      palettes,
      TYPOGRAPHY_SET,
      'main',
    );

    expect(paletteTokens['white']).toEqual({
      $type: 'color',
      $value: '#ffffff',
    });

    expect(paletteTokens['black']).toEqual({
      $type: 'color',
      $value: '#000000',
    });

    for (const groupName of PALETTE_GROUPS) {
      expect(paletteTokens[groupName]).toEqual({
        100: {$type: 'color', $value: expect.stringMatching(/^#[0-9a-f]{6}$/i)},
        200: {$type: 'color', $value: expect.stringMatching(/^#[0-9a-f]{6}$/i)},
        300: {$type: 'color', $value: expect.stringMatching(/^#[0-9a-f]{6}$/i)},
        400: {$type: 'color', $value: expect.stringMatching(/^#[0-9a-f]{6}$/i)},
        500: {$type: 'color', $value: expect.stringMatching(/^#[0-9a-f]{6}$/i)},
        600: {$type: 'color', $value: expect.stringMatching(/^#[0-9a-f]{6}$/i)},
        700: {$type: 'color', $value: expect.stringMatching(/^#[0-9a-f]{6}$/i)},
        800: {$type: 'color', $value: expect.stringMatching(/^#[0-9a-f]{6}$/i)},
        900: {$type: 'color', $value: expect.stringMatching(/^#[0-9a-f]{6}$/i)},
      });
    }

    const themeTokens: PenpotTokenTree = getPenpotTokens(
      'theme',
      THEME_SET,
      palettes,
      TYPOGRAPHY_SET,
      'main',
    );

    for (const themeName of THEME_NAMES) {
      expect(themeTokens[themeName]).toEqual({
        background: {
          $type: 'color',
          $value: expect.stringMatching(/^\{[a-z0-9_.]+\}$/),
        },
        display: {
          $type: 'color',
          $value: expect.stringMatching(/^\{[a-z0-9_.]+\}$/),
        },
        error: {
          $type: 'color',
          $value: expect.stringMatching(/^\{[a-z0-9_.]+\}$/),
        },
        primary: {
          $type: 'color',
          $value: expect.stringMatching(/^\{[a-z0-9_.]+\}$/),
        },
        secondary: {
          $type: 'color',
          $value: expect.stringMatching(/^\{[a-z0-9_.]+\}$/),
        },
        success: {
          $type: 'color',
          $value: expect.stringMatching(/^\{[a-z0-9_.]+\}$/),
        },
        warning: {
          $type: 'color',
          $value: expect.stringMatching(/^\{[a-z0-9_.]+\}$/),
        },
      });
    }

    expect(themeTokens['display']).toEqual({
      medium: {
        $type: 'typography',
        $value: {
          fontFamily: 'Montserrat',
          fontSize: '45px',
          fontWeight: 400,
          lineHeight: 1.2,
        },
      },
    });

    expect(themeTokens['body']).toEqual({
      medium: {
        $type: 'typography',
        $value: {
          fontFamily: 'Roboto',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: 1.5,
        },
        code: {
          $type: 'typography',
          $value: {
            fontFamily: 'JetBrains Mono',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: 1.5,
          },
        },
      },
    });
  });
});
