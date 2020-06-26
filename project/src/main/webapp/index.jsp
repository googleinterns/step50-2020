<%@ page language="java" contentType="text/html" pageEncoding="UTF-8" %>
<%@ page import="com.google.sps.models.*" %>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Log In</title>
    <link rel="stylesheet" href="main.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css">
    <% User user = null;
    if (session.getAttribute("userID") != null) {
        user = Database.getUserByID((long) session.getAttribute("userID")); 
    } %>
  </head>
    
  <body onload="load()">

    <div class="columns is-centered is-vcentered" id="login-columns">
      <div class="column is-narrow">
        <div class="box has-text-centered" id="center-container">
          <p id="title"> Collaborative Text Editor </p>
          <p id="description"> A collaborative code editor where you can work on code snippets in sync</p>
          <div id="signin-buttons">
          <a href="/"><button id="demo-button"> Demo </button></a>
          </div>
        </div> 
      </div>
    </div>
    
    <% if (session.getAttribute("userID") != null) { %>
    <p> <%= session.getAttribute("userID") %>, <%= user.getNickname() %> </p>
    <% } %>

    <script>
      function load() {
        //Add if user is logged in then redirect them to their documents page
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/Auth", true);
        xhttp.onreadystatechange = function() {
          if(xhttp.readyState == 4 && xhttp.status == 200) {
            document.getElementById("signin-buttons").innerHTML += this.responseText;
          }
        }
        xhttp.send();
      }
    </script>

  </body>
</html>
