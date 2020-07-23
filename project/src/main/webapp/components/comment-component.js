import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class CommentComponent extends LitElement {
  static get properties() {
    return {
      firepad: {type: Object},
      codeMirror: {type: Object},
      placeholder : {type: String},
      name : {type: String},
      date : {type: String},
      hash : {type: String},
      text : {type: String},
      exists : {type: Boolean}
    };
  }

  constructor() {
    super();
    this.placeholder = 'Write a comment...';
    this.name ='';
    this.date = '';
    this.hash = '';
    this.text = '';
    this.exists = false;
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  render() {
    return html` 
      <form class="comment-group" id="comment-form" onsubmit="return subComment()">
        <div class="comment-div">
          <p class="comment-name">${this.name}</p>
          <p class="comment-date">${this.date}</p>
          <input type="hidden" id="commentDate" name="commentDate" value="${this.date}">
          <div class="comment-delete">
            <button class="delete"></button>
          </div>
          ${this.exists ? html`<p class ="comment-text">${this.text}</p>`:
            html`<input type="textarea"
            name="commentData" id="commentData"
            class="comment-txt"
            placeholder=${this.placeholder}
            autocomplete="off" 
          ></input>
          <input class="primary-blue-btn comment-btn"type="submit"></input>
          <input type="hidden" id="documentHash" name="documentHash" value="${this.hash}">`
          }
        </div>
      </form>
    `;
  }
}
customElements.define('comment-component', CommentComponent);
