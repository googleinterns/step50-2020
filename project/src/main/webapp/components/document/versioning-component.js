import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class VersioningComponent extends LitElement {
  static get properties() {
    return {
      firepad: {type: Object},
      revisionsCache: {type: Object}
    };
  }

  constructor() {
    super();
    this.revisionsCache = new Map();
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  closeVersioning() {
    document.getElementById('versioning').style.display = 'none';
  }

  async createDocumentSnapshot(revisionHash) {
    firebaseAdapter = firepad.firebaseAdapter_;
    var document = new Firepad.TextOperation();
    const firepadRef = getRef();
    const end = revisionFromId(revisionHash);
    for (i = 0; i <= end; i++) {
      const currHash = revisionToId(i);
      var revisionData = this.revisionsCache.get(currHash);
      if (revisionData === undefined) {
        const snapshot = await firepadRef.child('history').child(currHash).once('value');
        revisionData = snapshot.val();
        this.revisionsCache.set(currHash, revisionData);
      }
      const revision = Firepad.TextOperation.fromJSON(revisionData.o);
      document = document.compose(revision);
    }
    return document.toJSON();
  }

  async createCheckpoint(revisionHash) {
    firebaseAdapter = firepad.firebaseAdapter_;
    const document = await createDocumentSnapshot(revisionHash);
    const snapshot = await firebaseAdapter.ref_.child('checkpoint').child(revisionHash);
    snapshot.update({
      a: firebaseAdapter.userId_,
      o: document
    });
  }

  async revert(revisionHash) {
    firebaseAdapter = firepad.firebaseAdapter_;
    firebaseAdapter.ready_ = false;
    const document = await createDocumentSnapshot(revisionHash);
    firepad.setText(document);
    firebaseAdapter.ready_ = true;
  }
  
  async createCheckpoint(revisionHash) {
    firebaseAdapter = firepad.firebaseAdapter_;
    const document = await createDocumentSnapshot(revisionHash);
    const snapshot = await firebaseAdapter.ref_.child('checkpoint').child(revisionHash);
    snapshot.update({
      a: firebaseAdapter.userId_,
      o: document
    });
  }
  
  // Group revisions by timestamp on frontend
  async getRevisions() {
    const snapshot = await firepad.firebaseAdapter_.ref_.child('history').once('value');
    console.log(snapshot.val());
    return snapshot.val();
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
      <div class="commit-btn-group">
        <input class="white-input full-width" placeholder="Type a commit message..." id="commit-msg"></input>
        <button class="primary-blue-btn full-width" id="commit-button"> Commit </button>
      </div>
    </div>
    `;
  }
}
customElements.define('versioning-component', VersioningComponent);
