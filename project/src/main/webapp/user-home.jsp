<%@ page language="java" contentType="text/html" pageEncoding="UTF-8" %>
<%@ page import="com.google.sps.models.*" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Document</title>
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
    <div class="sign-out">
      <a href="/_ah/logout?continue=https://accounts.google.com/Logout%3Fcontinue%3Dhttps://appengine.google.com/_ah/logout%253Fcontinue%253Dhttps://google.com/url%25253Fsa%25253DD%252526q%25253Dhttps://step-collaborative-code-editor.uc.r.appspot.com/User%252526ust%25253D1594489239991384%252526usg%25253DAFQjCNErDNx1Pps-gTuvqlRbUPIe01wpgA%26service%3Dah"><button class="primary-blue-btn"> Sign out </button></a>
    </div>
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
