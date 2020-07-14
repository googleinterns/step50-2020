package com.google.sps.models;

import java.util.ArrayList;
import java.util.List;

public class User {
  String email, nickname;
  long userID;
  ArrayList<String> docHashes;
  ArrayList<Long> folderIDs;
  
  User(String email, String nickname, long userID, ArrayList<String> docHashes) {
    this.email = email;
    this.nickname = nickname;
    this.userID = userID;
    this.docHashes = docHashes;
    this.folderIDs = new ArrayList<Long>();
  }

  User(String email, String nickname, long userID, ArrayList<String> docHashes, ArrayList<Long> folderIDs) {
    this.email = email;
    this.nickname = nickname;
    this.userID = userID;
    this.docHashes = docHashes;
    this.folderIDs = folderIDs;
  }

  public long getUserID() {
    return userID;
  }

  public String getNickname() {
    return nickname;
  }

  public String getEmail() {
    return email;
  }

  public ArrayList<String> getDocHashes() {
    return docHashes;
  }

  public ArrayList<Long> getFolderIDs() {
    return folderIDs;
  }
}