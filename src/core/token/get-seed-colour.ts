import type {DeepKeyTokenMap} from '@tokens-studio/types';
import {Color, rgb} from 'gs-tools/export/color';

import {isRecord} from '../../util/is-record';

export function getSeedColour(tokenTree: DeepKeyTokenMap): Color | null {
  const rawMain = tokenTree['main'];
  if (!isRecord(rawMain)) {
    return null;
  }
  const mainPalette: Record<string, unknown> = rawMain;

  const shade500 = mainPalette['500'];
  if (!isRecord(shade500)) {
    return null;
  }

  const value = shade500['$value'];
  if (typeof value !== 'string') {
    return null;
  }

  try {
    return rgb(value);
  } catch {
    return null;
  }
}
