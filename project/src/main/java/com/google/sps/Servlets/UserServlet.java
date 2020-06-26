package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.*;
import com.google.sps.models.Database;
import com.google.sps.models.User;
import java.io.IOException;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/User")
public class UserServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    UserService userService = UserServiceFactory.getUserService();
    if (userService.isUserLoggedIn()) {
      HttpSession session = request.getSession(true);

      String userEmail = userService.getCurrentUser().getEmail();
      String nickname = userService.getCurrentUser().getNickname();

      User user = Database.logInUser(userEmail, nickname);
      session.setAttribute("userID", user.getUserID());

    } else {
      request.getSession(false).invalidate();
    }

//     String hash = "MAYYw2CqGI_NOJIi4su";
//     request.setAttribute("documentHash", hash);
//     try {
//       request.getRequestDispatcher("/document.jsp#-" + hash).forward(request, response);
//     } catch (Exception e) {
//       response.sendRedirect("/");
//     }
    response.sendRedirect("/user-home.html");
  }
}
