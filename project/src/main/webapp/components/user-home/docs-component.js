import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class DocsComponent extends LitElement {
  static get properties() {
    return {
      documents: {type: Object},
      subfolders: {type: Object},
      languages: {type: Object},
      nickname: {type: String},
      email: {type: String},
      title: {type: String},
      folderID: {type: Number},
      defaultFolderID: {type: Number},
      value: {type: Number},
      valueID: {type: Number}
    };
  }

  constructor() {
    super();
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  // Open document in new tab, else if operation is blocked load the doc in the same tab
  loadDocument(hash) {
    const docLink = "/Document?documentHash=" + hash;
    window.open(docLink) || window.location.replace(docLink);
  }

  createMoveFolderEvent(docName, docHash) {
    let moveFolderEvent = new CustomEvent('move-folder', {
      detail: {
        name: docName,
        hash: docHash,
      }
    });
    this.dispatchEvent(moveFolderEvent);
  }

  toggleFolder(folderName, folderID) {
    this.value = folderName;
    this.valueID = folderID;
    this.dispatchEvent(new CustomEvent('toggle-folder'));
  }

  render() {
    if (this.folderID === this.defaultFolderID) {
      this.subfolders = [];
    }
    const empty = this.documents.length === 0 && this.subfolders.length === 0;
    return html`        
    <div>
      <div class="user-info">
        <b>${this.nickname}</b>
        <br>
        ${this.email}
        <br>
        <a href="/_ah/logout?continue=%2FUser"> Sign out </a>
      </div>
      <div class="docs-component">
        <div class="title">${this.title}</div>
        ${empty ? 
          html`
            <img class="float-right" src="../assets/empty-docs.png" />
          `
          :
          html`
            ${this.subfolders.length > 0 ?
              html`
                <ul class="folders-list">
                ${this.subfolders.map((folder) => 
                  html`
                    <li @click=${() => this.toggleFolder(folder.name, folder.folderID)}>
                      <img src="../assets/plain-folder.png" />
                      <a>
                        ${folder.name}
                      </a>
                    </li>
                ` 
                )}
              </ul>
              ` : 
              null
            }
            <ul class="docs-list">
              ${this.subfolders.map((folder) => 
                html`
                  <li>
                    <div>
                      <a @click=${() => this.toggleFolder(folder.name, folder.folderID)}>
                        ${folder.name}
                      </a>
                    </div>
                  </li>
              ` 
              )}
              ${this.documents.map((doc) => 
                html`
                  <li>
                    <div>
                      <a @click=${() => this.loadDocument(doc.hash)}>
                        ${doc.name}
                      </a>
                      <span class="tag tag-bordered">
                        ${this.languages[doc.language]}
                      </span>
                    </div>
                    <div>
                      <button class="plain-btn" @click="${() => this.createMoveFolderEvent(doc.name, doc.hash)}">
                        <img src="../assets/move-folder.png" />
                      </button>
                    </div>
                  </li>
              ` 
              )}
            <ul>
          `
        }
      </div>
    </div>
  `;
  }
}
customElements.define('docs-component', DocsComponent);
