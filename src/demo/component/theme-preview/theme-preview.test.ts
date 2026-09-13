import {expect, test} from '@playwright/test';
import {rgb} from 'gs-tools/export/color';

import {createThemeSet} from '../../../core/theme/create-theme-set';
import {Theme} from '../../../core/theme/theme';

test.describe('<an-theme-preview>', () => {
  test('renders no DOM nodes when theme is null', async ({page}) => {
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <an-theme-preview id="preview"></an-theme-preview>
        </body>
      </html>
    `);

    await page.addScriptTag({path: 'dist/demo/bundle.js'});

    const preview = page.locator('an-theme-preview');
    await expect(preview).toBeAttached();

    const childCount = await preview.evaluate(
      (el: HTMLElement) => el.shadowRoot!.children.length,
    );
    expect(childCount).toBe(0);
  });

  test('renders theme preview card and captures visual golden screenshot', async ({
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
              background-color: #f1f5f9;
            }
          </style>
        </head>
        <body>
          <an-theme-preview id="preview"></an-theme-preview>
        </body>
      </html>
    `);

    await page.addScriptTag({path: 'dist/demo/bundle.js'});

    const preview = page.locator('an-theme-preview');
    await expect(preview).toBeAttached();

    const themeSet = createThemeSet(rgb({b: 220, g: 38, r: 38}));
    const lightTheme0: Theme = themeSet.light[0];

    await preview.evaluate((el: HTMLElement, theme: Theme) => {
      Reflect.set(el, 'label', 'Light Theme 0');
      Reflect.set(el, 'theme', theme);
    }, lightTheme0);

    await expect(preview.locator('.card')).toBeVisible();

    await preview.screenshot({
      path: 'src/demo/component/theme-preview/goldens/theme-preview.png',
    });
  });
});
