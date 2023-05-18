import { LitElement, css, html } from 'lit';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class ProductSelector extends LitElement {
  // static get properties() {
  //   return {
  //     /**
  //      * Copy for the read the docs hint.
  //      */
  //     docsHint: { type: String },

  //     /**
  //      * The number of times the button has been clicked.
  //      */
  //     count: { type: Number },
  //   };
  // }
  static properties = {
    url: { type: String },
    results: { type: Array },
    _open: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this._open = false;
    this.url = '';
    this.count = 0;
    this.name = 'productselector';
    this.results = [];
  }

  render() {
    return html`
      <div class="wrapper ${this._open ? 'open' : ''}">
        <input type="text" placeholder="Select products" name=${
          this.name
        } @input=${(e) => this._onInput(e)} @blur=${this._onFocusOut} @focus=${
      this._onFocusIn
    } value="" />
        <div class="results">
        ${when(
          this.results.length > 0,
          () => html`
          ${map(
            this.results,
            (result) =>
              html`<div class="option" @click=${(e) =>
                this._alertOption(e)} data-product-id=${
                result.id
              } data-number=${result.id} data-name=${result.name}>${
                result.name
              }</div>`
          )}
        `,
          () => html`<span><small>Search to select a product...</small></span>`
        )}
        
        </div>
      </div> 
    `;
  }

  _alertOption(e) {
    const { productId, number, name } = e.currentTarget.dataset;
    this._open = false;
    const options = {
      detail: { productId, number, name },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent('commProductSelected', options));
  }

  async _onInput(e) {
    console.log({ e });
    const response = await fetch(`${this.url + e.target.value}`);
    const results = await response.json();
    this.results = results;
    // this._open = true;
  }
  _onFocusOut() {
    console.log('blur');
    // this._open = false;
  }
  _onFocusIn() {
    this._open = true;
  }

  static get styles() {
    return css`
      :host {
        // max-width: 1280px;
        // margin: 0 auto;
        // padding: 2rem;
        width: 100%;
        max-width: var(--comm-max-width, 30ch); 
        text-align: left;
        font-size: var(--comm-font-size, 1rem);
      }
      :host * {
        box-sizing: border-box;
      }
      .option {
        cursor: pointer;
        padding-block: var(--comm-padding-block, 0.2rem);
        padding-inline: var(--comm-padding-inline, 0.5rem);
      }
      .option:hover {
        background-color: var(--comm-bg-option-hover, #fafafa);
      }
      .wrapper {
        display: flex;
        border: var(--comm-border-width, 1px) solid var(--comm-border-color, black);
        border-radius: var(--comm-border-radius, 0.5rem);        
        flex-wrap: wrap;
        position: relative;
      }
      .wrapper.open {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom-width: 0; 
      }
      input {
        width: 100%; 
        display: flex;
        flex-wrap: wrap;
        font-size: inherit;
        line-height: var(--comm-line-height, 1.5);
        padding-block: var(--comm-padding-block, 0.2rem); 
        padding-inline: var(--comm-padding-inline, 0.5rem);
        border: none;
        background-color: var(--comm-bg-color);
        outline: none;

      }
      .results {
        background-color: var(--comm-bg-color);
        margin-top: calc(0 - var(--comm-border-width, 1px));
        border: var(--comm-border-width, 1px) solid var(--comm-border-color, black);        
        border-radius: var(--comm-border-radius, 0.5rem);
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-top-width: 0;
        display: none;
        position: absolute;
        left: calc(0px - var(--comm-border-width, 1px));
        right: calc(0px - var(--comm-border-width, 1px));
        top: 100%;       
       
      }
      .open .results {
        display: block;
      }
    `;
  }
}

window.customElements.define('comm-product-selector', ProductSelector);
