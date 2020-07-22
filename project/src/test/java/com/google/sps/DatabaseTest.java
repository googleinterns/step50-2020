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

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.tools.development.testing.LocalDatastoreServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.List;
import java.util.ArrayList;

@RunWith(JUnit4.class)
public final class DatabaseTest {
  private static final String USER_EMAIL_A = "gcluo@google.com";
  private static final String USER_NICKNAME_A = "Grace";
  private static final String DOC_NAME_A = "Document A";
  private static final String DOC_LANGUAGE_A = "Java";
  private static final String DOC_HASH_A = "xmqw9h332";

  private final LocalServiceTestHelper helper =
      new LocalServiceTestHelper(new LocalDatastoreServiceTestConfig());

  @Before
  public void setUp() {
    helper.setUp();
  }

  @After
  public void tearDown() {
    helper.tearDown();
  }

  @Test
  public void testlogInUser() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User userA = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);
    Query query = new Query("User").addFilter(
        "__key__", Query.FilterOperator.EQUAL, KeyFactory.createKey("User", userA.getUserID()));
    Entity userEntity = ds.prepare(query).asSingleEntity();

    Assert.assertEquals(userA.getEmail(), (String) userEntity.getProperty("email"));
    Assert.assertEquals(userA.getNickname(), (String) userEntity.getProperty("nickname"));
    Assert.assertEquals(0, userA.getDocHashes().size());
  }

  @Test
  public void testGetUserByEmail() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User userA = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);
    User databaseUser = Database.getUserByEmail(userA.getEmail());
    Assert.assertEquals(userA.getUserID(), databaseUser.getUserID());
    Assert.assertEquals(userA.getNickname(), databaseUser.getNickname());
    Assert.assertEquals(userA.getDocHashes().size(), databaseUser.getDocHashes().size());
  }

  @Test
  public void testGetUserByID() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User userA = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);
    User databaseUser = Database.getUserByID(userA.getUserID());
    Assert.assertEquals(userA.getEmail(), databaseUser.getEmail());
    Assert.assertEquals(userA.getNickname(), databaseUser.getNickname());
    Assert.assertEquals(userA.getDocHashes().size(), databaseUser.getDocHashes().size());
  }

  @Test
  public void testGetUsersDocumentsHashes() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User userA = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);
    ArrayList<String> docHashes = Database.getUsersDocumentsHashes(userA.getUserID());
    Assert.assertEquals(0, docHashes.size());
  }

  @Test
  public void testCreateDocument() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User userA = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);

    // Check Document Entity for new doc
    String name = DOC_NAME_A;
    String language = DOC_LANGUAGE_A;
    String hash = DOC_HASH_A;
    long userID = userA.getUserID();
    Database.createDocument(name, language, hash, userID);

    Query documentQuery = new Query("Document").addFilter("hash", Query.FilterOperator.EQUAL, hash);
    Entity docEntity = ds.prepare(documentQuery).asSingleEntity();
    Assert.assertEquals(name, (String) docEntity.getProperty("name"));
    Assert.assertEquals("text/x-java", (String) docEntity.getProperty("language"));

    // Check that User Entity also contains new doc
    Query userQuery = new Query("User").addFilter("email", Query.FilterOperator.EQUAL, USER_EMAIL_A);
    Entity userEntity = ds.prepare(userQuery).asSingleEntity();
    ArrayList<String> docHashes = (ArrayList) userEntity.getProperty("docHashes");
    Assert.assertTrue(docHashes.contains(hash) && docHashes.size() == 1);
  }

  @Test
  public void testGetDocumentByHash() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User userA = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);
    Database.createDocument(DOC_NAME_A, DOC_LANGUAGE_A, DOC_HASH_A, userA.getUserID());
    Document docA = Database.getDocumentByHash(DOC_HASH_A);
    Assert.assertEquals(DOC_NAME_A, docA.getName());
    Assert.assertEquals("text/x-java", docA.getLanguage());
  }

  @Test
  public void testGetDocumentUsers() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User userA = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);
    Database.createDocument(DOC_NAME_A, DOC_LANGUAGE_A, DOC_HASH_A, userA.getUserID());
  }

  @Test
  public void testGetUsersDocuments() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User userA = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);
    Database.createDocument(DOC_NAME_A, DOC_LANGUAGE_A, DOC_HASH_A, userA.getUserID());
    ArrayList<Document> docs = Database.getUsersDocuments(userA.getUserID());
    Document docA = docs.get(0);
    Assert.assertEquals(DOC_NAME_A, docA.getName());
    Assert.assertEquals("text/x-java", docA.getLanguage());
    Assert.assertEquals(DOC_HASH_A, docA.getHash());
    Assert.assertTrue(docs.size() == 1);
  }
}