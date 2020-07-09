// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.models;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.PreparedQuery.TooManyResultsException;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.CompositeFilter;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.*;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Database {

  public static final String EDITOR = "Editor";
  public static final String VIEWER = "Viewer";

  private static DatastoreService getDatastore() {
    return DatastoreServiceFactory.getDatastoreService();
  }

  /* User Entity */
  public static User logInUser(String email, String nickname) {
    Query query = new Query("User").addFilter("email", Query.FilterOperator.EQUAL, email);
    Entity userEntity = getDatastore().prepare(query).asSingleEntity();

    if(userEntity != null) {
      ArrayList<String> docHashes = getListProperty(userEntity, "documents");
      return new User(email, nickname, userEntity.getKey().getId(), docHashes);
    } else {
      return createUser(email, nickname);
    }
  }

  public static User getUserByEmail(String email) {
    Query query = new Query("User").addFilter("email", Query.FilterOperator.EQUAL, email);
    Entity userEntity = getDatastore().prepare(query).asSingleEntity();

    if (userEntity == null) {
      return null;
    }

    String nickname = (String) userEntity.getProperty("nickname");
    long userID = userEntity.getKey().getId();
    ArrayList<String> docHashes = getListProperty(userEntity, "documents");
    return new User(email, nickname, userID, docHashes);
  }

  public static User getUserByID(long userID) {
    Query query = new Query("User").addFilter(
        "__key__", Query.FilterOperator.EQUAL, KeyFactory.createKey("User", userID));
    Entity userEntity = getDatastore().prepare(query).asSingleEntity();

    if (userEntity == null) {
      return null;
    }

    String email = (String) userEntity.getProperty("email");
    String nickname = (String) userEntity.getProperty("nickname");
    ArrayList<String> docHashes = getListProperty(userEntity, "documents");

    return new User(email, nickname, userID, docHashes);
  }

  private static User createUser(String email, String nickname) {
    Entity userEntity = new Entity("User");
    ArrayList<String> documents = new ArrayList<String>();

    userEntity.setProperty("email", email);
    userEntity.setProperty("nickname", nickname);
    userEntity.setProperty("documents", documents);
    getDatastore().put(userEntity);
    long userID = userEntity.getKey().getId();

    return new User(email, nickname, userID, documents);
  }

  private static void addDocumentForUser(String hash, long userID) {
    Query query = new Query("User").addFilter(
        "__key__", Query.FilterOperator.EQUAL, KeyFactory.createKey("User", userID));
    Entity userEntity = getDatastore().prepare(query).asSingleEntity();
    ArrayList<String> docHashes = getUsersDocumentsHashes(userID);
    docHashes.add(hash);

    userEntity.setProperty("documents", docHashes);
    getDatastore().put(userEntity);
  }

  public static ArrayList<String> getUsersDocumentsHashes(long userID) {
    User user = getUserByID(userID);
    return user.getDocs();
  }

  /* Document Entity */
  public static Document createDocument(String name, String language, String hash, long ownerID) {
      // Static version where when document is shared, the userID gets appended to the array.
      Entity docEntity = new Entity("Document");
      ArrayList<Long> editorIDs = new ArrayList<Long>();
      ArrayList<Long> viewerIDs = new ArrayList<Long>();
      
      docEntity.setProperty("name", name);
      docEntity.setProperty("language", language);
      docEntity.setProperty("hash", hash);
      docEntity.setProperty("ownerID", ownerID);
      docEntity.setProperty("editorIDs", editorIDs);
      docEntity.setProperty("viewerIDs", viewerIDs);
      getDatastore().put(docEntity);

      addDocumentForUser(hash, ownerID);
      return new Document(name, language, hash, editorIDs, viewerIDs, ownerID);
  }

  public static Document getDocumentByHash(String hash) {
    Query query = new Query("Document").addFilter("hash", Query.FilterOperator.EQUAL, hash);
    Entity docEntity = getDatastore().prepare(query).asSingleEntity();

    if (docEntity == null) {
      return null;
    }

    String name = (String) docEntity.getProperty("name");
    String language = (String) docEntity.getProperty("language");
    long ownerID = (long) docEntity.getProperty("ownerID");
    ArrayList<Long> editorIDs = getListProperty(docEntity, "editorIDs");
    ArrayList<Long> viewerIDs = getListProperty(docEntity, "viewerIDs");
    return new Document(name, language, hash, editorIDs, viewerIDs, ownerID);
  }

  public static ArrayList<Long> getDocumentUsers(String hash) {
    Query query = new Query("Document").addFilter("hash", Query.FilterOperator.EQUAL, hash);
    Entity docEntity = getDatastore().prepare(query).asSingleEntity();

    if (docEntity == null) {
      return null;
    }

    Document doc = getDocumentByHash(hash);
    ArrayList<Long> userIDs = doc.getUserIDs();
    return userIDs;
  }

  public static ArrayList<Long> getDocumentEditors(String hash) {
    Query query = new Query("Document").addFilter("hash", Query.FilterOperator.EQUAL, hash);
    Entity docEntity = getDatastore().prepare(query).asSingleEntity();

    if (docEntity == null) {
      return null;
    }

    Document doc = getDocumentByHash(hash);
    ArrayList<Long> editorIDs = doc.getEditorIDs();
    return editorIDs;
  }

  public static ArrayList<Long> getDocumentViewers(String hash) {
    Query query = new Query("Document").addFilter("hash", Query.FilterOperator.EQUAL, hash);
    Entity docEntity = getDatastore().prepare(query).asSingleEntity();

    if (docEntity == null) {
      return null;
    }

    Document doc = getDocumentByHash(hash);
    ArrayList<Long> viewerIDs = doc.getViewerIDs();
    return viewerIDs;
  }

  public static ArrayList<Document> getUsersDocuments(long userID) {
    ArrayList<String> docHashes = getUsersDocumentsHashes(userID);
    ArrayList<Document> docs = new ArrayList<Document>();
    for (String hash : docHashes) {
      Document doc = getDocumentByHash(hash);
      docs.add(doc);
    }
    return docs;
  }

  // Takes in a Document hash and a User email
  // Adds the userID to the Document's list of Users
  // Adds the Document's hash to the User's list of Documents
  // Returns true if successful, false if the user doesn't exist
  public static boolean shareDocument(String hash, String email, String permissions) {
    Query query = new Query("User").addFilter("email", Query.FilterOperator.EQUAL, email);
    Entity userEntity = getDatastore().prepare(query).asSingleEntity();

    if (userEntity == null) {
      return false;
    }

    long userID = userEntity.getKey().getId();
    
    if(getUsersDocumentsHashes(userID).contains(hash)) {
      return true;
    }

    addDocumentForUser(hash, userID);
    addUserForDocument(hash, userID, permissions);

    return true;
  }

  // Takes a Document hash and a userID
  // Adds the userID to the Document's list of users
  public static void addUserForDocument(String hash, long userID, String permissions) {
    Query query = new Query("Document").addFilter("hash", Query.FilterOperator.EQUAL, hash);
    Entity docEntity = getDatastore().prepare(query).asSingleEntity();

    if (permissions.equals(EDITOR)) {
      ArrayList<Long> editorIDs = getDocumentEditors(hash);

      editorIDs.add(userID);
      docEntity.setProperty("editorIDs", editorIDs);
      getDatastore().put(docEntity);
    }
    else if (permissions.equals(VIEWER)) {
      ArrayList<Long> viewerIDs = getDocumentViewers(hash);

      viewerIDs.add(userID);
      docEntity.setProperty("viewerIDs", viewerIDs);
      getDatastore().put(docEntity);
    }
  }
    
  // Datastore does not support empty collections (it will be stored as null)
  // https://cloud.google.com/appengine/docs/standard/java/datastore/entities#Using_an_empty_list
  private static ArrayList getListProperty(Entity entity, String prop) {
    ArrayList items = (ArrayList) entity.getProperty(prop);
    if (items == null) {
      return new ArrayList();
    } else {
      return items;
    }
  }
}
