import StyleDictionary from 'style-dictionary';
import type {DesignTokens} from 'style-dictionary/types';

export async function serializeTokens(tokens: DesignTokens): Promise<string> {
  const sd = new StyleDictionary({tokens}, {init: false});
  await sd.init();
  return JSON.stringify(sd.tokens, null, 2);
}
