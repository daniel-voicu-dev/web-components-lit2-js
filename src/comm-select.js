import { LitElement, css, html } from 'lit';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';

export class CustomSelect extends LitElement {
  static properties = {
    name: { type: String },
    placeholder: { type: String },
    id: { type: String },
    value: { type: String },
    required: { type: String },
    disabled: { type: String },
    _focused: { type: Boolean, state: true },
    _open: { type: Boolean, state: true },
    _error: { type: Boolean, state: true },
  };

  constructor() {
    super();
    // this.name = '';
    this.id = '';
    this.value = '';
    this.required = false;
    this.disabled = false;
    this._open = false;
    this.placeholder = '';
  }

  inputRef = createRef();
  noItemsRef = createRef();

  get _slottedChildren() {
    const slot = this.shadowRoot.querySelector('slot');
    return slot.assignedElements({ flatten: true });
  }

  handleSlotchange(e) {
    const childNodes = e.target.assignedNodes({ flatten: true });
    // ... do something with childNodes ...
    this.value = '';
  }

  handleOptionSelect(e) {
    const { value } = e.detail;
    this.value = value;
    const input = this.inputRef.value;
    input.value = value;
    this._open = false;
    this.dispatchEvent(new Event('change'));
  }

  _onFocusIn() {
    this._open = true;
    this.inputRef.value.value = '';
    this.noItemsRef.value.classList.add('hide');
  }

  _onFocusOut() {
    this._open = false;
  }

  _handleOpenedList({ detail }) {
    let { target } = detail;
    let selects = [...document.querySelectorAll('comm-select')].filter(
      (el) => el.name !== target.name
    );
    selects.forEach((el) => (el._open = false));
  }

  _handleGeneralClick(e) {
    let commSelects = e.composedPath().filter((el) => {
      return el.tagName !== undefined && el.closest('comm-select') !== null;
      //return el.tagName !== undefined && el.tagName.includes("comm-select")
    });
    // console.log(commSelects,e.composedPath());
    if (commSelects.length === 0) {
      [...document.querySelectorAll('comm-select')]
        .filter((n) => n !== commSelects[0])
        .forEach((el) => {
          if (el._open) {
            el._open = false;
            if (el.required && el.value === '') {
              el._error = true;
            }
          }
        });
    }
  }
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('listIsOpen', this._handleOpenedList);
    window.addEventListener('click', this._handleGeneralClick);
  }

  disconnectedCallback() {
    window.removeEventListener('listIsOpen', this._handleOpenedList);
    window.removeEventListener('click', this._handleGeneralClick);
    super.disconnectedCallback();
  }

  _onInput(e) {
    // console.log(e.target.value);
    //console.log(e.data === 'Escape');
    const childNodes = this.shadowRoot
      .querySelector('slot')
      .assignedNodes({ flatten: true })
      .filter((node) => node.nodeName === 'COMM-OPTION');
    // console.log(childNodes);
    const hideChildNodes = [...childNodes].filter(
      (o) => !o.label.toLowerCase().includes(e.target.value)
    );
    const showChildNodes = [...childNodes].filter((o) =>
      o.label.toLowerCase().includes(e.target.value)
    );
    // console.log({ hideChildNodes, showChildNodes, value: e.target.value });
    hideChildNodes.forEach((n) => n.classList.add('hide'));
    if (showChildNodes.length > 0) {
      this.noItemsRef.value.classList.add('hide');
      showChildNodes.forEach((n) => n.classList.remove('hide'));
      this._open = true;
    } else if (showChildNodes.length === 0) {
      this.noItemsRef.value.classList.remove('hide');
    }
  }

  _onKeyDown(e) {
    // console.log(e.key);
    if (e.key === 'Escape' || e.key === 'Tab') {
      e.stopImmediatePropagation();
      e.preventDefault();
      const slotNodes = this.shadowRoot
        .querySelector('slot')
        .assignedNodes({ flatten: true })
        .filter((node) => node.nodeName === 'COMM-OPTION');

      const selectedNodeValue =
        [...slotNodes].filter((node) => !node.classList.contains('hide'))?.[0]
          ?.value || '';

      const input = this.inputRef.value;
      if (selectedNodeValue !== '') {
        this.value = selectedNodeValue;
        input.value = selectedNodeValue;
        // console.log(this.value, selectedNodeValue, slotNodes);
        slotNodes.forEach((n) => n.classList.remove('hide'));
        this.dispatchEvent(new Event('change'));
      } else {
        input.value = this.value;
        slotNodes.forEach((n) => n.classList.remove('hide'));
      }
      this._open = false;
    }
  }

  render() {
    const styles = { display: this._open ? 'block' : 'none' };
    const classes = { opened: this._open, icon: true };
    return html`
    <div class="wrapper">
      <div class="filter-container">
        <input type="text" class="filter" @focusin=${this._onFocusIn} @input=${(
      e
    ) => this._onInput(e)} @keydown=${(e) => this._onKeyDown(e)} ${ref(
      this.inputRef
    )} placeholder=${this.placeholder} /> 
        <button class=${classMap(
          classes
        )} type="button"><svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg></button>
      </div>
      
      <div class="select" style=${styleMap(styles)} @optionSelected=${(e) =>
      this.handleOptionSelect(e)}>   
        <div class="slot-container">
          <slot @slotchange=${(e) => this.handleSlotchange(e)}></slot> 
          <p class="no-items hide" ${ref(this.noItemsRef)}>No items found</p>
        </div>
      </div>
      <input type="hidden" ?name=${this.name} .value=${
      this.value
    } tabindex="-1" aria-hidden="true"  />
    </div>
    `;
  }

  static get styles() {
    return css`
      :host{
        border: none; 
        display: block;
      }
      // ::slotted(comm-option:first-child) {
      //   background-color: lightgray;
      // }
      ::slotted(comm-option:hover) {
        background: lightgray;
      }
      ::slotted(comm-option.hide) {
        display: none;
      }
      .wrapper {
        width: 100%;
        display: grid;
        grid-template-columns: minmax(0,1fr);        
        
      }
      .filter-container {       
        box-sizing: border-box;
        display: grid;
        grid-template-columns: minmax(0,1fr) auto;
        grid-area: 1/1/2/2;    
        border: var(--comm-border-size, 1px) solid var(--comm-border-color, lightgray);   
      }
      .select {       
        grid-area: 2/1/3/2;   
        position: relative;    
        box-sizing: border-box;  
        z-index: 1;        
      }
      .select .slot-container {
        box-sizing: border-box;   
        position: absolute;
        left: 0;
        right: 0;
        width: 100%;
        top:0;
        border-inline: var(--comm-border-size, 1px) solid var(--comm-border-color, lightgray);
        border-bottom: var(--comm-border-size, 1px) solid var(--comm-border-color, lightgray);
        background: var(--comm-background-color, white);        
      }
      .filter {
        border: none;
        padding-block: 0;
        line-height: var(--comm-line-height, 40px);
        padding-inline: var(--comm-padding-inline, 8px);
        outline: none;
      }
      
      .icon {
        border: none;
        outline: none;
        display: inline-block;
        box-sizing: border-box; 
        background-color: transparent;
        padding: 0 4px;
        padding-inline: var(--comm-padding-inline, 8px);
        padding-block: 0px;
        display: flex;
        align-items: center;
      }
      .opened {
        transform: rotate(180deg)
      }
      .no-items {        
        display: block;
        box-sizing: border-box;
        padding-block: 0;
        padding-inline: var(--comm-padding-inline, 8px);
        line-height: calc( var(--comm-line-height, 40px) * 0.8);
        background-color: var(--comm-dropdown-background, white);
        -webkit-user-select: none;
        user-select: none;
        margin: 0;
        font-style: italic;
        color: lightgray;
      }
      .no-items.hide {
        display: none;
      }
    `;
  }
}

customElements.define('comm-select', CustomSelect);
