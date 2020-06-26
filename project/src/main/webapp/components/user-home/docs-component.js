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
    /*fetch('/UserHome').then((response) => response.json()).then((documentList) => {
      this.documents = documentList;
    });*/
    console.log("Rewrite when UserHomeServlet can return data.");
  }

  render() {
    return html`        
      <div>
          <div class="title">My Code Docs</div>
          <ul class="docs-list">
            ${this.documents.map((doc) => html`
                <li class="docs-list-element">
                  ${doc.name} <div class="revision-text">Latest Revision: ${doc.language}</div>
                </li>
            `)}
          <ul>
          ${this.getServletData()}
      </div>
    `;
  }
}
customElements.define('docs-component', DocsComponent);
