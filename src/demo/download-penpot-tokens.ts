import {PenpotTokenTree} from '../core/penpot/penpot';

export function downloadPenpotTokens(
  tokenTree: PenpotTokenTree,
  filename: string,
): void {
  const json = JSON.stringify(tokenTree, null, 2);
  const blob = new Blob([json], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
