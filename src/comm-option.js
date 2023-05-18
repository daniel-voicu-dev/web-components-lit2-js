import { LitElement, css, html } from 'lit';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';
import { ref, createRef } from 'lit/directives/ref.js';

export class CustomOption extends LitElement {
  static properties = {
    value: { type: String },
    label: { type: String },
  };

  constructor() {
    super();
    this.value = '';
    this.label = '';
  }

  _handleClick = (e) => {
    this.dispatchEvent(
      new CustomEvent('optionSelected', {
        bubbles: true,
        cancelable: true,
        detail: { value: this.value },
      })
    );
  };

  render() {
    return html`
    <div class="wrapper" @click=${this._handleClick}>
      <slot></slot>
    </div>
    `;
  }

  static get styles() {
    return css`
    :host {
      display: block;
      box-sizing: border-box;
      padding-block: 0;
      padding-inline: var(--comm-padding-inline, 8px);
      line-height: calc( var(--comm-line-height, 40px) * 0.8);
      background-color: var(--comm-dropdown-background, white);
      cursor: pointer;
    }
    :host:hover {
      background-color: gray;
    }
    `;
  }
}

customElements.define('comm-option', CustomOption);
