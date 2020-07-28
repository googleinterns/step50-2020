import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {DropdownElement} from '../dropdown-element.js';

export class ThemesComponent extends LitElement {
  static get properties() {
    return {
      themes: {type: Array},
      changeLabel: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.themes = ["neo", "monokai", "ayu-dark"];
    this.changeLabel = false;
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  render() {
    return html`        
      <div>
        <dropdown-element 
          .options="${this.themes}" 
          name="theme_change"
          label="Themes">
        </dropdown-element>
      </div>
    `;
  }
}
customElements.define('themes-component', ThemesComponent);
