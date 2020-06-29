package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.*;
import com.google.sps.models.Database;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*
  Called by the user-home.html page.
  Creates document in the left nav-panel and
  renders them in the right docs-list
*/

@WebServlet("/UserHome")
public class UserHomeServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    long userID = (long) request.getSession(false).getAttribute("userID");
    String documents = convertToJson(Database.getUsersDocuments(userID));
    // add the userID in the future
    response.setContentType("application/json;");
    response.getWriter().println(documents);
  }

  private String convertToJson(List lst) {
    Gson gson = new Gson();
    String json = gson.toJson(lst);
    return json;
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String name = request.getParameter("title");
    String language = request.getParameter("language");
    String documentID = request.getParameter("documentID");
    long userID = (long) request.getSession(false).getAttribute("userID");
    // check if null, then redirect
    Database.createDocument(name, language, documentID, userID);
    response.sendRedirect("/Document?documentHash=" + documentID);
  }
}