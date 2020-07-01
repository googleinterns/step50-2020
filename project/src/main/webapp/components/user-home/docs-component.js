import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class DocsComponent extends LitElement {
  static get properties() {
    return {
      documents: {type: Object},
      nickname: {type: String},
      email: {type: String},
    };
  }

  constructor() {
    super();
    this.documents = [];
    this.nickname = '';
    this.email = '';
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  getServletData() {
    fetch('/UserHome').then((response) => response.json()).then((documentsData) => { 
      this.documents = JSON.parse(documentsData.documents);
      this.nickname = documentsData.nickname;
      this.email = documentsData.email;
    });
  }

  loadDocument(hash) {
    window.location.href = "/Document?documentHash=" + hash;
  }

  render() {
    const empty = this.documents.length == 0;
    return html`        
      <div>
        <div class="user-info">
          <b>${this.nickname}</b>
          <br>
          ${this.email}
        </div>
        <div class="docs-component">
          <div class="title">My Code Docs</div>
          ${empty ? 
            html`
              <img class="float-right" src="../assets/empty-docs.png" />
            `
            :
            html`
              <ul class="docs-list">
                ${this.documents.map((doc) => html`
                    <li>
                      <div>
                        <a @click=${() => this.loadDocument(doc.hash)}>
                          ${doc.name}
                        </a>
                        <span class="tag tag-bordered">
                          ${doc.language}
                        </span>
                      </div>
                      <div class="shared-with-text">
                        <b> Shared with </b> 
                        ${doc.userIDs.toString()}
                      </div>
                    </li>
                `)}
              <ul>
            `
          }
          ${this.getServletData()}
        </div>
      </div>
    `;
  }
}
customElements.define('docs-component', DocsComponent);
