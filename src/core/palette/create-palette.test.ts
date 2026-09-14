import {expect, test} from '@playwright/test';
import {Color, convert, format, oklch, rgb} from 'gs-tools/export/color';

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

function toLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(rgbColor: {
  b: number;
  g: number;
  r: number;
}): number {
  return (
    0.2126 * toLinear(rgbColor.r) +
    0.7152 * toLinear(rgbColor.g) +
    0.0722 * toLinear(rgbColor.b)
  );
}

test.describe('createPalette', () => {
  test('renders 9 boxes with colors and takes a screenshot', async ({page}) => {
    // In sRGB space, hue ~211 (cyan/teal) has the narrowest peak chroma boundary (~0.1438)
    const seed: Color = oklch({c: 0.1438, h: 211, l: 0.81, space: 'oklch'});
    const palette = createPalette(seed);

    for (const item of SHADES) {
      const shadeColor = palette[item.key];
      const shadeRgb = convert(shadeColor, 'rgb');
      const expectedY = Math.pow(item.expectedLightness, 3);

      expect(getRelativeLuminance(shadeRgb)).toBeCloseTo(expectedY, 2);
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

    await page.screenshot({
      path: 'src/core/palette/goldens/palette-narrowest-chroma.png',
    });
  });

  test('produces matching contrast against background across different hues', () => {
    const redSeed = rgb({b: 38, g: 38, r: 220});
    const greenSeed = rgb({b: 74, g: 163, r: 22});
    const yellowSeed = rgb({b: 6, g: 119, r: 217});

    const redPalette = createPalette(redSeed);
    const greenPalette = createPalette(greenSeed);
    const yellowPalette = createPalette(yellowSeed);

    const red300 = convert(redPalette.c300, 'rgb');
    const green300 = convert(greenPalette.c300, 'rgb');
    const yellow700 = convert(yellowPalette.c700, 'rgb');

    const redLum = getRelativeLuminance(red300);
    const greenLum = getRelativeLuminance(green300);
    const yellowLum = getRelativeLuminance(yellow700);

    expect(redLum).toBeCloseTo(greenLum, 3);

    const redContrast = (redLum + 0.05) / (yellowLum + 0.05);
    const greenContrast = (greenLum + 0.05) / (yellowLum + 0.05);
    expect(redContrast).toBeCloseTo(greenContrast, 2);
  });
});
