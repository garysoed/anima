import {test} from '@playwright/test';
import {Color, oklch} from 'gs-tools/export/color';

import {ColorPicker} from './component/color-picker/color-picker';

test.describe('<an-demo>', () => {
  test('renders introduction, interactive generator, and UI showcase', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #ffffff;
            }
          </style>
        </head>
        <body>
          <an-demo id="demo"></an-demo>
        </body>
      </html>
    `);

    await page.addScriptTag({path: 'dist/demo/bundle.js'});

    const demo = page.locator('an-demo');
    await demo.screenshot({
      path: 'src/demo/goldens/demo.png',
    });
  });

  test('updates palette preview when color picker value changes', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #ffffff;
            }
          </style>
        </head>
        <body>
          <an-demo id="demo"></an-demo>
        </body>
      </html>
    `);

    await page.addScriptTag({path: 'dist/demo/bundle.js'});

    const demo = page.locator('an-demo');
    const picker = demo.locator('an-color-picker');
    const seed: Color = oklch({c: 0.1438, h: 211, l: 0.81});

    await picker.evaluate((el: HTMLElement, newColor: Color) => {
      const colorPicker = el as unknown as ColorPicker;
      colorPicker.value = newColor;
      colorPicker.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
    }, seed);

    await demo.screenshot({
      path: 'src/demo/goldens/demo-updated.png',
    });
  });
});
