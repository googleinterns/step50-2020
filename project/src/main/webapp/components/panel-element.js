import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {DropdownElement} from './dropdown-element.js';

// Options must be a list of format [{name: x, id: y}, ...]
export class PanelElement extends DropdownElement {
  static get properties() {
    return {
      valueID: {type: Number},
    };
  }

  constructor() {
    super();
    this.changeLabel = false;
    this.hideIcon = 'fa fa-angle-right';
    this.hideOnSelect = false;
  }

  toggleValue(item) {
    this.value = item.name;
    this.valueID = item.id;
    if (this.hideOnSelect) {
      this.toggleDropdown();
    }
    this.createChangeEvent();
  }

  createDropdownList() {
    return this.options.map((option) => 
      html`
        <a href="#" 
          @click=${() => this.toggleValue(option)} 
          class="dropdown-item"> 
          ${option.name} 
        </a>
      `)
  }
}
customElements.define('panel-element', PanelElement);
