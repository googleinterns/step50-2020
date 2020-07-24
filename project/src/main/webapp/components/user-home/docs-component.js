import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class DocsComponent extends LitElement {
  static get properties() {
    return {
      documents: {type: Object},
      languages: {type: Object},
      nickname: {type: String},
      email: {type: String},
      title: {type: String},
      folderID: {type: Number},
      finishedGetDocuments: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.finishedGetDocuments = false;
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

  render() {
    const empty = this.documents.length == 0 && this.finishedGetDocuments;
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
            <ul class="docs-list">
              ${this.documents.map((doc) => 
                doc.folderID === this.folderID ?
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
              ` :
              html``
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
