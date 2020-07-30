import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {DropdownElement} from '../dropdown-element.js';
import {PanelElement} from '../panel-element.js';

export class NavPanel extends LitElement {
  static get properties() {
    return {
      languages: {type: Array},
      docHash: {type: String},
      formDisabled: {type: String},
      validTitle: {type: Boolean},
      validDropdown: {type: Boolean},
      value: {type: String},
      valueID: {type: Number},
      folders: {type: Array},
      defaultFolderID: {type: Number},
    };
  }

  constructor() {
    super();
    this.docHash = '';
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
    fetch('../../../api-key.json')
      .then(response => response.json())
      .then(config => { 
        if (firebase.apps.length === 0) {
          firebase.initializeApp(config);
        }
        this.docHash = this.createDocHash();
      });
  }

  createDocHash() {
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

  setPanelValue(e) {
    this.value = e.target.value;
    this.valueID = e.target.valueID;
    this.createEvent('toggle-folder');
  }

  setPanelValueAsMyDocs() {
    this.value = 'My Code Docs';
    this.valueID = this.defaultFolderID;
    this.createEvent('toggle-folder');
  }

  createEvent(eventName) {
    let event = new CustomEvent(eventName);
    this.dispatchEvent(event);
  }

  render() {
    const disableSubmit = this.validTitle && this.validDropdown ? false: true;
    return html`
      <div>
        <form class="new-doc-group" id="new-doc-form" action="/UserHome" method="POST" target="_blank" onsubmit=${
        this.createDocument()}>
          <input type="hidden" name="folderID" value=${this.valueID}>
          <input 
            @input=${(e) => this.validateTitle(e)} 
            name="title" id="new-doc-title" 
            class="white-input full-width" 
            placeholder=${this.placeholder}
            autocomplete="off" 
          />
          <dropdown-element 
            @change=${(e) => this.validateDropdown(e)}
            .options=${this.languages} 
            name="language"
            label="Languages"
            styling="full-width"
          >
          </dropdown-element>
          <input type="hidden" name="docHash" value=${this.docHash}>
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
          <button class="text-btn full-width" @click="${this.setPanelValueAsMyDocs}"> My Code Docs </button>
          <div class="folder-btn-group">
            <panel-element 
              @change=${(e) => this.setPanelValue(e)}
              .options=${this.folders} 
              label="Folders"
              styling="full-width">
            </panel-element>
            <button class="plain-btn" @click=${() => this.createEvent('new-folder')}>
              <img src="../assets/new-folder.png" />
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('nav-panel', NavPanel);
