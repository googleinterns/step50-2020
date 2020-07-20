import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class Comment extends LitElement {
  static get properties() {
    return {
      user: {type: String},
      timestamp: {type: String},
      text: {type: String},
      startLine: {type: Number},
      startChar: {type: Number},
      endLine: {type: Number},
      endChar: {type: Number},
    };
  }

  constructor() {
    super();
    this.user = '';
    this.timestamp = '';
    this.text = '';
    this.startLine = 0;
    this.startChar = 0;
    this.endLine = 0;
    this.endChar = 0;
  }

  createRenderRoot() {
    return this;
  }

  render() {

  }
}
customElements.define('comment', Comment);