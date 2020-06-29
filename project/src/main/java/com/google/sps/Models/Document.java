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

import java.util.List;
import java.util.ArrayList;

public class Document{
  // userIDs is a list of people who can access the current document
  // permissions are not setup yet so "owners" and "collaborators" have not yet been setup
  String language, name, hash;
  ArrayList<Long> userIDs = new ArrayList<Long>();
  
  Document(String name, String language, String hash, ArrayList<Long> userIDs) {
    this.name = name;
    this.language = language;
    this.hash = hash;
    this.userIDs = userIDs;
  }

  public ArrayList<Long> getUserIDs() {
    return userIDs;
  }

  public String getName() {
    return name;
  }
 
  public String getLanguage() {
    return language;
  }

  public String getHash() {
    return hash;
  }
}