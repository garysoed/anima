import {expect, test} from '@playwright/test';
import {format, rgb} from 'gs-tools/export/color';

import {createPalette} from '../palette/create-palette';

import {getSeedColour} from './get-seed-colour';
import {paletteSetToTokenTree} from './palette-set-to-token-tree';

test.describe('getSeedColour', () => {
  test('extracts seed colour from paletteSetToTokenTree output', () => {
    const seed = rgb('#3b82f6');
    const palettes = {
      black: rgb('#000000'),
      error: createPalette(rgb('#dc2626')),
      main: createPalette(seed),
      neutral: createPalette(rgb('#64748b')),
      other: new Map(),
      success: createPalette(rgb('#16a34a')),
      warning: createPalette(rgb('#ffbf00')),
      white: rgb('#ffffff'),
    };

    const tokenTree = paletteSetToTokenTree(palettes);
    const result = getSeedColour(tokenTree);

    expect(result).not.toBeNull();
    expect(format(result!, 'hex')).toBe(format(palettes.main.c500, 'hex'));
  });

  test('returns null when main palette is missing', () => {
    const result = getSeedColour({});
    expect(result).toBeNull();
  });

  test('returns null when 500 shade is missing', () => {
    const result = getSeedColour({main: {}});
    expect(result).toBeNull();
  });
});
