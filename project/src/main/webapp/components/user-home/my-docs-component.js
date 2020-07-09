import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {DocsComponent} from './docs-component.js';

export class MyDocsComponent extends DocsComponent {
  constructor() {
    super();
    this.title = 'My Code Docs';
    this.servlet = '/UserHome';
  }
}
customElements.define('my-docs-component', MyDocsComponent);
