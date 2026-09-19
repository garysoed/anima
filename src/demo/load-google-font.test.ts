import {expect, test} from '@playwright/test';

import {loadGoogleFont} from './load-google-font';

test.describe('loadGoogleFont', () => {
  test('loads font, applies it to text, and captures visual screenshot', async ({
    page,
  }) => {
    const fontFamily = 'Inter';

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 24px;
              background-color: #ffffff;
              color: #0f172a;
            }
            #font-preview {
              font-family: '${fontFamily}', serif;
              font-size: 32px;
              font-weight: 700;
              line-height: 1.3;
            }
          </style>
        </head>
        <body>
          <div id="font-preview">The quick brown fox jumps over the lazy dog</div>
        </body>
      </html>
    `);

    await page.evaluate(loadGoogleFont, fontFamily);
    await page.evaluate(loadGoogleFont, fontFamily);

    const links = page.locator(`link[data-font="${fontFamily}"]`);
    await expect(links).toHaveCount(1);

    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.load('700 32px Inter'));
    await page.evaluate(() => document.fonts.ready);

    const preview = page.locator('#font-preview');
    await preview.screenshot({
      path: 'src/demo/goldens/load-google-font.png',
    });
  });
});
