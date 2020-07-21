package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;  
import com.google.sps.models.Database;
import com.google.sps.models.Comment;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/Comment")
public class CommentServlet extends HttpServlet {
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/html");
    PrintWriter out = response.getWriter();

    System.out.println(request.getParameter("commentData"));
    System.out.println(request.getParameter("commentDate"));

    long userID = (long) request.getSession(false).getAttribute("userID");
    String commentData = request.getParameter("commentData");
    String date = request.getParameter("commentDate");

    long commentID = Database.createComment(userID, commentData, date);

    if ("POST".equalsIgnoreCase(request.getMethod())) 
    {
      System.out.println(request.getReader().lines().collect(Collectors.joining(System.lineSeparator())));
    }


    System.out.println(request.getParameterNames());

    out.println(commentID);
  }
}