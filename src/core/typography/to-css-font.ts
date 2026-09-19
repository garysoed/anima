import {TypographyValue} from './types';

export function toCssFont(value: TypographyValue): string {
  return `${value.fontWeight} ${value.fontSize}/${value.lineHeight} ${value.fontFamily}`;
}
