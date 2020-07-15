import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class VersioningComponent extends LitElement {
  static get properties() {
    return {
    };
  }

  constructor() {
    super();
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  closeVersioning() {
    document.getElementById('versioning').style.display = 'none';
  }

  // need reference to the firebase 
  render() {
    return html`
    <div class="versioning" id="versioning">
      <button class="close delete" @click="${this.closeVersioning}"></button>
      <div class="versionHeader">
        <div class="revisions">
          <button class="text-btn" id="revisions-button"> Revisions </button>
        </div>
        <div class="commits">
          <button class="text-btn" id="commits-button"> Commits </button>
        </div>
      </div>
      <div class="commitButton three-width">
        <button class="primary-blue-btn three-width" id="commit-button"> Commit </button>
      </div>
      <div class="commitMessage three-width">
        <input class="white-input three-width" placeholder="Type a commit message..." id="commit-msg"></input>
      </div>
    </div>
    `;
  }
}
customElements.define('versioning-component', VersioningComponent);
