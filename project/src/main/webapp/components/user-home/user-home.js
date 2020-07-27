import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {NavPanel} from './nav-panel.js';
import {DocsComponent} from './docs-component.js';
import {getSubfolders} from '../utils.js';

export class UserHome extends LitElement {
  static get properties() {
    return {
      validForm: {type: Boolean},
      folders: {type: Object},
      showFolder: {type: String},
      showFolderID: {type: Number},
      moveDoc: {type: String},
      moveDocHash: {type: String},
      moveFolder: {type: String},
      moveFolderID: {type: Number},
      nickname: {type: String},
      email: {type: String},
      defaultFolderID: {type: Number},
    };
  }

  constructor() {
    super();
    this.validForm = false;
    this.folders = new Map();
    this.defaultFolderName = 'My Code Docs'
    this.showFolder = this.defaultFolderName;
    this.moveDoc = '';
    this.moveDocHash = '';
    this.moveFolder = '';
    this.nickname = '';
    this.email = '';
    this.languages = {'text/x-c++src':'C++', 'Go':'Go', 'Python':'Python', 'text/x-java':'Java', 'Javascript':'Javascript'};
  }

  firstUpdated() {
    this.getData();
  }

  getData() {
    fetch('/Folder').then((response) => response.json()).then((data) => {
      this.defaultFolderID = data.defaultFolderID;
      this.showFolderID = this.defaultFolderID;
      this.folders = JSON.parse(JSON.stringify(data.folders));
      this.folders = new Map(Object.entries(this.folders));
      this.nickname = data.userNickname;
      this.email = data.userEmail;
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
  
  createFolderRequest(e) {
    const form = e.target;
    const input = form.querySelector('#name');
    const name = input.value;
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/Folder", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("folderName=" + name + "&parentFolderID=" + this.showFolderID);
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
  }

  moveFolderRequest() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/MoveDocument", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("docHash=" + this.moveDocHash + "&folderID=" + this.moveFolderID);
    this.hideModal("move-folder-modal");
    this.getData();
  }

  createFolderModal() {
    return html`
    <div class="modal" id="new-folder-modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">New Folder</p>
          <button class="delete" aria-label="close" @click="${() => this.hideModal("new-folder-modal")}" />
        </header>
        <section class="modal-card-body">
          <form id="new-folder-form" @submit="${(e) => this.createFolderRequest(e)}">
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
    `
  }

  moveFolderModal() {
    return html`
      <div class="modal" id="move-folder-modal">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Move ${this.moveDoc}</p>
            <button class="delete" aria-label="close" @click="${() => this.hideModal("move-folder-modal")}" />
          </header>
          <section class="modal-card-body">
            <form id="move-folder-form" @submit="${this.moveFolderRequest}">
              <p>Select a folder from this list, and your document will 
              appear when you navigate to that folder.</p>
              <div class="move-folder-list">
                <a 
                  href="#" 
                  class="dropdown-item"
                  @click=${() => this.setMoveFolder(this.defaultFolderName, this.defaultFolderID)}
                >
                  ${this.defaultFolderName}
                </a>
                <ul class="indent">
                  ${this.showNestedFolders(this.defaultFolderID)}
                </ul>
              </div>
              <div>
                <input class="white-input" value=${this.moveFolder} id="move-folder-name" readonly="readonly" />
                <input type="submit" class="primary-blue-btn">
              </div>
            </form>
          </section>
        </div>
      </div>
    `
  }

  showNestedFolders(folderID) {
    const subfolders = getSubfolders(folderID, this.folders);
    return html`
      <ul class="indent">
        ${subfolders.map((folder) =>
          html`
            <a 
              href="#" 
              class="dropdown-item"
              @click=${() => this.setMoveFolder(folder.name, folder.folderID)}
            >
              ${folder.name}
            </a>
            ${this.showNestedFolders(folder.folderID)}
          `
        )}
      </ul>
    `
  }

  render() {
    if (this.defaultFolderID !== undefined) {
      const navFolders = getSubfolders(this.defaultFolderID, this.folders);
      const showSubfolders = getSubfolders(this.showFolderID, this.folders);
      const showDocuments = this.folders.get(JSON.stringify(this.showFolderID)).docs;
      return html`
        <div class="columns full-width full-height">
          ${this.createFolderModal()}
          ${this.moveFolderModal()}
          <div class="column is-one-quarter nav-panel">  
            <nav-panel
              @toggle-folder=${(e) => this.changeDocsComponent(e)}
              @new-folder="${() => this.showModal("new-folder-modal")}"
              .folders=${navFolders}
              .languages=${Object.values(this.languages)}
              defaultFolderID=${this.defaultFolderID}
              value=${this.showFolder}
              valueID=${this.showFolderID}
            >
            </nav-panel>
          </div>
          <div class="column is-three-quarters">
            <docs-component
              @move-folder=${(e) => this.setMoveDoc(e)}
              @toggle-folder=${(e) => this.changeDocsComponent(e)}
              .documents="${showDocuments}"
              .languages=${this.languages}
              .subfolders="${showSubfolders}"
              nickname=${this.nickname}
              email=${this.email}
              title=${this.showFolder}
              folderID=${this.showFolderID}
              defaultFolderID=${this.defaultFolderID}
            >
            </docs-component>
          </div>
        </div>      
      `;
    }
  }
}
customElements.define('user-home', UserHome);
