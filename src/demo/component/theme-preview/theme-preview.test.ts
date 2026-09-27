import {expect, test} from '@playwright/test';
import {rgb} from 'gs-tools/export/color';

import {createNeutralPalette} from '../../../core/palette/create-neutral-palette';
import {createPalette} from '../../../core/palette/create-palette';
import {PaletteSet} from '../../../core/palette/palette-set';
import {Theme} from '../../../core/theme/theme';
import {ThemeSet} from '../../../core/theme/theme-set';
import {getThemeTokensCssProperties} from '../../apply-theme-tokens';

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
    const themeSet: ThemeSet = {
      dark: {
        0: {
          background: 'neutral.c800',
          display: 'main.c500',
          error: 'error.c300',
          mode: 'dark',
          outline: 'main.c200',
          primary: 'neutral.c100',
          secondary: 'neutral.c300',
          success: 'success.c300',
          type: 0,
          warning: 'warning.c300',
        },
        1: {
          background: 'black',
          display: 'main.c500',
          error: 'error.c400',
          mode: 'dark',
          outline: 'main.c200',
          primary: 'neutral.c100',
          secondary: 'neutral.c400',
          success: 'success.c400',
          type: 1,
          warning: 'warning.c400',
        },
        2: {
          background: 'main.c900',
          display: 'main.c500',
          error: 'error.c400',
          mode: 'dark',
          outline: 'main.c200',
          primary: 'neutral.c100',
          secondary: 'neutral.c400',
          success: 'success.c400',
          type: 2,
          warning: 'warning.c400',
        },
        3: {
          background: 'main.c700',
          display: 'main.c400',
          error: 'error.c200',
          mode: 'dark',
          outline: 'main.c200',
          primary: 'white',
          secondary: 'neutral.c200',
          success: 'success.c200',
          type: 3,
          warning: 'warning.c200',
        },
      },
      light: {
        0: {
          background: 'neutral.c100',
          display: 'main.c500',
          error: 'error.c600',
          mode: 'light',
          outline: 'main.c800',
          primary: 'neutral.c900',
          secondary: 'neutral.c700',
          success: 'success.c600',
          type: 0,
          warning: 'warning.c600',
        },
        1: {
          background: 'white',
          display: 'main.c500',
          error: 'error.c600',
          mode: 'light',
          outline: 'main.c800',
          primary: 'neutral.c900',
          secondary: 'neutral.c700',
          success: 'success.c600',
          type: 1,
          warning: 'warning.c600',
        },
        2: {
          background: 'main.c200',
          display: 'main.c600',
          error: 'error.c700',
          mode: 'light',
          outline: 'main.c800',
          primary: 'neutral.c900',
          secondary: 'neutral.c700',
          success: 'success.c700',
          type: 2,
          warning: 'warning.c700',
        },
        3: {
          background: 'main.c300',
          display: 'main.c600',
          error: 'error.c800',
          mode: 'light',
          outline: 'main.c800',
          primary: 'black',
          secondary: 'neutral.c800',
          success: 'success.c800',
          type: 3,
          warning: 'warning.c800',
        },
      },
    };
    const lightTheme0: Theme = themeSet.light[0];
    const cssVars = getThemeTokensCssProperties(themeSet, palettes, 'main');

    await page.evaluate((props: Record<string, string>) => {
      for (const [key, value] of Object.entries(props)) {
        document.documentElement.style.setProperty(key, value);
      }
    }, cssVars);

    await preview.evaluate(
      (
        el: HTMLElement,
        params: {
          theme: Theme;
        },
      ) => {
        Reflect.set(el, 'label', 'Light Theme 0');
        Reflect.set(el, 'theme', params.theme);
      },
      {
        theme: lightTheme0,
      },
    );

    await preview.screenshot({
      path: 'src/demo/component/theme-preview/goldens/theme-preview.png',
    });
  });
});
