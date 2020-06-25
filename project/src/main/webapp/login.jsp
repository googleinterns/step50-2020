<%@ page language="java" contentType="text/html" pageEncoding="UTF-8" %>
<%@ page import="com.google.sps.models.*" %>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Log In</title>
    <link rel="stylesheet" href="main.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css" />
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />

    <% User user = null;
    if (session.getAttribute("userID") != null) {
        user = Database.getUserByID((long) session.getAttribute("userID")); 
    } %>
  </head>
    
  <body onload="load()">

    <div class="columns is-centered is-vcentered" id="login-columns">
      <div class="column is-narrow">
        <div class="box has-text-centered" id="center-container"></div> 
      </div>
    </div>
    
    
    <% if (session.getAttribute("userID") != null) { %>
    <p> <%= session.getAttribute("userID") %>, <%= user.getNickname() %> </p>
    <% } %>

    <script>
      function load() {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/Auth", true);
        xhttp.onreadystatechange = function() {
          document.getElementById("center-container").innerHTML = this.responseText;
        }
        xhttp.send();
      }
    </script>

  </body>
</html>