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

@WebServlet("/Auth")
public class AuthServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/html");
    PrintWriter out = response.getWriter();

    UserService userService = UserServiceFactory.getUserService();
    if (userService.isUserLoggedIn()) {
      String userEmail = userService.getCurrentUser().getEmail();
      String urlToRedirectToAfterUserLogsOut = "/User";
      String logoutUrl = userService.createLogoutURL(urlToRedirectToAfterUserLogsOut);
      out.println("<a href=" + logoutUrl
          + "><button><i class=\"fab fa-google\"></i> Sign in with Google</button></a>");
    } else {
      String urlToRedirectToAfterUserLogsIn = "/User";
      String loginUrl = userService.createLoginURL(urlToRedirectToAfterUserLogsIn);

      out.println("<a href=" + loginUrl
          + "><button><i class=\"fab fa-google\"></i> Sign in with Google</button></a>");
    }
  }
}

