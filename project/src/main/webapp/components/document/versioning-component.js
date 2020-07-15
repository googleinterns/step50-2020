import {html, LitElement} from 'https://unpkg.com/@polymer/lit-element/lit-element.js?module';

export class VersioningComponent extends LitElement {
  static get properties() {
    return {
      firepad: {type: Object},
      revisions: {type: Object},
      flattenedRevisions: {type: Object}
    };
  }

  constructor() {
    super();
  }

  // Remove shadow DOM so styles are inherited
  createRenderRoot() {
    return this;
  }

  closeVersioning() {
    document.getElementById('versioning').style.display = 'none';
  }

  getFirebaseAdapter() {
    console.log(this.firepad.firebaseAdapter_);
    return this.firepad.firebaseAdapter_;
  }

  async createDocumentSnapshot(revisionHash) {
    try {
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
    } catch(e) {
      console.log(e);
    }
  }

  async createCheckpoint(revisionHash) {
    try {
      firebaseAdapter = this.getFirebaseAdapter();
      const document = await createDocumentSnapshot(revisionHash);
      const snapshot = await firebaseAdapter.ref_.child('checkpoint').child(revisionHash);
      snapshot.update({
        a: firebaseAdapter.userId_,
        o: document
      });
    } catch(e) {
      console.log(e);
    } 
  }

  async revert(revisionHash) {
    try {
      firebaseAdapter = this.getFirebaseAdapter();
      firebaseAdapter.ready_ = false;
      const document = await createDocumentSnapshot(revisionHash);
      firepad.setText(document);
      firebaseAdapter.ready_ = true;
    } catch(e) {
      console.log(e)
    }
  }
  
  async createCheckpoint(revisionHash) {
    try {
      firebaseAdapter = this.getFirebaseAdapter();
      const document = await createDocumentSnapshot(revisionHash);
      const snapshot = await firebaseAdapter.ref_.child('checkpoint').child(revisionHash);
      snapshot.update({
        a: firebaseAdapter.userId_,
        o: document
      });
    } catch(e) {
      console.log(e);
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
      <div class="commit-btn-group">
        <input class="white-input full-width" placeholder="Type a commit message..." id="commit-msg"></input>
        <button class="primary-blue-btn full-width" @click=${() => this.createCheckpoint('A2')}> Commit </button>
      </div>
    </div>
    `;
  }
}
customElements.define('versioning-component', VersioningComponent);
