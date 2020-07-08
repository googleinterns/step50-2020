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

public class Document {
  String language, name, hash;
  // Using 3 array lists because making inherited 
  // user classes seems redundant as the classes themselves 
  // will have no extra functionality, all functions that are special
  // to the permissions will be done in Document and Database not User
  long ownerID, folderID;
  ArrayList<Long> editorIDs = new ArrayList<Long>();
  ArrayList<Long> viewerIDs = new ArrayList<Long>();
  
  Document(String name, String language, String hash, ArrayList<Long> editorIDs, ArrayList<Long> viewerIDs, long ownerID, long folderID) {
    this.name = name;
    this.language = language;
    this.hash = hash;
    this.ownerID = ownerID;
    this.editorIDs = editorIDs;
    this.viewerIDs = viewerIDs;
    this.folderID = folderID;
  }

  public ArrayList<Long> getUserIDs() {
    ArrayList<Long> userIDs = new ArrayList<Long>();
    if (editorIDs.size() > 0) {
      userIDs.addAll(editorIDs);
    }
    if (viewerIDs.size() > 0) {
      userIDs.addAll(viewerIDs);
    }
    userIDs.add(ownerID);
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

  public long getOwner() {
    return ownerID;
  }

  public ArrayList<Long> getEditorIDs() {
    return editorIDs;
  }

  public ArrayList<Long> getViewerIDs() {
    return viewerIDs;
  }

  public long getFolderID() {
    return folderID;
  }
}