import {expect, test} from '@playwright/test';
import {rgb} from 'gs-tools/export/color';

import {createPaletteSet} from '../palette/create-palette-set';
import {THEME_SET} from '../theme/theme-set';

import {getPenpotTokens} from './get-penpot-tokens';
import {PenpotColorToken, PenpotExportData, PenpotTokenTree} from './penpot';

const SHADE_KEYS = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
];

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

const SECTIONS = [
  'background',
  'primary',
  'secondary',
  'display',
  'error',
  'warning',
  'success',
];

test.describe('getPenpotTokens', () => {
  test('outputs valid palette set, theme set, and metadata', () => {
    const seed = rgb({b: 245, g: 158, r: 11});
    const palettes = createPaletteSet(seed);
    const data: PenpotExportData = getPenpotTokens(THEME_SET, palettes, 'main');

    const palette = data.palette;
    const whiteToken = palette['white'] as PenpotColorToken;
    expect(whiteToken.$type).toBe('color');
    expect(whiteToken.$value).toBe('#ffffff');

    const blackToken = palette['black'] as PenpotColorToken;
    expect(blackToken.$type).toBe('color');
    expect(blackToken.$value).toBe('#000000');

    for (const groupName of PALETTE_GROUPS) {
      const group = palette[groupName] as PenpotTokenTree;
      expect(group).toBeDefined();
      for (const shade of SHADE_KEYS) {
        const token = group[shade] as PenpotColorToken;
        expect(token).toBeDefined();
        expect(token.$type).toBe('color');
        expect(token.$value).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }

    const theme = data.theme;
    for (const themeName of THEME_NAMES) {
      const themeGroup = theme[themeName] as PenpotTokenTree;
      expect(themeGroup).toBeDefined();
      for (const section of SECTIONS) {
        const token = themeGroup[section] as PenpotColorToken;
        expect(token).toBeDefined();
        expect(token.$type).toBe('color');
        expect(token.$value).toMatch(/^\{palette\.[a-z0-9_.]+\}$/);
      }
    }

    expect(data.$metadata!.tokenSetOrder).toEqual(['palette', 'theme']);
    expect(data.$metadata!.activeSets).toEqual(['palette', 'theme']);
  });
});
