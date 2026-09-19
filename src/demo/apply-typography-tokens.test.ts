import {expect, test} from '@playwright/test';

import {TypographySet} from '../core/typography/types';

import {getTypographyTokensCssProperties} from './apply-typography-tokens';

test.describe('apply-typography-tokens', () => {
  const testTypographySet: TypographySet = {
    bodyMedium: {
      fontFamily: 'Roboto',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    bodyMediumCode: {
      fontFamily: 'JetBrains Mono',
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    displayMedium: {
      fontFamily: 'Montserrat',
      fontSize: '2.8125rem',
      fontWeight: 700,
      lineHeight: '3.25rem',
    },
    labelMedium: {
      fontFamily: 'Roboto',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.25rem',
    },
    titleMedium: {
      fontFamily: 'Montserrat',
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: '1.5rem',
    },
  };

  test.describe('getTypographyTokensCssProperties', () => {
    test('generates font and code-font css custom properties from typographySet', () => {
      const properties = getTypographyTokensCssProperties(testTypographySet);

      expect(properties).toEqual({
        '--an-body-medium-code-font': '400 0.875rem/1.4 JetBrains Mono',
        '--an-body-medium-font': '400 1rem/1.5 Roboto',
        '--an-display-medium-font': '700 2.8125rem/3.25rem Montserrat',
        '--an-label-medium-font': '500 0.875rem/1.25rem Roboto',
        '--an-title-medium-font': '500 1rem/1.5rem Montserrat',
      });
    });

    test('returns empty object when typographySet has no entries', () => {
      const properties = getTypographyTokensCssProperties({});
      expect(properties).toEqual({});
    });
  });

  test.describe('applyTypographyTokens', () => {
    test('applies typography tokens to real element and captures visual screenshot', async ({
      page,
    }) => {
      const fontUrl =
        'https://fonts.googleapis.com/css2?' +
        'family=Montserrat:wght@500;700&' +
        'family=Roboto:wght@400;500&' +
        'family=JetBrains+Mono:wght@400&' +
        'display=swap';

      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="${fontUrl}" rel="stylesheet">
            <style>
              body {
                margin: 0;
                padding: 24px;
                background-color: #ffffff;
                color: #0f172a;
              }
              #preview {
                display: flex;
                flex-direction: column;
                gap: 16px;
                padding: 16px;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
              }
              .display {
                font: var(--an-display-medium-font);
              }
              .title {
                font: var(--an-title-medium-font);
              }
              .body {
                font: var(--an-body-medium-font);
              }
              .code {
                font: var(--an-body-medium-code-font);
              }
              .label {
                font: var(--an-label-medium-font);
              }
            </style>
          </head>
          <body>
            <div id="preview">
              <div class="display">Display Medium</div>
              <div class="title">Title Medium</div>
              <div class="body">Body Medium text preview</div>
              <div class="code">const answer: number = 42;</div>
              <div class="label">Label Medium</div>
            </div>
          </body>
        </html>
      `);

      await page.addScriptTag({path: 'dist/demo/bundle.js'});

      const preview = page.locator('#preview');
      await preview.evaluate((el: HTMLElement, set: TypographySet) => {
        window.applyTypographyTokens!(el, set);
      }, testTypographySet);

      await preview.screenshot({
        path: 'src/demo/goldens/typography-preview.png',
      });
    });
  });
});
