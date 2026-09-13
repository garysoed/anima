import {Color, format} from 'gs-tools/export/color';
import {LitElement, TemplateResult, html, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {Palette} from '../../../palette/palette';

import styles from './palette-preview.scss';

const SHADE_KEYS: ReadonlyArray<keyof Palette> = [
  'c100',
  'c200',
  'c300',
  'c400',
  'c500',
  'c600',
  'c700',
  'c800',
  'c900',
];

/**
 * Component rendering the 9-shade swatch preview.
 * - Renders no DOM nodes when palette is null.
 * - Displays hex value below each swatch.
 * Custom Element Tag: <an-palette-preview>
 */
@customElement('an-palette-preview')
export class PalettePreview extends LitElement {
  static override styles = styles;

  @property({attribute: false})
  palette: null | Palette = null;

  override render(): TemplateResult | typeof nothing {
    const pal = this.palette;
    if (!pal) {
      return nothing;
    }

    return html`
      <div class="container">
        ${SHADE_KEYS.map((key) => {
          const color: Color = pal[key];
          const hex = format(color, 'hex');
          return html`
            <div class="swatch-item ${key}">
              <div class="swatch" style="background-color: ${hex};"></div>
              <span class="hex-label">${hex}</span>
            </div>
          `;
        })}
      </div>
    `;
  }
}
