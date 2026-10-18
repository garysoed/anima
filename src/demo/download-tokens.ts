import type {DeepKeyTokenMap} from '@tokens-studio/types';

import {serializeTokens} from '../core/token/serialize-tokens';

export async function downloadTokens(
  tokens: DeepKeyTokenMap,
  filename: string,
): Promise<void> {
  const setName = filename.replace(/\.json$/, '');
  const json = serializeTokens({[setName]: tokens}, [setName]);
  const blob = new Blob([json], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
