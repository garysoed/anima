import {contrast} from 'gs-tools/export/color';
import {LitElement, PropertyValues, TemplateResult, html, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';

import {PaletteSet} from '../../../core/palette/palette-set';
import {
  PaletteColorKey,
  resolveThemeColor,
  Theme,
} from '../../../core/theme/theme';
import animaIconSvg from '../../assets/anima-icon.svg';

import styles from './theme-preview.scss';

/**
 * Autonomous single-theme preview card component.
 * Displays card background, Anima brand icon, primary text, secondary text,
 * success text, warning text, and error text with contrast ratios against background.
 * Custom Element Tag: <an-theme-preview>
 */
@customElement('an-theme-preview')
export class ThemePreview extends LitElement {
  static override styles = styles;

  @property({type: String})
  label: string = '';
  @property({attribute: false})
  palettes: PaletteSet | null = null;
  @property({attribute: false})
  theme: Theme | null = null;

  override render(): TemplateResult | typeof nothing {
    const theme = this.theme;
    if (!theme) {
      return nothing;
    }

    const displayRatio = this.getContrastRatio(theme.display);
    const primaryRatio = this.getContrastRatio(theme.primary);
    const secondaryRatio = this.getContrastRatio(theme.secondary);
    const successRatio = this.getContrastRatio(theme.success);
    const warningRatio = this.getContrastRatio(theme.warning);
    const errorRatio = this.getContrastRatio(theme.error);

    return html`
      <div class="card">
        <div class="header">
          <div class="brand-icon-container">
            <div class="brand-icon">${unsafeSVG(animaIconSvg)}</div>
            ${
              displayRatio
                ? html`<span class="icon-contrast">${displayRatio}</span>`
                : nothing
            }
          </div>
          <h3 class="primary-text">
            ${this.label}${primaryRatio ? ` ${primaryRatio}` : ''}
          </h3>
        </div>
        <p class="secondary-text">
          Secondary text${secondaryRatio ? ` ${secondaryRatio}` : ''}
        </p>
        <div class="status-group">
          <div class="status-line success-text">
            Success text${successRatio ? ` ${successRatio}` : ''}
          </div>
          <div class="status-line warning-text">
            Warning text${warningRatio ? ` ${warningRatio}` : ''}
          </div>
          <div class="status-line error-text">
            Error text${errorRatio ? ` ${errorRatio}` : ''}
          </div>
        </div>
      </div>
    `;
  }
  override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    const theme = this.theme;
    if (theme) {
      const themePrefix = `--an-main-${theme.mode}_${theme.type}`;
      this.style.setProperty(
        '--an-preview-background',
        `var(${themePrefix}-background)`,
      );
      this.style.setProperty(
        '--an-preview-display',
        `var(${themePrefix}-display)`,
      );
      this.style.setProperty('--an-preview-error', `var(${themePrefix}-error)`);
      this.style.setProperty(
        '--an-preview-primary',
        `var(${themePrefix}-primary)`,
      );
      this.style.setProperty(
        '--an-preview-secondary',
        `var(${themePrefix}-secondary)`,
      );
      this.style.setProperty(
        '--an-preview-success',
        `var(${themePrefix}-success)`,
      );
      this.style.setProperty(
        '--an-preview-warning',
        `var(${themePrefix}-warning)`,
      );
    }
  }

  private getContrastRatio(foregroundKey: PaletteColorKey): string {
    if (!this.palettes || !this.theme) {
      return '';
    }
    const bg = resolveThemeColor(this.palettes, this.theme.background);
    const fg = resolveThemeColor(this.palettes, foregroundKey);
    return `(${contrast(fg, bg).toFixed(2)})`;
  }
}
