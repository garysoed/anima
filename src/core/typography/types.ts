export interface TypographyValue {
  readonly fontFamily: string;
  readonly fontSize: string;
  readonly fontWeight: number | string;
  readonly letterSpacing?: number | string;
  readonly lineHeight: number | string;
  readonly textCase?: 'capitalize' | 'lowercase' | 'none' | 'uppercase';
  readonly textDecoration?: 'none' | 'strike-through' | 'underline';
}

export type TypographyType =
  'body' | 'display' | 'headline' | 'label' | 'title';

export const TYPOGRAPHY_TYPES: readonly TypographyType[] = [
  'body',
  'display',
  'headline',
  'label',
  'title',
];

export type TypographySize = 'large' | 'medium' | 'small';

export const TYPOGRAPHY_SIZES: readonly TypographySize[] = [
  'large',
  'medium',
  'small',
];

export interface TypographySet {
  readonly bodyLarge?: TypographyValue;
  readonly bodyLargeCode?: TypographyValue;
  readonly bodyMedium?: TypographyValue;
  readonly bodyMediumCode?: TypographyValue;
  readonly bodySmall?: TypographyValue;
  readonly bodySmallCode?: TypographyValue;
  readonly displayLarge?: TypographyValue;
  readonly displayLargeCode?: TypographyValue;
  readonly displayMedium?: TypographyValue;
  readonly displayMediumCode?: TypographyValue;
  readonly displaySmall?: TypographyValue;
  readonly displaySmallCode?: TypographyValue;
  readonly headlineLarge?: TypographyValue;
  readonly headlineLargeCode?: TypographyValue;
  readonly headlineMedium?: TypographyValue;
  readonly headlineMediumCode?: TypographyValue;
  readonly headlineSmall?: TypographyValue;
  readonly headlineSmallCode?: TypographyValue;
  readonly labelLarge?: TypographyValue;
  readonly labelLargeCode?: TypographyValue;
  readonly labelMedium?: TypographyValue;
  readonly labelMediumCode?: TypographyValue;
  readonly labelSmall?: TypographyValue;
  readonly labelSmallCode?: TypographyValue;
  readonly titleLarge?: TypographyValue;
  readonly titleLargeCode?: TypographyValue;
  readonly titleMedium?: TypographyValue;
  readonly titleMediumCode?: TypographyValue;
  readonly titleSmall?: TypographyValue;
  readonly titleSmallCode?: TypographyValue;
}
