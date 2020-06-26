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

@WebServlet("/Document")
public class DocumentServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String hash = request.getParameter("documentHash");
    request.setAttribute("documentHash", hash);
    try {
      request.getRequestDispatcher("/document.jsp#-" + hash).forward(request, response);
    } catch (Exception e) {
      System.out.println(e.toString());
      response.sendRedirect("/XD");
    }
  }
}