import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class CommentComponent extends LitElement {
  static get properties() {
    return {
      firepad: {type: Object},
      codeMirror: {type: Object},
      placeholder : {type: String},
      name : {type: String},
      date : {type: String}
    };
  }

  constructor() {
    super();
    this.placeholder = 'Write a comment...';
    this.name ='';
    this.date = '';
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  makeDate() {
    this.date = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date());
  }

  render() {
    return html` 
      <form class="comment-group" id="comment-form" onsubmit="return subComment()">
        <div class="comment-div">
        ${this.makeDate()}
          <p class="comment-name">${this.name}</p>
          <p class="comment-date">${this.date}</p>
          <input type="hidden" id="commentDate" name="commentDate" value="${this.date}">
          <div class="comment-delete">
            <button class="delete"></button>
          </div>
          <input type="textarea"
            name="commentData" id="commentData"
            class="comment-txt"
            placeholder=${this.placeholder}
            autocomplete="off" 
          ></input>
          <input type="submit">Submit</input>
        </div>
      </form>
    `;
  }
}
customElements.define('comment-component', CommentComponent);