package com.google.sps.models;

import java.util.List;
import java.util.ArrayList;

public class Revision {
  private String revisionID;
  private String a;
  private ArrayList<String> o;
  private long t;
  
  Revision() {
  }

  Revision(String a, ArrayList<String> o, long t) {
    this.a = a;
    this.o = o;
    this.t = t;
  }

  public String getA() {
    return this.a;
  }

  public ArrayList<String> getO() {
    return this.o;
  }

  public long getT() {
    return this.t;
  }
}