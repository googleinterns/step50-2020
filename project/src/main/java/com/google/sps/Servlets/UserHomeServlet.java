package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.*;
import com.google.sps.models.Database;
import com.google.sps.models.User;
import com.google.sps.models.Folder;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*
  Called by the user-home.html page.
  Creates document in the left nav-panel and
  renders them in the right docs-component
*/
@WebServlet("/UserHome")
public class UserHomeServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String name = request.getParameter("title");
    String language = request.getParameter("language");
    String docHash = request.getParameter("docHash");
    long userID = (long) request.getSession(false).getAttribute("userID");
    Database.createDocument(name, language, docHash, userID);
    String folderID = request.getParameter("folderID");
    if (isValidFolderID(folderID)) {
      Database.moveDocumentToFolder(docHash, Long.parseLong(folderID));
    }
    response.sendRedirect("/Document?documentHash=" + docHash);
  }

  private boolean isValidFolderID(String folderID) {
    return folderID != null 
      && !folderID.equals("undefined") 
      && folderID.length() > 0;
  }
}