import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class VersioningComponent extends LitElement {
  static get properties() {
    return {
      firepad: {type: Object},
      revisions: {type: Array},
      flattenedRevisions: {type: Object},
      latestRevisionHash: {type: String},
      validCommitName: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.firepad = null;
    this.revisions = [];
    this.flattenedRevisions = {};
    this.latestRevisionHash = '';
    this.characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    this.validCommitName = false;
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  closeVersioning() {
    document.getElementById('versioning').style.display = 'none';
  }

  getFirebaseAdapter() {
    let firebaseAdapter = null;
    while (firebaseAdapter == null) {
      try {
        firebaseAdapter = this.firepad.firebaseAdapter_;
      } catch(e) {
        console.log(e);
      }
    }
    return firebaseAdapter;
  }

  // Source: Firepad firebase-adapter.js
  revisionToId(revision) {
    if (revision === 0) {
      return 'A0';
    }

    var str = '';
    while (revision > 0) {
      var digit = (revision % this.characters.length);
      str = this.characters[digit] + str;
      revision -= digit;
      revision /= this.characters.length;
    }

    // Prefix with length (starting at 'A' for length 1) to ensure the id's sort lexicographically.
    var prefix = this.characters[str.length + 9];
    return prefix + str;
  }

  revisionFromId(revisionId) {
    if (revisionId.length > 0 && revisionId[0] === this.characters[revisionId.length + 8]) {
      var revision = 0;
      for(var i = 1; i < revisionId.length; i++) {
        revision *= this.characters.length;
        revision += this.characters.indexOf(revisionId[i]);
      }
      return revision;  
    } else {
      console.log("Invalid revision ID");
      return -1; 
    }
  }

  async createDocumentSnapshot(revisionHash) {
    let firebaseAdapter = this.getFirebaseAdapter();
    var document = new Firepad.TextOperation();
    const firepadRef = firebaseAdapter.ref_;
    const end = this.revisionFromId(revisionHash);
    for (let i = 0; i <= end; i++) {
      const currHash = this.revisionToId(i);
      var revisionData = this.flattenedRevisions.get(currHash);
      const revision = Firepad.TextOperation.fromJSON(revisionData.o);
      document = document.compose(revision);
    }
    return document.toJSON();
  }

  async revert(revisionHash) {
    let firebaseAdapter = this.getFirebaseAdapter();
    firebaseAdapter.ready_ = false;
    const document = await this.createDocumentSnapshot(revisionHash);
    firepad.setText(document);
    firebaseAdapter.ready_ = true;
  }
  
  async createCommit(revisionHash) {
    let commitName = document.getElementById('commit-name').value;
    let commitMsg = document.getElementById('commit-msg').value;
    let firebaseAdapter = this.getFirebaseAdapter();
    const documentSnapshot = await this.createDocumentSnapshot(revisionHash);
    const snapshot = await firebaseAdapter.ref_.child('commit').child(revisionHash);
    snapshot.update({
      a: firebaseAdapter.userId_,
      o: documentSnapshot,
      name: commitName, 
      msg: commitMsg,
    });
  }

  convertMillisToTimestamp(millis) {
    let date = new Date(millis);
    const dateOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    date = date.toLocaleString('en-US', dateOptions);
    return date;
  }

  handleCheckboxClick(index, revisionHash) {
    const checked = document.getElementById(index).checked;
    for (let i = 0; i <= index; i++) {
      const checkbox = document.getElementById(i);
      checkbox.checked = checked;
    }
    if (revisionHash > this.latestRevisionHash) {
      this.latestRevisionHash = revisionHash;
    }
  }

  validateCommitName(e) {
    const input = e.target;
    this.validCommitName = input.value.length > 0;
  }

  render() {
    return html`
    <div class="versioning full-height" id="versioning">
      <div class="versioning-header full-width">
        <div class="versioning-header-toggle">
          <button class="text-btn" id="revisions-button"> Revisions </button>
          <button class="text-btn" id="commits-button"> Commits </button>
        </div>
        <button class="close delete" @click="${this.closeVersioning}"></button>
      </div>
      <div class="revisions-group">
        <ul>
          ${this.revisions.map((_, i) => {
            let index = this.revisions.length - i - 1;
            let revision = this.revisions[index];
            return html`
              <li>
                <a class="underline-link">
                  ${this.convertMillisToTimestamp(revision.timestamp)}
                </a>
                <input class="checkbox" type="checkbox" id=${index} @click=${() => this.handleCheckboxClick(i, revision.hash)}>
              </li>
            `
          })}
        </ul>
      </div>
      <div class="commit-btn-group full-width">
        <input 
          class="white-input full-width" 
          placeholder="Commit name"
          id="commit-name" 
          @change=${(e) => this.validateCommitName(e)}
        >
        </input>
        <input 
          class="white-input full-width" 
          placeholder="Type a commit message..." 
          id="commit-msg"
        >
        </input>
        ${this.validCommitName && this.latestRevisionHash !== '' ? 
          html`
            <button class="primary-blue-btn full-width" @click=${() => this.createCommit(this.latestRevisionHash)}> Commit </button>
          `
          :
          html`
            <button class="primary-blue-btn full-width disabled" disabled> Commit </button>
          `
        }
        
      </div>
    </div>
    `;
  }
}
customElements.define('versioning-component', VersioningComponent);
