import {PaletteSet} from '../core/palette/palette-set';
import {getPenpotTokens} from '../core/penpot/get-penpot-tokens';
import {ThemeSet} from '../core/theme/theme-set';
import {TypographySet} from '../core/typography/types';

export function downloadPenpotTokens(
  themeSet: ThemeSet,
  palettes: PaletteSet,
  typographySet: TypographySet,
  seedName: string,
  filename: string,
): void {
  const json = JSON.stringify(
    getPenpotTokens(themeSet, palettes, typographySet, seedName),
    null,
    2,
  );
  const blob = new Blob([json], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
