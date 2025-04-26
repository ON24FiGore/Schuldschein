document.addEventListener("DOMContentLoaded", function () {
    var createGroupBtn = document.getElementById("createGroup");
    var groupList = document.getElementById("groupList");
    var personSelect = document.getElementById("personSelect");
    var expenseForm = document.getElementById("expenseForm");
    var expenseList = document.getElementById("expenseList");
    var summaryList = document.getElementById("summaryList");
  
    var groups = [];
    var currentGroup = null;
    var expenses = [];

    var modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Neue Gruppe erstellen</h3>
      <input id="modalGroupName" type="text" placeholder="Gruppenname">
      <textarea id="modalMembers" placeholder="Mitglieder (durch Komma getrennt)"></textarea>
      <div class="modal-buttons">
        <button id="modalCreate">Erstellen</button>
        <button id="modalCancel">Abbrechen</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  });