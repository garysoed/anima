import {Signal, SignalWatcher} from '@lit-labs/signals';
import {Color, format, rgb} from 'gs-tools/export/color';
import {LitElement, PropertyValues, TemplateResult, html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Palette} from '../core/palette/palette';
import {PaletteSet} from '../core/palette/palette-set';
import {createThemeSet} from '../core/theme/create-theme-set';
import {Theme, ThemeMode, ThemeType} from '../core/theme/theme';
import {ThemeSet} from '../core/theme/theme-set';

import {ColorPicker} from './component/color-picker/color-picker';
import './component/palette-preview/palette-preview';
import './component/theme-preview/theme-preview';
import styles from './demo.scss';

const MODES: readonly ThemeMode[] = ['light', 'dark'];
const TYPES: readonly ThemeType[] = [0, 1, 2, 3];
const SECTIONS: ReadonlyArray<keyof Theme> = [
  'background',
  'primary',
  'secondary',
  'display',
  'error',
  'warning',
  'success',
];
const SHADE_MAP: ReadonlyArray<[number, keyof Palette]> = [
  [100, 'c100'],
  [200, 'c200'],
  [300, 'c300'],
  [400, 'c400'],
  [500, 'c500'],
  [600, 'c600'],
  [700, 'c700'],
  [800, 'c800'],
  [900, 'c900'],
];
const PALETTE_CONFIGS: ReadonlyArray<[string, keyof PaletteSet]> = [
  ['main_highlight', 'highlight'],
  ['main_neutral', 'neutral'],
  ['error', 'error'],
  ['warning', 'warning'],
  ['success', 'success'],
];

/**
 * Root demo application coordinating the introduction, picker, preview, and theme tokens.
 * Custom Element Tag: <an-demo>
 */
@customElement('an-demo')
export class AnimaDemo extends SignalWatcher(LitElement) {
  static override styles = styles;

  protected readonly mode: Signal.State<ThemeMode> =
    new Signal.State<ThemeMode>('light');
  protected readonly seedColor: Signal.State<Color> = new Signal.State(
    rgb({b: 0, g: 0, r: 0}),
  );
  protected readonly themeSet: Signal.Computed<ThemeSet> = new Signal.Computed(
    () => {
      return createThemeSet(this.seedColor.get());
    },
  );
  protected watcher: null | Signal.subtle.Watcher = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.initWatcher();
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanupWatcher();
  }
  override render(): TemplateResult {
    return html`
      <div class="demo-container">
        <section class="doc-section" id="intro">
          <h1>Overview</h1>

          <p>
            Anima is a design system for UI components. This can be used in any
            situations: general UI components, games, board games, etc. Because
            of the wide variety of usages, Anima prescribes a very minimal set
            amount of rules, to make sure that the goals are met.
          </p>

          <p>Anima’s goals:</p>

          <ul>
            <li>
              Thematic UI: The UI should be able to reflect the themes very
              well, through the use of colours and repeated shapes
            </li>
            <li>
              Accessibility: Should fulfill accessible requirements,
              particularly contrast ratio and target size
            </li>
            <li>
              Flexible UI: Should be able to be used from a UI with minimal
              colours to one with a lot of colours
            </li>
          </ul>

          <h1>General</h1>

          <p>
            An app consists of several layers. For example, take an app with a
            text, displaying an overlay modal dialog with text and button. This
            app may have the following layers:
          </p>

          <ul>
            <li>Root</li>
            <li>
              Modal overlay
              <ul>
                <li>
                  Modal dialog
                  <ul>
                    <li>
                      Button
                      <ul>
                        <li>
                          Hover layer: this is used to show that the button is
                          being hovered
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>

          <p>
            Layers that contain texts are called surfaces. This is important
            because such layers can have any background colours.
          </p>

          <h2>Colours</h2>

          <p>
            Every surface has a theme attached to it. The theme determines the
            colours of background and foreground elements within the surface.
            These colours are defined by colours in palettes.
          </p>

          <p>
            Surfaces in an app do not have to have the same theme. Apps can mix
            and match the different themes throughout the app, though the
            designer should make sure that the variety of palettes used
            throughout the app are minimized.
          </p>

          <h3>Palettes</h3>

          <p>
            A theme is generated from a single seed colour, which is used to
            generate palettes. Every theme is created using these palettes:
          </p>

          <ul>
            <li>
              Highlight palette: Generated from the seed colour. This has the
              highest saturation.
            </li>
            <li>
              Neutral palette: Generated from the seed colour after decreasing
              its saturation.
            </li>
            <li>Error palette: Generated from red. Used for errors.</li>
            <li>Warning palette: Generated from amber. Used for warnings.</li>
            <li>Success palette: Generated from green. Used for success.</li>
          </ul>

          <p>A collection of the above palette is called a palette set</p>

          <p>To generate a palette:</p>

          <ol>
            <li>Start with a seed colour</li>
            <li>
              For every shade in the table below, with the hue and lightness set
              to the corresponding value, set the chroma to the safe chroma
              using the “Radial Gamut Boundary Sampling”
            </li>
          </ol>

          <table class="shades-table">
            <thead>
              <tr>
                <th>Shade</th>
                <th>Oklch L</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>100</td>
                <td>0.960</td>
              </tr>
              <tr>
                <td>200</td>
                <td>0.865</td>
              </tr>
              <tr>
                <td>300</td>
                <td>0.770</td>
              </tr>
              <tr>
                <td>400</td>
                <td>0.675</td>
              </tr>
              <tr>
                <td>500</td>
                <td>0.580</td>
              </tr>
              <tr>
                <td>600</td>
                <td>0.485</td>
              </tr>
              <tr>
                <td>700</td>
                <td>0.390</td>
              </tr>
              <tr>
                <td>800</td>
                <td>0.295</td>
              </tr>
              <tr>
                <td>900</td>
                <td>0.200</td>
              </tr>
            </tbody>
          </table>

          <p>
            To generate the Neutral palette, reduce the saturation of the base
            colour by 75% in HSL colour space.
          </p>

          <h3>Theme</h3>

          <p>Themes use the palette set to define the following colours:</p>

          <ul>
            <li>Background</li>
            <li>
              Primary: The primary foreground colour. This is usually used for
              texts.
            </li>
            <li>
              Secondary: The secondary foreground colour. This is usually used
              for secondary texts and is dimmer (i.e. lower contrast) than
              primary. The contrast ratio should at least be 4.5.
            </li>
            <li>
              Display: Foreground colour for icons and any non textual symbols.
              The contrast ratio should be at least 3.0
            </li>
          </ul>

          <h3>Theme set</h3>

          <p>A theme set consists of the following themes:</p>

          <ul>
            <li>Theme 0: Darker theme. Has a neutral shade for background</li>
            <li>Theme 1: Normal theme. Usually have a white background</li>
            <li>
              Theme 2: Highlight theme. Has a highlight shade for background
            </li>
            <li>
              Theme 3: Super highlight theme. This should be used sparingly and
              only to grab the attention of the user. This has a middle
              highlight shade for the background
            </li>
          </ul>

          <p>
            Each of the above themes have a light and dark versions. This can be
            used for light / dark mode of the app, though apps can mix and match
            this. For example, a light mode app can have a dark mode button.
          </p>

          <div class="generator-layout" id="generator">
            <h3>Colour generator</h3>
            <an-color-picker
              .value="${this.seedColor.get()}"
              @input="${this.handleColorPickerEvent}"
              @change="${this.handleColorPickerEvent}"
            ></an-color-picker>
            <an-palette-preview
              .palette="${this.themeSet.get().palettes.highlight}"
            ></an-palette-preview>
          </div>

          <h2>Typographies</h2>

          <p>
            Fonts are named after their functionalities, not their hierarchy;
            i.e.: title, not heading 1. Types of fonts:
          </p>

          <ul>
            <li>
              Display: Used for decorative displays. These tend to be short and
              don't need high legibility.
            </li>
            <li>Headline: Used to mark different sections in the app</li>
            <li>Title: Used for emphasizing some section of the text</li>
            <li>Body: Body text</li>
            <li>Label: Labels input fields and interactables</li>
          </ul>

          <p>
            Each type has 3 different sizes (large, medium, small) and a code
            variant
          </p>

          <p>Not all types have to be specified for a particular app.</p>

          <h2>Design tokens</h2>

          <p>
            Design tokens follow the hierarchy of the colours; palette / font
            tokens are referenced by theme tokens, which are referenced by
            component tokens, and in turn referenced by the components.
          </p>

          <ul>
            <li>
              Palette tokens: Highlight and neutral palettes are based on the
              name of the seed. The error, warning, and success do not. There
              are two parts:
              <ul>
                <li>
                  The palette type, which are as follows:
                  <ul>
                    <li><code>seed_highlight</code></li>
                    <li><code>seed_neutral</code></li>
                    <li><code>error</code></li>
                    <li><code>warning</code></li>
                    <li><code>success</code></li>
                  </ul>
                </li>
                <li>The shade. These are numbers from 100 to 900</li>
              </ul>
            </li>
            <li>
              Font tokens: There are three parts:
              <ul>
                <li>
                  The type:
                  <ul>
                    <li><code>display</code></li>
                    <li><code>headline</code></li>
                    <li><code>title</code></li>
                    <li><code>body</code></li>
                    <li><code>label</code></li>
                  </ul>
                </li>
                <li>
                  The size:
                  <ul>
                    <li><code>large</code></li>
                    <li><code>medium</code></li>
                    <li><code>small</code></li>
                  </ul>
                </li>
                <li>
                  The variant, if applicable:
                  <ul>
                    <li><code>code</code></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Color theme tokens: There are three parts:
              <ul>
                <li>The seed name</li>
                <li>
                  Whether the theme is light or dark, followed by the theme
                  type. For example, <code>light_2</code>
                </li>
                <li>
                  The section of the theme:
                  <ul>
                    <li><code>background</code></li>
                    <li><code>primary</code></li>
                    <li><code>secondary</code></li>
                    <li><code>display</code></li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              Component tokens: There are multiple parts:
              <ul>
                <li>
                  Component name: Apps may want to group similar components
                  together. For example, an
                  <code>interactive</code> component can serve as the base
                  component for other interactive components.
                </li>
                <li>
                  Part of the component: For example: background, label, etc
                </li>
                <li>
                  State of the component: For example: hover, focus, etc. Normal
                  state should be omitted
                </li>
                <li>Type of the token: color, font, etc</li>
              </ul>
            </li>
          </ul>
        </section>
      </div>
    `;
  }
  override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    this.style.setProperty('color-scheme', this.mode.get());
  }

  protected applyThemeTokens(): void {
    const themeSet = this.themeSet.get();
    const rootStyle = document.documentElement.style;

    for (const [prefix, paletteKey] of PALETTE_CONFIGS) {
      const palette = themeSet.palettes[paletteKey];
      for (const [shadeNum, shadeKey] of SHADE_MAP) {
        rootStyle.setProperty(
          `--an-${prefix}-${shadeNum}`,
          format(palette[shadeKey], 'hex'),
        );
      }
    }

    for (const mode of MODES) {
      const modeThemes = themeSet[mode];
      for (const type of TYPES) {
        const theme = modeThemes[type];
        for (const section of SECTIONS) {
          rootStyle.setProperty(
            `--an-main-${mode}_${type}-${section}`,
            format(theme[section], 'hex'),
          );
        }
      }
    }
  }
  protected cleanupWatcher(): void {
    if (this.watcher) {
      this.watcher.unwatch(this.themeSet);
      this.watcher = null;
    }
  }
  protected handleColorPickerEvent(event: Event): void {
    const target = event.target;
    if (target instanceof ColorPicker) {
      this.seedColor.set(target.value);
    }
  }
  protected initWatcher(): void {
    this.cleanupWatcher();
    let scheduled = false;
    this.watcher = new Signal.subtle.Watcher(() => {
      if (!scheduled) {
        scheduled = true;
        queueMicrotask(() => {
          scheduled = false;
          if (!this.isConnected || !this.watcher) {
            return;
          }
          for (const sub of this.watcher.getPending()) {
            sub.get();
          }
          this.watcher.watch();
          this.applyThemeTokens();
        });
      }
    });
    this.watcher.watch(this.themeSet);
    this.applyThemeTokens();
  }
}
