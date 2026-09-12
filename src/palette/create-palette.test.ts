import {expect, test} from '@playwright/test';
import {Color, convert, format, oklch} from 'gs-tools/export/color';

import {createPalette} from './create-palette';
import {Palette} from './palette';

interface ShadeMeta {
  readonly expectedLightness: number;
  readonly key: keyof Palette;
}

const SHADES: readonly ShadeMeta[] = [
  {expectedLightness: 0.96, key: 'c100'},
  {expectedLightness: 0.865, key: 'c200'},
  {expectedLightness: 0.77, key: 'c300'},
  {expectedLightness: 0.675, key: 'c400'},
  {expectedLightness: 0.58, key: 'c500'},
  {expectedLightness: 0.485, key: 'c600'},
  {expectedLightness: 0.39, key: 'c700'},
  {expectedLightness: 0.295, key: 'c800'},
  {expectedLightness: 0.2, key: 'c900'},
];

test.describe('createPalette', () => {
  test('renders 9 boxes with colors and takes a screenshot', async ({page}) => {
    // In sRGB space, hue ~211 (cyan/teal) has the narrowest peak chroma boundary (~0.1438)
    const seed: Color = oklch({c: 0.1438, h: 211, l: 0.81, space: 'oklch'});
    const palette = createPalette(seed);

    for (const item of SHADES) {
      const shadeColor = palette[item.key];
      const shadeOklch = convert(shadeColor, 'oklch');
      const shadeRgb = convert(shadeColor, 'rgb');

      expect(shadeOklch.l).toBeCloseTo(item.expectedLightness, 2);
      expect(shadeRgb.r).toBeGreaterThanOrEqual(0);
      expect(shadeRgb.r).toBeLessThanOrEqual(255);
      expect(shadeRgb.g).toBeGreaterThanOrEqual(0);
      expect(shadeRgb.g).toBeLessThanOrEqual(255);
      expect(shadeRgb.b).toBeGreaterThanOrEqual(0);
      expect(shadeRgb.b).toBeLessThanOrEqual(255);
    }

    const boxesHtml = SHADES.map((item) => {
      const shadeColor = palette[item.key];
      const rgbStr = format(shadeColor, 'rgb');
      return `<div class="box" style="background-color: ${rgbStr};"></div>`;
    }).join('');

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 20px;
              background: #ffffff;
              display: flex;
              gap: 8px;
            }
            .box {
              width: 80px;
              height: 120px;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          ${boxesHtml}
        </body>
      </html>
    `);

    await page.screenshot({path: 'screenshots/palette-narrowest-chroma.png'});
  });
});
