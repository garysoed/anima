import {format} from 'gs-tools/export/color';
import {LitElement, PropertyValues, TemplateResult, html, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';

import {Theme} from '../../../core/theme/theme';
import animaIconSvg from '../../assets/anima-icon.svg';

import styles from './theme-preview.scss';

/**
 * Autonomous single-theme preview card component.
 * Displays card background, Anima brand icon, primary text, secondary text,
 * success text, warning text, and error text.
 * Custom Element Tag: <an-theme-preview>
 */
@customElement('an-theme-preview')
export class ThemePreview extends LitElement {
  static override styles = styles;

  @property({type: String})
  label: string = '';
  @property({attribute: false})
  theme: null | Theme = null;

  override render(): TemplateResult | typeof nothing {
    if (!this.theme) {
      return nothing;
    }

    return html`
      <div class="card">
        <div class="header">
          <div class="brand-icon">${unsafeSVG(animaIconSvg)}</div>
          <h3 class="primary-text">${this.label || 'Primary text'}</h3>
        </div>
        <p class="secondary-text">Secondary text</p>
        <div class="status-group">
          <div class="status-line success-text">Success text</div>
          <div class="status-line warning-text">Warning text</div>
          <div class="status-line error-text">Error text</div>
        </div>
      </div>
    `;
  }
  override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    const theme = this.theme;
    if (theme) {
      this.style.setProperty('--an-preview-background', format(theme.background, 'hex'));
      this.style.setProperty('--an-preview-display', format(theme.display, 'hex'));
      this.style.setProperty('--an-preview-error', format(theme.error, 'hex'));
      this.style.setProperty('--an-preview-primary', format(theme.primary, 'hex'));
      this.style.setProperty('--an-preview-secondary', format(theme.secondary, 'hex'));
      this.style.setProperty('--an-preview-success', format(theme.success, 'hex'));
      this.style.setProperty('--an-preview-warning', format(theme.warning, 'hex'));
    }
  }
}
