import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class VersioningComponent extends LitElement {
  static get properties() {
    return {
      firepad: {type: Object},
      revisions: {type: Array},
      flattenedRevisions: {type: Object}
    };
  }

  constructor() {
    super();
    this.firepad = null;
    this.revisions = [];
    this.flattenedRevisions = {};
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

  async createDocumentSnapshot(revisionHash) {
    firebaseAdapter = this.getFirebaseAdapter();
    var document = new Firepad.TextOperation();
    const firepadRef = getRef();
    const end = revisionFromId(revisionHash);
    for (i = 0; i <= end; i++) {
      const currHash = revisionToId(i);
      var revisionData = this.flattenedRevisions.get(currHash);
      /*if (revisionData === undefined) {
        const snapshot = await firepadRef.child('history').child(currHash).once('value');
        revisionData = snapshot.val();
        this.revisionsCache.set(currHash, revisionData);
      }*/
      const revision = Firepad.TextOperation.fromJSON(revisionData.o);
      document = document.compose(revision);
    }
    return document.toJSON();
  }

  async createCheckpoint(revisionHash) {
    firebaseAdapter = this.getFirebaseAdapter();
    const document = await createDocumentSnapshot(revisionHash);
    const snapshot = await firebaseAdapter.ref_.child('checkpoint').child(revisionHash);
    snapshot.update({
      a: firebaseAdapter.userId_,
      o: document
    });
  }

  async revert(revisionHash) {
    firebaseAdapter = this.getFirebaseAdapter();
    firebaseAdapter.ready_ = false;
    const document = await createDocumentSnapshot(revisionHash);
    firepad.setText(document);
    firebaseAdapter.ready_ = true;
  }
  
  async createCheckpoint(revisionHash) {
    firebaseAdapter = this.getFirebaseAdapter();
    const document = await createDocumentSnapshot(revisionHash);
    const snapshot = await firebaseAdapter.ref_.child('checkpoint').child(revisionHash);
    snapshot.update({
      a: firebaseAdapter.userId_,
      o: document
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

  handleCheckboxClick(index) {
    const checked = document.getElementById(index).checked;
    for (let i = index; i < this.revisions.length; i++) {
      const checkbox = document.getElementById(i);
      checkbox.checked = checked;
    }
  }

  // flattened revisions
  render() {
    console.log(revisions);
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
          ${this.revisions.reverse().map((revision, index) =>
            html`
              <li>
                <a class="underline-link">
                  ${this.convertMillisToTimestamp(revision.timestamp)}
                </a>
                <input class="checkbox" type="checkbox" id=${index} @click=${() => this.handleCheckboxClick(index)}>
              </li>
            `
          )}
        </ul>
      </div>
      <div class="commit-btn-group full-width">
        <input class="white-input full-width" placeholder="Commit name"></input>
        <input class="white-input full-width" placeholder="Type a commit message..."></input>
        <button class="primary-blue-btn full-width" @click=${() => this.createCheckpoint('A2')}> Commit </button>
      </div>
    </div>
    `;
  }
}
customElements.define('versioning-component', VersioningComponent);
