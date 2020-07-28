package com.google.sps.servlets;

import com.google.gson.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import com.google.sps.models.Database;
import com.google.sps.models.Comment;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/DeleteComment")
public class DeleteCommentServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    long commentID = Long.parseLong(request.getParameter("commentID"));
    String hash = request.getParameter("documentHash");
    Database.deleteComment(hash, commentID);
    response.getWriter().println();
  }
}
