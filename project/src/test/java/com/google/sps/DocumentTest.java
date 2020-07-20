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

import java.util.List;
import java.util.ArrayList;

@RunWith(JUnit4.class)
public final class DocumentTest {
  @Test
  public void testGetters() {
    ArrayList<Long> userIDs = new ArrayList<Long>();
    userIDs.add(100000L);
    ArrayList<Long> editorIDs = new ArrayList<Long>();
    ArrayList<Long> viewerIDs = new ArrayList<Long>();
    ArrayList<Long> commentIDs = new ArrayList<Long>();
    Document doc = new Document("new_doc", "python", "x6723hbS", editorIDs, viewerIDs, commentIDs, 100000L, Folder.DEFAULT_FOLDER_ID);

    String name = doc.getName();
    Assert.assertEquals("new_doc", name);

    String lang = doc.getLanguage();
    Assert.assertEquals("python", lang);

    String hash = doc.getHash();
    Assert.assertEquals("x6723hbS", hash);

    long ownerID = doc.getOwnerID();
    Assert.assertEquals(100000L, ownerID);

    ArrayList<Long> testUsers = doc.getUserIDs();
    Assert.assertEquals(userIDs, testUsers);
  }
}