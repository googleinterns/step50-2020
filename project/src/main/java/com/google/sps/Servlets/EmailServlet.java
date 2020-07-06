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
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import com.google.sps.models.Database;
import com.google.sps.models.User;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;


@WebServlet("/Email")
public class EmailServlet extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    long userID = (long) request.getSession(false).getAttribute("userID");
    User user = Database.getUserByID(userID);
    
    String toEmail = request.getParameter("email");
    String fromEmail = user.getEmail();
    String subject = "Invitation to edit document on Collaborative Code Editor";
    String message = "Hi! I have invited you to join my document on Collaborative Code Editor, go to xyz.com to sign up and view!";

    sendEmail(toEmail, fromEmail, subject, message);

  }

  private void sendEmail(String to, String from, String subject, String message){
    Properties props = new Properties();
    Session session = Session.getDefaultInstance(props, null);

    try {
      Message msg = new MimeMessage(session);
      msg.setFrom(new InternetAddress(from, "Example.com Admin"));
      msg.addRecipient(Message.RecipientType.TO, new InternetAddress(to, "Mr. User"));
      msg.setSubject(subject);
      msg.setText(message);
      Transport.send(msg);
    } catch (AddressException e) {
      // ...
    } catch (MessagingException e) {
      // ...
    } catch (UnsupportedEncodingException e) {
      // ...
    }
  }
}