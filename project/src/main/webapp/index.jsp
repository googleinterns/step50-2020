<%@ page language="java" contentType="text/html" pageEncoding="UTF-8" %>
<%@ page import="com.google.sps.models.*" %>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Collaborative Text Editor</title>
    <script src="https://www.gstatic.com/firebasejs/5.5.4/firebase.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/codemirror.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/mode/javascript/javascript.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.17.0/mode/python/python.js"></script>
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
      </select>
      Theme:
      <select onchange="changeTheme()" id="selectTheme">
        <option selected>neo</option>
        <option>ayu-dark</option>
        <option>monokai</option>
      </select>
    </div>
    <div id="firepad-container"></div>

    <script>
      //// Create CodeMirror (with line numbers and the JavaScript mode).
      var codeMirror = CodeMirror(document.getElementById("firepad-container"), {
        lineNumbers: true,
        mode: "python",
        theme: "neo",
      })

      function init() {
        //// Initialize Firebase.
        //// TODO: replace with your Firebase project configuration.
        var config = {
            apiKey: 'AIzaSyDUYns7b2bTK3Go4dvT0slDcUchEtYlSWc',
            authDomain: "step-collaborative-code-editor.firebaseapp.com",
            databaseURL: "https://step-collaborative-code-editor.firebaseio.com"
        };
        firebase.initializeApp(config);

        //// Get Firebase Database reference.
        var firepadRef = getExampleRef()

        //// Create Firepad.
        var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror)
      }

      function changeTheme() {
        var input = document.getElementById("selectTheme")
        var theme = input.options[input.selectedIndex].textContent
        codeMirror.setOption("theme", theme)
      }

      function changeLanguage() {
        var input = document.getElementById("selectLang")
        var lang = input.options[input.selectedIndex].textContent
        codeMirror.setOption("mode", lang)
      }

      // Helper to get hash from end of URL or generate a random one.
      function getExampleRef() {
        var ref = firebase.database().ref()
        var hash = window.location.hash.replace(/#/g, "")
        if (hash) {
          ref = ref.child(hash)
        } else {
          ref = ref.push() // generate unique location.
          window.location = window.location + "#" + ref.key // add it as a hash to the URL.
        }
        if (typeof console !== "undefined") {
          console.log("Firebase data: ", ref.toString())
        }
        return ref
      }
    </script>
  </body>
</html>
