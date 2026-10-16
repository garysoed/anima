import type {DesignTokens} from 'style-dictionary/types';

import {serializeTokens} from '../core/token/serialize-tokens';

export async function downloadTokens(
  tokens: DesignTokens,
  filename: string,
): Promise<void> {
  const json = await serializeTokens(tokens);
  const blob = new Blob([json], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
