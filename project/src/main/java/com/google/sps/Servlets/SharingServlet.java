package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.*;
import com.google.sps.models.Database;
import com.google.sps.models.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.ServletException;

@WebServlet("/Share")
@MultipartConfig
public class SharingServlet extends HttpServlet {
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    String email = request.getParameter("email");
    String hash = request.getParameter("documentHash");
    String permissions = request.getParameter("permissions");
    PrintWriter out = response.getWriter();

    long ownerID = (long) request.getSession(false).getAttribute("userID");
    User owner = Database.getUserByID(ownerID);

    if(owner.getEmail() == email) {
      out.println("You cannot share a document with yourself. Please try again.");
    } else if(Database.shareDocument(hash, email, permissions)) {
      out.println("Document shared with " + email);
    } else {
      out.println("User specified does not exist, invitation email has been sent");
      request.getRequestDispatcher("/Email").forward(request, response);
    }
  }
}
