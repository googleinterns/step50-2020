import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {DropdownElement} from '../dropdown-element.js';

export class NavPanel extends LitElement {
  static get properties() {
    return {
      languages: {type: Array},
      documentID: {type: String},
    };
  }

  constructor() {
    super();
    this.languages = ['C++', 'Go', 'Python', 'Java', 'Javascript'];
    this.documentID = '';
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  init() {
    let config = {
      apiKey: 'AIzaSyDUYns7b2bTK3Go4dvT0slDcUchEtYlSWc',
      authDomain: 'step-collaborative-code-editor.firebaseapp.com',
      databaseURL: 'https://step-collaborative-code-editor.firebaseio.com'
    };
    firebase.initializeApp(config);
    this.documentID = this.createDocumentID();
  }

  createDocumentID() {
    var ref = firebase.database().ref();
    ref = ref.push();  // generate unique location.
    return ref.key;
  }

  render() {
    return html`
      <div>
        <form class="new-doc-group" action="/UserHome" method="POST" onsubmit=${
        this.init()}>
          <input name="title" class="white-input full-width" placeholder="Write a document title..." />
          <dropdown-element 
            .options="${this.languages}" 
            name="language"
            label="Languages"
            styling="full-width">
          </dropdown-element>
          <input type="hidden" name="documentID" value=${this.documentID}>
          <button class="primary-blue-btn full-width"> + New doc</button>
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
