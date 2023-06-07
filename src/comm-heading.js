import { LitElement, css, html } from 'lit';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';

export class COMMHeading extends LitElement {
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
    tag: { type: String },
    tagStyle: { type: String },
  };

  constructor() {
    super();
    this.tag = 'h1';
    this.tagStyle = 'h1';
  }

  render() {
    return html`
      <div class=${this.tagStyle}>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('comm-heading', COMMHeading);
