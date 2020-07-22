package com.google.sps.models;

import java.util.ArrayList;

public class Folder {
  String name;
  long folderID;
  ArrayList<String> docHashes;
  ArrayList<Long> folderIDs;
  ArrayList<Folder> folders;
  
  Folder(String name, long folderID, ArrayList<String> docHashes, ArrayList<Long> folderIDs) {
    this.name = name;
    this.folderID = folderID;
    this.docHashes = docHashes;
    this.folderIDs = folderIDs;
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

  public ArrayList<Long> getFolderIDs() {
    return folderIDs;
  }

  public void setFolders(ArrayList<Folder> folders) {
    this.folders = folders;
  }

  public ArrayList<Folder> getFolders() {
    return folders;
  }
}