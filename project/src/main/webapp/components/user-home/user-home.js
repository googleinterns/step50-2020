import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {MyDocsComponent} from './my-docs-component.js';
import {NavPanel} from './nav-panel.js';

export class UserHome extends LitElement {
  static get properties() {
    return {
      validForm: {type: Boolean},
      defaultFolderID: {type: Number},
      folders: {type: Array},
    };
  }

  constructor() {
    super();
    this.validForm = false;
    this.defaultFolderID = -1;
   // this.folders = [];
    this.folders = [{name: "New Folder", id: -1}, {name: "Another Folder", id: 0}];
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  changeDocsComponent(e) {
    const folder = e.target.value;
    const folderID = e.target.valueID;
    if (folderID === this.defaultFolderID) {
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
  
  createFolder(e) {
    const form = e.target;
    const input = form.querySelector('#name');
    const name = input.value;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/Folder", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("folderName=" + name);
    this.hideModal();
  }

  validateForm(e) {
    const input = e.target;
    this.validForm = input.value.length > 0;
  }

  getFolders() {
    fetch('/Folder').then((response) => response.json()).then((foldersData) => {
      this.folders = JSON.parse(JSON.stringify(foldersData));
    });
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
              <form id="new-folder-form" @submit="${(e) => this.createFolder(e)}">
                <input @change=${(e) => this.validateForm(e)}  id="name" type="name" placeholder="Write a new folder name..."/> 
                ${this.validForm ? 
                  html`
                    <input type="submit" value="Create" class="primary-blue-btn">
                  ` :
                  html`
                    <input type="submit" value="Create" class="primary-blue-btn disabled" disabled>
                  `
                }
              </form>
            </section>
          </div>
        </div>
        <div class="column is-one-quarter nav-panel">
          <nav-panel
            @change=${(e) => this.changeDocsComponent(e)}
            .folders=${this.folders}
          >
          </nav-panel>
        </div>
        <div class="column is-three-quarters">
          <my-docs-component></my-docs-component>
        </div>
        ${this.getFolders()}
      </div>      
    `;
  }
}
customElements.define('user-home', UserHome);
