package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.*;
import com.google.sps.models.Database;
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
    // if no argument, returns a list of folders w name + id
    // if argument, return 
    long userID = (long) request.getSession(false).getAttribute("userID");
    User user = Database.getUserByID(userID);
    String documentsJSON = convertToJson(Database.getUsersDocuments(userID));
    
    HashMap<String, String> documentsData = new HashMap<String, String>();
    documentsData.put("nickname", user.getNickname());
    documentsData.put("email", user.getEmail());
    documentsData.put("documents", documentsJSON);
    String documentsDataJSON = convertToJson(documentsData);
    response.setContentType("application/json;");
    response.getWriter().println(documentsDataJSON);
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
    //Database.createFolder(name, userID);
  }
}