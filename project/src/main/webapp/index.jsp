<%@ page language="java" contentType="text/html" pageEncoding="UTF-8" %>
<%@ page import="com.google.sps.models.*" %>
<!DOCTYPE html>
<html>
  <div class="landing">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <title>Log In</title>
      <link rel="stylesheet" href="main.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css">
      <% User user = null;
      if (session.getAttribute("userID") != null) {
          response.sendRedirect("/user-home.jsp"); 
      } %>
    </head>
      
    <body onload="load()">
      <div class="box has-text-centered" id="center-container">
        <p id="title"> Collaborative Text Editor </p>
        <p id="description"> A collaborative code editor where you can work on code snippets in sync</p>
        <div id="signin-buttons">
          <a href="/"><button id="demo-button"> Demo </button></a>
        </div>
      </div>
      <div class="wrapper">
        <div class="features">
          <p class="subtitle"><b>Features in this release</b></p>
          <div class="columns">
            <div class="column has-text-centered">
              <img src='./assets/sharing.png' />
              <p>Sharing</p>
            </div>
            <div class="column has-text-centered">
              <img src='./assets/commenting.png' />
              <p>Commenting</p>
            </div>
            <div class="column has-text-centered">
              <img src='./assets/versioning.png' />
              <p>Versioning</p>
            </div>
          </div>
        </div>
        <div class="team">
          <p class="subtitle"><b>Our team</b></p>
          <div class="columns">
            <div class="column has-text-centered">
              <img src='./assets/max.jpg' />
              <p>Max Friedman</p>
              <p>Insert text here</p>
            </div>
            <div class="column has-text-centered">
              <img src='./assets/grace.jpg' />
              <p>Grace Luo</p>
              <p>Hi! I'm Grace...</p>
            </div>
            <div class="column has-text-centered">
              <img src='./assets/tino.jpg' />
              <p>Valentino Dore</p>
              <p>Insert text here</p>
            </div>
          </div>
        </div>
      </div>
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
  </div>
</html>