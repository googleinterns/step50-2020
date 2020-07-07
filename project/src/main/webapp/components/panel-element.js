import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {DropdownElement} from './dropdown-element.js';

export class PanelElement extends DropdownElement {

  constructor() {
    super();
    this.changeLabel = false;
    this.hideIcon = 'fa fa-angle-right';
    this.hideOnSelect = false; 
  }

}
customElements.define('panel-element', PanelElement);
