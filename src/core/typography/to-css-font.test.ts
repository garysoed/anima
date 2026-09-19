import {expect, test} from '@playwright/test';

import {toCssFont} from './to-css-font';
import {TypographyValue} from './types';

test.describe('toCssFont', () => {
  test('formats typography value into valid CSS font shorthand', () => {
    const value: TypographyValue = {
      fontFamily: 'Montserrat',
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: 1.4,
    };

    expect(toCssFont(value)).toBe('500 16px/1.4 Montserrat');
  });
});
