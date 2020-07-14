import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {DocsComponent} from './docs-component.js';

export class FolderComponent extends DocsComponent {
  constructor() {
    super();
  }
}
customElements.define('folder-component', FolderComponent);
