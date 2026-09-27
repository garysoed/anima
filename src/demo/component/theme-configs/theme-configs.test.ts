import {expect, test} from '@playwright/test';
import {rgb} from 'gs-tools/export/color';

import {createNeutralPalette} from '../../../core/palette/create-neutral-palette';
import {createPalette} from '../../../core/palette/create-palette';
import {PaletteSet} from '../../../core/palette/palette-set';
import {Theme} from '../../../core/theme/theme';

test.describe('<an-theme-configs>', () => {
  test(
    'resolves default theme from mode and type, and dispatches theme-change on selection',
    async ({page}) => {
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
              an-theme-configs {
                width: 170px;
              }
            </style>
          </head>
          <body>
            <an-theme-configs id="configs"></an-theme-configs>
          </body>
        </html>
      `);

      await page.addScriptTag({path: 'dist/demo/bundle.js'});

      const configs = page.locator('an-theme-configs');
      const seed = rgb({b: 220, g: 38, r: 38});
      const palettes: PaletteSet = {
        black: rgb('#000000'),
        error: createPalette(rgb('#dc2626')),
        main: createPalette(seed),
        neutral: createNeutralPalette(seed),
        other: new Map(),
        success: createPalette(rgb('#16a34a')),
        warning: createPalette(rgb('#d97706')),
        white: rgb('#ffffff'),
      };

      await configs.evaluate(
        (el: HTMLElement, palettesParam: PaletteSet) => {
          Reflect.set(el, 'mode', 'light');
          Reflect.set(el, 'type', 0);
          Reflect.set(el, 'palettes', palettesParam);
          Reflect.set(window, '__themeChangeFired', false);
          Reflect.set(window, '__updatedTheme', null);
          el.addEventListener('theme-change', (event: Event) => {
            const customEvent = Object(event);
            const detail: {readonly theme: Theme} = Object(customEvent.detail);
            Reflect.set(window, '__themeChangeFired', true);
            Reflect.set(window, '__updatedTheme', detail.theme);
          });
        },
        palettes,
      );

      const initialTheme: Theme = await configs.evaluate((el: HTMLElement) =>
        Object(Reflect.get(el, 'theme')),
      );
      expect(initialTheme.background).toBe('neutral.c100');
      expect(initialTheme.mode).toBe('light');
      expect(initialTheme.type).toBe(0);

      await configs.screenshot({
        path: 'src/demo/component/theme-configs/goldens/theme-configs.png',
      });

      const select = configs.locator('select[data-section="primary"]');
      await select.selectOption('white');

      await expect
        .poll(async () => {
          return configs.evaluate(() =>
            Reflect.get(window, '__themeChangeFired'),
          );
        })
        .toBe(true);

      const updatedTheme: Theme = await configs.evaluate(() =>
        Object(Reflect.get(window, '__updatedTheme')),
      );
      expect(updatedTheme.primary).toBe('white');
      expect(updatedTheme.background).toBe('neutral.c100');
      expect(updatedTheme.outline).toBe('main.c800');
    },
  );
});
