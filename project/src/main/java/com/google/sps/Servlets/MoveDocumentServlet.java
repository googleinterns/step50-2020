package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.*;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import com.google.sps.models.Database;

@WebServlet("/MoveDocument")
public class MoveDocumentServlet extends HttpServlet {
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    String docHash = request.getParameter("docHash");
    long folderID = Long.parseLong(request.getParameter("folderID"));
    Database.moveDocumentToFolder(docHash, folderID);
  }
}