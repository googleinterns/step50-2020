package com.google.sps.models;

import java.util.ArrayList;
import java.util.List;

public class User {
  String email, nickname;
  long userID, defaultFolderID;
  ArrayList<String> docHashes;
  
  User(String email, String nickname, long userID, ArrayList<String> docHashes) {
    this.email = email;
    this.nickname = nickname;
    this.userID = userID;
    this.docHashes = docHashes;
  }

  User(String email, String nickname, long userID, ArrayList<String> docHashes, long defaultFolderID) {
    this(email, nickname, userID, docHashes);
    this.defaultFolderID = defaultFolderID;
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

  public long getDefaultFolderID() {
    return defaultFolderID;
  }
}