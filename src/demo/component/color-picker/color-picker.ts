import {Signal, SignalWatcher} from '@lit-labs/signals';
import {Color, RgbColor, convert, format, rgb} from 'gs-tools/export/color';
import {LitElement, TemplateResult, html} from 'lit';
import {customElement} from 'lit/decorators.js';

import styles from './color-picker.scss';

export type RgbChannel = 'b' | 'g' | 'r';

const HEX_REGEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function isValidHex(hex: string): boolean {
  return HEX_REGEX.test(hex.trim());
}

function normalizeHex(hex: string): string {
  const trimmed = hex.trim();
  const withHash = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  if (withHash.length === 4) {
    const r = withHash[1];
    const g = withHash[2];
    const b = withHash[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return withHash;
}

/**
 * Autonomous RGB color picker component with slider and hex controls.
 * Custom Element Tag: <an-color-picker>
 */
@customElement('an-color-picker')
export class ColorPicker extends SignalWatcher(LitElement) {
  static override styles = styles;

  protected readonly b: Signal.State<number> = new Signal.State(0);
  protected readonly g: Signal.State<number> = new Signal.State(0);
  protected readonly r: Signal.State<number> = new Signal.State(0);
  protected readonly rgbColor: Signal.Computed<RgbColor> = new Signal.Computed(
    () => {
      return rgb({
        b: this.b.get(),
        g: this.g.get(),
        r: this.r.get(),
      });
    },
  );
  protected readonly hex: Signal.Computed<string> = new Signal.Computed(() => {
    return format(this.rgbColor.get(), 'hex');
  });
  protected readonly rawHex: Signal.State<string> = new Signal.State('#000000');
  protected readonly isHexValid: Signal.Computed<boolean> = new Signal.Computed(
    () => {
      return isValidHex(this.rawHex.get());
    },
  );

  override render(): TemplateResult {
    return html`
      <div class="container">
        <div class="channel-row">
          <span class="channel-label r">R</span>
          <input
            type="range"
            class="channel-slider"
            min="0"
            max="255"
            .value="${String(this.r.get())}"
            @input="${(e: Event) => this.handleSliderInput('r', e)}"
            @change="${this.handleSliderChange}"
          />
          <input
            type="number"
            class="channel-input"
            min="0"
            max="255"
            .value="${String(this.r.get())}"
            @input="${(e: Event) => this.handleNumericInput('r', e)}"
            @change="${this.handleNumericChange}"
          />
        </div>

        <div class="channel-row">
          <span class="channel-label g">G</span>
          <input
            type="range"
            class="channel-slider"
            min="0"
            max="255"
            .value="${String(this.g.get())}"
            @input="${(e: Event) => this.handleSliderInput('g', e)}"
            @change="${this.handleSliderChange}"
          />
          <input
            type="number"
            class="channel-input"
            min="0"
            max="255"
            .value="${String(this.g.get())}"
            @input="${(e: Event) => this.handleNumericInput('g', e)}"
            @change="${this.handleNumericChange}"
          />
        </div>

        <div class="channel-row">
          <span class="channel-label b">B</span>
          <input
            type="range"
            class="channel-slider"
            min="0"
            max="255"
            .value="${String(this.b.get())}"
            @input="${(e: Event) => this.handleSliderInput('b', e)}"
            @change="${this.handleSliderChange}"
          />
          <input
            type="number"
            class="channel-input"
            min="0"
            max="255"
            .value="${String(this.b.get())}"
            @input="${(e: Event) => this.handleNumericInput('b', e)}"
            @change="${this.handleNumericChange}"
          />
        </div>

        <div class="hex-row">
          <span class="hex-label">Hex</span>
          <input
            type="text"
            class="hex-input ${this.isHexValid.get() ? '' : 'invalid'}"
            .value="${this.rawHex.get()}"
            @input="${this.handleHexInput}"
            @blur="${this.handleHexBlur}"
          />
        </div>

        <div class="swatch-row">
          <div
            class="preview-swatch"
            style="background-color: ${this.hex.get()};"
          ></div>
        </div>
      </div>
    `;
  }

  get value(): Color {
    return this.rgbColor.get();
  }
  set value(color: Color) {
    const converted = convert(color, 'rgb');
    const clampedR = Math.max(0, Math.min(255, Math.round(converted.r)));
    const clampedG = Math.max(0, Math.min(255, Math.round(converted.g)));
    const clampedB = Math.max(0, Math.min(255, Math.round(converted.b)));
    this.r.set(clampedR);
    this.g.set(clampedG);
    this.b.set(clampedB);
    this.rawHex.set(
      format(rgb({b: clampedB, g: clampedG, r: clampedR}), 'hex'),
    );
  }

  protected dispatchChangeEvent(): void {
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}));
  }
  protected dispatchInputEvent(): void {
    this.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
  }
  protected handleHexBlur(): void {
    if (this.isHexValid.get()) {
      this.rawHex.set(this.hex.get());
      this.dispatchChangeEvent();
    } else {
      this.rawHex.set(this.hex.get());
    }
  }
  protected handleHexInput(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      const val = target.value;
      this.rawHex.set(val);
      if (isValidHex(val)) {
        const parsed = rgb(normalizeHex(val));
        this.r.set(parsed.r);
        this.g.set(parsed.g);
        this.b.set(parsed.b);
        this.dispatchInputEvent();
      }
    }
  }
  protected handleNumericChange(): void {
    this.dispatchChangeEvent();
  }
  protected handleNumericInput(channel: RgbChannel, event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      const parsedNumber = Number(target.value);
      if (!Number.isNaN(parsedNumber)) {
        const val = Math.max(0, Math.min(255, Math.round(parsedNumber)));
        this.setChannel(channel, val);
        this.rawHex.set(this.hex.get());
        this.dispatchInputEvent();
      }
    }
  }
  protected handleSliderChange(): void {
    this.dispatchChangeEvent();
  }
  protected handleSliderInput(channel: RgbChannel, event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      const val = Math.max(0, Math.min(255, Number(target.value)));
      this.setChannel(channel, val);
      this.rawHex.set(this.hex.get());
      this.dispatchInputEvent();
    }
  }

  private setChannel(channel: RgbChannel, value: number): void {
    switch (channel) {
      case 'r':
        this.r.set(value);
        break;
      case 'g':
        this.g.set(value);
        break;
      case 'b':
        this.b.set(value);
        break;
    }
  }
}
