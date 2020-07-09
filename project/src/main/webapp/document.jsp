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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css" />
    <script src="https://firepad.io/releases/v1.5.9/firepad.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css" />
    <link rel="stylesheet" href="main.css" />
    <script type="module" src="./components/toolbar-component.js"></script>
    <script type="module" src="./components/share-component.js"></script>
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
        border: 1px solid white;
        font-family: roboto;
        font-size: 30px;
        font-weight: bold;
        padding-left: 20px;
        padding-top: 5px;
      }

      /* the toolbar with operations */
      .toolbar {
        height: 33px;
        padding: 5px;
        background: white;
        border: 1px solid white;
        padding-left: 20px;
      }

      .btn-group {
        float: right;
        display: flex;
        justify-content: space-between;
        width: 215px;
        margin-right: 25px;
        margin-top: 5px
      }

      a {
        margin-top: -10px;
      }

      .permissions {
          position: absolute;
          right : 60px;
          top : 84px;
      }
    </style>
  </head>

  <body onload="init(); getHash(); restrict()">
    <div class="header">
      <% User user = null;
         Document document = null;
        if (session.getAttribute("userID") != null) {
            user = Database.getUserByID((long) session.getAttribute("userID"));
            document = Database.getDocumentByHash((String)request.getAttribute("documentHash")); %>
            <%= document.getName() %>
        <% } else {
          response.sendRedirect("/");  
        } %>
        <div class="btn-group">
          <button class="white-btn" onclick="showModal()"> Share </button>
          <a href="/user-home.jsp"><button class="primary-blue-btn" id="demo-button"> Return home </button></a>
          <button class="white-btn" onclick="download()"> <i class="fa fa-download" aria-hidden="true"></i> </button>
        </div>
    </div>
    <div class="toolbar">
      <toolbar-component onclick="changeTheme()"></toolbar-component>
    </div>
    <div class="modal full-width full-height" id="share-modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Share</p>
          <button class="delete" aria-label="close" onClick="hideModal()" />
        </header>
        <section class="modal-card-body">
          <form id="share-form" onsubmit="return share()">
            <label for="email">Share with email:</label>
            <input type="email" id="email" name="email"> 
            <share-component></share-component>
            <input type="submit">
            <input type="hidden" id="documentHash" name="documentHash" value="<%= (String)request.getAttribute("documentHash") %>">
            <p style="color: red" id="share-response"></p>
          </form>
        </section>
      </div>
    </div>
    <div id="firepad-container"></div>

    <script>
      //Map holding file types of different languages
      var extDict = {
        "Python": "py",
        "Javascript": "js",
        "Java": "java",
        "C++": "cpp",
        "Go": "go"
      };

      var codeMirror = CodeMirror(document.getElementById("firepad-container"), {
        lineNumbers: true,
        mode: "<%= document.getLanguage().toLowerCase() %>",
        theme: "neo",
      })
      var firepad;

      function showModal() {
        let modal = document.getElementById("share-modal");
        modal.className = "modal is-active";
      }

      function hideModal() {
        let modal = document.getElementById("share-modal");
        modal.className = "modal";
      }

      function init() {
        //// Initialize Firebase.
        var config = {
            apiKey: 'AIzaSyDUYns7b2bTK3Go4dvT0slDcUchEtYlSWc',
            authDomain: "step-collaborative-code-editor.firebaseapp.com",
            databaseURL: "https://step-collaborative-code-editor.firebaseio.com"
        };
        firebase.initializeApp(config);

        //// Get Firebase Database reference.
        var firepadRef = getRef()
        firepad = Firepad.fromCodeMirror(firepadRef, codeMirror)
      }

      function restrict() {
        <%if (document.getViewerIDs().contains(user.getUserID())) {
                %>
                  document.getElementById("firepad-container").style.pointerEvents = "none";
                  document.getElementById("share_btn").style.visibility = "hidden";
                <%
            }%>
      }

      function changeTheme() {
        var input = document.getElementsByName('theme_change')[1].value;
        codeMirror.setOption("theme", input)
      }

      // Helper to get hash from end of URL or generate a random one.
      function getRef() {
        var ref = firebase.database().ref()
        var hash = "<%= (String)request.getAttribute("documentHash") %>"
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

      //Get hash of current document
      function getHash() {
        return window.location.hash.substr(2);
      }

      //Shares document with email from share-form
      function share() {
        var formData = new FormData(document.getElementById("share-form"));
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/Share", true);
        xhttp.onreadystatechange = function() {
          document.getElementById("share-response").innerHTML = this.responseText;
        }
        xhttp.send(formData);
        return false;
      }

      //Downloads current doument
      function download() {
        var text = firepad.getText();

        console.log(codeMirror.getOption("mode"));

        var contentType = 'application/octet-stream';
        var a = document.createElement('a');
        var blob = new Blob([text], {'type':contentType});
        a.href = window.URL.createObjectURL(blob);
        a.download = '<%= document.getName() %>' + "." + extDict["<%= document.getLanguage() %>"];
        a.click();
      }

      //get firepad html
      func getFirepadHTML() {
        console.log(firepad.getHtml());
      }
    </script>
  </body>
</html>