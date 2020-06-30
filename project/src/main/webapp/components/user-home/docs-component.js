import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class DocsComponent extends LitElement {
  static get properties() {
    return {
      documents: {type: Object},
    };
  }

  constructor() {
    super();
    this.documents = [];
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  getServletData() {
    fetch('/UserHome').then((response) => response.json()).then((documentList) => { 
      this.documents = documentList;
    });
  }

  loadDocument(hash) {
    window.location.href = "/Document?documentHash=" + hash;
  }

  render() {
    return html`        
      <div>
          <div class="title">My Code Docs</div>
          <ul class="docs-list">
            ${this.documents.map((doc) => html`
                <li class="docs-list-element">
                  <div>
                    <a @click=${() => this.loadDocument(doc.hash)}>
                      ${doc.name}
                    </a>
                    <span class="tag tag-bordered">
                      ${doc.language}
                    </span>
                  </div>
                  <div class="shared-with-text">
                    <b> Shared With </b> 
                    ${doc.userIDs.toString()}
                  </div>
                </li>
            `)}
          <ul>
          ${this.getServletData()}
      </div>
    `;
  }
}
customElements.define('docs-component', DocsComponent);
