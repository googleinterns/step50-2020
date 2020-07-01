<%@ page language="java" contentType="text/html" pageEncoding="UTF-8" %>
<%@ page import="com.google.sps.models.*" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>User's Documents</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css" />
    <link rel="stylesheet" href="main.css" />
    <script type="module" src="./components/user-home/nav-panel.js"></script>
    <script type="module" src="./components/user-home/docs-component.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.5.4/firebase.js"></script>
    
    <% User user = null;
        if (session.getAttribute("userID") != null) {
            user = Database.getUserByID((long) session.getAttribute("userID"));
        } else {
          response.sendRedirect("/");  
        } %>
  </head>

  <body>
    <div class="columns full-width full-height">
      <div class="column is-one-quarter nav-panel">
        <nav-panel></nav-panel>
      </div>
      <div class="column is-three-quarters docs-component">
        <docs-component></docs-component>
      </div>
    </div>

    <script>
      function loadDocument(documentHash) {
        window.location.href = "/Document?documentHash=" + documentHash;
      }
    </script>
  </body>
</html>