import {expect, test} from '@playwright/test';
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

  test('renders dark mode when toggled', async ({page}) => {
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
    const darkButton = demo.locator('.mode-button').filter({hasText: 'Dark'});
    await darkButton.click();

    await demo.screenshot({
      path: 'src/demo/goldens/demo-dark.png',
    });
  });

  test('renders export penpot tokens button and triggers download', async ({
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
    const exportButton = demo.locator('.export-button');

    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('penpot-tokens.json');

    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
    }
    const content = Buffer.concat(chunks).toString('utf-8');
    const json = JSON.parse(content);
    expect(json.theme.body.medium.$value.fontFamily).toBe(
      'Atkinson Hyperlegible',
    );
    expect(json.theme.headline.large.$value.fontFamily).toBe('Montserrat');
  });

  test('updates typography tokens when font selector changes', async ({
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
    const select = demo.locator('#headline-large-font-select');
    await select.selectOption('Raleway');

    const headlineLargeFont = await demo.evaluate((el: HTMLElement) => {
      return el.style.getPropertyValue('--an-headline-large-font');
    });
    expect(headlineLargeFont).toContain('Raleway');
  });
});
