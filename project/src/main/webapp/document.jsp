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
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.42.2/mode/clike/clike.min.js"></script>
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
    <script src="closebrackets.js"></script>
    <script src="matchbrackets.js"></script>
    <script type="module" src="./components/comment-component.js"></script>
    <script type="module" src="./components/document/versioning-component.js"></script>
    <script type="module" src="./components/document/directory-component.js"></script>
    <script src="script.js"></script>
  </head>

  <body onload="init(); getHash(); restrict(); initVersioning(); initDirectory(); setTimeout(function(){ loadComments() }, 2000)">
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
        <button class="white-btn" onclick="comment()"> Comment </button>
        <a href="/user-home.jsp"><button class="primary-blue-btn" id="demo-button"> Return home </button></a>
        <button class="white-btn" onclick="download()"> <i class="fa fa-download" aria-hidden="true"></i> </button>
      </div>
    </div>
    <div class="toolbar">
      <button onclick="toggleElement('directory-component')">Directory</button>
      <toolbar-component onclick="changeTheme()"></toolbar-component>
      <button class="version-btn" onclick="toggleElement('versioning-component')">Versioning</button>
    </div>
    <div class="modal full-width full-height" id="share-modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Share</p>
          <button class="delete" aria-label="close" onclick="hideElement('share-modal')" />
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
    <div class="bottom-container">
      <directory-component></directory-component>
      <div id="comment-container" class="comment-container"></div>
      <div id="firepad-container"></div>
      <versioning-component></versioning-component>
    </div>
    
    <script>
      //Map holding file types of different languages
      var extDict = {
        "Python": "py",
        "Javascript": "js",
        "text/x-java": "java",
        "text/x-c++src": "cpp",
        "Go": "go"
      };

      var codeMirror = CodeMirror(document.getElementById("firepad-container"), {
        lineNumbers: true,
        matchBrackets: true,
        indentWithTabs: true,
        autoCloseBrackets: true,
        mode: "<%= document.getLanguage().toLowerCase() %>",
        theme: "neo",
      })
      var firepad;

      function init() {
        fetch('./api-key.json')
          .then(response => response.json())
          .then(config => { 
            if (firebase.apps.length === 0) {
              firebase.initializeApp(config);
            }
            var firepadRef = getRef();
            codeMirror.setValue('');
            firepad = Firepad.fromCodeMirror(firepadRef, codeMirror);
            initVersioning();
            registerComment();
          });
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
          if(xhttp.readyState == 4 && xhttp.status == 200) {
            document.getElementById("share-response").innerHTML = this.responseText;
          }
        }
        xhttp.send(formData);
        return false;
      }

      // Downloads current doument
      function download() {
        var text = firepad.getText();

        var contentType = 'application/octet-stream';
        var a = document.createElement('a');
        var blob = new Blob([text], {'type':contentType});
        a.href = window.URL.createObjectURL(blob);
        a.download = '<%= document.getName() %>' + "." + extDict["<%= document.getLanguage() %>"];
        a.click();
      }

      //Create comment
      function comment() {
        var date = new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }).format(new Date());
  
        var startPos = codeMirror.getCursor(true);
        var endPos = codeMirror.getCursor(false);
        endPos.ch += 1;

        for(var i = 0; i < codeMirror.getLine(startPos.line).length; i++)  {
          if(codeMirror.getLine(startPos.line).charCodeAt(i) > 255) {
            //deal with multiple comments on same line
            return;
          }
        }

        for(var i = 0; i < codeMirror.getLine(endPos.line).length; i++)  {
          if(codeMirror.getLine(endPos.line).charCodeAt(i) > 255) {
            //deal with multiple comments on same line
            return;
          }
        }

        // Create comment getElementsByName
        document.getElementById('comment-container').innerHTML += '<comment-component name="<%= user.getNickname() %>" hash="<%= (String)request.getAttribute("documentHash") %>" date="' + date + '"></comment-component>';
        document.querySelector('comment-component').firepad = firepad;
        document.querySelector('comment-component').codeMirror = codeMirror;
      }

      // When a comment is submitted, pass the data to the Comment servlet
      function subComment() {
        var formData = new FormData(document.getElementById("comment-form-0"));
        var startPos = codeMirror.getCursor(true);
        var endPos = codeMirror.getCursor(false);
        endPos.ch += 1;

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/Comment", true);
        xhttp.onreadystatechange = function() {
          if(xhttp.readyState == 4 && xhttp.status == 200) {
            codeMirror.setCursor(startPos);
            firepad.insertEntity('comment', { id: this.responseText, pos: "start" });
            codeMirror.setCursor(endPos);
            firepad.insertEntity('comment', { id: this.responseText, pos: "end" });
            loadComments();         
          }
        }
        xhttp.send(formData);
        return false;
      }

      // Generate front end for commenting
      function loadComments() {
        document.getElementById('comment-container').innerHTML = '';
        var widgetElements = document.getElementsByClassName("CodeMirror-widget");
        if(widgetElements.length == 0) { return; }
        var markerList = [];
        var widgetsFound = 0;
        var comments = "";

        // Identify start and end points of comments and associate appropriate data
        for(var lineIndex = 0; lineIndex < codeMirror.lineCount(); lineIndex++) {
          var line = codeMirror.getLine(lineIndex);
          for(var charIndex = 0; charIndex < line.length; charIndex++) {
            if(line.charCodeAt(charIndex) > 255) {
              // Grab the data inside the entity that was created
              var widget = widgetElements[widgetsFound].getElementsByTagName("link")[0];
              markerList.push({line: lineIndex, ch: charIndex, id: widget.getAttribute("data-id"), pos: widget.getAttribute("data-pos")});
              widgetsFound++;
            }
          }
        }

        // Create comment stying then remove special characters
        for(var i = 0; i < markerList.length; i++) {
          if(markerList[i].pos == "end") { continue; }
          var startMarker = markerList[i];
          var endMarker = findEndOfComment(startMarker.id, markerList);

          // Grab characters adjacent to endpoints of comment
          var charAfterLast = codeMirror.getRange({line: endMarker.line, ch: endMarker.ch+1}, {line: endMarker.line, ch: endMarker.ch+2});
          var charBeforeFirst = codeMirror.getRange({line: startMarker.line, ch: startMarker.ch-1}, {line: startMarker.line, ch: startMarker.ch});

          // Add a space before and/or after the comment if there isn't one
          if (charAfterLast != " ") {
            codeMirror.replaceRange(" " + codeMirror.getRange({line: endMarker.line, ch: endMarker.ch+1}, {line: endMarker.line, ch: endMarker.ch+2}), {line: endMarker.line, ch: endMarker.ch+1}, {line: endMarker.line, ch: endMarker.ch+2});
          }
          if (charBeforeFirst != " ") {
            codeMirror.replaceRange(codeMirror.getRange({line: startMarker.line, ch: startMarker.ch-1}, {line: startMarker.line, ch: startMarker.ch}) + " ", {line: startMarker.line, ch: startMarker.ch-1}, {line: startMarker.line, ch: startMarker.ch});
            startMarker.ch++;
            if (startMarker.line == endMarker.line) {
              endMarker.ch++;
            }
          }

          // Highlight the text and give it the id of the associated comment
          codeMirror.markText({line: startMarker.line, ch: startMarker.ch-1}, {line: endMarker.line, ch: endMarker.ch+2}, {className: "comment " + startMarker.id});

          // Make the start and end markers read only so that the user doesn't accidentally delete them
          codeMirror.markText({line: endMarker.line, ch: endMarker.ch}, {line: endMarker.line, ch: endMarker.ch+2}, {className: "comment " + startMarker.id, readOnly: true});
          codeMirror.markText({line: startMarker.line, ch: startMarker.ch-1}, {line: startMarker.line, ch: startMarker.ch+1}, {className: "comment " + startMarker.id, readOnly: true});
        }

        // Load comments themselves
        var hash = "<%= (String)request.getAttribute("documentHash") %>";
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/Comment?documentHash=" + hash, true);
        xhttp.onreadystatechange = function() {
          if(xhttp.readyState == 4 && xhttp.status == 200) {
            //get JSON and loop through to create comment componenets
            var commentList = JSON.parse(this.responseText);
            document.getElementById('comment-container').innerHTML = '';
            for(var i = 0; i < commentList.length; i++) {
              var comment = commentList[i];
              document.getElementById('comment-container').innerHTML += '<comment-component commentID="' + comment.commentID + '" name="'+ comment.userID +'" date="' + comment.date + '" text="'+ comment.data +'" exists="true"></comment-component>';
              document.querySelector('comment-component').firepad = firepad;
              document.querySelector('comment-component').codeMirror = codeMirror;
            }     
          }
        }
        xhttp.send();
      }

      // Finds matching endpoint for comment with given ID
      function findEndOfComment(id, markerList) {
        return markerList.find(marker => {
          return marker.id == id && marker.pos == "end"
        })
      }

      // On comment click
      $(document).on('click','.comment',function(event) {
        // Do real stuff
        var className = event.target.className;
        var classList = className.split(" ");
        var commentID = classList[classList.length - 1].slice(0, -1);
        toggleCommentHighlight(commentID);
      });

      // On click not on comment
       $(document).on('click', "html", function(event) {
          console.log(event.target);
          if($(event.target).closest('.comment').length == 0 && $(event.target).closest('comment-component').length == 0) {
            $('.highlight-comment').removeClass("highlight-comment");
          }
        });

      // Removes an element from the document
      function toggleCommentHighlight(commentID) {
        console.log(commentID);
        $('.highlight-comment').removeClass("highlight-comment");
        var commentDiv = $("[commentid='" + commentID + "']").find(".comment-div");
        commentDiv.addClass("highlight-comment");
        console.log(commentDiv);
      }

      function deleteComment(id) {
        var markerList = codeMirror.getAllMarks();
        markerList.forEach(marker => {
          if(marker.className == ("comment " + id + "\n")) {
            if (marker.readOnly == true) {
              marker.readOnly = false;
              codeMirror.replaceRange(" ", marker.find().from, marker.find().to);
            }
            marker.clear();
          }
        });

        var hash = "<%= (String)request.getAttribute("documentHash") %>";
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "/DeleteComment?commentID=" + id + "&documentHash=" + hash, true);
        xhttp.onreadystatechange = function() {
          if(xhttp.readyState == 4 && xhttp.status == 200) {
            loadComments();
          }
        }
        xhttp.send(); 
      }

      // Register comment entity
      function registerComment() {
        var attrs = ['id', 'pos'];
        firepad.registerEntity('comment', {
          render: function(info) {
            var attrs = ['id', 'pos'];
            var html = '<link ';
            for(var i = 0; i < attrs.length; i++) {
              var attr = attrs[i];
              if (attr in info) {
                html += ' data-' + attr + '="' + info[attr] + '"';
              }
            }
            html += ">";
            return html;
          },
          fromElement: function(element) {
            var info = {};
            for(var i = 0; i < attrs.length; i++) {
              var attr = attrs[i];
              if (element.hasAttribute(attr)) {
                info[attr] = element.getAttribute(attr);
              }
            }
            return info;
          }
        });
      }

      /* Versioning Functions */
      let groupedRevisions = [];
      let revisionsMap = new Map();
      let commits = [];
      let versioningComponent = document.querySelector('versioning-component');
      async function initVersioning() {
        await getRevisions();
        await getCommits();
        versioningComponent.firepad = firepad;
        versioningComponent.codeMirror = codeMirror;
        versioningComponent.groupedRevisions = groupedRevisions;
        versioningComponent.revisionsMap = revisionsMap;
        versioningComponent.commits = commits;
        versioningComponent.addEventListener('close', function() { hideElement('versioning-component'); });
        versioningComponent.addEventListener('temp', function() { hideElement('versioning-component'); init(); });
      }

      async function getRevisions() {
        const firepadRef = getRef();
        firepadRef.child('history').on('child_added', (snapshot) => {
          addRevision(snapshot.key, snapshot.val());
        });
        return groupedRevisions;
      }

      const intervalMinutes = 30;
      const minutesToMilliseconds = 60000;
      const interval = intervalMinutes * minutesToMilliseconds;
      var earliestTime = -Infinity;
      var groupCounter = 0; 
      function addRevision(hash, value) {
        value.group = groupCounter;
        revisionsMap.set(hash, value);
        if (value.t - earliestTime > interval) {
          const newRevisionGroup = {"hash": hash, "timestamp": value.t};
          groupedRevisions.unshift(newRevisionGroup);
          groupCounter += 1;
          earliestTime = value.t;
          revisionsMap.set(hash, value);
        } else {
          const prevRevisionGroup = groupedRevisions[0];
          prevRevisionGroup.hash = hash;
        }
        versioningComponent.groupedRevisions = groupedRevisions;
        versioningComponent.revisionsMap = revisionsMap;
        versioningComponent.requestUpdate();
      }

      async function getCommits() {
        const firepadRef = getRef();
        firepadRef.child('commit').on('child_added', (snapshot) => {
          addCommit(snapshot.key, snapshot.val());
        });
        return commits;
      }

      function addCommit(hash, value) {
        value.hash = hash;
        commits.unshift(value);
        versioningComponent.commits = commits;
        versioningComponent.requestUpdate();
      }

      // Render documents in the same

      function initDirectory() {
        fetch('/Folder?folderID=' + '<%= document.getFolderID() %>').then((response) => response.json()).then((foldersData) => {
          let folders = {};
          try {
            folders = JSON.parse(foldersData.folders);
          } catch(err) {
            folders = JSON.parse(JSON.stringify(foldersData.folders));
          }
          folders = new Map(Object.entries(folders));
          document.querySelector('directory-component').folders = folders;
          document.querySelector('directory-component').folderID = foldersData.folderID;
          document.querySelector('directory-component').docHash = '<%= document.getHash() %>';
        });
      } 
    </script>
  </body>
</html>