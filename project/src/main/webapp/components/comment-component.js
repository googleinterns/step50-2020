import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class CommentComponent extends LitElement {
  static get properties() {
    return {
      placeholder : {type: String},
      name : {type: String},
      time : {type: String}
    };
  }

  constructor() {
    super();
    this.placeholder = 'Write comment...';
    this.name ='';
    this.time = '';
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  getServletData() {
    fetch('/UserHome').then((response) => response.json()).then((documentsData) => { 
      var date = new Date().toJSON().slice(0,10);
      var time = new Date().toJSON().slice(11,19)
      this.time = date + ' ' + time;
      this.name = documentsData.nickname;
    });
  }

  render() {
    return html` 
      <div class="comment-div">
        ${this.getServletData()}
        <p class="comment-name">${this.name}</p>
        <p class="comment-time">${this.time}</p>
        <div class="comment-delete">
          <button class="delete"></button>
        </div>
        <textarea 
          name="comment" id="comment-doc"
          class="comment-txt"
          placeholder=${this.placeholder}
          autocomplete="off" 
        ></textarea>
      </div>
    `;
  }
}
customElements.define('comment-component', CommentComponent);