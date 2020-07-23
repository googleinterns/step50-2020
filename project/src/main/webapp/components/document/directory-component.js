import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class DirectoryComponent extends LitElement {
  static get properties() {
    return {
      documents: {type: Array},
      folderName: {type: String},
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

  shortenText(text) {
    const maxLength = 15;
    if (text.length > maxLength) {
      return text.slice(0, 15) + "..."
    } else {
      return text;
    }
  }

  loadDocument(hash) {
    const docLink = "/Document?documentHash=" + hash;
    window.open(docLink) || window.location.replace(docLink);
  }

  render() {
    if (this.documents !== undefined) {
      return html`
        <div class="directory" id="directory">
          <div class="directory-header">
            <img src="../assets/move-folder.png" />
            <b> Directory </b>
          </div>
          <br>
          <u>${this.shortenText(this.folderName)}></u>
          <ul class="docs-list">
            ${this.documents.map((doc) => 
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
          <ul>
        </div>
      `;
    }
  }
}
customElements.define('directory-component', DirectoryComponent);
