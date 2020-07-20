import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {DropdownElement} from './dropdown-element.js';

export class ShareComponent extends LitElement {
  static get properties() {
    return {
      permissions: {type: Array},
      changeLabel: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.permissions = ["Editor", "Viewer"];
    this.changeLabel = true;
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  render() {
    return html`        
      <div>
        <dropdown-element 
          .options="${this.permissions}" 
          name="permissions"
          label="Class">
        </dropdown-element>
      </div>
    `;
  }
}
customElements.define('share-component', ShareComponent);
