package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.*;
import com.google.sps.models.Database;
import com.google.sps.models.Folder;
import com.google.sps.models.User;
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
  // pass the folder hash
  // get a list of folders from the backend
*/
@WebServlet("/Folder")
public class FolderServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String url = request.getRequestURL().toString();
    String[] urlSplit = url.split("folderID=");
    boolean getFolderList = urlSplit.length == 1;
    long userID = (long) request.getSession(false).getAttribute("userID");
    if (getFolderList) {
      // append new document and default
      ArrayList<Folder> folders = Database.getUsersFolders(userID);
      String foldersJSON = convertToJson(folders);
      response.setContentType("application/json;");
      response.getWriter().println(foldersJSON);
    } else {
      long folderID = Long.parseLong(urlSplit[1]);
      User user = Database.getUserByID(userID);
      Folder folder = Database.getFolderByID(folderID);
      // get the folderID; probably also need foldername, etc 
      String documentsJSON = convertToJson(Database.getFoldersDocuments(folderID));
      HashMap<String, String> documentsData = new HashMap<String, String>();
      documentsData.put("userNickname", user.getNickname());
      documentsData.put("userEmail", user.getEmail());
      documentsData.put("folderName", folder.getName());
      documentsData.put("documents", documentsJSON);
      String documentsDataJSON = convertToJson(documentsData);
      response.setContentType("application/json;");
      response.getWriter().println(documentsDataJSON);
    }
  }

  // Accepts any Java Object, where each {key: value}
  // will be the object's attribute and its assigned value.
  private String convertToJson(Object obj) {
    Gson gson = new Gson();
    String json = gson.toJson(obj);
    return json;
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String name = request.getParameter("folderName");
    long userID = (long) request.getSession(false).getAttribute("userID");
    Database.createFolder(name, userID);
  }
}