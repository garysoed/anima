import {toCssFont} from '../core/typography/to-css-font';
import {TypographySet} from '../core/typography/types';

function toKebabCase(name: string): string {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export function getTypographyTokensCssProperties(
  typographySet: TypographySet,
): Record<string, string> {
  const properties: Record<string, string> = {};

  for (const [key, value] of Object.entries(typographySet)) {
    if (value !== undefined) {
      properties[`--an-${toKebabCase(key)}-font`] = toCssFont(value);
    }
  }

  return properties;
}

export function applyTypographyTokens(
  element: HTMLElement,
  typographySet: TypographySet,
): void {
  const properties = getTypographyTokensCssProperties(typographySet);
  for (const [key, value] of Object.entries(properties)) {
    element.style.setProperty(key, value);
  }
}

declare global {
  interface Window {
    applyTypographyTokens?: typeof applyTypographyTokens;
  }
}

if (typeof window !== 'undefined') {
  window.applyTypographyTokens = applyTypographyTokens;
}
