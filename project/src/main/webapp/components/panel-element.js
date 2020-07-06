import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

/* Modifiable attributes
 * .options - options in the panel
 * label - initial label at the top of the panel
 */
export class PanelElement extends LitElement {
  static get properties() {
    return {
      options: {type: Array},
      label: {type: String},
      value: {type: String},
      showPanel: {type: Boolean},
      styling: {type: String},
    };
  }

  constructor() {
    super();
    this.options = [];
    this.label = '';
    this.value = '';
    this.showPanel = false;
    this.styling = '';
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  togglePanel() {
    this.showPanel = !this.showPanel;
  }

  toggleValue(item) {
    this.value = item;
  }

  render() {
    let panelState = this.showPanel ? 'is-active' : '';
    return html`        
      <div>
        <div class=${'dropdown ' + panelState + ' ' + this.styling}>
          <div class=${'dropdown-trigger ' + this.styling}>
            <button type="button" class=${this.styling} @click=${
        this.togglepanel} aria-haspopup="true" aria-controls="panel-menu">
              ${this.showPanel ?
                html` 
                <span class="icon is-small">
                  <i class="fa fa-angle-down" aria-hidden="true"></i>
                </span>
                ` : 
                html` 
                <span class="icon is-small">
                  <i class="fa fa-angle-right" aria-hidden="true"></i>
                </span>
                `
              }
              <span>${this.label}</span>
            </button>
          </div>
          <div class="${'dropdown-menu ' + this.styling}" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
              ${this.options.map((option) => 
                html`
                  <a href="#" 
                    @click=${() => this.toggleValue(option)} 
                    class="panel-item"> 
                    ${option} 
                  </a>
                `)}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('panel-element', panelElement);
