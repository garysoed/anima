import {
  Color,
  OklchColor,
  convert,
  oklch,
} from 'gs-tools/export/color';

import {Palette} from './palette';

type ColorSpace = Color['space'];

const GAMUT_EPSILON = 0.0001;
const PRECISION = 0.0001;

function isInRgbGamut(color: OklchColor): boolean {
  const rgbColor = convert(color, 'rgb');
  return (
    rgbColor.r >= -GAMUT_EPSILON &&
    rgbColor.r <= 255 + GAMUT_EPSILON &&
    rgbColor.g >= -GAMUT_EPSILON &&
    rgbColor.g <= 255 + GAMUT_EPSILON &&
    rgbColor.b >= -GAMUT_EPSILON &&
    rgbColor.b <= 255 + GAMUT_EPSILON
  );
}

/**
 * Samples the gamut boundary along the radial chroma axis in OKLCH starting from seedChroma.
 *
 * In OKLCH space (cylindrical coordinates), lightness L is the height axis,
 * hue H is the angular coordinate, and chroma C is the radial coordinate.
 *
 * Starting from seedChroma:
 * - If (l, seedChroma, h) is inside the sRGB gamut, returns seedChroma.
 * - If (l, seedChroma, h) is outside the sRGB gamut, samples radially inwards
 *   (decreasing C towards 0) via binary search to find the boundary chroma.
 */
function sampleRadialGamutBoundary(
  l: number,
  h: number | undefined,
  seedChroma: number,
): number {
  const initialColor: OklchColor = oklch({l, c: seedChroma, h, space: 'oklch'});

  if (isInRgbGamut(initialColor)) {
    return seedChroma;
  }

  let low = 0;
  let high = seedChroma;
  while (high - low > PRECISION) {
    const mid = (low + high) / 2;
    if (isInRgbGamut(oklch({l, c: mid, h, space: 'oklch'}))) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return low;
}

function createShade(
  seedOklch: OklchColor,
  lightness: number,
  targetSpace: ColorSpace,
): Color {
  const chroma = sampleRadialGamutBoundary(
    lightness,
    seedOklch.h,
    seedOklch.c,
  );
  const shadeOklch: OklchColor = oklch({
    l: lightness,
    c: chroma,
    h: seedOklch.h,
    space: 'oklch',
  });
  return convert(shadeOklch, targetSpace);
}

export function createPalette(seed: Color): Palette {
  const seedOklch = convert(seed, 'oklch');
  const targetSpace = seed.space;

  return {
    c100: createShade(seedOklch, 0.960, targetSpace),
    c200: createShade(seedOklch, 0.865, targetSpace),
    c300: createShade(seedOklch, 0.770, targetSpace),
    c400: createShade(seedOklch, 0.675, targetSpace),
    c500: createShade(seedOklch, 0.580, targetSpace),
    c600: createShade(seedOklch, 0.485, targetSpace),
    c700: createShade(seedOklch, 0.390, targetSpace),
    c800: createShade(seedOklch, 0.295, targetSpace),
    c900: createShade(seedOklch, 0.200, targetSpace),
  };
}
