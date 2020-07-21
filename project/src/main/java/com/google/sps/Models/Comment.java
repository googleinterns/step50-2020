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

import java.util.Date;

public class Comment {
  long commentID, userID;
  String data, date;

  Comment(long commentID, long userID, String data, String date) {
    this.commentID = commentID;
    this.userID = userID;
    this.data = data;
    this.date = date;
  }

  public long getCommentID() {
    return commentID;
  }

  public long getUserID() {
    return userID;
  }

  public String getData() {
    return data;
  }

  public String getDate() {
    return date;
  }
}