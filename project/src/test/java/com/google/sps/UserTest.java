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
public final class UserTest {

  @Test
  public void testEmail() {
    ArrayList<String> docs = new ArrayList<String>();
    User user = new User("tinodore@google.com", "Tino", 100000L, docs);

    String email = user.getEmail();
    Assert.assertEquals("tinodore@google.com", email);

    String name = user.getNickname();
    Assert.assertEquals("Tino", name);

    long ID = user.getUserID();
    Assert.assertEquals(100000L, ID);

    ArrayList<String> userDocs = user.getDocs();
    Assert.assertEquals(docs, userDocs);

    // Testing with a populated array
    ArrayList<String> docs2 = new ArrayList<String>();
    User user2 = new User("tinodore@google.com", "Tino", 100000L, docs2);

    ArrayList<String> userDocs2 = user.getDocs();
    Assert.assertEquals(docs2, userDocs2);
  }
} 
