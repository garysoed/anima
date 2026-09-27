import {expect, test} from '@playwright/test';
import {format, rgb} from 'gs-tools/export/color';

import {createNeutralPalette} from '../palette/create-neutral-palette';
import {createPalette} from '../palette/create-palette';
import {PaletteSet} from '../palette/palette-set';

import {paletteSetToPenpotTokenTree} from './palette-set-to-penpot-token-tree';

test.describe('paletteSetToPenpotTokenTree', () => {
  const seed = rgb({b: 220, g: 38, r: 38});
  const palettes: PaletteSet = {
    black: rgb('#000000'),
    error: createPalette(rgb('#dc2626')),
    main: createPalette(seed),
    neutral: createNeutralPalette(seed),
    other: new Map(),
    success: createPalette(rgb('#16a34a')),
    warning: createPalette(rgb('#d97706')),
    white: rgb('#ffffff'),
  };
  const tree = paletteSetToPenpotTokenTree(palettes);

  test('converts global palettes and main/neutral palettes to penpot color tokens', () => {
    expect(tree['black']).toEqual({$type: 'color', $value: '#000000'});
    expect(tree['white']).toEqual({$type: 'color', $value: '#ffffff'});

    expect(tree['error']).toEqual(
      expect.objectContaining({
        '500': {
          $type: 'color',
          $value: format(palettes.error.c500, 'hex'),
        },
      }),
    );

    expect(tree['main']).toEqual(
      expect.objectContaining({
        '500': {
          $type: 'color',
          $value: format(palettes.main.c500, 'hex'),
        },
      }),
    );

    expect(tree['neutral']).toEqual(
      expect.objectContaining({
        '100': {
          $type: 'color',
          $value: format(palettes.neutral.c100, 'hex'),
        },
      }),
    );
  });
});
