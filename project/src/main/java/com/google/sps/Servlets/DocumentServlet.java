package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/* 
  Called by the user-home.html page. 
  Creates document in the left nav-panel and 
  renders them in the right docs-list
*/

@WebServlet("/Document")
public class DocumentServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // retrieve the user's documents 
  }
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // run the current init method
    // after login, the page has the userID (right now create a static one) 
    // Database.createDocument(String name, String language, String hash, long userID);
    String name = request.getParameter("title");
    String language = request.getParameter("language");
    String documentID = request.getParameter("documentID");
    //long userID = (long) request.getSession(false).getAttribute("userID");
    // check if null, then redirect 
    System.out.println(name + " " + language +  " " + documentID);
    // call other servlet with hash
    //Database.createDocument(name, language, documentID, userID);
  }
}