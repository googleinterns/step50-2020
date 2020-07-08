import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

/* Modifiable attributes
 * .options - options in the dropdown
 * name - name referencing dropdown in GET requests
 * label - initial label at the top of the dropdown
 * changeLabel - whether to change the top label based on selection
 * styling - css classes to apply to all elements in the dropdown.
 * otherwise let the dropdown inherit styling via css.
 *
 * Usage
 * const dropdown = document.querySelector('dropdown-element');
 * const value = dropdown.value;
 * all attributes under the properties() getter can also be 
 * access as dropdown.[attribute-name]
 */
export class DropdownElement extends LitElement {
  static get properties() {
    return {
      options: {type: Array},
      name: {type: String},
      label: {type: String},
      value: {type: String},
      changeLabel: {type: Boolean},
      hideOnSelect: {type: Boolean},
      showDropdown: {type: String},
      styling: {type: String},
    };
  }

  constructor() {
    super();
    this.options = [];
    this.name = '';
    this.label = '';
    this.value = '';
    this.changeLabel = true;
    this.hideOnSelect = true;
    this.showDropdown = false;
    this.styling = '';
    this.hideIcon = 'fa fa-angle-down';
    this.showIcon = 'fa fa-angle-down';
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleValue(item) {
    this.value = item;
    if (this.hideOnSelect) {
      this.toggleDropdown();
    }
    this.createChangeEvent();
  }

  createChangeEvent() {
    let event = new Event('change');
    this.dispatchEvent(event);
  }

  createDropdownList() {
    return this.options.map((option) => 
      html`
        <a href="#" 
          @click=${() => this.toggleValue(option)} 
          class="dropdown-item"> 
          ${option} 
        </a>
      `)
  }
  
  render() {
    let dropdownState = this.showDropdown ? 'is-active' : '';
    let dropdownLabel = 
      (this.changeLabel && this.value != '') ? this.value : this.label;
    return html`        
      <div>
        <!-- Add hidden input to transmit GET request data -->
        <input name=${this.name} id=${this.name} type="hidden" value=${this.value}>
        <div class=${'dropdown ' + dropdownState + ' ' + this.styling}>
          <div class=${'dropdown-trigger ' + this.styling}>
            <button type="button" class=${this.styling} @click=${this.toggleDropdown} 
              aria-haspopup="true" aria-controls="dropdown-menu">
              <span>${dropdownLabel}</span>
              <span class="icon is-small">
                <i class=${this.showDropdown ? this.showIcon : this.hideIcon} 
                  aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div class="${'dropdown-menu ' + this.styling}" 
            id="dropdown-menu" role="menu">
            <div class="dropdown-content">
              ${this.createDropdownList()}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('dropdown-element', DropdownElement);
