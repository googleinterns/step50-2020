import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {DropdownElement} from '../dropdown-element.js';

export class NavPanel extends LitElement {
  static get properties() {
    return {
      languages: {type: Array},
      documentID: {type: String},
      formDisabled: {type: String},
      validTitle: {type: Boolean},
      validDropdown: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.languages = ['C++', 'Go', 'Python', 'Java', 'Javascript'];
    this.documentID = '';
    this.placeholder = 'Write a document title...';
    this.formDisabled = '';
    this.validTitle = false;
    this.validDropdown = false;
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  createDocument() {
    let config = {
      apiKey: 'AIzaSyDUYns7b2bTK3Go4dvT0slDcUchEtYlSWc',
      authDomain: 'step-collaborative-code-editor.firebaseapp.com',
      databaseURL: 'https://step-collaborative-code-editor.firebaseio.com'
    };
    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }
    this.documentID = this.createDocumentID();
  }

  createDocumentID() {
    var ref = firebase.database().ref();
    ref = ref.push();  // generate unique location.
    return ref.key;
  }

  validateTitle(e) {
    const title = e.target;
    this.validTitle = title.value.length > 0;
  }

  validateDropdown(e) {
    const dropdown = e.target;
    this.validDropdown = dropdown.value.length > 0;
  }

  render() {
    const disableSubmit = this.validTitle && this.validDropdown ? false: true;
    return html`
      <div>
        <form class="new-doc-group" id="new-doc-form" action="/UserHome" method="POST" onsubmit=${
        this.createDocument()}>
          <input 
            @change=${(e) => this.validateTitle(e)} 
            name="title" id="new-doc-title" 
            class="white-input full-width" 
            placeholder=${this.placeholder}
            autocomplete="off" 
          />
          <dropdown-element 
            @change=${(e) => this.validateDropdown(e)}
            .options="${this.languages}" 
            name="language"
            label="Languages"
            styling="full-width"
          >
          </dropdown-element>
          <input type="hidden" name="documentID" value=${this.documentID}>
          ${ disableSubmit ? 
            html`
              <button id="new-doc-submit" class="primary-blue-btn full-width disabled" disabled> + New doc</button>
            ` :
            html`
              <button id="new-doc-submit" class="primary-blue-btn full-width"> + New doc</button>
            `
          }
        </form>
        <div class="nav-btn-group">
          <button class="text-btn full-width"> My code docs </button>
          <button class="text-btn full-width"> Shared with me </button>
        </div>
      </div>
    `;
  }
}
customElements.define('nav-panel', NavPanel);
