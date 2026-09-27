import {Signal, SignalWatcher} from '@lit-labs/signals';
import {contrast} from 'gs-tools/export/color';
import {html, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {SHADE_KEYS} from '../../../core/palette/palette';
import {PaletteSet} from '../../../core/palette/palette-set';
import {
  isShadeKey,
  PaletteColorKey,
  resolveThemeColor,
  Theme,
  ThemeMode,
  ThemeSection,
  ThemeType,
} from '../../../core/theme/theme';
import {getDefaultTheme} from '../../default-themes';

import styles from './theme-configs.scss';

const DEFAULT_MODE: ThemeMode = 'light';
const DEFAULT_TYPE: ThemeType = 0;

const SECTION_CONFIGS: ReadonlyArray<{
  readonly label: string;
  readonly section: ThemeSection;
}> = [
  {label: 'Background', section: 'background'},
  {label: 'Outline', section: 'outline'},
  {label: 'Primary', section: 'primary'},
  {label: 'Secondary', section: 'secondary'},
  {label: 'Display', section: 'display'},
  {label: 'Success', section: 'success'},
  {label: 'Warning', section: 'warning'},
  {label: 'Error', section: 'error'},
];

function getShadeLabel(key: PaletteColorKey): string {
  const dotIndex = key.indexOf('.');
  if (dotIndex >= 0) {
    return key.slice(dotIndex + 1);
  }
  return key;
}

function isPaletteColorKey(key: string | undefined): key is PaletteColorKey {
  if (key === 'white' || key === 'black') {
    return true;
  }
  if (!key) {
    return false;
  }
  const parts = key.split('.');
  if (parts.length !== 2) {
    return false;
  }
  return Boolean(parts[0]) && isShadeKey(parts[1]);
}

function getSectionOptions(
  section: ThemeSection,
  themeType: ThemeType,
): readonly PaletteColorKey[] {
  switch (section) {
    case 'background':
      if (themeType === 0 || themeType === 1) {
        const neutralKeys: PaletteColorKey[] = SHADE_KEYS.map(
          (k): PaletteColorKey => `neutral.${k}`,
        );
        return ['white', 'black', ...neutralKeys];
      }
      return SHADE_KEYS.map((k): PaletteColorKey => `main.${k}`);
    case 'display':
    case 'outline':
      return SHADE_KEYS.map((k): PaletteColorKey => `main.${k}`);
    case 'primary':
    case 'secondary': {
      const neutralKeys: PaletteColorKey[] = SHADE_KEYS.map(
        (k): PaletteColorKey => `neutral.${k}`,
      );
      return ['white', 'black', ...neutralKeys];
    }
    case 'error':
      return SHADE_KEYS.map((k): PaletteColorKey => `error.${k}`);
    case 'warning':
      return SHADE_KEYS.map((k): PaletteColorKey => `warning.${k}`);
    case 'success':
      return SHADE_KEYS.map((k): PaletteColorKey => `success.${k}`);
  }
}

/**
 * Interactive shade configuration panel for customizing a theme's sections.
 * Resolves default theme from mode and type, rendering dropdown color selects
 * for each section with calculated contrast ratios against background.
 * Custom Element Tag: <an-theme-configs>
 */
@customElement('an-theme-configs')
export class ThemeConfigs extends SignalWatcher(LitElement) {
  static override styles = styles;

  private readonly modeSignal = new Signal.State<ThemeMode>(DEFAULT_MODE);
  private readonly palettesSignal = new Signal.State<PaletteSet | null>(null);
  private readonly themeSignal = new Signal.State<Theme>(
    getDefaultTheme(DEFAULT_MODE, DEFAULT_TYPE),
  );
  private readonly typeSignal = new Signal.State<ThemeType>(DEFAULT_TYPE);

  override render(): TemplateResult {
    const currentTheme = this.theme;

    return html`
      <div class="configs-container">
        ${SECTION_CONFIGS.map(
          (config) => html`
            <label class="config-row">
              <span class="config-label">${config.label}</span>
              ${this.renderColorSelect(config.section, currentTheme)}
            </label>
          `,
        )}
      </div>
    `;
  }

  @property({type: String})
  get mode(): ThemeMode {
    return this.modeSignal.get();
  }
  set mode(value: ThemeMode) {
    this.modeSignal.set(value);
    this.themeSignal.set(getDefaultTheme(value, this.type));
  }
  @property({attribute: false})
  get palettes(): PaletteSet | null {
    return this.palettesSignal.get();
  }
  set palettes(value: PaletteSet | null) {
    this.palettesSignal.set(value);
  }
  get theme(): Theme {
    return this.themeSignal.get();
  }
  @property({type: Number})
  get type(): ThemeType {
    return this.typeSignal.get();
  }
  set type(value: ThemeType) {
    this.typeSignal.set(value);
    this.themeSignal.set(getDefaultTheme(this.mode, value));
  }

  private getOptionLabel(
    section: ThemeSection,
    key: PaletteColorKey,
  ): string {
    const shade = getShadeLabel(key);
    const palettes = this.palettes;
    if (section === 'background' || !palettes) {
      return shade;
    }
    const currentTheme = this.theme;
    const bg = resolveThemeColor(palettes, currentTheme.background);
    const fg = resolveThemeColor(palettes, key);
    const ratio = contrast(fg, bg).toFixed(2);
    return `${shade} (${ratio}:1)`;
  }
  private handleColorChange(section: ThemeSection, event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) {
      return;
    }
    const newColorKey = target.value;
    if (!isPaletteColorKey(newColorKey)) {
      return;
    }
    const updatedTheme: Theme = {
      ...this.theme,
      [section]: newColorKey,
    };
    this.themeSignal.set(updatedTheme);
    this.dispatchEvent(
      new CustomEvent('theme-change', {
        bubbles: true,
        composed: true,
        detail: {theme: updatedTheme},
      }),
    );
  }
  private renderColorSelect(
    section: ThemeSection,
    currentTheme: Theme,
  ): TemplateResult {
    const options = getSectionOptions(section, currentTheme.type);
    const currentValue = currentTheme[section];

    return html`
      <select
        class="color-select"
        data-section="${section}"
        aria-label="${section} colour"
        .value="${currentValue}"
        @change="${(event: Event) => this.handleColorChange(section, event)}"
      >
        ${options.map(
          (key) => html`
            <option value="${key}" ?selected="${key === currentValue}">
              ${this.getOptionLabel(section, key)}
            </option>
          `,
        )}
      </select>
    `;
  }
}
