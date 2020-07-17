import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {convertMillisToTimestamp, revisionToId, revisionFromId} from '../utils.js';

export class VersioningComponent extends LitElement {
  static get properties() {
    return {
      firepad: {type: Object},
      codeMirror: {type: Object},
      groupedRevisions: {type: Array},
      revisionsMap: {type: Object},
      latestSelectedHash: {type: String},
      validCommitName: {type: Boolean},
      commits: {type: Object},
      show: {type: String},
    };
  }

  constructor() {
    super();
    this.groupedRevisions = [];
    this.revisionsMap = {};
    this.latestSelectedHash = '';
    this.validCommitName = false;
    this.commits = [];
    this.show = 'revisions';
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  closeVersioning(hasReverted) {
    codeMirror.options.readOnly = false;
    document.getElementById('versioning').style.display = 'none';
    // Do not trigger init() in document.jsp otherwise firepad will save a blank pad
    if (!hasReverted) {
      this.dispatchEvent(new CustomEvent('close'));
    }
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

  /* Backend functions for Firebase / Firepad manipulations */
  async createDocumentSnapshot(revisionHash) {
    var document = new Firepad.TextOperation();
    const end = revisionFromId(revisionHash);
    for (let i = 0; i <= end; i++) {
      const currHash = revisionToId(i);
      var revisionData = this.revisionsMap.get(currHash);
      const revision = Firepad.TextOperation.fromJSON(revisionData.o);
      document = document.compose(revision);
    }
    return document.toJSON();
  }

  async temporaryRevert(hash) {
    let firebaseAdapter = this.getFirebaseAdapter();
    firebaseAdapter.ready_ = false;
    await this.revert(hash, false);
    firebaseAdapter.ready_ = true;
    codeMirror.options.readOnly = 'nocursor';
  }

  async revert(hash, close) {
    this.lockLink(hash);
    const documentSnapshot = await this.createDocumentSnapshot(hash);
    if (documentSnapshot.length > 0) {
      firepad.setText(documentSnapshot[documentSnapshot.length - 1]);
    } else {
      firepad.setText(documentSnapshot);
    }
    if (close) {
      this.closeVersioning(true);
    }
  }

  lockLink(hash) {
    const links = document.getElementsByClassName("underline-link");
    for (const link of links) {
      if (link.id === hash) {
        link.style.textDecoration = "underline";
      } else {
        link.style.textDecoration = "none";
      }
    }
  }
  
  async createCommit() {
    const revisionHash = this.latestSelectedHash;
    this.latestSelectedHash = '';
    const nameInput = document.getElementById('commit-name');
    const msgInput = document.getElementById('commit-msg');
    const commitTimestamp = this.revisionsMap.get(revisionHash).t;
    const firebaseAdapter = this.getFirebaseAdapter();
    const documentSnapshot = await this.createDocumentSnapshot(revisionHash);
    const snapshot = await firebaseAdapter.ref_.child('commit').child(revisionHash);
    snapshot.update({
      a: firebaseAdapter.userId_,
      o: documentSnapshot,
      name: nameInput.value, 
      msg: msgInput.value,
      timestamp: commitTimestamp,
    });
    this.resetCommitForm(nameInput, msgInput);
  }

  /* Frontend functions for component interaction */
  resetCommitForm(nameInput, msgInput) {
    nameInput.value = '';
    msgInput.value = '';
    this.requestUpdate();
  }

  handleCheckboxClick(index, revisionHash) {
    const checked = document.getElementById(index).checked;
    const checkBoxes = document.getElementsByClassName("checkbox");
    for (let checkBox of checkBoxes) {
      if (checkBox.id >= index) {
        checkBox.checked = checked;
      }
    } 
    if (checked === false) {
      this.latestSelectedHash = '';
    } else if (revisionHash > this.latestSelectedHash) {
      this.latestSelectedHash = revisionHash;
    }
  }

  validateCommitName(e) {
    const input = e.target;
    this.validCommitName = input.value.length > 0;
  }

  lockBtn(val) {
    // Reset revision / commit selection after toggle
    this.latestSelectedHash = '';
    this.show = val;
    const boldBtns = document.getElementsByClassName("bold-btn");
    for (const btn of boldBtns) {
      if (btn.id === val) {
        btn.style.fontWeight = "bold";
      } else {
        btn.style.fontWeight = "normal";
      }
    }
  }

  showRevisions() {
    const latestCommitHash = this.commits.length > 0 ? this.commits[0].hash : '';
    const filteredGroupedRevisions = this.groupedRevisions.filter((revision) => revision.hash > latestCommitHash);
    return html`
      <div>
        <div class="versioning-description">Group revisions into commits here.</div>
        <div class="versioning-group">
          <ul>
            ${filteredGroupedRevisions.map((revision, i) => {
              return html`
                <li>
                  <a 
                    class="underline-link"
                    id=${revision.hash}
                    @click=${() => this.temporaryRevert(revision.hash)}
                  >
                    ${convertMillisToTimestamp(revision.timestamp)}
                  </a>
                  <input 
                    class="checkbox" 
                    type="checkbox" 
                    id=${i} 
                    @click=${() => this.handleCheckboxClick(i, revision.hash)} 
                  />
                </li>
              `
            })}
          </ul>
        </div>
        <div class="revision-btn-group full-width">
          <input 
            class="has-text-weight-bold white-input full-width" 
            placeholder="Commit name"
            id="commit-name" 
            @change=${(e) => this.validateCommitName(e)}
          />
          <input 
            class="white-input full-width" 
            placeholder="Type a commit message..." 
            id="commit-msg"
          />
          ${this.validCommitName && this.latestSelectedHash !== '' ? 
            html`
              <button class="primary-blue-btn full-width" 
                @click="${this.createCommit}"
              > Commit </button>
            `
            :
            html`
              <button class="primary-blue-btn full-width disabled" disabled> Commit </button>
            `
          }
        </div>
      `
  }

  showCommits() {
    return html`
      <div>
        <div class="versioning-description">Officially revert to previous commits here.</div>
        <div class="versioning-group">
          <ul>
            ${this.commits.map((commit, i) => 
              html`
                <li>
                  <div>
                    <a 
                      class="underline-link"
                      id=${commit.hash}
                      @click=${() => this.temporaryRevert(commit.hash)}
                    >
                      <div class="has-text-weight-semibold"> ${commit.name} </div>
                    </a>
                    ${commit.msg}
                  </div>
                  <input 
                    class="checkbox" 
                    type="checkbox"
                    id=${i} 
                    @click=${() => this.handleCheckboxClick(i, commit.hash)} 
                  />
                </li>
              `
            )}
          </ul>
        </div>
        <div class="commit-btn-bottom">
          ${this.latestSelectedHash !== '' ? 
            html`
              <button class="primary-blue-btn full-width" 
                @click=${() => this.revert(this.latestSelectedHash, true)}
              > Revert </button>
            `
            :
            html`
              <button class="primary-blue-btn full-width disabled" disabled> Revert </button>
            `
          }
        </div>
      </div>
    `
  }

  render() {
    return html`
      <div class="versioning full-height" id="versioning">
        <div class="versioning-header full-width">
          <div class="versioning-header-toggle">
            <button class="bold-btn" id="revisions" @click=${() => this.lockBtn('revisions')}> Revisions </button>
            <button class="bold-btn" id="commits" @click=${() => this.lockBtn('commits')}> Commits </button>
          </div>
          <button class="close delete" @click="${() => this.closeVersioning(false)}"></button>
        </div>
        ${this.show === 'revisions' ? this.showRevisions() : this.showCommits() }  
        </div>
      </div>
    `;
  }
}
customElements.define('versioning-component', VersioningComponent);
