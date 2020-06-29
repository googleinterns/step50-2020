import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

/* Modifiable attributes
 * .options - options in the dropdown
 * name - name referencing dropdown in GET requests
 * label - initial label at the top of the dropdown
 * changeLabel - whether to change the top label based on selection
 * styling - css classes to apply to all elements in the dropdown.
 * otherwise let the dropdown inherit styling via css. 
 */
export class DropdownElement extends LitElement {
  static get properties() {
    return {
      options: {type: Array},
      name: {type: String},
      label: {type: String},
      selectedItem: {type: String},
      changeLabel: {type: Boolean},
      showDropdown: {type: String},
      selectedItem: {type: String},
      styling: {type: String},
    };
  }

  constructor() {
    super();
    this.options = [];
    this.name = '';
    this.label = '';
    this.selectedItem = '';
    this.changeLabel = true;
    this.showDropdown = false;
    this.styling = '';
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleSelectedItem(item) {
    this.selectedItem = item;
  }

  render() {
    let dropdownState = this.showDropdown ? 'is-active' : '';
    let dropdownLabel = (this.changeLabel && this.selectedItem != '') ? this.selectedItem : this.label;
    return html`        
      <div>
        <!-- Add hidden input to transmit GET request data -->
        <input type="hidden" name=${this.name} value=${this.selectedItem}>
        <div class=${'dropdown ' + dropdownState + ' ' + this.styling}>
          <div class=${'dropdown-trigger ' + this.styling}>
            <button type="button" class=${this.styling} @click=${
          this.toggleDropdown} aria-haspopup="true" aria-controls="dropdown-menu">
              <span>${dropdownLabel}</span>
              <span class="icon is-small">
                <i class="fa fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div class="${'dropdown-menu ' + this.styling}" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
              ${this.options.map((option) => 
                html`
                  <a href="#" 
                    @click=${() => this.toggleSelectedItem(option)} 
                    class="dropdown-item"> 
                    ${option} 
                  </a>
                `)}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('dropdown-element', DropdownElement);
