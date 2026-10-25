import {expect, test} from '@playwright/test';
import {Color, oklch} from 'gs-tools/export/color';

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

    await page.addScriptTag({path: 'dist/demo/bundle.js', type: 'module'});
    await page.evaluate(() => customElements.whenDefined('an-demo'));

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

    await page.addScriptTag({path: 'dist/demo/bundle.js', type: 'module'});
    await page.evaluate(() => customElements.whenDefined('an-demo'));

    const demo = page.locator('an-demo');
    const picker = demo.locator('an-color-picker');
    const seed: Color = oklch({c: 0.1438, h: 211, l: 0.81});

    await picker.evaluate((el: HTMLElement, newColor: Color) => {
      Reflect.set(el, 'value', newColor);
      el.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
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

    await page.addScriptTag({path: 'dist/demo/bundle.js', type: 'module'});
    await page.evaluate(() => customElements.whenDefined('an-demo'));

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

    await page.addScriptTag({path: 'dist/demo/bundle.js', type: 'module'});
    await page.evaluate(() => customElements.whenDefined('an-demo'));

    const demo = page.locator('an-demo');
    const exportButton = demo.locator('.export-button');

    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('base.json');

    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const content = Buffer.concat(chunks).toString('utf-8');
    const json = JSON.parse(content);
    expect(json['$metadata']['tokenSetOrder']).toEqual(['base']);
    expect(json['base']['body']['medium']['$value']['fontFamily']).toBe(
      'Atkinson Hyperlegible',
    );
    expect(json['base']['headline']['large']['$value']['fontFamily']).toBe(
      'Montserrat',
    );
    expect(json['base']['black']['$value']).toBe('#000000');
    expect(json['base']['black']['name']).toBe('black');
    expect(json['base']['body']['medium']['name']).toBe('body.medium');
    expect(json['base']['theme']['dark'][0]['background']['$value']).toBe(
      '{neutral.800}',
    );
    expect(json['base']['theme']['dark'][0]['background']['name']).toBe(
      'theme.dark.0.background',
    );
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

    await page.addScriptTag({path: 'dist/demo/bundle.js', type: 'module'});
    await page.evaluate(() => customElements.whenDefined('an-demo'));

    const demo = page.locator('an-demo');
    const select = demo.locator('#headline-large-font-select');
    await select.selectOption('Raleway');

    const headlineLargeFont = await demo.evaluate((el: HTMLElement) => {
      return el.style.getPropertyValue('--an-headline-large-font');
    });
    expect(headlineLargeFont).toContain('Raleway');
  });

  test(
    'surfaces background contrast warning icon on adjacent themes when ' +
      'contrast drops below 1.1',
    async ({page}) => {
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

      await page.addScriptTag({path: 'dist/demo/bundle.js', type: 'module'});
      await page.evaluate(() => customElements.whenDefined('an-demo'));

      const demo = page.locator('an-demo');
      const configsLight2 = demo.locator('#configs-light-2');
      const configsLight3 = demo.locator('#configs-light-3');

      const bgWarning2 = configsLight2.locator(
        'label.config-row:has(select[data-section="background"]) .contrast-icon',
      );
      const bgWarning3 = configsLight3.locator(
        'label.config-row:has(select[data-section="background"]) .contrast-icon',
      );

      await expect(bgWarning2).not.toBeAttached();
      await expect(bgWarning3).not.toBeAttached();

      const selectBg3 = configsLight3.locator(
        'select[data-section="background"]',
      );
      await selectBg3.selectOption('main.c100');

      await expect(bgWarning2).toBeVisible();
      await expect(bgWarning3).toBeVisible();
    },
  );

  test(
    'synchronizes display shade across all themes in the same mode when ' +
      'display selection changes',
    async ({page}) => {
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

      await page.addScriptTag({path: 'dist/demo/bundle.js', type: 'module'});
      await page.evaluate(() => customElements.whenDefined('an-demo'));

      const demo = page.locator('an-demo');
      const light0Display = demo
        .locator('#configs-light-0')
        .locator('select[data-section="display"]');
      const light1Display = demo
        .locator('#configs-light-1')
        .locator('select[data-section="display"]');
      const light2Display = demo
        .locator('#configs-light-2')
        .locator('select[data-section="display"]');
      const light3Display = demo
        .locator('#configs-light-3')
        .locator('select[data-section="display"]');
      const dark0Display = demo
        .locator('#configs-dark-0')
        .locator('select[data-section="display"]');

      await light0Display.selectOption('main.c700');

      await expect(light1Display).toHaveValue('main.c700');
      await expect(light2Display).toHaveValue('main.c700');
      await expect(light3Display).toHaveValue('main.c700');
      await expect(dark0Display).toHaveValue('main.c400');
    },
  );
});
