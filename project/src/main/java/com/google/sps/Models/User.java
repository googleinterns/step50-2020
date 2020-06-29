package com.google.sps.models;

import java.util.ArrayList;
import java.util.List;

public class User {
  String email, nickname;
  long userID;

  ArrayList<String> docHashes = new ArrayList<String>();
  
  User(String email, String nickname, long userID, ArrayList<String> docHashes) {
    this.email = email;
    this.nickname = nickname;
    this.userID = userID;
    this.docHashes = docHashes;
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

  public ArrayList<String> getDocs() {
      return docHashes;
  }
}