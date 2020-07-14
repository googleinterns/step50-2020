<%@ page language="java" contentType="text/html" pageEncoding="UTF-8" %>
<%@ page import="com.google.sps.models.*" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>User Home</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css" />
    <link rel="stylesheet" href="main.css" />
    <script type="module" src="./components/user-home/user-home.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.5.4/firebase.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <script>
        $(document).on("click", "#log-out", function() {
            $.get("Auth", function(responseText) {
                $("#ajaxResponse").html(responseText);
            });
        });
    </script>
    <% User user = null;
        if (session.getAttribute("userID") != null) {
            user = Database.getUserByID((long) session.getAttribute("userID"));
        } else {
          response.sendRedirect("/");  
        } %>
  </head>

  <body>
    <user-home></user-home>
    <div id="ajaxResponse"></div>
    <script>
      function loadDocument(documentHash) {
        window.location.href = "/Document?documentHash=" + documentHash;
      }
      
      function signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function() {
          console.log('User signed out.');
        });
      }
    </script>
  </body>
</html>