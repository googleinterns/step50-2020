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

import java.util.ArrayList;
import java.util.Arrays;

@RunWith(JUnit4.class)
public final class FolderTest {
  private static final String USER_EMAIL_A = "gcluo@google.com";
  private static final String USER_NICKNAME_A = "Grace";
  private static final String DOC_NAME_A = "Document A";
  private static final String DOC_LANGUAGE_A = "Java";
  private static final String DOC_HASH_A = "xmqw9h332";
  private static final String FOLDER_A = "Test Folder A";
  private static final String FOLDER_B = "Test Folder B";

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
  public void testCreateFolder() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User user = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);
    Database.createFolder(FOLDER_A, user.getUserID());

    // Ensure user has folder
    user = Database.getUserByID(user.getUserID());

    // Ensure database has folder entity
    Query folderQuery = new Query("Folder").addFilter("name", Query.FilterOperator.EQUAL, FOLDER_A);
    Entity folderEntity = ds.prepare(folderQuery).asSingleEntity();
    ArrayList<Long> userIDs = (ArrayList<Long>) folderEntity.getProperty("userIDs");
    
    Assert.assertEquals(Arrays.asList(user.getUserID()), userIDs);
    Assert.assertEquals(user.getFolderIDs(), Arrays.asList(folderEntity.getKey().getId()));
  }

  @Test
  public void testGetFolderByID() {
    DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    User user = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);
    Folder folder = Database.createFolder(FOLDER_A, user.getUserID());
    Folder queryFolder = Database.getFolderByID(folder.getFolderID());

    Assert.assertEquals(folder.getName(), queryFolder.getName());
    Assert.assertEquals(folder.getFolderID(), queryFolder.getFolderID());
    Assert.assertEquals(folder.getDocHashes(), queryFolder.getDocHashes());
    Assert.assertEquals(folder.getUserIDs(), queryFolder.getUserIDs());
  }

  @Test
  public void testAddDocumentToFolder() {
    User user = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);
    Document doc = Database.createDocument(DOC_NAME_A, DOC_LANGUAGE_A, DOC_HASH_A, user.getUserID());
    Folder folder = Database.createFolder(FOLDER_A, user.getUserID());
    Database.addDocumentToFolder(doc.getHash(), folder.getFolderID());
    folder = Database.getFolderByID(folder.getFolderID());
    Assert.assertEquals(Arrays.asList(doc.getHash()), folder.getDocHashes());
  }

  @Test
  public void testMoveDocumentFolders() {
    User user = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);
    Document doc = Database.createDocument(DOC_NAME_A, DOC_LANGUAGE_A, DOC_HASH_A, user.getUserID());
    Folder folderA = Database.createFolder(FOLDER_A, user.getUserID());
    Folder folderB = Database.createFolder(FOLDER_B, user.getUserID());
   
    Database.addDocumentToFolder(doc.getHash(), folderA.getFolderID());
    Database.addDocumentToFolder(doc.getHash(), folderB.getFolderID());

    folderA = Database.getFolderByID(folderA.getFolderID());
    folderB = Database.getFolderByID(folderB.getFolderID());
    Assert.assertEquals(Arrays.asList(), folderA.getDocHashes());
    Assert.assertEquals(Arrays.asList(doc.getHash()), folderB.getDocHashes());
  }

  @Test
  public void testGetUsersFolderIDs() {
    User user = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);
    Document doc = Database.createDocument(DOC_NAME_A, DOC_LANGUAGE_A, DOC_HASH_A, user.getUserID());
    Folder folderA = Database.createFolder(FOLDER_A, user.getUserID());
    Folder folderB = Database.createFolder(FOLDER_B, user.getUserID());
    ArrayList<Long> folders = Database.getUsersFolderIDs(user.getUserID());
   
    Assert.assertEquals(Arrays.asList(folderA.getFolderID(), folderB.getFolderID()), folders);
  }
}