package com.google.sps.models;
import java.util.ArrayList;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.FirebaseApp;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.ValueEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.api.core.SettableApiFuture;
import java.io.IOException;

public class Firebase {

  /* Helpful reference links:
  * Firebase repo (https://github.com/firebase/firebase-admin-java/tree/master/src/main)
  * GoogleCredentials authentication (https://cloud.google.com/docs/authentication/production)
  */
  private static DatabaseReference getFirebase() throws IOException {
    FirebaseOptions options = new FirebaseOptions.Builder()
        .setCredentials(GoogleCredentials.getApplicationDefault())
        .setServiceAccountId("firebase-adminsdk-qx7zh@step-collaborative-code-editor.iam.gserviceaccount.com")
        .setDatabaseUrl("https://step-collaborative-code-editor.firebaseio.com/")
        .build();
    FirebaseApp.initializeApp(options);
    DatabaseReference rootRef = FirebaseDatabase.getInstance().getReference();
    return rootRef;
  }
 
  public static void getRevisions(String documentID) throws IOException {
    DatabaseReference rootRef = getFirebase();
    DatabaseReference historyRef = rootRef.child(documentID).child("history");
    final ArrayList<Revision> revisions = new ArrayList<Revision>();
    historyRef.addValueEventListener(new ValueEventListener() {
        @Override
        public void onDataChange(DataSnapshot dataSnapshot) {
          for(DataSnapshot revision : dataSnapshot.getChildren()) {
            revisions.add(revision.getValue(Revision.class));
          }
          // function(revisions)
          // this is async, you need to do all the data manipulations here, ie instead of getRevisions this could be combineRevisions
        }
        @Override
        public void onCancelled(DatabaseError databaseError) {
        }
    });
  }
}