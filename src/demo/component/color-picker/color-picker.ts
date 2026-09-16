import {Signal, SignalWatcher} from '@lit-labs/signals';
import {Color, HslColor, convert, format, hsl, rgb} from 'gs-tools/export/color';
import {LitElement, TemplateResult, html} from 'lit';
import {customElement} from 'lit/decorators.js';

import styles from './color-picker.scss';

export type HslChannel = 'h' | 'l' | 's';

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
 * Autonomous HSL color picker component with slider and hex controls.
 * Custom Element Tag: <an-color-picker>
 */
@customElement('an-color-picker')
export class ColorPicker extends SignalWatcher(LitElement) {
  static override styles = styles;

  protected readonly hue: Signal.State<number> = new Signal.State(38);
  protected readonly lightness: Signal.State<number> = new Signal.State(0.5);
  protected readonly saturation: Signal.State<number> = new Signal.State(0.92);
  protected readonly hslColor: Signal.Computed<HslColor> = new Signal.Computed(
    () => {
      return hsl({
        h: this.hue.get(),
        l: this.lightness.get(),
        s: this.saturation.get(),
      });
    },
  );
  protected readonly hex: Signal.Computed<string> = new Signal.Computed(() => {
    return format(this.hslColor.get(), 'hex');
  });
  protected readonly rawHex: Signal.State<string> = new Signal.State('#f59e0b');
  protected readonly isHexValid: Signal.Computed<boolean> = new Signal.Computed(
    () => {
      return isValidHex(this.rawHex.get());
    },
  );

  override render(): TemplateResult {
    return html`
      <div class="container">
        <div class="channel-row">
          <span class="channel-label h">H</span>
          <input
            type="range"
            class="channel-slider"
            min="0"
            max="360"
            step="1"
            .value="${String(this.hue.get())}"
            @input="${(e: Event) => this.handleSliderInput('h', e)}"
            @change="${this.handleSliderChange}"
          />
          <input
            type="number"
            class="channel-input"
            min="0"
            max="360"
            step="1"
            .value="${String(this.hue.get())}"
            @input="${(e: Event) => this.handleNumericInput('h', e)}"
            @change="${this.handleNumericChange}"
          />
        </div>

        <div class="channel-row">
          <span class="channel-label s">S</span>
          <input
            type="range"
            class="channel-slider"
            min="0"
            max="1"
            step="0.01"
            .value="${String(this.saturation.get())}"
            @input="${(e: Event) => this.handleSliderInput('s', e)}"
            @change="${this.handleSliderChange}"
          />
          <input
            type="number"
            class="channel-input"
            min="0"
            max="1"
            step="0.01"
            .value="${String(this.saturation.get())}"
            @input="${(e: Event) => this.handleNumericInput('s', e)}"
            @change="${this.handleNumericChange}"
          />
        </div>

        <div class="channel-row">
          <span class="channel-label l">L</span>
          <input
            type="range"
            class="channel-slider"
            min="0"
            max="1"
            step="0.01"
            .value="${String(this.lightness.get())}"
            @input="${(e: Event) => this.handleSliderInput('l', e)}"
            @change="${this.handleSliderChange}"
          />
          <input
            type="number"
            class="channel-input"
            min="0"
            max="1"
            step="0.01"
            .value="${String(this.lightness.get())}"
            @input="${(e: Event) => this.handleNumericInput('l', e)}"
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
    return this.hslColor.get();
  }
  set value(color: Color) {
    const converted = convert(color, 'hsl');
    const clampedH = Math.max(
      0,
      Math.min(360, Math.round(converted.h ?? this.hue.get())),
    );
    const clampedS = Math.max(
      0,
      Math.min(1, Math.round(converted.s * 100) / 100),
    );
    const clampedL = Math.max(
      0,
      Math.min(1, Math.round(converted.l * 100) / 100),
    );
    this.hue.set(clampedH);
    this.saturation.set(clampedS);
    this.lightness.set(clampedL);
    this.rawHex.set(
      format(hsl({h: clampedH, l: clampedL, s: clampedS}), 'hex'),
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
        const parsed = convert(rgb(normalizeHex(val)), 'hsl');
        const clampedH = Math.max(
          0,
          Math.min(360, Math.round(parsed.h ?? this.hue.get())),
        );
        const clampedS = Math.max(
          0,
          Math.min(1, Math.round(parsed.s * 100) / 100),
        );
        const clampedL = Math.max(
          0,
          Math.min(1, Math.round(parsed.l * 100) / 100),
        );
        this.hue.set(clampedH);
        this.saturation.set(clampedS);
        this.lightness.set(clampedL);
        this.dispatchInputEvent();
      }
    }
  }
  protected handleNumericChange(): void {
    this.dispatchChangeEvent();
  }
  protected handleNumericInput(channel: HslChannel, event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      const parsedNumber = Number(target.value);
      if (!Number.isNaN(parsedNumber)) {
        const max = channel === 'h' ? 360 : 1;
        const val =
          channel === 'h'
            ? Math.max(0, Math.min(max, Math.round(parsedNumber)))
            : Math.max(0, Math.min(max, Math.round(parsedNumber * 100) / 100));
        this.setChannel(channel, val);
        this.rawHex.set(this.hex.get());
        this.dispatchInputEvent();
      }
    }
  }
  protected handleSliderChange(): void {
    this.dispatchChangeEvent();
  }
  protected handleSliderInput(channel: HslChannel, event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      const num = Number(target.value);
      const max = channel === 'h' ? 360 : 1;
      const val =
        channel === 'h'
          ? Math.max(0, Math.min(max, Math.round(num)))
          : Math.max(0, Math.min(max, Math.round(num * 100) / 100));
      this.setChannel(channel, val);
      this.rawHex.set(this.hex.get());
      this.dispatchInputEvent();
    }
  }

  private setChannel(channel: HslChannel, value: number): void {
    switch (channel) {
      case 'h':
        this.hue.set(value);
        break;
      case 's':
        this.saturation.set(value);
        break;
      case 'l':
        this.lightness.set(value);
        break;
    }
  }
}
