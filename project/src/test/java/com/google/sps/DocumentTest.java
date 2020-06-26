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
  public void testName() {
    ArrayList<Long> userIDs = new ArrayList<Long>();
    Document doc = new Document("new_doc", "python", "x6723hbS", userIDs);

    String name = doc.getName();

    Assert.assertEquals("new_doc", name);
  }

  @Test
  public void testLang() {
    ArrayList<Long> userIDs = new ArrayList<Long>();
    Document doc = new Document("new_doc", "python", "x6723hbS", userIDs);

    String lang = doc.getLanguage();

    Assert.assertEquals("python", lang);
  }

  @Test
  public void testHash() {
    ArrayList<Long> userIDs = new ArrayList<Long>();
    Document doc = new Document("new_doc", "python", "x6723hbS", userIDs);

    String hash = doc.getHash();

    Assert.assertEquals("x6723hbS", hash);
  }

  @Test
  public void testUsers() {
    ArrayList<Long> userIDs = new ArrayList<Long>();
    Document doc = new Document("new_doc", "python", "x6723hbS", userIDs);

    ArrayList<Long> testUsers = doc.getUserIDs();

    Assert.assertEquals(userIDs, testUsers);

    ArrayList<Long> userIDs2 = new ArrayList<Long>();
    userIDs2.add(100000L);
    Document doc2 = new Document("new_doc", "python", "x6723hbS", userIDs2);

    ArrayList<Long> testUsers2 = doc2.getUserIDs();

    Assert.assertEquals(userIDs2, testUsers2);
  }
}
