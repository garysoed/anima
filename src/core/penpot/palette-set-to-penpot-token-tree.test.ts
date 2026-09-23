import {expect, test} from '@playwright/test';
import {format, rgb} from 'gs-tools/export/color';

import {createPaletteSet} from '../palette/create-palette-set';
import {createSeededPaletteSet} from '../palette/create-seeded-palette-set';

import {paletteSetToPenpotTokenTree} from './palette-set-to-penpot-token-tree';

test.describe('paletteSetToPenpotTokenTree', () => {
  const seed = rgb({b: 220, g: 38, r: 38});
  const seeded = createSeededPaletteSet(seed, 'main');
  const palettes = createPaletteSet(new Map([['main', seeded]]));
  const tree = paletteSetToPenpotTokenTree(palettes);

  test('converts global palettes and seeded palettes to penpot color tokens', () => {
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

    expect(tree['main_highlight']).toEqual(
      expect.objectContaining({
        '500': {
          $type: 'color',
          $value: format(seeded.highlight.c500, 'hex'),
        },
      }),
    );

    expect(tree['main_neutral']).toEqual(
      expect.objectContaining({
        '100': {
          $type: 'color',
          $value: format(seeded.neutral.c100, 'hex'),
        },
      }),
    );
  });
});
