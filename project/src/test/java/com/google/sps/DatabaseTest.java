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
    User newUser = Database.logInUser("gcluo@google.com", "Grace");
    Query query = new Query("User").addFilter(
        "__key__", Query.FilterOperator.EQUAL, KeyFactory.createKey("User", newUser.getUserID()));
    Entity userEntity = ds.prepare(query).asSingleEntity();

    Assert.assertEquals(newUser.getEmail(), (String) userEntity.getProperty("email"));
    Assert.assertEquals(newUser.getNickname(), (String) userEntity.getProperty("nickname"));
    Assert.assertEquals(0, newUser.getDocs().size());
  }

  @Test
  public void testGetUserByEmail() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User newUser = Database.logInUser("gcluo@google.com", "Grace");
    User databaseUser = Database.getUserByEmail(newUser.getEmail());
    Assert.assertEquals(newUser.getUserID(), databaseUser.getUserID());
    Assert.assertEquals(newUser.getNickname(), databaseUser.getNickname());
    Assert.assertEquals(newUser.getDocs().size(), databaseUser.getDocs().size());
  }

  @Test
  public void testGetUserByID() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User newUser = Database.logInUser("gcluo@google.com", "Grace");
    User databaseUser = Database.getUserByID(newUser.getUserID());
    Assert.assertEquals(newUser.getEmail(), databaseUser.getEmail());
    Assert.assertEquals(newUser.getNickname(), databaseUser.getNickname());
    Assert.assertEquals(newUser.getDocs().size(), databaseUser.getDocs().size());
  }

  @Test
  public void testGetUsersDocumentsHashes() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User newUser = Database.logInUser("gcluo@google.com", "Grace");
    ArrayList<String> docHashes = Database.getUsersDocumentsHashes(newUser.getUserID());
    Assert.assertEquals(0, docHashes.size());
  }

  @Test
  public void testCreateDocument() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User newUser = Database.logInUser("gcluo@google.com", "Grace");

    // Check Document Entity for new doc
    String name = "testCreateDocument";
    String language = "java";
    String hash = "xmqw9h332";
    long userID = newUser.getUserID();
    Database.createDocument(name, language, hash, userID);

    Query documentQuery = new Query("Document").addFilter("hash", Query.FilterOperator.EQUAL, hash);
    Entity docEntity = ds.prepare(documentQuery).asSingleEntity();
    Assert.assertEquals(name, (String) docEntity.getProperty("name"));
    Assert.assertEquals(language, (String) docEntity.getProperty("language"));
    Assert.assertEquals(name, (String) docEntity.getProperty("name"));
    ArrayList<Long> userIDs = (ArrayList) docEntity.getProperty("userIDs");
    Assert.assertTrue(userIDs.contains(userID));

    // Check that User Entity also contains new doc
    Query userQuery = new Query("User").addFilter("email", Query.FilterOperator.EQUAL, "gcluo@google.com");
    Entity userEntity = ds.prepare(userQuery).asSingleEntity();
    ArrayList<String> docHashes = (ArrayList) userEntity.getProperty("documents");
    Assert.assertTrue(docHashes.contains(hash));
    System.out.println(newUser.getDocs());
  }
}