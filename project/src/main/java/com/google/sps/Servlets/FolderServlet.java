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
  Called by the user-home.js and document.jsp.
  GET request returns folder's documents if folderID is provided, 
  else returns list of folders.
  POST request creates folder.
*/
@WebServlet("/Folder")
public class FolderServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String url = request.getRequestURL().toString();
    String folderIDString = (String) request.getParameter("folderID");
    long userID = (long) request.getSession(false).getAttribute("userID");
    User user = Database.getUserByID(userID);
    HashMap<Long, Folder> folders = Database.getFoldersMap(user.getDefaultFolderID());
    HashMap<String, Object> foldersData = new HashMap<String, Object>();
    foldersData.put("defaultFolderID", user.getDefaultFolderID());
    foldersData.put("folders", folders);
    foldersData.put("userNickname", user.getNickname());
    foldersData.put("userEmail", user.getEmail());
    response.setContentType("application/json;");
    response.getWriter().println(convertToJson(foldersData));
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
    long parentFolderID = Long.parseLong(request.getParameter("parentFolderID"));
    long userID = (long) request.getSession(false).getAttribute("userID");
    Database.createFolder(name, userID, parentFolderID);
  }
}