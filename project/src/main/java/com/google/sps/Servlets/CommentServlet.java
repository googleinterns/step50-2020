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
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/Comment")
@MultipartConfig
public class CommentServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String hash = request.getParameter("documentHash");
    ArrayList<Comment> comments = Database.getDocumentComments(hash);
    
    response.setContentType("application/json;");
    response.getWriter().println(convertToJson(comments));
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("text/html");
    PrintWriter out = response.getWriter();

    long userID = (long) request.getSession(false).getAttribute("userID");
    String commentData = request.getParameter("commentData");
    String date = request.getParameter("commentDate");
    String hash = request.getParameter("documentHash");

    long commentID = Database.createComment(userID, commentData, date, hash);

    out.println(commentID);
  }

  private String convertToJson(Object obj) {
    Gson gson = new Gson();
    String json = gson.toJson(obj);
    return json;
  }
}
