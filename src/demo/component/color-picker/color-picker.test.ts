import {expect, test} from '@playwright/test';
import {Color, rgb} from 'gs-tools/export/color';

declare global {
  interface Window {
    changeEventCount: number;
    inputEventCount: number;
  }
}

test.describe('<an-color-picker>', () => {
  test('updates display when setting .value', async ({page}) => {
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
          <an-color-picker id="picker"></an-color-picker>
        </body>
      </html>
    `);

    await page.addScriptTag({path: 'dist/demo/bundle.js'});

    const picker = page.locator('an-color-picker');
    await expect(picker).toBeVisible();

    const testRgb: Color = rgb({b: 64, g: 128, r: 255});
    await picker.evaluate((el: HTMLElement, color: Color) => {
      Reflect.set(el, 'value', color);
    }, testRgb);

    await picker.screenshot({
      path: 'src/demo/component/color-picker/goldens/color-picker.png',
    });
  });

  test('dispatches input and change events when user interacts with sliders', async ({
    page,
  }) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <an-color-picker id="picker"></an-color-picker>
        </body>
      </html>
    `);

    await page.addScriptTag({path: 'dist/demo/bundle.js'});

    const picker = page.locator('an-color-picker');
    await expect(picker).toBeVisible();

    await page.evaluate(() => {
      window.inputEventCount = 0;
      window.changeEventCount = 0;
      const el = document.querySelector('an-color-picker')!;
      el.addEventListener('input', () => {
        window.inputEventCount += 1;
      });
      el.addEventListener('change', () => {
        window.changeEventCount += 1;
      });
    });

    const redSlider = picker
      .locator('.channel-row')
      .nth(0)
      .locator('.channel-slider');
    await redSlider.fill('150');

    const inputCount = await page.evaluate(() => window.inputEventCount);
    const changeCount = await page.evaluate(() => window.changeEventCount);

    expect(inputCount).toBeGreaterThan(0);
    expect(changeCount).toBeGreaterThan(0);

    const hexInput = picker.locator('.hex-input');
    await expect(hexInput).toHaveValue('#960000');
  });

  test('updates color on hex typing and validates on blur', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <an-color-picker id="picker"></an-color-picker>
        </body>
      </html>
    `);

    await page.addScriptTag({path: 'dist/demo/bundle.js'});

    const picker = page.locator('an-color-picker');
    await expect(picker).toBeVisible();

    const hexInput = picker.locator('.hex-input');
    const greenInput = picker
      .locator('.channel-row')
      .nth(1)
      .locator('.channel-input');

    // Type valid hex
    await hexInput.fill('#00ff00');
    await expect(greenInput).toHaveValue('255');

    // Type invalid hex
    await hexInput.fill('#xyz');
    await expect(hexInput).toHaveClass(/invalid/);

    // Blur should reset to valid hex
    await hexInput.blur();
    await expect(hexInput).not.toHaveClass(/invalid/);
    await expect(hexInput).toHaveValue('#00ff00');
  });
});
