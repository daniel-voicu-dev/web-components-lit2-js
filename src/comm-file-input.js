import { LitElement, css, html } from 'lit';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';
import { ref, createRef } from 'lit/directives/ref.js';
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */

export class FileInput extends LitElement {
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
    name: { type: String },
    id: { type: String },
    translate: { type: String },
    multiple: { type: Boolean },
    label: { type: String },
    value: { type: String, reflext: true },
    files: { type: Array, state: true },
    _open: { type: Boolean, state: true },
  };

  constructor() {
    super();
    this._open = false;
    this.results = [];
    this.label = 'Select files';
    this.translatesinglefile = 'file';
    this.translatemultiplefiles = 'files';
    this.name = '';
    this.id = 'file-input';
    this.value = '';
    this.files = [];
    this.multiple = false;
  }

  inputRef = createRef();

  render() {
    return html`
    ${when(
      this.multiple,
      () => html`
    <input ${ref(this.inputRef)}  id=${this.id} type="file" multiple @change=${(
        e
      ) => this._onChange(e)}></input>
    `,
      () => html`
    <input ${ref(this.inputRef)}  id=${this.id} type="file" @change=${(e) =>
        this._onChange(e)}></input>
    `
    )}
      <label for="${this.id}" class="element ${
      this._open ? 'open' : ''
    }" @click=${this._onClick}>
        <span class="file-upload-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 11V14H2V11H0V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V11H14ZM3 5L4.41 6.41L7 3.83V12H9V3.83L11.59 6.41L13 5L8 0L3 5Z" fill="currentColor"/>
          </svg>        
        </span>
        <div class="file-info">
        ${when(
          this.value !== '',
          () => html`
          <span>${this.value}</span>
        `,
          () =>
            when(
              this.files.length === 0,
              () => html`<span>${this.label}</span>`,
              () =>
                when(
                  this.files.length > 1,
                  () =>
                    html`<span>${this.files.length} ${this.translatemultiplefiles}</span>`,
                  () => html`<span>${this.value}</span>`
                )
            )
        )}         
        </div>
        ${when(
          this.value !== '' || this.files.length > 0,
          () => html`
        <span class="file-upload-clear" @click=${(e) => this._clearFiles(e)}>
          <svg width="12" height="21" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.9999 8.25V20.75H3.99988V8.25H13.9999ZM12.1249 0.75H5.87488L4.62488 2H0.249878V4.5H17.7499V2H13.3749L12.1249 0.75ZM16.4999 5.75H1.49988V20.75C1.49988 22.125 2.62488 23.25 3.99988 23.25H13.9999C15.3749 23.25 16.4999 22.125 16.4999 20.75V5.75Z" fill="currentColor"/>
</svg>
        </span>
        `,
          () => html``
        )}
        
        
      </label>     
    `;
  }

  _clearFiles(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    this.files = [];
    this.value = '';
  }

  _onChange(e) {
    this.files = [...e.currentTarget.files];
    if (e.currentTarget.files.length === 1) {
      this.value = e.currentTarget.files[0].name;
    } else {
      this.value = '';
    }
  }
  // _onClick() {
  //   const input = this.inputRef;
  //   input.click();
  //   console.log(this.inputRef.files);
  // }

  static get styles() {
    return css`
      :host {
       
      }
      :host * {
        box-sizing: border-box;
      }
      :host(:hover) {
        cursor: pointer;
      }
      :host(:hover) .element {
        background-color: var(--comm-hover-background, lightgray);
      }
      input[type="file"] {
        display: none;
      }
      .element {
        transition: all 0.1s ease-in;
        background-color: white;
        display: grid;
        grid-template-columns: calc(16px + var(--comm-padding-x, 14px)) minmax(0,1fr) auto;
        align-items: center;
        min-width: 20ch;
        border-radius: var(--comm-border-radius, 0px);
        border: var(--comm-border-width, 0px) solid var(--comm-border-color, black);
        height: var(--comm-line-height, 40px);
        padding-left: var(--comm-padding-x, 14px);      
      }
      .file-upload-icon {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
      }
      .file-upload-clear {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        padding-inline: var(--comm-padding-x, 14px);
      }
      .file-info {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        align-items: center;
        height: 100%;
      }
     
    `;
  }
}

window.customElements.define('comm-file-input', FileInput);
