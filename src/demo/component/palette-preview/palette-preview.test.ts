import {expect, test} from '@playwright/test';
import {Color, oklch} from 'gs-tools/export/color';

import {createPalette} from '../../../palette/create-palette';
import {Palette} from '../../../palette/palette';

test.describe('<an-palette-preview>', () => {
  test('renders no DOM nodes when palette is null', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <an-palette-preview id="preview"></an-palette-preview>
        </body>
      </html>
    `);

    await page.addScriptTag({path: 'dist/demo/bundle.js'});

    const preview = page.locator('an-palette-preview');
    await expect(preview).toBeAttached();

    const childCount = await preview.evaluate(
      (el: HTMLElement) => el.shadowRoot!.children.length,
    );
    expect(childCount).toBe(0);

    const swatches = preview.locator('.swatch');
    await expect(swatches).toHaveCount(0);
  });

  test('renders 9 swatches with hex labels when palette is provided', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 20px;
              background-color: #ffffff;
            }
          </style>
        </head>
        <body>
          <an-palette-preview id="preview"></an-palette-preview>
        </body>
      </html>
    `);

    await page.addScriptTag({path: 'dist/demo/bundle.js'});

    const preview = page.locator('an-palette-preview');
    await expect(preview).toBeAttached();

    const seed: Color = oklch({c: 0.1438, h: 211, l: 0.81});
    const palette: Palette = createPalette(seed);

    await preview.evaluate((el: HTMLElement, pal: Palette) => {
      Reflect.set(el, 'palette', pal);
    }, palette);

    await expect(preview).toBeVisible();

    const swatches = preview.locator('.swatch');
    await expect(swatches).toHaveCount(9);

    const hexLabels = preview.locator('.hex-label');
    await expect(hexLabels).toHaveCount(9);

    await preview.screenshot({
      path: 'src/demo/component/palette-preview/goldens/palette-preview.png',
    });
  });
});
