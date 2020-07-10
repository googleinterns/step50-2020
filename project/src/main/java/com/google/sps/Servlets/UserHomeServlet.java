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
  Creates document in the left nav-panel and
  renders them in the right docs-component
*/
@WebServlet("/UserHome")
public class UserHomeServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    long userID = (long) request.getSession(false).getAttribute("userID");
    User user = Database.getUserByID(userID);
  
    HashMap<String, Object> documentsData = new HashMap<String, Object>();
    documentsData.put("nickname", user.getNickname());
    documentsData.put("email", user.getEmail());
    documentsData.put("documents", Database.getUsersDocuments(userID));
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
    String name = request.getParameter("title");
    String language = request.getParameter("language");
    String docHash = request.getParameter("docHash");
    long userID = (long) request.getSession(false).getAttribute("userID");
    Database.createDocument(name, language, docHash, userID);
    String folderID = request.getParameter("folderID");
    if (folderID != null && folderID.length > 0) {
      Database.addDocumentToFolder(docHash, Long.parseLong(folderID));
    }
    response.sendRedirect("/Document?documentHash=" + docHash);
  }
}