import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {MyDocsComponent} from './my-docs-component.js';
import {FolderComponent} from './folder-component.js';
import {NavPanel} from './nav-panel.js';

export class UserHome extends LitElement {
  static get properties() {
    return {
      validForm: {type: Boolean},
      defaultFolderID: {type: Number},
      folders: {type: Array},
      folders: {type: Array},
      showFolder: {type: String},
      showFolderID: {type: Number},
      moveDoc: {type: String},
      moveDocHash: {type: String},
      moveFolder: {type: String},
      moveFolderID: {type: Number},
    };
  }

  constructor() {
    super();
    this.validForm = false;
    this.defaultFolderID = -1;
    this.folders = [];
    this.showFolder = '';
    this.showFolderID = -1;
    this.moveDoc = '';
    this.moveDocHash = '';
    this.moveFolder = '';
    this.moveFolderID = -1;
  }

  firstUpdated() {
    this.getFolders();
  }

  getFolders() {
    fetch('/Folder').then((response) => response.json()).then((foldersData) => {
      this.defaultFolderID = foldersData.defaultFolderID;
      this.folders = JSON.parse(JSON.stringify(foldersData.folders));
    });
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  changeDocsComponent(e) {
    this.showFolder = e.target.value;
    this.showFolderID = e.target.valueID;
    this.requestUpdate(); 
  }

  showModal(id) {
    let modal = document.getElementById(id);
    modal.className = "modal is-active";
  }

  hideModal(id) {
    let modal = document.getElementById(id);
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
    this.hideModal("new-folder-modal");
  }

  validateForm(e) {
    const input = e.target;
    this.validForm = input.value.length > 0;
  }

  setMoveDoc(e) {
    const detail = e.detail;
    this.moveDoc = detail.name;
    this.moveDocHash = detail.hash;
    this.showModal("move-folder-modal");
  }

  setMoveFolder(folderName, folderID) {
    this.moveFolder = folderName;
    this.moveFolderID = folderID;
    console.log(this.moveFolder);
    console.log(this.moveFolderID);
  }

  moveFolder() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/MoveDocument", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("docHash=" + this.moveDocHash + "&folderID=" + this.moveFolderID);
    this.hideModal("move-folder-modal");
  }

  render() {
    return html`
      <div class="columns full-width full-height">
        <div class="modal" id="new-folder-modal">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">New Folder</p>
              <button class="delete" aria-label="close" @click="${() => this.hideModal("new-folder-modal")}" />
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
        <div class="modal" id="move-folder-modal">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Move ${this.moveDoc} to...</p>
              <button class="delete" aria-label="close" @click="${() => this.hideModal("move-folder-modal")}" />
            </header>
            <section class="modal-card-body">
              <form id="new-folder-form" @submit="${this.moveFolder}">
                <input class="white-input" value=${this.moveFolder} id="move-folder-name" readonly="readonly" />
                <div>
                  ${this.folders.map((folder) => html`
                      <a href="#" 
                        class="dropdown-item"
                        @click=${() => this.setMoveFolder(folder.name, folder.folderID)}
                      > 
                        ${folder.name} 
                      </a>
                    `)}
                </div>
                <input type="submit" class="primary-blue-btn">
              </form>
            </section>
          </div>
        </div>
        <div class="column is-one-quarter nav-panel">
          <nav-panel
            @toggle-folder=${(e) => this.changeDocsComponent(e)}
            @new-folder="${() => this.showModal("new-folder-modal")}"
            .folders=${this.folders}
            defaultFolderID=${this.defaultFolderID}
          >
          </nav-panel>
        </div>
        <div class="column is-three-quarters">
          ${(this.showFolderID !== this.defaultFolderID && this.showFolder.length > 0) ?
            html`
              <folder-component
                @move-folder=${(e) => this.moveFolderModal(e)}
                title=${this.showFolder}
                servlet=${'/Folder?folderID=' + this.showFolderID}
              >
              </folder-component>
            ` :
            html`
              <my-docs-component
                @move-folder=${(e) => this.setMoveDoc(e)}
              >
              </my-docs-component>
            `
          }
        </div>
      </div>      
    `;
  }
}
customElements.define('user-home', UserHome);
