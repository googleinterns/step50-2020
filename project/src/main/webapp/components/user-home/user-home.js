import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {MyDocsComponent} from './my-docs-component.js';
import {FolderComponent} from './folder-component.js';
import {NavPanel} from './nav-panel.js';

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
    this.showFolder = 'My Code Docs';
    this.moveDoc = '';
    this.moveDocHash = '';
    this.moveFolder = '';
    this.nickname = '';
    this.email = '';
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

  /*getFolders() {
    fetch('/Folder').then((response) => response.json()).then((foldersData) => {
      this.defaultFolderID = foldersData.defaultFolderID;
      this.folders = JSON.parse(JSON.stringify(foldersData.folders));
    });
  }

  getDocuments() {
    this.finishedGetDocuments = false;
    fetch('/UserHome').then((response) => response.json()).then((documentsData) => {
      this.nickname = documentsData.nickname;
      this.email = documentsData.email;
      try {
        this.documents = JSON.parse(documentsData.documents);
      } catch(err) {
        this.documents = JSON.parse(JSON.stringify(documentsData.documents));
      }
      this.finishedGetDocuments = true;
    });
  }*/

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
    console.log(this.showFolderID);
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
    const initialOptions = [{name: "My Code Docs", folderID: this.defaultFolderID}];
    const folderOptions = initialOptions.concat(Array.from(this.folders.values()));
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
                ${folderOptions.map((folder) => html`
                    <a href="#"
                      class="dropdown-item"
                      @click=${() => this.setMoveFolder(folder.name, folder.folderID)}
                    > 
                      ${folder.name} 
                    </a>
                  `)}
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

  getSubfolders(rootFolderID) {
    let subfolders = [];
    if (this.folders.size > 0) {
      const rootFolder = this.folders.get(JSON.stringify(rootFolderID));
      for(const folderID of rootFolder.folderIDs) {
        const folder = this.folders.get(JSON.stringify(folderID));
        subfolders.push(folder);
      }
    }
    return subfolders;
  }

  render() {
    if (this.defaultFolderID !== undefined) {
      const navFolders = this.getSubfolders(this.defaultFolderID);
      const showSubfolders = this.getSubfolders(this.showFolderID);
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
