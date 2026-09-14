import {Color, OklchColor, convert, oklch} from 'gs-tools/export/color';

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

function toLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function getRelativeLuminance(color: OklchColor): number {
  const rgbColor = convert(color, 'rgb');
  return (
    0.2126 * toLinear(rgbColor.r) +
    0.7152 * toLinear(rgbColor.g) +
    0.0722 * toLinear(rgbColor.b)
  );
}

function findLightnessForTargetY(
  targetY: number,
  h: number | undefined,
  c: number,
): number {
  let low = 0;
  let high = 1;
  while (high - low > PRECISION) {
    const mid = (low + high) / 2;
    const y = getRelativeLuminance(oklch({c, h, l: mid, space: 'oklch'}));
    if (y < targetY) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

/**
 * Samples the gamut boundary along the radial chroma axis in OKLCH starting from seedChroma,
 * ensuring the resulting color matches targetY (relative luminance).
 *
 * Starting from seedChroma:
 * - Solves for lightness L such that luminance(oklch(L, seedChroma, H)) === targetY.
 * - If (L, seedChroma, H) is inside the sRGB gamut, returns that chroma and lightness.
 * - If outside the sRGB gamut, samples radially inwards (decreasing C towards 0)
 *   via binary search, finding the boundary chroma and corresponding L at targetY.
 */
function sampleRadialGamutBoundary(
  targetY: number,
  h: number | undefined,
  seedChroma: number,
): {c: number; l: number} {
  const lInitial = findLightnessForTargetY(targetY, h, seedChroma);
  const initialColor: OklchColor = oklch({
    c: seedChroma,
    h,
    l: lInitial,
    space: 'oklch',
  });

  if (isInRgbGamut(initialColor)) {
    return {c: seedChroma, l: lInitial};
  }

  let low = 0;
  let high = seedChroma;
  let bestC = 0;
  let bestL = findLightnessForTargetY(targetY, h, 0);

  while (high - low > PRECISION) {
    const midC = (low + high) / 2;
    const midL = findLightnessForTargetY(targetY, h, midC);
    const midColor: OklchColor = oklch({
      c: midC,
      h,
      l: midL,
      space: 'oklch',
    });

    if (isInRgbGamut(midColor)) {
      bestC = midC;
      bestL = midL;
      low = midC;
    } else {
      high = midC;
    }
  }
  return {c: bestC, l: bestL};
}

function createShade(
  seedOklch: OklchColor,
  targetLightness: number,
  targetSpace: ColorSpace,
): Color {
  const targetY = Math.pow(targetLightness, 3);
  const {c, l} = sampleRadialGamutBoundary(targetY, seedOklch.h, seedOklch.c);
  const shadeOklch: OklchColor = oklch({
    c,
    h: seedOklch.h,
    l,
    space: 'oklch',
  });
  return convert(shadeOklch, targetSpace);
}

export function createPalette(seed: Color): Palette {
  const seedOklch = convert(seed, 'oklch');
  const targetSpace = seed.space;

  return {
    c100: createShade(seedOklch, 0.96, targetSpace),
    c200: createShade(seedOklch, 0.865, targetSpace),
    c300: createShade(seedOklch, 0.77, targetSpace),
    c400: createShade(seedOklch, 0.675, targetSpace),
    c500: createShade(seedOklch, 0.58, targetSpace),
    c600: createShade(seedOklch, 0.485, targetSpace),
    c700: createShade(seedOklch, 0.39, targetSpace),
    c800: createShade(seedOklch, 0.295, targetSpace),
    c900: createShade(seedOklch, 0.2, targetSpace),
  };
}
