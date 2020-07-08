package com.google.sps.models;

import java.util.ArrayList;

public class Folder {
  public static long DEFAULT_FOLDER_ID = -1;
  String name;
  long folderID;
  ArrayList<String> docHashes;
  ArrayList<Long> userIDs;
  
  public Folder(String name, long folderID, ArrayList<String> docHashes, ArrayList<Long> userIDs) {
    this.name = name;
    this.folderID = folderID;
    this.docHashes = docHashes;
    this.userIDs = userIDs;
  }

  public String getName() {
    return name;
  }

  public long getFolderID() {
    return folderID;
  }

  public ArrayList<String> getDocHashes() {
    return docHashes;
  }

  public ArrayList<Long> getUserIDs() {
    return userIDs;
  }
}