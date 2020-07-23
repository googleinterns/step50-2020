import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {getSubfolders} from '../utils.js';

export class DirectoryComponent extends LitElement {
  static get properties() {
    return {
      folders: {type: Object},
      folderID: {type: Number},
      docHash: {type: Number},
    };
  }

  constructor() {
    super();
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  loadDocument(hash) {
    const docLink = "/Document?documentHash=" + hash;
    window.open(docLink) || window.location.replace(docLink);
  }

  shortenText(text) {
    const maxLength = 15;
    if (text.length > maxLength) {
      return text.slice(0, 15) + "..."
    } else {
      return text;
    }
  }

  showNestedFolders(folderID) {
    console.log(this.folders);
    const subfolders = getSubfolders(folderID, this.folders);
    const documents = this.folders.get(JSON.stringify(folderID)).docs;
    return html`
      <ul class="indent-small">
        ${documents.map((doc) => 
          doc.hash != this.docHash ?
          html`
            <li>
              <a @click=${() => this.loadDocument(doc.hash)}>
                ${this.shortenText(doc.name)}
              </a>
            </li>
          ` :
          html``
        )}
        ${subfolders.map((folder) =>
          html`
            <div>${this.shortenText(folder.name)}</div>
            ${this.showNestedFolders(folder.folderID)}
          `
        )}
      </ul>
    `
  }

  render() {
    if (this.folders !== undefined) {
      const folderName = this.folders.get(JSON.stringify(this.folderID)).name;
      return html`
        <div class="directory" id="directory">
          <div class="directory-header">
            <img src="../assets/move-folder.png" />
            <b> Directory </b>
          </div>
          <br>
          <div><u>${folderName}</u></div>
          <ul class="docs-list indent-small">
           ${this.showNestedFolders(this.folderID)}
          <ul>
        </div>
      `;
    }
  }
}
customElements.define('directory-component', DirectoryComponent);
