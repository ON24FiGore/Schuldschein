document.addEventListener("DOMContentLoaded", function () {
    var createGroupBtn = document.getElementById("createGroup");
    var groupList = document.getElementById("groupList");

    var groups = [];
    var currentGroup = null;
    var expenses = [];

   
    var modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = "\n      <div class=\"modal-content\">\n        <h3>Neue Gruppe erstellen</h3>\n        <input id=\"modalGroupName\" type=\"text\" placeholder=\"Gruppenname\">\n        <textarea id=\"modalMembers\" placeholder=\"Mitglieder (durch Komma getrennt)\"></textarea>\n        <div class=\"modal-buttons\">\n          <button id=\"modalCreate\">Erstellen</button>\n          <button id=\"modalCancel\">Abbrechen</button>\n        </div>\n      </div>\n    ";
    document.body.appendChild(modal);
});