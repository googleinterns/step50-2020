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
      
    <meta charset="utf-8" />
    <title>Collaborative Text Editor</title>
    <script src="https://www.gstatic.com/firebasejs/5.5.4/firebase.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/codemirror.js"></script>
    <script src="mode/python/python.js"></script>
    <script src="mode/javascript/javascript.js"></script>
    <script src="mode/go/go.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/codemirror.css" />
    <link rel="stylesheet" href="https://firepad.io/releases/v1.5.9/firepad.css" />
    <link rel="stylesheet" href="https://codemirror.net/theme/ayu-dark.css" />
    <link rel="stylesheet" href="https://codemirror.net/theme/neo.css" />
    <link rel="stylesheet" href="https://codemirror.net/theme/monokai.css" />
    <script src="https://firepad.io/releases/v1.5.9/firepad.min.js"></script>
    <link rel="stylesheet" href="style.css" />
    <script src="script.js"></script>
    <style>
      html {
        height: 100%;
      }
      body {
        margin: 0;
        height: 100%;
        position: relative;
      }
      /* Height / width / positioning can be customized for your use case.
          For demo purposes, we make firepad fill the entire browser. */
      #firepad-container {
        width: 100%;
        height: 100%;
      }

      /* Header/Logo Title */
      .header {
        height: 45px;
        background: white;
        border: 1px solid grey;
      }

      /* the toolbar with operations */
      .operations {
        height: 19px;
        padding: 5px;
        background: white;
        border: 1px solid grey;
      }

      selectTheme {
        -webkit-writing-mode: horizontal-tb !important;
        text-rendering: auto;
        color: -internal-light-dark-color(black, white);
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;
        display: inline-block;
        text-align: start;
        -webkit-appearance: menulist;
        box-sizing: border-box;
        align-items: center;
        white-space: pre;
        -webkit-rtl-ordering: logical;
        background-color: -internal-light-dark-color(white, black);
        cursor: default;
        margin: 0em;
        font: 400 13.3333px Arial;
        border-radius: 0px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(169, 169, 169);
        border-image: initial;
      }
      selectLang {
        -webkit-writing-mode: horizontal-tb !important;
        text-rendering: auto;
        color: -internal-light-dark-color(black, white);
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;
        display: inline-block;
        text-align: start;
        -webkit-appearance: menulist;
        box-sizing: border-box;
        align-items: center;
        white-space: pre;
        -webkit-rtl-ordering: logical;
        background-color: -internal-light-dark-color(white, black);
        cursor: default;
        margin: 0em;
        font: 400 13.3333px Arial;
        border-radius: 0px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(169, 169, 169);
        border-image: initial;
      }
    </style>
  </head>

  <body onload="init()">
    <div class="header">
      <% User user = null;
        if (session.getAttribute("userID") != null) {
            user = Database.getUserByID((long) session.getAttribute("userID")); %>
            <%= user.getNickname() %>
        <% } else {
          response.sendRedirect("/login.jsp");  
        } %>
    </div>
    <div class="operations">
      Language:
      <select onchange="changeLanguage()" id="selectLang">
        <option selected>python</option>
        <option>javascript</option>
        <option>go</option>
      </select>
      Theme:
      <select onchange="changeTheme()" id="selectTheme">
        <option selected>neo</option>
        <option>ayu-dark</option>
        <option>monokai</option>
      </select>

  </body>
</html>