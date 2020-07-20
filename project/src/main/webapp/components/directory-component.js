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

  loadDocument(hash) {
    const docLink = "/Document?documentHash=" + hash;
    window.open(docLink) || window.location.replace(docLink);
  }

  close() {
    document.getElementById('directory').style.display = 'none';
  }

  render() {
    if (this.documents !== undefined) {
      return html`
        <div class="directory" id="directory">
          <div>${this.folderName}></div>
          <button class="delete" onclick="${this.close}" />    
          <ul class="docs-list">
            ${this.documents.map((doc) => 
              doc.hash != this.docHash ?
              html`
                <li>
                  <a @click=${() => this.loadDocument(doc.hash)}>
                    ${doc.name}
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
