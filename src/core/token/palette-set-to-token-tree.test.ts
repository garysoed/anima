import {expect, test} from '@playwright/test';
import {rgb} from 'gs-tools/export/color';

import {createNeutralPalette} from '../palette/create-neutral-palette';
import {createPalette} from '../palette/create-palette';
import {PaletteSet} from '../palette/palette-set';

import {paletteSetToTokenTree} from './palette-set-to-token-tree';

test.describe('paletteSetToTokenTree', () => {
  test('converts global, main/neutral, and other palettes to color tokens', () => {
    const seed = rgb({b: 220, g: 38, r: 38});
    const accentPalette = createPalette(rgb('#3b82f6'));
    const palettes: PaletteSet = {
      black: rgb('#000000'),
      error: createPalette(rgb('#dc2626')),
      main: createPalette(seed),
      neutral: createNeutralPalette(seed),
      other: new Map([['accent', accentPalette]]),
      success: createPalette(rgb('#16a34a')),
      warning: createPalette(rgb('#ffbf00')),
      white: rgb('#ffffff'),
    };
    const tree = paletteSetToTokenTree(palettes);

    expect(tree['black']).toEqual({
      $type: 'color',
      $value: '#000000',
      name: 'black',
    });
    expect(tree['white']).toEqual({
      $type: 'color',
      $value: '#ffffff',
      name: 'white',
    });

    expect(tree['error']).toEqual(
      expect.objectContaining({
        '500': {
          $type: 'color',
          $value: '#e63330',
          name: 'error.500',
        },
      }),
    );

    expect(tree['main']).toEqual(
      expect.objectContaining({
        '50': {
          $type: 'color',
          $value: '#f6f8ff',
          name: 'main.50',
        },
        '500': {
          $type: 'color',
          $value: '#4c6cff',
          name: 'main.500',
        },
        '950': {
          $type: 'color',
          $value: '#03003b',
          name: 'main.950',
        },
      }),
    );

    expect(tree['neutral']).toEqual(
      expect.objectContaining({
        '50': {
          $type: 'color',
          $value: '#f8f8ff',
          name: 'neutral.50',
        },
        '100': {
          $type: 'color',
          $value: '#f0f1ff',
          name: 'neutral.100',
        },
        '950': {
          $type: 'color',
          $value: '#0b0a13',
          name: 'neutral.950',
        },
      }),
    );

    expect(tree['accent']).toEqual(
      expect.objectContaining({
        '50': {
          $type: 'color',
          $value: '#f5f9ff',
          name: 'accent.50',
        },
        '500': {
          $type: 'color',
          $value: '#2f76e9',
          name: 'accent.500',
        },
        '950': {
          $type: 'color',
          $value: '#000925',
          name: 'accent.950',
        },
      }),
    );
  });
});
