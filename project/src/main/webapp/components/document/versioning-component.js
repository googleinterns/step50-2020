import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';
import {convertMillisToTimestamp, revisionToId, revisionFromId} from '../utils.js';

export class VersioningComponent extends LitElement {
  static get properties() {
    return {
      firepad: {type: Object},
      groupedRevisions: {type: Array},
      revisionsMap: {type: Object},
      latestSelectedRevision: {type: String},
      validCommitName: {type: Boolean},
      commits: {type: Object},
      show: {type: String},
    };
  }

  constructor() {
    super();
    this.firepad = null;
    this.groupedRevisions = [];
    this.revisionsMap = {};
    this.latestSelectedRevision = '';
    this.validCommitName = false;
    this.commits = [];
    this.show = 'revisions';
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

  // Backend functions for Firebase / Firepad manipulations
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
    let commitTimestamp = this.revisionsMap.get(revisionHash).t;
    let firebaseAdapter = this.getFirebaseAdapter();
    const documentSnapshot = await this.createDocumentSnapshot(revisionHash);
    const snapshot = await firebaseAdapter.ref_.child('commit').child(revisionHash);
    snapshot.update({
      a: firebaseAdapter.userId_,
      o: documentSnapshot,
      name: commitName, 
      msg: commitMsg,
      timestamp: commitTimestamp,
    });
  }

  // Frontend functions for component interaction
  handleCheckboxClick(index, revisionHash) {
    const checked = document.getElementById(index).checked;
    for (let i = index; i <= this.groupedRevisions.length - 1; i++) {
      const checkbox = document.getElementById(i);
      if (checkbox !== null) {
        checkbox.checked = checked;
      }
    }
    if (revisionHash > this.latestSelectedRevision) {
      this.latestSelectedRevision = revisionHash;
    }
  }

  validateCommitName(e) {
    const input = e.target;
    this.validCommitName = input.value.length > 0;
  }

  toggleShow(val) {
    this.show = val;
  }

  showRevisions() {
    const latestCommitHash = this.commits.length > 0 ? this.commits[this.commits.length - 1].hash : '';
    const filteredGroupedRevisions = this.groupedRevisions.filter((revision) => revision.hash > latestCommitHash);
    console.log(latestCommitHash);
    return html`
      <div>
        <div class="versioning-group">
          <ul>
            ${filteredGroupedRevisions.map((revision, i) => {
              return html`
                <li>
                  <a class="underline-link">
                    ${convertMillisToTimestamp(revision.timestamp)}
                  </a>
                  <input 
                    class="checkbox" 
                    type="checkbox" 
                    id=${i} 
                    @click=${() => this.handleCheckboxClick(i, revision.hash)}>
                </li>
              `
            })}
          </ul>
        </div>
        <div class="commit-btn-group full-width">
          <input 
            class="has-text-weight-bold white-input full-width" 
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
          ${this.validCommitName && this.latestSelectedRevision !== '' ? 
            html`
              <button class="primary-blue-btn full-width" 
                @click=${() => this.createCommit(this.latestSelectedRevision)}
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
    // A very large hash according to revisionToId / fromId
    let prevHash = 'zzzzzzzzzz';
    return html`
      <div>
        <div class="versioning-group">
          <ul>
            ${this.commits.map((commit) => {
              console.log(prevHash);
              const commitRevisions = this.groupedRevisions.filter(
                  (revision) => revision.hash <= commit.hash);
              prevHash = commit.hash;
              return html`
                <li>
                  <a class="underline-link">
                    ${commit.name}
                    ${commit.msg}
                  </a>
                  <ul>
                      ${commitRevisions.map((revision) => 
                        html`<li>${convertMillisToTimestamp(revision.timestamp)}</li>`
                      )}
                    </ul>
                </li>
              `
            })}
          </ul>
        </div>
      `
  }

  render() {
    return html`
      <div class="versioning full-height" id="versioning">
        <div class="versioning-header full-width">
          <div class="versioning-header-toggle">
            <button class="bold-btn" id="revisions-button" @click=${() => this.toggleShow('revisions')}> Revisions </button>
            <button class="bold-btn" id="commits-button" @click=${() => this.toggleShow('commits')}> Commits </button>
          </div>
          <button class="close delete" @click="${this.closeVersioning}"></button>
        </div>
        ${this.show === 'revisions' ? this.showRevisions() : this.showCommits() }  
        </div>
      </div>
    `;
  }
}
customElements.define('versioning-component', VersioningComponent);
