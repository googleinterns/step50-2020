import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {MyDocsComponent} from './my-docs-component.js';
import {NavPanel} from './nav-panel.js';

export class UserHome extends LitElement {
  static get properties() {
    return {
    };
  }

  constructor() {
    super();
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  render() {
    return html`  
      <div class="columns full-width full-height">
        <div class="column is-one-quarter nav-panel">
          <nav-panel></nav-panel>
        </div>
        <div class="column is-three-quarters">
          <my-docs-component></my-docs-component>
        </div>
      </div>      
    `;
  }
}
customElements.define('user-home', UserHome);
