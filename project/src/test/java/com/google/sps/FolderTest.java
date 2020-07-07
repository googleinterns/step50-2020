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

@RunWith(JUnit4.class)
public final class FolderTest {
  private static final String USER_EMAIL_A = "gcluo@google.com";
  private static final String USER_NICKNAME_A = "Grace";
  private static final String DOC_NAME_A = "Document A";
  private static final String DOC_LANGUAGE_A = "Java";
  private static final String DOC_HASH_A = "xmqw9h332";
  private static final String FOLDER_A = "Test Folder";

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
    User userA = Database.logInUser(USER_EMAIL_A, USER_NICKNAME_A);
    Database.createFolder(FOLDER_A, userA.getUserID());

    // Ensure user has folder
    userA = Database.getUserByID(userA.getUserID());
    ArrayList<Long> userFolderIDs = userA.getFolderIDs();
    long userFolder = userFolderIDs.get(0);
    Assert.assertEquals(1, userFolderIDs.size());

    // Ensure database has folder entity
    Query folderQuery = new Query("Folder").addFilter("name", Query.FilterOperator.EQUAL, FOLDER_A);
    Entity folderEntity = ds.prepare(folderQuery).asSingleEntity();
    ArrayList<Long> userIDs = (ArrayList<Long>) folderEntity.getProperty("userIDs");
    long folderUser = userIDs.get(0);
    long folderID = folderEntity.getKey().getId();
    
    Assert.assertEquals(1, userIDs.size());
    Assert.assertEquals(userA.getUserID(), folderUser);
    Assert.assertEquals(userFolder, folderID);
  }
}