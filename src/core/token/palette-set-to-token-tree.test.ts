import {expect, test} from '@playwright/test';
import {rgb} from 'gs-tools/export/color';

import {createNeutralPalette} from '../palette/create-neutral-palette';
import {createPalette} from '../palette/create-palette';
import {PaletteSet} from '../palette/palette-set';

import {paletteSetToTokenTree} from './palette-set-to-token-tree';

test.describe('paletteSetToTokenTree', () => {
  test('converts global palettes, main/neutral palettes, and other palettes to color tokens', () => {
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

    expect(tree['black']).toEqual({$type: 'color', $value: '#000000'});
    expect(tree['white']).toEqual({$type: 'color', $value: '#ffffff'});

    expect(tree['error']).toEqual(
      expect.objectContaining({
        '500': {
          $type: 'color',
          $value: '#e63330',
        },
      }),
    );

    expect(tree['main']).toEqual(
      expect.objectContaining({
        '50': {
          $type: 'color',
          $value: '#f6f8ff',
        },
        '500': {
          $type: 'color',
          $value: '#4c6cff',
        },
        '950': {
          $type: 'color',
          $value: '#03003b',
        },
      }),
    );

    expect(tree['neutral']).toEqual(
      expect.objectContaining({
        '50': {
          $type: 'color',
          $value: '#f8f8ff',
        },
        '100': {
          $type: 'color',
          $value: '#f0f1ff',
        },
        '950': {
          $type: 'color',
          $value: '#0b0a13',
        },
      }),
    );

    expect(tree['accent']).toEqual(
      expect.objectContaining({
        '50': {
          $type: 'color',
          $value: '#f5f9ff',
        },
        '500': {
          $type: 'color',
          $value: '#2f76e9',
        },
        '950': {
          $type: 'color',
          $value: '#000925',
        },
      }),
    );
  });
});
