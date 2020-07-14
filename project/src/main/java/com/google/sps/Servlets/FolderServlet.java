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
  GET request returns folder's documents if folderID is provided, 
  else returns list of folders.
  POST request creates folder.
*/
@WebServlet("/Folder")
public class FolderServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    long userID = (long) request.getSession(false).getAttribute("userID");
    ArrayList<Folder> folders = Database.getUsersFolders(userID);
    HashMap<String, Object> foldersData = new HashMap<String, Object>();
    foldersData.put("defaultFolderID", Folder.DEFAULT_FOLDER_ID);
    foldersData.put("folders", folders);
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
    long userID = (long) request.getSession(false).getAttribute("userID");
    Database.createFolder(name, userID);
  }
}