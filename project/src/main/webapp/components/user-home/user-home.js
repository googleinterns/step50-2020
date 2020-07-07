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

  changeDocsComponent(e) {
    const folder = e.target.value;
    if (folder == 'New Document') {
      this.showModal();
    }
  }

  showModal() {
    let modal = document.getElementById("new-folder-modal");
    modal.className = "modal is-active";
  }

  hideModal() {
    let modal = document.getElementById("new-folder-modal");
    modal.className = "modal";
  }

  render() {
    return html`  
      <div class="columns full-width full-height">
        <div class="modal" id="new-folder-modal">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">New Folder</p>
              <button class="delete" aria-label="close" @click="${this.hideModal}" />
            </header>
            <section class="modal-card-body">
              <form id="new-folder-form" @submit="${this.hideModal}">
                <input type="name" placeholder="Write a new folder name..."/> 
                <input type="submit" value="Create" class="primary-blue-btn">
              </form>
            </section>
          </div>
        </div>
        <div class="column is-one-quarter nav-panel">
          <nav-panel
            @change=${(e) => this.changeDocsComponent(e)}>
          </nav-panel>
        </div>
        <div class="column is-three-quarters">
          <my-docs-component></my-docs-component>
        </div>
      </div>      
    `;
  }
}
customElements.define('user-home', UserHome);
